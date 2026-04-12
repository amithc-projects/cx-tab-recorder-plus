// merger.js

// --- DOM REFERENCES ---
const processBtn     = document.getElementById('processBtn');
const statusText     = document.getElementById('status');
const templateSelect = document.getElementById('templateSelect');
const gapSelect      = document.getElementById('gapSelect');
const gapField       = document.getElementById('gapField');
const sourcesContainer = document.getElementById('videoSourcesContainer');

const progressContainer = document.getElementById('progressContainer');
const progressBar       = document.getElementById('progressBar');
const currentTimeText   = document.getElementById('currentTimeText');
const totalTimeText     = document.getElementById('totalTimeText');

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

// Pre-created hidden video elements (supports up to 4)
const VIDEO_ELS = [
  document.getElementById('vid1'),
  document.getElementById('vid2'),
  document.getElementById('vid3'),
  document.getElementById('vid4'),
];

let mediaRecorder, recordedChunks = [], audioCtx, dest;

// --- CONSTANTS ---
const TITLE_H    = 50;
const TITLE_BG   = '#1a1a2e';
const TITLE_FG   = '#FFFFFF';
const TITLE_FONT = 'bold 18px Inter, sans-serif';
const GAP_COLOR  = '#111827';

// --- HELPERS ---
function formatTime(s) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function processTitle(raw, file) {
  if (!raw) return '';
  return raw
    .replace(/{{filename}}/gi, file.name)
    .replace(/{{fileDateTime}}/gi, file.lastModified ? new Date(file.lastModified).toLocaleString() : '');
}

function drawTitleStrip(x, y, w, text) {
  ctx.fillStyle = TITLE_BG;
  ctx.fillRect(x, y, w, TITLE_H);
  if (text) {
    ctx.save();
    ctx.rect(x, y, w, TITLE_H);
    ctx.clip();
    ctx.fillStyle = TITLE_FG;
    ctx.font = TITLE_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + TITLE_H / 2);
    ctx.restore();
  }
}

// Draw N videos in equal-height columns with gaps between them.
// Used by side-by-side, 3-columns, and 4-columns templates.
function drawColumns(videos, titles, gap) {
  const ch = canvas.height;
  let x = 0;
  videos.forEach((v, i) => {
    drawTitleStrip(x, 0, v.videoWidth, titles[i] || '');
    ctx.fillStyle = '#000';
    ctx.fillRect(x, TITLE_H, v.videoWidth, ch - TITLE_H);
    if (!v.ended) {
      const y = TITLE_H + Math.round((ch - TITLE_H - v.videoHeight) / 2);
      ctx.drawImage(v, x, y);
    }
    if (i < videos.length - 1 && gap > 0) {
      ctx.fillStyle = GAP_COLOR;
      ctx.fillRect(x + v.videoWidth, 0, gap, ch);
    }
    x += v.videoWidth + gap;
  });
}

function columnsCanvasSize(videos, gap) {
  const w = videos.reduce((s, v) => s + v.videoWidth, 0) + gap * (videos.length - 1);
  const h = Math.max(...videos.map(v => v.videoHeight)) + TITLE_H;
  return { w, h };
}

// --- TEMPLATES ---
// Each template:
//   videoCount — how many video inputs to show
//   hasGap     — whether the Gap selector is relevant
//   roles      — label for each video input
//   canvasSize(videos, gap) → { w, h }
//   draw(videos, titles, gap) — renders one frame onto canvas

