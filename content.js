// content.js

// 0. SAFETY GUARD
if (window.hasTabRecorderPlusRun) {
  throw new Error("TabRecorderPlus already loaded on this page");
}
window.hasTabRecorderPlusRun = true;

// --- VARIABLES ---
let timerInterval = null;
let startTime = 0;
let isRunning = false;
let activeOptions = {};
let timerContainer = null;
let timeText = null;

// Annotation State
let isAnnotationMode = false;
let canvas, ctx;
let annotationContainer;
let currentTool = 'rect';
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
  if (request.action === "ARM_TIMER") {
    activeOptions = request.options;
    if (activeOptions.showClicks) injectRippleStyles();
    if (activeOptions.showTimer) {
      createTimerUI();
      timeText.innerText = "Click to start";
    }
    document.addEventListener('click', interceptClickAndStart, { once: true, capture: true });
  }
  else if (request.action === "FORCE_STOP_UI") fullStopUIOnly();
  else if (request.action === "TOGGLE_ANNOTATION") toggleAnnotationMode(true);
  else if (request.action === "START_CROP_MODE") {
    toggleAnnotationMode(true);
    setTool('crop');
  }
  
  // Toolbar/Keyboard Actions
  else if (request.action === "TRIGGER_SCREENSHOT") performScreenshotSequence(false);
  else if (request.action === "CAPTURE_FULL_PAGE") performFullPageCapture(request.intent);
  else if (request.action === "TRIGGER_CLIPBOARD") performScreenshotSequence(true);
  
  // --- POPUP CROP SUPPORT ---
  // The popup asks for the crop area before it captures the screen.
  else if (request.action === "GET_CROP_AND_HIDE_UI") {
    prepareForCapture();
    // Return cropRect so Popup can do the cropping locally
    sendResponse({ success: true, cropRect: cropRect, innerWidth: window.innerWidth });
  }
  else if (request.action === "RESTORE_UI") {
    restoreAfterCapture();
    sendResponse({success: true});
  }
  else if (request.action === "SHOW_TOAST") {
    showToast(request.message);
  }
});

// --- SCREENSHOT SEQUENCE ---

function performScreenshotSequence(toClipboard) {
  // 1. Hide UI
  prepareForCapture();
  
  setTimeout(() => {
    // 2. Capture Screen
    chrome.runtime.sendMessage({ action: "CAPTURE_FOR_CLIPBOARD" }, async (response) => {
      if (response && response.success) {
        let finalDataUrl = response.dataUrl;

        // 3. Apply Crop (if exists)
        if (cropRect) {
          finalDataUrl = await cropImage(response.dataUrl, cropRect);
        }

        finalDataUrl = await applyBrandingToImage(finalDataUrl);

        // 4. Output
        if (toClipboard) {
          copyToClipboard(finalDataUrl);
          showToast('Copied to Clipboard! 📋');
        } else {
          downloadImage(finalDataUrl);
        }
      }
      
      // 5. Restore UI
      restoreAfterCapture();
    });
  }, 100);
}

function prepareForCapture() {
  const toolbar = document.getElementById('trp-toolbar');
  if (timerContainer) timerContainer.style.opacity = '0';
  if (toolbar) toolbar.style.opacity = '0';
  // Temporarily remove the dashed crop line so it's not in the picture
  if (cropRect) redrawCanvas(true);
}

