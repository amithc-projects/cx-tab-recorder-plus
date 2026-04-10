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
let snapshot = null; 

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
    document.addEventListener('click', interceptClickAndStart, { once: true, capture: true });
  }
  else if (request.action === "FORCE_STOP_UI") fullStopUIOnly();
  else if (request.action === "TOGGLE_ANNOTATION") toggleAnnotationMode(true);
  
  // Toolbar/Keyboard Actions
  else if (request.action === "TRIGGER_SCREENSHOT") performScreenshotSequence(false);
  else if (request.action === "TRIGGER_CLIPBOARD") performScreenshotSequence(true);
  
  // --- POPUP CROP SUPPORT ---
  // The popup asks for the crop area before it captures the screen.
  else if (request.action === "GET_CROP_AND_HIDE_UI") {
    prepareForCapture();
    // Return cropRect so Popup can do the cropping locally
    sendResponse({ success: true, cropRect: cropRect });
  }
  else if (request.action === "RESTORE_UI") {
    restoreAfterCapture();
    sendResponse({success: true});
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

        // 4. Output
        if (toClipboard) {
          copyToClipboard(finalDataUrl);
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
  if (cropRect) redrawCanvasWithoutCrop();
}

function restoreAfterCapture() {
  const toolbar = document.getElementById('trp-toolbar');
  if (timerContainer) timerContainer.style.opacity = '1';
  if (toolbar) toolbar.style.opacity = '1';
  // Put the dashed line back
  if (cropRect) drawCropRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
}

// Image Processing Helper
function cropImage(dataUrl, rect) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cvs = document.createElement('canvas');
      let x = rect.x, y = rect.y, w = rect.w, h = rect.h;
      
      // Normalize negative dimensions
      if (w < 0) { x += w; w = Math.abs(w); }
      if (h < 0) { y += h; h = Math.abs(h); }
      // Clamp to zero
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
    showRipple(window.innerWidth/2, window.innerHeight/2); // Visual feedback
  } catch (err) { console.error("Copy failed", err); }
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
  
  saveToHistory(); 

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
    <button id="btn-undo" title="Undo (Ctrl+Z)">↩️</button>
    <button id="btn-redo" title="Redo (Ctrl+Y)">↪️</button>
    <div style="width:1px; background:#555; margin:0 5px;"></div>
    <button id="btn-crop" title="Crop Tool">✂️</button>
    <div style="width:1px; background:#555; margin:0 5px;"></div>
    <button id="btn-rect" class="active" title="Rectangle">⬜</button>
    <button id="btn-ellipse" title="Ellipse">⚪</button>
    <button id="btn-pen" title="Pen">✏️</button>
    <button id="btn-text" title="Text">T</button>
    <input type="color" id="inp-color" value="${currentColor}" title="Color">
    <div style="width:1px; background:#555; margin:0 5px;"></div>
    <button id="btn-save" title="Save Screenshot">💾</button>
    <button id="btn-clip" title="Copy to Clipboard">📋</button>
    <div style="width:1px; background:#555; margin:0 5px;"></div>
    <button id="btn-clear" title="Clear">🗑️</button>
    <button id="btn-close" title="Exit">❌</button>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    #trp-toolbar {
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      background: #333; padding: 6px; border-radius: 8px;
      display: flex; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: auto; align-items: center;
    }
    #trp-toolbar button {
      background: transparent; border: none; font-size: 18px; cursor: pointer;
      padding: 6px; border-radius: 4px; transition: background 0.2s;
      color: white !important; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;
    }
    #trp-toolbar button:hover { background: rgba(255,255,255,0.2); }
    #trp-toolbar button.active { background: rgba(255,255,255,0.4); }
    #inp-color { width: 28px; height: 28px; border: none; padding: 0; background: transparent; cursor: pointer; }
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
  
  toolbar.querySelector('#inp-color').oninput = (e) => {
    currentColor = e.target.value;
    ctx.strokeStyle = currentColor;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.querySelectorAll('.trp-text-input').forEach(el => el.remove());
  cropRect = null;
  saveToHistory();
}

// --- HISTORY / UNDO / REDO ---

