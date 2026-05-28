import { boundsMatch, applyBoundsStyle } from "./utils";
import * as MarkupRenderer from "./MarkupRenderer";
import * as LinkRenderer from "./LinkRenderer";
import * as TextRenderer from "./TextRenderer";
import * as ShapeRenderer from "./ShapeRenderer";
/** Check if annotation type uses full-layer SVG overlay or inset: 0 container. */
function isSvgBasedAnnotation(type) {
    // These annotation types render as full-layer SVG overlays
    return (type === "caret" ||
        type === "line" ||
        type === "square" ||
        type === "circle" ||
        type === "polygon" ||
        type === "polyLine" ||
        type === "ink" ||
        type === "redact");
}
/** Check if annotation type uses full-layer container (inset: 0). */
function isFullLayerAnnotation(type) {
    return type === "highlight" || type === "underline" || type === "strikeOut" || type === "squiggly";
}
/**
 * Create a highlight indicator element for an annotation.
 * Used for full-layer annotations where we can't just add a class to the container.
 */
function createHighlightIndicator(bounds, scale) {
    const el = document.createElement("div");
    el.className = "udoc-annotation-highlight-indicator";
    applyBoundsStyle(el, bounds, scale);
    return el;
}
/**
 * Render a single annotation element.
 */
export function renderAnnotation(layer, annotation, scale, onShowPopup) {
    switch (annotation.type) {
        // Link
        case "link":
            return LinkRenderer.renderLink(layer, annotation, scale);
        // Markup annotations
        case "highlight":
            return MarkupRenderer.renderHighlight(layer, annotation, scale);
        case "underline":
            return MarkupRenderer.renderUnderline(layer, annotation, scale);
        case "strikeOut":
            return MarkupRenderer.renderStrikeOut(layer, annotation, scale);
        case "squiggly":
            return MarkupRenderer.renderSquiggly(layer, annotation, scale);
        // Text annotations
        case "text":
            return TextRenderer.renderText(layer, annotation, scale, onShowPopup);
        case "freeText":
            return TextRenderer.renderFreeText(layer, annotation, scale);
        case "stamp":
            return TextRenderer.renderStamp(layer, annotation, scale);
        case "caret":
            return TextRenderer.renderCaret(layer, annotation, scale);
        // Shape annotations
        case "line":
            return ShapeRenderer.renderLine(layer, annotation, scale);
        case "square":
            return ShapeRenderer.renderSquare(layer, annotation, scale);
        case "circle":
            return ShapeRenderer.renderCircle(layer, annotation, scale);
        case "polygon":
            return ShapeRenderer.renderPolygon(layer, annotation, scale);
        case "polyLine":
            return ShapeRenderer.renderPolyLine(layer, annotation, scale);
        case "ink":
            return ShapeRenderer.renderInk(layer, annotation, scale);
        case "redact":
            return ShapeRenderer.renderRedact(layer, annotation, scale);
        default: {
            // Unknown annotation type - skip if no bounds
            const unknown = annotation;
            if (!unknown.bounds)
                return null;
            return createGenericAnnotation(layer, unknown, scale);
        }
    }
}
/**
 * Create a generic placeholder for unknown annotation types.
 */
function createGenericAnnotation(layer, annotation, scale) {
    const el = document.createElement("div");
    el.className = `udoc-annotation udoc-annotation--${annotation.type}`;
    applyBoundsStyle(el, annotation.bounds, scale);
    layer.appendChild(el);
    return el;
}
/**
 * Render all annotations into an annotation layer element.
 */
export function renderAnnotationsToLayer(layer, annotations, scale, highlightBounds, onShowPopup) {
    // Skip if no annotations to render
    if (annotations.length === 0) {
        if (layer.childElementCount > 0) {
            layer.innerHTML = "";
        }
        return;
    }
    layer.innerHTML = "";
    for (let i = 0; i < annotations.length; i++) {
        const annotation = annotations[i];
        const el = renderAnnotation(layer, annotation, scale, onShowPopup);
        if (el) {
            // Tag with index for hit-testing by the select tool
            el.setAttribute("data-annotation-index", String(i));
            // Check if this annotation should be highlighted
            if (highlightBounds && boundsMatch(annotation.bounds, highlightBounds)) {
                if (isFullLayerAnnotation(annotation.type) || isSvgBasedAnnotation(annotation.type)) {
                    // For full-layer or SVG-based annotations, add a separate highlight indicator
                    const indicator = createHighlightIndicator(annotation.bounds, scale);
                    layer.appendChild(indicator);
                }
                else {
                    // For bounded annotations, add class directly
                    el.classList.add("udoc-annotation--highlighted");
                }
            }
        }
    }
}
// =============================================================================
// Popup Management
// =============================================================================
/** Currently active popup element (only one popup at a time). */
let activePopup = null;
/** Close the currently active popup. */
export function closeAnnotationPopup() {
    if (activePopup) {
        activePopup.remove();
        activePopup = null;
    }
}
/** Show popup for an annotation. */
export function showAnnotationPopup(annotation, anchorEl, container) {
    // Close any existing popup
    closeAnnotationPopup();
    const contents = annotation.metadata?.contents || annotation.contents;
    if (!contents)
        return;
    const popup = document.createElement("div");
    popup.className = "udoc-annotation-popup";
    // Header with author and close button
    const header = document.createElement("div");
    header.className = "udoc-annotation-popup__header";
    const author = document.createElement("span");
    author.className = "udoc-annotation-popup__author";
    author.textContent = annotation.metadata?.author || "Note";
    header.appendChild(author);
    const closeBtn = document.createElement("button");
    closeBtn.className = "udoc-annotation-popup__close";
    closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeAnnotationPopup();
    };
    header.appendChild(closeBtn);
    popup.appendChild(header);
    // Content
    const content = document.createElement("div");
    content.className = "udoc-annotation-popup__content";
    content.textContent = contents;
    popup.appendChild(content);
    // Position popup near the anchor element
    const anchorRect = anchorEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    // Position to the right of the icon, within the container
    const left = anchorRect.right - containerRect.left + 4;
    const top = anchorRect.top - containerRect.top;
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    container.appendChild(popup);
    activePopup = popup;
    // Adjust if popup goes outside container
    requestAnimationFrame(() => {
        const popupRect = popup.getBoundingClientRect();
        // Check right edge
        if (popupRect.right > containerRect.right - 8) {
            // Position to the left of the icon instead
            popup.style.left = `${anchorRect.left - containerRect.left - popupRect.width - 4}px`;
        }
        // Check bottom edge
        if (popupRect.bottom > containerRect.bottom - 8) {
            popup.style.top = `${containerRect.bottom - containerRect.top - popupRect.height - 8}px`;
        }
    });
}
//# sourceMappingURL=render.js.map