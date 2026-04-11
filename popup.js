// popup.js
const setupView = document.getElementById('setupView');
const recordingView = document.getElementById('recordingView');
const viewCapture = document.getElementById('viewCapture');
const viewRecord = document.getElementById('viewRecord');

// Element selectors
const tabRecord = document.getElementById('tabRecord');
const tabCapture = document.getElementById('tabCapture');

// Check for a pending save result (set by background when offscreen completes a Capture Area save).
// If present, show the "Saved!" done state briefly and close — no toast needed.
chrome.storage.session.get('pendingCaptureResult', (result) => {
  if (result && result.pendingCaptureResult === 'done') {
    chrome.storage.session.remove('pendingCaptureResult');
    setupView.classList.add('hidden');
    document.getElementById('capturingView').classList.remove('hidden');
    updateCaptureProgress({ phase: 'done' });
    setTimeout(() => window.close(), 1200);
    return; // skip normal init
  }

  // Initialize State
  chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
    if (response && response.isRecording) {
      showStopView();
    } else {
      showSetupView();
    }
  });
});

// Tab Switching
function switchTab(toView) {
  if (toView === 'record') {
    tabRecord.classList.add('active');
    tabCapture.classList.remove('active');
    viewRecord.classList.add('active');
    viewCapture.classList.remove('active');
  } else {
    tabCapture.classList.add('active');
    tabRecord.classList.remove('active');
    viewCapture.classList.add('active');
    viewRecord.classList.remove('active');
  }
}

if (tabRecord && tabCapture) {
  tabRecord.addEventListener('click', () => switchTab('record'));
  tabCapture.addEventListener('click', () => switchTab('capture'));
}

// Recording tab settings load (capture settings moved to settings.html)
chrome.storage.local.get(['showTimer', 'recordScreen', 'timerPosition', 'showClicks'], (result) => {
  if (document.getElementById('showTimer')) document.getElementById('showTimer').checked = result.showTimer !== false;
  if (document.getElementById('recordScreen')) document.getElementById('recordScreen').checked = result.recordScreen !== false;
  if (document.getElementById('timerPosition')) document.getElementById('timerPosition').value = result.timerPosition || 'bottom-center';
  if (document.getElementById('showClicks')) document.getElementById('showClicks').checked = result.showClicks !== false;
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const key = e.key.toLowerCase();
  
  // Try to cleanly click the visible buttons based on shortcuts
  try {
    if (key === 'r' && !setupView.classList.contains('hidden')) document.getElementById('btnRecordScreen').click();
    
    // Capture Entire Page (E)
    if (key === 'e') {
      const btn = document.getElementById('screenshotBtn');
      if (btn) btn.dispatchEvent(new MouseEvent('click', { shiftKey: e.shiftKey }));
    }
    // Capture Visible (V)
    if (key === 'v') document.getElementById('clipboardBtn').dispatchEvent(new MouseEvent('click', { shiftKey: e.shiftKey }));
    // Capture Area (A)
    if (key === 'a') document.getElementById('annotateBtn').click();
  } catch(e) {}
});

// Ensure content script is loaded in the tab. If not, inject content.js and wait briefly.
async function ensureContentScript(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'PING' }, (response) => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript(
          { target: { tabId }, files: ['content.js'] },
          () => {
            const _ignored = chrome.runtime.lastError;
            setTimeout(() => resolve(true), 80);
          }
        );
      } else {
        resolve(true);
      }
    });
  });
}

// Obtain FSA handle with 'granted' permission while user activation is fresh.
async function getGrantedFSAHandle() {
  try {
    const handle = await getHandle().catch(() => null);
    console.log('[TRP popup] getGrantedFSAHandle: handle=', handle ? handle.name : 'null');
    if (!handle) return null;
    let perm = await handle.queryPermission({ mode: "readwrite" });
    console.log('[TRP popup] queryPermission result:', perm);
    if (perm !== 'granted') {
      perm = await handle.requestPermission({ mode: "readwrite" }).catch((e) => { console.warn('[TRP popup] requestPermission threw:', e); return 'denied'; });
      console.log('[TRP popup] requestPermission result:', perm);
    }
    return perm === 'granted' ? handle : null;
  } catch (e) { console.warn('[TRP popup] getGrantedFSAHandle error:', e); return null; }
}

