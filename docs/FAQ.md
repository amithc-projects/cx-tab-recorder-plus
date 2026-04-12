# Tab Recorder Plus — Technical FAQ for AI Reviewers

This document answers the questions an AI is most likely to ask when first reading this codebase. It explains *why* the code is structured the way it is, documents the non-obvious constraints, and flags the known failure modes.

---

## Architecture

### What is this project?

A Chrome Manifest V3 (MV3) extension. It has five execution contexts that communicate via message passing:

| Context | File(s) | Lifetime |
|---|---|---|
| **Popup** | `popup.html` / `popup.js` | Alive only while the popup window is open |
| **Background service worker** | `background.js` | Ephemeral; Chrome kills it when idle |
| **Content script** | `content.js` | Lives in every tab; persistent while the tab exists |
| **Offscreen document** | `offscreen.html` | Created on demand for `getUserMedia`; destroyed after use |
| **Settings page** | `settings.html` / `settings.js` | A full extension page opened in a tab |

### Why does the popup do so much heavy lifting?

Two capabilities are only available in user-gesture / visible-document contexts:

1. **File System Access API (`showDirectoryPicker`, `createWritable`)** — requires a user activation and the document must remain alive to write files. The background service worker is not a document and cannot hold a live `FileSystemDirectoryHandle`.
2. **`navigator.clipboard.write`** — also requires a visible, focused document.

So any operation that saves files or copies to the clipboard must either run in the popup or be handed back to the popup. The `showCapturingView()` function switches the popup to a progress screen that keeps it alive for the entire batch.

### How do the contexts share data?

- **`chrome.runtime.sendMessage` / `onMessage`** — fire-and-forget or request/response for small payloads.
- **`chrome.tabs.sendMessage`** — popup or background → specific content script.
- **`chrome.storage.local`** — persistent settings (URL sets, resolution sets, branding config, etc.).
- **`chrome.storage.session`** — transient flags between the background and popup (e.g. `pendingCaptureResult`).
- **IndexedDB (`TabRecorderDB`)** — used for two things: storing the `FileSystemDirectoryHandle` (key `saveDirectory` in the `Handles` store) and ferrying screenshot blobs from the background/content script to the popup (the `Screenshots` store). Direct message passing cannot carry binary blobs of arbitrary size reliably.

---

## Capture Pipelines

### How does "Capture Visible" work?

`popup.js → captureOneUrlVisible()`

1. Send `APPLY_PRE_CAPTURE_RULES` to the content script; wait 100 ms.
2. Call `chrome.tabs.captureVisibleTab(windowId, {format:'png'}, callback)` from the popup.
3. In the callback, apply branding, generate filename, write via FSA or fallback to `chrome.downloads`.
4. Send `UNDO_PRE_CAPTURE_RULES` to content script.

**Critical gotcha**: The `captureVisibleTab` callback is a plain callback, not a Promise. If you use `async (dataUrl) => { ... }` inside it and any `await` throws, the exception is silently swallowed and `resolve()` is never called — the caller hangs forever. Always wrap the entire callback body in `try { ... } catch (err) { resolve(); }`.

### How does "Capture Entire Page" (scroll-and-stitch) work?

`popup.js → triggerFullTabCapture() → content.js → background.js → popup.js`

1. Popup sends `CAPTURE_FULL_PAGE` to content script.
2. Content script (`performFullPageCapture`) scrolls the page in increments, firing a port message to background for each viewport-sized strip.
3. Background holds a port (`trp-capture`) to stay alive; on each strip it calls `captureVisibleTab` and stores the blob in IndexedDB via `storeBlobInExtDB`.
4. Content script stitches strips onto an offscreen `<canvas>`, produces a blob, stores it in IndexedDB under a unique key, then broadcasts `FULL_PAGE_CAPTURE_READY` with that key and the resolved filename.
5. Popup listens for `FULL_PAGE_CAPTURE_READY`, reads the blob from IndexedDB via `getScreenshotBlob(key)`, writes it via FSA, and resolves.

