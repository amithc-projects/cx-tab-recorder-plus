/**
 * Convert annotation color to CSS rgba() string.
 */
export function colorToRgba(color, opacity, defaultColor = "rgba(255, 255, 0, 0.3)") {
    if (!color)
        return defaultColor;
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
/**
 * Convert annotation color to CSS rgb() string.
 */
export function colorToRgb(color, defaultColor = "rgb(0, 0, 0)") {
    if (!color)
        return defaultColor;
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `rgb(${r}, ${g}, ${b})`;
}
/**
 * Scale a point from page coordinates to screen pixels.
 */
export function scalePoint(point, scale) {
    return {
        x: point.x * scale,
        y: point.y * scale,
    };
}
/**
 * Scale bounds from page coordinates to screen pixels.
 */
export function scaleBounds(bounds, scale) {
    return {
        x: bounds.x * scale,
        y: bounds.y * scale,
        width: bounds.width * scale,
        height: bounds.height * scale,
    };
}
/**
 * Apply bounds as inline styles to an element.
 */
export function applyBoundsStyle(el, bounds, scale) {
    el.style.position = "absolute";
    el.style.left = `${bounds.x * scale}px`;
    el.style.top = `${bounds.y * scale}px`;
    el.style.width = `${bounds.width * scale}px`;
    el.style.height = `${bounds.height * scale}px`;
}
/**
 * Create an SVG element sized to cover the annotation layer.
 *
 * Hit-testing for these overlays is owned by the package stylesheet: the
 * <svg> root gets `pointer-events: none` and each painted child gets
 * `pointer-events: visiblePainted`, so empty SVG space passes through to
 * text/canvas underneath while painted geometry still fires hover/click.
 * The rules live in CSS (not inline here) so host apps can override them
 * with a normal selector — no `!important` needed.
 */
export function createSvgOverlay() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.overflow = "visible";
    return svg;
}
/**
 * Create SVG namespace element helper.
 */
export function createSvgElement(tagName) {
    return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}
/**
 * Check if two bounds are approximately equal (for highlight matching).
 */
export function boundsMatch(a, b, epsilon = 0.1) {
    return (Math.abs(a.x - b.x) < epsilon &&
        Math.abs(a.y - b.y) < epsilon &&
        Math.abs(a.width - b.width) < epsilon &&
        Math.abs(a.height - b.height) < epsilon);
}
/**
 * Inverse of the CSS `rotate(rotation deg)` applied to the annotation layer.
 *
 * Annotation bounds are stored in unrotated MediaBox space; the layer is then
 * rotated by the viewer. Pointer events arrive in displayed (rotated) space,
 * so deltas/points must be inverse-rotated before being written into the
 * annotation model. Operates on screen-frame coordinates (y-down).
 */
export function invertPageRotation(dx, dy, rotation) {
    switch (rotation) {
        case 0:
            return { x: dx, y: dy };
        case 90:
            return { x: dy, y: -dx };
        case 180:
            return { x: -dx, y: -dy };
        case 270:
            return { x: -dy, y: dx };
    }
}
// =============================================================================
// Annotation geometry helpers
// =============================================================================
/** Remap a point from oldBounds coordinate space to newBounds. */
function remapPoint(p, oldBounds, newBounds) {
    const sx = oldBounds.width > 0 ? (p.x - oldBounds.x) / oldBounds.width : 0;
    const sy = oldBounds.height > 0 ? (p.y - oldBounds.y) / oldBounds.height : 0;
    return { x: newBounds.x + sx * newBounds.width, y: newBounds.y + sy * newBounds.height };
}
function remapQuads(quads, oldBounds, newBounds) {
    return quads.map((q) => ({
        points: q.points.map((p) => remapPoint(p, oldBounds, newBounds)),
    }));
}
/**
 * Return a new annotation with all geometry scaled to fit newBounds.
 * Points are remapped proportionally from the old bounds to the new bounds.
 */
