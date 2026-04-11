// background.js

let recordingTabId = null;
let isRecording = false;

// Context menu — single item that opens the popup as if the toolbar icon was clicked.
// Created on install; context menus persist in Chrome across service worker restarts.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'trp-open',
    title: 'Tab Recorder Plus',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'trp-open') {
    chrome.action.openPopup();
  }
});

// Extension-origin IDB helpers (shared with offscreen document, NOT with content scripts)
async function openExtDB() {
  return new Promise((r, j) => {
    const req = indexedDB.open('TabRecorderDB', 2);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('Handles')) db.createObjectStore('Handles');
      if (!db.objectStoreNames.contains('Screenshots')) db.createObjectStore('Screenshots');
    };
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
}
async function storeBlobInExtDB(key, blob) {
  const db = await openExtDB();
  return new Promise((r, j) => {
    const tx = db.transaction('Screenshots', 'readwrite');
    tx.objectStore('Screenshots').put(blob, key);
    tx.oncomplete = () => { db.close(); r(); };
    tx.onerror = () => { db.close(); j(tx.error); };
  });
}
async function deleteFromExtDB(key) {
  const db = await openExtDB();
  return new Promise((r, j) => {
    const tx = db.transaction('Screenshots', 'readwrite');
    tx.objectStore('Screenshots').delete(key);
    tx.oncomplete = () => { db.close(); r(); };
    tx.onerror = () => { db.close(); j(tx.error); };
  });
}
async function getHandleFromExtDB() {
  const db = await openExtDB();
  return new Promise((r, j) => {
    const tx = db.transaction('Handles', 'readonly');
    const req = tx.objectStore('Handles').get('saveDirectory');
    req.onsuccess = () => { db.close(); r(req.result); };
    req.onerror = () => { db.close(); j(req.error); };
  });
}

async function ensureOffscreenDoc() {
  const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
  if (existingContexts.length === 0) {
    await chrome.offscreen.createDocument({ url: 'offscreen.html', reasons: ['USER_MEDIA'], justification: 'FSA DOM Handle' });
    await new Promise(r => setTimeout(r, 150));
  }
}

// Attempt FSA write directly from the background service worker.
// Background runs in the extension origin, so if permission was granted in the popup
// it should be visible here via queryPermission without needing user activation.
async function tryFSAWriteFromBackground(blob, filename) {
  const handle = await getHandleFromExtDB().catch(() => null);
  if (!handle) { console.log('[TRP bg] tryFSA: no handle'); return false; }

  const permState = await handle.queryPermission({ mode: 'readwrite' });
  console.log('[TRP bg] tryFSA: queryPermission=', permState);
  if (permState !== 'granted') return false;

  let parts = filename.split('/');
  let leaf = parts.pop();
  let dir = handle;
  for (const p of parts) {
    dir = await dir.getDirectoryHandle(p, { create: true });
  }
  const fileHandle = await dir.getFileHandle(leaf, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  console.log('[TRP bg] tryFSA: write SUCCESS');
  return true;
}

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
  else if (message.action === "SAVE_SCREENSHOT") {
    (async () => {
      console.log('[TRP bg] SAVE_SCREENSHOT received, filename=', message.filename);
      const tabId = sender.tab ? sender.tab.id : null;
      const key = 'screenshot-' + Date.now();

      // Store blob in extension-origin IDB
      let blob;
      try {
        blob = await (await fetch(message.dataUrl)).blob();
        await storeBlobInExtDB(key, blob);
        console.log('[TRP bg] stored blob in ext IDB, key=', key, 'size=', blob.size);
      } catch (e) {
        console.warn('[TRP bg] blob fetch/store failed, falling back to direct offscreen path:', e);
        await ensureOffscreenDoc();
        chrome.runtime.sendMessage({ type: 'PROCESS_FSA_DOWNLOAD', dataUrl: message.dataUrl, filename: message.filename, tabId });
        sendResponse({ success: true, pending: true });
        return;
      }

      // Signal the popup (if still alive) — it holds FSA permission and will write directly.
      // FSA permission is per-document in Chrome; popup is the only context that has it.
      console.log('[TRP bg] sending FULL_PAGE_CAPTURE_READY, key=', key);
      chrome.runtime.sendMessage({ type: 'FULL_PAGE_CAPTURE_READY', key, filename: message.filename, tabId }, (response) => {
        const _err = chrome.runtime.lastError; // consume potential "no receiver" error
        if (_err || !response?.handled) {
          console.log('[TRP bg] popup not alive, falling back to offscreen/Downloads');
          (async () => {
            await ensureOffscreenDoc();
            chrome.runtime.sendMessage({ type: 'PROCESS_SCREENSHOT_FROM_IDB', key, filename: message.filename, tabId });
          })();
        } else {
          console.log('[TRP bg] popup acknowledged — it will handle the FSA write');
        }
      });

      sendResponse({ success: true, pending: true });
    })();
    return true;
  }
  else if (message.action === "SAVE_SCREENSHOT_FALLBACK") {
    // Popup's FSA write failed — route blob from IDB through offscreen → Downloads fallback
    (async () => {
      console.log('[TRP bg] SAVE_SCREENSHOT_FALLBACK key=', message.key);
      await ensureOffscreenDoc();
      chrome.runtime.sendMessage({ type: 'PROCESS_SCREENSHOT_FROM_IDB', key: message.key, filename: message.filename, tabId: message.tabId });
    })();
  }
  else if (message.action === "DOWNLOAD_FILE") {
    (async () => {
      console.log('[TRP bg] DOWNLOAD_FILE received, filename=', message.filename);
      await ensureOffscreenDoc();
      const tabId = sender.tab ? sender.tab.id : null;
      chrome.runtime.sendMessage({ type: 'PROCESS_FSA_DOWNLOAD', dataUrl: message.dataUrl, filename: message.filename, tabId });
      sendResponse({ success: true, pending: true });
    })();
    return true;
  }
  else if (message.action === "ENSURE_OFFSCREEN") {
    (async () => {
      const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
      console.log('[TRP bg] ENSURE_OFFSCREEN: existing=', existingContexts.length);
      await ensureOffscreenDoc();
      sendResponse({ ok: true });
    })();
    return true;
  }
  else if (message.action === "CAPTURE_SAVE_DONE") {
    // Offscreen completed a save. Reopen popup to show "Saved!" done state in the progress UI.
    (async () => {
      try {
        await chrome.storage.session.set({ pendingCaptureResult: 'done' });
        await chrome.action.openPopup();
      } catch (e) {
        // chrome.action.openPopup() requires Chrome 127+; silently skip on older builds
        console.log('[TRP bg] openPopup unavailable:', e.message);
        chrome.storage.session.remove('pendingCaptureResult');
      }
    })();
  }
  else if (message.action === "CAPTURE_COPY_DONE") {
    // Content script completed a clipboard copy. Reopen popup to show "Copied!" done state.
    (async () => {
      try {
        await chrome.storage.session.set({ pendingCaptureResult: 'copied' });
        await chrome.action.openPopup();
      } catch (e) {
        console.log('[TRP bg] openPopup unavailable:', e.message);
        chrome.storage.session.remove('pendingCaptureResult');
      }
    })();
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
      if (message.dataUrl) {
        chrome.downloads.download({
          url: message.dataUrl,
          filename: message.filename,
          saveAs: false
        });
      }
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
  } else if (command === "annotate") {
    // Global shortcut (Alt+Shift+A) — open annotation toolbar on the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab) return;
      chrome.tabs.sendMessage(tab.id, { action: 'PING' }, (response) => {
        const needsInject = chrome.runtime.lastError || !response;
        const send = () => chrome.tabs.sendMessage(tab.id, { action: 'START_ANNOTATION_MODE' });
        if (needsInject) {
          chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] },
            () => { chrome.runtime.lastError; setTimeout(send, 80); });
        } else {
          send();
        }
      });
    });
  }
});

