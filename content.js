// content.js
(function() {

// 0. SAFETY GUARD — IIFE allows safe re-injection without duplicate listeners
if (window.hasTabRecorderPlusRun) return;
window.hasTabRecorderPlusRun = true;

// --- VARIABLES ---
let _preCaptureRefs = null; // held between APPLY_PRE_CAPTURE_RULES and UNDO_PRE_CAPTURE_RULES messages
let timerInterval = null;
let startTime = 0;
let isRunning = false;
let isPaused = false;
let pausedElapsed = 0;
let activeOptions = {};
let timerContainer = null;
let timeText = null;

// Annotation State
let isAnnotationMode = false;
let canvas, ctx;
let annotationContainer;
let currentTool = 'rect';
let toolbarMode = 'annotate'; // 'capture' | 'annotate'
let currentColor = '#FF0000';
let isDrawing = false;
let startX = 0;
let startY = 0;
let currentShape = null; 

// Undo/Redo & Crop
let historyStack = [];
let redoStack = [];
let cropRect = null; // {x, y, w, h}

// 1. GLOBAL LISTENERS
document.addEventListener('mousedown', (e) => {
  if (activeOptions.showClicks && !isAnnotationMode) {
    showRipple(e.clientX, e.clientY);
  }
});

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
  // Ignore input fields
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

  // Undo (Ctrl+Z)
  if (e.ctrlKey && e.code === 'KeyZ' && isAnnotationMode) {
    e.preventDefault();
    performUndo();
    return;
  }
  // Redo (Ctrl+Y)
  if (e.ctrlKey && e.code === 'KeyY' && isAnnotationMode) {
    e.preventDefault();
    performRedo();
    return;
  }
  // Screenshot (Ctrl+Shift+E)
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
    e.preventDefault();
    performScreenshotSequence(false);
    return;
  }
  // Toggle Annotate (Alt+Shift+A)
  if (e.altKey && e.shiftKey && e.code === 'KeyA') {
    e.preventDefault();
    toggleAnnotationMode(true);
    return;
  }
  // Escape (Exit or Hide Toolbar)
  if (e.code === 'Escape' && isAnnotationMode) {
    e.preventDefault();
    e.stopPropagation();
    const toolbar = document.getElementById('trp-toolbar');
    if (toolbar && toolbar.style.display !== 'none') {
      hideToolbar();
    } else {
      toggleAnnotationMode(false);
    }
  }
});

// 2. MESSAGE LISTENERS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    sendResponse({ alive: true });
    return;
  }
  if (request.action === "ARM_TIMER") {
    activeOptions = request.options;
    if (activeOptions.showClicks) injectRippleStyles();
    createTimerUI(); // always show bar — full timer or minimal hint
    document.addEventListener('click', interceptClickAndStart, { once: true, capture: true });
  }
  else if (request.action === "RECORDING_PAUSED") {
    if (!isPaused) pauseRecording();
  }
  else if (request.action === "RECORDING_RESUMED") {
    if (isPaused) resumeRecording();
  }
  else if (request.action === "FORCE_STOP_UI") fullStopUIOnly();
  else if (request.action === "TOGGLE_ANNOTATION") toggleAnnotationMode(true);
  else if (request.action === "START_CROP_MODE") {
    toolbarMode = 'capture';
    toggleAnnotationMode(true);
    setTool('crop');
    applyToolbarMode();
  }
  else if (request.action === "START_ANNOTATION_MODE") {
    // Open annotation toolbar with drawing tool active (independent of capture region).
    // Any annotations drawn here will be composited into subsequent Visible or Region captures.
    toolbarMode = 'annotate';
    toggleAnnotationMode(true);
    setTool('rect');
    applyToolbarMode();
  }
  
  // Toolbar/Keyboard Actions
  else if (request.action === "TRIGGER_SCREENSHOT") performScreenshotSequence(false);
  else if (request.action === "CAPTURE_FULL_PAGE") performFullPageCapture(request.intent);
  else if (request.action === "TRIGGER_CLIPBOARD") performScreenshotSequence(true);
  
  // --- FILENAME RESOLUTION ---
  // Popup delegates filename generation here so DOM-based tokens can be resolved.
  else if (request.action === "RESOLVE_FILENAME") {
    generateFilename().then(filename => sendResponse({ filename }));
    return true; // async response
  }

  // --- POPUP CROP SUPPORT ---
  // The popup asks for the crop area before it captures the screen.
  // Only return cropRect if the annotation toolbar is currently active — a stale cropRect
  // from a previous Capture Area session must not bleed into a plain Capture Visible.
  else if (request.action === "GET_CROP_AND_HIDE_UI") {
    prepareForCapture();
    sendResponse({ success: true, cropRect: isAnnotationMode ? cropRect : null, innerWidth: window.innerWidth });
  }
  else if (request.action === "RESTORE_UI") {
    restoreAfterCapture();
    sendResponse({success: true});
  }
  else if (request.action === "APPLY_PRE_CAPTURE_RULES") {
    applyPreCaptureRules().then(refs => {
      _preCaptureRefs = refs;
      sendResponse({ applied: refs.length });
    });
    return true; // async response
  }
  else if (request.action === "UNDO_PRE_CAPTURE_RULES") {
    if (_preCaptureRefs) { undoPreCaptureRules(_preCaptureRefs); _preCaptureRefs = null; }
  }
  else if (request.action === "SHOW_TOAST") {
    showToast(request.message);
  }
});

// --- SCREENSHOT SEQUENCE ---

function performScreenshotSequence(toClipboard) {
  // 1. Hide UI
  prepareForCapture();

  // 2. Small delay to let the UI hide, then capture with retry
  setTimeout(async () => {
    const preCapture = await applyPreCaptureRules();
    await new Promise(r => requestAnimationFrame(r)); // wait for repaint before screenshot
    const response = await captureWithRetry();
    undoPreCaptureRules(preCapture);
    if (!response) {
      restoreAfterCapture();
      return;
    }

    let finalDataUrl = response.dataUrl;

    // 3. Apply Crop (if exists)
    if (cropRect) {
      finalDataUrl = await cropImage(response.dataUrl, cropRect);
    }

    finalDataUrl = await applyBrandingToImage(finalDataUrl);

    // 4. Output
    if (toClipboard) {
      await copyToClipboard(finalDataUrl);
      chrome.runtime.sendMessage({ action: 'CAPTURE_COPY_DONE' });
    } else {
      downloadImage(finalDataUrl);
    }

    // 5. Restore UI
    restoreAfterCapture();
  }, 150);
}

// Captures the visible tab via a long-lived port so the service worker cannot
// be terminated mid-flight (Chrome MV3 requirement).  The port holds an event
// listener which prevents Chrome from suspending the SW until we disconnect.
function captureWithRetry() {
  return new Promise((resolve) => {
    let settled = false;

    let port;
    try {
      port = chrome.runtime.connect({ name: 'trp-capture' });
    } catch (e) {
      resolve(null);
      return;
    }

    port.onMessage.addListener((msg) => {
      if (settled) return;
      settled = true;
      port.disconnect();
      resolve(msg.success ? msg : null);
    });

    port.onDisconnect.addListener(() => {
      if (settled) return;
      settled = true;
      const _ignored = chrome.runtime.lastError; // consume to avoid uncaught warning
      resolve(null);
    });

    port.postMessage({ action: 'CAPTURE' });
  });
}

