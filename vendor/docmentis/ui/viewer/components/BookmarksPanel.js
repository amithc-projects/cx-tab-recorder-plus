export function createBookmarksPanel() {
    const el = document.createElement("div");
    el.className = "udoc-bookmarks-panel";
    function mount(container, i18n) {
        const empty = document.createElement("div");
        empty.className = "udoc-panel-empty";
        empty.textContent = i18n.t("bookmarks.empty");
        el.appendChild(empty);
        container.appendChild(el);
    }
    function destroy() {
        el.remove();
    }
    return { el, mount, destroy };
}
//# sourceMappingURL=BookmarksPanel.js.map