/**
 * Optional base class for complex stateful components.
 *
 * Rules:
 * - Root element is stable after mount.
 * - render() patches DOM inside the root only.
 * - destroy() must remove listeners and subscriptions.
 *
 * Usage:
 * ```ts
 * class Toolbar extends Component<{ store: Store<ViewerState, Action> }, State> {
 *     constructor(props: { store: Store<ViewerState, Action> }) {
 *         super(props, { page: 1 }, document.createElement("div"));
 *         this.el.className = "udoc-toolbar";
 *     }
 *     render(): void {
 *         this.el.textContent = String(this.state.page);
 *     }
 *     protected onMount(): void {
 *         this.props.store.dispatch({ type: "SET_PAGE", page: 1 });
 *     }
 * }
 * ```
 *
 * Alternative (preferred) factory pattern:
 * ```ts
 * export function createToolbar() {
 *     const el = document.createElement("div");
 *     el.className = "udoc-toolbar";
 *
 *     let unsubRender: (() => void) | null = null;
 *     function mount(container: HTMLElement, store: Store<ViewerState, Action>): void {
 *         container.appendChild(el);
 *         unsubRender = store.subscribeRender((_prev, next) => {
 *             el.textContent = String(next.page);
 *         });
 *     }
 *
 *     function destroy(): void {
 *         if (unsubRender) unsubRender();
 *         el.remove();
 *     }
 *
 *     return { el, mount, destroy };
 * }
 * ```
 */
export class Component {
    props;
    state;
    el;
    cleanups = [];
    constructor(props, initialState, root) {
        this.props = props;
        this.state = initialState;
        this.el = root;
    }
    /** Mount into a container and run initial render. */
    mount(container) {
        container.appendChild(this.el);
        this.onMount();
        this.render();
    }
    /** Clean up listeners/subscriptions and remove root. */
    destroy() {
        try {
            this.onUnmount();
        }
        finally {
            for (const off of this.cleanups) {
                try {
                    off();
                }
                catch (e) {
                    console.error("Component cleanup error:", e);
                }
            }
            this.cleanups = [];
            this.el.remove();
        }
    }
    onMount() { }
    onUnmount() { }
    onUpdate(_prevProps, _prevState) { }
    /** Local state update; triggers render. */
    setState(partial) {
        const prevState = this.state;
        this.state = { ...this.state, ...partial };
        this.render();
        this.onUpdate(this.props, prevState);
    }
    /** Register a cleanup for destroy(). */
    track(cleanup) {
        this.cleanups.push(cleanup);
    }
}
//# sourceMappingURL=component.js.map