// Read/write blob directly against the extension-origin IDB Screenshots store.
async function getScreenshotBlob(key) {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction('Screenshots', 'readonly');
    let req = tx.objectStore('Screenshots').get(key);
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
}
async function deleteScreenshotBlob(key) {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction('Screenshots', 'readwrite');
    tx.objectStore('Screenshots').delete(key);
    tx.oncomplete = r;
    tx.onerror = () => j(tx.error);
  });
}
async function writeFSAFromBlob(handle, blob, filename) {
  console.log('[TRP popup] writeFSAFromBlob handle=', handle.name, 'filename=', filename, 'size=', blob.size);
  try {
    let parts = filename.split('/');
    const leaf = parts.pop();
    let dir = handle;
    for (const p of parts) dir = await dir.getDirectoryHandle(p, { create: true });
    const fileHandle = await dir.getFileHandle(leaf, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    console.log('[TRP popup] writeFSAFromBlob SUCCESS');
    return true;
  } catch (err) {
    console.warn('[TRP popup] writeFSAFromBlob FAILED:', err);
    return false;
  }
}

// Write a data URL directly to an FSA handle (permission must already be 'granted').
async function writeFSA(handle, dataUrl, filename) {
  console.log('[TRP popup] writeFSA: handle=', handle.name, 'filename=', filename, 'dataUrl length=', dataUrl.length);
  try {
    let parts = filename.split('/');
    const leaf = parts.pop();
    let dir = handle;
    for (const p of parts) {
      console.log('[TRP popup] writeFSA: creating subdir', p);
      dir = await dir.getDirectoryHandle(p, { create: true });
    }
    console.log('[TRP popup] writeFSA: creating file', leaf);
    const fileHandle = await dir.getFileHandle(leaf, { create: true });
    const writable = await fileHandle.createWritable();
    const blob = await (await fetch(dataUrl)).blob();
    console.log('[TRP popup] writeFSA: writing blob size=', blob.size);
    await writable.write(blob);
    await writable.close();
    console.log('[TRP popup] writeFSA: SUCCESS');
    return true;
  } catch (err) {
    console.warn('[TRP popup] writeFSA FAILED:', err);
    return false;
  }
}

// Copy Window / viewport capture
async function triggerScreenshotFromPopup(intent) {
  console.log('[TRP popup v2] triggerScreenshotFromPopup intent=', intent);
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab) return;

  await ensureContentScript(tab.id);

  // Show progress view immediately
  document.getElementById('setupView').classList.add('hidden');
  document.getElementById('capturingView').classList.remove('hidden');
  updateCaptureProgress({ phase: 'visible' });

  // Obtain FSA permission NOW while user activation is still valid (< 5s from click).
  let fsaHandle = null;
  if (intent === 'save' || intent === 'both') {
    fsaHandle = await getGrantedFSAHandle();
    console.log('[TRP popup] fsaHandle after getGrantedFSAHandle:', fsaHandle ? fsaHandle.name : 'null');
  }

  if (intent) {
    chrome.tabs.sendMessage(tab.id, { action: "GET_CROP_AND_HIDE_UI" }, (response) => {
      const _ignored = chrome.runtime.lastError;
      setTimeout(() => {
        chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, async (dataUrl) => {
          if (chrome.runtime.lastError || !dataUrl) {
            chrome.tabs.sendMessage(tab.id, { action: "RESTORE_UI" }).catch(() => {});
            window.close();
            return;
          }

          if (response && response.cropRect) {
            dataUrl = await cropImageLocal(dataUrl, response.cropRect, response.innerWidth);
          }

          dataUrl = await applyBrandingToImage(dataUrl, tab);

          if (intent === 'copy' || intent === 'both') {
            updateCaptureProgress({ phase: 'copying' });
            try {
              const res = await fetch(dataUrl);
              const blob = await res.blob();
              await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
            } catch (err) { console.error("Clipboard failed", err); }
          }

          if (intent === 'save' || intent === 'both') {
            updateCaptureProgress({ phase: 'saving' });
            const filename = await generateFilename(tab);
            console.log('[TRP popup] save path: fsaHandle=', fsaHandle ? fsaHandle.name : 'null', 'filename=', filename);
            if (fsaHandle) {
              const ok = await writeFSA(fsaHandle, dataUrl, filename);
              if (!ok) {
                console.log('[TRP popup] writeFSA failed, falling back to DOWNLOAD_FILE');
                chrome.runtime.sendMessage({ action: "DOWNLOAD_FILE", dataUrl, filename });
              }
            } else {
              console.log('[TRP popup] no fsaHandle, sending DOWNLOAD_FILE to background');
              chrome.runtime.sendMessage({ action: "DOWNLOAD_FILE", dataUrl, filename });
            }
          }

          updateCaptureProgress({ phase: 'done' });
          chrome.tabs.sendMessage(tab.id, { action: "RESTORE_UI" }).catch(() => {});
          await new Promise(r => setTimeout(r, 600));
          window.close();
        });
      }, 100);
    });
  } else {
    chrome.tabs.sendMessage(tab.id, { action: "TRIGGER_SCREENSHOT" });
    window.close();
  }
}


