# Tab Recorder Plus - Roadmap

This document outlines the planned improvements and architectural enhancements for the extension, prioritized by impact and feasibility.

## Phase 1: Performance & Architecture

- **[Current] 1. Fix Undo/Redo Memory Leak**: Refactor the annotation drawing engine to be vector-based. Currently, the system saves raw bitmap data (`getImageData()`) for every undo step, which consumes gigabytes of memory on high-resolution screens. We will change this to store vector paths (coordinates, shapes) and redraw them incrementally.
- **2. Isolate CSS via Shadow DOM**: Inject the custom annotation toolbar, timers, and click ripple effects into a Shadow DOM. This will guarantee that the host page's global CSS cannot inadvertently override or break the extension's UI elements.
- **3. Compile/Bundle Content Scripts**: Introduce a modern bundler (e.g., Vite or Esbuild). This allows developers to work on modular, organized files (`content-drawing.js`, `content-timer.js`) while outputting the highly optimized monolithic `content.js` required by Chrome's manifest.

## Phase 2: Core Feature Enhancements

- **4. Audio Recording Support**: Expand the `offscreen.js` stream capture to include microphone voiceovers and system/tab audio recording.
- **5. Pause & Resume Recording**: Provide "Pause/Resume" controls to the recording system, allowing users to neatly control longer recording sessions without stopping entirely.
- **6. MP4/WASM Support**: Integrate `ffmpeg.wasm` client-side to allow conversion of browser native `.webm` videos into highly-compatible `.mp4` format directly before saving.

## Phase 3: Annotation & Tooling UX

- **7. Advanced Drawing Tools**: Introduce Arrow and Highlighter tools to the annotation bar for better visibility during presentations.
- **8. Drag-to-Move Annotations**: Enhance the existing text-insertion tool to allow dragging and repositioning of text after it has been typed.

## Phase 4: Video Merger Upgrades

- **9. Sequential Stitching**: Add an option to the video merger to stitch videos sequentially (Video 1, then Video 2) instead of only playing them simultaneously side-by-side.
- **10. Trim/Offset Controls**: Implement simple UI sliders on the Video Merger page to let users trim leading/trailing seconds prior to processing the mix.
