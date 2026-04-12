// settings.js — runs in settings.html (extension page, extension-origin IDB)

// Scroll to anchor if opened with a hash (e.g. settings.html#section-url-sets)
window.addEventListener('load', () => {
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

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
    'captureDefault', 'enableCompanionJson', 'saveFileFormat',
    'enableCaption', 'captionPos', 'captionText',
    'enableWatermark', 'watermarkText',
    'preCaptureRules', 'resolutionSets', 'urlSets',
  ];
  chrome.storage.local.get(keys, (result) => {
    const el = (id) => document.getElementById(id);

    if (el('captureDefault')) el('captureDefault').value = result.captureDefault || 'both';
    if (el('enableCompanionJson')) el('enableCompanionJson').checked = result.enableCompanionJson !== false; // default on
    if (el('saveFileFormat')) el('saveFileFormat').value = result.saveFileFormat || '';
    if (el('enableCaption')) el('enableCaption').checked = !!result.enableCaption;
    if (el('captionPos')) el('captionPos').value = result.captionPos || 'bottom';
    if (el('captionText')) el('captionText').value = result.captionText || '';
    if (el('enableWatermark')) el('enableWatermark').checked = !!result.enableWatermark;
    if (el('watermarkText')) el('watermarkText').value = result.watermarkText || '';

    renderAllRules(result.preCaptureRules || []);
    // Resolution sets must be loaded before URL sets (populates the dropdown)
    renderResolutionSets(result.resolutionSets || []);
    renderUrlSets(result.urlSets || []);
  });
}

// Auto-save a single key/value whenever a control changes
function autosave(key, value) {
  chrome.storage.local.set({ [key]: value });
}

