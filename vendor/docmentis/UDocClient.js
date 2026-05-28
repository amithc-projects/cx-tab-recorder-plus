/**
 * UDocClient - SDK entry point for document viewing.
 *
 * Manages the WASM engine and provides document operations.
 */
import { WorkerClient } from "./worker/index.js";
import { UDocViewer } from "./UDocViewer.js";
/**
 * SDK entry point for document viewing.
 *
 * Manages the WASM engine, creates viewers, and provides document operations.
 */
export class UDocClient {
    /**
     * SDK version string (replaced at build time).
     */
    static version = "0.6.42";
    workerClient;
    options;
    viewers = new Set();
    destroyed = false;
    licenseInfo = {
        valid: true,
        tier: "free",
        features: [],
        limits: {},
    };
    constructor(workerClient, options) {
        this.workerClient = workerClient;
        this.options = options;
    }
    /**
     * Create and initialize a client instance.
     * Loads the WASM engine.
     */
    static async create(options = {}) {
        // Create worker client - use custom URL if provided, otherwise use bundled worker
        const workerClient = options.baseUrl
            ? WorkerClient.createWithUrl(new URL("worker.js", options.baseUrl))
            : WorkerClient.create();
        // Initialize WASM in the worker.
        // Build a list of candidate WASM URLs in priority order, then try each
        // until one succeeds. This handles environments where import.meta.url
        // resolves but the WASM file isn't at the expected path (e.g. Vite
        // pre-bundling, Angular esbuild).
        const cdnUrl = `https://cdn.jsdelivr.net/npm/@docmentis/udoc-viewer@${UDocClient.version}/dist/src/wasm/udoc_bg.wasm`;
        const wasmUrls = [];
        if (options.baseUrl) {
            wasmUrls.push(new URL("udoc_bg.wasm", options.baseUrl).href);
        }
        else {
            try {
                const meta = await import("./meta-url.js");
                wasmUrls.push(meta.wasmUrl);
            }
            catch {
                // import.meta.url not available (e.g. StackBlitz)
            }
            wasmUrls.push(cdnUrl);
        }
        const domain = typeof window !== "undefined" ? window.location.hostname : "localhost";
        let lastError;
        for (const wasmUrl of wasmUrls) {
            try {
                await workerClient.init(wasmUrl, options.__experimentalGpu, domain, UDocClient.version);
                lastError = null;
                break;
            }
            catch (e) {
                lastError = e;
            }
        }
        if (lastError)
            throw lastError;
        const client = new UDocClient(workerClient, options);
        // Register font URLs before loading documents
        if (options.fonts?.length) {
            await workerClient.registerFonts(options.fonts);
        }
        // Enable Google Fonts (default: true) before loading documents
        if (options.googleFonts !== false) {
            await workerClient.enableGoogleFonts();
        }
        // Validate license if provided
        if (options.license) {
            const result = await workerClient.setLicense(options.license, domain);
            client.licenseInfo = licenseResultToInfo(result);
            if (!result.valid) {
                console.warn(`[udoc-viewer] License validation failed: ${result.error}`);
            }
        }
        // Disable telemetry if requested (requires license with no_telemetry feature)
        let telemetryDisabled = false;
        if (options.disableTelemetry) {
            telemetryDisabled = await workerClient.disableTelemetry();
            if (!telemetryDisabled) {
                console.warn("[udoc-viewer] disableTelemetry requires a license with the 'no_telemetry' feature.");
            }
            else {
                removeDistinctId();
            }
        }
        // Set up telemetry metadata (skipped when telemetry is disabled)
        if (!telemetryDisabled) {
            const distinctId = getOrCreateDistinctId();
            await workerClient.setupTelemetry(distinctId);
        }
        // Fire-and-forget version check (never blocks initialization)
        if (!options.disableUpdateCheck) {
            checkForUpdates(UDocClient.version);
        }
        return client;
    }
    /**
     * Get current license information.
     */
    get license() {
        return { ...this.licenseInfo };
    }
    /**
     * Check if a feature is available with the current license.
     * @param feature - Feature name (e.g., "merge")
     */
    hasFeature(feature) {
        return this.licenseInfo.features.includes(feature);
    }
    /**
     * Register custom font URLs for on-demand fetching during layout.
     *
     * Fonts are fetched when the engine needs them during rendering.
     * Registered fonts take priority over Google Fonts.
     * Call before loading documents. Supports OTF, TTF, WOFF, and WOFF2 formats.
     *
     * @param fonts - Array of font entries with typeface, style, and URL
     *
     * @example
     * ```ts
     * await client.registerFonts([
     *   { typeface: "Roboto", bold: false, italic: false, url: "https://cdn.example.com/Roboto-Regular.woff2" },
     *   { typeface: "Roboto", bold: true, italic: false, url: "https://cdn.example.com/Roboto-Bold.woff2" },
     * ]);
     * ```
     */
    async registerFonts(fonts) {
        this.ensureNotDestroyed();
        await this.workerClient.registerFonts(fonts);
    }
    /**
     * Enable Google Fonts for automatic font fetching.
     *
     * When enabled, fonts not embedded in the document are fetched from
     * Google Fonts on-demand during rendering. Google Fonts are resolved
     * after any fonts registered via `registerFonts`.
     *
     * Call before loading documents. Enabled by default unless
     * `googleFonts: false` is passed to `create()`.
     */
    async enableGoogleFonts() {
        this.ensureNotDestroyed();
        await this.workerClient.enableGoogleFonts();
    }
    /**
     * Create a viewer instance.
     *
     * - With container: Full UI mode
     * - Without container: Headless mode (same API, no UI)
     */
    async createViewer(options = {}) {
        this.ensureNotDestroyed();
        const showAttribution = !(options.hideAttribution && this.hasFeature("no_attribution"));
        const showLoadingOverlay = !(options.hideLoadingOverlay && this.hasFeature("no_attribution"));
        const viewer = new UDocViewer(this.workerClient, options, showAttribution, showLoadingOverlay, UDocClient.version);
        this.viewers.add(viewer);
        return viewer;
    }
    /**
     * Compose new documents by cherry-picking pages from source documents.
     *
     * This is a powerful method that allows creating new documents by selecting
     * specific pages from multiple source documents in any order. Pages can
     * optionally be rotated during composition.
     *
     * @param compositions - Array of compositions. Each composition creates one output document.
     *   Each composition is an array of picks specifying which pages from which documents.
     * @returns Array of viewers containing the composed documents
     *
     * @example
     * ```ts
     * // Create a document with pages 1-3 from viewer A and page 5 from viewer B
     * const [newDoc] = await client.compose([
     *   [
     *     { doc: viewerA, pages: "1-3" },
     *     { doc: viewerB, pages: "5" }
     *   ]
     * ]);
     *
     * // Create multiple documents at once
     * const [doc1, doc2] = await client.compose([
     *   [{ doc: viewerA, pages: "1" }],           // doc1: page 1 from A
     *   [{ doc: viewerA, pages: "2" }, { doc: viewerB, pages: "1" }]  // doc2: page 2 from A + page 1 from B
     * ]);
     *
     * // Rotate pages during composition
     * const [rotated] = await client.compose([
     *   [
     *     { doc: viewerA, pages: "1", rotation: 90 },   // rotate page 1 by 90 degrees
     *     { doc: viewerA, pages: "2", rotation: 180 }   // rotate page 2 by 180 degrees
     *   ]
     * ]);
     * ```
     */
    async compose(compositions) {
        this.ensureNotDestroyed();
        if (compositions.length === 0) {
            throw new Error("At least one composition is required");
        }
        // Collect all unique document sources and load them
        const sourceMap = new Map(); // source -> docId
        const docIds = [];
        for (const composition of compositions) {
            for (const pick of composition) {
                if (!sourceMap.has(pick.doc)) {
                    const docId = await this.loadSource(pick.doc);
                    sourceMap.set(pick.doc, docId);
                    docIds.push(docId);
                }
            }
        }
        // Build source index map (source -> index in docIds array)
        const sourceIndexMap = new Map();
        let index = 0;
        for (const source of sourceMap.keys()) {
            sourceIndexMap.set(source, index++);
        }
        // Convert to low-level format
        const lowLevelCompositions = compositions.map((composition) => composition.map((pick) => ({
            doc: sourceIndexMap.get(pick.doc),
            pages: this.normalizePages(pick.pages),
            rotation: pick.rotation,
        })));
        // Execute compose
        const newDocIds = await this.workerClient.pdfCompose(lowLevelCompositions, docIds);
        // Unload temporary sources that weren't from viewers
        for (const [source, docId] of sourceMap) {
            if (!(source instanceof UDocViewer)) {
                await this.workerClient.unloadPdf(docId);
            }
        }
        // Create viewers for the composed documents
        const viewers = [];
        for (const docId of newDocIds) {
            const viewer = new UDocViewer(this.workerClient, {}, true, true, UDocClient.version);
            await viewer.initializeFromDocId(docId);
            this.viewers.add(viewer);
            viewers.push(viewer);
        }
        return viewers;
    }
    /**
     * Split a document by its outline (bookmarks) structure.
     *
     * Creates multiple documents, one for each outline section at the specified level.
     * The original document remains unchanged.
     *
     * @param source - Document source (viewer, URL, File, or bytes)
     * @param options - Split options
     * @param options.maxLevel - Maximum outline level to consider (1 = top level only, default: 1)
     * @param options.splitMidPage - When true, filters page content when sections share a page (default: false)
     * @returns Object with viewers array and sections metadata
     *
     * @example
     * ```ts
     * // Split a document by top-level bookmarks
     * const result = await client.splitByOutline(viewer);
     * console.log(`Split into ${result.viewers.length} documents`);
     * result.sections.forEach((section, i) => {
     *   console.log(`Document ${i}: ${section.title}`);
     * });
     *
     * // Split with mid-page content filtering
     * const result = await client.splitByOutline(viewer, { maxLevel: 2, splitMidPage: true });
     * ```
     */
    async splitByOutline(source, options = {}) {
        this.ensureNotDestroyed();
        const { maxLevel = 1, splitMidPage = false } = options;
        const docId = await this.loadSource(source);
        const isTemporary = !(source instanceof UDocViewer);
        try {
            const result = await this.workerClient.pdfSplitByOutline(docId, maxLevel, splitMidPage);
            // Create viewers for the split documents
            const viewers = [];
            for (const newDocId of result.documentIds) {
                const viewer = new UDocViewer(this.workerClient, {}, true, true, UDocClient.version);
                await viewer.initializeFromDocId(newDocId);
                this.viewers.add(viewer);
                viewers.push(viewer);
            }
            return {
                viewers,
                sections: result.sections,
            };
        }
        finally {
            // Unload temporary source
            if (isTemporary) {
                await this.workerClient.unloadPdf(docId);
            }
        }
    }
    /**
     * Extract all embedded images from a document.
     *
     * @param source - Document source (viewer, URL, File, or bytes)
     * @param options - Extract options
     * @param options.convertRawToPng - When true, converts raw pixel data to PNG format (default: false)
     * @returns Array of extracted images with metadata and data
     *
     * @example
     * ```ts
     * const images = await client.extractImages(viewer);
     * for (const image of images) {
     *   console.log(`${image.name}: ${image.format} (${image.width}x${image.height})`);
     *   // image.data contains the raw image bytes
     * }
     *
     * // Convert raw images to PNG for easier viewing
     * const pngImages = await client.extractImages(viewer, { convertRawToPng: true });
     * ```
     */
    async extractImages(source, options = {}) {
        this.ensureNotDestroyed();
        const { convertRawToPng = false } = options;
        const docId = await this.loadSource(source);
        const isTemporary = !(source instanceof UDocViewer);
        try {
            return await this.workerClient.pdfExtractImages(docId, convertRawToPng);
        }
        finally {
            if (isTemporary) {
                await this.workerClient.unloadPdf(docId);
            }
        }
    }
    /**
     * Extract all embedded fonts from a document.
     *
     * @param source - Document source (viewer, URL, File, or bytes)
     * @returns Array of extracted fonts with metadata and data
     *
     * @example
     * ```ts
     * const fonts = await client.extractFonts(viewer);
     * for (const font of fonts) {
     *   console.log(`${font.name}: ${font.fontType} (.${font.extension})`);
     *   // font.data contains the raw font bytes
     * }
     * ```
     */
    async extractFonts(source) {
        this.ensureNotDestroyed();
        const docId = await this.loadSource(source);
        const isTemporary = !(source instanceof UDocViewer);
        try {
            return await this.workerClient.pdfExtractFonts(docId);
        }
        finally {
            if (isTemporary) {
                await this.workerClient.unloadPdf(docId);
            }
        }
    }
    /**
     * Parse font information from raw font binary data.
     *
     * Extracts the typeface name, bold, and italic properties from a font file.
     * Useful for building a font registry before calling {@link registerFonts}.
     *
     * @param data - Raw font binary data (e.g., .ttf, .otf, .woff2)
     * @returns Font information including typeface, bold, and italic
     *
     * @example
     * ```ts
     * const fontBytes = new Uint8Array(await fetch("Roboto-Bold.woff2").then(r => r.arrayBuffer()));
     * const info = await client.parseFontInfo(fontBytes);
     * // info = { typeface: "Roboto", bold: true, italic: false }
     *
     * // Use the info to register fonts:
     * await client.registerFonts([
     *     { typeface: info.typeface, bold: info.bold, italic: info.italic, url: "https://..." },
     * ]);
     * ```
     */
    async parseFontInfo(data) {
        this.ensureNotDestroyed();
        return this.workerClient.parseFontInfo(data);
    }
    /**
     * Compress a document.
     *
     * Saves the document with full compression options enabled:
     * - Compress stream data using FlateDecode
     * - Pack objects into compressed object streams (PDF 1.5+)
     * - Use compressed xref streams (PDF 1.5+)
     * - Remove unreferenced objects
     *
     * @param source - Document source (viewer, URL, File, or bytes)
     * @returns Compressed PDF data as Uint8Array
     *
     * @example
     * ```ts
     * const compressedBytes = await client.compress(viewer);
     * // Save to file or download
     * const blob = new Blob([compressedBytes], { type: 'application/pdf' });
     * ```
     */
    async compress(source) {
        this.ensureNotDestroyed();
        const docId = await this.loadSource(source);
        const isTemporary = !(source instanceof UDocViewer);
        try {
            return await this.workerClient.pdfCompress(docId);
        }
        finally {
            if (isTemporary) {
                await this.workerClient.unloadPdf(docId);
            }
        }
    }
    /**
     * Decompress a document.
     *
     * Removes all filter encodings from streams, resulting in raw,
     * uncompressed stream data. Useful for debugging or inspection.
     *
     * @param source - Document source (viewer, URL, File, or bytes)
     * @returns Decompressed PDF data as Uint8Array
     *
     * @example
     * ```ts
     * const decompressedBytes = await client.decompress(viewer);
     * // Save to file for inspection
     * const blob = new Blob([decompressedBytes], { type: 'application/pdf' });
     * ```
     */
    async decompress(source) {
        this.ensureNotDestroyed();
        const docId = await this.loadSource(source);
        const isTemporary = !(source instanceof UDocViewer);
        try {
            return await this.workerClient.pdfDecompress(docId);
        }
        finally {
            if (isTemporary) {
                await this.workerClient.unloadPdf(docId);
            }
        }
    }
    /**
     * Load a document source and return its ID.
     * Note: This is only used for PDF operations (compose, split, etc.)
     */
    async loadSource(source) {
        if (source instanceof UDocViewer) {
            const docId = source.documentId;
            if (!docId) {
                throw new Error("Viewer has no loaded document");
            }
            return docId;
        }
        let bytes;
        if (typeof source === "string") {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60_000);
            try {
                const response = await fetch(source, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${source}: ${response.statusText}`);
                }
                bytes = new Uint8Array(await response.arrayBuffer());
            }
            catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    throw new Error(`Fetch timed out for ${source}`, { cause: error });
                }
                throw error;
            }
            finally {
                clearTimeout(timeoutId);
            }
        }
        else if (source instanceof File) {
            bytes = new Uint8Array(await source.arrayBuffer());
        }
        else {
            bytes = source;
        }
        return this.workerClient.loadPdf(bytes);
    }
    /**
     * Normalize page specification to a string format.
     */
    normalizePages(pages) {
        if (typeof pages === "string") {
            return pages;
        }
        if (typeof pages === "number") {
            return String(pages);
        }
        return pages.join(",");
    }
    /**
     * Destroy the client and release all resources.
     * All viewers created by this client become invalid.
     */
    destroy() {
        if (this.destroyed)
            return;
        this.destroyed = true;
        // Destroy all viewers
        for (const viewer of this.viewers) {
            viewer.destroy();
        }
        this.viewers.clear();
        // Terminate the worker (also cleans up render resources)
        this.workerClient.terminate();
    }
    /**
     * Get the underlying worker client (for internal use).
     * @internal
     */
    getWorkerClient() {
        return this.workerClient;
    }
    /**
     * Snapshot of rendered bitmap caches. Use for debug overlays / memory
     * pressure monitoring on mobile.
     */
    getRenderCacheStats() {
        return this.workerClient.getRenderCacheStats();
    }
    /**
     * Current WASM linear-memory size in bytes for the worker's engine.
     * Rises when the Rust allocator grows; never shrinks.
     */
    async getWasmMemoryBytes() {
        return this.workerClient.getWasmMemoryBytes();
    }
    /**
     * Subscribe to render OOM events. Fires after the client has cleared its
     * bitmap caches to reclaim memory.
     */
    onOOM(callback) {
        return this.workerClient.onOOM(callback);
    }
    ensureNotDestroyed() {
        if (this.destroyed) {
            throw new Error("UDocClient has been destroyed");
        }
    }
}
const DISTINCT_ID_KEY = "udoc_viewer_distinct_id";
/**
 * Get or create a persistent anonymous ID for telemetry.
 * Uses localStorage when available, falls back to a per-session random ID.
 */
function getOrCreateDistinctId() {
    try {
        const stored = localStorage.getItem(DISTINCT_ID_KEY);
        if (stored)
            return stored;
        const id = crypto.randomUUID();
        localStorage.setItem(DISTINCT_ID_KEY, id);
        return id;
    }
    catch {
        return crypto.randomUUID();
    }
}
function removeDistinctId() {
    try {
        localStorage.removeItem(DISTINCT_ID_KEY);
    }
    catch {
        // localStorage unavailable — nothing to remove
    }
}
/**
 * Check npm registry for a newer version and log a console reminder.
 * Silently swallows errors so it never disrupts the app.
 */
function checkForUpdates(currentVersion) {
    fetch("https://registry.npmjs.org/@docmentis/udoc-viewer/latest")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
        if (!data?.version)
            return;
        if (data.version !== currentVersion) {
            console.warn(`[udoc-viewer] A newer version is available: ${data.version} (current: ${currentVersion}). ` +
                `Update with: npm install @docmentis/udoc-viewer@latest\n` +
                `To disable this check, set { disableUpdateCheck: true } in UDocClient.create() options.`);
        }
    })
        .catch(() => {
        // Network error — silently ignore
    });
}
/**
 * Convert WASM license result to LicenseInfo.
 */
function licenseResultToInfo(result) {
    const hasLicensedFeatures = result.features.length > 0 || Object.keys(result.limits).length > 0;
    return {
        valid: result.valid,
        tier: result.valid && hasLicensedFeatures ? "licensed" : "free",
        features: result.features,
        limits: result.limits,
        organization: result.organization,
        expiresAt: result.expiresAt ? new Date(result.expiresAt * 1000) : undefined,
        error: result.error,
    };
}
//# sourceMappingURL=UDocClient.js.map