function restoreAfterCapture() {
  const toolbar = document.getElementById('trp-toolbar');
  if (timerContainer) timerContainer.style.opacity = '1';
  if (toolbar) toolbar.style.opacity = '1';
  // Put the dashed line back
  if (cropRect) redrawCanvas();
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

function resolveTokens(str) {
  const d = new Date();
  const timestamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`;
  let url = window.location.href;
  let title = document.title;
  let domain = window.location.hostname;
  
  let res = str.replace(/{{\s*timestamp\s*}}/g, timestamp);
  res = res.replace(/{{\s*domain\s*}}/g, domain);
  res = res.replace(/{{\s*tab\.title\s*}}/g, title);
  res = res.replace(/{{\s*tab\.url\s*}}/g, url);
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
      
      const d = new Date();
      const timestamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`;
      
      let url = window.location.href.substring(0, 50);
      let title = document.title.substring(0, 50);
      let domain = window.location.hostname;

      const sanitize = (str) => str.replace(/[^a-zA-Z0-9.\-_]/g, '_').substring(0, 80);
      
      format = format.replace(/{{\s*timestamp\s*}}/g, sanitize(timestamp));
      format = format.replace(/{{\s*domain\s*}}/g, sanitize(domain));
      format = format.replace(/{{\s*tab\.title\s*}}/g, sanitize(title));
      format = format.replace(/{{\s*tab\.url\s*}}/g, sanitize(url));
      
      format = format.replace(/^\/+/, '');
      
      if (!format.toLowerCase().endsWith('.png')) format += '.png';
      
      resolve(format);
    });
  });
}

async function downloadImage(dataUrl) {
  const filename = await generateFilename();
  chrome.runtime.sendMessage({ action: "DOWNLOAD_FILE", dataUrl: dataUrl, filename: filename });
}

async function copyToClipboard(dataUrl) {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
    showRipple(window.innerWidth/2, window.innerHeight/2); // Visual feedback
  } catch (err) { console.error("Copy failed", err); }
}

function showToast(message) {
  const t = document.createElement('div');
  t.textContent = message;
  Object.assign(t.style, {
    position: 'fixed', top: '24px', right: '-350px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', color: '#fff', 
    padding: '16px 28px', borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2) inset', 
    zIndex: '2147483647', fontWeight: 'bold', letterSpacing: '0.5px',
    fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '15px', 
    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  });
  document.body.appendChild(t);
  
  // Animate In
  requestAnimationFrame(() => {
    setTimeout(() => { t.style.right = '24px'; }, 50);
  });
  
  // Animate Out
  setTimeout(() => { 
    t.style.right = '-350px'; 
    t.style.opacity = '0'; 
    setTimeout(() => t.remove(), 500); 
  }, 3000);
}

