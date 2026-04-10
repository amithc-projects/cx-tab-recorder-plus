// offscreen.js
let mediaRecorder;
let recordedChunks = [];

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'START_OFFSCREEN_RECORDING') {
    // Pass the whole data object (which has width/height)
    startRecording(message.data);
  } else if (message.type === 'STOP_OFFSCREEN_RECORDING') {
    stopRecording();
  }
});

async function startRecording(data) {
  const streamId = data.streamId;
  const width = data.width || 1920;
  const height = data.height || 1080;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId,
          // FIX: Force exact dimensions
          maxWidth: width,
          maxHeight: height,
          minWidth: width,
          minHeight: height
        }
      }
    });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.start();
    
  } catch (err) {
    console.error("Offscreen recording failed:", err);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      // ACTION: Send the URL to background.js
      // We do NOT try to download here anymore.
      chrome.runtime.sendMessage({ 
        type: 'RECORDING_FINISHED', 
        url: url 
      });
    };
    mediaRecorder.stop();
    
    // Stop tracks
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
}