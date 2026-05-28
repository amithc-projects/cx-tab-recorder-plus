import { applyBoundsStyle } from "./utils";
/**
 * Render a link annotation.
 */
export function renderLink(layer, annotation, scale) {
    const el = document.createElement("div");
    el.className = "udoc-annotation udoc-annotation--link";
    applyBoundsStyle(el, annotation.bounds, scale);
    el.style.pointerEvents = "auto";
    el.style.cursor = "pointer";
    if (annotation.action) {
        el.dataset.action = JSON.stringify(annotation.action);
    }
    layer.appendChild(el);
    return el;
}
//# sourceMappingURL=LinkRenderer.js.map