function saveToHistory(textEl = null) {
  redoStack = []; 
  if (textEl) {
    historyStack.push({ type: 'text', el: textEl });
  } else {
    // Save Canvas. Note: We DO NOT save the cropRect. It is a temporary overlay.
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyStack.push({ type: 'canvas', data: data });
  }
  if (historyStack.length > 50) historyStack.shift();
}

function performUndo() {
  // If Crop is active, Undo cancels the crop first
  if (cropRect) {
    cropRect = null;
    redrawCanvasWithoutCrop();
    return;
  }

  if (historyStack.length <= 1) return;
  
  const lastAction = historyStack.pop();
  redoStack.push(lastAction);
  
  if (lastAction.type === 'text') {
    lastAction.el.style.display = 'none';
  } else if (lastAction.type === 'canvas') {
    restoreCanvasState(findLastCanvasState());
  }
}

function performRedo() {
  if (redoStack.length === 0) return;
  const actionToRedo = redoStack.pop();
  historyStack.push(actionToRedo);

  if (actionToRedo.type === 'text') actionToRedo.el.style.display = 'block';
  else if (actionToRedo.type === 'canvas') restoreCanvasState(actionToRedo);
}

function findLastCanvasState() {
  for (let i = historyStack.length - 1; i >= 0; i--) {
    if (historyStack[i].type === 'canvas') return historyStack[i];
  }
  return null;
}

function restoreCanvasState(state) {
  if (!state) return;
  ctx.putImageData(state.data, 0, 0);
}

function redrawCanvasWithoutCrop() {
  const state = findLastCanvasState();
  if (state) ctx.putImageData(state.data, 0, 0);
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
    redrawCanvasWithoutCrop();
  }

  ctx.beginPath();
  if (currentTool === 'crop') {
    ctx.setLineDash([6, 6]); ctx.strokeStyle = '#000000'; ctx.lineWidth = 2;
  } else {
    ctx.setLineDash([]); ctx.strokeStyle = currentColor; ctx.lineWidth = 4;
  }
  
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (currentTool === 'pen') ctx.moveTo(startX, startY);
}

function draw(e) {
  if (!isDrawing) return;
  
  if (currentTool === 'crop') {
    ctx.putImageData(snapshot, 0, 0);
    const w = e.offsetX - startX;
    const h = e.offsetY - startY;
    ctx.strokeRect(startX, startY, w, h);
    return;
  }

  if (currentTool === 'pen') {
    if (e.shiftKey) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      const dx = Math.abs(e.offsetX - startX);
      const dy = Math.abs(e.offsetY - startY);
      if (dx > dy) ctx.lineTo(e.offsetX, startY); else ctx.lineTo(startX, e.offsetY);
      ctx.stroke();
    } else {
      ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke();
    }
  } 
  else if (currentTool === 'rect' || currentTool === 'ellipse') {
    ctx.putImageData(snapshot, 0, 0);
    let w = e.offsetX - startX;
    let h = e.offsetY - startY;
    if (e.shiftKey) {
      const s = Math.min(Math.abs(w), Math.abs(h));
      w = w < 0 ? -s : s; h = h < 0 ? -s : s;
    }
    ctx.beginPath();
    if (currentTool === 'rect') ctx.strokeRect(startX, startY, w, h);
    else {
      ctx.ellipse(startX + w/2, startY + h/2, Math.abs(w/2), Math.abs(h/2), 0, 0, 2*Math.PI);
      ctx.stroke();
    }
  }
}

function drawCropRect(x, y, w, h) {
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function stopDrawing(e) {
  if (isDrawing) {
    isDrawing = false;
    
    if (currentTool === 'crop') {
      const w = e.offsetX - startX;
      const h = e.offsetY - startY;
      // Define Crop if valid size
      if (Math.abs(w) > 5 && Math.abs(h) > 5) {
        cropRect = { x: startX, y: startY, w: w, h: h };
        // --- NEW: AUTO COPY TO CLIPBOARD ---
        performScreenshotSequence(true);
      } else {
        cropRect = null; 
        redrawCanvasWithoutCrop(); // Clear accidental click artifacts
      }
      // NOTE: We do NOT save crop to history. It is a transient overlay.
    } else {
      ctx.beginPath();
      saveToHistory();
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
  saveToHistory(input);
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
    createTimerUI();
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