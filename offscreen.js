// offscreen.js

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
async function getHandle() {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction(STORE_NAME, "readonly");
    let req = tx.objectStore(STORE_NAME).get("saveDirectory");
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
}

let mediaRecorder;
let recordedChunks = [];

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'START_OFFSCREEN_RECORDING') {
    // Pass the whole data object (which has width/height)
    startRecording(message.data);
  } else if (message.type === 'STOP_OFFSCREEN_RECORDING') {
    stopRecording();
  } else if (message.type === 'PROCESS_FSA_DOWNLOAD') {
    processNativeDownload(message.dataUrl, message.filename, message.tabId);
  }
});

async function processNativeDownload(dataUrl, filename, tabId) {
  try {
    let handle = await getHandle().catch(() => null);
    if (!handle) throw new Error("No configured handle");
    
    let permState = await handle.queryPermission({ mode: "readwrite" });
    if (permState !== 'granted') {
      // Attempt silent re-grant — works in extension offscreen contexts without a user gesture
      permState = await handle.requestPermission({ mode: "readwrite" }).catch(() => 'denied');
    }
    if (permState !== 'granted') throw new Error("Permission demoted to prompt");
    
    let parts = filename.split('/');
    let leaf = parts.pop();
    let currentDir = handle;
    for (const p of parts) {
      currentDir = await currentDir.getDirectoryHandle(p, { create: true });
    }
    const fileHandle = await currentDir.getFileHandle(leaf, { create: true });
    const writable = await fileHandle.createWritable();
    
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await writable.write(blob);
    await writable.close();
    
    if (tabId) chrome.tabs.sendMessage(tabId, { action: "SHOW_TOAST", message: "Saved Native! 🗂️" });
  } catch(err) {
    chrome.runtime.sendMessage({ action: "FSA_FAILED_FALLBACK", dataUrl: dataUrl, filename: filename, error: err.message });
  }
}

async function startRecording(data) {
  const streamId = data.streamId;
  const width = data.width || 1920;
  const height = data.height || 1080;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId,
          // FIX: Force exact dimensions
          maxWidth: width,
          maxHeight: height,
          minWidth: width,
          minHeight: height
        }
      }
    });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.start();
    
  } catch (err) {
    console.error("Offscreen recording failed:", err);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      // ACTION: Send the URL to background.js
      // We do NOT try to download here anymore.
      chrome.runtime.sendMessage({ 
        type: 'RECORDING_FINISHED', 
        url: url 
      });
    };
    mediaRecorder.stop();
    
    // Stop tracks
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
}