/**
 * DOM patch helpers.
 *
 * Rules:
 * - Use in render subscribers only.
 * - Avoid redundant writes for performance.
 *
 * Usage:
 * ```ts
 * setText(titleEl, state.title);
 * toggleClass(panelEl, "is-open", state.open);
 * ```
 */
export function setText(el, text) {
    if (el.textContent !== text)
        el.textContent = text;
}
/** Set or remove attribute with change detection. */
export function setAttr(el, name, value) {
    if (value === null)
        el.removeAttribute(name);
    else if (el.getAttribute(name) !== value)
        el.setAttribute(name, value);
}
/** Toggle class with optional explicit boolean. */
export function toggleClass(el, className, force) {
    el.classList.toggle(className, force);
}
//# sourceMappingURL=dom.js.map