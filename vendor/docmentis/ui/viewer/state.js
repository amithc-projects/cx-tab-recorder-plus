const LEFT_TABS = new Set(["thumbnail", "outline", "bookmarks", "layers", "attachments", "fonts"]);
export function isLeftPanelTab(tab) {
    return LEFT_TABS.has(tab);
}
/** Default tool options */
export const DEFAULT_TOOL_OPTIONS = {
    strokeColor: "#ff0000",
    fillColor: null,
    strokeWidth: 2,
    opacity: 1,
    fontSize: 16,
    lineStyle: "solid",
    arrowHeadStart: "none",
    arrowHeadEnd: "open",
};
/** Check if a tool kind has an associated sub-toolbar. */
export function isToolSetKind(kind) {
    return kind === "annotate" || kind === "markup";
}
/** Formats that support annotation editing */
export const ANNOTATION_FORMATS = new Set(["pdf"]);
/** Returns format-specific view mode defaults */
export function getFormatDefaults(format) {
    switch (format) {
        case "pdf":
            return { viewMode: "paged", scrollMode: "continuous", zoomMode: "fit-spread-width-max" };
        case "docx":
            return { viewMode: "paged", scrollMode: "continuous", zoomMode: "fit-spread-width-max" };
        case "xlsx":
            return {
                viewMode: "continuous",
                scrollMode: "continuous",
                layoutMode: "single-page",
                spacingMode: "none",
                zoomMode: "fit-spread-width-max",
            };
        case "pptx":
        case "image":
            return { viewMode: "paged", scrollMode: "spread", zoomMode: "fit-spread" };
    }
}
/** Default zoom steps for zoom in/out actions */
export const DEFAULT_ZOOM_STEPS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];
// -----------------------------------------------------------------------------
// DPI and scaling constants
// -----------------------------------------------------------------------------
/** PDF points are defined at 72 DPI */
export const PDF_DPI = 72;
/** Default display DPI (CSS standard) */
export const DEFAULT_DPI = 96;
/** Scale factor to convert PDF points to pixels at 100% zoom */
export const POINTS_TO_PIXELS = DEFAULT_DPI / PDF_DPI; // 1.333...
/** Calculate the scale factor for a given display DPI */
export function getPointsToPixels(dpi) {
    return dpi / PDF_DPI;
}
export const initialState = {
    doc: null,
    documentFormat: null,
    page: 1,
    pageCount: 0,
    pageInfos: [],
    pageGroups: [],
    activeGroupIndex: 0,
    needsPassword: false,
    passwordError: null,
    isAuthenticating: false,
    outline: null,
    outlineLoading: false,
    visibilityGroups: null,
    visibilityGroupsLoading: false,
    pageAnnotations: new Map(),
    annotationsLoading: new Set(),
    pageText: new Map(),
    textLoading: new Set(),
    textFailed: new Set(),
    navigationTarget: null,
    navigationScrollAlignment: "top",
    searchScrollAlignment: "center",
    viewMode: "paged",
    scrollMode: "continuous",
    layoutMode: "single-page",
    zoomMode: "fit-spread-width",
    zoom: 1,
    effectiveZoom: null,
    zoomSteps: DEFAULT_ZOOM_STEPS,
    pageRotation: 0,
    spacingMode: "all",
    dpi: DEFAULT_DPI,
    pageSpacing: 20,
    spreadSpacing: 20,
    thumbnailWidth: 150,
    activePanel: null,
    leftPanelWidth: null,
    rightPanelWidth: null,
    toolbarVisible: true,
    floatingToolbarVisible: true,
    leftPanelVisible: true,
    rightPanelVisible: true,
    disabledPanels: new Set(),
    fullscreenButtonVisible: true,
    downloadButtonVisible: true,
    printButtonVisible: true,
    theme: "light",
    themeSwitchingDisabled: false,
    textSelectionDisabled: false,
    transitionsEnabled: false,
    minZoom: DEFAULT_ZOOM_STEPS[0],
    maxZoom: DEFAULT_ZOOM_STEPS[DEFAULT_ZOOM_STEPS.length - 1],
    highlightedAnnotation: null,
    isFullscreen: false,
    searchQuery: "",
    searchCaseSensitive: false,
    searchFuzzy: false,
    searchMatches: [],
    searchActiveIndex: -1,
    searchNavGen: 0,
    searchNavScrollAlignment: null,
    searchPageRange: null,
    searchTextLoaded: false,
    searchTextLoading: false,
    isDownloading: false,
    downloadLoaded: 0,
    downloadTotal: 0,
    isProcessing: false,
    isPrinting: false,
    printCurrentPage: 0,
    printTotalPages: 0,
    showPrintDialog: false,
    panelTransitionsDisabled: false,
    annotationsDirtyPages: new Set(),
    selectedAnnotation: null,
    zoomAnchor: null,
    disabledTools: new Set(["annotate", "markup"]),
    activeTool: { kind: "pointer" },
    lastSubToolPerSet: { annotate: "freehand", markup: "highlight" },
    toolOptions: {},
};
//# sourceMappingURL=state.js.map