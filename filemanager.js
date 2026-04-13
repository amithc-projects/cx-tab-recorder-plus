// filemanager.js — OmniCapt File Manager integration

const DB_NAME = 'TabRecorderDB';
const STORE_NAME = 'Handles';
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getHandle() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get('saveDirectory');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function showStatus(msg) {
  const bar = document.getElementById('statusBar');
  bar.textContent = msg;
  bar.style.display = 'block';
}

function hideStatus() {
  document.getElementById('statusBar').style.display = 'none';
}

async function init() {
  const manager = document.querySelector('sidekick-manager');

  // Go to settings link
  document.getElementById('btnGoToSettings').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  });

  let folderHandle;
  try {
    folderHandle = await getHandle();
  } catch (err) {
    showStatus('Could not read configured folder: ' + err.message);
  }

  if (!folderHandle) {
    document.getElementById('noFolderWarning').style.display = 'flex';
    return;
  }

  // Show folder name in header
  document.getElementById('folderInfoBar').style.display = 'flex';
  document.getElementById('folderNameDisplay').textContent = folderHandle.name;

  // Check current permission state for this document
  let permState;
  try {
    permState = await folderHandle.queryPermission({ mode: 'read' });
  } catch {
    permState = 'prompt';
  }

  const btnGrant = document.getElementById('btnGrantAccess');
  btnGrant.textContent = `Grant access to "${folderHandle.name}"`;

  if (permState === 'granted') {
    btnGrant.style.display = 'none';
    tryPassHandleToComponent(manager, folderHandle);
  } else if (permState === 'denied') {
    showStatus(`Access to "${folderHandle.name}" was denied. Re-select the folder in the file manager below.`);
  } else {
    // 'prompt' — show grant button
    btnGrant.style.display = 'block';
    btnGrant.addEventListener('click', async () => {
      try {
        const result = await folderHandle.requestPermission({ mode: 'read' });
        if (result === 'granted') {
          btnGrant.style.display = 'none';
          hideStatus();
          tryPassHandleToComponent(manager, folderHandle);
        } else {
          showStatus(`Permission denied. Use the file manager's own folder picker to browse.`);
        }
      } catch (err) {
        showStatus('Could not request permission: ' + err.message);
      }
    });
  }

  const deepPath = new URLSearchParams(location.search).get('path');
  let _deepNavDone = false;

  // Listen for sidekick events
  manager.addEventListener('sidekick:ready', () => {
    // Re-try passing handle in case the component wasn't ready yet on init
    if (permState === 'granted') {
      tryPassHandleToComponent(manager, folderHandle);
    }
    // Attempt early navigate — may be a no-op if component is still in welcome state
    if (deepPath && !_deepNavDone) {
      manager.navigate(deepPath);
    }
  });

  manager.addEventListener('sidekick:workspace', (e) => {
    // Update breadcrumb display
    const pathEl = document.getElementById('folderPathDisplay');
    if (pathEl && e.detail && e.detail.folderName) {
      pathEl.textContent = e.detail.pathLength > 1 ? `/ ${e.detail.folderName}` : '';
    }
    // First workspace event means the root folder is now loaded — navigate to deep path
    if (deepPath && !_deepNavDone) {
      _deepNavDone = true;
      manager.navigate(deepPath);
    }
  });

  manager.addEventListener('sidekick:error', (e) => {
    const msg = e.detail && e.detail.message ? e.detail.message : 'An error occurred in the file manager.';
    showStatus(msg);
  });
}

function tryPassHandleToComponent(manager, handle) {
  // Attempt known programmatic APIs that the component may expose.
  // Per the integration guide these are added in future versions, so we guard with optional chaining.
  if (typeof manager.setRoot === 'function') {
    manager.setRoot(handle);
  } else if (typeof manager.openDirectory === 'function') {
    manager.openDirectory(handle);
  } else if (typeof manager.setFolderHandle === 'function') {
    manager.setFolderHandle(handle);
  }
  // If none exist, permission is still pre-granted so the user's folder picker won't re-prompt
  // when they manually select the same folder in the component's UI.
}

init();