If the content script fails (no frames captured, or an error), it broadcasts `CAPTURE_FULL_PAGE_FAILED`. `captureOneUrlFull` listens for both signals plus a 120-second safety timeout so it never hangs indefinitely.

### How does "Capture View from Open Tabs" work?

`popup.js → captureOpenTabs()`

Uses Chrome DevTools Protocol (CDP) to screenshot each tab **without activating it**. This is the key architectural decision: switching the active tab via `chrome.tabs.update({active:true})` causes Chrome to dismiss the extension popup (it treats the window-state change as a focus loss), which stops all JavaScript execution. CDP avoids this entirely.

1. Resolve the tab list (window / tab group / URL pattern).
2. For each tab: inject content script, send `APPLY_PRE_CAPTURE_RULES`, then `attachDebugger`.
3. Optionally call `applyResolution` (same CDP session).
4. Call `screenshotViaCDP(tabId, false)` — sends `Page.captureScreenshot` with default params (viewport only).
5. Apply branding, write file, send `UNDO_PRE_CAPTURE_RULES`, `detachDebugger`.

**Why viewport-only?** `Page.captureScreenshot` with `captureBeyondViewport: true` allocates the entire page as a single in-memory bitmap. On content-heavy pages (e.g. news sites) this OOMs the renderer and Chrome crashes the extension with error `-32000 "Unable to capture screenshot"`. Viewport-only is safe and reliable.

### How does "Capture URL Set" work?

`popup.js → captureUrlSet()`

1. Opens a new tab (`chrome.tabs.create`) and navigates it to each URL in sequence.
2. For each URL: `navigateAndWait` (listens for `status === 'complete'`), inject content script, optionally `attachDebugger` + `applyResolution`.
3. Calls `captureOneUrlFull` or `captureOneUrlVisible` for each resolution.
4. `detachDebugger` after each URL — **critical**: Chrome auto-detaches the debugger on navigation, so you must re-attach per URL, not once for the whole set.

---

## Resolution Emulation

### How does resolution override work?

Via the Chrome Debugger API:

```
attachDebugger(tabId)                          // chrome.debugger.attach
applyResolution(tabId, {width, height})        // Emulation.setDeviceMetricsOverride
  → wait 400 ms for reflow
  → capture
clearResolution(tabId)                         // Emulation.clearDeviceMetricsOverride
detachDebugger(tabId)                          // chrome.debugger.detach
```

`mobile: true` is set for widths ≤ 480 px so sites serve their mobile layout. The yellow "DevTools is debugging this browser" banner appears on the tab during capture — this is unavoidable.

### Why is the debugger re-attached per URL in URL set capture?

Chrome automatically detaches the debugger when a tab navigates. If you attach once before the loop and navigate, the debugger is silently dropped; subsequent `sendCommand` calls fail with `lastError` and `applyResolution` is a no-op. The fix is to call `attachDebugger` after every `navigateAndWait`, inside the URL loop.

---

## File Saving

### How does FSA (File System Access API) saving work?

The user picks a directory once in Settings → the `FileSystemDirectoryHandle` is stored in IndexedDB under key `saveDirectory`. On capture, `getGrantedFSAHandle()` retrieves it and verifies `queryPermission({mode:'readwrite'}) === 'granted'`. If granted, files are written directly without any download prompt.

If not granted (e.g. handle expired, or no directory configured), the fallback is `chrome.runtime.sendMessage({action:'DOWNLOAD_FILE', dataUrl, filename})` which triggers a `chrome.downloads.download` from the background.

### What are companion JSON files?

For every image saved, a `.json` sidecar is written alongside it. Example: `screenshot_2024-01-15.png` → `screenshot_2024-01-15.json`. Contents:

