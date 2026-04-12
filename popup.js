// popup.js
const setupView = document.getElementById('setupView');
const recordingView = document.getElementById('recordingView');
const viewCapture = document.getElementById('viewCapture');
const viewRecord = document.getElementById('viewRecord');

// Element selectors
const tabRecord = document.getElementById('tabRecord');
const tabCapture = document.getElementById('tabCapture');

function showCapturingView() {
  setupView.classList.add('hidden');
  document.querySelector('.bottom-nav').classList.add('hidden');
  document.getElementById('capturingView').classList.remove('hidden');
}

// Check for a pending save result (set by background when offscreen completes a Capture Area save).
// If present, show the "Saved!" done state briefly and close — no toast needed.
chrome.storage.session.get('pendingCaptureResult', (result) => {
  if (result && result.pendingCaptureResult === 'done') {
    chrome.storage.session.remove('pendingCaptureResult');
    showCapturingView();
    updateCaptureProgress({ phase: 'done' });
    setTimeout(() => window.close(), 1200);
    return; // skip normal init
  }
  if (result && result.pendingCaptureResult === 'copied') {
    chrome.storage.session.remove('pendingCaptureResult');
    showCapturingView();
    updateCaptureProgress({ phase: 'copied' });
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
    // R: Capture Region (capture tab) or Start Recording (record tab)
    if (key === 'r') {
      if (viewCapture && viewCapture.classList.contains('active')) {
        document.getElementById('captureRegionBtn').dispatchEvent(new MouseEvent('click', { shiftKey: e.shiftKey }));
      } else {
        document.getElementById('btnRecordScreen').click();
      }
    }
    // Capture Entire Page (E)
    if (key === 'e') {
      const btn = document.getElementById('screenshotBtn');
      if (btn) btn.dispatchEvent(new MouseEvent('click', { shiftKey: e.shiftKey }));
    }
    // Capture Visible (V)
    if (key === 'v') document.getElementById('clipboardBtn').dispatchEvent(new MouseEvent('click', { shiftKey: e.shiftKey }));
    // Annotate (A)
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
  showCapturingView();
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
      // Apply pre-capture rules (blur/hide) in the content script, then wait for repaint
      chrome.tabs.sendMessage(tab.id, { action: "APPLY_PRE_CAPTURE_RULES" }, () => {
        const _ignored2 = chrome.runtime.lastError;
        setTimeout(() => {
          chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, async (dataUrl) => {
            chrome.tabs.sendMessage(tab.id, { action: "UNDO_PRE_CAPTURE_RULES" }).catch(() => {});
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
        }, 100); // repaint delay after APPLY_PRE_CAPTURE_RULES
      });    // end APPLY_PRE_CAPTURE_RULES callback
    });      // end GET_CROP_AND_HIDE_UI callback
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

// Capture Region — grant FSA permission early, open annotation toolbar with crop tool, close popup
async function triggerAnnotateFromPopup() {
  console.log('[TRP popup v2] triggerAnnotateFromPopup (Capture Region)');
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab) {
    await ensureContentScript(tab.id);
    await ensureOffscreenExists();          // offscreen must exist before we grant permission
    const h = await getGrantedFSAHandle();  // permission propagates to existing offscreen
    console.log('[TRP popup] captureRegion: fsaHandle after grant=', h ? h.name : 'null');
    chrome.tabs.sendMessage(tab.id, { action: "START_CROP_MODE" });
    window.close();
  }
}

// Annotate — open annotation toolbar with drawing tool active (independent of any capture)
async function triggerAnnotateModeFromPopup() {
  console.log('[TRP popup v2] triggerAnnotateModeFromPopup');
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab) {
    await ensureContentScript(tab.id);
    await ensureOffscreenExists();          // offscreen must exist before we grant permission
    const h = await getGrantedFSAHandle();  // grant now so subsequent captures can save to folder
    console.log('[TRP popup] annotate: fsaHandle after grant=', h ? h.name : 'null');
    chrome.tabs.sendMessage(tab.id, { action: "START_ANNOTATION_MODE" });
    window.close();
  }
}

