// merger.js
const video1Input = document.getElementById('video1Input');
const video2Input = document.getElementById('video2Input');
const title1Input = document.getElementById('title1');
const title2Input = document.getElementById('title2');
const processBtn = document.getElementById('processBtn');
const statusText = document.getElementById('status');

// Progress Elements
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const currentTimeText = document.getElementById('currentTimeText');
const totalTimeText = document.getElementById('totalTimeText');

const vid1 = document.getElementById('vid1');
const vid2 = document.getElementById('vid2');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let mediaRecorder;
let recordedChunks = [];
let audioCtx;
let dest;

const TITLE_HEIGHT = 60; 
const TITLE_BG_COLOR = "#333333";
const TITLE_TEXT_COLOR = "#FFFFFF";
const TITLE_FONT = "bold 24px sans-serif";

let finalTitle1 = "";
let finalTitle2 = "";

function checkInputs() {
  if (video1Input.files.length > 0 && video2Input.files.length > 0) {
    processBtn.disabled = false;
  }
}
video1Input.addEventListener('change', checkInputs);
video2Input.addEventListener('change', checkInputs);

function processTitle(rawText, file) {
  if (!rawText) return "";
  let text = rawText;
  text = text.replace(/{{filename}}/gi, file.name);
  if (file.lastModified) {
    const dateStr = new Date(file.lastModified).toLocaleString();
    text = text.replace(/{{fileDateTime}}/gi, dateStr);
  }
  return text;
}

// Helper to format seconds into MM:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

processBtn.addEventListener('click', async () => {
  processBtn.disabled = true;
  statusText.innerText = "Loading videos...";
  
  // Show Progress UI
  progressContainer.style.display = "block";
  progressBar.value = 0;
  currentTimeText.innerText = "00:00";
  totalTimeText.innerText = "--:--";

  finalTitle1 = processTitle(title1Input.value, video1Input.files[0]);
  finalTitle2 = processTitle(title2Input.value, video2Input.files[0]);

  const url1 = URL.createObjectURL(video1Input.files[0]);
  const url2 = URL.createObjectURL(video2Input.files[0]);

  vid1.src = url1;
  vid2.src = url2;

  await Promise.all([
    new Promise(r => vid1.onloadedmetadata = r),
    new Promise(r => vid2.onloadedmetadata = r)
  ]);

  // Set Total Time Display
  const maxDuration = Math.max(vid1.duration, vid2.duration);
  totalTimeText.innerText = formatTime(maxDuration);

  const width = vid1.videoWidth + vid2.videoWidth;
  const contentHeight = Math.max(vid1.videoHeight, vid2.videoHeight);
  
  canvas.width = width;
  canvas.height = contentHeight + TITLE_HEIGHT;

  audioCtx = new AudioContext();
  dest = audioCtx.createMediaStreamDestination();
  
  const source1 = audioCtx.createMediaElementSource(vid1);
  const source2 = audioCtx.createMediaElementSource(vid2);
  
  source1.connect(dest);
  source2.connect(dest);
  
  vid1.muted = false;
  vid2.muted = false;

  const canvasStream = canvas.captureStream(30); 
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks()
  ]);

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });
  
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    statusText.innerText = "Processing complete. Saving...";
    // Ensure bar is full at end
    progressBar.value = 100;
    currentTimeText.innerText = totalTimeText.innerText;
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: 'merged-video.webm',
      saveAs: true 
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        statusText.innerText = "Error saving: " + chrome.runtime.lastError.message;
        statusText.style.color = "red";
      } else {
        statusText.innerText = "Saved successfully!";
        statusText.style.color = "green";
      }
      
      processBtn.disabled = false;
      audioCtx.close();
    });
  };

  mediaRecorder.start();
  
  vid1.play();
  vid2.play();
  drawFrame();

  statusText.innerText = "Merging... Please wait.";
});

function drawFrame() {
  if (vid1.paused && vid2.paused) {
    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    return;
  }

  // --- UPDATE PROGRESS BAR ---
  const current = Math.max(vid1.currentTime, vid2.currentTime);
  const total = Math.max(vid1.duration, vid2.duration);
  
  if (total > 0) {
    const pct = (current / total) * 100;
    progressBar.value = pct;
    currentTimeText.innerText = formatTime(current);
  }
  // ---------------------------

  // A. Title Strip
  ctx.fillStyle = TITLE_BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, TITLE_HEIGHT);

  // B. Left Title
  ctx.fillStyle = TITLE_TEXT_COLOR;
  ctx.font = TITLE_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const center1 = vid1.videoWidth / 2;
  ctx.fillText(finalTitle1, center1, TITLE_HEIGHT / 2);

  // C. Right Title
  const center2 = vid1.videoWidth + (vid2.videoWidth / 2);
  ctx.fillText(finalTitle2, center2, TITLE_HEIGHT / 2);

  // D. Video Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, TITLE_HEIGHT, canvas.width, canvas.height - TITLE_HEIGHT);

  // E. Draw Videos
  const y1 = TITLE_HEIGHT + ((canvas.height - TITLE_HEIGHT - vid1.videoHeight) / 2);
  if (!vid1.ended && !vid1.paused) {
    ctx.drawImage(vid1, 0, y1);
  }

  const x2 = vid1.videoWidth;
  const y2 = TITLE_HEIGHT + ((canvas.height - TITLE_HEIGHT - vid2.videoHeight) / 2);
  if (!vid2.ended && !vid2.paused) {
    ctx.drawImage(vid2, x2, y2);
  }

  requestAnimationFrame(drawFrame);
}