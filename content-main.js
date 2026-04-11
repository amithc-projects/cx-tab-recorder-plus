// content-main.js

// 1. LISTENERS
document.addEventListener('mousedown', (e) => {
  if (activeOptions.showClicks && !isAnnotationMode) {
    showRipple(e.clientX, e.clientY);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.contentEditable === 'true') return;

  // Undo/Redo
  if (e.ctrlKey && isAnnotationMode) {
    if (e.code === 'KeyZ') { e.preventDefault(); performUndo(); return; }
    if (e.code === 'KeyY') { e.preventDefault(); performRedo(); return; }
  }
  // Screenshot
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
    e.preventDefault();
    performScreenshotSequence(false);
    return;
  }
  // Toggle Annotate
  if (e.altKey && e.shiftKey && e.code === 'KeyA') {
    e.preventDefault();
    toggleAnnotationMode(true);
    return;
  }
  // Escape
  if (e.code === 'Escape' && isAnnotationMode) {
    e.preventDefault(); e.stopPropagation();
    if (document.getElementById('trp-toolbar') && document.getElementById('trp-toolbar').style.display !== 'none') {
      hideToolbar();
    } else {
      toggleAnnotationMode(false);
    }
  }
});

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
  
  // Screenshot triggers
  else if (request.action === "TRIGGER_SCREENSHOT") performScreenshotSequence(false);
  else if (request.action === "CAPTURE_FULL_PAGE") performFullPageCapture(request.intent);
  else if (request.action === "TRIGGER_CLIPBOARD") performScreenshotSequence(true);
  
  // POPUP HELPERS
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

// 2. SCREENSHOT LOGIC
function performScreenshotSequence(toClipboard) {
  prepareForCapture();
  
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: "CAPTURE_FOR_CLIPBOARD" }, async (response) => {
      if (response && response.success) {
        let finalDataUrl = response.dataUrl;
        
        // CROP LOGIC
        if (cropRect) {
          finalDataUrl = await cropImage(response.dataUrl, cropRect);
        }

        if (toClipboard) {
          copyToClipboard(finalDataUrl);
          showToast('Copied to Clipboard! 📋');
        } else {
          downloadImage(finalDataUrl);
        }
      }
      restoreAfterCapture();
    });
  }, 100);
}

function prepareForCapture() {
  const toolbar = document.getElementById('trp-toolbar');
  if (timerContainer) timerContainer.style.opacity = '0';
  if (toolbar) toolbar.style.opacity = '0';
  if (cropRect) redrawCanvas(true);
}

function restoreAfterCapture() {
  const toolbar = document.getElementById('trp-toolbar');
  if (timerContainer) timerContainer.style.opacity = '1';
  if (toolbar) toolbar.style.opacity = '1';
  if (cropRect) redrawCanvas();
}

function redrawCanvas(hideCrop = false) {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (const action of historyStack) {
    if (action.type === 'shape') {
      drawShape(action.shape);
    } else if (action.type === 'clear') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  if (currentShape) {
    if (currentShape.type === 'crop') {
      drawCropRect(currentShape.startX, currentShape.startY, currentShape.w, currentShape.h);
    } else {
      drawShape(currentShape);
    }
  }
  
  if (cropRect && !hideCrop) {
    drawCropRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
  }
}

// 3. IMAGE HELPERS
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
    showRipple(window.innerWidth/2, window.innerHeight/2);
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
  if (window.isTabRecorderCapturing) return;
  window.isTabRecorderCapturing = true;
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

  const stitchedUrl = await stichImages(snaps, viewportHeight);
  if (!stitchedUrl) {
    window.isTabRecorderCapturing = false;
    return showToast("⚠️ Capture Cancelled: No frames acquired.");
  }
  
  if (intent === 'copy' || intent === 'both') {
    try {
      const blob = await (await fetch(stitchedUrl)).blob();
      await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
    } catch (e) {
      console.error(e);
    }
  }
  
  if (intent === 'save' || intent === 'both') {
    const filename = await generateFilename();
    chrome.runtime.sendMessage({ action: "DOWNLOAD_FILE", dataUrl: stitchedUrl, filename: filename });
  }
  
  if (intent === 'copy') showToast("Copied Full Page! 📋");
  else if (intent === 'save') showToast("Saved Full Page! 💾");
  else showToast("Saved & Copied Full Page! 💾📋");
  
  window.isTabRecorderCapturing = false;
}

function stichImages(snaps, realViewportHeight) {
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

// 4. RECORDING STARTUP
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