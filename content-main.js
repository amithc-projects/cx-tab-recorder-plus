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
    document.addEventListener('click', interceptClickAndStart, { once: true, capture: true });
  }
  else if (request.action === "FORCE_STOP_UI") fullStopUIOnly();
  else if (request.action === "TOGGLE_ANNOTATION") toggleAnnotationMode(true);
  
  // Screenshot triggers
  else if (request.action === "TRIGGER_SCREENSHOT") performScreenshotSequence(false);
  else if (request.action === "TRIGGER_CLIPBOARD") performScreenshotSequence(true);
  
  // POPUP HELPERS
  else if (request.action === "GET_CROP_AND_HIDE_UI") {
    prepareForCapture();
    sendResponse({ success: true, cropRect: cropRect });
  }
  else if (request.action === "RESTORE_UI") {
    restoreAfterCapture();
    sendResponse({success: true});
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

        if (toClipboard) copyToClipboard(finalDataUrl);
        else downloadImage(finalDataUrl);
      }
      restoreAfterCapture();
    });
  }, 100);
}

function prepareForCapture() {
  const toolbar = document.getElementById('trp-toolbar');
  if (timerContainer) timerContainer.style.opacity = '0';
  if (toolbar) toolbar.style.opacity = '0';
  if (cropRect) redrawCanvasWithoutCrop();
}

function restoreAfterCapture() {
  const toolbar = document.getElementById('trp-toolbar');
  if (timerContainer) timerContainer.style.opacity = '1';
  if (toolbar) toolbar.style.opacity = '1';
  if (cropRect) drawCropRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
}

// 3. IMAGE HELPERS
function cropImage(dataUrl, rect) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cvs = document.createElement('canvas');
      let x = rect.x, y = rect.y, w = rect.w, h = rect.h;
      if (w < 0) { x += w; w = Math.abs(w); }
      if (h < 0) { y += h; h = Math.abs(h); }
      if (x < 0) x = 0; if (y < 0) y = 0;
      
      cvs.width = w; cvs.height = h;
      const tCtx = cvs.getContext('2d');
      tCtx.drawImage(img, x, y, w, h, 0, 0, w, h);
      resolve(cvs.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

function downloadImage(dataUrl) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `screenshot-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function copyToClipboard(dataUrl) {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([ new ClipboardItem({ [blob.type]: blob }) ]);
    showRipple(window.innerWidth/2, window.innerHeight/2);
  } catch (err) { console.error("Copy failed", err); }
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
    createTimerUI();
    startInternalTimer(true);
  } else {
    saveState(); 
  }
  setTimeout(() => { originalTarget.click(); }, 100);
}