function prepareForCapture() {
  if (timerContainer) timerContainer.style.opacity = '0';
  // Hide only the toolbar (not the canvas), so drawn annotations appear in the screenshot
  const toolbar = document.getElementById('trp-toolbar');
  if (toolbar) toolbar.style.visibility = 'hidden';
  // Make the container non-interactive but keep canvas visible
  if (annotationContainer) annotationContainer.style.pointerEvents = 'none';
  if (cropRect) redrawCanvas(true);
}

function restoreAfterCapture() {
  if (timerContainer) timerContainer.style.opacity = '1';
  const toolbar = document.getElementById('trp-toolbar');
  if (toolbar) toolbar.style.visibility = 'visible';
  if (annotationContainer) annotationContainer.style.pointerEvents = 'all';
  if (cropRect) redrawCanvas();
}

// --- PRE-CAPTURE RULES ENGINE ---

const PRECAPTURE_SCOPES = {
  'passwords':      '[type="password"],[autocomplete="current-password"],[autocomplete="new-password"]',
  'usernames':      '[autocomplete="username"],[name="username"],[name="user_name"]',
  'email':          '[type="email"],[autocomplete="email"],[name="email"]',
  'credit-cards':   '[autocomplete^="cc-"],[name="card-number"],[name="cardnumber"]',
  'phone':          '[type="tel"],[autocomplete="tel"],[name="phone"]',
  'advertisements': '.advertisement,ins.adsbygoogle,[id*="google_ads"],[class*="advert"],[data-ad]',
  'cookie-banners': '#cookie-consent,.cookie-banner,.cookie-notice,[id*="cookieconsent"],.gdpr-banner',
};

// Extensible action map — add new actions here only; engine loop unchanged
const CAPTURE_ACTIONS = {
  // Chrome composites <input>/<select>/<textarea> on separate GPU layers, so
  // element-level filter: blur() is bypassed in captureVisibleTab.
  // A fixed-position backdrop-filter overlay is reliable for all element types.
  blur: (el, refs) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return; // off-screen, skip
    const overlay = document.createElement('div');
    overlay.dataset.trpOverlay = '1'; // prevent hideFixed() from suppressing it
    overlay.style.cssText = [
      'position:fixed',
      `left:${rect.left}px`,
      `top:${rect.top}px`,
      `width:${rect.width}px`,
      `height:${rect.height}px`,
      'backdrop-filter:blur(10px)',
      '-webkit-backdrop-filter:blur(10px)',
      'background:rgba(128,128,128,0.25)',
      'z-index:2147483646',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(overlay);
    refs.push({ _overlay: overlay });
  },
  hide: (el, refs) => {
    refs.push({ el, prop: 'visibility', prev: el.style.visibility });
    el.style.visibility = 'hidden';
  },
};

// Normalises user shorthand to a valid CSS selector.
// name=foo → [name="foo"]  |  id=foo → [id="foo"]  |  class=foo → .foo
function normalizeSelector(raw) {
  const s = raw.trim();
  if (!s || s.startsWith('//')) return null;
  const m = s.match(/^([\w-]+)\s*=\s*["']?([^"'\s]*)["']?$/);
  if (m) {
    const [, attr, val] = m;
    if (attr === 'class') return '.' + val;
    return `[${attr}="${val}"]`;
  }
  return s;
}

async function applyPreCaptureRules() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['preCaptureRules'], ({ preCaptureRules }) => {
      const rules = preCaptureRules || [];
      console.log('[TRP pre-capture] rules loaded from storage:', JSON.stringify(rules));
      const refs = [];
      for (const rule of rules) {
        if (!rule.enabled) {
          console.log('[TRP pre-capture] skipping disabled rule:', rule.scope, rule.action);
          continue;
        }
        const handler = CAPTURE_ACTIONS[rule.action];
        if (!handler) {
          console.warn('[TRP pre-capture] unknown action:', rule.action);
          continue;
        }
        const rawSelectors = rule.scope === 'custom'
          ? (rule.selectors || '').split('\n').map(normalizeSelector).filter(Boolean).join(',')
          : PRECAPTURE_SCOPES[rule.scope] || '';
        console.log('[TRP pre-capture] rule scope=%s action=%s → selector: %s', rule.scope, rule.action, rawSelectors || '(empty)');
        if (!rawSelectors) continue;
        try {
          const matched = document.querySelectorAll(rawSelectors);
          console.log('[TRP pre-capture] matched %d element(s) for selector: %s', matched.length, rawSelectors);
          matched.forEach((el, i) => {
            console.log('[TRP pre-capture]   [%d] %s id=%s name=%s rect=%o', i, el.tagName, el.id, el.getAttribute('name'), el.getBoundingClientRect());
            handler(el, refs);
          });
        } catch (e) {
          console.warn('[TRP pre-capture] invalid selector "%s":', rawSelectors, e.message);
        }
      }
      console.log('[TRP pre-capture] total refs applied:', refs.length);
      resolve(refs);
    });
  });
}

function undoPreCaptureRules(refs) {
  refs.forEach((ref) => {
    if (ref._overlay) ref._overlay.remove();
    else ref.el.style[ref.prop] = ref.prev;
  });
}

