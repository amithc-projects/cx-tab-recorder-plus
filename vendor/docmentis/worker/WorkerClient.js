/**
 * Low-level client for communicating with the UDoc worker.
 *
 * Provides a Promise-based API for document operations.
 * Also handles render queue, cache, and priority management.
 * This is an internal API - use UDocClient for the public SDK.
 */
import { WORKER_INLINE } from "./worker-inline.js";
function makeWorkKey(item) {
    if (item.kind === "render") {
        return `render:${makeRenderKey(item.docId, item.page, item.type, item.scale)}`;
    }
    if (item.kind === "fontUsageCheck") {
        return `fontUsageCheck:${item.docId}`;
    }
    return `${item.kind}:${item.docId}:${item.page}`;
}
/**
 * Generate a cache key for render requests.
 * Uses toFixed(4) for scale to normalize floating-point variations.
 * Exported so Spread component can use the same key format.
 */
export function makeRenderKey(docId, page, type, scale) {
    return `${docId}:${page}:${type}:${scale.toFixed(4)}`;
}
/**
 * Heuristic detection of allocation/OOM-style errors, covering:
 *  - JS-side: `RangeError: Array buffer allocation failed`, ImageBitmap OOM.
 *  - WASM-side: Rust allocator aborts surface as `RuntimeError`/"memory access out of bounds"
 *    or "unreachable executed" after a failed `memory.grow`.
 */