// Wire up auto-save listeners
function bindAutoSave() {
  const bindings = [
    { id: 'captureDefault',     event: 'change', key: 'captureDefault',     getValue: (el) => el.value },
    { id: 'enableCompanionJson', event: 'change', key: 'enableCompanionJson', getValue: (el) => el.checked },
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

// --- RESOLUTION SETS ---

let resolutionSets = [];
let editingResolutionSetId = null;
let editingResolutions = []; // temp array while editing a resolution set

function renderResolutionSets(sets) {
  resolutionSets = sets;
  const list = document.getElementById('resolutionSetsList');
  if (!list) return;
  list.innerHTML = '';
  resolutionSets.forEach(set => list.appendChild(buildResolutionSetEl(set)));
  // Refresh the resolution dropdown in the URL set edit panel
  refreshResolutionDropdown();
}

function buildResolutionSetEl(set) {
  const row = document.createElement('div');
  row.className = 'url-set-row';
  row.dataset.id = set.id;

  const nameEl = document.createElement('div');
  nameEl.className = 'url-set-name';
  nameEl.textContent = set.name;

  const metaEl = document.createElement('div');
  metaEl.className = 'url-set-meta';
  metaEl.textContent = `${set.resolutions.length} size${set.resolutions.length !== 1 ? 's' : ''}`;

  const editBtn = document.createElement('button');
  editBtn.className = 'btn-edit';
  editBtn.textContent = '✏';
  editBtn.title = 'Edit set';
  editBtn.addEventListener('click', () => showResolutionSetEditPanel(set));

  const delBtn = document.createElement('button');
  delBtn.className = 'btn-delete';
  delBtn.textContent = '✕';
  delBtn.title = 'Delete set';
  delBtn.addEventListener('click', () => {
    resolutionSets = resolutionSets.filter(s => s.id !== set.id);
    chrome.storage.local.set({ resolutionSets });
    renderResolutionSets(resolutionSets);
  });

  row.appendChild(nameEl);
  row.appendChild(metaEl);
  row.appendChild(editBtn);
  row.appendChild(delBtn);
  return row;
}

function refreshResolutionDropdown() {
  const sel = document.getElementById('urlSetResolution');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">None (current browser size)</option>';
  resolutionSets.forEach(set => {
    const opt = document.createElement('option');
    opt.value = set.id;
    opt.textContent = `${set.name}  (${set.resolutions.map(r => `${r.width}×${r.height}`).join(', ')})`;
    sel.appendChild(opt);
  });
  sel.value = current; // restore selection if still valid
}

function buildResolutionRow(res) {
  const row = document.createElement('div');
  row.className = 'resolution-row';

  const wInput = document.createElement('input');
  wInput.type = 'number';
  wInput.min = '240';
  wInput.max = '7680';
  wInput.value = res.width;
  wInput.placeholder = '1280';
  wInput.addEventListener('input', () => { res.width = parseInt(wInput.value, 10) || 0; });

  const sep = document.createElement('span');
  sep.className = 'sep';
  sep.textContent = '×';

  const hInput = document.createElement('input');
  hInput.type = 'number';
  hInput.min = '240';
  hInput.max = '4320';
  hInput.value = res.height;
  hInput.placeholder = '800';
  hInput.addEventListener('input', () => { res.height = parseInt(hInput.value, 10) || 0; });

  const label = document.createElement('span');
  label.className = 'res-label';
  label.textContent = res.width <= 480 ? 'Mobile' : res.width <= 820 ? 'Tablet' : res.width <= 1366 ? 'Laptop' : 'Desktop';
  wInput.addEventListener('input', () => {
    const w = parseInt(wInput.value, 10) || 0;
    label.textContent = w <= 480 ? 'Mobile' : w <= 820 ? 'Tablet' : w <= 1366 ? 'Laptop' : 'Desktop';
  });

  const delBtn = document.createElement('button');
  delBtn.className = 'btn-delete';
  delBtn.textContent = '✕';
  delBtn.addEventListener('click', () => {
    const idx = editingResolutions.indexOf(res);
    if (idx >= 0) editingResolutions.splice(idx, 1);
    row.remove();
  });

  row.appendChild(wInput);
  row.appendChild(sep);
  row.appendChild(hInput);
  row.appendChild(label);
  row.appendChild(delBtn);
  return row;
}

function showResolutionSetEditPanel(set = null) {
  editingResolutionSetId = set ? set.id : null;
  editingResolutions = set ? set.resolutions.map(r => ({ ...r })) : [];
  const panel = document.getElementById('resolutionSetEditPanel');
  const title = document.getElementById('resolutionSetEditTitle');
  if (!panel) return;

  document.getElementById('resolutionSetName').value = set ? set.name : '';
  title.textContent = set ? 'Edit Resolution Set' : 'New Resolution Set';

  const list = document.getElementById('resolutionRowsList');
  list.innerHTML = '';
  editingResolutions.forEach(res => list.appendChild(buildResolutionRow(res)));

  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResolutionSetEditPanel() {
  const panel = document.getElementById('resolutionSetEditPanel');
  if (panel) panel.style.display = 'none';
  editingResolutionSetId = null;
  editingResolutions = [];
}

function saveResolutionSet() {
  const name = document.getElementById('resolutionSetName').value.trim();
  if (!name) { document.getElementById('resolutionSetName').focus(); return; }

  const resolutions = editingResolutions.filter(r => r.width > 0 && r.height > 0);
  if (resolutions.length === 0) { alert('Add at least one resolution.'); return; }

  if (editingResolutionSetId) {
    const idx = resolutionSets.findIndex(s => s.id === editingResolutionSetId);
    if (idx >= 0) resolutionSets[idx] = { ...resolutionSets[idx], name, resolutions };
  } else {
    resolutionSets.push({ id: 'trp-res-' + Date.now(), name, resolutions });
  }

  chrome.storage.local.set({ resolutionSets });
  renderResolutionSets(resolutionSets);
  hideResolutionSetEditPanel();
}

document.getElementById('btnAddResolutionSet').addEventListener('click', () => showResolutionSetEditPanel(null));
document.getElementById('btnSaveResolutionSet').addEventListener('click', saveResolutionSet);
document.getElementById('btnCancelResolutionSet').addEventListener('click', hideResolutionSetEditPanel);
document.getElementById('btnAddResolution').addEventListener('click', () => {
  const res = { width: 1280, height: 800 };
  editingResolutions.push(res);
  document.getElementById('resolutionRowsList').appendChild(buildResolutionRow(res));
});

// --- URL SETS ---

let urlSets = [];
let editingSetId = null;

function renderUrlSets(sets) {
  urlSets = sets;
  const list = document.getElementById('urlSetsList');
  if (!list) return;
  list.innerHTML = '';
  urlSets.forEach(set => list.appendChild(buildUrlSetEl(set)));
}

function buildUrlSetEl(set) {
  const row = document.createElement('div');
  row.className = 'url-set-row';
  row.dataset.id = set.id;

  const nameEl = document.createElement('div');
  nameEl.className = 'url-set-name';
  nameEl.textContent = set.name;

  const metaEl = document.createElement('div');
  metaEl.className = 'url-set-meta';
  const resSet = set.resolutionSetId ? resolutionSets.find(r => r.id === set.resolutionSetId) : null;
  metaEl.textContent = `${set.urls.length} URL${set.urls.length !== 1 ? 's' : ''} · ${set.defaultAction === 'full' ? 'Full Page' : 'Visible'}${resSet ? ' · ' + resSet.name : ''}`;

  const editBtn = document.createElement('button');
  editBtn.className = 'btn-edit';
  editBtn.textContent = '✏';
  editBtn.title = 'Edit set';
  editBtn.addEventListener('click', () => showUrlSetEditPanel(set));

  const delBtn = document.createElement('button');
  delBtn.className = 'btn-delete';
  delBtn.textContent = '✕';
  delBtn.title = 'Delete set';
  delBtn.addEventListener('click', () => {
    urlSets = urlSets.filter(s => s.id !== set.id);
    chrome.storage.local.set({ urlSets });
    renderUrlSets(urlSets);
  });

  row.appendChild(nameEl);
  row.appendChild(metaEl);
  row.appendChild(editBtn);
  row.appendChild(delBtn);
  return row;
}

function showUrlSetEditPanel(set = null) {
  editingSetId = set ? set.id : null;
  const panel = document.getElementById('urlSetEditPanel');
  const title = document.getElementById('urlSetEditTitle');
  if (!panel) return;

  document.getElementById('urlSetName').value = set ? set.name : '';
  document.getElementById('urlSetAction').value = set ? set.defaultAction : 'full';
  document.getElementById('urlSetUrls').value = set ? set.urls.join('\n') : '';
  title.textContent = set ? 'Edit URL Set' : 'New URL Set';

  // Repopulate resolution dropdown and restore selection
  refreshResolutionDropdown();
  document.getElementById('urlSetResolution').value = set ? (set.resolutionSetId || '') : '';

  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  loadTabGroupsForImport();
}

function hideUrlSetEditPanel() {
  const panel = document.getElementById('urlSetEditPanel');
  if (panel) panel.style.display = 'none';
  editingSetId = null;
}

function saveUrlSet() {
  const name = document.getElementById('urlSetName').value.trim();
  const defaultAction = document.getElementById('urlSetAction').value;
  const resolutionSetId = document.getElementById('urlSetResolution').value || null;
  const urls = document.getElementById('urlSetUrls').value
    .split('\n').map(u => u.trim()).filter(u => u.length > 0);

  if (!name) {
    document.getElementById('urlSetName').focus();
    return;
  }

  if (editingSetId) {
    const idx = urlSets.findIndex(s => s.id === editingSetId);
    if (idx >= 0) urlSets[idx] = { ...urlSets[idx], name, defaultAction, resolutionSetId, urls };
  } else {
    urlSets.push({ id: 'trp-set-' + Date.now(), name, defaultAction, resolutionSetId, urls });
  }

  chrome.storage.local.set({ urlSets });
  renderUrlSets(urlSets);
  hideUrlSetEditPanel();
}

function parseSitemapXml(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');
  const parseError = xml.querySelector('parsererror');
  if (parseError) throw new Error('Invalid XML');
  const locs = [...xml.querySelectorAll('loc')].map(el => el.textContent.trim()).filter(Boolean);
  return locs;
}

function appendSitemapUrls(locs) {
  if (locs.length === 0) { alert('No <loc> elements found in sitemap.'); return; }
  const textarea = document.getElementById('urlSetUrls');
  const existing = textarea.value.trim();
  textarea.value = (existing ? existing + '\n' : '') + locs.join('\n');
}

function importSitemapFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      appendSitemapUrls(parseSitemapXml(e.target.result));
    } catch (err) {
      alert('Failed to parse sitemap XML.');
    }
  };
  reader.readAsText(file);
}

