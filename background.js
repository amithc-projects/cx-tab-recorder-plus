// background.js

let recordingTabId = null;
let isRecording = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_RECORDING") {
    handleStartRecording(sender.tab ? sender.tab.id : message.tabId, message);
    sendResponse({ success: true });
  } 
  else if (message.action === "STOP_RECORDING") {
    handleStopRecording();
    sendResponse({ success: true });
  }
  else if (message.action === "GET_STATUS") {
    // Read from storage so state survives service worker restarts
    chrome.storage.local.get(['isRecording'], (result) => {
      isRecording = result.isRecording || false;
      sendResponse({ isRecording });
    });
    return true;
  }
  else if (message.type === "RECORDING_FINISHED") {
    downloadRecording(message.url);
  }
  else if (message.action === "DOWNLOAD_FILE") {
    (async () => {
      console.log('[TRP bg] DOWNLOAD_FILE received, filename=', message.filename);
      // 1. Ensure Offscreen DOM exists (so it has FSA access)
      const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
      console.log('[TRP bg] existing offscreen contexts:', existingContexts.length);
      if (existingContexts.length === 0) {
        await chrome.offscreen.createDocument({
          url: 'offscreen.html',
          reasons: ['USER_MEDIA'],
          justification: 'FSA DOM Handle'
        });
        await new Promise(r => setTimeout(r, 150));
      }

      let tabId = sender.tab ? sender.tab.id : null;
      console.log('[TRP bg] sending PROCESS_FSA_DOWNLOAD to offscreen, tabId=', tabId);
      chrome.runtime.sendMessage({
         type: 'PROCESS_FSA_DOWNLOAD',
         dataUrl: message.dataUrl,
         filename: message.filename,
         tabId: tabId
      });
      sendResponse({ success: true, pending: true });
    })();
    return true;
  }
  else if (message.action === "ENSURE_OFFSCREEN") {
    // Popup calls this before granting FSA permission so the existing offscreen
    // receives the permission update (newly-created contexts don't inherit it).
    (async () => {
      const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
      console.log('[TRP bg] ENSURE_OFFSCREEN: existing=', existingContexts.length);
      if (existingContexts.length === 0) {
        await chrome.offscreen.createDocument({
          url: 'offscreen.html',
          reasons: ['USER_MEDIA'],
          justification: 'FSA DOM Handle'
        });
        await new Promise(r => setTimeout(r, 150));
      }
      sendResponse({ ok: true });
    })();
    return true;
  }
  else if (message.action === "RELAY_TOAST") {
    // Offscreen cannot use chrome.tabs — relay toasts through background instead.
    chrome.tabs.sendMessage(message.tabId, { action: "SHOW_TOAST", message: message.message }).catch(() => {});
  }
  else if (message.action === "FSA_FAILED_FALLBACK") {
      console.warn('[TRP bg] FSA_FAILED_FALLBACK error=', message.error, 'filename=', message.filename);
      if (message.error && message.error.includes("Permission demoted")) {
        if (chrome.notifications) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", 
            title: "Permission Expired",
            message: "Tab Recorder lost access to your Folder! Temporarily saved to Downloads. Please click the extension icon to re-grant access."
          });
        }
      }
      
      // Fallback
      chrome.downloads.download({
        url: message.dataUrl,
        filename: message.filename,
        saveAs: false
      });
  }
  // Case A: Save to File (Download)
  else if (message.action === "TAKE_SCREENSHOT") {
    takeScreenshot(true, null, sender.tab ? sender.tab.windowId : null);
  }
  // Case B: Return Data (For Clipboard)
  else if (message.action === "CAPTURE_FOR_CLIPBOARD") {
    // We must return true to indicate we will respond asynchronously
    takeScreenshot(false, sendResponse, sender.tab ? sender.tab.windowId : null);
    return true; 
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "stop-recording" && isRecording) {
    handleStopRecording();
  }
});

// Long-lived port for tab capture.
// Using a port (rather than sendMessage) keeps the service worker alive for
// the entire capture operation, preventing the "port closed before response"
// race that causes frame skips in Chrome MV3.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'trp-capture') return;

  port.onMessage.addListener((msg) => {
    if (msg.action !== 'CAPTURE') return;
    const windowId = port.sender && port.sender.tab ? port.sender.tab.windowId : null;
    captureForPort(port, windowId, 1);
  });
});

function captureForPort(port, windowId, attempt) {
  chrome.tabs.captureVisibleTab(
    windowId != null ? windowId : chrome.windows.WINDOW_ID_CURRENT,
    { format: 'png' },
    (dataUrl) => {
      if (chrome.runtime.lastError) {
        const errMsg = chrome.runtime.lastError.message;
        if (attempt < 4) {
          setTimeout(() => captureForPort(port, windowId, attempt + 1), 300);
          return;
        }
        console.error('TRP captureVisibleTab failed:', errMsg);
        try { port.postMessage({ success: false, error: errMsg }); } catch (e) {}
        return;
      }
      try { port.postMessage({ success: true, dataUrl }); } catch (e) {}
    }
  );
}

// Updated Screenshot Function
function takeScreenshot(download = true, sendResponse = null, windowId = null, attempt = 1) {
  chrome.tabs.captureVisibleTab(windowId || chrome.windows.WINDOW_ID_CURRENT, { format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      if (attempt < 4) {
        setTimeout(() => takeScreenshot(download, sendResponse, windowId, attempt + 1), 300);
        return;
      }
      console.error(chrome.runtime.lastError);
      if (sendResponse) sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    if (download) {
      // Download to disk
      const filename = `screenshot-${Date.now()}.png`;
      chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: false
      });
    } else {
      // Send data back (for clipboard)
      if (sendResponse) sendResponse({ success: true, dataUrl: dataUrl });
    }
  });
}

// ... (Rest of file: handleStartRecording, handleStopRecording, downloadRecording) ...
// (Ensure you keep the existing functions below this line)
async function handleStartRecording(tabId, message) {
  recordingTabId = tabId;
  isRecording = true;
  chrome.storage.local.set({ isRecording: true });
  const width = message.width;     
  const height = message.height;   
  chrome.action.setBadgeText({ text: "REC" });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
  const existingContexts = await chrome.runtime.getContexts({});
  const offscreenExists = existingContexts.some(c => c.contextType === 'OFFSCREEN_DOCUMENT');
  if (!offscreenExists) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'],
      justification: 'Recording tab content'
    });
  }
  const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabId });
  chrome.runtime.sendMessage({
    type: 'START_OFFSCREEN_RECORDING',
    data: { streamId, options: message.options, width, height }
  });
}

function handleStopRecording() {
  isRecording = false;
  recordingTabId = null;
  chrome.storage.local.set({ isRecording: false });
  chrome.action.setBadgeText({ text: "" });
  chrome.runtime.sendMessage({ type: 'STOP_OFFSCREEN_RECORDING' });
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: "FORCE_STOP_UI" }).catch(() => {});
    });
  });
  chrome.storage.local.remove('timerState');
}

function downloadRecording(url) {
  chrome.downloads.download({
    url: url,
    filename: `recording-${Date.now()}.webm`,
    saveAs: true 
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      chrome.offscreen.closeDocument().catch(() => {});
    } else {
      const listener = (delta) => {
        if (delta.id === downloadId) {
          if (delta.state && (delta.state.current === 'complete' || delta.state.current === 'interrupted')) {
            chrome.downloads.onChanged.removeListener(listener);
            chrome.offscreen.closeDocument().catch(() => {});
          }
        }
      };
      chrome.downloads.onChanged.addListener(listener);
    }
  });
}