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
    sendResponse({ isRecording: isRecording });
  }
  else if (message.type === "RECORDING_FINISHED") {
    downloadRecording(message.url);
  }
  // Case A: Save to File (Download)
  else if (message.action === "TAKE_SCREENSHOT") {
    takeScreenshot(true);
  }
  // Case B: Return Data (For Clipboard)
  else if (message.action === "CAPTURE_FOR_CLIPBOARD") {
    // We must return true to indicate we will respond asynchronously
    takeScreenshot(false, sendResponse);
    return true; 
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "stop-recording" && isRecording) {
    handleStopRecording();
  }
});

// Updated Screenshot Function
function takeScreenshot(download = true, sendResponse = null) {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      if (sendResponse) sendResponse({ success: false });
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