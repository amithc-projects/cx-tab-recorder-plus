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
  // setupSendToCloud needs the folder handle (resolved below) — wire it after we have it.
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
    setupSendToCloud(manager, folderHandle);
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
          setupSendToCloud(manager, folderHandle);
        } else {
          showStatus(`Permission denied. Use the file manager's own folder picker to browse.`);
        }
      } catch (err) {
        showStatus('Could not request permission: ' + err.message);
      }
    });
  }

  // Parse deep-link params from query string
  const qs = new URLSearchParams(location.search);
  const deepPath    = qs.get('path');
  const deepFile    = qs.get('file');
  const deepView    = qs.get('viewMode');   // 'grid' | 'list' | 'filmstrip'
  const deepSortBy  = qs.get('sortBy');     // 'name' | 'type' | 'date' | 'size'
  const deepSortAsc = qs.get('sortAsc');    // 'true' | 'false'

  // Build the navigate options object (only include defined params)
  function buildNavOptions() {
    const opts = {};
    if (deepFile)    opts.filename = deepFile;
    if (deepView)    opts.viewMode = deepView;
    if (deepSortBy)  opts.sortBy   = deepSortBy;
    if (deepSortAsc !== null) opts.sortAsc = deepSortAsc === 'true';
    return Object.keys(opts).length > 0 ? opts : undefined;
  }

  let _deepNavDone = false;

  function attemptDeepNav() {
    if (!deepPath || _deepNavDone) return;
    _deepNavDone = true;
    const opts = buildNavOptions();
    manager.navigate(deepPath, opts);
  }

  // Listen for sidekick events
  manager.addEventListener('sidekick:ready', () => {
    // Re-try passing handle in case the component wasn't ready yet on init
    if (permState === 'granted') {
      tryPassHandleToComponent(manager, folderHandle);
    }
    // Attempt early navigate — may be a no-op if component is still in welcome state
    attemptDeepNav();
  });

  manager.addEventListener('sidekick:workspace', (e) => {
    // Update breadcrumb display
    const pathEl = document.getElementById('folderPathDisplay');
    if (pathEl && e.detail && e.detail.folderName) {
      pathEl.textContent = e.detail.pathLength > 1 ? `/ ${e.detail.folderName}` : '';
    }
    // First workspace event = root folder is loaded — navigate to deep path
    attemptDeepNav();
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

// ─────────────────────────────────────────────────────────────────────────────
// Send to Cloud — wires the <sidekick-manager> selection to the
// <send-to-cloud> facade web component (vendored at vendor/send-to-cloud.js).
// Configured via Settings → Send to Cloud (stcEndpoint + stcToken).
// ─────────────────────────────────────────────────────────────────────────────

let _stcSetupDone = false;

async function setupSendToCloud(manager, rootHandle) {
  if (_stcSetupDone) return;
  _stcSetupDone = true;

  const dialog      = document.getElementById('stcDialog');
  const dialogBody  = document.getElementById('stcDialogBody');
  const dialogClose = document.getElementById('stcDialogClose');
  if (!dialog) return;

  // Don't add action if Send to Cloud is not configured
  const cfg = await new Promise(r => chrome.storage.local.get(['stcEndpoint', 'stcToken'], r));
  if (!cfg.stcEndpoint || !cfg.stcToken) return;

  // Track navigation so selected filenames resolve against the correct subdir
  let navStack = [];
  manager.addEventListener('sidekick:workspace', (e) => {
    const { pathLength, folderName } = e.detail || {};
    if (!pathLength || pathLength <= 1 || !folderName) {
      navStack = [];
    } else {
      navStack = navStack.slice(0, pathLength - 2);
      navStack.push(folderName);
    }
  });

  async function resolveFiles(selectedIds) {
    let cur = rootHandle;
    for (const name of navStack) cur = await cur.getDirectoryHandle(name);
    const files = [], failures = [];
    for (const name of selectedIds) {
      try {
        const fh = await cur.getFileHandle(name);
        files.push(await fh.getFile());
      } catch (err) {
        failures.push({ name, error: err.message });
      }
    }
    return { files, failures };
  }

  async function openSendToCloud(selectedIds) {
    let resolved;
    try {
      resolved = await resolveFiles(selectedIds);
    } catch (err) {
      dialogBody.innerHTML = `<div class="stc-error">Failed to read selected files: ${escapeHtml(err.message)}</div>`;
      dialog.showModal();
      return;
    }

    if (resolved.files.length === 0) {
      dialogBody.innerHTML = `<div class="stc-error">Could not read any of the selected files.${
        resolved.failures.length ? ' First failure: ' + escapeHtml(resolved.failures[0].error) : ''
      }</div>`;
      dialog.showModal();
      return;
    }

    dialogBody.innerHTML = '';
    const stc = document.createElement('send-to-cloud');
    stc.setAttribute('endpoint', cfg.stcEndpoint);
    stc.setAttribute('token', cfg.stcToken);
    stc.setAttribute('no-dropzone', '');
    dialogBody.appendChild(stc);
    setTimeout(() => { if (typeof stc.setFiles === 'function') stc.setFiles(resolved.files); }, 0);

    if (resolved.failures.length > 0) {
      const warn = document.createElement('div');
      warn.className = 'stc-error';
      warn.style.marginTop = '12px';
      warn.textContent = `${resolved.failures.length} file(s) could not be read and were excluded.`;
      dialogBody.appendChild(warn);
    }

    dialog.showModal();
  }

  // Register as a selection action — appears in the component's action bar
  manager.selectionActions = [
    { label: 'Send to Cloud', icon: '☁', onClick: (selectedIds) => openSendToCloud(selectedIds) }
  ];

  dialogClose.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

init();