async function importSitemapFromUrl(url) {
  const btn = document.getElementById('btnFetchSitemap');
  const origText = btn.textContent;
  btn.textContent = 'Fetching...';
  btn.disabled = true;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    appendSitemapUrls(parseSitemapXml(text));
    document.getElementById('sitemapUrl').value = '';
  } catch (err) {
    alert(`Failed to fetch sitemap: ${err.message}`);
  } finally {
    btn.textContent = origText;
    btn.disabled = false;
  }
}

// --- IMPORT FROM OPEN TABS ---

async function loadTabGroupsForImport() {
  const sel = document.getElementById('tabGroupImportSelect');
  if (!sel) return;
  sel.innerHTML = '';

  if (!chrome.tabGroups) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Tab groups not available';
    sel.appendChild(opt);
    return;
  }

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const groups = await chrome.tabGroups.query({ windowId: activeTab.windowId });

    if (groups.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No tab groups in this window';
      sel.appendChild(opt);
      return;
    }

    groups.forEach(group => {
      const opt = document.createElement('option');
      opt.value = group.id;
      opt.textContent = group.title || `Group (${group.color})`;
      sel.appendChild(opt);
    });
  } catch (e) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Error loading groups';
    sel.appendChild(opt);
  }
}

function appendTabUrls(tabs) {
  const urls = tabs.map(t => t.url).filter(u => u && !u.startsWith('chrome://') && !u.startsWith('chrome-extension://'));
  if (urls.length === 0) { alert('No capturable tabs found.'); return; }
  const textarea = document.getElementById('urlSetUrls');
  const existing = textarea.value.trim();
  textarea.value = (existing ? existing + '\n' : '') + urls.join('\n');
}

