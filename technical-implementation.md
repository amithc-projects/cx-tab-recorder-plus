# Technical Implementation: cx-tab-recorder-plus

A Chrome MV3 extension for full-page screenshots, area capture, and viewport capture with save-to-folder support.

---

## Architecture Overview

The extension has four execution contexts, each with different capabilities and constraints:

| Context | Origin | IDB Access | FSA Write | User Gesture | chrome.tabs |
|---|---|---|---|---|---|
| **Popup** (`popup.js`) | Extension | Extension IDB | Yes (with permission) | Yes (user clicked) | Yes |
| **Background SW** (`background.js`) | Extension | Extension IDB | `queryPermission` only | No | Yes |
| **Offscreen** (`offscreen.js`) | Extension | Extension IDB | `queryPermission` only | No | No |
| **Content Script** (`content.js`) | **Page origin** | **Page IDB** | No | No | No |

The distinction between **extension-origin IDB** and **page-origin IDB** is critical and was the source of a major bug (see below).

---

## Core Problem: File System Access (FSA) Permissions in Chrome Extensions

### What we wanted

Users select a save directory via `showDirectoryPicker()`. The extension stores the `FileSystemDirectoryHandle` in IndexedDB and reuses it to write screenshots without a Save-As dialog.

### What Chrome actually does

**FSA permission is per-browsing-context document, not per extension origin.**

When the popup calls `handle.requestPermission({ mode: "readwrite" })`, permission is granted **only to that popup document**. When the popup closes, the permission context is destroyed. No other extension context (background service worker, offscreen document) can see that permission via `queryPermission` — they all get `'prompt'` back.

This was confirmed empirically:
- Background SW: `queryPermission` → `'prompt'` after popup granted
- Offscreen document: `queryPermission` → `'prompt'` after popup granted
- Background SW: `requestPermission` → throws `SecurityError` (no user gesture)
- Offscreen: `requestPermission` → throws `SecurityError` (no user gesture)

### Why short pages appeared to work

Short pages complete capture in a few seconds. The popup was still alive when the save happened (we mistakenly thought the popup needed to close — actually it was closing faster than intended on short pages and occasionally succeeding by timing coincidence). Long pages took 10–30 seconds, by which time any save attempt from offscreen/background always failed.

---

## Solution: Popup as the FSA Writer

**The popup is the only context with FSA permission. It must stay alive until the write is complete.**

### Full Page Capture Flow

```
1. User clicks "Screenshot Full Tab" in popup
2. popup.js: getGrantedFSAHandle() → requestPermission → 'granted' (user gesture present)
3. popup.js: Hides normal UI, shows "Capturing Full Page..." state
4. popup.js: Registers chrome.runtime.onMessage listener for 'FULL_PAGE_CAPTURE_READY'
5. popup.js: Sends CAPTURE_FULL_PAGE to content script — does NOT close popup
6. content.js: Scrolls page, captures frames via port-based captureVisibleTab
7. content.js: Stitches frames on a canvas, applies branding
8. content.js: Calls downloadImage(dataUrl) → sends SAVE_SCREENSHOT to background
9. background.js: fetch(dataUrl).blob() → stores Blob in extension-origin IDB (key = 'screenshot-{ts}')
10. background.js: sendMessage FULL_PAGE_CAPTURE_READY { key, filename, tabId }
    └─ If popup alive → popup responds { handled: true }
    └─ If popup closed → background falls back to offscreen path
11. popup.js (onCaptureReady): getScreenshotBlob(key) from extension IDB
12. popup.js: writeFSAFromBlob(handle, blob, filename) → FSA write succeeds
13. popup.js: deleteScreenshotBlob(key), sends SHOW_TOAST to tab, window.close()
```

### Why Background Stores the Blob (Not Content Script)

A critical architecture insight: **content scripts run in the page's origin, not the extension's origin**.

`indexedDB.open('TabRecorderDB')` in a content script on `ebay.co.uk` opens `ebay.co.uk`'s IndexedDB — completely separate from the extension's IndexedDB. The background service worker and popup both open the extension's IndexedDB. This is why the initial attempt to have the content script store the blob failed with "Blob not found in IDB".

The solution: content script sends the `dataUrl` to the background service worker, which does `fetch(dataUrl).blob()` and stores the result in the **extension's** IndexedDB. Both popup and background share the same extension-origin IDB, so the popup can retrieve the blob directly.

### Fallback Chain

If the popup is not alive when `FULL_PAGE_CAPTURE_READY` arrives (e.g. user clicked away, closing the popup):

```
background → PROCESS_SCREENSHOT_FROM_IDB → offscreen
offscreen: queryPermission → 'prompt' (no permission)
offscreen: requestPermission → SecurityError (no user gesture)
offscreen: reads blob from IDB → FileReader.readAsDataURL(blob)
offscreen → FSA_FAILED_FALLBACK { dataUrl, filename } → background
background: chrome.downloads.download(dataUrl) → saves to ~/Downloads
```

The blob is cleaned from IDB at each terminal point (FSA success or Downloads fallback).

---

## Key Technical Decisions

### Port-Based Tab Capture

`chrome.tabs.captureVisibleTab` is called from the background service worker. Using `chrome.runtime.sendMessage` with `return true` (async response) is unreliable — the MV3 service worker can be terminated between the call and the response, closing the message port.

**Solution:** Content script opens a named port (`chrome.runtime.connect({ name: 'trp-capture' })`). Ports keep an active event listener on the service worker, preventing suspension for the duration of the capture. Background's `chrome.runtime.onConnect` listener handles the port and calls `captureVisibleTab` with 4-attempt retry.

