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
  const keys = [
    'captureDefault', 'saveFileFormat',
    'enableCaption', 'captionPos', 'captionText',
    'enableWatermark', 'watermarkText',
    'preCaptureRules',
  ];
  chrome.storage.local.get(keys, (result) => {
    const el = (id) => document.getElementById(id);

    if (el('captureDefault')) el('captureDefault').value = result.captureDefault || 'both';
    if (el('saveFileFormat')) el('saveFileFormat').value = result.saveFileFormat || '';
    if (el('enableCaption')) el('enableCaption').checked = !!result.enableCaption;
    if (el('captionPos')) el('captionPos').value = result.captionPos || 'bottom';
    if (el('captionText')) el('captionText').value = result.captionText || '';
    if (el('enableWatermark')) el('enableWatermark').checked = !!result.enableWatermark;
    if (el('watermarkText')) el('watermarkText').value = result.watermarkText || '';

    renderAllRules(result.preCaptureRules || []);
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

// --- PRE-CAPTURE RULES ---

const SCOPE_OPTIONS = [
  { value: 'passwords',      label: 'Passwords' },
  { value: 'usernames',      label: 'Usernames' },
  { value: 'email',          label: 'Email addresses' },
  { value: 'credit-cards',   label: 'Credit cards' },
  { value: 'phone',          label: 'Phone numbers' },
  { value: 'advertisements', label: 'Advertisements' },
  { value: 'cookie-banners', label: 'Cookie banners' },
  { value: 'custom',         label: 'Custom selectors…' },
];

const ACTION_OPTIONS = [
  { value: 'blur', label: 'Blur' },
  { value: 'hide', label: 'Hide' },
];

let preCaptureRules = [];
let saveDebounceTimer = null;

function saveRules() {
  clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(() => {
    chrome.storage.local.set({ preCaptureRules });
  }, 300);
}

function renderAllRules(rules) {
  preCaptureRules = rules;
  const list = document.getElementById('preCaptureRulesList');
  if (!list) return;
  list.innerHTML = '';
  preCaptureRules.forEach((rule) => list.appendChild(buildRuleEl(rule)));
}

function buildRuleEl(rule) {
  const wrap = document.createElement('div');
  wrap.dataset.id = rule.id;

  // Row: toggle + scope + action + delete
  const row = document.createElement('div');
  row.className = 'rule-row';

  // Enable toggle
  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'toggle-switch';
  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.checked = rule.enabled;
  toggleInput.addEventListener('change', () => {
    rule.enabled = toggleInput.checked;
    saveRules();
  });
  const toggleSpan = document.createElement('span');
  toggleSpan.className = 'slider';
  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(toggleSpan);

  // Scope select
  const scopeSelect = document.createElement('select');
  SCOPE_OPTIONS.forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    if (value === rule.scope) opt.selected = true;
    scopeSelect.appendChild(opt);
  });

  // Action select
  const actionSelect = document.createElement('select');
  actionSelect.style.width = '90px';
  ACTION_OPTIONS.forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    if (value === rule.action) opt.selected = true;
    actionSelect.appendChild(opt);
  });

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'btn-delete';
  delBtn.textContent = '✕';
  delBtn.addEventListener('click', () => {
    preCaptureRules = preCaptureRules.filter(r => r.id !== rule.id);
    renderAllRules(preCaptureRules);
    saveRules();
  });

  row.appendChild(toggleLabel);
  row.appendChild(scopeSelect);
  row.appendChild(actionSelect);
  row.appendChild(delBtn);
  wrap.appendChild(row);

  // Custom selector textarea (shown only when scope === 'custom')
  const customWrap = document.createElement('div');
  customWrap.className = 'rule-custom-wrap';
  customWrap.style.display = rule.scope === 'custom' ? 'block' : 'none';
  const textarea = document.createElement('textarea');
  textarea.className = 'mono';
  textarea.rows = 3;
  textarea.placeholder = 'One selector per line, e.g.:\nname=password\n.profile .email\ninput[autocomplete="cc-number"]';
  textarea.value = rule.selectors || '';
  textarea.addEventListener('input', () => {
    rule.selectors = textarea.value;
    saveRules();
  });
  customWrap.appendChild(textarea);
  wrap.appendChild(customWrap);

  // Wire scope change to show/hide custom textarea
  scopeSelect.addEventListener('change', () => {
    rule.scope = scopeSelect.value;
    customWrap.style.display = rule.scope === 'custom' ? 'block' : 'none';
    saveRules();
  });
  actionSelect.addEventListener('change', () => {
    rule.action = actionSelect.value;
    saveRules();
  });

  return wrap;
}

document.getElementById('btnAddRule').addEventListener('click', () => {
  const rule = {
    id: crypto.randomUUID(),
    scope: 'passwords',
    selectors: '',
    action: 'blur',
    enabled: true,
  };
  preCaptureRules.push(rule);
  const list = document.getElementById('preCaptureRulesList');
  if (list) list.appendChild(buildRuleEl(rule));
  saveRules();
});

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