function cropImageLocal(dataUrl, rect, tabWidth) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = tabWidth ? (img.width / tabWidth) : 1;
      const cvs = document.createElement('canvas');
      let x = rect.x, y = rect.y, w = rect.w, h = rect.h;
      if (w < 0) { x += w; w = Math.abs(w); }
      if (h < 0) { y += h; h = Math.abs(h); }
      if (x < 0) x = 0; if (y < 0) y = 0;
      const sx = x * ratio, sy = y * ratio, sw = w * ratio, sh = h * ratio;
      cvs.width = sw; cvs.height = sh;
      cvs.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(cvs.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

// Ask background to ensure the offscreen document exists BEFORE we call
// requestPermission in popup. Permission propagates to already-live contexts;
// a newly-created offscreen created AFTER the grant won't inherit it.
async function ensureOffscreenExists() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action: "ENSURE_OFFSCREEN" }, () => {
      const _ignored = chrome.runtime.lastError;
      resolve();
    });
  });
}

// Annotation — grant FSA permission early, then close popup
async function triggerAnnotateFromPopup() {
  console.log('[TRP popup v2] triggerAnnotateFromPopup');
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab) {
    await ensureContentScript(tab.id);
    await ensureOffscreenExists();          // offscreen must exist before we grant permission
    const h = await getGrantedFSAHandle();  // permission propagates to existing offscreen
    console.log('[TRP popup] annotate: fsaHandle after grant=', h ? h.name : 'null');
    chrome.tabs.sendMessage(tab.id, { action: "START_CROP_MODE" });
    window.close();
  }
}

// Update the capturing progress UI. Called both from full-page capture (via runtime messages)
// and from capture-visible (directly in popup).
function updateCaptureProgress({ phase, current = 0, total = 0 }) {
  const label = document.getElementById('capturePhaseLabel');
  const detail = document.getElementById('capturePhaseDetail');
  const fill = document.getElementById('captureProgressFill');
  const wrap = document.getElementById('captureProgressWrap');
  if (!label) return;

  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  if (phase === 'capturing') {
    label.textContent = 'Capturing frames...';
    detail.textContent = total > 1 ? `Frame ${current} of ${total}` : '';
    wrap.style.display = 'block';
    fill.style.width = pct + '%';
  } else if (phase === 'stitching') {
    label.textContent = 'Stitching image...';
    detail.textContent = total > 0 ? `${current} of ${total} frames loaded` : '';
    wrap.style.display = 'block';
    fill.style.width = pct + '%';
  } else if (phase === 'saving') {
    label.textContent = 'Saving...';
    detail.textContent = 'Writing to folder';
    wrap.style.display = 'none';
  } else if (phase === 'done') {
    label.textContent = 'Saved!';
    detail.textContent = '';
    wrap.style.display = 'none';
  } else if (phase === 'copying') {
    label.textContent = 'Copying to clipboard...';
    detail.textContent = '';
    wrap.style.display = 'none';
  } else if (phase === 'visible') {
    label.textContent = 'Capturing visible area...';
    detail.textContent = '';
    wrap.style.display = 'none';
  }
}