function isOOMError(err) {
    if (!err)
        return false;
    if (err instanceof RangeError)
        return true;
    const msg = err instanceof Error ? err.message : String(err);
    return /out of memory|allocation failed|memory access out of bounds|unreachable executed|RuntimeError/i.test(msg);
}
export class WorkerClient {
    worker;
    requestId = 0;
    pending = new Map();
    // Render management state - separate caches for page, thumbnail, and preview; single queue
    pageRenderCache = new Map();
    thumbnailRenderCache = new Map();
    previewRenderCache = new Map();
    workQueue = [];
    currentWork = null;
    // Page bitmaps grow with zoom and DPR (a single 4096² bitmap is 64 MB), so
    // the page cache is sized by bytes rather than entry count. Thumbnail and
    // preview bitmaps are small, so they stay count-based.
    maxPageCacheBytes = 256 * 1024 * 1024;
    maxThumbnailCacheSize = 500;
    maxPreviewCacheSize = 50;
    // Separate focus tracking for page and thumbnail boost
    pageFocus = null;
    thumbnailFocus = null;
    // Callbacks notified when render cache is invalidated
    renderInvalidatedCallbacks = new Set();
    // Callbacks notified when an OOM error is detected during render
    oomCallbacks = new Set();
    lastOOMClearAt = 0;
    // Font usage change detection
    fontUsageChangedCallbacks = new Set();
    lastFontUsageLength = new Map();
    // Performance counter per document (for tracking operations)
    performanceCounters = new Map();
    // Page info cache per document (populated by getAllPageInfo, used by getPageInfo)
    pageInfoCache = new Map();
    // Page group cache per document (populated by getPageGroups)
    pageGroupsCache = new Map();
    constructor(worker) {
        this.worker = worker;
        this.worker.onmessage = this.handleMessage.bind(this);
        this.worker.onerror = this.handleError.bind(this);
    }
    /**
     * Create a WorkerClient using the inline bundled worker.
     * Creates a blob worker from the build-time inlined source code,
     * avoiding "about:blank" for universal bundler compatibility.
     *
     * Falls back to module worker via "about:blank" when WORKER_INLINE
     * is empty (e.g. running from TypeScript source in Vite dev mode).
     */
    static create() {
        if (WORKER_INLINE) {
            const blob = new Blob([WORKER_INLINE], { type: "text/javascript" });
            const url = URL.createObjectURL(blob);
            const worker = new Worker(url);
            return new WorkerClient(worker);
        }
        // Dev mode fallback: Vite/bundlers can resolve the worker from source
        const worker = new Worker(new URL("./worker.js", "about:blank"), { type: "module" });
        return new WorkerClient(worker);
    }
    /**
     * Create a WorkerClient with a custom worker URL.
     * Use this when hosting worker files at a custom location.
     */
    static createWithUrl(workerUrl) {
        const worker = new Worker(workerUrl, { type: "module" });
        return new WorkerClient(worker);
    }
    /**
     * Initialize the WASM module.
     */
    async init(wasmUrl, gpu, domain, viewerVersion) {
        await this.send({ type: "init", wasmUrl, gpu, domain, viewerVersion });
    }
    /**
     * Set the anonymous distinct ID for telemetry tracking.
     */
    async setupTelemetry(distinctId) {
        await this.send({ type: "setupTelemetry", distinctId });
    }
    /**
     * Disable telemetry reporting. Requires a license with the "no_telemetry" feature.
     * @returns true if telemetry was disabled, false if the license does not permit it.
     */
    async disableTelemetry() {
        const response = (await this.send({ type: "disableTelemetry" }));
        return response.disabled;
    }
    /**
     * Set the license key.
     * @param license - The license key string
     * @param domain - The current domain (from window.location.hostname)
     * @returns License validation result
     */
    async setLicense(license, domain) {
        const response = (await this.send({ type: "setLicense", license, domain }));
        return response.result;
    }
    /**
     * Get current license status.
     */
    async getLicenseStatus() {
        const response = (await this.send({ type: "getLicenseStatus" }));
        return response.result;
    }
    /**
     * Load a PDF document.
     * @returns The document ID.
     */
    /**
     * Load a document with auto-format detection.
     * The WASM engine inspects the file contents to determine the format.
     * @returns The document ID.
     */
    async loadDocument(bytes) {
        const response = (await this.send({
            type: "load",
            id: "",
            bytes,
        }));
        return response.documentId;
    }
    /**
     * Get the detected format of a loaded document.
     * @returns The format string: "pdf", "docx", "pptx", "xlsx", or "image".
     */
    async getDocumentFormat(documentId) {
        const response = (await this.send({
            type: "getDocumentFormat",
            documentId,
        }));
        return response.format;
    }
    async loadPdf(bytes) {
        const response = (await this.send({
            type: "loadPdf",
            id: "", // Not used, will be assigned by worker
            bytes,
        }));
        return response.documentId;
    }
    /**
     * Load an image file.
     * Supports various formats: JPEG, PNG, GIF, BMP, TIFF, WebP, etc.
     * Multi-page TIFF files will create a document with multiple pages.
     * @returns The document ID.
     */
    async loadImage(bytes) {
        const response = (await this.send({
            type: "loadImage",
            id: "", // Not used, will be assigned by worker
            bytes,
        }));
        return response.documentId;
    }
    /**
     * Load a PPTX (PowerPoint) document.
     * @returns The document ID.
     */
    async loadPptx(bytes) {
        const response = (await this.send({
            type: "loadPptx",
            id: "", // Not used, will be assigned by worker
            bytes,
        }));
        return response.documentId;
    }
    /**
     * Load a DOCX (Word) document.
     * @returns The document ID.
     */
    async loadDocx(bytes) {
        const response = (await this.send({
            type: "loadDocx",
            id: "", // Not used, will be assigned by worker
            bytes,
        }));
        return response.documentId;
    }
    /**
     * Unload a PDF document.
     * @returns True if the document was removed.
     */
    async unloadPdf(documentId) {
        this.pageInfoCache.delete(documentId);
        this.pageGroupsCache.delete(documentId);
        this.performanceCounters.delete(documentId);
        this.cancelRenders(documentId);
        const response = (await this.send({ type: "unloadPdf", documentId }));
        return response.removed;
    }
    /**
     * Check if a document requires a password to open.
     * @returns True if the document needs authentication.
     */
    async needsPassword(documentId) {
        const response = (await this.send({ type: "needsPassword", documentId }));
        return response.needsPassword;
    }
    /**
     * Authenticate with a password to unlock an encrypted document.
     * @param documentId - The document ID
     * @param password - The password to try
     * @returns True if authentication succeeded, false if the password was incorrect.
     */
    async authenticate(documentId, password) {
        const response = (await this.send({ type: "authenticate", documentId, password }));
        return response.authenticated;
    }
    /**
     * Get the page count of a document.
     * Returns from cache if available.
     */
    async getPageCount(documentId) {
        // Check cache first
        const cached = this.pageInfoCache.get(documentId);
        if (cached) {
            return cached.length;
        }
        // Fall back to worker call
        const counter = this.getCounter(documentId);
        const eventId = counter?.markStart("getPageCount");
        try {
            const response = (await this.send({ type: "getPageCount", documentId }));
            if (eventId)
                counter?.markEnd(eventId);
            return response.pageCount;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            throw error;
        }
    }
    /**
     * Get info for a single page.
     * Returns from cache if available (populated by getAllPageInfo).
     */
    async getPageInfo(documentId, pageIndex) {
        // Check cache first
        const cached = this.pageInfoCache.get(documentId);
        if (cached && pageIndex < cached.length) {
            return cached[pageIndex];
        }
        // Fall back to worker call
        const counter = this.getCounter(documentId);
        const eventId = counter?.markStart("getPageInfo", { pageIndex });
        try {
            const response = (await this.send({ type: "getPageInfo", documentId, pageIndex }));
            if (eventId)
                counter?.markEnd(eventId);
            return {
                width: response.width,
                height: response.height,
                rotation: response.rotation ?? 0,
                transition: response.transition,
            };
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            throw error;
        }
    }
    /**
     * Get info for all pages in one call.
     * Results are cached for subsequent calls.
     */
    async getAllPageInfo(documentId) {
        // Check cache first
        const cached = this.pageInfoCache.get(documentId);
        if (cached) {
            return cached;
        }
        // Fall back to worker call
        const counter = this.getCounter(documentId);
        const eventId = counter?.markStart("getAllPageInfo");
        try {
            const response = (await this.send({ type: "getAllPageInfo", documentId }));
            if (eventId)
                counter?.markEnd(eventId);
            // Cache for subsequent calls
            this.pageInfoCache.set(documentId, response.pages);
            return response.pages;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            throw error;
        }
    }
    /**
     * Get stitching groups for a document (one `linear` group for PDF/DOCX/PPTX,
     * one `tiled` group per sheet for XLSX). Results are cached.
     */
    async getPageGroups(documentId) {
        const cached = this.pageGroupsCache.get(documentId);
        if (cached) {
            return cached;
        }
        const response = (await this.send({ type: "getPageGroups", documentId }));
        this.pageGroupsCache.set(documentId, response.groups);
        return response.groups;
    }
    /**
     * Get the document outline.
     */
    async getOutline(documentId) {
        const counter = this.getCounter(documentId);
        const eventId = counter?.markStart("getOutline");
        try {
            const response = (await this.send({ type: "getOutline", documentId }));
            if (eventId)
                counter?.markEnd(eventId);
            return response.outline;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            throw error;
        }
    }
    /**
     * Get font usage information for a document.
     */
    async getFontUsage(documentId) {
        const counter = this.getCounter(documentId);
        const eventId = counter?.markStart("getFontUsage");
        try {
            const response = (await this.send({ type: "getFontUsage", documentId }));
            if (eventId)
                counter?.markEnd(eventId);
            return response.entries;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            throw error;
        }
    }
    /**
     * Get annotations for a specific page.
     * Routed through the unified work queue so renders take priority.
     */
    async getPageAnnotations(documentId, pageIndex) {
        return this.requestAnnotations(documentId, pageIndex);
    }
    /**
     * Get the layout model for a specific page (for text selection/search).
     * Routed through the unified work queue so renders take priority.
     */
    async getLayoutPage(documentId, pageIndex) {
        return this.requestText(documentId, pageIndex);
    }
    /**
     * Request annotations via the unified work queue.
     * Lower priority than renders — waits for pending renders to complete first.
     */
    requestAnnotations(docId, pageIndex) {
        const page = pageIndex + 1; // Convert 0-based to 1-based
        const key = `annotation:${docId}:${page}`;
        // Check if already in-flight
        if (this.currentWork?.key === key) {
            return this.currentWork.promise;
        }
        // Check if already queued (dedup)
        const queued = this.workQueue.find((q) => q.kind === "annotation" && q.docId === docId && q.page === page);
        if (queued) {
            return new Promise((resolve, reject) => {
                const originalResolve = queued.resolve;
                const originalReject = queued.reject;
                queued.resolve = (result) => {
                    originalResolve(result);
                    resolve(result);
                };
                queued.reject = (error) => {
                    originalReject(error);
                    reject(error);
                };
            });
        }
        return new Promise((resolve, reject) => {
            this.workQueue.push({
                kind: "annotation",
                docId,
                page,
                priority: 0,
                resolve,
                reject,
            });
            this.sortQueue();
            this.processWorkQueue();
        });
    }
    /**
     * Request text content via the unified work queue.
     * Lowest priority — waits for pending renders and annotations to complete first.
     */
    requestText(docId, pageIndex) {
        const page = pageIndex + 1; // Convert 0-based to 1-based
        const key = `text:${docId}:${page}`;
        // Check if already in-flight
        if (this.currentWork?.key === key) {
            return this.currentWork.promise;
        }
        // Check if already queued (dedup)
        const queued = this.workQueue.find((q) => q.kind === "text" && q.docId === docId && q.page === page);
        if (queued) {
            return new Promise((resolve, reject) => {
                const originalResolve = queued.resolve;
                const originalReject = queued.reject;
                queued.resolve = (result) => {
                    originalResolve(result);
                    resolve(result);
                };
                queued.reject = (error) => {
                    originalReject(error);
                    reject(error);
                };
            });
        }
        return new Promise((resolve, reject) => {
            this.workQueue.push({
                kind: "text",
                docId,
                page,
                priority: 0,
                resolve,
                reject,
            });
            this.sortQueue();
            this.processWorkQueue();
        });
    }
    /**
     * Get all annotations grouped by page.
     */
    async getAllAnnotations(documentId) {
        const counter = this.getCounter(documentId);
        const eventId = counter?.markStart("getAllAnnotations");
        try {
            const response = (await this.send({ type: "getAllAnnotations", documentId }));
            if (eventId)
                counter?.markEnd(eventId);
            return response.annotations;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            throw error;
        }
    }
    /**
     * Save annotations to a PDF document.
     * Returns the modified PDF bytes with annotations applied.
     */
    async pdfSaveAnnotations(documentId, annotationsByPage) {
        const response = (await this.send({ type: "pdfSaveAnnotations", documentId, annotationsByPage }));
        return response.bytes;
    }
    /**
     * Compose new PDF documents by cherry-picking pages from source documents.
     *
     * @param compositions - Array of compositions. Each composition is an array of picks
     *   that will form one output document.
     * @param docIds - Array of document IDs to use as sources (order matters for doc indices)
     * @returns Array of new document IDs (one per composition)
     */
    async pdfCompose(compositions, docIds) {
        const response = (await this.send({ type: "pdfCompose", compositions, docIds }));
        return response.documentIds;
    }
    /**
     * Split a PDF document by its outline (bookmarks) structure.
     *
     * @param documentId - Document ID to split
     * @param maxLevel - Maximum outline level to consider (1 = top level only)
     * @param splitMidPage - When true, filters page content when sections share a page
     * @returns Object with documentIds and sections
     */
    async pdfSplitByOutline(documentId, maxLevel, splitMidPage = false) {
        const response = (await this.send({ type: "pdfSplitByOutline", documentId, maxLevel, splitMidPage }));
        return response.result;
    }
    /**
     * Extract all embedded images from a PDF document.
     *
     * @param documentId - Document ID to extract images from
     * @param convertRawToPng - When true, converts raw pixel data to PNG format
     * @returns Array of extracted images with metadata and data
     */
    async pdfExtractImages(documentId, convertRawToPng = false) {
        const response = (await this.send({ type: "pdfExtractImages", documentId, convertRawToPng }));
        return response.images;
    }
    /**
     * Extract all embedded fonts from a PDF document.
     *
     * @param documentId - Document ID to extract fonts from
     * @returns Array of extracted fonts with metadata and data
     */
    /**
     * Parse font information from raw font binary data.
     *
     * @param data - Raw font binary data (e.g., .ttf, .otf, .woff2)
     * @returns Font information including typeface, bold, and italic
     */
    async parseFontInfo(data) {
        const response = (await this.send({ type: "parseFontInfo", data }));
        return response.info;
    }
    async pdfExtractFonts(documentId) {
        const response = (await this.send({ type: "pdfExtractFonts", documentId }));
        return response.fonts;
    }
    /**
     * Compress a PDF document.
     *
     * Saves the document with full compression options enabled.
     *
     * @param documentId - Document ID to compress
     * @returns Compressed PDF data
     */
    async pdfCompress(documentId) {
        const response = (await this.send({ type: "pdfCompress", documentId }));
        return response.bytes;
    }
    /**
     * Decompress a PDF document.
     *
     * Removes all filter encodings from streams, resulting in raw,
     * uncompressed stream data.
     *
     * @param documentId - Document ID to decompress
     * @returns Decompressed PDF data
     */
    async pdfDecompress(documentId) {
        const response = (await this.send({ type: "pdfDecompress", documentId }));
        return response.bytes;
    }
    /**
     * Get the raw PDF bytes of a document.
     */
    async getBytes(documentId) {
        const response = (await this.send({ type: "getBytes", documentId }));
        return response.bytes;
    }
    // ===========================================================================
    // Font Management
    // ===========================================================================
    /**
     * Register font URLs.
     *
     * The engine fetches fonts on-demand during layout from the provided URLs.
     * Call this before loading documents. Registered fonts take priority over
     * Google Fonts.
     *
     * @param fonts - Array of font entries with typeface, style, and URL
     */
    async registerFonts(fonts) {
        await this.send({ type: "registerFonts", fonts });
    }
    /**
     * Enable Google Fonts.
     *
     * When enabled, fonts not embedded in the document are fetched from
     * Google Fonts on-demand during rendering. Google Fonts are resolved
     * after any URL fonts registered via `registerFonts`.
     *
     * Call this before loading documents.
     */
    async enableGoogleFonts() {
        await this.send({ type: "enableGoogleFonts" });
    }
    // ===========================================================================
    // Visibility Groups
    // ===========================================================================
    /**
     * Get visibility groups for a document.
     */
    async getVisibilityGroups(documentId) {
        const response = (await this.send({ type: "getVisibilityGroups", documentId }));
        return response.groups;
    }
    /**
     * Set visibility of a specific group.
     *
     * @returns true if the group was found and updated
     */
    async setVisibilityGroupVisible(documentId, groupId, visible) {
        const response = (await this.send({ type: "setVisibilityGroupVisible", documentId, groupId, visible }));
        return response.updated;
    }
    // ===========================================================================
    // Performance Counter Integration
    // ===========================================================================
    /**
     * Set the performance counter for a document.
     * All operations for this document will be tracked.
     */
    setPerformanceCounter(docId, counter) {
        this.performanceCounters.set(docId, counter);
    }
    /**
     * Remove the performance counter for a document.
     */
    removePerformanceCounter(docId) {
        this.performanceCounters.delete(docId);
    }
    getCounter(docId) {
        return this.performanceCounters.get(docId);
    }
    // ===========================================================================
    // Render Management Methods
    // ===========================================================================
    getCache(type) {
        if (type === "page")
            return this.pageRenderCache;
        if (type === "preview")
            return this.previewRenderCache;
        return this.thumbnailRenderCache;
    }
    getMaxCacheSize(type) {
        if (type === "preview")
            return this.maxPreviewCacheSize;
        return this.maxThumbnailCacheSize;
    }
    cacheTotalBytes(cache) {
        let bytes = 0;
        for (const entry of cache.values()) {
            bytes += entry.result.width * entry.result.height * 4;
        }
        return bytes;
    }
    /**
     * Request a render. Returns cached result if available,
     * otherwise queues the request.
     *
     * When a new request is queued, it cancels any existing queued requests
     * for the same page index and render type (but not in-flight requests).
     */
    requestRender(req) {
        const key = makeRenderKey(req.docId, req.page, req.type, req.scale);
        const cache = this.getCache(req.type);
        // Check cache first
        const cached = cache.get(key);
        if (cached) {
            cached.lastAccess = Date.now();
            return Promise.resolve(cached.result);
        }
        // Check if already in-flight
        if (this.currentWork?.key === key) {
            return this.currentWork.promise;
        }
        // Check if already queued with same parameters
        const queued = this.workQueue.find((q) => q.kind === "render" &&
            q.docId === req.docId &&
            q.page === req.page &&
            q.type === req.type &&
            q.scale === req.scale);
        if (queued) {
            return new Promise((resolve, reject) => {
                const originalResolve = queued.resolve;
                const originalReject = queued.reject;
                queued.resolve = (result) => {
                    originalResolve(result);
                    resolve(result);
                };
                queued.reject = (error) => {
                    originalReject(error);
                    reject(error);
                };
            });
        }
        // Cancel any existing queued requests for the same page and type (different scale)
        // This ensures we only render the most recent scale for each page
        this.cancelQueuedRequestsForPage(req.docId, req.page, req.type);
        // Queue the request
        return new Promise((resolve, reject) => {
            const queuedReq = {
                kind: "render",
                ...req,
                priority: 0, // Priority is now determined by distance-based sorting
                resolve,
                reject,
            };
            this.workQueue.push(queuedReq);
            this.sortQueue(); // Sort to place request in correct position based on current focus
            this.processWorkQueue();
        });
    }
    /**
     * Cancel queued requests for a specific page (within the same render type).
     * Does not cancel in-flight requests.
     */
    cancelQueuedRequestsForPage(docId, page, type) {
        this.workQueue = this.workQueue.filter((item) => {
            if (item.kind !== "render")
                return true;
            const shouldCancel = item.docId === docId && item.page === page && item.type === type;
            if (shouldCancel) {
                item.reject(new Error("Request cancelled"));
            }
            return !shouldCancel;
        });
    }
    /**
     * Get a cached result without queuing a render.
     */
    getCachedRender(docId, page, type, scale) {
        const key = makeRenderKey(docId, page, type, scale);
        const cache = this.getCache(type);
        const cached = cache.get(key);
        if (cached) {
            cached.lastAccess = Date.now();
            return cached.result;
        }
        return null;
    }
    /**
     * Cancel pending render requests matching criteria.
     * Does not cancel in-flight requests.
     */
    cancelRenders(docId, page, type) {
        this.workQueue = this.workQueue.filter((item) => {
            if (item.kind !== "render")
                return true;
            const match = (docId === undefined || item.docId === docId) &&
                (page === undefined || item.page === page) &&
                (type === undefined || item.type === type);
            if (match) {
                item.reject(new Error("Request cancelled"));
            }
            return !match;
        });
    }
    /**
     * Invalidate cache entries. Call when document or zoom changes.
     */
    /**
     * Clear cached bitmaps without notifying UI callbacks.
     * Use during document close to avoid triggering re-renders.
     */
    clearRenderCache(docId) {
        const clear = (cache) => {
            if (docId === undefined) {
                for (const entry of cache.values()) {
                    entry.result.bitmap.close();
                }
                cache.clear();
            }
            else {
                for (const [key, entry] of cache) {
                    if (key.startsWith(docId + ":")) {
                        entry.result.bitmap.close();
                        cache.delete(key);
                    }
                }
            }
        };
        clear(this.pageRenderCache);
        clear(this.thumbnailRenderCache);
        clear(this.previewRenderCache);
    }
    invalidateRenderCache(docId, type) {
        const invalidateCache = (cache) => {
            if (docId === undefined) {
                for (const entry of cache.values()) {
                    entry.result.bitmap.close();
                }
                cache.clear();
            }
            else {
                for (const [key, entry] of cache) {
                    if (key.startsWith(docId + ":")) {
                        entry.result.bitmap.close();
                        cache.delete(key);
                    }
                }
            }
        };
        if (type === undefined || type === "page") {
            invalidateCache(this.pageRenderCache);
        }
        if (type === undefined || type === "thumbnail") {
            invalidateCache(this.thumbnailRenderCache);
        }
        if (type === undefined || type === "preview") {
            invalidateCache(this.previewRenderCache);
        }
        for (const cb of this.renderInvalidatedCallbacks) {
            cb();
        }
    }
    /**
     * Subscribe to render cache invalidation events.
     * Returns an unsubscribe function.
     */
    onRenderInvalidated(callback) {
        this.renderInvalidatedCallbacks.add(callback);
        return () => this.renderInvalidatedCallbacks.delete(callback);
    }
    /**
     * Subscribe to render OOM events. Fired after caches are cleared so UIs
     * can surface a warning or trigger quality degradation.
     */
    onOOM(callback) {
        this.oomCallbacks.add(callback);
        return () => this.oomCallbacks.delete(callback);
    }
    /**
     * Current WASM linear-memory size in bytes (reflects every `memory.grow`).
     * Returns 0 if the worker has not finished initializing yet.
     */
    async getWasmMemoryBytes() {
        const response = (await this.send({ type: "getWasmMemoryBytes" }));
        return response.bytes;
    }
    /**
     * Return a snapshot of cached bitmap counts and estimated memory (bytes).
     * Estimated as width * height * 4 (RGBA) per ImageBitmap.
     */
    getRenderCacheStats() {
        const measure = (cache) => {
            let bytes = 0;
            for (const entry of cache.values()) {
                bytes += entry.result.width * entry.result.height * 4;
            }
            return { count: cache.size, bytes };
        };
        const page = measure(this.pageRenderCache);
        const thumbnail = measure(this.thumbnailRenderCache);
        const preview = measure(this.previewRenderCache);
        return {
            page,
            thumbnail,
            preview,
            total: {
                count: page.count + thumbnail.count + preview.count,
                bytes: page.bytes + thumbnail.bytes + preview.bytes,
            },
        };
    }
    /**
     * Drop every cached ImageBitmap to free memory, then notify OOM subscribers.
     * Throttled so a burst of failures doesn't produce a cache-clear storm.
     */
    handleOOM(error) {
        const now = Date.now();
        if (now - this.lastOOMClearAt > 500) {
            this.lastOOMClearAt = now;
            this.clearRenderCache();
        }
        const err = error instanceof Error ? error : new Error(String(error));
        for (const cb of this.oomCallbacks)
            cb(err);
    }
    /**
     * Subscribe to font usage change events.
     * Called when font usage changes after a page render.
     * Returns an unsubscribe function.
     */
    onFontUsageChanged(callback) {
        this.fontUsageChangedCallbacks.add(callback);
        return () => this.fontUsageChangedCallbacks.delete(callback);
    }
    /**
     * Enqueue a font usage check at the end of the work queue.
     * Deduplicates: only one check per docId is queued at a time.
     */
    scheduleFontUsageCheck(docId) {
        if (this.fontUsageChangedCallbacks.size === 0)
            return;
        // Already queued for this doc — skip
        const key = `fontUsageCheck:${docId}`;
        if (this.workQueue.some((item) => makeWorkKey(item) === key))
            return;
        this.workQueue.push({
            kind: "fontUsageCheck",
            docId,
            page: 0,
            priority: Infinity,
            resolve: () => { },
            reject: () => { },
        });
        // Don't re-sort or kick processWorkQueue here —
        // it will be picked up naturally after the current work finishes.
    }
    async doFontUsageCheck(item) {
        try {
            const entries = await this.getFontUsage(item.docId);
            const length = Array.isArray(entries) ? entries.length : 0;
            const previous = this.lastFontUsageLength.get(item.docId);
            if (previous !== length) {
                this.lastFontUsageLength.set(item.docId, length);
                for (const cb of this.fontUsageChangedCallbacks) {
                    cb(item.docId);
                }
            }
            item.resolve(undefined);
        }
        catch {
            // Font usage query failed (e.g. document unloaded) — ignore
            item.resolve(undefined);
        }
    }
    /**
     * Sort page render requests in the queue by distance to the focused page.
     * Updates the page focus and re-sorts the queue.
     */
    boostPageRenderPriority(docId, focusPage) {
        this.pageFocus = { docId, page: focusPage };
        this.sortQueue();
        this.processWorkQueue();
    }
    /**
     * Sort thumbnail render requests in the queue by distance to the focused thumbnail.
     * Updates the thumbnail focus and re-sorts the queue.
     */
    boostThumbnailRenderPriority(docId, focusPage) {
        this.thumbnailFocus = { docId, page: focusPage };
        this.sortQueue();
        this.processWorkQueue();
    }
    static PRERENDER_RANGE = 2; // Prerender pages within ±2 of current
    /**
     * Prerender adjacent pages for smooth page flipping in single spread mode.
     * Queues renders for pages before and after the current page (fire and forget).
     * Boosts current page priority so it renders first during rapid flipping.
     */
    prerenderAdjacentPages(docId, currentPage, scale, totalPages) {
        // Boost current page priority - ensures it renders first even during rapid flipping
        this.boostPageRenderPriority(docId, currentPage);
        // Queue adjacent pages for prerendering
        for (let offset = 1; offset <= WorkerClient.PRERENDER_RANGE; offset++) {
            // Prerender next pages
            const nextPage = currentPage + offset;
            if (nextPage >= 1 && nextPage <= totalPages) {
                this.requestRender({
                    docId,
                    page: nextPage,
                    type: "page",
                    scale,
                }).catch(() => {
                    // Ignore errors - prerendering is best-effort
                });
            }
            // Prerender previous pages
            const prevPage = currentPage - offset;
            if (prevPage >= 1 && prevPage <= totalPages) {
                this.requestRender({
                    docId,
                    page: prevPage,
                    type: "page",
                    scale,
                }).catch(() => {
                    // Ignore errors - prerendering is best-effort
                });
            }
        }
    }
    /**
     * Render a page directly, bypassing the cache and queue.
     * Useful for one-off renders that shouldn't affect the normal render flow.
     */
    async forceRender(req) {
        const counter = this.getCounter(req.docId);
        const eventType = req.type === "thumbnail" ? "renderThumbnail" : "renderPage";
        const pageIndex = req.page - 1;
        const eventId = counter?.markStart(eventType, { pageIndex, scale: req.scale });
        try {
            const pageInfo = await this.getPageInfo(req.docId, pageIndex);
            const width = Math.round(pageInfo.width * req.scale);
            const height = Math.round(pageInfo.height * req.scale);
            // Send render request directly to worker
            const rendered = (await this.send({
                type: "renderPage",
                documentId: req.docId,
                pageIndex,
                width,
                height,
            }));
            const source = rendered.rgba;
            const clamped = source.buffer instanceof ArrayBuffer
                ? new Uint8ClampedArray(source.buffer, source.byteOffset, source.byteLength)
                : new Uint8ClampedArray(source);
            const imageData = new ImageData(clamped, rendered.width, rendered.height);
            const bitmap = await createImageBitmap(imageData);
            const result = {
                bitmap,
                width: bitmap.width,
                height: bitmap.height,
            };
            // Note: We intentionally don't add to cache for force renders
            if (eventId)
                counter?.markEnd(eventId);
            return result;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            if (isOOMError(error))
                this.handleOOM(error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    static BOOST_RANGE = 5; // Boost pages within ±5 of focus (11 pages total)
    /**
     * Sort work queue by priority: page-proximity first, then type within each page.
     *
     * For page-focused items (pages, previews, annotations, text):
     *   Grouped by distance to pageFocus, closest first. Within each page,
     *   ordered: preview → page render → annotation → text.
     *   Boosted pages (within BOOST_RANGE) come before all non-boosted pages.
     *
     * Thumbnails use thumbnailFocus independently and come after all page items.
     */
    sortQueue() {
        if (this.workQueue.length === 0)
            return;
        const pageFocus = this.pageFocus;
        const thumbnailFocus = this.thumbnailFocus;
        const pageItems = [];
        const thumbnailItems = [];
        for (const item of this.workQueue) {
            if (item.kind === "render" && item.type === "thumbnail") {
                thumbnailItems.push(item);
            }
            else {
                pageItems.push(item);
            }
        }
        // Sort page items: by distance to focus, then by type within same page
        const typeOrder = (item) => {
            if (item.kind === "render" && item.type === "preview")
                return 0;
            if (item.kind === "render" && item.type === "page")
                return 1;
            if (item.kind === "annotation")
                return 2;
            if (item.kind === "text")
                return 3;
            // fontUsageCheck — always last
            return 4;
        };
        pageItems.sort((a, b) => {
            // fontUsageCheck always sorts last among page items
            const aIsCheck = a.kind === "fontUsageCheck" ? 1 : 0;
            const bIsCheck = b.kind === "fontUsageCheck" ? 1 : 0;
            if (aIsCheck !== bIsCheck)
                return aIsCheck - bIsCheck;
            const ad = pageFocus && a.docId === pageFocus.docId ? Math.abs(a.page - pageFocus.page) : Infinity;
            const bd = pageFocus && b.docId === pageFocus.docId ? Math.abs(b.page - pageFocus.page) : Infinity;
            // Boosted vs non-boosted
            const aBoosted = ad <= WorkerClient.BOOST_RANGE;
            const bBoosted = bd <= WorkerClient.BOOST_RANGE;
            if (aBoosted !== bBoosted)
                return aBoosted ? -1 : 1;
            // Same distance → order by type; different distance → closer first
            if (ad !== bd)
                return ad - bd;
            return typeOrder(a) - typeOrder(b);
        });
        // Sort thumbnails by distance to thumbnail focus
        thumbnailItems.sort((a, b) => {
            const ad = thumbnailFocus && a.docId === thumbnailFocus.docId ? Math.abs(a.page - thumbnailFocus.page) : Infinity;
            const bd = thumbnailFocus && b.docId === thumbnailFocus.docId ? Math.abs(b.page - thumbnailFocus.page) : Infinity;
            return ad - bd;
        });
        // Page items first, then thumbnails
        this.workQueue = [...pageItems, ...thumbnailItems];
    }
    /**
     * Clean up render resources.
     */
    destroyRenderResources() {
        // Cancel all pending renders
        for (const req of this.workQueue) {
            req.reject(new Error("WorkerClient destroyed"));
        }
        this.workQueue = [];
        // Close all cached page bitmaps
        for (const entry of this.pageRenderCache.values()) {
            entry.result.bitmap.close();
        }
        this.pageRenderCache.clear();
        // Close all cached thumbnail bitmaps
        for (const entry of this.thumbnailRenderCache.values()) {
            entry.result.bitmap.close();
        }
        this.thumbnailRenderCache.clear();
        // Close all cached preview bitmaps
        for (const entry of this.previewRenderCache.values()) {
            entry.result.bitmap.close();
        }
        this.previewRenderCache.clear();
    }
    processWorkQueue() {
        // Only one request at a time (WASM is single-threaded)
        if (this.currentWork)
            return;
        if (this.workQueue.length === 0)
            return;
        const item = this.workQueue.shift();
        const key = makeWorkKey(item);
        let promise;
        if (item.kind === "render") {
            const renderKey = makeRenderKey(item.docId, item.page, item.type, item.scale);
            const cache = this.getCache(item.type);
            // Double-check cache (might have been filled while queued)
            const cached = cache.get(renderKey);
            if (cached) {
                cached.lastAccess = Date.now();
                item.resolve(cached.result);
                // Continue processing queue
                this.processWorkQueue();
                return;
            }
            promise = this.doRender(item, renderKey);
        }
        else if (item.kind === "annotation") {
            promise = this.doAnnotation(item);
        }
        else if (item.kind === "text") {
            promise = this.doText(item);
        }
        else {
            promise = this.doFontUsageCheck(item);
        }
        this.currentWork = { key, promise };
        // Run the same cleanup whether the work resolved or rejected. Rejections
        // are already forwarded to the requester via req.reject inside doRender /
        // doAnnotation / doText, so consuming them here in onRejected is what
        // prevents an "unhandled promise" warning. If cleanup itself ever throws,
        // that still surfaces — only the already-handled work rejection is hidden.
        const onSettled = () => {
            this.currentWork = null;
            this.processWorkQueue();
        };
        promise.then(onSettled, onSettled);
    }
    async doRender(req, key) {
        const counter = this.getCounter(req.docId);
        const eventType = req.type === "thumbnail"
            ? "renderThumbnail"
            : req.type === "preview"
                ? "renderPreview"
                : "renderPage";
        const pageIndex = req.page - 1;
        const eventId = counter?.markStart(eventType, { pageIndex, scale: req.scale });
        try {
            const pageInfo = await this.getPageInfo(req.docId, pageIndex);
            const width = Math.round(pageInfo.width * req.scale);
            const height = Math.round(pageInfo.height * req.scale);
            // Send render request directly to worker
            const rendered = (await this.send({
                type: "renderPage",
                documentId: req.docId,
                pageIndex,
                width,
                height,
            }));
            const source = rendered.rgba;
            const clamped = source.buffer instanceof ArrayBuffer
                ? new Uint8ClampedArray(source.buffer, source.byteOffset, source.byteLength)
                : new Uint8ClampedArray(source);
            const imageData = new ImageData(clamped, rendered.width, rendered.height);
            const bitmap = await createImageBitmap(imageData);
            const result = {
                bitmap,
                width: bitmap.width,
                height: bitmap.height,
            };
            // Add to cache
            this.addToRenderCache(req.type, key, result);
            if (eventId)
                counter?.markEnd(eventId);
            req.resolve(result);
            // Check for font usage changes after successful page render (debounced)
            if (req.type === "page") {
                this.scheduleFontUsageCheck(req.docId);
            }
            return result;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            if (isOOMError(error))
                this.handleOOM(error);
            req.reject(error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
    async doAnnotation(item) {
        const pageIndex = item.page - 1;
        const counter = this.getCounter(item.docId);
        const eventId = counter?.markStart("getPageAnnotations", { pageIndex });
        try {
            const response = (await this.send({
                type: "getPageAnnotations",
                documentId: item.docId,
                pageIndex,
            }));
            if (eventId)
                counter?.markEnd(eventId);
            item.resolve(response.annotations);
            return response.annotations;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            item.reject(error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
    async doText(item) {
        const pageIndex = item.page - 1;
        const counter = this.getCounter(item.docId);
        const eventId = counter?.markStart("getLayoutPage", { pageIndex });
        try {
            const response = (await this.send({
                type: "getLayoutPage",
                documentId: item.docId,
                pageIndex,
            }));
            if (eventId)
                counter?.markEnd(eventId);
            item.resolve(response.layout);
            return response.layout;
        }
        catch (error) {
            if (eventId)
                counter?.markEnd(eventId, false, error.message);
            item.reject(error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
    addToRenderCache(type, key, result) {
        const cache = this.getCache(type);
        if (type === "page") {
            const incoming = result.width * result.height * 4;
            // Evict oldest entries until the new bitmap fits in the byte budget.
            // Keep at least one entry so a single huge page still gets cached.
            while (cache.size > 0 && this.cacheTotalBytes(cache) + incoming > this.maxPageCacheBytes) {
                if (!this.evictLRU(cache))
                    break;
            }
        }
        else {
            const maxSize = this.getMaxCacheSize(type);
            while (cache.size >= maxSize) {
                if (!this.evictLRU(cache))
                    break;
            }
        }
        cache.set(key, {
            result,
            lastAccess: Date.now(),
        });
    }
    evictLRU(cache) {
        let oldest = null;
        let oldestTime = Infinity;
        for (const [key, entry] of cache) {
            if (entry.lastAccess < oldestTime) {
                oldestTime = entry.lastAccess;
                oldest = key;
            }
        }
        if (oldest) {
            const entry = cache.get(oldest);
            if (entry) {
                entry.result.bitmap.close();
            }
            cache.delete(oldest);
            return true;
        }
        return false;
    }
    /**
     * Terminate the worker.
     */
    terminate() {
        this.destroyRenderResources();
        this.worker.terminate();
        for (const { reject } of this.pending.values()) {
            reject(new Error("Worker terminated"));
        }
        this.pending.clear();
    }
    send(request) {
        return new Promise((resolve, reject) => {
            const id = this.requestId++;
            this.pending.set(id, { resolve, reject });
            this.worker.postMessage({ ...request, _id: id });
        });
    }
    handleMessage(event) {
        const { _id, ...response } = event.data;
        if (_id === undefined)
            return;
        const pending = this.pending.get(_id);
        if (!pending)
            return;
        this.pending.delete(_id);
        if (response.success) {
            pending.resolve(response);
        }
        else {
            pending.reject(new Error(response.error));
        }
    }
    handleError(event) {
        console.error("Worker error:", event.message);
    }
}
//# sourceMappingURL=WorkerClient.js.map