# Tab Recorder Plus - Roadmap

This document tracks planned improvements and recently shipped features, prioritised by impact and feasibility.

---

## Recently Shipped

- **[Done] Capture View from Open Tabs**: Captures the viewport of every already-open tab (whole window, tab group, or URL-pattern filter) without switching the active tab. Uses Chrome DevTools Protocol (`Page.captureScreenshot`) so the popup stays alive and FSA file saving works throughout. Full-page CDP capture was evaluated but excluded due to OOM crashes on long pages.
- **[Done] URL Sets**: Named lists of URLs that are navigated and captured in sequence. Supports full-page (scroll-and-stitch) and visible modes. Assigned resolution set supported. URLs can be imported from open tabs or tab groups directly in Settings.
- **[Done] Resolution Sets**: Named collections of viewport sizes. Attach to a URL Set or Open Tabs capture to automatically capture each target at every defined size, with `_WxH` filename suffixes. Uses CDP `Emulation.setDeviceMetricsOverride`; debugger is re-attached per URL (Chrome auto-detaches on navigation).
- **[Done] Pre-Capture Rules**: CSS rules (selector + property/value) injected before capture and undone afterwards. Hides cookie banners, chat widgets, and other overlays that shouldn't appear in screenshots.
- **[Done] FSA Save Directory**: File System Access API folder picker; all captures save directly to the chosen folder without a download prompt. Companion `.json` sidecar files written alongside each image.
- **[Done] Configurable Filename Tokens**: Format string with tokens `{{domain}}`, `{{title}}`, `{{date}}`, `{{time}}`, `{{width}}`, `{{height}}`, `{{tab.group}}`, etc.
- **[Done] Branding Overlay**: Composite a custom logo PNG onto screenshots at configurable position and opacity.

---

## Phase 1: Performance & Architecture

- **1. Fix Undo/Redo Memory Leak**: Refactor the annotation drawing engine to be vector-based. Currently raw bitmap data (`getImageData()`) is saved per undo step, consuming gigabytes on high-resolution screens. Replace with stored vector paths (coordinates, shapes) and incremental redraw.
- **2. Isolate CSS via Shadow DOM**: Inject annotation toolbar, timers, and click ripple effects into a Shadow DOM to prevent host-page CSS from overriding extension UI.
- **3. Compile/Bundle Content Scripts**: Introduce a bundler (Vite or Esbuild) to allow modular source files (`content-drawing.js`, `content-timer.js`) while outputting the optimised monolithic `content.js` Chrome requires.

---

## Phase 2: Core Feature Enhancements

- **4. Audio Recording Support**: Expand `offscreen.js` stream capture to include microphone voiceovers and system/tab audio.
- **5. Pause & Resume Recording**: Add Pause/Resume controls to allow longer recording sessions without stopping entirely.
- **6. MP4/WASM Export**: Integrate `ffmpeg.wasm` for client-side `.webm` → `.mp4` conversion before saving.
- **7. Full-Page Capture for Open Tabs**: The current "Capture View from Open Tabs" is viewport-only because CDP `captureBeyondViewport` OOMs on long pages. A chunked CDP approach (capture in vertical strips, stitch client-side) could unlock reliable full-page capture for inactive tabs without requiring tab activation.

---

## Phase 3: Annotation & Tooling UX

- **8. Advanced Drawing Tools**: Arrow and Highlighter tools for the annotation bar.
- **9. Drag-to-Move Annotations**: Allow repositioning of text annotations after they are placed.

---

## Phase 4: Video Merger Upgrades

- **10. Sequential Stitching**: Option to stitch videos end-to-end rather than side-by-side.
- **11. Trim/Offset Controls**: UI sliders to trim leading/trailing seconds before processing.
