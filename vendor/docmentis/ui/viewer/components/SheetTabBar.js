import { subscribeSelector } from "../../framework/selectors";
function selectSheetTabBar(state) {
    return {
        pageGroups: state.pageGroups,
        activeGroupIndex: state.activeGroupIndex,
        isXlsx: state.documentFormat === "xlsx",
    };
}
function sliceEqual(a, b) {
    return a.pageGroups === b.pageGroups && a.activeGroupIndex === b.activeGroupIndex && a.isXlsx === b.isXlsx;
}
export function createSheetTabBar() {
    const el = document.createElement("div");
    el.className = "udoc-sheet-tabs";
    el.setAttribute("role", "tablist");
    el.style.display = "none";
    let unsub = null;
    function render(slice, store) {
        const shouldShow = slice.isXlsx && slice.pageGroups.length > 0;
        el.style.display = shouldShow ? "flex" : "none";
        if (!shouldShow) {
            el.replaceChildren();
            return;
        }
        el.replaceChildren();
        slice.pageGroups.forEach((group, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "udoc-sheet-tab";
            btn.setAttribute("role", "tab");
            btn.textContent = group.name ?? `Sheet ${index + 1}`;
            btn.title = btn.textContent;
            const isActive = index === slice.activeGroupIndex;
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
            btn.tabIndex = isActive ? 0 : -1;
            if (isActive)
                btn.classList.add("udoc-sheet-tab--active");
            btn.addEventListener("click", () => {
                store.dispatch({ type: "SET_ACTIVE_GROUP", groupIndex: index });
            });
            el.appendChild(btn);
        });
    }
    function mount(parent, store) {
        parent.appendChild(el);
        render(selectSheetTabBar(store.getState()), store);
        unsub = subscribeSelector(store, selectSheetTabBar, (slice) => render(slice, store), { equality: sliceEqual });
    }
    function destroy() {
        unsub?.();
        unsub = null;
        el.remove();
    }
    return { el, mount, destroy };
}
//# sourceMappingURL=SheetTabBar.js.map