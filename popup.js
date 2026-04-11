// popup.js
const setupView = document.getElementById('setupView');
const recordingView = document.getElementById('recordingView');
const viewCapture = document.getElementById('viewCapture');
const viewRecord = document.getElementById('viewRecord');

// Element selectors
const tabRecord = document.getElementById('tabRecord');
const tabCapture = document.getElementById('tabCapture');

// Initialize State
chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
  if (response && response.isRecording) {
    showStopView();
  } else {
    showSetupView();
  }
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

// Settings load
chrome.storage.local.get([
  'showTimer', 'recordScreen', 'timerPosition', 'showClicks', 'captureDefault', 'saveFileFormat',
  'enableCaption', 'captionPos', 'captionText', 'enableWatermark', 'watermarkText'
], (result) => {
  if (document.getElementById('showTimer')) document.getElementById('showTimer').checked = result.showTimer !== false;
  if (document.getElementById('recordScreen')) document.getElementById('recordScreen').checked = result.recordScreen !== false;
  if (document.getElementById('timerPosition')) document.getElementById('timerPosition').value = result.timerPosition || 'bottom-center';
  if (document.getElementById('showClicks')) document.getElementById('showClicks').checked = result.showClicks !== false; 
  if (document.getElementById('captureDefault')) document.getElementById('captureDefault').value = result.captureDefault || 'both';
  if (document.getElementById('saveFileFormat')) document.getElementById('saveFileFormat').value = result.saveFileFormat || '{{domain}}/{{timestamp}}-{{tab.title}}.png';
  if (document.getElementById('enableCaption')) document.getElementById('enableCaption').checked = result.enableCaption || false;
  if (document.getElementById('captionPos')) document.getElementById('captionPos').value = result.captionPos || 'bottom';
  if (document.getElementById('captionText')) document.getElementById('captionText').value = result.captionText || 'Captured from {{domain}}';
  if (document.getElementById('enableWatermark')) document.getElementById('enableWatermark').checked = result.enableWatermark || false;
  if (document.getElementById('watermarkText')) document.getElementById('watermarkText').value = result.watermarkText || 'CONFIDENTIAL';
});

['saveFileFormat', 'enableCaption', 'captionPos', 'captionText', 'enableWatermark', 'watermarkText'].forEach(id => {
  if (document.getElementById(id)) {
    document.getElementById(id).addEventListener('change', (e) => {
      chrome.storage.local.set({ [id]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    });
    if (document.getElementById(id).type === 'text') {
      document.getElementById(id).addEventListener('input', (e) => {
        chrome.storage.local.set({ [id]: e.target.value });
      });
    }
  }
});

if (document.getElementById('captureDefault')) {
  document.getElementById('captureDefault').addEventListener('change', (e) => {
    chrome.storage.local.set({ captureDefault: e.target.value });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const key = e.key.toLowerCase();
  
  // Try to cleanly click the visible buttons based on shortcuts
  try {
    if (key === 'r' && !setupView.classList.contains('hidden')) document.getElementById('btnRecordScreen').click();
    
    // Screenshot (S)
    if (key === 's') {
      const btn = document.getElementById('screenshotBtn') || document.getElementById('btnFullTab');
      if (btn) btn.dispatchEvent(new MouseEvent('click', { shiftKey: e.shiftKey }));
    }
    
    // Window (W or C for legacy clipboard)
    if (key === 'w' || key === 'c') document.getElementById('clipboardBtn').dispatchEvent(new MouseEvent('click', { shiftKey: e.shiftKey }));  
    
    // Area (A)
    if (key === 'a') document.getElementById('annotateBtn').click();
  } catch(e) {}
});

// Clipboard Capture
async function triggerScreenshotFromPopup(intent) {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab) return;

  if (intent) {
    chrome.tabs.sendMessage(tab.id, { action: "GET_CROP_AND_HIDE_UI" }, (response) => {
      const _ignored = chrome.runtime.lastError; // consume to avoid uncaught error
      setTimeout(() => {
        chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, async (dataUrl) => {
          if (chrome.runtime.lastError || !dataUrl) { restoreAndClose(tab.id); return; }

          if (response && response.cropRect) {
            dataUrl = await cropImageLocal(dataUrl, response.cropRect, response.innerWidth);
          }

          dataUrl = await applyBrandingToImage(dataUrl, tab);

          if (intent === 'copy' || intent === 'both') {
            try {
              const res = await fetch(dataUrl);
              const blob = await res.blob();
              await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
              if (intent === 'copy') chrome.tabs.sendMessage(tab.id, { action: "SHOW_TOAST", message: "Copied Window! 📋" });
            } catch (err) { console.error("Clipboard failed", err); }
          }
          
          if (intent === 'save' || intent === 'both') {
            const filename = await generateFilename(tab);
            chrome.runtime.sendMessage({ action: "DOWNLOAD_FILE", dataUrl: dataUrl, filename: filename });
            if (intent === 'save') chrome.tabs.sendMessage(tab.id, { action: "SHOW_TOAST", message: "Saved Window! 💾" });
          }
          
          if (intent === 'both') {
             chrome.tabs.sendMessage(tab.id, { action: "SHOW_TOAST", message: "Saved & Copied! 💾📋" });
          }

          restoreAndClose(tab.id);
        });
      }, 100);
    });
  } else {
    chrome.tabs.sendMessage(tab.id, { action: "TRIGGER_SCREENSHOT" });
    window.close();
  }
}

function restoreAndClose(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "RESTORE_UI" });
  setTimeout(() => window.close(), 100);
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
      
      const sx = x * ratio;
      const sy = y * ratio;
      const sw = w * ratio;
      const sh = h * ratio;
      
      cvs.width = sw; cvs.height = sh;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(cvs.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

// Annotation
async function triggerAnnotateFromPopup() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab) {
    chrome.tabs.sendMessage(tab.id, { action: "START_CROP_MODE" });
    window.close();
  }
}

