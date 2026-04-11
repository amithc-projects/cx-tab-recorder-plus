// settings.js — runs in settings.html (extension page, extension-origin IDB)

const DB_NAME = 'TabRecorderDB';
const STORE_NAME = 'Handles';

function openDB() {
  return new Promise((r, j) => {
    const req = indexedDB.open(DB_NAME, 2);
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
  const db = await openDB();
  return new Promise((r, j) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(handle, 'saveDirectory');
    tx.oncomplete = r;
    tx.onerror = () => j(tx.error);
  });
}

async function getHandle() {
  const db = await openDB();
  return new Promise((r, j) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get('saveDirectory');
    req.onsuccess = () => r(req.result);
    req.onerror = () => j(req.error);
  });
}

// Show the saved folder name in the status element
async function refreshFolderDisplay() {
  const el = document.getElementById('folderNameDisplay');
  try {
    const handle = await getHandle();
    if (handle) {
      el.textContent = '📁 ' + handle.name;
      el.className = 'folder-status ok';
    } else {
      el.textContent = '⚠️ No folder selected — files will save to Downloads';
      el.className = 'folder-status warn';
    }
  } catch (e) {
    el.textContent = '⚠️ No folder selected — files will save to Downloads';
    el.className = 'folder-status warn';
  }
}

// Load all settings from storage and populate the form
function loadSettings() {
  const keys = ['captureDefault', 'saveFileFormat', 'enableCaption', 'captionPos', 'captionText', 'enableWatermark', 'watermarkText'];
  chrome.storage.local.get(keys, (result) => {
    const el = (id) => document.getElementById(id);

    if (el('captureDefault')) el('captureDefault').value = result.captureDefault || 'both';
    if (el('saveFileFormat')) el('saveFileFormat').value = result.saveFileFormat || '';
    if (el('enableCaption')) el('enableCaption').checked = !!result.enableCaption;
    if (el('captionPos')) el('captionPos').value = result.captionPos || 'bottom';
    if (el('captionText')) el('captionText').value = result.captionText || '';
    if (el('enableWatermark')) el('enableWatermark').checked = !!result.enableWatermark;
    if (el('watermarkText')) el('watermarkText').value = result.watermarkText || '';
  });
}

// Auto-save a single key/value whenever a control changes
function autosave(key, value) {
  chrome.storage.local.set({ [key]: value });
}

// Wire up auto-save listeners
function bindAutoSave() {
  const bindings = [
    { id: 'captureDefault',  event: 'change', key: 'captureDefault',  getValue: (el) => el.value },
    { id: 'saveFileFormat',  event: 'input',  key: 'saveFileFormat',  getValue: (el) => el.value },
    { id: 'enableCaption',   event: 'change', key: 'enableCaption',   getValue: (el) => el.checked },
    { id: 'captionPos',      event: 'change', key: 'captionPos',      getValue: (el) => el.value },
    { id: 'captionText',     event: 'input',  key: 'captionText',     getValue: (el) => el.value },
    { id: 'enableWatermark', event: 'change', key: 'enableWatermark', getValue: (el) => el.checked },
    { id: 'watermarkText',   event: 'input',  key: 'watermarkText',   getValue: (el) => el.value },
  ];

  for (const { id, event, key, getValue } of bindings) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, () => autosave(key, getValue(el)));
  }
}

// Folder picker
document.getElementById('btnPickFolder').addEventListener('click', async () => {
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    await saveHandle(handle);
    await refreshFolderDisplay();
  } catch (e) {
    // User cancelled or permission denied — no action needed
    if (e.name !== 'AbortError') console.warn('[TRP settings] showDirectoryPicker error:', e);
  }
});

// Init
loadSettings();
bindAutoSave();
refreshFolderDisplay();
