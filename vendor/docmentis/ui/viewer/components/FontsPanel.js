import { subscribeSelector } from "../../framework/selectors";
function selectFontsSlice(state) {
    return { docId: state.doc?.id ?? null };
}
function formatSource(source) {
    if (typeof source === "string")
        return source;
    return source.custom;
}
export function createFontsPanel() {
    const el = document.createElement("div");
    el.className = "udoc-fonts-panel";
    let workerClientRef = null;
    let i18nRef = null;
    let currentDocId = null;
    let unsubRender = null;
    let unsubFontUsage = null;
    function renderEntries(entries) {
        el.innerHTML = "";
        if (entries.length === 0) {
            const empty = document.createElement("div");
            empty.className = "udoc-panel-empty";
            empty.textContent = i18nRef.t("fonts.empty");
            el.appendChild(empty);
            return;
        }
        for (const entry of entries) {
            const item = document.createElement("div");
            item.className = "udoc-fonts-panel__item";
            // Spec (what the document requested)
            const specEl = document.createElement("div");
            specEl.className = "udoc-fonts-panel__spec";
            if ("typeface" in entry.spec) {
                let name = entry.spec.typeface;
                const styles = [];
                if (entry.spec.bold)
                    styles.push("Bold");
                if (entry.spec.italic)
                    styles.push("Italic");
                if (styles.length > 0)
                    name += ` ${styles.join(" ")}`;
                specEl.textContent = name;
            }
            else {
                specEl.textContent = entry.spec.fontId;
            }
            item.appendChild(specEl);
            // Font tree (resolved + fallbacks)
            const treeEl = document.createElement("div");
            treeEl.className = "udoc-fonts-panel__tree";
            // Build resolved font info row
            const allFonts = [
                { info: entry.resolved, primary: true },
                ...entry.fallbacks.map((fb) => ({ info: fb, primary: false })),
            ];
            for (const { info, primary } of allFonts) {
                const row = document.createElement("div");
                row.className = `udoc-fonts-panel__font-row${primary ? "" : " udoc-fonts-panel__font-row--fallback"}`;
                const dot = document.createElement("span");
                dot.className = `udoc-fonts-panel__dot${primary ? " udoc-fonts-panel__dot--primary" : ""}`;
                row.appendChild(dot);
                const nameEl = document.createElement("span");
                nameEl.className = "udoc-fonts-panel__font-name";
                let fontName = info.familyName ||
                    info.postscriptName ||
                    ("typeface" in entry.spec ? entry.spec.typeface : entry.spec.fontId);
                if (info.bold)
                    fontName += " Bold";
                if (info.italic)
                    fontName += " Italic";
                nameEl.textContent = fontName;
                row.appendChild(nameEl);
                const sourceEl = document.createElement("span");
                sourceEl.className = "udoc-fonts-panel__source";
                sourceEl.textContent = formatSource(info.source);
                row.appendChild(sourceEl);
                treeEl.appendChild(row);
            }
            item.appendChild(treeEl);
            el.appendChild(item);
        }
    }
    function showLoading() {
        el.innerHTML = "";
        const loading = document.createElement("div");
        loading.className = "udoc-fonts-panel__loading";
        loading.textContent = i18nRef.t("fonts.loading");
        el.appendChild(loading);
    }
    async function loadFontUsage(docId) {
        if (!workerClientRef)
            return;
        try {
            const entries = (await workerClientRef.getFontUsage(docId));
            // Check we're still showing the same doc
            if (currentDocId === docId) {
                renderEntries(entries);
            }
        }
        catch {
            // Document may have been unloaded
        }
    }
    function applyState(slice) {
        if (slice.docId === currentDocId)
            return;
        currentDocId = slice.docId;
        if (!currentDocId) {
            el.innerHTML = "";
            return;
        }
        showLoading();
        loadFontUsage(currentDocId);
    }
    function mount(container, store, workerClient, i18n) {
        container.appendChild(el);
        workerClientRef = workerClient;
        i18nRef = i18n;
        applyState(selectFontsSlice(store.getState()));
        unsubRender = subscribeSelector(store, selectFontsSlice, applyState, {
            equality: (a, b) => a.docId === b.docId,
        });
        // Listen for font usage changes to refresh
        unsubFontUsage = workerClient.onFontUsageChanged((docId) => {
            if (currentDocId === docId) {
                loadFontUsage(docId);
            }
        });
    }
    function destroy() {
        if (unsubRender)
            unsubRender();
        if (unsubFontUsage)
            unsubFontUsage();
        workerClientRef = null;
        currentDocId = null;
        el.remove();
    }
    return { el, mount, destroy };
}
//# sourceMappingURL=FontsPanel.js.map