// Full Tab Capture — for save intent, keep popup alive so it can write via FSA directly.
// FSA permission is per-document in Chrome; the popup is the only context with permission.
async function triggerFullTabCapture(intent) {
  console.log('[TRP popup v2] triggerFullTabCapture intent=', intent);
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab) return;

  await ensureContentScript(tab.id);

  const needsSave = (intent === 'save' || intent === 'both');
  const fsaHandle = needsSave ? await getGrantedFSAHandle() : null;
  console.log('[TRP popup] fullTab: fsaHandle=', fsaHandle ? fsaHandle.name : 'null');

  if (needsSave && fsaHandle) {
    // Keep popup alive — show progress UI
    document.getElementById('setupView').classList.add('hidden');
    document.getElementById('capturingView').classList.remove('hidden');
    updateCaptureProgress({ phase: 'capturing', current: 0, total: 1 });

    // Forward CAPTURE_PROGRESS messages from content script to the UI
    function onProgress(msg) {
      if (msg.type === 'CAPTURE_PROGRESS') updateCaptureProgress(msg);
    }
    chrome.runtime.onMessage.addListener(onProgress);

    // Listen for background signalling that the blob is ready in IDB
    chrome.runtime.onMessage.addListener(function onCaptureReady(msg, sender, sendResponse) {
      if (msg.type !== 'FULL_PAGE_CAPTURE_READY') return;
      chrome.runtime.onMessage.removeListener(onCaptureReady);
      chrome.runtime.onMessage.removeListener(onProgress);
      // Tell background synchronously that popup is handling it (prevents fallback)
      sendResponse({ handled: true });

      (async () => {
        updateCaptureProgress({ phase: 'saving' });
        const blob = await getScreenshotBlob(msg.key).catch(() => null);
        if (blob) {
          const ok = await writeFSAFromBlob(fsaHandle, blob, msg.filename);
          if (ok) {
            await deleteScreenshotBlob(msg.key).catch(() => {});
            updateCaptureProgress({ phase: 'done' });
            await new Promise(r => setTimeout(r, 600));
          } else {
            // Blob stays in IDB; tell background to fall back to Downloads
            chrome.runtime.sendMessage({ action: 'SAVE_SCREENSHOT_FALLBACK', key: msg.key, filename: msg.filename, tabId: tab.id });
          }
        }
        window.close();
      })();
    });

    chrome.tabs.sendMessage(tab.id, { action: "CAPTURE_FULL_PAGE", intent });
    // Do NOT close popup — it stays alive until onCaptureReady fires
  } else {
    // Copy-only or no FSA handle: close popup immediately, offscreen handles any save
    if (needsSave) await ensureOffscreenExists();
    chrome.tabs.sendMessage(tab.id, { action: "CAPTURE_FULL_PAGE", intent });
    window.close();
  }
}

function showSetupView() {
  setupView.classList.remove('hidden');
  recordingView.classList.add('hidden');
}

function showStopView() {
  setupView.classList.add('hidden');
  recordingView.classList.remove('hidden');
}

async function getActionIntent(e) {
  return new Promise(resolve => {
    chrome.storage.local.get(['captureDefault'], (result) => {
      const mode = result.captureDefault || 'both';
      if (e.shiftKey) {
        resolve(mode === 'both' ? 'save' : (mode === 'copy' ? 'save' : 'copy'));
      } else {
        resolve(mode);
      }
    });
  });
}

// Filename Parser Helper
async function generateFilename(tab) {
  return new Promise(resolve => {
    chrome.storage.local.get(['saveFileFormat'], (result) => {
      let format = result.saveFileFormat || '{{domain}}/{{timestamp}}-{{tab.title}}.png';
      
      const d = new Date();
      const timestamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`;
      
      let url = (tab && tab.url ? tab.url : "unknown_url").substring(0, 50);
      let title = (tab && tab.title ? tab.title : "unknown_title").substring(0, 50);
      let domain = "unknown_domain";
      try { domain = new URL(tab.url).hostname; } catch(e) {}

      // Sanitize specifically, removing special chars to avoid corrupt paths
      // Note: We MUST ALLOW forward-slashes un-escaped to enable local directory creation
      const sanitize = (str) => str.replace(/[^a-zA-Z0-9.\-_]/g, '_').substring(0, 80);
      
      format = format.replace(/{{\s*timestamp\s*}}/g, sanitize(timestamp));
      format = format.replace(/{{\s*domain\s*}}/g, sanitize(domain));
      format = format.replace(/{{\s*tab\.title\s*}}/g, sanitize(title));
      format = format.replace(/{{\s*tab\.url\s*}}/g, sanitize(url));
      
      // Clean up leading slashes which crash chrome.downloads
      format = format.replace(/^\/+/, '');
      
      if (!format.toLowerCase().endsWith('.png')) format += '.png';
      
      resolve(format);
    });
  });
}

function resolveTokens(str, tab) {
  const d = new Date();
  const timestamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`;
  let url = tab && tab.url ? tab.url : "unknown";
  let title = tab && tab.title ? tab.title : "Screenshot";
  let domain = "unknown";
  try { domain = new URL(url).hostname; } catch(e) {}
  
  let res = str.replace(/{{\s*timestamp\s*}}/g, timestamp);
  res = res.replace(/{{\s*domain\s*}}/g, domain);
  res = res.replace(/{{\s*tab\.title\s*}}/g, title);
  res = res.replace(/{{\s*tab\.url\s*}}/g, url);
  return res;
}

async function applyBrandingToImage(dataUrl, tab) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['enableCaption', 'captionText', 'captionPos', 'enableWatermark', 'watermarkText'], async (settings) => {
      if (!settings.enableCaption && !settings.enableWatermark) return resolve(dataUrl);

      const resolvedCaption = resolveTokens(settings.captionText || 'Captured from {{domain}}', tab);
      const resolvedWatermark = resolveTokens(settings.watermarkText || 'CONFIDENTIAL', tab);

      const img = new Image();
      img.onload = () => {
        let finalWidth = img.width;
        let finalHeight = img.height;
        let imgY = 0;
        const CAPTION_HEIGHT = 60;

        if (settings.enableCaption && resolvedCaption) {
          finalHeight += CAPTION_HEIGHT;
          if (settings.captionPos === 'top') imgY = CAPTION_HEIGHT;
        }

        const cvs = document.createElement('canvas');
        cvs.width = finalWidth;
        cvs.height = finalHeight;
        const ctx = cvs.getContext('2d');

        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, finalWidth, finalHeight);
        ctx.drawImage(img, 0, imgY);

        if (settings.enableCaption && resolvedCaption) {
          ctx.fillStyle = '#F9FAFB';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const textY = settings.captionPos === 'top' ? (CAPTION_HEIGHT / 2) : (finalHeight - CAPTION_HEIGHT / 2);
          ctx.fillText(resolvedCaption, finalWidth / 2, textY);
        }

        if (settings.enableWatermark && resolvedWatermark) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.font = 'bold 72px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.save();
          ctx.translate(finalWidth / 2, imgY + img.height / 2);
          ctx.rotate(-Math.PI / 6); // -30 deg
          ctx.fillText(resolvedWatermark, 0, 0);
          ctx.restore();
        }

        resolve(cvs.toDataURL('image/png'));
      };
      img.src = dataUrl;
    });
  });
}