// Full Tab Capture (Fallback to standard screenshot until stitcher is built)
async function triggerFullTabCapture(intent) {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab) {
     chrome.tabs.sendMessage(tab.id, { action: "CAPTURE_FULL_PAGE", intent: intent }); 
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

function getActionIntent(e) {
  const mode = document.getElementById('captureDefault') ? document.getElementById('captureDefault').value : 'both';
  if (e.shiftKey) {
    if (mode === 'both') return 'save'; // If both, shift-modifier skips copy and just saves
    return mode === 'copy' ? 'save' : 'copy';
  }
  return mode;
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
    let req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => req.result.createObjectStore(STORE_NAME);
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
if (document.getElementById('btnPickFolder')) {
  getHandle().then(handle => {
    if (handle) {
      document.getElementById('folderNameDisplay').innerText = `Root: ${handle.name}/`;
    } else {
      document.getElementById('folderNameDisplay').innerText = `⚠️ Required: Setup Local Save Path`;
      document.getElementById('folderNameDisplay').style.color = '#F87171';
      document.getElementById('btnPickFolder').style.background = '#2563EB';
      document.getElementById('btnPickFolder').innerText = 'Grant Folder Permission';
    }
  }).catch(e=>{});
  document.getElementById('btnPickFolder').addEventListener('click', async () => {
    try {
      const handle = await window.showDirectoryPicker({ id: "trp-out", mode: "readwrite" });
      await saveHandle(handle);
      document.getElementById('folderNameDisplay').innerText = `Root: ${handle.name}/`;
      document.getElementById('folderNameDisplay').style.color = '#10B981';
      document.getElementById('btnPickFolder').style.background = '#1F2937';
      document.getElementById('btnPickFolder').innerText = 'Change Folder...';
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
         if (tabs.length) chrome.tabs.sendMessage(tabs[0].id, { action: "SHOW_TOAST", message: "Folder Location Pinned! 📁" });
      });
    } catch(e) {}
  });
}

if (document.getElementById('annotateBtn')) {
  document.getElementById('annotateBtn').addEventListener('click', triggerAnnotateFromPopup);
}
if (document.getElementById('screenshotBtn')) {
  document.getElementById('screenshotBtn').addEventListener('click', (e) => triggerFullTabCapture(getActionIntent(e)));
}
if (document.getElementById('clipboardBtn')) {
  document.getElementById('clipboardBtn').addEventListener('click', (e) => triggerScreenshotFromPopup(getActionIntent(e)));
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
if (document.getElementById('helpBtn')) {
  document.getElementById('helpBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'help.html' });
  });
}