// --- FULL PAGE CAPTURE ---
async function performFullPageCapture(intent) {
  prepareForCapture();
  
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
      if ((style.position === 'fixed' || style.position === 'sticky') && style.visibility !== 'hidden' && style.display !== 'none') {
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
  
  if (isWindow) window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  else scrollEl.scrollTop = 0;
  
  let currentY = 0;

  while (true) {
    await new Promise(r => setTimeout(r, 600)); // Must be > 500ms to avoid Chrome's MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND quota
    hideFixed(); 

    const actualY = isWindow ? window.scrollY : scrollEl.scrollTop;
    
    const response = await new Promise(r => chrome.runtime.sendMessage({ action: "CAPTURE_FOR_CLIPBOARD" }, r));
    if (response && response.dataUrl) snaps.push({ src: response.dataUrl, actualY: actualY });
    
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
  
  restoreAfterCapture();
  showToast("Stitching " + snaps.length + " images...");

  let stitchedUrl = await stichImages(snaps, viewportHeight);
  stitchedUrl = await applyBrandingToImage(stitchedUrl);
  
  if (intent === 'copy' || intent === 'both') {
    await copyToClipboard(stitchedUrl);
  }
  if (intent === 'save' || intent === 'both') {
    const filename = await generateFilename();
    chrome.runtime.sendMessage({ action: "DOWNLOAD_FILE", dataUrl: stitchedUrl, filename: filename });
  }
  
  if (intent === 'copy') showToast("Copied Full Page! 📋");
  else if (intent === 'save') showToast("Saved Full Page! 💾");
  else showToast("Saved & Copied Full Page! 💾📋");
}

function stichImages(snaps, realViewportHeight) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let loadedCount = 0;
    const images = [];

    snaps.forEach(s => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
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
    <button id="btn-undo" title="Undo (Ctrl+Z)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg></button>
    <button id="btn-redo" title="Redo (Ctrl+Y)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg></button>
    <div class="divider"></div>
    <button id="btn-crop" title="Crop/Select Tool"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 3 10.43 21 13.93 13.93 21 10.43 3 3"></polygon></svg></button>
    <button id="btn-rect" class="active" title="Rectangle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></button>
    <button id="btn-ellipse" title="Ellipse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></button>
    <button id="btn-pen" title="Pen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
    <button id="btn-text" title="Text"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg></button>
    <button id="btn-blur" title="Blur Sensitive Info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></button>
    <div class="divider"></div>
    <div class="color-picker-wrap">
      <input type="color" id="inp-color" value="${currentColor}" title="Color Picker">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 10 10c0 2.21-1.79 4-4 4h-2.14a2 2 0 0 0-1.76 1.08l-1.04 1.92C12.82 21.6 12.43 22 12 22Z"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/></svg>
      <div id="inline-color-ind" class="color-indicator-bar" style="background:${currentColor};"></div>
    </div>
    <div class="divider"></div>
    <button id="btn-clip" title="Copy to Clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
    <button id="btn-save" title="Save File"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
    <div class="divider"></div>
    <button id="btn-clear" title="Clear All" style="color: #FCA5A5;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
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
    .trp-branding { display: flex; align-items: center; gap: 8px; padding: 0 8px 0 4px; cursor: default; }
    .trp-branding svg { width: 20px; height: 20px; }
    .trp-brand-text { font-size: 13px; font-weight: 700; color: #E5E7EB; white-space: nowrap; letter-spacing: -0.2px; }
    
    #trp-toolbar .divider {
      width: 1px; height: 20px; background: rgba(255,255,255,0.15); margin: 0 4px;
    }
    #trp-toolbar button {
      background: transparent; border: none; cursor: pointer; border-radius: 8px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); color: #9CA3AF !important; 
      display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
    }
    #trp-toolbar button:hover { background: rgba(255,255,255,0.1); color: #F3F4F6 !important; }
    #trp-toolbar button.active { background: #2563EB !important; color: #FFFFFF !important; box-shadow: 0 2px 10px rgba(37,99,235,0.4); }
    #trp-toolbar button svg { width: 18px; height: 18px; }
    
    #btn-clear:hover { background: rgba(248,113,113,0.15) !important; color: #EF4444 !important; }
    
    .color-picker-wrap {
      position: relative; width: 36px; height: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center;
      border-radius: 8px; cursor: pointer; transition: 0.2s; margin: 0 2px; color: #9CA3AF;
    }
    .color-picker-wrap:hover { background: rgba(255,255,255,0.1); color: #F3F4F6; }
    .color-picker-wrap svg { width: 16px; height: 16px; margin-bottom: 2px; pointer-events: none; }
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
        performScreenshotSequence(true);
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
  if (activeOptions.showTimer) {
    startTime = Date.now();
    if (!timerContainer) createTimerUI();
    startInternalTimer(true);
  } else {
    saveState(); 
  }
  setTimeout(() => { originalTarget.click(); }, 100);
}

function startInternalTimer(save = false) {
  if (!isRunning) {
    timerInterval = setInterval(updateTimer, 100);
    isRunning = true;
    if (save) saveState();
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
  `;
  document.head.appendChild(style);
  timerContainer = document.createElement('div');
  timerContainer.id = 'timer-container';
  timeText = document.createElement('span');
  timeText.innerText = "0.0";
  timeText.style.marginRight = "5px";
  const stopBtn = document.createElement('button');
  stopBtn.className = 'timer-btn';
  stopBtn.innerHTML = "&#9209;"; 
  stopBtn.onclick = (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ action: "STOP_RECORDING" });
    fullStopUIOnly();
  };
  timerContainer.appendChild(timeText);
  timerContainer.appendChild(stopBtn);
  document.body.appendChild(timerContainer);
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