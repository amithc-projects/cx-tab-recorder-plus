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
  console.log('[TRP offscreen] processNativeDownload filename=', filename);
  let savedOk = false;
  try {
    let handle = await getHandle().catch((e) => { console.warn('[TRP offscreen] getHandle error:', e); return null; });
    console.log('[TRP offscreen] handle=', handle ? handle.name : 'null');
    if (!handle) throw new Error("No configured handle");

    let permState = await handle.queryPermission({ mode: "readwrite" });
    console.log('[TRP offscreen] queryPermission=', permState);
    if (permState !== 'granted') {
      permState = await handle.requestPermission({ mode: "readwrite" }).catch((e) => { console.warn('[TRP offscreen] requestPermission threw:', e); return 'denied'; });
      console.log('[TRP offscreen] requestPermission result=', permState);
    }
    if (permState !== 'granted') throw new Error("Permission demoted to: " + permState);

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
    console.log('[TRP offscreen] writing blob size=', blob.size);
    await writable.write(blob);
    await writable.close();
    console.log('[TRP offscreen] write SUCCESS');
    savedOk = true;
  } catch(err) {
    console.warn('[TRP offscreen] FSA failed, sending fallback. error=', err.message);
    chrome.runtime.sendMessage({ action: "FSA_FAILED_FALLBACK", dataUrl: dataUrl, filename: filename, error: err.message });
  }

  // chrome.tabs is not available in offscreen — route the toast through background.
  if (savedOk && tabId) {
    chrome.runtime.sendMessage({ action: "RELAY_TOAST", tabId: tabId, message: "Saved! 🗂️" });
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