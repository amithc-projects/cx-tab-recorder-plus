"use strict";
var SendToCloud = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    SendToCloudElement: () => SendToCloudElement
  });

  // ../sdk/dist/index.js
  var SendToCloudError = class extends Error {
    constructor(status, code, message, body) {
      super(message);
      this.name = "SendToCloudError";
      this.status = status;
      this.code = code;
      this.body = body;
    }
  };
  function appendFile(form, file) {
    if (typeof File !== "undefined" && file instanceof File) {
      form.append("files", file);
    } else if ("blob" in file) {
      form.append("files", file.blob, file.filename);
    } else {
      throw new TypeError("UploadFile must be a File or { blob, filename }.");
    }
  }
  function appendArray(form, field, values) {
    if (!values) return;
    for (const v of values) form.append(field, v);
  }
  var SendToCloudClient = class {
    constructor(options) {
      this.upload = {
        jira: (opts) => this.uploadJira(opts),
        confluence: (opts) => this.uploadConfluence(opts),
        miro: (opts) => this.uploadMiro(opts),
        slack: (opts) => this.uploadSlack(opts),
        s3: (opts) => this.uploadS3(opts),
        github: (opts) => this.uploadGitHub(opts),
        googledrive: (opts) => this.uploadGoogleDrive(opts),
        contentful: (opts) => this.uploadContentful(opts)
      };
      if (!options.endpoint) throw new Error("endpoint is required");
      if (!options.token) throw new Error("token is required");
      this.endpoint = options.endpoint.replace(/\/$/, "");
      this.tokenProvider = options.token;
      this.fetchFn = options.fetch || globalThis.fetch.bind(globalThis);
    }
    // ── Catalogue ──────────────────────────────────────────────────────────────
    /** GET /targets — list of integration targets and their `enabled` status. */
    async listTargets() {
      return this.request("GET", "/targets");
    }
    /**
     * GET /targets/{id}/browse — list children of a node in the target hierarchy.
     * Pass no `parentId` for the root level, then drill in by passing each
     * non-leaf node's `id`.
     */
    async browse(targetId, parentId) {
      const qs = parentId ? `?parent_id=${encodeURIComponent(parentId)}` : "";
      return this.request("GET", `/targets/${targetId}/browse${qs}`);
    }
    uploadJira(opts) {
      const form = new FormData();
      form.append("issue_key", opts.issueKey);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/jira/upload", form);
    }
    uploadConfluence(opts) {
      const form = new FormData();
      form.append("page_id", opts.pageId);
      if (opts.embed) form.append("embed", "true");
      if (opts.imageWidth != null) form.append("image_width", String(opts.imageWidth));
      appendArray(form, "captions", opts.captions);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/confluence/upload", form);
    }
    uploadMiro(opts) {
      const form = new FormData();
      form.append("board_id", opts.boardId);
      if (opts.cols != null) form.append("cols", String(opts.cols));
      if (opts.width != null) form.append("width", String(opts.width));
      if (opts.gap != null) form.append("gap", String(opts.gap));
      if (opts.rowGap != null) form.append("row_gap", String(opts.rowGap));
      if (opts.originX != null) form.append("origin_x", String(opts.originX));
      if (opts.originY != null) form.append("origin_y", String(opts.originY));
      if (opts.group) form.append("group", "true");
      if (opts.connect) form.append("connect", "true");
      if (opts.startIndex != null) form.append("start_index", String(opts.startIndex));
      if (opts.prevItemId) form.append("prev_item_id", opts.prevItemId);
      appendArray(form, "captions", opts.captions);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/miro/upload", form);
    }
    uploadSlack(opts) {
      const form = new FormData();
      form.append("channel_id", opts.channelId);
      if (opts.message) form.append("message", opts.message);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/slack/upload", form);
    }
    uploadS3(opts) {
      const form = new FormData();
      form.append("destination", opts.destination);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/s3/upload", form);
    }
    uploadGitHub(opts) {
      const form = new FormData();
      form.append("issue_ref", opts.issueRef);
      if (opts.message) form.append("message", opts.message);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/github/upload", form);
    }
    uploadGoogleDrive(opts) {
      const form = new FormData();
      form.append("folder_id", opts.folderId);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/googledrive/upload", form);
    }
    uploadContentful(opts) {
      const form = new FormData();
      form.append("env_ref", opts.envRef);
      appendArray(form, "titles", opts.titles);
      for (const f of opts.files) appendFile(form, f);
      return this.request("POST", "/targets/contentful/upload", form);
    }
    // ── Internals ──────────────────────────────────────────────────────────────
    async getToken() {
      const t = this.tokenProvider;
      return typeof t === "function" ? await t() : t;
    }
    async request(method, path, body) {
      const token = await this.getToken();
      const headers = {
        Authorization: `Bearer ${token}`
      };
      if (!body) headers["Accept"] = "application/json";
      const res = await this.fetchFn(`${this.endpoint}${path}`, { method, headers, body });
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) {
        const errEnvelope = data?.error;
        throw new SendToCloudError(
          res.status,
          errEnvelope?.code || "HTTP_ERROR",
          errEnvelope?.message || `Request failed: HTTP ${res.status}`,
          data
        );
      }
      return data;
    }
  };

  // src/index.ts
  var BATCH_SIZES = {
    default: 3
    // jira: 5,
    // slack: 1,
  };
  function batchSizeFor(targetId) {
    return BATCH_SIZES[targetId] ?? BATCH_SIZES.default;
  }
  function uploadForLeaf(client, targetId, leaf, files, extraOpts) {
    switch (targetId) {
      case "jira":
        return client.upload.jira({ issueKey: leaf.id.replace(/^issue:/, ""), files });
      case "confluence":
        return client.upload.confluence({ pageId: leaf.id.replace(/^page:/, ""), files });
      case "miro":
        return client.upload.miro({
          boardId: leaf.id,
          files,
          group: true,
          connect: true,
          captions: files.map(f => (f instanceof File ? f.name : f.filename || "").replace(/\.[^.]+$/, "")),
          ...extraOpts,
        });
      case "slack":
        return client.upload.slack({ channelId: leaf.id, files });
      case "s3":
        return client.upload.s3({ destination: leaf.id, files });
      case "github":
        return client.upload.github({ issueRef: leaf.id.replace(/^issue:/, ""), files });
      case "googledrive":
        return client.upload.googledrive({ folderId: leaf.id.replace(/^folder:/, ""), files });
      case "contentful":
        return client.upload.contentful({ envRef: leaf.id.replace(/^env:/, ""), files });
      default:
        throw new Error(`Unsupported target: ${targetId}`);
    }
  }
  var STYLES = `
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    --stc-bg:        #ffffff;
    --stc-text:      #1a1a2e;
    --stc-muted:     #6b7280;
    --stc-border:    #e5e7eb;
    --stc-accent:    #0052cc;
    --stc-accent-fg: #ffffff;
    --stc-accent-soft: rgba(0, 82, 204, 0.08);
    --stc-row-hover: #f9fafb;
    --stc-row-alt:   #fafafb;
    --stc-chip:      #f3f4f6;
    --stc-chip-hover:#e5e7eb;
    --stc-disabled-bg:#f3f4f6;
    --stc-disabled-fg:#9ca3af;
    --stc-error-bg:  #fee2e2;
    --stc-error-fg:  #991b1b;
    --stc-success-bg:#dcfce7;
    --stc-success-fg:#166534;
    --stc-danger:    #dc2626;

    color: var(--stc-text);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --stc-bg:        #1a1f3a;
      --stc-text:      #e5e7eb;
      --stc-muted:     #9ca3af;
      --stc-border:    #2d3553;
      --stc-accent:    #5b8def;
      --stc-accent-fg: #0f1729;
      --stc-accent-soft: rgba(91, 141, 239, 0.18);
      --stc-row-hover: #232a4a;
      --stc-row-alt:   #1f2540;
      --stc-chip:      #2d3553;
      --stc-chip-hover:#3a4365;
      --stc-disabled-bg:#2d3553;
      --stc-disabled-fg:#6b7280;
      --stc-error-bg:  #4a1a1a;
      --stc-error-fg:  #fca5a5;
      --stc-success-bg:#064e3b;
      --stc-success-fg:#6ee7b7;
      --stc-danger:    #f87171;
    }
  }

  .root {
    background: var(--stc-bg);
    border: 1px solid var(--stc-border);
    border-radius: 12px;
    overflow: hidden;
    max-width: 560px;
  }

  .section { padding: 1rem 1.25rem; border-bottom: 1px solid var(--stc-border); }
  .section:last-child { border-bottom: none; }

  .label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--stc-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.6rem;
  }

  .target-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .target-chip {
    background: var(--stc-chip);
    border: 1px solid transparent;
    color: var(--stc-text);
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.1s;
    font-family: inherit;
  }
  .target-chip:hover    { background: var(--stc-chip-hover); }
  .target-chip.selected { background: var(--stc-accent); color: var(--stc-accent-fg); }
  .target-chip:disabled { opacity: 0.4; cursor: not-allowed; }

  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.3rem;
    font-size: 0.85rem;
    color: var(--stc-muted);
    margin-bottom: 0.5rem;
  }
  .breadcrumb button {
    background: none;
    border: none;
    color: var(--stc-accent);
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
  }
  .breadcrumb .sep { color: var(--stc-border); }
  .breadcrumb .current { color: var(--stc-text); font-weight: 500; }

  .browse-list { max-height: 280px; overflow-y: auto; }
  .browse-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .browse-row:hover    { background: var(--stc-row-hover); }
  .browse-row.selected { background: var(--stc-accent-soft); }
  .browse-row .arrow,
  .browse-row .leaf-mark { color: var(--stc-muted); font-size: 0.75rem; margin-left: auto; }

  .drop-target { display: flex; flex-direction: column; gap: 0.6rem; }
  .drop-target.drag-over .dropzone,
  .drop-target.drag-over .add-more {
    border-color: var(--stc-accent);
    background: var(--stc-accent-soft);
  }

  .dropzone {
    border: 2px dashed var(--stc-border);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.1s, background 0.1s;
  }
  .dropzone:hover { border-color: var(--stc-accent); background: var(--stc-accent-soft); }
  .dropzone p { margin: 0; font-size: 0.9rem; color: var(--stc-muted); }
  .dropzone input { display: none; }

  .add-more {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--stc-accent);
    cursor: pointer;
    padding: 0.45rem 0.7rem;
    border-radius: 6px;
    border: 1px dashed var(--stc-border);
    background: transparent;
    align-self: flex-start;
    transition: border-color 0.1s, background 0.1s;
  }
  .add-more:hover { border-color: var(--stc-accent); background: var(--stc-accent-soft); }
  .add-more input { display: none; }

  .file-list { display: flex; flex-direction: column; gap: 0.3rem; }
  .file-item {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
    background: var(--stc-row-alt);
    border-radius: 6px;
  }
  .file-item .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-item .size { color: var(--stc-muted); font-size: 0.75rem; }
  .file-item button {
    background: none; border: none; cursor: pointer;
    color: var(--stc-muted); font-size: 1rem; padding: 0 0.25rem;
    line-height: 1; font-family: inherit;
  }
  .file-item button:hover { color: var(--stc-danger); }

  .actions { display: flex; gap: 0.6rem; margin-top: 0.85rem; }
  .btn {
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    font-family: inherit;
  }
  .btn-primary {
    background: var(--stc-accent);
    color: var(--stc-accent-fg);
  }
  .btn-primary:hover:not(:disabled) { filter: brightness(1.05); }
  .btn-primary:disabled {
    background: var(--stc-disabled-bg);
    color: var(--stc-disabled-fg);
    cursor: not-allowed;
  }

  .alert {
    padding: 0.6rem 0.85rem;
    border-radius: 6px;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
  .alert.error   { background: var(--stc-error-bg);   color: var(--stc-error-fg); }
  .alert.success { background: var(--stc-success-bg); color: var(--stc-success-fg); }

  .empty,
  .loading {
    text-align: center;
    padding: 1rem;
    color: var(--stc-muted);
    font-size: 0.85rem;
  }

  .hint {
    color: var(--stc-muted);
    font-size: 0.85rem;
    padding: 0.4rem 0;
  }

  .results { font-size: 0.8rem; color: var(--stc-text); }
  .results summary { cursor: pointer; color: var(--stc-muted); font-size: 0.8rem; }
  .results pre {
    background: var(--stc-row-alt);
    color: var(--stc-text);
    padding: 0.6rem;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.75rem;
    margin-top: 0.4rem;
  }

  .upload-progress { margin: 0.5rem 0; }
  .progress-label { font-size: 0.78rem; color: var(--stc-muted); margin-bottom: 0.3rem; }
  .progress-bar-track { height: 6px; background: var(--stc-border); border-radius: 999px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: var(--stc-accent); border-radius: 999px; transition: width 0.15s ease; }

  .upload-log {
    max-height: 4.4rem;
    overflow-y: auto;
    margin: 0.5rem 0;
    border: 1px solid var(--stc-border);
    border-radius: 6px;
    padding: 0.15rem 0;
  }
  .upload-log-entry {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    padding: 0.2rem 0.6rem;
    font-size: 0.78rem;
    line-height: 1.8rem;
  }
  .upload-log-entry.ok  { color: var(--stc-success-fg); }
  .upload-log-entry.error { color: var(--stc-error-fg); }
  .log-icon { flex-shrink: 0; font-weight: 700; }
  .log-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .log-error { font-size: 0.7rem; color: var(--stc-muted); flex-shrink: 0; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;
  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
  var SendToCloudElement = class extends HTMLElement {
    constructor() {
      super();
      this.client = null;
      this.state = {
        targets: [],
        selectedTargetId: null,
        browsePath: [],
        browseNodes: [],
        selectedLeaf: null,
        files: [],
        loading: false,
        error: null,
        result: null,
        uploadProgress: null,
        uploadLog: []
      };
      this.root = this.attachShadow({ mode: "open" });
    }
    static get observedAttributes() {
      return ["endpoint", "token", "no-dropzone"];
    }
    connectedCallback() {
      this.initClient();
      this.render();
      if (this.client) this.loadTargets();
    }
    attributeChangedCallback(name) {
      if (!this.isConnected) return;
      if (name === "endpoint" || name === "token") {
        this.initClient();
        this.loadTargets();
      } else {
        this.render();
      }
    }
    initClient() {
      const endpoint = this.getAttribute("endpoint");
      const token = this.getAttribute("token");
      if (endpoint && token) {
        this.client = new SendToCloudClient({ endpoint, token });
      }
    }
    setState(patch) {
      this.state = { ...this.state, ...patch };
      this.render();
    }
    /** Programmatically replace the queued file list (e.g. from a folder picker). */
    setFiles(files) {
      this.setState({ files: [...files || []], result: null });
    }
    /** Programmatically add files to the existing queue. */
    addFiles(files) {
      if (!files || files.length === 0) return;
      this.setState({ files: [...this.state.files, ...files], result: null });
    }
    /** Clear all pending files. */
    clearFiles() {
      this.setState({ files: [], result: null });
    }
    /** Currently pending files (read-only snapshot). */
    get pendingFiles() {
      return this.state.files;
    }
    async loadTargets() {
      if (!this.client) return;
      this.setState({ loading: true, error: null });
      try {
        const targets = await this.client.listTargets();
        this.setState({ targets, loading: false });
      } catch (err) {
        this.setState({ loading: false, error: this.errMsg(err) });
      }
    }
    async loadBrowse(targetId, parentId, label) {
      if (!this.client) return;
      this.setState({ loading: true, error: null });
      try {
        const nodes = await this.client.browse(targetId, parentId || void 0);
        const newPath = parentId === null ? [{ parentId: null, label }] : [...this.state.browsePath, { parentId, label }];
        this.setState({ browseNodes: nodes, browsePath: newPath, selectedLeaf: null, loading: false });
      } catch (err) {
        this.setState({ loading: false, error: this.errMsg(err) });
      }
    }
    goBackTo(index) {
      if (!this.state.selectedTargetId) return;
      const target = this.state.selectedTargetId;
      const node = this.state.browsePath[index];
      this.setState({ browsePath: this.state.browsePath.slice(0, index) });
      this.loadBrowse(target, node.parentId, node.label);
    }
    async upload() {
      if (!this.client || !this.state.selectedTargetId || !this.state.selectedLeaf || this.state.files.length === 0) return;
      const targetId = this.state.selectedTargetId;
      const leaf = this.state.selectedLeaf;
      const files = [...this.state.files];
      const total = files.length;
      const batchSize = batchSizeFor(targetId);
      this.dispatchEvent(new CustomEvent("upload-start", { detail: { targetId, leafId: leaf.id, files } }));
      this.setState({ loading: true, error: null, result: null, uploadLog: [], uploadProgress: { index: 0, total } });
      let completed = 0;
      let failCount = 0;
      let miroPrevItemId = null;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const extraOpts = targetId === "miro"
          ? { startIndex: i, prevItemId: miroPrevItemId }
          : undefined;
        let batchResults;
        try {
          const response = await uploadForLeaf(this.client, targetId, leaf, batch, extraOpts);
          batchResults = response.results || batch.map(f => ({ filename: f.name, status: "ok" }));
          if (targetId === "miro" && response.results) {
            const lastOk = [...response.results].reverse().find(r => r.status === "ok" && r.item_id);
            if (lastOk) miroPrevItemId = lastOk.item_id;
          }
        } catch (err) {
          batchResults = batch.map(f => ({ filename: f.name, status: "error", error: this.errMsg(err) }));
          if (targetId === "miro") miroPrevItemId = null;
        }
        const newEntries = batchResults.map(r => ({
          filename: r.filename,
          status: r.status,
          error: r.error || null
        }));
        failCount += newEntries.filter(e => e.status !== "ok").length;
        completed += batch.length;
        this.setState({
          uploadProgress: { index: completed, total },
          uploadLog: [...this.state.uploadLog, ...newEntries]
        });
        for (const entry of newEntries) {
          this.dispatchEvent(new CustomEvent("upload-file-progress", {
            detail: { filename: entry.filename, status: entry.status, index: completed, total, error: entry.error }
          }));
        }
      }
      const syntheticResult = { uploaded: total, failed: failCount };
      this.setState({ loading: false, result: syntheticResult, uploadProgress: null });
      if (failCount === 0) {
        this.dispatchEvent(new CustomEvent("upload-success", { detail: { targetId, leafId: leaf.id, response: syntheticResult } }));
      } else {
        this.dispatchEvent(new CustomEvent("upload-error", { detail: { targetId, leafId: leaf.id, error: `${failCount} file(s) failed` } }));
      }
    }
    errMsg(err) {
      if (err instanceof SendToCloudError) return `${err.code}: ${err.message}`;
      if (err instanceof Error) return err.message;
      return String(err);
    }
    // ── Rendering ──────────────────────────────────────────────────────────────
    render() {
      const { targets, selectedTargetId, browsePath, browseNodes, selectedLeaf, files, loading, error, result, uploadProgress, uploadLog } = this.state;
      if (!this.client) {
        this.root.innerHTML = `<style>${STYLES}</style><div class="root"><div class="empty">Set <code>endpoint</code> and <code>token</code> attributes.</div></div>`;
        return;
      }
      const targetsHTML = targets.length === 0 ? `<div class="loading">${loading ? "Loading targets\u2026" : "No targets available."}</div>` : `<div class="target-list">${targets.map((t) => `
            <button class="target-chip ${selectedTargetId === t.id ? "selected" : ""}" data-target="${t.id}" ${t.enabled ? "" : "disabled"}>
              ${t.name}${t.enabled ? "" : " (not configured)"}
            </button>`).join("")}</div>`;
      const browseHTML = !selectedTargetId ? "" : `
      <div class="section">
        <div class="label">Browse</div>
        <div class="breadcrumb">
          ${browsePath.map(
        (p, i) => i === browsePath.length - 1 ? `<span class="current">${escapeHtml(p.label)}</span>` : `<button data-back="${i}">${escapeHtml(p.label)}</button><span class="sep">\u203A</span>`
      ).join("")}
        </div>
        ${loading ? '<div class="loading">Loading\u2026</div>' : ""}
        ${!loading && browseNodes.length === 0 ? '<div class="empty">No items here.</div>' : ""}
        ${!loading && browseNodes.length > 0 ? `
          <div class="browse-list">
            ${browseNodes.map((n) => `
              <div class="browse-row ${selectedLeaf?.id === n.id ? "selected" : ""}" data-node="${escapeAttr(n.id)}" data-leaf="${n.is_leaf}">
                <span>${escapeHtml(n.label)}</span>
                ${n.is_leaf ? '<span class="leaf-mark">leaf</span>' : '<span class="arrow">\u203A</span>'}
              </div>`).join("")}
          </div>` : ""}
      </div>`;
      const noDropzone = this.hasAttribute("no-dropzone");
      const fileListHTML = files.length > 0 ? `
      <div class="file-list">
        ${files.map((f, i) => `
          <div class="file-item">
            <span class="name">${escapeHtml(f.name)}</span>
            <span class="size">${formatSize(f.size)}</span>
            <button data-remove="${i}" title="Remove">\xD7</button>
          </div>`).join("")}
      </div>` : "";
      const buttonLabel = loading ? "Uploading\u2026" : files.length === 0 ? "Upload" : `Upload ${files.length} file${files.length === 1 ? "" : "s"}`;
      let uploadBody;
      if (noDropzone) {
        uploadBody = files.length === 0 ? `<div class="hint">Select files externally to enable upload.</div>` : `<div class="hint">${files.length} file${files.length === 1 ? "" : "s"} ready to upload.</div>`;
      } else {
        uploadBody = `<div class="drop-target" id="drop-target">${files.length === 0 ? `<label class="dropzone">
               <p>Drop files here or click to choose</p>
               <input type="file" multiple id="file-input">
             </label>` : `${fileListHTML}
             <label class="add-more">
               <input type="file" multiple id="file-input">
               + Add more files
             </label>`}</div>`;
      }
      const progressHTML = uploadProgress ? `
      <div class="upload-progress">
        <div class="progress-label">Uploading ${uploadProgress.index} of ${uploadProgress.total}…</div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${Math.round((uploadProgress.index / uploadProgress.total) * 100)}%"></div>
        </div>
      </div>` : "";
      const logHTML = uploadLog.length > 0 ? `
      <div class="upload-log">
        ${uploadLog.map(e => `
          <div class="upload-log-entry ${e.status}">
            <span class="log-icon">${e.status === "ok" ? "✓" : "✗"}</span>
            <span class="log-name">${escapeHtml(e.filename)}</span>
            ${e.error ? `<span class="log-error">${escapeHtml(e.error)}</span>` : ""}
          </div>`).join("")}
      </div>` : "";
      const uploadHTML = !selectedLeaf ? "" : `
      <div class="section">
        <div class="label">Upload to: ${escapeHtml(selectedLeaf.label)}</div>
        ${uploadBody}
        ${progressHTML}
        ${logHTML}
        <div class="actions">
          <button class="btn btn-primary" id="upload-btn" ${files.length === 0 || loading ? "disabled" : ""}>
            ${buttonLabel}
          </button>
        </div>
      </div>`;
      const feedbackHTML = `
      ${error ? `<div class="alert error">${escapeHtml(error)}</div>` : ""}
      ${result ? `<div class="alert success">Uploaded ${result.uploaded - result.failed}/${result.uploaded} file${result.uploaded === 1 ? "" : "s"}${result.failed ? ` (${result.failed} failed)` : ""}</div>
                  <details class="results"><summary>Response</summary><pre>${escapeHtml(JSON.stringify(result, null, 2))}</pre></details>` : ""}`;
      this.root.innerHTML = `
      <style>${STYLES}</style>
      <div class="root">
        <div class="section">
          <div class="label">Send to</div>
          ${targetsHTML}
        </div>
        ${browseHTML}
        ${uploadHTML}
        ${feedbackHTML ? `<div class="section">${feedbackHTML}</div>` : ""}
      </div>`;
      this.bindEvents();
      const logEl = this.root.querySelector(".upload-log");
      if (logEl) logEl.scrollTop = logEl.scrollHeight;
    }
    bindEvents() {
      this.root.querySelectorAll(".target-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-target");
          this.setState({ selectedTargetId: id, selectedLeaf: null, result: null, browsePath: [], browseNodes: [] });
          const target = this.state.targets.find((t) => t.id === id);
          if (target) this.loadBrowse(id, null, target.name);
        });
      });
      this.root.querySelectorAll("[data-back]").forEach((btn) => {
        btn.addEventListener("click", () => this.goBackTo(parseInt(btn.getAttribute("data-back"), 10)));
      });
      this.root.querySelectorAll(".browse-row").forEach((row) => {
        row.addEventListener("click", () => {
          const id = row.getAttribute("data-node");
          const isLeaf = row.getAttribute("data-leaf") === "true";
          const node = this.state.browseNodes.find((n) => n.id === id);
          if (isLeaf) {
            this.setState({ selectedLeaf: node, result: null });
          } else {
            this.loadBrowse(this.state.selectedTargetId, node.id, node.label);
          }
        });
      });
      const dropTarget = this.root.getElementById("drop-target");
      const fileInput = this.root.getElementById("file-input");
      if (fileInput) {
        fileInput.addEventListener("change", () => {
          if (fileInput.files) this.setState({ files: [...this.state.files, ...Array.from(fileInput.files)], result: null });
        });
      }
      if (dropTarget) {
        dropTarget.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropTarget.classList.add("drag-over");
        });
        dropTarget.addEventListener("dragleave", (e) => {
          if (e.target === dropTarget) dropTarget.classList.remove("drag-over");
        });
        dropTarget.addEventListener("drop", (e) => {
          e.preventDefault();
          dropTarget.classList.remove("drag-over");
          if (e.dataTransfer?.files) this.setState({ files: [...this.state.files, ...Array.from(e.dataTransfer.files)], result: null });
        });
      }
      this.root.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute("data-remove"), 10);
          this.setState({ files: this.state.files.filter((_, i) => i !== idx) });
        });
      });
      const uploadBtn = this.root.getElementById("upload-btn");
      uploadBtn?.addEventListener("click", () => this.upload());
    }
  };
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function escapeAttr(s) {
    return s.replace(/"/g, "&quot;");
  }
  if (typeof customElements !== "undefined" && !customElements.get("send-to-cloud")) {
    customElements.define("send-to-cloud", SendToCloudElement);
  }
  return __toCommonJS(index_exports);
})();
