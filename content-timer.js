// content-timer.js

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

function fullStopUIOnly() {
  if (timerInterval) clearInterval(timerInterval);
  isRunning = false;
  if (timerContainer) timerContainer.remove();
  timerContainer = null;
  const rippleStyle = document.getElementById('trp-styles');
  if (rippleStyle) rippleStyle.remove();
  
  // Cleanup annotation if active
  if (annotationContainer) annotationContainer.remove();
  annotationContainer = null;
  isAnnotationMode = false;
  
  chrome.storage.local.remove('timerState');
}

function saveState() {
  chrome.storage.local.set({ 
    timerState: { startTime, isRunning: true, options: activeOptions } 
  });
}