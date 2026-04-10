Local History will track recent changes as you save them unless the file has been excluded or is too large.
Goal: Fix Undo/Redo Memory Leak in Annotation Engine
The current annotation engine in Tab Recorder Plus relies on canvas.getImageData() to push a massive bitmap matrix into the historyStack every time a user stops drawing. On a standard 1080p display, each snapshot uses ~8MB of RAM. On a high-DPI 4K display, each snapshot uses ~33MB of RAM. With up to 50 undo steps, this can consume 1.6+ Gigabytes of memory and instantly crash Chrome tabs!

We will refactor content.js to use a vector-based rendering engine. Instead of saving pixels, we will save lightweight data objects describing what was drawn (e.g. { type: "rect", x: 10, y: 10, w: 100, h: 50, color: "red" }) and quickly redraw the entire canvas stack whenever an Undo/Redo is triggered.

CAUTION

The project directory contains fragmented module backups (content-timer.js, content-drawing.js), but manifest.json completely relies upon the monolithic content.js. I will make these architectural changes primarily to content.js to ensure the live extension functions correctly. I will also quickly sync the relevant logic to content-drawing.js and content-init.js to prevent your modular setup from breaking.

Proposed Changes
1. content.js (and content-init.js/content-drawing.js)
We will rewrite the Canvas drawing functions, specifically:

State Management: Modify historyStack and redoStack to store shape objects instead of bitmaps.
startDrawing(): Instead of taking a pixel snapshot via getImageData(), initialize a new currentShape object with the active tool (pen, rect, ellipse), starting coordinates, and current color.
draw(): Instead of restoring pixel data on every mouse tick, update the parameters (dimensions, coordinates) of the currentShape object and trigger a fast redrawCanvas() loop.
redrawCanvas(): An entirely new rendering pipeline that loops over historyStack chronologically, painting the background vector items, and finally overlapping it with currentShape and cropRect if they exist.
stopDrawing(): Push the concluded currentShape onto the historyStack.
Open Questions
None at this time. This is a strictly backend-infrastructure change with no visual UI changes expected. The user experience will remain identical—just infinitely more stable.

Verification Plan
Load the extension in Chrome.
Trigger the annotation UI (Alt+Shift+A or A from Popup)
Draw a rectangle, ellipse, and a pen scribble. Check that dragging the pen shows a fluid preview.
Check crop tool works flawlessly (crop lines render over vectors).
Attempt Ctrl+Z to undo shapes. Ensure it gracefully removes vectors and Redo brings them back without erasing text objects.