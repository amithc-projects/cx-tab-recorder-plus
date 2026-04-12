# Tab Recorder Plus

Tab Recorder Plus is a feature-rich Google Chrome extension for recording browser tabs, capturing screenshots, annotating over pages, and batch-capturing multiple URLs or open tabs at multiple resolutions.

## Features

### Screenshot Capture
- **Capture Entire Page**: Scroll-and-stitch full-page capture — captures everything below the fold.
- **Capture Visible**: Snap the current viewport as-is.
- **Capture Region**: Draw a selection rectangle to capture only a specific area.
- **Annotate then Capture**: Draw arrows, shapes, and text on the page before saving.

### Batch Capture
- **URL Sets**: Define named lists of URLs in Settings. One click navigates to each URL in sequence and captures it, saving one file per URL. Supports full-page and visible modes.
- **Capture View from Open Tabs**: Capture the current viewport of every already-open tab — by whole window, by tab group, or filtered by URL pattern. No navigation, no tab reloading; uses Chrome DevTools Protocol to screenshot each tab without switching focus.

### Resolution Sets
Define named collections of viewport sizes (e.g. Desktop/Tablet/Mobile). Attach a Resolution Set to a URL Set or Open Tabs capture to automatically capture each URL/tab at every defined size, saving a separate file per size with a `_WxH` filename suffix.

### Pre-Capture Rules
Define CSS rules (e.g. `display: none`) applied to matching selectors immediately before a capture and undone immediately after. Use this to hide cookie banners, chat widgets, or other overlays that shouldn't appear in screenshots.

### Save Directory & Filenames
- Pick a local folder via the File System Access API — all captures save there automatically without a download prompt.
- Configurable filename format using tokens: `{{domain}}`, `{{title}}`, `{{date}}`, `{{time}}`, `{{width}}`, `{{height}}`, `{{tab.group}}`, and more.
- Companion `.json` sidecar files saved alongside each image containing URL, title, capture type, resolution, and timestamp.

### Branding Overlay
Optionally composite a custom logo PNG onto every screenshot at a configurable position and opacity.

### Video Recording
- Record the active tab as a `.webm` file with optional on-screen timer and click-highlight ripple effects.
- Configurable timer position (top/bottom, left/centre/right).
- Built-in **Video Merger** utility to merge multiple recordings side-by-side or sequentially.

### Annotation Tools
Draw on any page using pen, rectangle, ellipse, and text tools with custom colour selection and full undo/redo.

---

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `cx-tab-recorder-plus` directory.

---

## Usage & Keyboard Shortcuts

### Global Shortcuts
| Shortcut | Action |
|---|---|
| `Alt+Shift+Q` (Mac: `Option+Shift+Q`) | Open extension popup |
| `Ctrl+Shift+S` (Mac: `Cmd+Shift+S`) | Stop recording |
| `Alt+Shift+A` | Toggle annotation mode |
| `Ctrl+Shift+E` | Save full-page screenshot |

*(Customisable at `chrome://extensions/shortcuts`)*

### Popup Shortcuts (while popup is open)
| Key | Action |
|---|---|
| `E` | Capture Entire Page |
| `V` | Capture Visible |
| `R` | Capture Region |
| `A` | Annotate |

### Annotation Shortcuts (while toolbar is active)
| Shortcut | Action |
|---|---|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Escape` | Exit / hide toolbar |

---

## Settings

Open Settings via the gear icon in the popup.

| Section | Description |
|---|---|
| **Save Directory** | Pick a folder for automatic saving; configure filename format tokens |
| **Branding** | Upload a logo PNG, set position and opacity |
| **URL Sets** | Create/edit named URL lists; optionally assign a Resolution Set; import from open tabs or tab groups |
| **Resolution Sets** | Define named viewport-size collections for multi-resolution batch capture |
| **Pre-Capture Rules** | CSS selector + property rules applied before each capture |

---

## Permissions

| Permission | Purpose |
|---|---|
| `activeTab`, `tabs` | Read tab URLs/titles; capture visible tab |
| `tabGroups` | Enumerate tab groups for group-scoped capture |
| `tabCapture`, `desktopCapture` | Record tab video |
| `scripting` | Inject annotation, capture, and pre-capture-rule scripts |
| `debugger` | Viewport size emulation (Resolution Sets) and CDP screenshot for open-tab capture |
| `storage` | Persist user preferences |
| `offscreen` | Background video recording (MV3 requirement) |
| `downloads` | Fallback file saving when FSA folder is not configured |
