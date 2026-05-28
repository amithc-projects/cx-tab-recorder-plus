/**
 * Event helpers.
 *
 * Rules:
 * - Events represent intent; handlers should dispatch actions.
 * - Avoid direct state mutation in event handlers.
 *
 * Usage:
 * ```ts
 * const off = on(buttonEl, "click", () => store.dispatch({ type: "NEXT_PAGE" }));
 * emit(viewerEl, "udoc:page-change", { page: 2 });
 * off();
 * ```
 */
export function emit(el, name, detail) {
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}
/** Add a DOM listener and return a cleanup function. */
export function on(el, type, handler) {
    el.addEventListener(type, handler);
    return () => el.removeEventListener(type, handler);
}
//# sourceMappingURL=events.js.map