// Image Processing Helper
function cropImage(dataUrl, rect) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / window.innerWidth;
      const cvs = document.createElement('canvas');
      let x = rect.x, y = rect.y, w = rect.w, h = rect.h;
      
      // Normalize negative dimensions
      if (w < 0) { x += w; w = Math.abs(w); }
      if (h < 0) { y += h; h = Math.abs(h); }
      // Clamp to zero
      if (x < 0) x = 0; if (y < 0) y = 0;
      
      const sx = x * ratio;
      const sy = y * ratio;
      const sw = w * ratio;
      const sh = h * ratio;
      
      cvs.width = sw; cvs.height = sh;
      const tCtx = cvs.getContext('2d');
      tCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(cvs.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

// Sanitize a single path segment — strips unsafe chars but does NOT touch slashes.
const _sanitizeSeg = (s) => String(s).replace(/[^a-zA-Z0-9.\-_]/g, '_').substring(0, 80);

// Resolve all template tokens against the current page.
// Handles: date/time, URL parts, DOM queries, meta tags, cookies, localStorage.
function resolveTokens(str) {
  if (!str) return str;
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  // Date/time values
  const year   = String(d.getFullYear());
  const month  = pad(d.getMonth() + 1);
  const day    = pad(d.getDate());
  const hour   = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());
  const timestamp = `${year}${month}${day}_${hour}${minute}${second}`;

  // URL values
  const domain = window.location.hostname;
  // path: each segment sanitized individually, slashes preserved for subdirectory creation
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const path = pathParts.map(_sanitizeSeg).join('/');
  // hash: strip leading # then sanitize
  const hash = _sanitizeSeg((window.location.hash || '').replace(/^#/, ''));

  let res = str;

  // Simple substitutions
  res = res.replace(/{{\s*timestamp\s*}}/g, timestamp);
  res = res.replace(/{{\s*year\s*}}/g,      year);
  res = res.replace(/{{\s*month\s*}}/g,     month);
  res = res.replace(/{{\s*day\s*}}/g,       day);
  res = res.replace(/{{\s*hour\s*}}/g,      hour);
  res = res.replace(/{{\s*minute\s*}}/g,    minute);
  res = res.replace(/{{\s*second\s*}}/g,    second);
  res = res.replace(/{{\s*domain\s*}}/g,    _sanitizeSeg(domain));
  res = res.replace(/{{\s*path\s*}}/g,         path);
  res = res.replace(/{{\s*path:(\d+)\s*}}/g,  (_, n) => _sanitizeSeg(pathParts[parseInt(n, 10) - 1] || ''));
  res = res.replace(/{{\s*hash\s*}}/g,      hash);
  res = res.replace(/{{\s*tab\.title\s*}}/g, _sanitizeSeg(document.title));
  res = res.replace(/{{\s*tab\.url\s*}}/g,   _sanitizeSeg(window.location.href.substring(0, 80)));

  // {{dom:css-selector}} → textContent of first matching element
  res = res.replace(/{{\s*dom:([^}]+?)\s*}}/g, (_, selector) => {
    try {
      const el = document.querySelector(selector.trim());
      return _sanitizeSeg((el?.textContent || '').trim());
    } catch (e) { return ''; }
  });

  // {{meta:property-or-name}} → content attribute of matching <meta> tag
  // Matches both property="..." and name="..." attributes
  res = res.replace(/{{\s*meta:([^}]+?)\s*}}/g, (_, prop) => {
    prop = prop.trim();
    try {
      const el = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
      return _sanitizeSeg((el?.getAttribute('content') || '').trim());
    } catch (e) { return ''; }
  });

  // {{cookie:name}} → decoded cookie value
  res = res.replace(/{{\s*cookie:([^}]+?)\s*}}/g, (_, name) => {
    name = name.trim();
    try {
      const pair = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
      return _sanitizeSeg(pair ? decodeURIComponent(pair.slice(name.length + 1)) : '');
    } catch (e) { return ''; }
  });

  // {{localStorage:key}} → localStorage value
  res = res.replace(/{{\s*localStorage:([^}]+?)\s*}}/g, (_, key) => {
    try {
      return _sanitizeSeg(localStorage.getItem(key.trim()) || '');
    } catch (e) { return ''; }
  });

  return res;
}

async function applyBrandingToImage(dataUrl) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['enableCaption', 'captionText', 'captionPos', 'enableWatermark', 'watermarkText'], async (settings) => {
      if (!settings.enableCaption && !settings.enableWatermark) return resolve(dataUrl);

      const resolvedCaption = resolveTokens(settings.captionText || 'Captured from {{domain}}');
      const resolvedWatermark = resolveTokens(settings.watermarkText || 'CONFIDENTIAL');

      const img = new Image();
      img.onload = () => {
        let finalWidth = img.width;
        let finalHeight = img.height;
        let imgY = 0;
        const CAPTION_HEIGHT = 60;

        if (settings.enableCaption && resolvedCaption) {
          finalHeight += CAPTION_HEIGHT;
          if (settings.captionPos === 'top') imgY = CAPTION_HEIGHT;
        }

        const cvs = document.createElement('canvas');
        cvs.width = finalWidth;
        cvs.height = finalHeight;
        const ctx = cvs.getContext('2d');

        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, finalWidth, finalHeight);
        ctx.drawImage(img, 0, imgY);

        if (settings.enableCaption && resolvedCaption) {
          ctx.fillStyle = '#F9FAFB';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const textY = settings.captionPos === 'top' ? (CAPTION_HEIGHT / 2) : (finalHeight - CAPTION_HEIGHT / 2);
          ctx.fillText(resolvedCaption, finalWidth / 2, textY);
        }

        if (settings.enableWatermark && resolvedWatermark) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.font = 'bold 72px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.save();
          ctx.translate(finalWidth / 2, imgY + img.height / 2);
          ctx.rotate(-Math.PI / 6); // -30 deg
          ctx.fillText(resolvedWatermark, 0, 0);
          ctx.restore();
        }

        resolve(cvs.toDataURL('image/png'));
      };
      img.src = dataUrl;
    });
  });
}

async function generateFilename() {
  return new Promise(resolve => {
    chrome.storage.local.get(['saveFileFormat'], (result) => {
      let format = result.saveFileFormat || '{{domain}}/{{timestamp}}-{{tab.title}}.png';
      let resolved = resolveTokens(format);
      // Collapse multiple slashes; strip any leading slash (crashes chrome.downloads)
      resolved = resolved.replace(/\/+/g, '/').replace(/^\/+/, '');
      if (!resolved.toLowerCase().endsWith('.png')) resolved += '.png';
      resolve(resolved);
    });
  });
}

async function downloadImage(dataUrl, intent) {
  const filename = await generateFilename();
  // Large dataUrls can exceed Chrome's 64MiB sendMessage limit for tall pages.
  // Use a port connection and send in 4MB chunks instead.
  const CHUNK = 4 * 1024 * 1024; // 4MB per message, well under 64MiB cap
  console.log('[TRP content] uploading screenshot via port, filename=', filename, 'intent=', intent, 'size=', dataUrl.length);
  const port = chrome.runtime.connect({ name: 'trp-screenshot-upload' });
  port.postMessage({ action: 'SCREENSHOT_START', filename, intent: intent || 'save' });
  for (let i = 0; i < dataUrl.length; i += CHUNK) {
    port.postMessage({ action: 'SCREENSHOT_CHUNK', data: dataUrl.slice(i, i + CHUNK) });
  }
  port.postMessage({ action: 'SCREENSHOT_END' });
  port.disconnect();
}

async function copyToClipboard(dataUrl) {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
    showRipple(window.innerWidth/2, window.innerHeight/2); // Visual feedback
  } catch (err) { console.error("Copy failed", err); }
}

const _trpToasts = []; // active toast elements, bottom-to-top order