async function importAllTabUrls() {
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabs = await chrome.tabs.query({ windowId: activeTab.windowId });
    appendTabUrls(tabs);
  } catch (e) {
    alert('Failed to get open tabs.');
  }
}

async function importTabGroupUrls() {
  const sel = document.getElementById('tabGroupImportSelect');
  const groupId = sel ? parseInt(sel.value, 10) : NaN;
  if (!groupId || isNaN(groupId)) { alert('Select a tab group first.'); return; }
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabs = await chrome.tabs.query({ windowId: activeTab.windowId, groupId });
    appendTabUrls(tabs);
  } catch (e) {
    alert('Failed to get tabs from group.');
  }
}

document.getElementById('btnImportAllTabs').addEventListener('click', importAllTabUrls);
document.getElementById('btnImportTabGroup').addEventListener('click', importTabGroupUrls);

document.getElementById('btnAddUrlSet').addEventListener('click', () => showUrlSetEditPanel(null));
document.getElementById('btnSaveUrlSet').addEventListener('click', saveUrlSet);
document.getElementById('btnCancelUrlSet').addEventListener('click', hideUrlSetEditPanel);

document.getElementById('btnFetchSitemap').addEventListener('click', () => {
  const url = document.getElementById('sitemapUrl').value.trim();
  if (!url) { document.getElementById('sitemapUrl').focus(); return; }
  importSitemapFromUrl(url);
});
document.getElementById('sitemapUrl').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('btnFetchSitemap').click();
});

document.getElementById('btnImportSitemap').addEventListener('click', () => {
  document.getElementById('sitemapFileInput').click();
});
document.getElementById('sitemapFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    importSitemapFile(file);
    e.target.value = ''; // reset so same file can be re-imported
  }
});

// --- EXPORT / IMPORT ---

const EXPORT_KEYS = [
  'captureDefault', 'enableCompanionJson', 'saveFileFormat',
  'enableCaption', 'captionPos', 'captionText',
  'enableWatermark', 'watermarkText',
  'preCaptureRules', 'resolutionSets', 'urlSets',
];

function exportSettings() {
  chrome.storage.local.get(EXPORT_KEYS, (data) => {
    const payload = {
      _version: 1,
      _exportedAt: new Date().toISOString(),
      _app: 'OmniCapt',
      ...data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.href = url;
    a.download = `omnicapt-settings-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function importSettingsFile(file) {
  const statusEl = document.getElementById('importStatus');
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const payload = JSON.parse(e.target.result);
      if (payload._app !== 'OmniCapt' && payload._app !== 'TabRecorderPlus') {
        throw new Error('This does not appear to be an OmniCapt settings file.');
      }

      // Extract only known keys — never write unknown fields to storage
      const toSave = {};
      EXPORT_KEYS.forEach(key => {
        if (key in payload) toSave[key] = payload[key];
      });

      chrome.storage.local.set(toSave, () => {
        // Reload the entire settings UI from storage
        loadSettings();
        statusEl.textContent = `Settings imported successfully (exported ${payload._exportedAt ? new Date(payload._exportedAt).toLocaleString() : 'unknown date'}).`;
        statusEl.style.color = '#10B981';
        statusEl.style.display = 'block';
        setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
      });
    } catch (err) {
      statusEl.textContent = `Import failed: ${err.message}`;
      statusEl.style.color = '#F87171';
      statusEl.style.display = 'block';
    }
  };
  reader.readAsText(file);
}

document.getElementById('btnExportSettings').addEventListener('click', exportSettings);
document.getElementById('btnImportSettings').addEventListener('click', () => {
  document.getElementById('settingsFileInput').click();
});
document.getElementById('settingsFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    importSettingsFile(file);
    e.target.value = '';
  }
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