const DB_NAME = "TabRecorderDB";
const STORE_NAME = "Handles";
function openDB() {
  return new Promise((r, j) => {
    let req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      if (!db.objectStoreNames.contains('Screenshots')) db.createObjectStore('Screenshots');
    };
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
}
async function saveHandle(handle) {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(handle, "saveDirectory");
    tx.oncomplete = r;
    tx.onerror = () => j(tx.error);
  });
}
async function getHandle() {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction(STORE_NAME, "readonly");
    let req = tx.objectStore(STORE_NAME).get("saveDirectory");
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
}

// Attach Action Listeners
if (document.getElementById('annotateBtn')) {
  document.getElementById('annotateBtn').addEventListener('click', triggerAnnotateFromPopup);
}
if (document.getElementById('screenshotBtn')) {
  document.getElementById('screenshotBtn').addEventListener('click', async (e) => triggerFullTabCapture(await getActionIntent(e)));
}
if (document.getElementById('clipboardBtn')) {
  document.getElementById('clipboardBtn').addEventListener('click', async (e) => triggerScreenshotFromPopup(await getActionIntent(e)));
}

// Start Recording
if (document.getElementById('btnRecordScreen')) {
  document.getElementById('btnRecordScreen').addEventListener('click', async () => {
    const showTimer = document.getElementById('showTimer');
    const recordScreen = document.getElementById('recordScreen');
    const timerPosition = document.getElementById('timerPosition');
    const showClicks = document.getElementById('showClicks');
    
    const options = {
      showTimer: showTimer ? showTimer.checked : true,
      recordScreen: recordScreen ? recordScreen.checked : true,
      timerPosition: timerPosition ? timerPosition.value : 'bottom-center',
      showClicks: showClicks ? showClicks.checked : false
    };

    chrome.storage.local.set(options);

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    try {
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "ARM_TIMER",
          options: options
        });
        window.close();
      }
    } catch (err) {
      if (tab) {
        await chrome.scripting.executeScript({ target: {tabId: tab.id}, files: ['content.js'] });
        await chrome.tabs.sendMessage(tab.id, { 
            action: "ARM_TIMER", 
            options: options
        });
        window.close();
      }
    }
  });
}

if (document.getElementById('stopBtn')) {
  document.getElementById('stopBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "STOP_RECORDING" });
    window.close();
  });
}

// Footer Nav Actions
if (document.getElementById('navMerge')) {
  document.getElementById('navMerge').addEventListener('click', () => {
    chrome.tabs.create({ url: 'merger.html' });
  });
}
if (document.getElementById('settingsBtn')) {
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'settings.html' });
  });
}