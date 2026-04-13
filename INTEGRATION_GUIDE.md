# Sidekick Web Component Integration Guide

This document outlines how to embed the Sidekick File Manager natively into any HTML document, Single Page Application (SPA), or Browser Extension.

Sidekick leverages the **Shadow DOM**, which means it is entirely self-contained. The React application and all Tailwind CSS styles are strictly isolated—it will not break your host application's CSS, and your global CSS will not affect its interior design.

---

## 1. Quick Start Installation

Because the application is compiled in Vite's "Library Mode", deployment is as simple as injecting a single JavaScript file.

#### Step 1: Link the Source
Place the compiled executable script into your `<head>` or `<body>`.
```html
<!-- Load the Sidekick Web Component Bundle -->
<script src="/path/to/dist/sidekick-manager.iife.js"></script>
```

#### Step 2: Render the Component
Place the custom element wherever you want the File Manager to safely mount. It will expand to fill exactly `100%` of its parent container's width and height boundaries.
```html
<main style="width: 100vw; height: 100vh;">
    <!-- Render the complete file manager -->
    <sidekick-manager></sidekick-manager>
</main>
```

---

## 2. Reading Data (Outbound Telemetry)

Sidekick aggressively detaches itself from React state layers and communicates to your environment using **Standard DOM CustomEvents**. You can listen to these events exactly as you would listen to a standard button `<click>`!

To listen to the component, select the element and attach an Event Listener targeting the `sidekick:[event]` prefix.

### Example Listener Script
```javascript
const manager = document.querySelector('sidekick-manager');

manager.addEventListener('sidekick:selection', (event) => {
    const payload = event.detail;
    console.log("The user highlighted these files:", payload.items);
});
```

### Event Reference Dictionary
All telemetry payloads are delivered securely inside the native `event.detail` wrapper.

| Event Name | Trigger | `event.detail` Payload Structure Example |
| :--- | :--- | :--- |
| `sidekick:ready` | Fires immediately once the React lifecycle finishes booting internally. | `{ version: '1.0' }` |
| `sidekick:workspace` | Fires when the user traverses a folder or explicitly selects a top-level directory root. | `{ folderName: 'sandbox', pathLength: 1 }` |
| `sidekick:selection` | Fires **any time** the highlighted selection array shifts natively or via modifier clicks. | `{ items: ['image.jpg', 'video.mp4'] }` |
| `sidekick:action` | Fires when an OS-level generic action completes (e.g. copying text, deleting chunks). | `{ action: 'copy-contents', target: 'data.json' }` |
| `sidekick:error` | Fires if the browser blocks a high-level FSA prompt or Read/Write protocol. | `{ code: 'FSA_DENIED', message: 'Access Denied' }` |

---

## 3. Passing Data (Inbound Control)

Because `<sidekick-manager>` is treated as a first-class HTMLElement Node constructed uniquely by the browser, passing data *back* into the File Manager from your Host Environment is purely object-oriented native manipulation.

To control the application:
1. Target the DOM Node: `const manager = document.querySelector('sidekick-manager');`
2. Since the class prototype natively extends `HTMLElement`, any exposed methods directly patched onto the `class SidekickManager` definition in your Source Code become immediately globally callable by external scripts.

**Example (Programmatic Deep Linking & Configuration):**
Once the user has evaluated a Root Folder, your Host Extension can instantly skip into nested sub-directories natively bypassing the UI. You can also pass an optional payload to force specific File selections and Visual Modes instantly!
```javascript
// Target the embedded Web Component
const manager = document.querySelector('sidekick-manager');

// Plunge recursively into the active workspace AND forcefully select a file in Filmstrip mode!
manager.navigate('www.bbc.co.uk/assets/images', {
    filename: 'hero-banner.webp', // The file to automatically highlight once loaded
    viewMode: 'filmstrip',        // 'grid' | 'list' | 'filmstrip'
    sortBy: 'date',               // 'name' | 'type' | 'date' | 'size'
    sortAsc: false                // true (ascending) | false (descending)
}); 
```
