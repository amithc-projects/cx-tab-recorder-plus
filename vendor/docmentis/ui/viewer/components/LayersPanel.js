import { subscribeSelector, shallowEqual } from "../../framework/selectors";
import { ICON_VISIBILITY, ICON_VISIBILITY_OFF, ICON_LOCK } from "../icons";
function selectLayersSlice(state) {
    return {
        groups: state.visibilityGroups,
        loading: state.visibilityGroupsLoading,
        docId: state.doc?.id ?? null,
    };
}
export function createLayersPanel() {
    const el = document.createElement("div");
    el.className = "udoc-layers-panel";
    let storeRef = null;
    let workerClientRef = null;
    let i18nRef = null;
    let currentSlice = null;
    let destroyed = false;
    let unsubRender = null;
    const unsubEvents = [];
    function renderGroups(groups) {
        el.innerHTML = "";
        if (groups.length === 0) {
            const empty = document.createElement("div");
            empty.className = "udoc-panel-empty";
            empty.textContent = i18nRef.t("layers.empty");
            el.appendChild(empty);
            return;
        }
        for (const group of groups) {
            const item = document.createElement("div");
            item.className = "udoc-layers-panel__item";
            if (group.locked) {
                item.classList.add("udoc-layers-panel__item--locked");
            }
            const toggle = document.createElement("button");
            toggle.className = "udoc-layers-panel__toggle";
            toggle.type = "button";
            toggle.setAttribute("role", "switch");
            toggle.setAttribute("aria-checked", String(group.visible));
            const visLabel = i18nRef.t("layers.visibility", { name: group.name });
            toggle.setAttribute("aria-label", visLabel);
            toggle.title = visLabel;
            toggle.innerHTML = group.visible ? ICON_VISIBILITY : ICON_VISIBILITY_OFF;
            toggle.classList.toggle("udoc-layers-panel__toggle--hidden", !group.visible);
            if (group.locked) {
                toggle.disabled = true;
            }
            const label = document.createElement("span");
            label.className = "udoc-layers-panel__label";
            label.textContent = group.name;
            if (!group.visible) {
                label.classList.add("udoc-layers-panel__label--hidden");
            }
            if (!group.locked) {
                const onClick = async () => {
                    if (!storeRef || !workerClientRef)
                        return;
                    const state = storeRef.getState();
                    if (!state.doc)
                        return;
                    const newVisible = !group.visible;
                    const docId = state.doc.id;
                    const client = workerClientRef;
                    try {
                        await client.setVisibilityGroupVisible(docId, group.id, newVisible);
                    }
                    catch {
                        // Worker terminated mid-flight — ignore
                        return;
                    }
                    if (destroyed || !storeRef)
                        return;
                    storeRef.dispatch({ type: "SET_VISIBILITY_GROUP_VISIBLE", groupId: group.id, visible: newVisible });
                    client.invalidateRenderCache(docId, "page");
                };
                toggle.addEventListener("click", onClick);
                unsubEvents.push(() => toggle.removeEventListener("click", onClick));
                label.addEventListener("click", onClick);
                unsubEvents.push(() => label.removeEventListener("click", onClick));
            }
            item.append(toggle, label);
            if (group.locked) {
                const lockIcon = document.createElement("span");
                lockIcon.className = "udoc-layers-panel__lock";
                lockIcon.innerHTML = ICON_LOCK;
                item.appendChild(lockIcon);
            }
            el.appendChild(item);
        }
    }
    function showLoading() {
        el.innerHTML = "";
        const loading = document.createElement("div");
        loading.className = "udoc-layers-panel__loading";
        loading.textContent = i18nRef.t("layers.loading");
        el.appendChild(loading);
    }
    function applyState(slice) {
        const changed = !currentSlice || slice.groups !== currentSlice.groups || slice.loading !== currentSlice.loading;
        if (changed) {
            // Clear old event listeners when rebuilding
            for (const off of unsubEvents)
                off();
            unsubEvents.length = 0;
            if (slice.loading) {
                showLoading();
            }
            else if (slice.groups === null) {
                el.innerHTML = "";
            }
            else {
                renderGroups(slice.groups);
            }
        }
        currentSlice = slice;
    }
    function mount(container, store, workerClient, i18n) {
        container.appendChild(el);
        storeRef = store;
        workerClientRef = workerClient;
        i18nRef = i18n;
        applyState(selectLayersSlice(store.getState()));
        unsubRender = subscribeSelector(store, selectLayersSlice, applyState, { equality: shallowEqual });
    }
    function destroy() {
        destroyed = true;
        if (unsubRender)
            unsubRender();
        for (const off of unsubEvents)
            off();
        unsubEvents.length = 0;
        storeRef = null;
        workerClientRef = null;
        currentSlice = null;
        el.remove();
    }
    return { el, mount, destroy };
}
//# sourceMappingURL=LayersPanel.js.map