// popup.js
const setupView = document.getElementById('setupView');
const recordingView = document.getElementById('recordingView');
const statusText = document.getElementById('status');

chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
  if (response && response.isRecording) {
    showStopView();
  } else {
    showSetupView();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const key = e.key.toLowerCase();
  if (key === 'r' && !setupView.classList.contains('hidden')) document.getElementById('startBtn').click();
  if (key === 's') triggerScreenshotFromPopup(false); 
  if (key === 'c') triggerScreenshotFromPopup(true);  
  if (key === 'a') triggerAnnotateFromPopup();
});

// --- CLIPBOARD LOGIC (Popup Side) ---
async function triggerScreenshotFromPopup(toClipboard) {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab) return;

  if (toClipboard) {
    // 1. Ask content to hide UI and GIVE US THE CROP RECT
    chrome.tabs.sendMessage(tab.id, { action: "GET_CROP_AND_HIDE_UI" }, (response) => {
      // 2. Wait for UI hide
      setTimeout(() => {
        // 3. Capture
        chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
          if (!dataUrl) { restoreAndClose(tab.id); return; }

          // 4. Crop if needed (using data from content script)
          if (response && response.cropRect) {
            dataUrl = await cropImageLocal(dataUrl, response.cropRect);
          }

          // 5. Write to Clipboard
          try {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
          } catch (err) { console.error("Clipboard failed", err); }

          restoreAndClose(tab.id);
        });
      }, 100);
    });
  } else {
    // Save to File (Background handles this fine)
    chrome.tabs.sendMessage(tab.id, { action: "TRIGGER_SCREENSHOT" });
    window.close();
  }
}

function restoreAndClose(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "RESTORE_UI" });
  setTimeout(() => window.close(), 100);
}

// Helper: Duplicate of crop logic for Popup context
function cropImageLocal(dataUrl, rect) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cvs = document.createElement('canvas');
      let x = rect.x, y = rect.y, w = rect.w, h = rect.h;
      if (w < 0) { x += w; w = Math.abs(w); }
      if (h < 0) { y += h; h = Math.abs(h); }
      if (x < 0) x = 0; if (y < 0) y = 0;
      
      cvs.width = w; cvs.height = h;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      resolve(cvs.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

// --- STANDARD POPUP LOGIC ---

async function triggerAnnotateFromPopup() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab) {
    chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_ANNOTATION" });
    window.close();
  }
}

function showSetupView() {
  setupView.classList.remove('hidden');
  recordingView.classList.add('hidden');
  chrome.storage.local.get(['showTimer', 'recordScreen', 'timerPosition', 'showClicks'], (result) => {
    document.getElementById('showTimer').checked = result.showTimer !== false;
    document.getElementById('recordScreen').checked = result.recordScreen !== false;
    document.getElementById('timerPosition').value = result.timerPosition || 'bottom-center';
    document.getElementById('showClicks').checked = result.showClicks !== false; 
  });
}

function showStopView() {
  setupView.classList.add('hidden');
  recordingView.classList.remove('hidden');
}

document.getElementById('annotateBtn').addEventListener('click', triggerAnnotateFromPopup);
document.getElementById('screenshotBtn').addEventListener('click', () => triggerScreenshotFromPopup(false));
document.getElementById('clipboardBtn').addEventListener('click', () => triggerScreenshotFromPopup(true));

document.getElementById('startBtn').addEventListener('click', async () => {
  const showTimer = document.getElementById('showTimer').checked;
  const recordScreen = document.getElementById('recordScreen').checked;
  const timerPosition = document.getElementById('timerPosition').value;
  const showClicks = document.getElementById('showClicks').checked;
  
  chrome.storage.local.set({ showTimer, recordScreen, timerPosition, showClicks });

  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: "ARM_TIMER",
      options: { showTimer, recordScreen, timerPosition, showClicks }
    });
    window.close();
  } catch (err) {
    await chrome.scripting.executeScript({ target: {tabId: tab.id}, files: ['content.js'] });
    await chrome.tabs.sendMessage(tab.id, { 
        action: "ARM_TIMER", 
        options: { showTimer, recordScreen, timerPosition, showClicks } 
    });
    window.close();
  }
});

document.getElementById('stopBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "STOP_RECORDING" });
  window.close();
});

document.getElementById('mergeBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'merger.html' });
});

document.getElementById('helpBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'help.html' });
});