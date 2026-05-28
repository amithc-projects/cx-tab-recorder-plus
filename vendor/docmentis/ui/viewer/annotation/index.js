/**
 * Annotation module - types, utilities, and renderers.
 */
// Utilities
export { colorToRgba, colorToRgb, scalePoint, scaleBounds, applyBoundsStyle, createSvgOverlay, createSvgElement, boundsMatch, offsetAnnotation, resizeAnnotation, applyAnnotationPatch, } from "./utils";
// Render functions
export { renderAnnotation, renderAnnotationsToLayer, closeAnnotationPopup, showAnnotationPopup } from "./render";
// Property conversion utilities (annotation <-> ToolOptions)
export { parseHexColor, annotationColorToHex, toLineEnding, fromLineEnding, toBorderStyle, fromBorderStyle, annotationToToolOptions, applyToolOptionsToAnnotation, getEditableOptionsForAnnotation, } from "./propertyUtils";
//# sourceMappingURL=index.js.map