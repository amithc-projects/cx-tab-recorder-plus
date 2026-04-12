// content-init.js

// 0. SAFETY GUARD (Reset mechanism)
if (window.hasOmniCaptRun) {
  // We allow re-running if needed, or just log it
  console.log("OmniCapt scripts re-injected");
}
window.hasOmniCaptRun = true;

// --- SHARED GLOBALS (var is used for cross-file scope) ---
var timerInterval = null;
var startTime = 0;
var isRunning = false;
var activeOptions = {};
var timerContainer = null;
var timeText = null;

// Annotation Globals
var isAnnotationMode = false;
var canvas, ctx;
var annotationContainer;
var currentTool = 'rect';
var currentColor = '#FF0000';
var isDrawing = false;
var startX = 0;
var startY = 0;
var currentShape = null; 

// History & Crop
var historyStack = [];
var redoStack = [];
var cropRect = null; // {x, y, w, h}

// --- UTILITIES ---
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