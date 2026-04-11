// offscreen.js

const DB_NAME = "TabRecorderDB";
const STORE_NAME = "Handles";
const SCREENSHOTS_STORE = "Screenshots";

function openDB() {
  return new Promise((r, j) => {
    let req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      if (!db.objectStoreNames.contains(SCREENSHOTS_STORE)) db.createObjectStore(SCREENSHOTS_STORE);
    };
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
async function getBlobFromIDB(key) {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction(SCREENSHOTS_STORE, "readonly");
    let req = tx.objectStore(SCREENSHOTS_STORE).get(key);
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
}
async function deleteBlobFromIDB(key) {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction(SCREENSHOTS_STORE, "readwrite");
    tx.objectStore(SCREENSHOTS_STORE).delete(key);
    tx.oncomplete = r;
    tx.onerror = () => j(tx.error);
  });
}
async function storeBlobInIDB(key, blob) {
  let db = await openDB();
  return new Promise((r, j) => {
    let tx = db.transaction(SCREENSHOTS_STORE, "readwrite");
    tx.objectStore(SCREENSHOTS_STORE).put(blob, key);
    tx.oncomplete = r;
    tx.onerror = () => j(tx.error);
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
  } else if (message.type === 'PROCESS_SCREENSHOT_FROM_IDB') {
    processScreenshotFromIDB(message.key, message.filename, message.tabId);
  } else if (message.type === 'PROCESS_RECORDING_FROM_IDB') {
    processRecordingFromIDB(message.key, message.filename, message.fallbackUrl);
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

  // Reopen the popup to show the "Saved!" done state (no toast).
  if (savedOk) {
    chrome.runtime.sendMessage({ action: "CAPTURE_SAVE_DONE" });
  }
}

async function processScreenshotFromIDB(key, filename, tabId) {
  console.log('[TRP offscreen] processScreenshotFromIDB key=', key, 'filename=', filename);
  let savedOk = false;
  let blob = null;
  try {
    blob = await getBlobFromIDB(key);
    if (!blob) throw new Error('Blob not found in IDB for key: ' + key);
    console.log('[TRP offscreen] blob from IDB size=', blob.size);

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
    await writable.write(blob);
    await writable.close();
    console.log('[TRP offscreen] FSA write SUCCESS');
    savedOk = true;
    await deleteBlobFromIDB(key).catch(() => {});
  } catch(err) {
    console.warn('[TRP offscreen] FSA failed from IDB, sending fallback. error=', err.message);
    // Convert blob to dataUrl for fallback download, then clean up IDB
    if (blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        chrome.runtime.sendMessage({ action: "FSA_FAILED_FALLBACK", dataUrl: reader.result, filename, error: err.message });
        deleteBlobFromIDB(key).catch(() => {});
      };
      reader.onerror = () => {
        chrome.runtime.sendMessage({ action: "FSA_FAILED_FALLBACK", dataUrl: null, filename, error: err.message });
        deleteBlobFromIDB(key).catch(() => {});
      };
      reader.readAsDataURL(blob);
      return; // toast will not fire; fallback download is enough feedback
    }
    chrome.runtime.sendMessage({ action: "FSA_FAILED_FALLBACK", dataUrl: null, filename, error: err.message });
  }

  if (savedOk) {
    chrome.runtime.sendMessage({ action: "CAPTURE_SAVE_DONE" });
  }
}

async function processRecordingFromIDB(key, filename, fallbackUrl) {
  console.log('[TRP offscreen] processRecordingFromIDB key=', key, 'filename=', filename);
  let savedOk = false;
  try {
    const blob = await getBlobFromIDB(key);
    if (!blob) throw new Error('Recording blob not found in IDB: ' + key);
    console.log('[TRP offscreen] recording blob size=', blob.size);

    const handle = await getHandle().catch((e) => { console.warn('[TRP offscreen] getHandle error:', e); return null; });
    console.log('[TRP offscreen] handle=', handle ? handle.name : 'null');
    if (!handle) throw new Error('No configured save folder');

    let permState = await handle.queryPermission({ mode: 'readwrite' });
    console.log('[TRP offscreen] queryPermission=', permState);
    if (permState !== 'granted') {
      permState = await handle.requestPermission({ mode: 'readwrite' }).catch((e) => { console.warn('[TRP offscreen] requestPermission threw:', e); return 'denied'; });
      console.log('[TRP offscreen] requestPermission result=', permState);
    }
    if (permState !== 'granted') throw new Error('Permission denied: ' + permState);

    const parts = filename.split('/');
    const leaf = parts.pop();
    let dir = handle;
    for (const p of parts) dir = await dir.getDirectoryHandle(p, { create: true });
    const fileHandle = await dir.getFileHandle(leaf, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    console.log('[TRP offscreen] recording FSA write SUCCESS');
    savedOk = true;
    await deleteBlobFromIDB(key).catch(() => {});
  } catch(err) {
    console.warn('[TRP offscreen] recording FSA failed, falling back to downloads. error=', err.message);
    // fallbackUrl is already a blob URL created in this offscreen context — use it directly
    if (fallbackUrl) {
      chrome.runtime.sendMessage({ action: 'DOWNLOAD_RECORDING', fallbackUrl, filename });
    }
    await deleteBlobFromIDB(key).catch(() => {});
  }

  if (savedOk) {
    chrome.runtime.sendMessage({ action: 'CAPTURE_SAVE_DONE' });
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
    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const filename = `recording-${Date.now()}.webm`;
      const key = 'recording-' + Date.now();
      // Always create object URL here (service workers can't use URL.createObjectURL)
      const fallbackUrl = URL.createObjectURL(blob);
      try {
        await storeBlobInIDB(key, blob);
        chrome.runtime.sendMessage({ type: 'RECORDING_FINISHED', key, filename, fallbackUrl });
      } catch(e) {
        chrome.runtime.sendMessage({ type: 'RECORDING_FINISHED', fallbackUrl, filename });
      }
    };
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
}