/**
 * AnnotationDrawController — handles mouse/pointer drawing for annotation tools.
 *
 * Converts pointer events on page slots into annotation objects dispatched to the store.
 * Supports: freehand (ink), line, arrow, rectangle, ellipse, polygon.
 * Uses the same renderAnnotation() for both live preview and final result.
 */
import { getPointsToPixels, DEFAULT_TOOL_OPTIONS, ANNOTATION_FORMATS } from "../state";
import { renderAnnotation } from "../annotation/render";
import { parseHexColor, toLineEnding, toBorderStyle } from "../annotation/propertyUtils";
import { invertPageRotation } from "../annotation/utils";
/** Normalize a rotation value to one of 0/90/180/270. */
function normalizeRotation(rotation) {
    const v = (((rotation ?? 0) % 360) + 360) % 360;
    if (v === 90 || v === 180 || v === 270)
        return v;
    return 0;
}
// CSS class for crosshair cursor during annotation drawing
const DRAW_CURSOR_CLASS = "udoc-viewer--tool-draw";
/** Compute bounding rect from a list of points. */
function boundingRect(points) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        if (p.x < minX)
            minX = p.x;
        if (p.y < minY)
            minY = p.y;
        if (p.x > maxX)
            maxX = p.x;
        if (p.y > maxY)
            maxY = p.y;
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
export function createAnnotationDrawController(options) {
    const { scrollArea, viewerRoot, store } = options;
    // Preview layer (a div placed over the page slot, rendered via renderAnnotation)
    let previewLayer = null;
    // Drawing state
    let isDrawing = false;
    let drawPageIndex = -1; // 0-based
    let drawSlot = null; // The page slot container
    let drawAnnotationLayer = null; // Rotated layer that hosts the preview
    let drawScale = 1; // pixels-per-point for converting back to PDF coords
    let drawRotation = 0; // Combined document + user rotation
    let drawPageWidthPx = 0; // Unrotated page width in pixels (MediaBox.width * drawScale)
    let drawPageHeightPx = 0; // Unrotated page height in pixels
    let drawSubTool = null;
    let drawOptions = { ...DEFAULT_TOOL_OPTIONS };
    // Accumulated points (in PDF page coordinates)
    let inkPoints = [];
    // Start/end for geometry tools (in PDF coords)
    let startPt = { x: 0, y: 0 };
    let endPt = { x: 0, y: 0 };
    // Committed vertices for polygon (click-to-add mode)
    let polygonVertices = [];
    /** Convert a client-space pointer event to unrotated MediaBox page coordinates.
     *
     * The slot container's bounding box matches the rotated visual; the
     * annotation layer inside it is unrotated and centered, with CSS rotate
     * applied around the layer's center (== container center). To recover
     * MediaBox coords we offset the pointer to that center, undo the
     * rotation, then re-anchor to the unrotated layer's top-left. */
    function clientToPageCoords(e) {
        if (!drawSlot)
            return null;
        const rect = drawSlot.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const rel = invertPageRotation(px - rect.width / 2, py - rect.height / 2, drawRotation);
        return {
            x: (rel.x + drawPageWidthPx / 2) / drawScale,
            y: (rel.y + drawPageHeightPx / 2) / drawScale,
        };
    }
    /** Build an Annotation object from the current drawing state, or null if invalid. */
    function buildCurrentAnnotation() {
        const color = parseHexColor(drawOptions.strokeColor);
        const opacity = drawOptions.opacity;
        const borderWidth = drawOptions.strokeWidth;
        const borderStyle = toBorderStyle(drawOptions.lineStyle);
        if (drawSubTool === "freehand" && inkPoints.length >= 2) {
            return {
                type: "ink",
                bounds: boundingRect(inkPoints),
                inkList: [inkPoints],
                color,
                borderWidth,
                borderStyle,
                opacity,
            };
        }
        if ((drawSubTool === "line" || drawSubTool === "arrow") && (startPt.x !== endPt.x || startPt.y !== endPt.y)) {
            return {
                type: "line",
                bounds: boundingRect([startPt, endPt]),
                start: startPt,
                end: endPt,
                startEnding: drawSubTool === "arrow" ? toLineEnding(drawOptions.arrowHeadStart) : "None",
                endEnding: drawSubTool === "arrow" ? toLineEnding(drawOptions.arrowHeadEnd) : "None",
                color,
                borderWidth,
                borderStyle,
                opacity,
            };
        }
        if (drawSubTool === "rectangle" && startPt.x !== endPt.x && startPt.y !== endPt.y) {
            const x = Math.min(startPt.x, endPt.x);
            const y = Math.min(startPt.y, endPt.y);
            return {
                type: "square",
                bounds: { x, y, width: Math.abs(endPt.x - startPt.x), height: Math.abs(endPt.y - startPt.y) },
                color,
                interiorColor: drawOptions.fillColor ? parseHexColor(drawOptions.fillColor) : undefined,
                borderWidth,
                borderStyle,
                opacity,
            };
        }
        if (drawSubTool === "ellipse" && startPt.x !== endPt.x && startPt.y !== endPt.y) {
            const x = Math.min(startPt.x, endPt.x);
            const y = Math.min(startPt.y, endPt.y);
            return {
                type: "circle",
                bounds: { x, y, width: Math.abs(endPt.x - startPt.x), height: Math.abs(endPt.y - startPt.y) },
                color,
                interiorColor: drawOptions.fillColor ? parseHexColor(drawOptions.fillColor) : undefined,
                borderWidth,
                borderStyle,
                opacity,
            };
        }
        if (drawSubTool === "polygon" || drawSubTool === "polyline") {
            // During drawing: committed vertices + current cursor position
            const verts = isDrawing ? [...polygonVertices, endPt] : polygonVertices;
            if (verts.length >= 2) {
                if (drawSubTool === "polygon") {
                    return {
                        type: "polygon",
                        bounds: boundingRect(verts),
                        vertices: verts,
                        color,
                        interiorColor: drawOptions.fillColor ? parseHexColor(drawOptions.fillColor) : undefined,
                        borderWidth,
                        borderStyle,
                        startEnding: "None",
                        endEnding: "None",
                        opacity,
                    };
                }
                else {
                    return {
                        type: "polyLine",
                        bounds: boundingRect(verts),
                        vertices: verts,
                        color,
                        borderWidth,
                        borderStyle,
                        startEnding: "None",
                        endEnding: "None",
                        opacity,
                    };
                }
            }
        }
        return null;
    }
    /** Create the preview layer inside the rotated annotation layer.
     *
     * Placing the preview in the annotation layer (which is CSS-rotated to
     * match the page's effective rotation) means the preview shares the same
     * unrotated MediaBox coordinate space as committed annotations — both the
     * mid-drag preview and the final render line up under any rotation. */
    function createPreviewLayer() {
        if (!drawAnnotationLayer)
            return;
        previewLayer = document.createElement("div");
        previewLayer.style.position = "absolute";
        previewLayer.style.inset = "0";
        previewLayer.style.pointerEvents = "none";
        previewLayer.style.zIndex = "10";
        previewLayer.className = "udoc-annotation-draw-preview";
        drawAnnotationLayer.appendChild(previewLayer);
    }
    /** Update the live preview using the same renderer as final annotations. */
    function updatePreview() {
        if (!previewLayer)
            return;
        previewLayer.innerHTML = "";
        const annotation = buildCurrentAnnotation();
        if (annotation) {
            renderAnnotation(previewLayer, annotation, drawScale);
        }
    }
    /** Remove the preview layer. */
    function removePreview() {
        if (previewLayer) {
            previewLayer.remove();
            previewLayer = null;
        }
    }
    /** Finalize drawing and dispatch the annotation to the store. */
    function finishDrawing() {
        if (!isDrawing)
            return;
        // Polygon needs >= 3 vertices, polyline needs >= 2
        const minVerts = drawSubTool === "polygon" ? 3 : 2;
        if ((drawSubTool === "polygon" || drawSubTool === "polyline") && polygonVertices.length < minVerts) {
            isDrawing = false;
            removePreview();
            polygonVertices = [];
            return;
        }
        isDrawing = false;
        const annotation = buildCurrentAnnotation();
        if (annotation && drawPageIndex >= 0) {
            store.dispatch({ type: "ADD_ANNOTATION", pageIndex: drawPageIndex, annotation });
        }
        removePreview();
        inkPoints = [];
        polygonVertices = [];
    }
    // --- Shared setup for starting a draw on a page slot ---
    function beginDrawOnSlot(e) {
        const state = store.getState();
        const at = state.activeTool;
        if (at.kind !== "annotate")
            return null;
        const tool = at.sub;
        const target = e.target;
        const slotEl = target.closest("[data-page]");
        if (!slotEl)
            return null;
        const pageNum = parseInt(slotEl.dataset.page, 10);
        if (isNaN(pageNum))
            return null;
        drawPageIndex = pageNum - 1;
        drawSlot = slotEl;
        drawAnnotationLayer = slotEl.querySelector(".udoc-spread__annotation-layer");
        drawSubTool = tool;
        drawOptions = state.toolOptions[tool] ?? { ...DEFAULT_TOOL_OPTIONS };
        const pointsToPixels = getPointsToPixels(state.dpi);
        const zoom = state.effectiveZoom ?? state.zoom;
        drawScale = pointsToPixels * zoom;
        const pageInfo = state.pageInfos[drawPageIndex];
        const documentRotation = normalizeRotation(pageInfo?.rotation);
        const userRotation = normalizeRotation(state.pageRotation);
        drawRotation = normalizeRotation(documentRotation + userRotation);
        drawPageWidthPx = (pageInfo?.width ?? 0) * drawScale;
        drawPageHeightPx = (pageInfo?.height ?? 0) * drawScale;
        return clientToPageCoords(e);
    }
    // --- Pointer event handlers ---
    function onPointerDown(e) {
        if (e.button !== 0)
            return;
        // Polygon/polyline use click-to-add mode, handled separately
        if (isDrawing && (drawSubTool === "polygon" || drawSubTool === "polyline"))
            return;
        const state = store.getState();
        const sub = state.activeTool.kind === "annotate" ? state.activeTool.sub : null;
        if (sub === "polygon" || sub === "polyline")
            return;
        const pt = beginDrawOnSlot(e);
        if (!pt)
            return;
        isDrawing = true;
        startPt = pt;
        endPt = pt;
        inkPoints = [pt];
        createPreviewLayer();
        scrollArea.setPointerCapture(e.pointerId);
        e.preventDefault();
    }
    function onPointerMove(e) {
        if (!isDrawing)
            return;
        const pt = clientToPageCoords(e);
        if (!pt)
            return;
        endPt = pt;
        if (drawSubTool === "freehand") {
            inkPoints.push(pt);
        }
        updatePreview();
    }
    function onPointerUp(e) {
        if (!isDrawing)
            return;
        if (drawSubTool === "polygon" || drawSubTool === "polyline")
            return; // finishes on double-click
        scrollArea.releasePointerCapture(e.pointerId);
        finishDrawing();
    }
    function onPointerCancel(e) {
        if (!isDrawing)
            return;
        scrollArea.releasePointerCapture(e.pointerId);
        isDrawing = false;
        removePreview();
        inkPoints = [];
        polygonVertices = [];
    }
    // --- Polygon click/double-click handlers ---
    function onClick(e) {
        if (e.button !== 0)
            return;
        const state = store.getState();
        const sub = state.activeTool.kind === "annotate" ? state.activeTool.sub : null;
        if (sub !== "polygon" && sub !== "polyline")
            return;
        if (!isDrawing) {
            // First click — start polygon
            const pt = beginDrawOnSlot(e);
            if (!pt)
                return;
            isDrawing = true;
            polygonVertices = [pt];
            endPt = pt;
            createPreviewLayer();
            e.preventDefault();
        }
        else {
            // Subsequent click — add vertex
            const pt = clientToPageCoords(e);
            if (!pt)
                return;
            polygonVertices.push(pt);
            endPt = pt;
            updatePreview();
            e.preventDefault();
        }
    }
    function onDblClick(e) {
        if (!isDrawing || (drawSubTool !== "polygon" && drawSubTool !== "polyline"))
            return;
        e.preventDefault();
        finishDrawing();
    }
    // --- Cursor management ---
    let active = false;
    function activate() {
        if (active)
            return;
        active = true;
        viewerRoot.classList.add(DRAW_CURSOR_CLASS);
        scrollArea.addEventListener("pointerdown", onPointerDown);
        scrollArea.addEventListener("pointermove", onPointerMove);
        scrollArea.addEventListener("pointerup", onPointerUp);
        scrollArea.addEventListener("pointercancel", onPointerCancel);
        scrollArea.addEventListener("click", onClick);
        scrollArea.addEventListener("dblclick", onDblClick);
    }
    function deactivate() {
        if (!active)
            return;
        active = false;
        viewerRoot.classList.remove(DRAW_CURSOR_CLASS);
        scrollArea.removeEventListener("pointerdown", onPointerDown);
        scrollArea.removeEventListener("pointermove", onPointerMove);
        scrollArea.removeEventListener("pointerup", onPointerUp);
        scrollArea.removeEventListener("pointercancel", onPointerCancel);
        scrollArea.removeEventListener("click", onClick);
        scrollArea.removeEventListener("dblclick", onDblClick);
        if (isDrawing) {
            finishDrawing();
        }
    }
    function canDraw(s) {
        const at = s.activeTool;
        return (s.documentFormat !== null &&
            ANNOTATION_FORMATS.has(s.documentFormat) &&
            at.kind === "annotate" &&
            at.sub !== "select");
    }
    function annotateSub(s) {
        return s.activeTool.kind === "annotate" ? s.activeTool.sub : null;
    }
    // Subscribe to store for tool changes
    const unsub = store.subscribeRender((prev, next) => {
        if (canDraw(next)) {
            // If the sub-tool changed while drawing, finish the in-progress shape
            if (isDrawing && annotateSub(prev) !== annotateSub(next)) {
                finishDrawing();
            }
            activate();
        }
        else {
            deactivate();
        }
    });
    // Listen for finish-drawing events (e.g. re-clicking the active polygon/polyline tool)
    const onFinishDrawing = () => {
        if (isDrawing)
            finishDrawing();
    };
    document.addEventListener("udoc-finish-drawing", onFinishDrawing);
    // Check initial state
    if (canDraw(store.getState())) {
        activate();
    }
    function destroy() {
        unsub();
        document.removeEventListener("udoc-finish-drawing", onFinishDrawing);
        deactivate();
    }
    return { destroy };
}
//# sourceMappingURL=AnnotationDrawController.js.map