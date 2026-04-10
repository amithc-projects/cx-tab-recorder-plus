// content-drawing.js

// --- UI TOGGLING ---
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

// --- INITIALIZATION ---
function enableAnnotationUI() {
  if (isAnnotationMode) return;
  isAnnotationMode = true;

  historyStack = [];
  redoStack = [];
  cropRect = null;

  annotationContainer = document.createElement('div');
  annotationContainer.id = 'trp-annotation-layer';
  Object.assign(annotationContainer.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    zIndex: '2147483640', cursor: 'crosshair', pointerEvents: 'all'
  });

  canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  Object.assign(canvas.style, { width: '100%', height: '100%' });
  ctx = canvas.getContext('2d');
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.strokeStyle = currentColor;
  
  annotationContainer.appendChild(canvas);
  createToolbar(); // Create and Attach Toolbar
  document.body.appendChild(annotationContainer); // Add to DOM

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

  // FIX: Use querySelector to attach events to the created elements
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
  
  // Note: performScreenshotSequence is in content-main.js but shared scope allows access
  toolbar.querySelector('#btn-save').onclick = () => performScreenshotSequence(false);
  toolbar.querySelector('#btn-clip').onclick = () => performScreenshotSequence(true);
  toolbar.querySelector('#btn-clear').onclick = clearCanvas;
  toolbar.querySelector('#btn-close').onclick = () => toggleAnnotationMode(false);
}

// --- TOOLS ---
function setTool(tool) {
  currentTool = tool;
  const toolbar = document.getElementById('trp-toolbar');
  if (toolbar) {
    toolbar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    // Dynamic lookup by ID part
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
  
  for (const action of historyStack) {
    if (action.type === 'shape') {
      drawShape(action.shape);
    } else if (action.type === 'clear') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  if (currentShape) {
    drawShape(currentShape);
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

// --- HISTORY & UNDO ---
function performUndo() {
  if (cropRect) { cropRect = null; redrawCanvas(); return; }
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

  if (actionToRedo.type === 'text') actionToRedo.el.style.display = 'block';
  redrawCanvas();
}


// --- DRAWING ENGINE ---
function startDrawing(e) {
  if (currentTool === 'text') return;
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  
  if (cropRect || currentTool === 'crop') {
    cropRect = null; redrawCanvas();
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
  } else if (currentTool === 'rect' || currentTool === 'ellipse') {
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
      if (Math.abs(w) > 5 && Math.abs(h) > 5) {
        cropRect = { x: startX, y: startY, w: w, h: h };
        currentShape = null;
        performScreenshotSequence(true);
      } else {
        cropRect = null; 
        currentShape = null;
        redrawCanvas();
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