const TEMPLATES = {

  'side-by-side': {
    label: 'Side by Side',
    videoCount: 2,
    hasGap: true,
    roles: ['Left', 'Right'],
    canvasSize: (v, g) => columnsCanvasSize(v, g),
    draw: (v, t, g)   => drawColumns(v, t, g),
  },

  'top-bottom': {
    label: 'Top / Bottom',
    videoCount: 2,
    hasGap: true,
    roles: ['Top', 'Bottom'],
    canvasSize(videos, gap) {
      const [v0, v1] = videos;
      return {
        w: Math.max(v0.videoWidth, v1.videoWidth),
        h: TITLE_H + v0.videoHeight + gap + TITLE_H + v1.videoHeight,
      };
    },
    draw(videos, titles, gap) {
      const [v0, v1] = videos;
      const cw = canvas.width;
      drawTitleStrip(0, 0, cw, titles[0] || '');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, TITLE_H, cw, v0.videoHeight);
      if (!v0.ended) ctx.drawImage(v0, Math.round((cw - v0.videoWidth) / 2), TITLE_H);
      const gapY = TITLE_H + v0.videoHeight;
      if (gap > 0) { ctx.fillStyle = GAP_COLOR; ctx.fillRect(0, gapY, cw, gap); }
      const r2y = gapY + gap;
      drawTitleStrip(0, r2y, cw, titles[1] || '');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, r2y + TITLE_H, cw, v1.videoHeight);
      if (!v1.ended) ctx.drawImage(v1, Math.round((cw - v1.videoWidth) / 2), r2y + TITLE_H);
    },
  },

  'pip': {
    label: 'Picture in Picture',
    videoCount: 2,
    hasGap: false,
    roles: ['Main (full size)', 'Overlay (corner)'],
    canvasSize(videos) {
      const v0 = videos[0];
      return { w: v0.videoWidth, h: v0.videoHeight + TITLE_H };
    },
    draw(videos, titles, gap) {
      const [v0, v1] = videos;
      const cw = canvas.width, ch = canvas.height;
      drawTitleStrip(0, 0, cw, titles[0] || '');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, TITLE_H, cw, ch - TITLE_H);
      if (!v0.ended) ctx.drawImage(v0, 0, TITLE_H);
      if (!v1.ended) {
        const pw = Math.round(v1.videoWidth  * 0.25);
        const ph = Math.round(v1.videoHeight * 0.25);
        const px = cw - pw - 16;
        const py = ch - ph - 16;
        ctx.fillStyle = '#fff';
        ctx.fillRect(px - 2, py - 2, pw + 4, ph + 4);
        ctx.drawImage(v1, px, py, pw, ph);
        if (titles[1]) {
          ctx.fillStyle = 'rgba(0,0,0,0.65)';
          ctx.fillRect(px, py + ph - 18, pw, 18);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(titles[1], px + 4, py + ph - 9);
        }
      }
    },
  },

  '3-columns': {
    label: 'Three Columns',
    videoCount: 3,
    hasGap: true,
    roles: ['Left', 'Centre', 'Right'],
    canvasSize: (v, g) => columnsCanvasSize(v, g),
    draw: (v, t, g)   => drawColumns(v, t, g),
  },

  '1-over-2': {
    label: 'One Over Two',
    videoCount: 3,
    hasGap: true,
    roles: ['Top (main)', 'Bottom Left', 'Bottom Right'],
    canvasSize(videos, gap) {
      const [v0, v1, v2] = videos;
      const botW = v1.videoWidth + gap + v2.videoWidth;
      return {
        w: Math.max(v0.videoWidth, botW),
        h: TITLE_H + v0.videoHeight + gap + TITLE_H + Math.max(v1.videoHeight, v2.videoHeight),
      };
    },
    draw(videos, titles, gap) {
      const [v0, v1, v2] = videos;
      const cw = canvas.width;
      const botH = Math.max(v1.videoHeight, v2.videoHeight);
      // Top row
      drawTitleStrip(0, 0, cw, titles[0] || '');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, TITLE_H, cw, v0.videoHeight);
      if (!v0.ended) ctx.drawImage(v0, Math.round((cw - v0.videoWidth) / 2), TITLE_H);
      // Gap
      const gapY = TITLE_H + v0.videoHeight;
      if (gap > 0) { ctx.fillStyle = GAP_COLOR; ctx.fillRect(0, gapY, cw, gap); }
      // Bottom row
      const r2y = gapY + gap;
      drawTitleStrip(0, r2y, v1.videoWidth, titles[1] || '');
      if (gap > 0) { ctx.fillStyle = GAP_COLOR; ctx.fillRect(v1.videoWidth, r2y, gap, TITLE_H + botH); }
      drawTitleStrip(v1.videoWidth + gap, r2y, v2.videoWidth, titles[2] || '');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, r2y + TITLE_H, v1.videoWidth, botH);
      ctx.fillRect(v1.videoWidth + gap, r2y + TITLE_H, v2.videoWidth, botH);
      if (!v1.ended) ctx.drawImage(v1, 0, r2y + TITLE_H + Math.round((botH - v1.videoHeight) / 2));
      if (!v2.ended) ctx.drawImage(v2, v1.videoWidth + gap, r2y + TITLE_H + Math.round((botH - v2.videoHeight) / 2));
    },
  },

  '2x2-grid': {
    label: '2×2 Grid',
    videoCount: 4,
    hasGap: true,
    roles: ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'],
    canvasSize(videos, gap) {
      const [v0, v1, v2, v3] = videos;
      const w = Math.max(v0.videoWidth + gap + v1.videoWidth, v2.videoWidth + gap + v3.videoWidth);
      const row1H = TITLE_H + Math.max(v0.videoHeight, v1.videoHeight);
      const row2H = TITLE_H + Math.max(v2.videoHeight, v3.videoHeight);
      return { w, h: row1H + gap + row2H };
    },
    draw(videos, titles, gap) {
      const [v0, v1, v2, v3] = videos;
      const cw = canvas.width;
      const cell1H = Math.max(v0.videoHeight, v1.videoHeight);
      const cell2H = Math.max(v2.videoHeight, v3.videoHeight);
      const row1H  = TITLE_H + cell1H;
      // Row 1
      drawTitleStrip(0, 0, v0.videoWidth, titles[0] || '');
      if (gap > 0) { ctx.fillStyle = GAP_COLOR; ctx.fillRect(v0.videoWidth, 0, gap, row1H); }
      drawTitleStrip(v0.videoWidth + gap, 0, v1.videoWidth, titles[1] || '');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, TITLE_H, v0.videoWidth, cell1H);
      ctx.fillRect(v0.videoWidth + gap, TITLE_H, v1.videoWidth, cell1H);
      if (!v0.ended) ctx.drawImage(v0, 0, TITLE_H + Math.round((cell1H - v0.videoHeight) / 2));
      if (!v1.ended) ctx.drawImage(v1, v0.videoWidth + gap, TITLE_H + Math.round((cell1H - v1.videoHeight) / 2));
      // Row gap
      if (gap > 0) { ctx.fillStyle = GAP_COLOR; ctx.fillRect(0, row1H, cw, gap); }
      // Row 2
      const r2y = row1H + gap;
      drawTitleStrip(0, r2y, v2.videoWidth, titles[2] || '');
      if (gap > 0) { ctx.fillStyle = GAP_COLOR; ctx.fillRect(v2.videoWidth, r2y, gap, TITLE_H + cell2H); }
      drawTitleStrip(v2.videoWidth + gap, r2y, v3.videoWidth, titles[3] || '');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, r2y + TITLE_H, v2.videoWidth, cell2H);
      ctx.fillRect(v2.videoWidth + gap, r2y + TITLE_H, v3.videoWidth, cell2H);
      if (!v2.ended) ctx.drawImage(v2, 0, r2y + TITLE_H + Math.round((cell2H - v2.videoHeight) / 2));
      if (!v3.ended) ctx.drawImage(v3, v2.videoWidth + gap, r2y + TITLE_H + Math.round((cell2H - v3.videoHeight) / 2));
    },
  },

  '4-columns': {
    label: 'Four Columns',
    videoCount: 4,
    hasGap: true,
    roles: ['Left', 'Centre Left', 'Centre Right', 'Right'],
    canvasSize: (v, g) => columnsCanvasSize(v, g),
    draw: (v, t, g)   => drawColumns(v, t, g),
  },

};