export function resizeAnnotation(annotation, newBounds) {
    const oldBounds = annotation.bounds;
    const base = { bounds: newBounds };
    switch (annotation.type) {
        case "line":
            return {
                ...annotation,
                ...base,
                start: remapPoint(annotation.start, oldBounds, newBounds),
                end: remapPoint(annotation.end, oldBounds, newBounds),
            };
        case "polygon":
        case "polyLine":
            return {
                ...annotation,
                ...base,
                vertices: annotation.vertices.map((p) => remapPoint(p, oldBounds, newBounds)),
            };
        case "ink":
            return {
                ...annotation,
                ...base,
                inkList: annotation.inkList.map((stroke) => stroke.map((p) => remapPoint(p, oldBounds, newBounds))),
            };
        case "highlight":
        case "underline":
        case "strikeOut":
        case "squiggly":
            return { ...annotation, ...base, quads: remapQuads(annotation.quads, oldBounds, newBounds) };
        case "redact":
            return {
                ...annotation,
                ...base,
                quads: annotation.quads ? remapQuads(annotation.quads, oldBounds, newBounds) : undefined,
            };
        case "freeText":
            return {
                ...annotation,
                ...base,
                calloutLine: annotation.calloutLine?.map((p) => remapPoint(p, oldBounds, newBounds)),
            };
        default:
            return { ...annotation, ...base };
    }
}
function offsetRect(r, dx, dy) {
    return { x: r.x + dx, y: r.y + dy, width: r.width, height: r.height };
}
function offsetPoint(p, dx, dy) {
    return { x: p.x + dx, y: p.y + dy };
}
function offsetQuads(quads, dx, dy) {
    return quads.map((q) => ({
        points: q.points.map((p) => offsetPoint(p, dx, dy)),
    }));
}
/**
 * Return a new annotation with all geometry offset by (dx, dy) in page coordinates.
 */
export function offsetAnnotation(annotation, dx, dy) {
    const base = { bounds: offsetRect(annotation.bounds, dx, dy) };
    switch (annotation.type) {
        case "line":
            return {
                ...annotation,
                ...base,
                start: offsetPoint(annotation.start, dx, dy),
                end: offsetPoint(annotation.end, dx, dy),
            };
        case "polygon":
        case "polyLine":
            return { ...annotation, ...base, vertices: annotation.vertices.map((p) => offsetPoint(p, dx, dy)) };
        case "ink":
            return {
                ...annotation,
                ...base,
                inkList: annotation.inkList.map((stroke) => stroke.map((p) => offsetPoint(p, dx, dy))),
            };
        case "highlight":
        case "underline":
        case "strikeOut":
        case "squiggly":
            return { ...annotation, ...base, quads: offsetQuads(annotation.quads, dx, dy) };
        case "redact":
            return {
                ...annotation,
                ...base,
                quads: annotation.quads ? offsetQuads(annotation.quads, dx, dy) : undefined,
            };
        case "freeText":
            return { ...annotation, ...base, calloutLine: annotation.calloutLine?.map((p) => offsetPoint(p, dx, dy)) };
        default:
            // square, circle, text, stamp, caret, link — only bounds
            return { ...annotation, ...base };
    }
}
/**
 * Apply a partial patch to an annotation, returning a new annotation.
 *
 * - `type` and `name` in the patch are silently ignored (the existing values
 *   are preserved) so callers can spread an annotation in without surprises.
 * - `metadata` is shallow-merged one level so patching one field doesn't
 *   wipe the others.
 * - `undefined` values are skipped — they are not treated as "clear this
 *   field". Use `updatePageAnnotation` for full replacement semantics.
 */
export function applyAnnotationPatch(existing, patch) {
    const result = { ...existing };
    const patchRecord = patch;
    for (const key of Object.keys(patchRecord)) {
        if (key === "type" || key === "name")
            continue;
        const value = patchRecord[key];
        if (value === undefined)
            continue;
        if (key === "metadata" && value && typeof value === "object") {
            result.metadata = { ...(existing.metadata ?? {}), ...value };
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
//# sourceMappingURL=utils.js.map