// Update the capturing progress UI. Called both from full-page capture (via runtime messages)
// and from capture-visible (directly in popup).
function updateCaptureProgress({ phase, current = 0, total = 0, urlIndex = 0, urlTotal = 0, urlHost = '' }) {
  const label = document.getElementById('capturePhaseLabel');
  const detail = document.getElementById('capturePhaseDetail');
  const fill = document.getElementById('captureProgressFill');
  const wrap = document.getElementById('captureProgressWrap');
  if (!label) return;

  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  if (phase === 'urlset-navigating') {
    label.textContent = `${urlIndex} of ${urlTotal}`;
    detail.textContent = `Navigating to ${urlHost}...`;
    wrap.style.display = 'block';
    fill.style.width = Math.round(((urlIndex - 1) / urlTotal) * 100) + '%';
  } else if (phase === 'urlset-capturing') {
    label.textContent = `${urlIndex} of ${urlTotal}`;
    detail.textContent = `Capturing ${urlHost}...`;
    wrap.style.display = 'block';
    fill.style.width = Math.round(((urlIndex - 0.5) / urlTotal) * 100) + '%';
  } else if (phase === 'capturing') {
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
  } else if (phase === 'copied') {
    label.textContent = 'Copied to Clipboard!';
    detail.textContent = '';
    wrap.style.display = 'none';
  } else if (phase === 'visible') {
    label.textContent = 'Capturing visible area...';
    detail.textContent = '';
    wrap.style.display = 'none';
  } else if (phase === 'stopping') {
    label.textContent = 'Finalising recording...';
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
  const needsCopy = (intent === 'copy' || intent === 'both');
  const fsaHandle = needsSave ? await getGrantedFSAHandle() : null;
  console.log('[TRP popup] fullTab: fsaHandle=', fsaHandle ? fsaHandle.name : 'null', 'needsCopy=', needsCopy);

  if ((needsSave && fsaHandle) || needsCopy) {
    // Keep popup alive — show progress UI
    showCapturingView();
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
        const captureIntent = msg.intent || intent;
        const captureNeedsSave = (captureIntent === 'save' || captureIntent === 'both');
        const captureNeedsCopy = (captureIntent === 'copy' || captureIntent === 'both');

        updateCaptureProgress({ phase: 'saving' });
        const blob = await getScreenshotBlob(msg.key).catch(() => null);
        if (!blob) { window.close(); return; }

        // Write to clipboard from popup context (has focus + user activation)
        if (captureNeedsCopy) {
          try {
            await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
            console.log('[TRP popup] clipboard write succeeded');
          } catch (err) {
            console.error('[TRP popup] clipboard write failed:', err);
          }
        }

        if (captureNeedsSave && fsaHandle) {
          const ok = await writeFSAFromBlob(fsaHandle, blob, msg.filename);
          if (ok) {
            await deleteScreenshotBlob(msg.key).catch(() => {});
            updateCaptureProgress({ phase: 'done' });
            await new Promise(r => setTimeout(r, 600));
          } else {
            // Blob stays in IDB; tell background to fall back to Downloads
            chrome.runtime.sendMessage({ action: 'SAVE_SCREENSHOT_FALLBACK', key: msg.key, filename: msg.filename, tabId: tab.id });
          }
        } else if (captureNeedsSave) {
          // No FSA handle — fall back to Downloads via background
          chrome.runtime.sendMessage({ action: 'SAVE_SCREENSHOT_FALLBACK', key: msg.key, filename: msg.filename, tabId: tab.id });
        } else {
          // Copy-only — blob no longer needed
          await deleteScreenshotBlob(msg.key).catch(() => {});
          updateCaptureProgress({ phase: 'done' });
          await new Promise(r => setTimeout(r, 600));
        }

        window.close();
      })();
    });

    chrome.tabs.sendMessage(tab.id, { action: "CAPTURE_FULL_PAGE", intent });
    // Do NOT close popup — it stays alive until onCaptureReady fires
  } else {
    // No FSA and no clipboard needed: close popup immediately, offscreen handles save
    await ensureOffscreenExists();
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

// Filename generation — delegates to content script so DOM-based tokens can be resolved.
// Falls back to URL/date-only resolution if the content script is unavailable.
async function generateFilename(tab) {
  if (tab) {
    try {
      const response = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { action: 'RESOLVE_FILENAME' }, (r) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(r);
        });
      });
      if (response && response.filename) return response.filename;
    } catch (e) {
      // Content script unavailable (e.g. chrome:// page) — fall through
    }
  }
  return resolveBasicFilename(tab);
}

// URL/date token resolution only — used as fallback when content script is not available.
// DOM-based tokens ({{dom:}}, {{meta:}}, {{cookie:}}, {{localStorage:}}) resolve to empty string.
function resolveBasicFilename(tab) {
  return new Promise(resolve => {
    chrome.storage.local.get(['saveFileFormat'], (result) => {
      let format = result.saveFileFormat || '{{domain}}/{{timestamp}}-{{tab.title}}.png';
      let resolved = resolveTokens(format, tab);
      resolved = resolved.replace(/\/+/g, '/').replace(/^\/+/, '');
      if (!resolved.toLowerCase().endsWith('.png')) resolved += '.png';
      resolve(resolved);
    });
  });
}