// Long-lived port for tab capture.
// Using a port (rather than sendMessage) keeps the service worker alive for
// the entire capture operation, preventing the "port closed before response"
// race that causes frame skips in Chrome MV3.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'trp-capture') {
    port.onMessage.addListener((msg) => {
      if (msg.action !== 'CAPTURE') return;
      const windowId = port.sender && port.sender.tab ? port.sender.tab.windowId : null;
      captureForPort(port, windowId, 1);
    });
    return;
  }

  if (port.name === 'trp-screenshot-upload') {
    // Receives a large screenshot dataUrl in chunks from content.js.
    // chrome.runtime.sendMessage has a 64MiB limit; chunked port transfer avoids it.
    const tabId = port.sender && port.sender.tab ? port.sender.tab.id : null;
    const chunks = [];
    let filename = '';

    port.onMessage.addListener((msg) => {
      if (msg.action === 'SCREENSHOT_START') {
        filename = msg.filename;
      } else if (msg.action === 'SCREENSHOT_CHUNK') {
        chunks.push(msg.data);
      } else if (msg.action === 'SCREENSHOT_END') {
        const dataUrl = chunks.join('');
        console.log('[TRP bg] SCREENSHOT_END received, assembling', chunks.length, 'chunks, total size=', dataUrl.length);
        const key = 'screenshot-' + Date.now();

        (async () => {
          let blob;
          try {
            blob = await (await fetch(dataUrl)).blob();
            await storeBlobInExtDB(key, blob);
            console.log('[TRP bg] stored blob in ext IDB, key=', key, 'size=', blob.size);
          } catch (e) {
            console.warn('[TRP bg] blob store failed, falling back to offscreen path:', e);
            await ensureOffscreenDoc();
            chrome.runtime.sendMessage({ type: 'PROCESS_FSA_DOWNLOAD', dataUrl, filename, tabId });
            return;
          }

          console.log('[TRP bg] sending FULL_PAGE_CAPTURE_READY, key=', key);
          chrome.runtime.sendMessage({ type: 'FULL_PAGE_CAPTURE_READY', key, filename, tabId }, (response) => {
            const _err = chrome.runtime.lastError;
            if (_err || !response?.handled) {
              console.log('[TRP bg] popup not alive, falling back to offscreen/Downloads');
              (async () => {
                await ensureOffscreenDoc();
                chrome.runtime.sendMessage({ type: 'PROCESS_SCREENSHOT_FROM_IDB', key, filename, tabId });
              })();
            } else {
              console.log('[TRP bg] popup acknowledged — it will handle the FSA write');
            }
          });
        })();
      }
    });
    return;
  }
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