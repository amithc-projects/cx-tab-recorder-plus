# Tab Recorder Plus

Tab Recorder Plus is a feature-rich Google Chrome extension that allows you to seamlessly record your browser tabs, annotate over your screen, capture and crop screenshots, and merge video recordings together.

## Features

- **Video Recording**: Record activity on your active browser tab, saved automatically as a `.webm` file. Highlights mouse clicks and features a customizable on-screen recording timer.
- **Annotation Tools**: Draw on the screen using tools like pen, rectangle, ellipse, and text. Features custom color selection, undo/redo functionality, and an intuitive toolbar.
- **Screenshot & Crop**: Capture screenshots and quickly copy them to your clipboard or download them. Includes a crop tool to capture only the specific areas you need.
- **Video Merger**: A built-in utility to merge multiple video recordings together.
- **Visual Feedback**: Choose to display a click ripple animation and place the recording timer anywhere on the screen.

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to the extensions page: `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click on the **Load unpacked** button and select the `cx-tab-recorder-plus` directory.

## Usage & Keyboard Shortcuts

Tab Recorder Plus makes use of several handy keyboard shortcuts to help you work faster, without always needing to open the popup.

### Global Shortcuts
*   **Open Recorder Popup**: `Alt+Shift+Q` (Mac: `Option+Shift+Q`)
*   **Stop Recording**: `Ctrl+Shift+S` (Mac: `Command+Shift+S`)
*   **Toggle Annotation Mode**: `Alt+Shift+A`
*   **Save Screenshot**: `Ctrl+Shift+E`

*(You can customize these shortcuts underneath `chrome://extensions/shortcuts`)*

### Popup Shortcuts
When the extension popup is open, you can simply press:
*   `R` - Start Recording
*   `A` - Start Annotating
*   `S` - Save a Screenshot 
*   `C` - Capture and Copy to Clipboard

### Annotation Shortcuts
When the annotation toolbar is active on the page:
*   **Undo**: `Ctrl+Z`
*   **Redo**: `Ctrl+Y`
*   **Exit / Hide**: `Escape`

## Permissions Overview

- `activeTab` & `tabCapture`: Required to record the current tab's video and audio.
- `scripting`: Required to inject annotation and screenshot functionalities directly into the active webpage.
- `storage`: Saves user preferences (e.g., timer toggle, timer position).
- `offscreen`: Used to handle background video recording reliably in Chrome Manifest V3.
- `downloads`: Allows the extension to seamlessly save merged videos and screenshots to your computer.