// Resolves URL and date tokens. Used for captions/watermarks in popup context,
// and as a fallback for filenames when the content script is unreachable.
// DOM-based tokens are not resolvable here — they silently resolve to empty string.
function resolveTokens(str, tab) {
  if (!str) return str;
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const sanitize = (s) => String(s).replace(/[^a-zA-Z0-9.\-_]/g, '_').substring(0, 80);

  const year      = String(d.getFullYear());
  const month     = pad(d.getMonth() + 1);
  const day       = pad(d.getDate());
  const hour      = pad(d.getHours());
  const minute    = pad(d.getMinutes());
  const second    = pad(d.getSeconds());
  const timestamp = `${year}${month}${day}_${hour}${minute}${second}`;

  const url    = tab && tab.url   ? tab.url   : 'unknown';
  const title  = tab && tab.title ? tab.title : 'Screenshot';
  let domain = 'unknown', path = '', hash = '';
  try {
    const u = new URL(url);
    domain = u.hostname;
    const pathParts = u.pathname.split('/').filter(Boolean);
    path   = pathParts.map(sanitize).join('/');
    hash   = sanitize((u.hash || '').replace(/^#/, ''));
  } catch (e) {}

  let res = str;
  res = res.replace(/{{\s*timestamp\s*}}/g, timestamp);
  res = res.replace(/{{\s*year\s*}}/g,      year);
  res = res.replace(/{{\s*month\s*}}/g,     month);
  res = res.replace(/{{\s*day\s*}}/g,       day);
  res = res.replace(/{{\s*hour\s*}}/g,      hour);
  res = res.replace(/{{\s*minute\s*}}/g,    minute);
  res = res.replace(/{{\s*second\s*}}/g,    second);
  res = res.replace(/{{\s*domain\s*}}/g,    sanitize(domain));
  res = res.replace(/{{\s*path\s*}}/g,         path);
  res = res.replace(/{{\s*path:(\d+)\s*}}/g,  (_, n) => sanitize(pathParts[parseInt(n, 10) - 1] || ''));
  res = res.replace(/{{\s*hash\s*}}/g,      hash);
  res = res.replace(/{{\s*tab\.title\s*}}/g, sanitize(title));
  res = res.replace(/{{\s*tab\.url\s*}}/g,   sanitize(url.substring(0, 80)));
  // DOM-based tokens not available in popup context — resolve to empty string
  res = res.replace(/{{\s*(?:dom|meta|cookie|localStorage):[^}]+\s*}}/g, '');
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

// --- URL SET CAPTURE ---

let _urlSets = [];
let _resolutionSets = [];

// Load URL sets (and resolution sets) from storage and populate the selector in the popup.
function loadUrlSets() {
  chrome.storage.local.get(['urlSets', 'resolutionSets'], (result) => {
    _urlSets = result.urlSets || [];
    _resolutionSets = result.resolutionSets || [];
    const section = document.getElementById('urlSetSection');
    const select = document.getElementById('urlSetSelect');
    if (!section || !select) return;

    if (_urlSets.length === 0) {
      section.classList.add('hidden');
      return;
    }

    select.innerHTML = '';
    _urlSets.forEach(set => {
      const resSet = set.resolutionSetId ? _resolutionSets.find(r => r.id === set.resolutionSetId) : null;
      const resPart = resSet ? `, ${resSet.resolutions.length} size${resSet.resolutions.length !== 1 ? 's' : ''}` : '';
      const opt = document.createElement('option');
      opt.value = set.id;
      opt.textContent = `${set.name}  (${set.urls.length} URL${set.urls.length !== 1 ? 's' : ''}, ${set.defaultAction === 'full' ? 'Full Page' : 'Visible'}${resPart})`;
      select.appendChild(opt);
    });
    section.classList.remove('hidden');
  });
}

// --- DEBUGGER / RESOLUTION EMULATION ---

// Attach the Chrome debugger to a tab (safe to call if already attached).
async function attachDebugger(tabId) {
  return new Promise(resolve => {
    chrome.debugger.attach({ tabId }, '1.3', () => {
      const _ignored = chrome.runtime.lastError; // ignore "already attached"
      resolve();
    });
  });
}

// Detach the Chrome debugger from a tab (safe to call if not attached).
async function detachDebugger(tabId) {
  return new Promise(resolve => {
    chrome.debugger.detach({ tabId }, () => {
      const _ignored = chrome.runtime.lastError;
      resolve();
    });
  });
}

// Apply a viewport size override via Chrome DevTools Protocol.
// mobile=true for widths ≤ 480px so sites serve mobile layouts.
async function applyResolution(tabId, resolution) {
  return new Promise(resolve => {
    chrome.debugger.sendCommand({ tabId }, 'Emulation.setDeviceMetricsOverride', {
      width: resolution.width,
      height: resolution.height,
      deviceScaleFactor: 1,
      mobile: resolution.width <= 480,
    }, () => {
      const _ignored = chrome.runtime.lastError;
      resolve();
    });
  });
}

// Clear viewport override and restore the tab's natural size.
async function clearResolution(tabId) {
  return new Promise(resolve => {
    chrome.debugger.sendCommand({ tabId }, 'Emulation.clearDeviceMetricsOverride', {}, () => {
      const _ignored = chrome.runtime.lastError;
      resolve();
    });
  });
}

// Inject the resolution suffix (e.g. _1280x800) into a filename before the extension.
function injectResolutionInFilename(filename, resolution) {
  const suffix = `_${resolution.width}x${resolution.height}`;
  const dotIdx = filename.lastIndexOf('.');
  return dotIdx >= 0
    ? filename.slice(0, dotIdx) + suffix + filename.slice(dotIdx)
    : filename + suffix;
}

// Navigate the given tab to a URL and resolve when the page has fully loaded.
async function navigateAndWait(tabId, url) {
  return new Promise((resolve) => {
    let resolved = false;
    function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        if (resolved) return;
        resolved = true;
        chrome.tabs.onUpdated.removeListener(listener);
        setTimeout(resolve, 800);
      }
    }
    chrome.tabs.onUpdated.addListener(listener);
    chrome.tabs.update(tabId, { url });
    // Safety timeout — resolve anyway if the page never fires 'complete'
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }, 20000);
  });
}