```json
{
  "url": "https://example.com/page",
  "title": "Page Title",
  "capturedAt": "2024-01-15T10:30:00.000Z",
  "captureType": "full",
  "resolution": { "width": 1280, "height": 800 },
  "filename": "screenshot_2024-01-15.png"
}
```

Written by `saveCompanionJson()` in `popup.js`.

### What filename tokens are available?

Resolved by `resolveTokens()` in `popup.js` and `resolveTokens()` in `content.js`:

| Token | Value |
|---|---|
| `{{domain}}` | `location.hostname` |
| `{{title}}` | Page title (sanitised) |
| `{{date}}` | `YYYY-MM-DD` |
| `{{time}}` | `HH-MM-SS` |
| `{{width}}` / `{{height}}` | Viewport dimensions |
| `{{tab.group}}` | Chrome tab group name (empty string if none) |
| `{{path}}` | URL path segments |

Tokens are sanitised: `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|` are stripped or replaced. Consecutive slashes are collapsed so empty token values don't create double-slash path segments.

---

## Pre-Capture Rules

### What are pre-capture rules and how are they applied?

Defined in Settings: an array of `{ selector, property, value }` objects. Example: hide cookie banner.

1. Before capture, popup sends `APPLY_PRE_CAPTURE_RULES` to content script.
2. Content script reads rules from `chrome.storage.local`, injects a `<style>` tag with `selector { property: value !important }` for each rule.
3. After capture, popup sends `UNDO_PRE_CAPTURE_RULES` — content script removes the injected `<style>` tag.

Works on non-active tabs since `chrome.tabs.sendMessage` does not require the target tab to be focused.

---

## Content Script

### What does `content.js` do?

It is the largest and most complex file. Responsibilities:

- **Scroll-and-stitch capture** (`performFullPageCapture`) — opens a port to background, scrolls, collects strips, stitches on canvas, stores blob in IDB.
- **Region capture** (`startRegionCapture`) — overlays a drag-selection UI, crops the resulting screenshot.
- **Annotation toolbar** — pen, rectangle, ellipse, text tools; renders on a floating `<canvas>`.
- **Recording timer overlay** — injected during video recording.
- **Click ripple effect** — visual feedback during recording.
- **Pre-capture rule injection/removal**.
- **Token resolution** for filenames (the `resolveTokens` mirror of the popup version).

The `window.isTabRecorderCapturing` flag prevents concurrent captures on the same tab.

### Why is there a `content-init.js` alongside `content.js`?

`content.js` is the compiled/concatenated bundle. The `content-init.js`, `content-main.js`, `content-drawing.js`, `content-timer.js` are the modular source files kept for developer readability. The manifest loads `content.js` only. If you need to understand a specific subsystem, read the corresponding source file; if you need to make changes, edit `content.js` directly (no build step currently exists).

---

## Background Service Worker

### What does `background.js` do?

- **Port listener (`trp-capture`)** — receives `{windowId}` messages during full-page capture; calls `captureVisibleTab` with retry logic (up to 8 attempts, 400 ms apart) and relays the data URL back through the port. Keeping an open port prevents MV3 from killing the service worker mid-capture.
- **Port listener (`trp-screenshot-upload`)** — similar relay for region capture.
- **Screenshot blob relay** — stores blobs in IndexedDB; the popup reads them out via `getScreenshotBlob`.
- **FSA fallback** — `tryFSAWriteFromBackground` attempts to write directly from the service worker (works if the popup previously granted permission and the handle is still valid).
- **Recording lifecycle** — `handleStartRecording`, `handleStopRecording`, pause/resume state machine.
- **`SAVE_SCREENSHOT_FALLBACK`** message handler — triggers `chrome.downloads.download` when FSA is unavailable.

### Why the retry loop in `captureForPort`?

`captureVisibleTab` occasionally fails with "The tab is busy" or similar transient errors, especially immediately after a navigation or tab activation. Retrying up to 8 times with a 400 ms gap handles these race conditions without failing the capture.

---

