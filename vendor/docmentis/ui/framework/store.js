/**
 * Create a store with optional microtask batching for subscriber notifications.
 * Batching groups multiple dispatches into a single notify cycle.
 */
export function createStore(reducer, initialState, options = {}) {
    let state = initialState;
    const renderSubs = new Set();
    const effectSubs = new Set();
    const actionSubs = new Set();
    const batched = options.batched ?? true;
    let pending = false;
    let lastPrev = null;
    let lastNext = null;
    function notify(prev, next) {
        for (const fn of renderSubs) {
            try {
                fn(prev, next);
            }
            catch (e) {
                console.error("Render subscriber error:", e);
            }
        }
        for (const fn of effectSubs) {
            try {
                fn(prev, next);
            }
            catch (e) {
                console.error("Effect subscriber error:", e);
            }
        }
    }
    function scheduleNotify(prev, next) {
        if (!batched)
            return notify(prev, next);
        lastPrev = lastPrev ?? prev;
        lastNext = next;
        if (pending)
            return;
        pending = true;
        queueMicrotask(() => {
            pending = false;
            const p = lastPrev;
            const n = lastNext;
            lastPrev = null;
            lastNext = null;
            notify(p, n);
        });
    }
    function dispatch(action) {
        const prev = state;
        const next = reducer(prev, action);
        if (next === prev)
            return;
        state = next;
        for (const fn of actionSubs) {
            try {
                fn(action, prev, next);
            }
            catch (e) {
                console.error("Action subscriber error:", e);
            }
        }
        scheduleNotify(prev, next);
    }
    function subscribeRender(fn) {
        renderSubs.add(fn);
        return () => renderSubs.delete(fn);
    }
    function subscribeEffect(fn) {
        effectSubs.add(fn);
        return () => effectSubs.delete(fn);
    }
    function subscribeAction(fn) {
        actionSubs.add(fn);
        return () => actionSubs.delete(fn);
    }
    return { getState: () => state, dispatch, subscribeRender, subscribeEffect, subscribeAction };
}
//# sourceMappingURL=store.js.map