// Capture the current tab as a full page; resolves when blob is saved. Does NOT close the popup.
// resolution: { width, height } | null — if set, injects _WxH suffix into the saved filename.
async function captureOneUrlFull(tabId, fsaHandle, intent, resolution = null) {
  return new Promise((resolve) => {
    function onProgress(msg) {
      if (msg.type === 'CAPTURE_PROGRESS') updateCaptureProgress(msg);
    }
    chrome.runtime.onMessage.addListener(onProgress);

    chrome.runtime.onMessage.addListener(function onCaptureReady(msg, sender, sendResponse) {
      if (msg.type !== 'FULL_PAGE_CAPTURE_READY') return;
      chrome.runtime.onMessage.removeListener(onCaptureReady);
      chrome.runtime.onMessage.removeListener(onProgress);
      sendResponse({ handled: true });

      (async () => {
        const captureIntent = msg.intent || intent;
        const captureNeedsSave = (captureIntent === 'save' || captureIntent === 'both');
        const captureNeedsCopy = (captureIntent === 'copy' || captureIntent === 'both');

        const blob = await getScreenshotBlob(msg.key).catch(() => null);
        if (!blob) { resolve(); return; }

        if (captureNeedsCopy) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
          } catch (err) { console.error('[TRP popup] clipboard write failed:', err); }
        }

        if (captureNeedsSave) {
          const filename = resolution ? injectResolutionInFilename(msg.filename, resolution) : msg.filename;
          if (fsaHandle) {
            const ok = await writeFSAFromBlob(fsaHandle, blob, filename);
            if (ok) {
              await deleteScreenshotBlob(msg.key).catch(() => {});
            } else {
              chrome.runtime.sendMessage({ action: 'SAVE_SCREENSHOT_FALLBACK', key: msg.key, filename, tabId });
            }
          } else {
            chrome.runtime.sendMessage({ action: 'SAVE_SCREENSHOT_FALLBACK', key: msg.key, filename, tabId });
          }
        } else {
          await deleteScreenshotBlob(msg.key).catch(() => {});
        }

        resolve();
      })();
    });

    chrome.tabs.sendMessage(tabId, { action: 'CAPTURE_FULL_PAGE', intent });
  });
}