## Common Failure Modes & Gotchas

### Async callbacks without try/catch hang forever

Any `async` function passed as a Chrome API callback (e.g. `captureVisibleTab(windowId, opts, async (dataUrl) => { ... })`) has a hidden trap: if an `await` inside it throws, the exception is not propagated — it disappears into an unhandled promise rejection, and any `resolve()` at the end of the callback is never reached. The calling `new Promise(resolve => {...})` hangs indefinitely.

**Pattern to follow**: Always wrap the entire body of such callbacks in `try { ... } catch (err) { console.error(...); resolve(); }`.

### Chrome auto-detaches the debugger on navigation

Any `chrome.tabs.update({url})` or user-initiated navigation detaches the debugger. Code that attaches once before a multi-URL loop and expects to call `sendCommand` later will silently fail. Attach/detach must bracket each individual URL.

### The popup closes when the active tab changes

`chrome.tabs.update({active: true})` changes the browser window's active tab, which Chrome treats as a focus change and dismisses the popup. This is why "Capture View from Open Tabs" uses CDP rather than tab activation — the popup must remain alive to hold the FSA `FileSystemDirectoryHandle` and write files.

### `FULL_PAGE_CAPTURE_READY` with no corresponding listener

If `captureOneUrlFull` is called but the content script returns early (empty frame array, DOM error, etc.) without sending `FULL_PAGE_CAPTURE_READY`, the popup would hang. This is handled by:
1. Content script sending `CAPTURE_FULL_PAGE_FAILED` on all early-exit paths.
2. `captureOneUrlFull` listening for `CAPTURE_FULL_PAGE_FAILED` as a done signal.
3. A 120-second safety timeout calling `done()` as a last resort.

### FSA handle survives across sessions but not across permission revocations

The `FileSystemDirectoryHandle` stored in IndexedDB persists between browser restarts, but `queryPermission` may return `'prompt'` after the user revokes access or Chrome resets permissions. The code checks `queryPermission` before every write and falls back to `chrome.downloads` if permission is gone.

---

## Video Recording

### How does video recording work in MV3?

MV3 service workers cannot call `getUserMedia` or `MediaRecorder`. The workaround is an **offscreen document** (`offscreen.html`):

1. Background calls `chrome.offscreen.createDocument(...)`.
2. Background sends a `START_RECORDING` message to the offscreen document with the stream constraints.
3. Offscreen document calls `getUserMedia` (or `chrome.tabCapture.getMediaStreamId`), creates a `MediaRecorder`, and streams to a `Blob`.
4. On stop, the offscreen document sends the blob back to background, which calls `chrome.downloads.download`.

The click ripple and timer overlays are injected into the page via the content script and rendered as DOM elements, not as part of the recording stream.

---

## Settings

### Where is user configuration stored?

All in `chrome.storage.local` under these keys:

| Key | Type | Contents |
|---|---|---|
| `urlSets` | `Array` | `[{id, name, urls[], resolutionSetId?}]` |
| `resolutionSets` | `Array` | `[{id, name, resolutions:[{width,height}]}]` |
| `preCaptureRules` | `Array` | `[{selector, property, value}]` |
| `filenameFormat` | `string` | Template with `{{tokens}}` |
| `brandingConfig` | `object` | `{enabled, position, opacity, dataUrl}` |
| `showTimer` | `boolean` | Recording timer visibility |
| `timerPosition` | `string` | Timer placement enum |
| `showClicks` | `boolean` | Click ripple enabled |

The FSA `FileSystemDirectoryHandle` is stored separately in IndexedDB (not `chrome.storage`) because storage API cannot serialise DOM objects.

### Why is settings in a separate HTML page rather than the popup?

The settings page contains forms, large textarea inputs, and drag-and-drop file upload for branding images. Keeping it in a dedicated tab page (`settings.html`) avoids the 340px width constraint of the popup and keeps `popup.js` focused on capture/record actions.