function showToast(message) {
  const TOAST_HEIGHT = 56; // approximate px per toast slot
  const GAP = 8;
  const MARGIN_TOP = 24;

  const t = document.createElement('div');
  // Strip emoji that render as mojibake on some sites and replace with text equivalents
  const safeMessage = message
    .replace(/📋/g, '[Copy]')
    .replace(/💾/g, '[Save]')
    .replace(/🗂️/g, '[Save]')
    .replace(/⚠️/g, '[!]')
    .replace(/📁/g, '[Folder]');

  t.textContent = safeMessage;

  const slot = _trpToasts.length; // stack position (0 = topmost)
  const topPx = MARGIN_TOP + slot * (TOAST_HEIGHT + GAP);

  Object.assign(t.style, {
    all: 'initial',
    position: 'fixed',
    top: topPx + 'px',
    right: '-400px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    zIndex: '2147483647',
    fontWeight: 'bold',
    fontFamily: '"Segoe UI", system-ui, -apple-system, Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.4',
    whiteSpace: 'nowrap',
    transition: 'right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease',
    pointerEvents: 'none',
    boxSizing: 'border-box'
  });

  document.body.appendChild(t);
  _trpToasts.push(t);

  // Animate in
  requestAnimationFrame(() => setTimeout(() => { t.style.right = '24px'; }, 30));

  // Animate out after 3 s
  setTimeout(() => {
    t.style.right = '-400px';
    t.style.opacity = '0';
    setTimeout(() => {
      t.remove();
      const idx = _trpToasts.indexOf(t);
      if (idx !== -1) _trpToasts.splice(idx, 1);
      // Shift remaining toasts up
      _trpToasts.forEach((el, i) => {
        el.style.top = (MARGIN_TOP + i * (TOAST_HEIGHT + GAP)) + 'px';
      });
    }, 420);
  }, 3000);
}