// Capture the current tab as visible area; resolves when saved. Does NOT close the popup.
// resolution: { width, height } | null — if set, injects _WxH suffix into the saved filename.
async function captureOneUrlVisible(tabId, windowId, fsaHandle, intent, resolution = null) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'APPLY_PRE_CAPTURE_RULES' }, () => {
      const _ignored = chrome.runtime.lastError;
      setTimeout(async () => {
        chrome.tabs.captureVisibleTab(windowId, { format: 'png' }, async (dataUrl) => {
          chrome.tabs.sendMessage(tabId, { action: 'UNDO_PRE_CAPTURE_RULES' }).catch(() => {});
          if (chrome.runtime.lastError || !dataUrl) { resolve(); return; }

          const freshTab = await chrome.tabs.get(tabId).catch(() => ({ id: tabId, url: '', title: '' }));
          dataUrl = await applyBrandingToImage(dataUrl, freshTab);

          if (intent === 'copy' || intent === 'both') {
            try {
              const res = await fetch(dataUrl);
              const blob = await res.blob();
              await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            } catch (err) { console.error('[TRP popup] clipboard write failed (visible):', err); }
          }

          if (intent === 'save' || intent === 'both') {
            let filename = await generateFilename(freshTab);
            if (resolution) filename = injectResolutionInFilename(filename, resolution);
            if (fsaHandle) {
              const ok = await writeFSA(fsaHandle, dataUrl, filename);
              if (!ok) chrome.runtime.sendMessage({ action: 'DOWNLOAD_FILE', dataUrl, filename });
            } else {
              chrome.runtime.sendMessage({ action: 'DOWNLOAD_FILE', dataUrl, filename });
            }
          }

          resolve();
        });
      }, 100);
    });
  });
}

// Capture every URL in the set sequentially, navigating the active tab each time.
// If the set has a resolutionSetId, each URL is captured at every defined resolution.
async function captureUrlSet(set, intent) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const needsSave = (intent === 'save' || intent === 'both');
  const fsaHandle = needsSave ? await getGrantedFSAHandle() : null;

  // Resolve the resolution set (if any) — null means capture at current browser size
  const resSet = set.resolutionSetId ? _resolutionSets.find(r => r.id === set.resolutionSetId) : null;
  const resolutions = resSet ? resSet.resolutions : [null];
  const totalCaptures = set.urls.length * resolutions.length;
  let capturesDone = 0;

  showCapturingView();

  // Attach debugger once for the whole loop if resolution emulation is needed
  if (resSet) await attachDebugger(tab.id);

  try {
    for (let i = 0; i < set.urls.length; i++) {
      const url = set.urls[i];
      let hostname = url;
      try { hostname = new URL(url).hostname; } catch (e) {}

      updateCaptureProgress({ phase: 'urlset-navigating', urlIndex: capturesDone + 1, urlTotal: totalCaptures, urlHost: hostname });
      await navigateAndWait(tab.id, url);
      await ensureContentScript(tab.id);

      for (let j = 0; j < resolutions.length; j++) {
        const resolution = resolutions[j];
        capturesDone++;

        if (resolution) {
          await applyResolution(tab.id, resolution);
          await new Promise(r => setTimeout(r, 400)); // allow page to reflow at new size
          await ensureContentScript(tab.id); // content script might need re-injection after reflow
        }

        updateCaptureProgress({
          phase: 'urlset-capturing',
          urlIndex: capturesDone,
          urlTotal: totalCaptures,
          urlHost: resolution ? `${hostname} @ ${resolution.width}×${resolution.height}` : hostname,
        });

        if (set.defaultAction === 'visible') {
          await captureOneUrlVisible(tab.id, tab.windowId, fsaHandle, intent, resolution);
        } else {
          await captureOneUrlFull(tab.id, fsaHandle, intent, resolution);
        }
      }

      // Clear resolution after all sizes for this URL
      if (resSet) await clearResolution(tab.id);
    }
  } finally {
    if (resSet) await detachDebugger(tab.id);
  }

  updateCaptureProgress({ phase: 'done' });
  await new Promise(r => setTimeout(r, 800));
  window.close();
}

// Attach Action Listeners
if (document.getElementById('captureRegionBtn')) {
  document.getElementById('captureRegionBtn').addEventListener('click', triggerAnnotateFromPopup);
}
if (document.getElementById('annotateBtn')) {
  document.getElementById('annotateBtn').addEventListener('click', triggerAnnotateModeFromPopup);
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

if (document.getElementById('captureSetBtn')) {
  document.getElementById('captureSetBtn').addEventListener('click', async (e) => {
    const select = document.getElementById('urlSetSelect');
    if (!select) return;
    const setId = select.value;
    const set = _urlSets.find(s => s.id === setId);
    if (!set || set.urls.length === 0) return;
    const intent = await getActionIntent(e);
    captureUrlSet(set, intent);
  });
}

// Load URL sets on popup init
loadUrlSets();