```javascript
// content.js
function captureWithRetry() {
  return new Promise((resolve) => {
    const port = chrome.runtime.connect({ name: 'trp-capture' });
    port.onMessage.addListener((msg) => {
      port.disconnect();
      resolve(msg.success ? msg : null);
    });
    port.postMessage({ action: 'CAPTURE' });
  });
}
```

### Large Image Transfer: dataUrl → IDB Blob

A full-page screenshot of a long page can produce a canvas 1920×30,000px+. `canvas.toDataURL('image/png')` produces a base64 string of 15–25 MB. Passing this through two `sendMessage` hops (content → background → offscreen) and then calling `fetch(dataUrl)` in a restricted offscreen context caused failures on long pages.

**Solution:**
1. Content script sends `SAVE_SCREENSHOT { dataUrl, filename }` to background (one hop, same as before)
2. Background converts to Blob via `fetch(dataUrl).blob()` and stores in extension IDB
3. Only a small key string (`screenshot-{timestamp}`) travels from background to popup/offscreen
4. Popup reads the Blob directly from IDB and passes it to `FileSystemWritableFileStream.write(blob)` — no re-encoding

### Service Worker IDB Access

Chrome MV3 service workers fully support IndexedDB. Blobs are structured-cloneable and can be stored directly (`tx.objectStore('Screenshots').put(blob, key)`). This avoids any base64 conversion overhead for the storage step.

### DB Version Management

All three contexts that open `TabRecorderDB` (popup, background SW, offscreen) must agree on the schema version. Adding the `Screenshots` store required bumping from version 1 to version 2. The `onupgradeneeded` handler uses `objectStoreNames.contains()` guards so it safely handles both fresh installs and upgrades from v1:

```javascript
req.onupgradeneeded = (e) => {
  const db = e.target.result;
  if (!db.objectStoreNames.contains('Handles')) db.createObjectStore('Handles');
  if (!db.objectStoreNames.contains('Screenshots')) db.createObjectStore('Screenshots');
};
```

### CSS Isolation for Content Script UI

The annotation toolbar is injected into arbitrary host pages. Host pages frequently have CSS rules like `svg { max-width: 100% }` or `* { box-sizing: content-box }` that bleed into injected elements.

**Solution:** Scope a CSS reset block to the toolbar's root ID, using `!important` on every critical rule:

```css
#trp-toolbar * {
  box-sizing: border-box !important;
  max-width: none !important;
  font-family: sans-serif !important;
}
#trp-toolbar svg {
  width: 18px !important;
  height: 18px !important;
}
```

### Preventing Duplicate Content Script Injection

After extension reload, previously injected content scripts are invalidated. Subsequent calls from the popup to `chrome.tabs.sendMessage` throw "Could not establish connection". 

**Solution:** Popup pings the tab before each operation. If ping fails, inject content.js and wait 80ms before continuing:

```javascript
async function ensureContentScript(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'PING' }, (response) => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] },
          () => { chrome.runtime.lastError; setTimeout(() => resolve(), 80); }
        );
      } else resolve();
    });
  });
}
```

### Toast Stacking

Multiple toasts shown in quick succession would overlap because each was positioned at `top: 24px`.

**Solution:** Maintain a `_trpToasts[]` array. Each new toast calculates its `top` position as `24 + (index * (TOAST_HEIGHT + GAP))`. When a toast expires, remaining toasts shift up by re-computing positions.

---

## Known Limitations

### Capture Area FSA

The "Capture Area" mode opens an annotation toolbar on the page. The popup must close so the user can draw. After the user draws and saves, the content script calls `downloadImage()` → `SAVE_SCREENSHOT` → background stores blob → sends `FULL_PAGE_CAPTURE_READY`. But the popup is already closed, so background falls back to offscreen → Downloads.

**Potential fix:** After capture, background could programmatically reopen the popup (`chrome.action.openPopup()`, available Chrome 127+) with a pending-save state. The popup would then read the blob from IDB and write via FSA. Not yet implemented.

### Popup Focus Loss

Chrome extension popups close when they lose focus. If the user accidentally clicks on the page while "Capturing Full Page..." is displayed, the popup closes and the fallback path (Downloads) is used. The capturing state text instructs users to keep the popup open.

### FSA After Browser Restart

`FileSystemDirectoryHandle` is persisted in IndexedDB across sessions, but FSA permission state is session-scoped. After a browser restart, `queryPermission` returns `'prompt'`. The popup's `getGrantedFSAHandle()` calls `requestPermission` to re-grant — this works because the popup has user activation. Subsequent writes from the popup within that session succeed. No action needed from the user beyond clicking the extension button.

---

## File Map

| File | Context | Responsibility |
|---|---|---|
| `manifest.json` | — | Permissions: `tabCapture`, `offscreen`, `downloads`, `clipboardWrite`, `storage`, `scripting` |
| `popup.js` / `popup.html` | Popup | UI, FSA permission grant, FSA write for viewport + full-page, settings |
| `background.js` | Service Worker | Tab capture relay, blob IDB storage, message routing, downloads fallback |
| `content.js` | Content Script (page origin) | Full-page scroll+capture loop, annotation toolbar, clipboard write, toasts |
| `offscreen.js` / `offscreen.html` | Offscreen Document | Video recording, FSA fallback attempt, blob→dataUrl conversion for Downloads fallback |