// --- DYNAMIC VIDEO SOURCE INPUTS ---
function buildVideoSources(template) {
  sourcesContainer.innerHTML = '';
  for (let i = 0; i < template.videoCount; i++) {
    const group = document.createElement('div');
    group.className = 'input-group';
    group.innerHTML = `
      <label>Video ${i + 1} <span class="video-role">${template.roles[i]}</span></label>
      <input type="file" id="videoInput${i}" accept="video/*">
      <input type="text" id="titleInput${i}" class="text-input" placeholder="Enter title (optional)">
      <div class="hint">Tokens: {{filename}}, {{fileDateTime}}</div>
    `;
    sourcesContainer.appendChild(group);
    document.getElementById(`videoInput${i}`).addEventListener('change', checkInputs);
  }
}

function checkInputs() {
  const tpl = TEMPLATES[templateSelect.value];
  let allFilled = true;
  for (let i = 0; i < tpl.videoCount; i++) {
    const el = document.getElementById(`videoInput${i}`);
    if (!el || el.files.length === 0) { allFilled = false; break; }
  }
  processBtn.disabled = !allFilled;
}

function applyTemplateUI() {
  const tpl = TEMPLATES[templateSelect.value];
  gapField.style.display = tpl.hasGap ? '' : 'none';
  buildVideoSources(tpl);
  processBtn.disabled = true;
}

