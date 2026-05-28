/** Shallow object equality for small selector slices. */
export function shallowEqual(a, b) {
    for (const k in a)
        if (a[k] !== b[k])
            return false;
    for (const k in b)
        if (!(k in a))
            return false;
    return true;
}
/**
 * Subscribe to a derived slice with equality checking.
 * Default phase is render; use phase "effect" for async work.
 */
export function subscribeSelector(store, selector, listener, options = {}) {
    const equality = options.equality ?? Object.is;
    let prevSlice = selector(store.getState());
    const handler = (_prev, next) => {
        const nextSlice = selector(next);
        if (equality(prevSlice, nextSlice))
            return;
        const prev = prevSlice;
        prevSlice = nextSlice;
        listener(nextSlice, prev);
    };
    return options.phase === "effect" ? store.subscribeEffect(handler) : store.subscribeRender(handler);
}
//# sourceMappingURL=selectors.js.map