// --- FULL PAGE CAPTURE ---
async function performFullPageCapture(intent) {
  if (window.isTabRecorderCapturing) return;
  window.isTabRecorderCapturing = true;
  try {
  prepareForCapture();
  const preCapture = await applyPreCaptureRules();

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    ::-webkit-scrollbar { display: none !important; } 
    * { scroll-behavior: auto !important; }
  `;
  document.head.appendChild(styleEl);

  const scrollEl = (function() {
    if (document.documentElement.scrollHeight > window.innerHeight + 50) return document.documentElement;
    const allElements = document.querySelectorAll('*');
    let maxArea = 0;
    let best = document.documentElement;
    for (let el of allElements) {
      if (el.scrollHeight > el.clientHeight + 50) {
        const style = window.getComputedStyle(el);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowY === 'overlay') {
          const area = el.clientWidth * el.clientHeight;
          if (area > maxArea) {
            maxArea = area;
            best = el;
          }
        }
      }
    }
    return best;
  })();

  const isWindow = (scrollEl === document.documentElement || scrollEl === document.body);

  const hiddenElements = [];
  const hideFixed = () => {
    const allNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
    let node;
    while ((node = allNodes.nextNode())) {
      const style = window.getComputedStyle(node);
      if ((style.position === 'fixed' || style.position === 'sticky') && style.visibility !== 'hidden' && style.display !== 'none' && !node.dataset.trpOverlay) {
        hiddenElements.push({ el: node, css: node.getAttribute('style') });
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('opacity', '0', 'important');
      }
    }
  };

  hideFixed();

  const snaps = [];
  const totalHeight = scrollEl.scrollHeight;
  const viewportHeight = scrollEl.clientHeight;
  const estimatedFrames = Math.max(1, Math.ceil(totalHeight / viewportHeight));
  let frameIndex = 0;

  if (isWindow) window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  else scrollEl.scrollTop = 0;

  let currentY = 0;

  while (true) {
    await new Promise(r => setTimeout(r, 600)); // Must be > 500ms to avoid Chrome's MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND quota
    hideFixed();

    const actualY = isWindow ? window.scrollY : scrollEl.scrollTop;

    const response = await captureWithRetry();
    if (response && response.dataUrl) {
      snaps.push({ src: response.dataUrl, actualY: actualY });
    } else {
      // Skip this frame rather than aborting the whole capture
      console.warn('TRP: frame skip at y=' + actualY);
    }
    frameIndex++;
    chrome.runtime.sendMessage({ type: 'CAPTURE_PROGRESS', phase: 'capturing', current: frameIndex, total: estimatedFrames });

    const nextY = actualY + viewportHeight;
    if (nextY >= totalHeight) break;

    if (isWindow) window.scrollTo({ left: 0, top: nextY, behavior: 'instant' });
    else scrollEl.scrollTop = nextY;

    const newY = isWindow ? window.scrollY : scrollEl.scrollTop;
    if (newY <= actualY) break;
  }

  for (const item of hiddenElements) {
    if (item.css !== null) item.el.setAttribute('style', item.css);
    else item.el.removeAttribute('style');
  }
  if (styleEl) styleEl.remove();

  if (isWindow) window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  else scrollEl.scrollTop = 0;

  undoPreCaptureRules(preCapture);
  restoreAfterCapture();

  chrome.runtime.sendMessage({ type: 'CAPTURE_PROGRESS', phase: 'stitching', current: 0, total: snaps.length });
  let stitchedUrl = await stichImages(snaps, viewportHeight, (current, total) => {
    chrome.runtime.sendMessage({ type: 'CAPTURE_PROGRESS', phase: 'stitching', current, total });
  });
  if (!stitchedUrl) {
    chrome.runtime.sendMessage({ type: 'CAPTURE_PROGRESS', phase: 'error' });
    return showToast("⚠️ Capture Cancelled: No frames acquired.");
  }
  stitchedUrl = await applyBrandingToImage(stitchedUrl);

  // Always route through downloadImage so the popup (which has focus/activation)
  // can handle the clipboard write. copyToClipboard() fails here because user
  // activation expires during the multi-frame capture sequence.
  chrome.runtime.sendMessage({ type: 'CAPTURE_PROGRESS', phase: 'saving' });
  await downloadImage(stitchedUrl, intent);

  } catch (err) {
    console.error("Full page capture error:", err);
    showToast("⚠️ Capture failed: " + err.message);
  } finally {
    window.isTabRecorderCapturing = false;
  }
}

function stichImages(snaps, realViewportHeight, onProgress) {
  return new Promise((resolve) => {
    if (!snaps || snaps.length === 0) return resolve(null);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let loadedCount = 0;
    const images = [];

    snaps.forEach(s => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, snaps.length);
        if (loadedCount === snaps.length) {
          images.sort((a,b) => a.actualY - b.actualY);
          
          const imgW = images[0].img.width;
          const imgH = images[0].img.height;
          const ratio = imgH / realViewportHeight;
          
          const lastImg = images[images.length - 1];
          const finalHeight = (lastImg.actualY * ratio) + imgH;
          
          canvas.width = imgW;
          canvas.height = finalHeight;
          
          for (let i = 0; i < images.length; i++) {
             const drawY = Math.floor(images[i].actualY * ratio);
             ctx.drawImage(images[i].img, 0, drawY);
          }
          resolve(canvas.toDataURL('image/png'));
        }
      };
      img.src = s.src;
      images.push({ img, actualY: s.actualY });
    });
  });
}


// --- ANNOTATION UI ---

function toggleAnnotationMode(turnOn) {
  if (turnOn) {
    if (isAnnotationMode) {
      const toolbar = document.getElementById('trp-toolbar');
      if (toolbar) toolbar.style.display = 'flex';
      if (annotationContainer) annotationContainer.style.cursor = getCursorForTool(currentTool);
    } else {
      enableAnnotationUI();
    }
  } else {
    disableAnnotationUI();
  }
}

function hideToolbar() {
  const toolbar = document.getElementById('trp-toolbar');
  if (toolbar) toolbar.style.display = 'none';
  if (annotationContainer) annotationContainer.style.cursor = 'default';
}

function enableAnnotationUI() {
  if (isAnnotationMode) return;
  isAnnotationMode = true;

  // Reset State
  historyStack = [];
  redoStack = [];
  cropRect = null;

  // Container
  annotationContainer = document.createElement('div');
  annotationContainer.id = 'trp-annotation-layer';
  Object.assign(annotationContainer.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    zIndex: '2147483640', cursor: 'crosshair', pointerEvents: 'all'
  });

  // Canvas
  canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  Object.assign(canvas.style, { width: '100%', height: '100%' });
  ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.strokeStyle = currentColor;
  
  annotationContainer.appendChild(canvas);
  createToolbar();
  document.body.appendChild(annotationContainer);

  // Events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('click', handleCanvasClick);
}

function createToolbar() {
  const toolbar = document.createElement('div');
  toolbar.id = 'trp-toolbar';
  toolbar.innerHTML = `
    <div class="trp-branding">
      <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
      <span class="trp-brand-text">TabRecorderPlus</span>
    </div>
    <div class="divider"></div>
    <button id="btn-undo" class="trp-annotate-only" title="Undo (Ctrl+Z)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg></button>
    <button id="btn-redo" class="trp-annotate-only" title="Redo (Ctrl+Y)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg></button>
    <div class="divider trp-annotate-only"></div>
    <button id="btn-crop" class="trp-capture-only" title="Crop/Select Tool"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 3 10.43 21 13.93 13.93 21 10.43 3 3"></polygon></svg></button>
    <button id="btn-rect" class="trp-annotate-only active" title="Rectangle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></button>
    <button id="btn-ellipse" class="trp-annotate-only" title="Ellipse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></button>
    <button id="btn-pen" class="trp-annotate-only" title="Pen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
    <button id="btn-text" class="trp-annotate-only" title="Text"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg></button>
    <button id="btn-blur" class="trp-annotate-only" title="Blur Sensitive Info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></button>
    <div class="divider trp-annotate-only"></div>
    <div class="color-picker-wrap trp-annotate-only">
      <input type="color" id="inp-color" value="${currentColor}" title="Color Picker">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 10 10c0 2.21-1.79 4-4 4h-2.14a2 2 0 0 0-1.76 1.08l-1.04 1.92C12.82 21.6 12.43 22 12 22Z"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/></svg>
      <div id="inline-color-ind" class="color-indicator-bar" style="background:${currentColor};"></div>
    </div>
    <div class="divider trp-capture-only"></div>
    <button id="btn-clip" class="trp-capture-only" title="Copy to Clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
    <button id="btn-save" class="trp-capture-only" title="Save File"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
    <div class="divider"></div>
    <button id="btn-toggle-capture" title="Show capture tools">&gt;&gt;</button>
    <button id="btn-clear" class="trp-annotate-only" title="Clear All" style="color: #FCA5A5;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
    <button id="btn-close" title="Exit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes trp-toolbar-enter {
      0% { opacity: 0; transform: translate(-50%, -30px) scale(0.95); }
      100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
    }
    #trp-toolbar {
      position: absolute; top: 40px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(145deg, rgba(45, 52, 70, 0.98), rgba(18, 22, 34, 0.95));
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      padding: 6px 8px; border-radius: 14px;
      display: flex; gap: 4px; 
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.2); 
      pointer-events: auto; align-items: center; font-family: 'Inter', system-ui, sans-serif;
      animation: trp-toolbar-enter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .trp-branding { display: flex !important; align-items: center !important; gap: 8px !important; padding: 0 8px 0 4px !important; cursor: default !important; flex-shrink: 0 !important; }
    .trp-branding svg { width: 20px !important; height: 20px !important; display: block !important; overflow: visible !important; }
    .trp-brand-text { font-size: 13px !important; font-weight: 700 !important; color: #E5E7EB !important; white-space: nowrap !important; letter-spacing: -0.2px !important; line-height: 1 !important; }

    #trp-toolbar .divider {
      width: 1px !important; height: 20px !important; background: rgba(255,255,255,0.15) !important; margin: 0 4px !important; flex-shrink: 0 !important;
    }
    #trp-toolbar * {
      box-sizing: border-box !important;
      line-height: normal !important;
      font-size: unset !important;
      max-width: none !important;
      max-height: none !important;
    }
    #trp-toolbar button {
      all: unset !important;
      background: transparent !important; border: none !important; cursor: pointer !important; border-radius: 8px !important;
      transition: background 0.2s, color 0.2s !important; color: #9CA3AF !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      width: 36px !important; height: 36px !important; flex-shrink: 0 !important;
    }
    #trp-toolbar button:hover { background: rgba(255,255,255,0.1) !important; color: #F3F4F6 !important; }
    #trp-toolbar button.active { background: #2563EB !important; color: #FFFFFF !important; box-shadow: 0 2px 10px rgba(37,99,235,0.4) !important; }
    #trp-toolbar button svg {
      width: 18px !important; height: 18px !important;
      display: block !important; flex-shrink: 0 !important;
      overflow: visible !important; vertical-align: unset !important;
    }

    #btn-clear:hover { background: rgba(248,113,113,0.15) !important; color: #EF4444 !important; }
    /* Capture-only elements: hidden by default, shown in capture mode or when annotate expanded */
    #trp-toolbar .trp-capture-only { display: none !important; }
    #trp-toolbar.trp-capture-mode .trp-capture-only:not(.divider) { display: flex !important; }
    #trp-toolbar.trp-capture-mode .trp-capture-only.divider { display: block !important; }
    #trp-toolbar.trp-annotate-mode.trp-capture-expanded .trp-capture-only:not(.divider) { display: flex !important; }
    #trp-toolbar.trp-annotate-mode.trp-capture-expanded .trp-capture-only.divider { display: block !important; }
    /* Annotate-only elements: hidden by default, shown in annotate mode */
    #trp-toolbar .trp-annotate-only { display: none !important; }
    #trp-toolbar.trp-annotate-mode .trp-annotate-only:not(.divider):not(.color-picker-wrap) { display: flex !important; }
    #trp-toolbar.trp-annotate-mode .trp-annotate-only.divider { display: block !important; }
    #trp-toolbar.trp-annotate-mode .trp-annotate-only.color-picker-wrap { display: flex !important; }
    /* Toggle button: only in annotate mode */
    #trp-toolbar #btn-toggle-capture { font-size: 11px !important; font-weight: 700 !important; width: 28px !important; letter-spacing: -0.5px !important; display: none !important; }
    #trp-toolbar.trp-annotate-mode #btn-toggle-capture { display: flex !important; }

    .color-picker-wrap {
      position: relative !important; width: 36px !important; height: 36px !important;
      display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important;
      border-radius: 8px !important; cursor: pointer !important; transition: background 0.2s !important;
      margin: 0 2px !important; color: #9CA3AF !important; flex-shrink: 0 !important;
    }
    .color-picker-wrap:hover { background: rgba(255,255,255,0.1) !important; color: #F3F4F6 !important; }
    .color-picker-wrap svg { width: 16px !important; height: 16px !important; margin-bottom: 2px !important; pointer-events: none !important; display: block !important; overflow: visible !important; }
    .color-indicator-bar { width: 16px; height: 3px; border-radius: 1.5px; pointer-events: none; }
    #inp-color { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; top:0; left:0; }
    
    .trp-text-input {
      position: absolute; background: #fffFA0; border: 2px solid #333;
      padding: 5px; font-family: sans-serif; font-size: 14px; color: #000;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.3); min-width: 100px; z-index: 2147483642; border-radius: 4px;
    }
  `;
  annotationContainer.appendChild(style);
  annotationContainer.appendChild(toolbar);

  // Bind Events
  toolbar.querySelector('#btn-undo').onclick = performUndo;
  toolbar.querySelector('#btn-redo').onclick = performRedo;
  toolbar.querySelector('#btn-crop').onclick = () => setTool('crop');
  toolbar.querySelector('#btn-pen').onclick = () => setTool('pen');
  toolbar.querySelector('#btn-rect').onclick = () => setTool('rect');
  toolbar.querySelector('#btn-ellipse').onclick = () => setTool('ellipse');
  toolbar.querySelector('#btn-text').onclick = () => setTool('text');
  toolbar.querySelector('#btn-blur').onclick = () => setTool('blur');
  
  toolbar.querySelector('#inp-color').oninput = (e) => {
    currentColor = e.target.value;
    ctx.strokeStyle = currentColor;
    const ind = toolbar.querySelector('#inline-color-ind');
    if (ind) {
      ind.style.background = currentColor;
    }
  };
  
  // Action Buttons
  toolbar.querySelector('#btn-save').onclick = () => performScreenshotSequence(false);
  toolbar.querySelector('#btn-clip').onclick = () => performScreenshotSequence(true);
  
  toolbar.querySelector('#btn-clear').onclick = clearCanvas;
  toolbar.querySelector('#btn-close').onclick = () => toggleAnnotationMode(false);

  toolbar.querySelector('#btn-toggle-capture').onclick = () => {
    const expanded = toolbar.classList.toggle('trp-capture-expanded');
    toolbar.querySelector('#btn-toggle-capture').innerHTML = expanded ? '&lt;&lt;' : '&gt;&gt;';
    toolbar.querySelector('#btn-toggle-capture').title = expanded ? 'Hide capture tools' : 'Show capture tools';
  };
}

function applyToolbarMode() {
  const toolbar = document.getElementById('trp-toolbar');
  if (!toolbar) return;

  toolbar.classList.remove('trp-capture-expanded');
  if (toolbarMode === 'capture') {
    toolbar.classList.remove('trp-annotate-mode');
    toolbar.classList.add('trp-capture-mode');
  } else {
    toolbar.classList.remove('trp-capture-mode');
    toolbar.classList.add('trp-annotate-mode');
  }
}

function disableAnnotationUI() {
  if (!annotationContainer) return;
  annotationContainer.style.transition = 'opacity 0.3s';
  annotationContainer.style.opacity = '0';
  setTimeout(() => {
    if (annotationContainer) annotationContainer.remove();
    annotationContainer = null;
    isAnnotationMode = false;
  }, 300);
}

function setTool(tool) {
  currentTool = tool;
  const toolbar = document.getElementById('trp-toolbar');
  if (toolbar) {
    toolbar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    const btn = toolbar.querySelector('#btn-' + tool);
    if (btn) btn.classList.add('active');
  }
  if (annotationContainer) annotationContainer.style.cursor = getCursorForTool(tool);
}

function getCursorForTool(tool) {
  if (tool === 'text') return 'text';
  return 'crosshair';
}

function clearCanvas() {
  document.querySelectorAll('.trp-text-input').forEach(el => el.remove());
  cropRect = null;
  currentShape = null;
  redoStack = [];
  historyStack.push({ type: 'clear' });
  if (historyStack.length > 50) historyStack.shift();
  redrawCanvas();
}

function redrawCanvas(hideCrop = false) {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  document.querySelectorAll('.trp-blur-element').forEach(el => el.remove());
  
  for (const action of historyStack) {
    if (action.type === 'shape') {
      if (action.shape.type === 'blur') {
        const b = document.createElement('div');
        b.className = 'trp-blur-element';
        b.style.position = 'absolute';
        b.style.left = Math.min(action.shape.startX, action.shape.startX + action.shape.w) + 'px';
        b.style.top = Math.min(action.shape.startY, action.shape.startY + action.shape.h) + 'px';
        b.style.width = Math.abs(action.shape.w) + 'px';
        b.style.height = Math.abs(action.shape.h) + 'px';
        b.style.backdropFilter = 'blur(10px) brightness(0.9)';
        b.style.webkitBackdropFilter = 'blur(8px) saturate(0.5)';
        b.style.pointerEvents = 'none';
        b.style.zIndex = '1';
        annotationContainer.insertBefore(b, canvas);
      } else {
        drawShape(action.shape);
      }
    } else if (action.type === 'clear') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.querySelectorAll('.trp-blur-element').forEach(el => el.remove());
    }
  }
  
  if (currentShape) {
    if (currentShape.type === 'crop') {
      drawCropRect(currentShape.startX, currentShape.startY, currentShape.w, currentShape.h);
    } else if (currentShape.type === 'blur') {
      const b = document.createElement('div');
      b.className = 'trp-blur-element trp-blur-temp';
      b.style.position = 'absolute';
      b.style.left = Math.min(currentShape.startX, currentShape.startX + currentShape.w) + 'px';
      b.style.top = Math.min(currentShape.startY, currentShape.startY + currentShape.h) + 'px';
      b.style.width = Math.abs(currentShape.w) + 'px';
      b.style.height = Math.abs(currentShape.h) + 'px';
      b.style.backdropFilter = 'blur(10px) brightness(0.9)';
      b.style.webkitBackdropFilter = 'blur(8px) saturate(0.5)';
      b.style.border = '2px dashed rgba(255,255,255,0.5)';
      b.style.pointerEvents = 'none';
      b.style.zIndex = '1';
      annotationContainer.insertBefore(b, canvas);
    } else {
      drawShape(currentShape);
    }
  }
  
  if (cropRect && !hideCrop) {
    drawCropRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
  }
}

function drawShape(shape) {
  ctx.beginPath();
  ctx.setLineDash([]); 
  ctx.strokeStyle = shape.color; 
  ctx.lineWidth = 4;

  if (shape.type === 'pen') {
    if (!shape.path || shape.path.length === 0) return;
    ctx.moveTo(shape.path[0].x, shape.path[0].y);
    for (let i = 1; i < shape.path.length; i++) {
      ctx.lineTo(shape.path[i].x, shape.path[i].y);
    }
    ctx.stroke();
  } else if (shape.type === 'rect') {
    ctx.strokeRect(shape.startX, shape.startY, shape.w, shape.h);
  } else if (shape.type === 'ellipse') {
    ctx.ellipse(shape.startX + shape.w/2, shape.startY + shape.h/2, Math.abs(shape.w/2), Math.abs(shape.h/2), 0, 0, 2*Math.PI);
    ctx.stroke();
  }
}

// --- HISTORY / UNDO / REDO ---

function performUndo() {
  // If Crop is active, Undo cancels the crop first
  if (cropRect) {
    cropRect = null;
    redrawCanvas();
    return;
  }

  if (historyStack.length === 0) return;
  
  const lastAction = historyStack.pop();
  redoStack.push(lastAction);
  
  if (lastAction.type === 'text') {
    lastAction.el.style.display = 'none';
  }
  redrawCanvas();
}

function performRedo() {
  if (redoStack.length === 0) return;
  const actionToRedo = redoStack.pop();
  historyStack.push(actionToRedo);

  if (actionToRedo.type === 'text') {
    actionToRedo.el.style.display = 'block';
  }
  redrawCanvas();
}

// --- DRAWING ENGINE ---

function startDrawing(e) {
  if (currentTool === 'text') return;
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  
  // Clear old crop if starting new drawing
  if (cropRect || currentTool === 'crop') {
    cropRect = null; 
    redrawCanvas();
  }

  currentShape = {
    type: currentTool,
    color: currentColor,
    startX: startX,
    startY: startY,
  };

  if (currentTool === 'pen') {
    currentShape.path = [{x: startX, y: startY}];
  } else {
    currentShape.w = 0;
    currentShape.h = 0;
  }
}

function draw(e) {
  if (!isDrawing) return;
  
  if (currentTool === 'crop') {
    currentShape.w = e.offsetX - startX;
    currentShape.h = e.offsetY - startY;
  } else if (currentTool === 'pen') {
    if (e.shiftKey) {
      const dx = Math.abs(e.offsetX - startX);
      const dy = Math.abs(e.offsetY - startY);
      const newX = dx > dy ? e.offsetX : startX;
      const newY = dx > dy ? startY : e.offsetY;
      currentShape.path = [{x: startX, y: startY}, {x: newX, y: newY}];
    } else {
      currentShape.path.push({x: e.offsetX, y: e.offsetY});
    }
  } else if (currentTool === 'rect' || currentTool === 'ellipse' || currentTool === 'blur') {
    let w = e.offsetX - startX;
    let h = e.offsetY - startY;
    if (e.shiftKey) {
      const s = Math.min(Math.abs(w), Math.abs(h));
      w = w < 0 ? -s : s; h = h < 0 ? -s : s;
    }
    currentShape.w = w;
    currentShape.h = h;
  }
  redrawCanvas();
}

function drawCropRect(x, y, w, h) {
  let cx = x, cy = y, cw = w, ch = h;
  if (cw < 0) { cx += cw; cw = Math.abs(cw); }
  if (ch < 0) { cy += ch; ch = Math.abs(ch); }

  ctx.save();
  // Draw translucent dark overlay over the entire screen
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Punch out the crop area to reveal bright webpage underneath
  ctx.clearRect(cx, cy, cw, ch);

  // Draw high contrast alternating dashed border (white + black)
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(cx, cy, cw, ch);

  ctx.lineDashOffset = 8;
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(cx, cy, cw, ch);
  ctx.restore();
}

function stopDrawing(e) {
  if (isDrawing) {
    isDrawing = false;
    
    if (currentTool === 'crop') {
      const w = e.offsetX - startX;
      const h = e.offsetY - startY;
      if (Math.abs(w) > 5 && Math.abs(h) > 5) {
        cropRect = { x: startX, y: startY, w: w, h: h };
        currentShape = null;
        redrawCanvas(); // Show selection — user presses 💾 or 📋 on the toolbar to capture
      } else {
        cropRect = null;
        currentShape = null;
        redrawCanvas(); // Clear accidental click artifacts
      }
    } else {
      redoStack = [];
      historyStack.push({ type: 'shape', shape: currentShape });
      if (historyStack.length > 50) historyStack.shift();
      currentShape = null;
      redrawCanvas();
    }
  }
}

function handleCanvasClick(e) {
  if (currentTool !== 'text') return;
  const input = document.createElement('div');
  input.contentEditable = true;
  input.className = 'trp-text-input';
  input.style.left = e.clientX + 'px';
  input.style.top = e.clientY + 'px';
  input.innerText = '';
  annotationContainer.appendChild(input);
  setTimeout(() => input.focus(), 0);
  
  redoStack = [];
  historyStack.push({ type: 'text', el: input });
  if (historyStack.length > 50) historyStack.shift();
  
  input.addEventListener('blur', () => { if (input.innerText.trim() === '') input.remove(); });
}

// --- STANDARD TIMER LOGIC ---

chrome.storage.local.get(['timerState'], (result) => {
  if (result.timerState && result.timerState.isRunning) {
    startTime = result.timerState.startTime;
    activeOptions = result.timerState.options;
    if (activeOptions.showClicks) injectRippleStyles();
    if (activeOptions.showTimer) {
      createTimerUI();
      updateTimerBarState('recording');
      startInternalTimer(false);
    }
  }
});

async function interceptClickAndStart(e) {
  e.preventDefault();
  e.stopPropagation();
  const originalTarget = e.target;
  if (activeOptions.showClicks) showRipple(e.clientX, e.clientY);
  if (activeOptions.recordScreen) {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.floor(window.innerWidth * pixelRatio);
    const height = Math.floor(window.innerHeight * pixelRatio);
    chrome.runtime.sendMessage({
      action: "START_RECORDING",
      options: activeOptions,
      width: width, height: height, tabId: null
    });
  }
  startTime = Date.now();
  pausedElapsed = 0;
  isPaused = false;
  if (activeOptions.showTimer) {
    if (!timerContainer) createTimerUI();
    updateTimerBarState('recording');
    startInternalTimer(true);
  } else {
    // Dismiss the minimal hint bar now that recording has started
    if (timerContainer) { timerContainer.remove(); timerContainer = null; }
    saveState();
  }
  // Only replay the click if it wasn't on our own timer bar UI
  if (!timerContainer || !timerContainer.contains(originalTarget)) {
    setTimeout(() => { originalTarget.click(); }, 100);
  }
}

function startInternalTimer(save = false) {
  if (!isRunning) {
    isPaused = false;
    timerInterval = setInterval(updateTimer, 100);
    isRunning = true;
    if (save) saveState();
  }
}

function pauseRecording() {
  if (!isRunning || isPaused) return;
  isPaused = true;
  pausedElapsed = Date.now() - startTime;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  updateTimerBarState('paused');
  if (activeOptions.recordScreen) {
    chrome.runtime.sendMessage({ action: "PAUSE_RECORDING" });
  }
}

function resumeRecording() {
  if (!isPaused) return;
  isPaused = false;
  startTime = Date.now() - pausedElapsed;
  timerInterval = setInterval(updateTimer, 100);
  updateTimerBarState('recording');
  if (activeOptions.recordScreen) {
    chrome.runtime.sendMessage({ action: "RESUME_RECORDING" });
  }
}

function updateTimer() {
  const elapsedTime = Date.now() - startTime;
  if (timeText) timeText.innerText = (elapsedTime / 1000).toFixed(1);
}

function saveState() {
  chrome.storage.local.set({ 
    timerState: { startTime, isRunning: true, options: activeOptions } 
  });
}

function fullStopUIOnly() {
  if (timerInterval) clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;
  pausedElapsed = 0;
  if (timerContainer) timerContainer.remove();
  timerContainer = null;
  const rippleStyle = document.getElementById('trp-styles');
  if (rippleStyle) rippleStyle.remove();
  if (annotationContainer) annotationContainer.remove();
  annotationContainer = null;
  isAnnotationMode = false;
  chrome.storage.local.remove('timerState');
}

function createTimerUI() {
  if (document.getElementById('timer-container')) document.getElementById('timer-container').remove();
  if (document.getElementById('timer-style')) document.getElementById('timer-style').remove();
  let posCss = "";
  const pos = activeOptions.timerPosition || 'bottom-center';
  switch (pos) {
    case 'top-left': posCss = "top: 20px; left: 20px;"; break;
    case 'top-center': posCss = "top: 20px; left: 50%; transform: translateX(-50%);"; break;
    case 'top-right': posCss = "top: 20px; right: 20px;"; break;
    case 'bottom-left': posCss = "bottom: 20px; left: 20px;"; break;
    case 'bottom-right': posCss = "bottom: 20px; right: 20px;"; break;
    case 'bottom-center': default: posCss = "bottom: 20px; left: 50%; transform: translateX(-50%);"; break;
  }
  const style = document.createElement('style');
  style.id = 'timer-style';
  style.textContent = `
    #timer-container {
      position: fixed; ${posCss}
      background-color: ${activeOptions.recordScreen ? '#e60000' : '#000'};
      color: white; padding: 8px 15px; border-radius: 6px;
      font-family: monospace; font-size: 20px; font-weight: bold;
      z-index: 2147483647; display: flex; align-items: center; gap: 10px; cursor: default;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .timer-btn {
      background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5);
      border-radius: 4px; cursor: pointer; padding: 2px 8px; font-size: 16px; display: flex; align-items: center;
    }
    .timer-btn:hover { background: rgba(255,255,255,0.2); }
    .timer-btn.trp-hidden { display: none !important; }
  `;
  document.head.appendChild(style);

  timerContainer = document.createElement('div');
  timerContainer.id = 'timer-container';

  if (!activeOptions.showTimer) {
    // Minimal hint — no timer counter or buttons; disappears once recording starts
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const stopKey  = isMac ? '⌘+Shift+S' : 'Ctrl+Shift+S';
    const pauseKey = 'Alt+Shift+P';
    const hint = document.createElement('span');
    hint.style.cssText = 'font-size:13px; font-weight:500; opacity:0.95; letter-spacing:0.1px;';
    hint.innerText = `Click anywhere to start  •  ${stopKey} to stop  •  ${pauseKey} to pause`;
    timerContainer.appendChild(hint);
    document.body.appendChild(timerContainer);
    return;
  }

  timeText = document.createElement('span');
  timeText.id = 'trp-time-text';
  timeText.innerText = "Click anywhere to start";
  timeText.style.marginRight = "5px";

  // Record/Resume button — visible in 'waiting' and 'paused' states
  const recordBtn = document.createElement('button');
  recordBtn.id = 'trp-btn-record';
  recordBtn.className = 'timer-btn';
  recordBtn.innerHTML = "&#9210;"; // ⏺
  recordBtn.title = 'Record / Resume';
  recordBtn.onclick = (e) => {
    e.stopPropagation();
    if (isPaused) resumeRecording();
    // waiting state: the document capture listener handles the click before this fires
  };

  // Pause button — visible only in 'recording' state
  const pauseBtn = document.createElement('button');
  pauseBtn.id = 'trp-btn-pause';
  pauseBtn.className = 'timer-btn trp-hidden';
  pauseBtn.innerHTML = "&#9208;"; // ⏸
  pauseBtn.title = 'Pause';
  pauseBtn.onclick = (e) => {
    e.stopPropagation();
    pauseRecording();
  };

  // Stop button — visible in 'recording' and 'paused' states
  const stopBtn = document.createElement('button');
  stopBtn.id = 'trp-btn-stop';
  stopBtn.className = 'timer-btn trp-hidden';
  stopBtn.innerHTML = "&#9209;"; // ⏹
  stopBtn.title = 'Stop & Save';
  stopBtn.onclick = (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ action: "STOP_RECORDING" });
    fullStopUIOnly();
  };

  timerContainer.appendChild(timeText);
  timerContainer.appendChild(recordBtn);
  timerContainer.appendChild(pauseBtn);
  timerContainer.appendChild(stopBtn);
  document.body.appendChild(timerContainer);
}

function updateTimerBarState(state) {
  const recordBtn = document.getElementById('trp-btn-record');
  const pauseBtn = document.getElementById('trp-btn-pause');
  const stopBtn = document.getElementById('trp-btn-stop');
  if (!recordBtn || !pauseBtn || !stopBtn) return;
  if (state === 'waiting') {
    timeText.innerText = "Click anywhere to start";
    recordBtn.classList.remove('trp-hidden');
    pauseBtn.classList.add('trp-hidden');
    stopBtn.classList.add('trp-hidden');
  } else if (state === 'recording') {
    recordBtn.classList.add('trp-hidden');
    pauseBtn.classList.remove('trp-hidden');
    stopBtn.classList.remove('trp-hidden');
  } else if (state === 'paused') {
    recordBtn.classList.remove('trp-hidden');
    pauseBtn.classList.add('trp-hidden');
    stopBtn.classList.remove('trp-hidden');
  }
}

function showRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'trp-click-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

function injectRippleStyles() {
  if (document.getElementById('trp-styles')) return;
  const style = document.createElement('style');
  style.id = 'trp-styles';
  style.textContent = `
    .trp-click-ripple {
      position: fixed; width: 0; height: 0; border-radius: 50%;
      background: rgba(255, 0, 0, 0.4); border: 1px solid rgba(255, 0, 0, 0.8);
      transform: translate(-50%, -50%); pointer-events: none; z-index: 2147483646;
      animation: trp-ripple-anim 0.4s ease-out forwards;
    }
    @keyframes trp-ripple-anim {
      0% { width: 0; height: 0; opacity: 1; }
      100% { width: 40px; height: 40px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

})(); // end IIFE safety guard