templateSelect.addEventListener('change', applyTemplateUI);
applyTemplateUI(); // initialise on load

// --- PROCESS ---
processBtn.addEventListener('click', async () => {
  processBtn.disabled = true;
  statusText.style.color = '#9CA3AF';
  statusText.innerText = 'Loading videos...';
  progressContainer.style.display = 'block';
  progressBar.value = 0;
  currentTimeText.innerText = '00:00';
  totalTimeText.innerText = '--:--';

  const template = TEMPLATES[templateSelect.value];
  const gap      = parseInt(gapSelect.value, 10);
  const count    = template.videoCount;

  // Load files into video elements
  const videos = VIDEO_ELS.slice(0, count);
  const titles = [];
  for (let i = 0; i < count; i++) {
    const file = document.getElementById(`videoInput${i}`).files[0];
    const raw  = document.getElementById(`titleInput${i}`).value;
    videos[i].src = URL.createObjectURL(file);
    titles.push(processTitle(raw, file));
  }

  await Promise.all(videos.map(v => new Promise(r => { v.onloadedmetadata = r; })));

  const maxDuration = Math.max(...videos.map(v => v.duration));
  totalTimeText.innerText = formatTime(maxDuration);

  const size    = template.canvasSize(videos, gap);
  canvas.width  = size.w;
  canvas.height = size.h;

  // Audio — mix all tracks
  audioCtx = new AudioContext();
  dest     = audioCtx.createMediaStreamDestination();
  videos.forEach(v => {
    audioCtx.createMediaElementSource(v).connect(dest);
    v.muted = false;
  });

  const combinedStream = new MediaStream([
    ...canvas.captureStream(30).getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  recordedChunks = [];
  mediaRecorder  = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });
  mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
  mediaRecorder.onstop = () => {
    statusText.innerText = 'Processing complete. Saving...';
    progressBar.value = 100;
    currentTimeText.innerText = totalTimeText.innerText;
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    chrome.downloads.download({ url: URL.createObjectURL(blob), filename: 'merged-video.webm', saveAs: true }, () => {
      if (chrome.runtime.lastError) {
        statusText.innerText = 'Error: ' + chrome.runtime.lastError.message;
        statusText.style.color = '#F87171';
      } else {
        statusText.innerText = 'Saved successfully!';
        statusText.style.color = '#34D399';
      }
      processBtn.disabled = false;
      audioCtx.close();
    });
  };

  mediaRecorder.start();
  videos.forEach(v => v.play());

  function drawFrame() {
    if (videos.every(v => v.paused)) {
      if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      return;
    }
    const current = Math.max(...videos.map(v => v.currentTime));
    const total   = Math.max(...videos.map(v => v.duration));
    if (total > 0) {
      progressBar.value = (current / total) * 100;
      currentTimeText.innerText = formatTime(current);
    }
    template.draw(videos, titles, gap);
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
  statusText.innerText = 'Merging... Please wait.';
});
