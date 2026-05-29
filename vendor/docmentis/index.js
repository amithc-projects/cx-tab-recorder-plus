var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@docmentis/udoc-viewer/dist/src/meta-url.js
var meta_url_exports = {};
__export(meta_url_exports, {
  wasmUrl: () => wasmUrl
});
var _wasmUrl, wasmUrl;
var init_meta_url = __esm({
  "node_modules/@docmentis/udoc-viewer/dist/src/meta-url.js"() {
    _wasmUrl = new URL("./wasm/udoc_bg.wasm", import.meta.url).href;
    if (_wasmUrl.startsWith("/") && typeof globalThis.location !== "undefined") {
      _wasmUrl = globalThis.location.origin + _wasmUrl;
    }
    wasmUrl = _wasmUrl;
  }
});

// node_modules/@docmentis/udoc-viewer/dist/src/worker/worker-inline.js
var WORKER_INLINE = '"use strict";\n(() => {\n  // dist/src/wasm/udoc.js\n  var wasm;\n  function addHeapObject(obj) {\n    if (heap_next === heap.length) heap.push(heap.length + 1);\n    const idx = heap_next;\n    heap_next = heap[idx];\n    heap[idx] = obj;\n    return idx;\n  }\n  var CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: () => {\n  }, unregister: () => {\n  } } : new FinalizationRegistry((state) => state.dtor(state.a, state.b));\n  function debugString(val) {\n    const type = typeof val;\n    if (type == "number" || type == "boolean" || val == null) {\n      return `${val}`;\n    }\n    if (type == "string") {\n      return `"${val}"`;\n    }\n    if (type == "symbol") {\n      const description = val.description;\n      if (description == null) {\n        return "Symbol";\n      } else {\n        return `Symbol(${description})`;\n      }\n    }\n    if (type == "function") {\n      const name = val.name;\n      if (typeof name == "string" && name.length > 0) {\n        return `Function(${name})`;\n      } else {\n        return "Function";\n      }\n    }\n    if (Array.isArray(val)) {\n      const length = val.length;\n      let debug = "[";\n      if (length > 0) {\n        debug += debugString(val[0]);\n      }\n      for (let i = 1; i < length; i++) {\n        debug += ", " + debugString(val[i]);\n      }\n      debug += "]";\n      return debug;\n    }\n    const builtInMatches = /\\[object ([^\\]]+)\\]/.exec(toString.call(val));\n    let className;\n    if (builtInMatches && builtInMatches.length > 1) {\n      className = builtInMatches[1];\n    } else {\n      return toString.call(val);\n    }\n    if (className == "Object") {\n      try {\n        return "Object(" + JSON.stringify(val) + ")";\n      } catch (_) {\n        return "Object";\n      }\n    }\n    if (val instanceof Error) {\n      return `${val.name}: ${val.message}\n${val.stack}`;\n    }\n    return className;\n  }\n  function dropObject(idx) {\n    if (idx < 132) return;\n    heap[idx] = heap_next;\n    heap_next = idx;\n  }\n  function getArrayJsValueFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    const mem = getDataViewMemory0();\n    const result = [];\n    for (let i = ptr; i < ptr + 4 * len; i += 4) {\n      result.push(takeObject(mem.getUint32(i, true)));\n    }\n    return result;\n  }\n  function getArrayU32FromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);\n  }\n  function getArrayU8FromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);\n  }\n  var cachedDataViewMemory0 = null;\n  function getDataViewMemory0() {\n    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {\n      cachedDataViewMemory0 = new DataView(wasm.memory.buffer);\n    }\n    return cachedDataViewMemory0;\n  }\n  function getStringFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return decodeText(ptr, len);\n  }\n  var cachedUint32ArrayMemory0 = null;\n  function getUint32ArrayMemory0() {\n    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {\n      cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);\n    }\n    return cachedUint32ArrayMemory0;\n  }\n  var cachedUint8ArrayMemory0 = null;\n  function getUint8ArrayMemory0() {\n    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {\n      cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8ArrayMemory0;\n  }\n  function getObject(idx) {\n    return heap[idx];\n  }\n  function handleError(f, args) {\n    try {\n      return f.apply(this, args);\n    } catch (e) {\n      wasm.__wbindgen_export3(addHeapObject(e));\n    }\n  }\n  var heap = new Array(128).fill(void 0);\n  heap.push(void 0, null, true, false);\n  var heap_next = heap.length;\n  function isLikeNone(x) {\n    return x === void 0 || x === null;\n  }\n  function makeMutClosure(arg0, arg1, dtor, f) {\n    const state = { a: arg0, b: arg1, cnt: 1, dtor };\n    const real = (...args) => {\n      state.cnt++;\n      const a = state.a;\n      state.a = 0;\n      try {\n        return f(a, state.b, ...args);\n      } finally {\n        state.a = a;\n        real._wbg_cb_unref();\n      }\n    };\n    real._wbg_cb_unref = () => {\n      if (--state.cnt === 0) {\n        state.dtor(state.a, state.b);\n        state.a = 0;\n        CLOSURE_DTORS.unregister(state);\n      }\n    };\n    CLOSURE_DTORS.register(real, state, state);\n    return real;\n  }\n  function passArray8ToWasm0(arg, malloc) {\n    const ptr = malloc(arg.length * 1, 1) >>> 0;\n    getUint8ArrayMemory0().set(arg, ptr / 1);\n    WASM_VECTOR_LEN = arg.length;\n    return ptr;\n  }\n  function passArrayJsValueToWasm0(array, malloc) {\n    const ptr = malloc(array.length * 4, 4) >>> 0;\n    const mem = getDataViewMemory0();\n    for (let i = 0; i < array.length; i++) {\n      mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);\n    }\n    WASM_VECTOR_LEN = array.length;\n    return ptr;\n  }\n  function passStringToWasm0(arg, malloc, realloc) {\n    if (realloc === void 0) {\n      const buf = cachedTextEncoder.encode(arg);\n      const ptr2 = malloc(buf.length, 1) >>> 0;\n      getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);\n      WASM_VECTOR_LEN = buf.length;\n      return ptr2;\n    }\n    let len = arg.length;\n    let ptr = malloc(len, 1) >>> 0;\n    const mem = getUint8ArrayMemory0();\n    let offset = 0;\n    for (; offset < len; offset++) {\n      const code = arg.charCodeAt(offset);\n      if (code > 127) break;\n      mem[ptr + offset] = code;\n    }\n    if (offset !== len) {\n      if (offset !== 0) {\n        arg = arg.slice(offset);\n      }\n      ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;\n      const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);\n      const ret = cachedTextEncoder.encodeInto(arg, view);\n      offset += ret.written;\n      ptr = realloc(ptr, len, offset, 1) >>> 0;\n    }\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n  }\n  function takeObject(idx) {\n    const ret = getObject(idx);\n    dropObject(idx);\n    return ret;\n  }\n  var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });\n  cachedTextDecoder.decode();\n  var MAX_SAFARI_DECODE_BYTES = 2146435072;\n  var numBytesDecoded = 0;\n  function decodeText(ptr, len) {\n    numBytesDecoded += len;\n    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {\n      cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });\n      cachedTextDecoder.decode();\n      numBytesDecoded = len;\n    }\n    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));\n  }\n  var cachedTextEncoder = new TextEncoder();\n  if (!("encodeInto" in cachedTextEncoder)) {\n    cachedTextEncoder.encodeInto = function(arg, view) {\n      const buf = cachedTextEncoder.encode(arg);\n      view.set(buf);\n      return {\n        read: arg.length,\n        written: buf.length\n      };\n    };\n  }\n  var WASM_VECTOR_LEN = 0;\n  function __wasm_bindgen_func_elem_4195(arg0, arg1, arg2) {\n    wasm.__wasm_bindgen_func_elem_4195(arg0, arg1, addHeapObject(arg2));\n  }\n  function __wasm_bindgen_func_elem_22595(arg0, arg1, arg2, arg3) {\n    wasm.__wasm_bindgen_func_elem_22595(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));\n  }\n  var __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];\n  var __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];\n  var __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];\n  var __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];\n  var __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];\n  var __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];\n  var __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];\n  var __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];\n  var __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];\n  var __wbindgen_enum_XmlHttpRequestResponseType = ["", "arraybuffer", "blob", "document", "json", "text"];\n  var WasmFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {\n  }, unregister: () => {\n  } } : new FinalizationRegistry((ptr) => wasm.__wbg_wasm_free(ptr >>> 0, 1));\n  var Wasm = class {\n    __destroy_into_raw() {\n      const ptr = this.__wbg_ptr;\n      this.__wbg_ptr = 0;\n      WasmFinalization.unregister(this);\n      return ptr;\n    }\n    free() {\n      const ptr = this.__destroy_into_raw();\n      wasm.__wbg_wasm_free(ptr, 0);\n    }\n    /**\n     * Load an image file and return its ID.\n     *\n     * Supports various image formats: JPEG, PNG, GIF, BMP, TIFF, WebP, etc.\n     * Multi-page TIFF files will create a document with multiple pages.\n     *\n     * # Arguments\n     * * `bytes` - Raw image file data\n     *\n     * # Returns\n     * A unique document ID that can be used to reference this document.\n     * @param {Uint8Array} bytes\n     * @returns {string}\n     */\n    load_image(bytes) {\n      let deferred3_0;\n      let deferred3_1;\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_load_image(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        var ptr2 = r0;\n        var len2 = r1;\n        if (r3) {\n          ptr2 = 0;\n          len2 = 0;\n          throw takeObject(r2);\n        }\n        deferred3_0 = ptr2;\n        deferred3_1 = len2;\n        return getStringFromWasm0(ptr2, len2);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);\n      }\n    }\n    /**\n     * Get the page count of a document.\n     * @param {string} id\n     * @returns {number}\n     */\n    page_count(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_page_count(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return r0 >>> 0;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get the document outline (bookmarks/table of contents).\n     *\n     * Returns an array of outline items, where each item has:\n     * - `title`: Display text for the item\n     * - `destination`: Optional navigation destination with `pageIndex` and display parameters\n     * - `children`: Nested child items\n     *\n     * Returns an empty array if the document has no outline.\n     * @param {string} id\n     * @returns {JsOutlineItem[]}\n     */\n    get_outline(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_get_outline(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Check if a feature is enabled by the current license.\n     * @param {string} feature\n     * @returns {boolean}\n     */\n    has_feature(feature) {\n      const ptr0 = passStringToWasm0(feature, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      const ret = wasm.wasm_has_feature(this.__wbg_ptr, ptr0, len0);\n      return ret !== 0;\n    }\n    /**\n     * Get the page groups for a document.\n     *\n     * Each group covers a contiguous range of global page indices with a\n     * shared stitching layout. Use this to build per-group canvases (e.g.,\n     * one panel per Excel sheet) and group-named sidebars.\n     *\n     * - PDF/DOCX: one `linear` group covering all pages, no name.\n     * - PPTX: one `linear` group (per-section groups once sections are modeled).\n     * - XLSX: one `tiled` group per sheet with the sheet name and page-grid dimensions.\n     * @param {string} id\n     * @returns {JsPageGroup[]}\n     */\n    page_groups(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_page_groups(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Compose new PDF documents by cherry-picking pages from source documents.\n     *\n     * The original documents remain unchanged.\n     *\n     * # Arguments\n     * * `compositions` - Array of compositions. Each composition is an array of picks.\n     *   Each pick is `{ doc: docIndex, pages: "0-2,4" }` where `docIndex` is the index\n     *   in the `doc_ids` array and `pages` is a page range string (0-based).\n     * * `doc_ids` - Array of document IDs to use as sources (order matters for doc indices)\n     *\n     * # Example\n     * ```js\n     * // Create two documents: first has pages 0-2 from doc A, second has page 0 from A and 1 from B\n     * const newDocIds = udoc.pdf_compose(\n     *   [\n     *     [{ doc: 0, pages: "0-2" }],\n     *     [{ doc: 0, pages: "0" }, { doc: 1, pages: "1" }]\n     *   ],\n     *   ["doc_0", "doc_1"]\n     * );\n     * ```\n     *\n     * # Returns\n     * Array of IDs for the newly created documents (one per composition).\n     * @param {JsCompositions} compositions\n     * @param {string[]} doc_ids\n     * @returns {string[]}\n     */\n    pdf_compose(compositions, doc_ids) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArrayJsValueToWasm0(doc_ids, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_pdf_compose(retptr, this.__wbg_ptr, addHeapObject(compositions), ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Set the license key.\n     *\n     * # Arguments\n     * * `license_key` - The license key string\n     *\n     * # Returns\n     * License validation result as JSON.\n     * @param {string} license_key\n     * @returns {LicenseResult}\n     */\n    set_license(license_key) {\n      const ptr0 = passStringToWasm0(license_key, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      const ret = wasm.wasm_set_license(this.__wbg_ptr, ptr0, len0);\n      return takeObject(ret);\n    }\n    /**\n     * Authenticate with a password to unlock an encrypted document.\n     *\n     * # Arguments\n     * * `id` - Document ID\n     * * `password` - Password to try\n     *\n     * # Returns\n     * `true` if authentication succeeded, `false` if the password was incorrect.\n     * @param {string} id\n     * @param {string} password\n     * @returns {boolean}\n     */\n    authenticate(id, password) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        const ptr1 = passStringToWasm0(password, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len1 = WASM_VECTOR_LEN;\n        wasm.wasm_authenticate(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return r0 !== 0;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get all document IDs.\n     * @returns {string[]}\n     */\n    document_ids() {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        wasm.wasm_document_ids(retptr, this.__wbg_ptr);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var v1 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v1;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Check if a document with the given ID exists.\n     * @param {string} id\n     * @returns {boolean}\n     */\n    has_document(id) {\n      const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      const ret = wasm.wasm_has_document(this.__wbg_ptr, ptr0, len0);\n      return ret !== 0;\n    }\n    /**\n     * Compress a PDF document.\n     *\n     * Saves the document with full compression options enabled:\n     * - Compress stream data using FlateDecode\n     * - Pack objects into compressed object streams (PDF 1.5+)\n     * - Use compressed xref streams (PDF 1.5+)\n     * - Remove unreferenced objects\n     *\n     * # Arguments\n     * * `doc_id` - Document ID to compress\n     *\n     * # Returns\n     * Compressed PDF data as Uint8Array\n     * @param {string} doc_id\n     * @returns {Uint8Array}\n     */\n    pdf_compress(doc_id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(doc_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_pdf_compress(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayU8FromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 1, 1);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get info for all pages in one call.\n     *\n     * Returns an array of `PageInfo` objects, one per page.\n     * More efficient than calling `page_info` for each page.\n     * @param {string} id\n     * @returns {JsPageInfo[]}\n     */\n    all_page_info(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_all_page_info(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get the number of documents currently loaded.\n     * @returns {number}\n     */\n    get document_count() {\n      const ret = wasm.wasm_document_count(this.__wbg_ptr);\n      return ret >>> 0;\n    }\n    /**\n     * Get font usage information for a document.\n     *\n     * Returns an array of `FontUsageEntry` objects describing how each font\n     * spec in the document was resolved, including primary resolution and\n     * any glyph-fallback fonts used during text shaping.\n     *\n     * This information is populated during layout \u2014 call after rendering at\n     * least one page to get results.\n     *\n     * # Arguments\n     * * `id` - Document ID\n     *\n     * # Returns\n     * `FontUsageEntry[]` \u2014 see TypeScript types for shape.\n     * @param {string} id\n     * @returns {JsFontUsageEntry[]}\n     */\n    get_font_usage(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_get_font_usage(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get current license status.\n     * @returns {LicenseResult}\n     */\n    license_status() {\n      const ret = wasm.wasm_license_status(this.__wbg_ptr);\n      return takeObject(ret);\n    }\n    /**\n     * Check if a document requires a password to open.\n     *\n     * Returns `true` if the document is encrypted and requires authentication\n     * before pages can be loaded or rendered.\n     * @param {string} id\n     * @returns {boolean}\n     */\n    needs_password(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_needs_password(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return r0 !== 0;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Decompress a PDF document.\n     *\n     * Removes all filter encodings from streams, resulting in raw,\n     * uncompressed stream data. Useful for debugging or inspection.\n     *\n     * # Arguments\n     * * `doc_id` - Document ID to decompress\n     *\n     * # Returns\n     * Decompressed PDF data as Uint8Array\n     * @param {string} doc_id\n     * @returns {Uint8Array}\n     */\n    pdf_decompress(doc_id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(doc_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_pdf_decompress(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayU8FromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 1, 1);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Register font URLs.\n     *\n     * The caller provides a list of all available fonts with their download\n     * URLs. During layout, when the engine needs a font, it is fetched from\n     * the URL, parsed, and cached for reuse.\n     *\n     * Call this before loading documents. Registered fonts are automatically\n     * applied to every document loaded afterward. URL fonts are always\n     * resolved before Google Fonts.\n     *\n     * # Arguments\n     * * `fonts` - Array of font entries: `[{ typeface: "Roboto", bold: false, italic: false, url: "https://..." }, ...]`\n     *\n     * # Example (JavaScript)\n     * ```js\n     * // Register available fonts before loading documents\n     * udoc.registerFonts([\n     *     { typeface: "Roboto", bold: false, italic: false, url: "https://cdn.example.com/Roboto-Regular.woff2" },\n     *     { typeface: "Roboto", bold: true, italic: false, url: "https://cdn.example.com/Roboto-Bold.woff2" },\n     * ]);\n     *\n     * // Load and render - fonts are fetched on demand during layout\n     * const docId = udoc.loadPptx(pptxBytes);\n     * const pixels = udoc.renderPageToRgba(docId, 0, 800, 600);\n     * ```\n     * @param {JsFontRegistration[]} fonts\n     */\n    registerFonts(fonts) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArrayJsValueToWasm0(fonts, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_registerFonts(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        if (r1) {\n          throw takeObject(r0);\n        }\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get the format of a loaded document.\n     *\n     * Returns one of: "pdf", "docx", "pptx", "xlsx", "image".\n     * @param {string} id\n     * @returns {string}\n     */\n    document_format(id) {\n      let deferred3_0;\n      let deferred3_1;\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_document_format(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        var ptr2 = r0;\n        var len2 = r1;\n        if (r3) {\n          ptr2 = 0;\n          len2 = 0;\n          throw takeObject(r2);\n        }\n        deferred3_0 = ptr2;\n        deferred3_1 = len2;\n        return getStringFromWasm0(ptr2, len2);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);\n      }\n    }\n    /**\n     * Get the layout model for a specific page.\n     *\n     * Returns the hierarchical layout structure (frames, parcels, lines, runs,\n     * glyphs, tables, grids) without building the full display list. This is\n     * more efficient than `get_page_text` for text selection/search and\n     * preserves semantic structure (paragraphs, tables, etc.).\n     *\n     * All coordinates are in points (1/72 inch). The viewer should scale by\n     * `canvasWidth / layoutPage.width` to convert to pixels.\n     * @param {string} id\n     * @param {number} page_index\n     * @returns {JsLayoutPage}\n     */\n    get_layout_page(id, page_index) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_get_layout_page(retptr, this.__wbg_ptr, ptr0, len0, page_index);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return takeObject(r0);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Remove a document by ID.\n     *\n     * Returns true if the document was removed, false if it didn\'t exist.\n     * @param {string} id\n     * @returns {boolean}\n     */\n    remove_document(id) {\n      const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      const ret = wasm.wasm_remove_document(this.__wbg_ptr, ptr0, len0);\n      return ret !== 0;\n    }\n    /**\n     * Render a page using the GPU backend (Vello + WebGPU).\n     *\n     * Returns raw RGBA pixel data in premultiplied alpha format,\n     * identical to `render_page_to_rgba` but GPU-accelerated.\n     *\n     * # Errors\n     * Returns an error if the GPU backend is not initialized\n     * (call `init_gpu()` first), if the document is not found,\n     * or if rendering fails.\n     * @param {string} id\n     * @param {number} page_index\n     * @param {number} width\n     * @param {number} height\n     * @returns {Promise<Uint8Array>}\n     */\n    render_page_gpu(id, page_index, width, height) {\n      const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      const ret = wasm.wasm_render_page_gpu(this.__wbg_ptr, ptr0, len0, page_index, width, height);\n      return takeObject(ret);\n    }\n    /**\n     * Set the anonymous distinct ID for telemetry tracking.\n     *\n     * Call this after `new()` once the ID has been read from localStorage\n     * (or generated). Must be called before loading documents so that\n     * telemetry events include the correct metadata.\n     *\n     * # Arguments\n     * * `distinct_id` - Anonymous UUID for per-user tracking (persisted in localStorage)\n     * @param {string} distinct_id\n     */\n    setup_telemetry(distinct_id) {\n      const ptr0 = passStringToWasm0(distinct_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      wasm.wasm_setup_telemetry(this.__wbg_ptr, ptr0, len0);\n    }\n    /**\n     * Disable telemetry reporting.\n     *\n     * Only takes effect if the current license includes the `no_telemetry`\n     * feature flag. Returns `true` if telemetry was disabled, `false` if the\n     * license does not permit it.\n     * @returns {boolean}\n     */\n    disable_telemetry() {\n      const ret = wasm.wasm_disable_telemetry(this.__wbg_ptr);\n      return ret !== 0;\n    }\n    /**\n     * Extract all embedded fonts from a PDF document.\n     *\n     * # Arguments\n     * * `doc_id` - Document ID to extract fonts from\n     *\n     * # Returns\n     * Array of extracted font objects, each with:\n     * - `name`: Font name from the resource dictionary\n     * - `fontType`: Font type (Type1, TrueType, etc.)\n     * - `extension`: File extension (ttf, cff, t1, etc.)\n     * - `data`: Raw font data as Uint8Array\n     * @param {string} doc_id\n     * @returns {JsExtractedFont[]}\n     */\n    pdf_extract_fonts(doc_id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(doc_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_pdf_extract_fonts(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Extract all embedded images from a PDF document.\n     *\n     * # Arguments\n     * * `doc_id` - Document ID to extract images from\n     * * `convert_raw_to_png` - When true, converts raw pixel data to PNG format\n     *\n     * # Returns\n     * Array of extracted image objects, each with:\n     * - `name`: Image name from the resource dictionary\n     * - `format`: Image format (jpeg, png, jp2, etc.)\n     * - `width`: Width in pixels\n     * - `height`: Height in pixels\n     * - `data`: Raw image data as Uint8Array\n     * @param {string} doc_id\n     * @param {boolean} convert_raw_to_png\n     * @returns {JsExtractedImage[]}\n     */\n    pdf_extract_images(doc_id, convert_raw_to_png) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(doc_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_pdf_extract_images(retptr, this.__wbg_ptr, ptr0, len0, convert_raw_to_png);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Render a page to PNG bytes.\n     *\n     * # Arguments\n     * * `id` - Document ID\n     * * `page_index` - Zero-based page index\n     * * `width` - Output width in pixels\n     * * `height` - Output height in pixels\n     *\n     * # Returns\n     * PNG-encoded image data as a byte array.\n     * @param {string} id\n     * @param {number} page_index\n     * @param {number} width\n     * @param {number} height\n     * @returns {Uint8Array}\n     */\n    render_page_to_png(id, page_index, width, height) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_render_page_to_png(retptr, this.__wbg_ptr, ptr0, len0, page_index, width, height);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayU8FromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 1, 1);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get viewer preferences embedded in the document.\n     *\n     * Returns a `JsViewerPreferences` with optional fields:\n     * - `layoutMode`: `"single-page"` | `"double-page-odd-right"` | `"double-page-odd-left"`\n     * - `scrollMode`: `"spread"` | `"continuous"`\n     * @param {string} id\n     * @returns {JsViewerPreferences}\n     */\n    viewer_preferences(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_viewer_preferences(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return takeObject(r0);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Enable Google Fonts.\n     *\n     * When enabled, fonts that are not embedded in the document will be\n     * automatically fetched from Google Fonts during rendering. Google Fonts\n     * are resolved after any URL fonts registered via `registerFonts`.\n     *\n     * Call this before loading documents.\n     *\n     * # Example (JavaScript)\n     * ```js\n     * udoc.enableGoogleFonts();\n     * const docId = udoc.loadPptx(pptxBytes);\n     * const pixels = udoc.renderPageToRgba(docId, 0, 800, 600);\n     * ```\n     */\n    enableGoogleFonts() {\n      wasm.wasm_enableGoogleFonts(this.__wbg_ptr);\n    }\n    /**\n     * Get all annotations in the document, grouped by page index.\n     *\n     * Returns an object mapping page indices (as strings) to arrays of annotations.\n     * @param {string} id\n     * @returns {JsAnnotationsByPage}\n     */\n    get_all_annotations(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_get_all_annotations(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return takeObject(r0);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Render a page to raw RGBA pixel data.\n     *\n     * The returned data is in premultiplied alpha format, suitable for\n     * use with `ImageData` and canvas rendering.\n     *\n     * # Arguments\n     * * `id` - Document ID\n     * * `page_index` - Zero-based page index\n     * * `width` - Output width in pixels\n     * * `height` - Output height in pixels\n     *\n     * # Returns\n     * Raw RGBA pixel data (width * height * 4 bytes).\n     * @param {string} id\n     * @param {number} page_index\n     * @param {number} width\n     * @param {number} height\n     * @returns {Uint8Array}\n     */\n    render_page_to_rgba(id, page_index, width, height) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_render_page_to_rgba(retptr, this.__wbg_ptr, ptr0, len0, page_index, width, height);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayU8FromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 1, 1);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get annotations for a specific page.\n     *\n     * Returns an array of annotation objects for the given page.\n     * Uses per-page loading for efficiency (only loads the requested page).\n     *\n     * All geometry fields on the returned annotations (`bounds`, `quads`,\n     * `vertices`, `inkList`, `start`/`end`, \u2026) are in the page\'s unrotated\n     * MediaBox coordinate space \u2014 origin top-left, PDF points, +y downward\n     * \u2014 regardless of the page\'s `/Rotate` value. The viewer applies\n     * rotation as a display transform on top. This matches the input space\n     * expected by `pdf_save_annotations`, so the round-trip is consistent.\n     * @param {string} id\n     * @param {number} page_index\n     * @returns {JsAnnotation[]}\n     */\n    get_page_annotations(id, page_index) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_get_page_annotations(retptr, this.__wbg_ptr, ptr0, len0, page_index);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Save annotations back to a PDF document.\n     *\n     * Takes the current document and a set of annotations (grouped by page),\n     * writes them into the PDF\'s annotation structures, and returns the\n     * modified PDF bytes.\n     *\n     * # Coordinate space\n     *\n     * Every geometry field on the supplied annotations (`bounds`, `quads`,\n     * `vertices`, `inkList`, `start`/`end`, `calloutLine`, \u2026) must be in\n     * the page\'s **unrotated MediaBox** coordinate space:\n     *\n     * - Origin = MediaBox top-left of the page in its natural (pre-`/Rotate`)\n     *   orientation. `(0, 0)` does not move when the page is displayed\n     *   rotated 90\xB0/180\xB0/270\xB0.\n     * - Units = PDF points (1/72 inch).\n     * - Axes = `+x` right, `+y` downward (Y-flipped relative to PDF\'s native\n     *   bottom-up `/Rect`; this function performs the flip on the way out).\n     * - `CropBox` is ignored \u2014 coordinates are MediaBox-relative even when\n     *   the page\'s CropBox trims the visible area.\n     *\n     * This is the same space returned by `get_page_annotations` /\n     * `get_all_annotations`, so a load-edit-save round-trip is consistent.\n     * Pages with no existing `/Annots` array are handled automatically: any\n     * pre-existing array is cleared and a fresh one is created.\n     *\n     * # Arguments\n     * * `doc_id` - Document ID\n     * * `annotations_by_page` - Object mapping page indices (as strings) to\n     *   arrays of annotation objects. Same schema as returned by\n     *   `get_all_annotations`.\n     *\n     * # Returns\n     * The modified PDF file bytes with annotations saved.\n     *\n     * # Example (JavaScript)\n     * ```js\n     * const annotations = udoc.get_all_annotations(docId);\n     * // ... viewer edits annotations ...\n     * const pdfBytes = udoc.pdf_save_annotations(docId, annotations);\n     * ```\n     * @param {string} doc_id\n     * @param {JsAnnotationsByPage} annotations_by_page\n     * @returns {Uint8Array}\n     */\n    pdf_save_annotations(doc_id, annotations_by_page) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(doc_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_pdf_save_annotations(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(annotations_by_page));\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayU8FromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 1, 1);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Split a PDF document by its outline (bookmarks) structure.\n     *\n     * Creates multiple documents, one for each outline section at the specified level.\n     *\n     * # Arguments\n     * * `doc_id` - Document ID to split\n     * * `max_level` - Maximum outline level to consider (1 = top level only)\n     * * `split_mid_page` - When true, filters page content when sections share a page\n     *\n     * # Returns\n     * Object with:\n     * - `documentIds`: Array of IDs for the newly created documents\n     * - `sections`: Array of section info objects with `title`, `startPage`, `level`\n     * @param {string} doc_id\n     * @param {number} max_level\n     * @param {boolean} split_mid_page\n     * @returns {JsSplitByOutlineResult}\n     */\n    pdf_split_by_outline(doc_id, max_level, split_mid_page) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(doc_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_pdf_split_by_outline(retptr, this.__wbg_ptr, ptr0, len0, max_level, split_mid_page);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return takeObject(r0);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get all visibility groups for a document.\n     *\n     * Returns an array of objects, each containing:\n     * - `id`: Unique identifier string\n     * - `name`: Display name for UI\n     * - `visible`: Whether the group is currently visible\n     *\n     * Returns an empty array for documents without visibility groups.\n     * @param {string} id\n     * @returns {JsVisibilityGroup[]}\n     */\n    get_visibility_groups(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_get_visibility_groups(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 4, 4);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Set the visibility of a specific visibility group.\n     *\n     * # Arguments\n     * * `id` - Document ID\n     * * `group_id` - Visibility group ID\n     * * `visible` - Whether the group should be visible\n     *\n     * Returns `true` if the group was found and updated, `false` if not found.\n     * @param {string} id\n     * @param {string} group_id\n     * @param {boolean} visible\n     * @returns {boolean}\n     */\n    set_visibility_group_visible(id, group_id, visible) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        const ptr1 = passStringToWasm0(group_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len1 = WASM_VECTOR_LEN;\n        wasm.wasm_set_visibility_group_visible(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, visible);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return r0 !== 0;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Create a new document viewer.\n     *\n     * # Arguments\n     * * `domain` - Hostname of the embedding page (e.g. from `window.location.hostname`)\n     * * `viewer_version` - SDK version string\n     * @param {string} domain\n     * @param {string} viewer_version\n     */\n    constructor(domain, viewer_version) {\n      const ptr0 = passStringToWasm0(domain, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      const ptr1 = passStringToWasm0(viewer_version, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len1 = WASM_VECTOR_LEN;\n      const ret = wasm.wasm_new(ptr0, len0, ptr1, len1);\n      this.__wbg_ptr = ret >>> 0;\n      WasmFinalization.register(this, this.__wbg_ptr, this);\n      return this;\n    }\n    /**\n     * Load a document by auto-detecting its format from the file contents.\n     *\n     * Inspects magic bytes to determine the format:\n     * - `%PDF` \u2192 PDF\n     * - `PK\\x03\\x04` (ZIP) \u2192 inspects ZIP entries for `word/` (DOCX), `ppt/` (PPTX), or `xl/` (XLSX)\n     * - Image magic bytes (JPEG, PNG, GIF, BMP, TIFF, WebP) \u2192 Image\n     *\n     * # Arguments\n     * * `bytes` - Raw file data\n     *\n     * # Returns\n     * A unique document ID that can be used to reference this document.\n     * @param {Uint8Array} bytes\n     * @returns {string}\n     */\n    load(bytes) {\n      let deferred3_0;\n      let deferred3_1;\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_load(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        var ptr2 = r0;\n        var len2 = r1;\n        if (r3) {\n          ptr2 = 0;\n          len2 = 0;\n          throw takeObject(r2);\n        }\n        deferred3_0 = ptr2;\n        deferred3_1 = len2;\n        return getStringFromWasm0(ptr2, len2);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);\n      }\n    }\n    /**\n     * Check whether the GPU render backend is available.\n     * @returns {boolean}\n     */\n    has_gpu() {\n      const ret = wasm.wasm_has_gpu(this.__wbg_ptr);\n      return ret !== 0;\n    }\n    /**\n     * Initialize the GPU render backend (Vello + WebGPU).\n     *\n     * This is async because wgpu device initialization requires yielding\n     * to the browser event loop. Call this once after construction.\n     * Returns `true` if GPU initialization succeeded, `false` if no\n     * WebGPU adapter is available (the CPU backend remains usable).\n     * @returns {Promise<boolean>}\n     */\n    init_gpu() {\n      const ret = wasm.wasm_init_gpu(this.__wbg_ptr);\n      return takeObject(ret);\n    }\n    /**\n     * Load a PDF document and return its ID.\n     *\n     * # Arguments\n     * * `bytes` - Raw PDF file data\n     *\n     * # Returns\n     * A unique document ID that can be used to reference this document.\n     * @param {Uint8Array} bytes\n     * @returns {string}\n     */\n    load_pdf(bytes) {\n      let deferred3_0;\n      let deferred3_1;\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_load_pdf(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        var ptr2 = r0;\n        var len2 = r1;\n        if (r3) {\n          ptr2 = 0;\n          len2 = 0;\n          throw takeObject(r2);\n        }\n        deferred3_0 = ptr2;\n        deferred3_1 = len2;\n        return getStringFromWasm0(ptr2, len2);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);\n      }\n    }\n    /**\n     * Get the raw file bytes of a document.\n     *\n     * Returns the original file data for the document.\n     * @param {string} id\n     * @returns {Uint8Array}\n     */\n    get_bytes(id) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_get_bytes(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        if (r3) {\n          throw takeObject(r2);\n        }\n        var v2 = getArrayU8FromWasm0(r0, r1).slice();\n        wasm.__wbindgen_export4(r0, r1 * 1, 1);\n        return v2;\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n    /**\n     * Get a numeric limit from the current license.\n     *\n     * Returns the limit value if set in the license, otherwise returns the default.\n     * @param {string} limit_name\n     * @param {bigint} _default\n     * @returns {bigint}\n     */\n    get_limit(limit_name, _default) {\n      const ptr0 = passStringToWasm0(limit_name, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len0 = WASM_VECTOR_LEN;\n      const ret = wasm.wasm_get_limit(this.__wbg_ptr, ptr0, len0, _default);\n      return BigInt.asUintN(64, ret);\n    }\n    /**\n     * Load a DOCX document and return its ID.\n     *\n     * # Arguments\n     * * `bytes` - Raw DOCX file data\n     *\n     * # Returns\n     * A unique document ID that can be used to reference this document.\n     * @param {Uint8Array} bytes\n     * @returns {string}\n     */\n    load_docx(bytes) {\n      let deferred3_0;\n      let deferred3_1;\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_load_docx(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        var ptr2 = r0;\n        var len2 = r1;\n        if (r3) {\n          ptr2 = 0;\n          len2 = 0;\n          throw takeObject(r2);\n        }\n        deferred3_0 = ptr2;\n        deferred3_1 = len2;\n        return getStringFromWasm0(ptr2, len2);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);\n      }\n    }\n    /**\n     * Load a PPTX (PowerPoint) document and return its ID.\n     *\n     * # Arguments\n     * * `bytes` - Raw PPTX file data\n     *\n     * # Returns\n     * A unique document ID that can be used to reference this document.\n     * @param {Uint8Array} bytes\n     * @returns {string}\n     */\n    load_pptx(bytes) {\n      let deferred3_0;\n      let deferred3_1;\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_load_pptx(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        var ptr2 = r0;\n        var len2 = r1;\n        if (r3) {\n          ptr2 = 0;\n          len2 = 0;\n          throw takeObject(r2);\n        }\n        deferred3_0 = ptr2;\n        deferred3_1 = len2;\n        return getStringFromWasm0(ptr2, len2);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);\n      }\n    }\n    /**\n     * Load an XLSX document and return its ID.\n     *\n     * # Arguments\n     * * `bytes` - Raw XLSX file data\n     *\n     * # Returns\n     * A unique document ID that can be used to reference this document.\n     * @param {Uint8Array} bytes\n     * @returns {string}\n     */\n    load_xlsx(bytes) {\n      let deferred3_0;\n      let deferred3_1;\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_load_xlsx(retptr, this.__wbg_ptr, ptr0, len0);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);\n        var ptr2 = r0;\n        var len2 = r1;\n        if (r3) {\n          ptr2 = 0;\n          len2 = 0;\n          throw takeObject(r2);\n        }\n        deferred3_0 = ptr2;\n        deferred3_1 = len2;\n        return getStringFromWasm0(ptr2, len2);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);\n      }\n    }\n    /**\n     * Get info for a specific page.\n     * @param {string} id\n     * @param {number} page_index\n     * @returns {JsPageInfo}\n     */\n    page_info(id, page_index) {\n      try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.wasm_page_info(retptr, this.__wbg_ptr, ptr0, len0, page_index);\n        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n        if (r2) {\n          throw takeObject(r1);\n        }\n        return takeObject(r0);\n      } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n      }\n    }\n  };\n  if (Symbol.dispose) Wasm.prototype[Symbol.dispose] = Wasm.prototype.free;\n  function parseFontInfo(data) {\n    try {\n      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n      const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export);\n      const len0 = WASM_VECTOR_LEN;\n      wasm.parseFontInfo(retptr, ptr0, len0);\n      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);\n      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);\n      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);\n      if (r2) {\n        throw takeObject(r1);\n      }\n      return takeObject(r0);\n    } finally {\n      wasm.__wbindgen_add_to_stack_pointer(16);\n    }\n  }\n  var EXPECTED_RESPONSE_TYPES = /* @__PURE__ */ new Set(["basic", "cors", "default"]);\n  async function __wbg_load(module2, imports) {\n    if (typeof Response === "function" && module2 instanceof Response) {\n      if (typeof WebAssembly.instantiateStreaming === "function") {\n        try {\n          return await WebAssembly.instantiateStreaming(module2, imports);\n        } catch (e) {\n          const validResponse = module2.ok && EXPECTED_RESPONSE_TYPES.has(module2.type);\n          if (validResponse && module2.headers.get("Content-Type") !== "application/wasm") {\n            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\\n", e);\n          } else {\n            throw e;\n          }\n        }\n      }\n      const bytes = await module2.arrayBuffer();\n      return await WebAssembly.instantiate(bytes, imports);\n    } else {\n      const instance = await WebAssembly.instantiate(module2, imports);\n      if (instance instanceof WebAssembly.Instance) {\n        return { instance, module: module2 };\n      } else {\n        return instance;\n      }\n    }\n  }\n  function __wbg_get_imports() {\n    const imports = {};\n    imports.wbg = {};\n    imports.wbg.__wbg_Error_52673b7de5a0ca89 = function(arg0, arg1) {\n      const ret = Error(getStringFromWasm0(arg0, arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_Number_2d1dcfcf4ec51736 = function(arg0) {\n      const ret = Number(getObject(arg0));\n      return ret;\n    };\n    imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {\n      const ret = String(getObject(arg1));\n      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len1 = WASM_VECTOR_LEN;\n      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);\n      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);\n    };\n    imports.wbg.__wbg_Window_a4c5a48392f234ba = function(arg0) {\n      const ret = getObject(arg0).Window;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_WorkerGlobalScope_2b2b89e1ac952b50 = function(arg0) {\n      const ret = getObject(arg0).WorkerGlobalScope;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg___wbindgen_bigint_get_as_i64_6e32f5e6aff02e1d = function(arg0, arg1) {\n      const v = getObject(arg1);\n      const ret = typeof v === "bigint" ? v : void 0;\n      getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);\n      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);\n    };\n    imports.wbg.__wbg___wbindgen_boolean_get_dea25b33882b895b = function(arg0) {\n      const v = getObject(arg0);\n      const ret = typeof v === "boolean" ? v : void 0;\n      return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;\n    };\n    imports.wbg.__wbg___wbindgen_debug_string_adfb662ae34724b6 = function(arg0, arg1) {\n      const ret = debugString(getObject(arg1));\n      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len1 = WASM_VECTOR_LEN;\n      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);\n      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);\n    };\n    imports.wbg.__wbg___wbindgen_in_0d3e1e8f0c669317 = function(arg0, arg1) {\n      const ret = getObject(arg0) in getObject(arg1);\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_is_bigint_0e1a2e3f55cfae27 = function(arg0) {\n      const ret = typeof getObject(arg0) === "bigint";\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_is_function_8d400b8b1af978cd = function(arg0) {\n      const ret = typeof getObject(arg0) === "function";\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_is_null_dfda7d66506c95b5 = function(arg0) {\n      const ret = getObject(arg0) === null;\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_is_object_ce774f3490692386 = function(arg0) {\n      const val = getObject(arg0);\n      const ret = typeof val === "object" && val !== null;\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_is_string_704ef9c8fc131030 = function(arg0) {\n      const ret = typeof getObject(arg0) === "string";\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_is_undefined_f6b95eab589e0269 = function(arg0) {\n      const ret = getObject(arg0) === void 0;\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_jsval_eq_b6101cc9cef1fe36 = function(arg0, arg1) {\n      const ret = getObject(arg0) === getObject(arg1);\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_jsval_loose_eq_766057600fdd1b0d = function(arg0, arg1) {\n      const ret = getObject(arg0) == getObject(arg1);\n      return ret;\n    };\n    imports.wbg.__wbg___wbindgen_number_get_9619185a74197f95 = function(arg0, arg1) {\n      const obj = getObject(arg1);\n      const ret = typeof obj === "number" ? obj : void 0;\n      getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);\n      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);\n    };\n    imports.wbg.__wbg___wbindgen_string_get_a2a31e16edf96e42 = function(arg0, arg1) {\n      const obj = getObject(arg1);\n      const ret = typeof obj === "string" ? obj : void 0;\n      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      var len1 = WASM_VECTOR_LEN;\n      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);\n      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);\n    };\n    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {\n      throw new Error(getStringFromWasm0(arg0, arg1));\n    };\n    imports.wbg.__wbg__wbg_cb_unref_87dfb5aaa0cbcea7 = function(arg0) {\n      getObject(arg0)._wbg_cb_unref();\n    };\n    imports.wbg.__wbg_beginComputePass_304dccb30a4db2cc = function(arg0, arg1) {\n      const ret = getObject(arg0).beginComputePass(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_buffer_6cb2fecb1f253d71 = function(arg0) {\n      const ret = getObject(arg0).buffer;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_call_3020136f7a2d6e44 = function() {\n      return handleError(function(arg0, arg1, arg2) {\n        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_call_abb4ff46ce38be40 = function() {\n      return handleError(function(arg0, arg1) {\n        const ret = getObject(arg0).call(getObject(arg1));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_call_c8baa5c5e72d274e = function() {\n      return handleError(function(arg0, arg1, arg2, arg3) {\n        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_clearBuffer_b7d0381b50c8f5bb = function(arg0, arg1, arg2, arg3) {\n      getObject(arg0).clearBuffer(getObject(arg1), arg2, arg3);\n    };\n    imports.wbg.__wbg_clearBuffer_e3fa352fcc8ecc67 = function(arg0, arg1, arg2) {\n      getObject(arg0).clearBuffer(getObject(arg1), arg2);\n    };\n    imports.wbg.__wbg_copyBufferToBuffer_38cb6919320bd451 = function() {\n      return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5) {\n        getObject(arg0).copyBufferToBuffer(getObject(arg1), arg2, getObject(arg3), arg4, arg5);\n      }, arguments);\n    };\n    imports.wbg.__wbg_copyBufferToBuffer_8db6b1d1ef2bcea4 = function() {\n      return handleError(function(arg0, arg1, arg2, arg3, arg4) {\n        getObject(arg0).copyBufferToBuffer(getObject(arg1), arg2, getObject(arg3), arg4);\n      }, arguments);\n    };\n    imports.wbg.__wbg_copyTextureToBuffer_21b9dc9b4d87baf0 = function() {\n      return handleError(function(arg0, arg1, arg2, arg3) {\n        getObject(arg0).copyTextureToBuffer(getObject(arg1), getObject(arg2), getObject(arg3));\n      }, arguments);\n    };\n    imports.wbg.__wbg_copyTextureToTexture_0eb51a215ab2cc31 = function() {\n      return handleError(function(arg0, arg1, arg2, arg3) {\n        getObject(arg0).copyTextureToTexture(getObject(arg1), getObject(arg2), getObject(arg3));\n      }, arguments);\n    };\n    imports.wbg.__wbg_createBindGroupLayout_3fb59c14aed4b64e = function() {\n      return handleError(function(arg0, arg1) {\n        const ret = getObject(arg0).createBindGroupLayout(getObject(arg1));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_createBindGroup_03f26b8770895116 = function(arg0, arg1) {\n      const ret = getObject(arg0).createBindGroup(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_createBuffer_76f7598789ecc3d7 = function() {\n      return handleError(function(arg0, arg1) {\n        const ret = getObject(arg0).createBuffer(getObject(arg1));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_createCommandEncoder_f8056019328bd192 = function(arg0, arg1) {\n      const ret = getObject(arg0).createCommandEncoder(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_createComputePipeline_e6192c920efba35b = function(arg0, arg1) {\n      const ret = getObject(arg0).createComputePipeline(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_createPipelineLayout_5039b0679b6b7f36 = function(arg0, arg1) {\n      const ret = getObject(arg0).createPipelineLayout(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_createShaderModule_3facfe98356b79a9 = function(arg0, arg1) {\n      const ret = getObject(arg0).createShaderModule(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_createTexture_49002c91188f6137 = function() {\n      return handleError(function(arg0, arg1) {\n        const ret = getObject(arg0).createTexture(getObject(arg1));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_createView_0ce5c82d78f482df = function() {\n      return handleError(function(arg0, arg1) {\n        const ret = getObject(arg0).createView(getObject(arg1));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_crypto_574e78ad8b13b65f = function(arg0) {\n      const ret = getObject(arg0).crypto;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_debug_9d0c87ddda3dc485 = function(arg0) {\n      console.debug(getObject(arg0));\n    };\n    imports.wbg.__wbg_dispatchWorkgroupsIndirect_6594fbc416b287d6 = function(arg0, arg1, arg2) {\n      getObject(arg0).dispatchWorkgroupsIndirect(getObject(arg1), arg2);\n    };\n    imports.wbg.__wbg_dispatchWorkgroups_4e59e078119b5bab = function(arg0, arg1, arg2, arg3) {\n      getObject(arg0).dispatchWorkgroups(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);\n    };\n    imports.wbg.__wbg_done_62ea16af4ce34b24 = function(arg0) {\n      const ret = getObject(arg0).done;\n      return ret;\n    };\n    imports.wbg.__wbg_end_ece2bf3a25678f12 = function(arg0) {\n      getObject(arg0).end();\n    };\n    imports.wbg.__wbg_entries_83c79938054e065f = function(arg0) {\n      const ret = Object.entries(getObject(arg0));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {\n      let deferred0_0;\n      let deferred0_1;\n      try {\n        deferred0_0 = arg0;\n        deferred0_1 = arg1;\n        console.error(getStringFromWasm0(arg0, arg1));\n      } finally {\n        wasm.__wbindgen_export4(deferred0_0, deferred0_1, 1);\n      }\n    };\n    imports.wbg.__wbg_error_7bc7d576a6aaf855 = function(arg0) {\n      console.error(getObject(arg0));\n    };\n    imports.wbg.__wbg_fetch_cd0acd3c15ec5b5d = function(arg0) {\n      const ret = fetch(getObject(arg0));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_finish_17a0b297901010d5 = function(arg0) {\n      const ret = getObject(arg0).finish();\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_finish_ab9e01a922269f3a = function(arg0, arg1) {\n      const ret = getObject(arg0).finish(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_getDate_b8071ea9fc4f6838 = function(arg0) {\n      const ret = getObject(arg0).getDate();\n      return ret;\n    };\n    imports.wbg.__wbg_getFullYear_6ac412e8eee86879 = function(arg0) {\n      const ret = getObject(arg0).getFullYear();\n      return ret;\n    };\n    imports.wbg.__wbg_getHours_52eb417ad6e924e8 = function(arg0) {\n      const ret = getObject(arg0).getHours();\n      return ret;\n    };\n    imports.wbg.__wbg_getMappedRange_1229810ff58e27ce = function() {\n      return handleError(function(arg0, arg1, arg2) {\n        const ret = getObject(arg0).getMappedRange(arg1, arg2);\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_getMinutes_4097cef8e08622f9 = function(arg0) {\n      const ret = getObject(arg0).getMinutes();\n      return ret;\n    };\n    imports.wbg.__wbg_getMonth_48a392071f9e5017 = function(arg0) {\n      const ret = getObject(arg0).getMonth();\n      return ret;\n    };\n    imports.wbg.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() {\n      return handleError(function(arg0, arg1) {\n        getObject(arg0).getRandomValues(getObject(arg1));\n      }, arguments);\n    };\n    imports.wbg.__wbg_getSeconds_d94762aec8103802 = function(arg0) {\n      const ret = getObject(arg0).getSeconds();\n      return ret;\n    };\n    imports.wbg.__wbg_get_6b7bd52aca3f9671 = function(arg0, arg1) {\n      const ret = getObject(arg0)[arg1 >>> 0];\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_get_af9dab7e9603ea93 = function() {\n      return handleError(function(arg0, arg1) {\n        const ret = Reflect.get(getObject(arg0), getObject(arg1));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_get_with_ref_key_1dc361bd10053bfe = function(arg0, arg1) {\n      const ret = getObject(arg0)[getObject(arg1)];\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_gpu_a6bce2913fb8f574 = function(arg0) {\n      const ret = getObject(arg0).gpu;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_info_ce6bcc489c22f6f0 = function(arg0) {\n      console.info(getObject(arg0));\n    };\n    imports.wbg.__wbg_instanceof_ArrayBuffer_f3320d2419cd0355 = function(arg0) {\n      let result;\n      try {\n        result = getObject(arg0) instanceof ArrayBuffer;\n      } catch (_) {\n        result = false;\n      }\n      const ret = result;\n      return ret;\n    };\n    imports.wbg.__wbg_instanceof_GpuAdapter_fb230cdccb184887 = function(arg0) {\n      let result;\n      try {\n        result = getObject(arg0) instanceof GPUAdapter;\n      } catch (_) {\n        result = false;\n      }\n      const ret = result;\n      return ret;\n    };\n    imports.wbg.__wbg_instanceof_Map_084be8da74364158 = function(arg0) {\n      let result;\n      try {\n        result = getObject(arg0) instanceof Map;\n      } catch (_) {\n        result = false;\n      }\n      const ret = result;\n      return ret;\n    };\n    imports.wbg.__wbg_instanceof_Uint8Array_da54ccc9d3e09434 = function(arg0) {\n      let result;\n      try {\n        result = getObject(arg0) instanceof Uint8Array;\n      } catch (_) {\n        result = false;\n      }\n      const ret = result;\n      return ret;\n    };\n    imports.wbg.__wbg_isArray_51fd9e6422c0a395 = function(arg0) {\n      const ret = Array.isArray(getObject(arg0));\n      return ret;\n    };\n    imports.wbg.__wbg_isSafeInteger_ae7d3f054d55fa16 = function(arg0) {\n      const ret = Number.isSafeInteger(getObject(arg0));\n      return ret;\n    };\n    imports.wbg.__wbg_iterator_27b7c8b35ab3e86b = function() {\n      const ret = Symbol.iterator;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_label_cda985b32d44cee0 = function(arg0, arg1) {\n      const ret = getObject(arg1).label;\n      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len1 = WASM_VECTOR_LEN;\n      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);\n      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);\n    };\n    imports.wbg.__wbg_length_22ac23eaec9d8053 = function(arg0) {\n      const ret = getObject(arg0).length;\n      return ret;\n    };\n    imports.wbg.__wbg_length_d45040a40c570362 = function(arg0) {\n      const ret = getObject(arg0).length;\n      return ret;\n    };\n    imports.wbg.__wbg_log_1d990106d99dacb7 = function(arg0) {\n      console.log(getObject(arg0));\n    };\n    imports.wbg.__wbg_mapAsync_4a34082bad283ccf = function(arg0, arg1, arg2, arg3) {\n      const ret = getObject(arg0).mapAsync(arg1 >>> 0, arg2, arg3);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_msCrypto_a61aeb35a24c1329 = function(arg0) {\n      const ret = getObject(arg0).msCrypto;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_navigator_11b7299bb7886507 = function(arg0) {\n      const ret = getObject(arg0).navigator;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_navigator_b49edef831236138 = function(arg0) {\n      const ret = getObject(arg0).navigator;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_0_23cedd11d9b40c9d = function() {\n      const ret = /* @__PURE__ */ new Date();\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_1ba21ce319a06297 = function() {\n      const ret = new Object();\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_25f239778d6112b9 = function() {\n      const ret = new Array();\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_3c79b3bb1b32b7d3 = function() {\n      return handleError(function() {\n        const ret = new Headers();\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_new_4fe05c96062a8385 = function() {\n      return handleError(function() {\n        const ret = new XMLHttpRequest();\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_new_6421f6084cc5bc5a = function(arg0) {\n      const ret = new Uint8Array(getObject(arg0));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {\n      const ret = new Error();\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_b546ae120718850e = function() {\n      const ret = /* @__PURE__ */ new Map();\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_ff12d2b041fb48f1 = function(arg0, arg1) {\n      try {\n        var state0 = { a: arg0, b: arg1 };\n        var cb0 = (arg02, arg12) => {\n          const a = state0.a;\n          state0.a = 0;\n          try {\n            return __wasm_bindgen_func_elem_22595(a, state0.b, arg02, arg12);\n          } finally {\n            state0.a = a;\n          }\n        };\n        const ret = new Promise(cb0);\n        return addHeapObject(ret);\n      } finally {\n        state0.a = state0.b = 0;\n      }\n    };\n    imports.wbg.__wbg_new_from_slice_f9c22b9153b26992 = function(arg0, arg1) {\n      const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_no_args_cb138f77cf6151ee = function(arg0, arg1) {\n      const ret = new Function(getStringFromWasm0(arg0, arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_with_byte_offset_and_length_d85c3da1fd8df149 = function(arg0, arg1, arg2) {\n      const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_with_length_aa5eaf41d35235e5 = function(arg0) {\n      const ret = new Uint8Array(arg0 >>> 0);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_with_str_and_init_c5748f76f5108934 = function() {\n      return handleError(function(arg0, arg1, arg2) {\n        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_next_138a17bbf04e926c = function(arg0) {\n      const ret = getObject(arg0).next;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_next_3cfe5c0fe2a4cc53 = function() {\n      return handleError(function(arg0) {\n        const ret = getObject(arg0).next();\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_node_905d3e251edff8a2 = function(arg0) {\n      const ret = getObject(arg0).node;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_now_69d776cd24f5215b = function() {\n      const ret = Date.now();\n      return ret;\n    };\n    imports.wbg.__wbg_open_bfb661c1c2740586 = function() {\n      return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5) {\n        getObject(arg0).open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4), arg5 !== 0);\n      }, arguments);\n    };\n    imports.wbg.__wbg_process_dc0fbacc7c1c06f7 = function(arg0) {\n      const ret = getObject(arg0).process;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_prototypesetcall_dfe9b766cdc1f1fd = function(arg0, arg1, arg2) {\n      Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2));\n    };\n    imports.wbg.__wbg_push_7d9be8f38fc13975 = function(arg0, arg1) {\n      const ret = getObject(arg0).push(getObject(arg1));\n      return ret;\n    };\n    imports.wbg.__wbg_queueMicrotask_9b549dfce8865860 = function(arg0) {\n      const ret = getObject(arg0).queueMicrotask;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_queueMicrotask_fca69f5bfad613a5 = function(arg0) {\n      queueMicrotask(getObject(arg0));\n    };\n    imports.wbg.__wbg_queue_39d4f3bda761adef = function(arg0) {\n      const ret = getObject(arg0).queue;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_randomFillSync_ac0988aba3254290 = function() {\n      return handleError(function(arg0, arg1) {\n        getObject(arg0).randomFillSync(takeObject(arg1));\n      }, arguments);\n    };\n    imports.wbg.__wbg_requestAdapter_55d15e6d14e8392c = function(arg0, arg1) {\n      const ret = getObject(arg0).requestAdapter(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_requestDevice_66e864eaf1ffbb38 = function(arg0, arg1) {\n      const ret = getObject(arg0).requestDevice(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_require_60cc747a6bc5215a = function() {\n      return handleError(function() {\n        const ret = module.require;\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_resolve_fd5bfbaa4ce36e1e = function(arg0) {\n      const ret = Promise.resolve(getObject(arg0));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_responseText_7a33f62863958740 = function() {\n      return handleError(function(arg0, arg1) {\n        const ret = getObject(arg1).responseText;\n        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n        var len1 = WASM_VECTOR_LEN;\n        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);\n        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);\n      }, arguments);\n    };\n    imports.wbg.__wbg_response_19d1d96c8fc76878 = function() {\n      return handleError(function(arg0) {\n        const ret = getObject(arg0).response;\n        return addHeapObject(ret);\n      }, arguments);\n    };\n    imports.wbg.__wbg_send_3accfe4b9b207011 = function() {\n      return handleError(function(arg0) {\n        getObject(arg0).send();\n      }, arguments);\n    };\n    imports.wbg.__wbg_setBindGroup_250647fe6341e1db = function() {\n      return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {\n        getObject(arg0).setBindGroup(arg1 >>> 0, getObject(arg2), getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);\n      }, arguments);\n    };\n    imports.wbg.__wbg_setBindGroup_92f5fbfaea0311a0 = function(arg0, arg1, arg2) {\n      getObject(arg0).setBindGroup(arg1 >>> 0, getObject(arg2));\n    };\n    imports.wbg.__wbg_setPipeline_95448e1c3bb1e875 = function(arg0, arg1) {\n      getObject(arg0).setPipeline(getObject(arg1));\n    };\n    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {\n      getObject(arg0)[takeObject(arg1)] = takeObject(arg2);\n    };\n    imports.wbg.__wbg_set_425eb8b710d5beee = function() {\n      return handleError(function(arg0, arg1, arg2, arg3, arg4) {\n        getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));\n      }, arguments);\n    };\n    imports.wbg.__wbg_set_781438a03c0c3c81 = function() {\n      return handleError(function(arg0, arg1, arg2) {\n        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));\n        return ret;\n      }, arguments);\n    };\n    imports.wbg.__wbg_set_7df433eea03a5c14 = function(arg0, arg1, arg2) {\n      getObject(arg0)[arg1 >>> 0] = takeObject(arg2);\n    };\n    imports.wbg.__wbg_set_access_c87a9bdb5c449e6b = function(arg0, arg1) {\n      getObject(arg0).access = __wbindgen_enum_GpuStorageTextureAccess[arg1];\n    };\n    imports.wbg.__wbg_set_array_layer_count_3a8ad1adab3aded1 = function(arg0, arg1) {\n      getObject(arg0).arrayLayerCount = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_aspect_4066a62e6528c589 = function(arg0, arg1) {\n      getObject(arg0).aspect = __wbindgen_enum_GpuTextureAspect[arg1];\n    };\n    imports.wbg.__wbg_set_base_array_layer_85c4780859e3e025 = function(arg0, arg1) {\n      getObject(arg0).baseArrayLayer = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_base_mip_level_f90525112a282a1d = function(arg0, arg1) {\n      getObject(arg0).baseMipLevel = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_bc3a432bdcd60886 = function(arg0, arg1, arg2) {\n      getObject(arg0).set(getObject(arg1), arg2 >>> 0);\n    };\n    imports.wbg.__wbg_set_beginning_of_pass_write_index_1175eec9e005d722 = function(arg0, arg1) {\n      getObject(arg0).beginningOfPassWriteIndex = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_bind_group_layouts_54f980eb55071c87 = function(arg0, arg1) {\n      getObject(arg0).bindGroupLayouts = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_binding_1ddbf5eebabdc48c = function(arg0, arg1) {\n      getObject(arg0).binding = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_binding_5ea4d52c77434dfa = function(arg0, arg1) {\n      getObject(arg0).binding = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_body_8e743242d6076a4f = function(arg0, arg1) {\n      getObject(arg0).body = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_buffer_2dac3e64a7099038 = function(arg0, arg1) {\n      getObject(arg0).buffer = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_buffer_489d923366e1f63a = function(arg0, arg1) {\n      getObject(arg0).buffer = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_buffer_a3a7f00fa797e1d1 = function(arg0, arg1) {\n      getObject(arg0).buffer = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_bytes_per_row_61fdc31fb1e978f4 = function(arg0, arg1) {\n      getObject(arg0).bytesPerRow = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_bytes_per_row_7eb4ea50ad336975 = function(arg0, arg1) {\n      getObject(arg0).bytesPerRow = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_code_e66de35c80aa100f = function(arg0, arg1, arg2) {\n      getObject(arg0).code = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_compute_7e84d836a17ec8dc = function(arg0, arg1) {\n      getObject(arg0).compute = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_depth_or_array_layers_57e35a31ded46b97 = function(arg0, arg1) {\n      getObject(arg0).depthOrArrayLayers = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_dimension_1e40af745768ac00 = function(arg0, arg1) {\n      getObject(arg0).dimension = __wbindgen_enum_GpuTextureDimension[arg1];\n    };\n    imports.wbg.__wbg_set_dimension_8523a7df804e7839 = function(arg0, arg1) {\n      getObject(arg0).dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];\n    };\n    imports.wbg.__wbg_set_efaaf145b9377369 = function(arg0, arg1, arg2) {\n      const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_set_end_of_pass_write_index_c9e77fba223f5e64 = function(arg0, arg1) {\n      getObject(arg0).endOfPassWriteIndex = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_entries_5ebe60dce5e74a0b = function(arg0, arg1) {\n      getObject(arg0).entries = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_entries_9e330e1730f04662 = function(arg0, arg1) {\n      getObject(arg0).entries = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_entry_point_0dd252068a92e7b1 = function(arg0, arg1, arg2) {\n      getObject(arg0).entryPoint = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_external_texture_c45a65eda8f1c7e7 = function(arg0, arg1) {\n      getObject(arg0).externalTexture = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_format_071b082598e71ae2 = function(arg0, arg1) {\n      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1];\n    };\n    imports.wbg.__wbg_set_format_45c59d08eefdcb12 = function(arg0, arg1) {\n      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1];\n    };\n    imports.wbg.__wbg_set_format_726ed8f81a287fdc = function(arg0, arg1) {\n      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1];\n    };\n    imports.wbg.__wbg_set_has_dynamic_offset_dcbae080558be467 = function(arg0, arg1) {\n      getObject(arg0).hasDynamicOffset = arg1 !== 0;\n    };\n    imports.wbg.__wbg_set_headers_5671cf088e114d2b = function(arg0, arg1) {\n      getObject(arg0).headers = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_height_28e79506f626af82 = function(arg0, arg1) {\n      getObject(arg0).height = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_label_03ef288b104476b5 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_1183ccaccddf4c32 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_3d8a20f328073061 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_491466139034563c = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_53b47ffdebccf638 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_7ffda3ed69c72b85 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_828e6fe16c83ad61 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_95bae3d54f33d3c6 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_a1c8caea9f6c17d7 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_a3e682ef8c10c947 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_c880c612e67bf9d9 = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_label_eb73d9dd282c005a = function(arg0, arg1, arg2) {\n      getObject(arg0).label = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_layout_934f9127172b906e = function(arg0, arg1) {\n      getObject(arg0).layout = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_layout_a9aebce493b15bfb = function(arg0, arg1) {\n      getObject(arg0).layout = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_mapped_at_creation_37dd8bbd1a910924 = function(arg0, arg1) {\n      getObject(arg0).mappedAtCreation = arg1 !== 0;\n    };\n    imports.wbg.__wbg_set_method_76c69e41b3570627 = function(arg0, arg1, arg2) {\n      getObject(arg0).method = getStringFromWasm0(arg1, arg2);\n    };\n    imports.wbg.__wbg_set_min_binding_size_f7d3351b78c71fbc = function(arg0, arg1) {\n      getObject(arg0).minBindingSize = arg1;\n    };\n    imports.wbg.__wbg_set_mip_level_4adfe9f0872d052d = function(arg0, arg1) {\n      getObject(arg0).mipLevel = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_mip_level_count_3368440f1c3c34b9 = function(arg0, arg1) {\n      getObject(arg0).mipLevelCount = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_mip_level_count_9de96fe0db85420d = function(arg0, arg1) {\n      getObject(arg0).mipLevelCount = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_module_0700e7e0b7b4f128 = function(arg0, arg1) {\n      getObject(arg0).module = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_multisampled_dc1cdd807d0170e1 = function(arg0, arg1) {\n      getObject(arg0).multisampled = arg1 !== 0;\n    };\n    imports.wbg.__wbg_set_offset_49dfc93674b6347b = function(arg0, arg1) {\n      getObject(arg0).offset = arg1;\n    };\n    imports.wbg.__wbg_set_offset_51eb43b37f1e9525 = function(arg0, arg1) {\n      getObject(arg0).offset = arg1;\n    };\n    imports.wbg.__wbg_set_offset_a90a41961b1df9b4 = function(arg0, arg1) {\n      getObject(arg0).offset = arg1;\n    };\n    imports.wbg.__wbg_set_origin_154a83d3703121d7 = function(arg0, arg1) {\n      getObject(arg0).origin = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_power_preference_229fffedb859fda8 = function(arg0, arg1) {\n      getObject(arg0).powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];\n    };\n    imports.wbg.__wbg_set_query_set_5d767886356c7b79 = function(arg0, arg1) {\n      getObject(arg0).querySet = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_required_features_8135f6ab89e06b58 = function(arg0, arg1) {\n      getObject(arg0).requiredFeatures = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_resource_97233a9ead07e4bc = function(arg0, arg1) {\n      getObject(arg0).resource = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_responseType_df7a5fa93f0dd4be = function(arg0, arg1) {\n      getObject(arg0).responseType = __wbindgen_enum_XmlHttpRequestResponseType[arg1];\n    };\n    imports.wbg.__wbg_set_rows_per_image_b2e56467282d270a = function(arg0, arg1) {\n      getObject(arg0).rowsPerImage = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_rows_per_image_ca194ae8c040a0d0 = function(arg0, arg1) {\n      getObject(arg0).rowsPerImage = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_sample_count_df26d31cf04a57d8 = function(arg0, arg1) {\n      getObject(arg0).sampleCount = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_sample_type_5671a405c6474494 = function(arg0, arg1) {\n      getObject(arg0).sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];\n    };\n    imports.wbg.__wbg_set_sampler_43a3dd77c3b0a5ba = function(arg0, arg1) {\n      getObject(arg0).sampler = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_size_1a3d1e3a2e547ec1 = function(arg0, arg1) {\n      getObject(arg0).size = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_size_a45dd219534f95ed = function(arg0, arg1) {\n      getObject(arg0).size = arg1;\n    };\n    imports.wbg.__wbg_set_size_e0576eacd9f11fed = function(arg0, arg1) {\n      getObject(arg0).size = arg1;\n    };\n    imports.wbg.__wbg_set_storage_texture_4853479f6eb61a57 = function(arg0, arg1) {\n      getObject(arg0).storageTexture = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_texture_5f219a723eb7db43 = function(arg0, arg1) {\n      getObject(arg0).texture = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_texture_84c4ac5434a9ddb5 = function(arg0, arg1) {\n      getObject(arg0).texture = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_timestamp_writes_db44391e390948e2 = function(arg0, arg1) {\n      getObject(arg0).timestampWrites = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_type_0a9fcee42b714ba8 = function(arg0, arg1) {\n      getObject(arg0).type = __wbindgen_enum_GpuBufferBindingType[arg1];\n    };\n    imports.wbg.__wbg_set_type_ba111b7f1813a222 = function(arg0, arg1) {\n      getObject(arg0).type = __wbindgen_enum_GpuSamplerBindingType[arg1];\n    };\n    imports.wbg.__wbg_set_usage_0f3970011718ab12 = function(arg0, arg1) {\n      getObject(arg0).usage = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_usage_49bed7c9b47e7849 = function(arg0, arg1) {\n      getObject(arg0).usage = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_usage_8a5ac4564d826d9d = function(arg0, arg1) {\n      getObject(arg0).usage = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_view_dimension_2e3a58d96671f97a = function(arg0, arg1) {\n      getObject(arg0).viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];\n    };\n    imports.wbg.__wbg_set_view_dimension_88c1a47ce71f7839 = function(arg0, arg1) {\n      getObject(arg0).viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];\n    };\n    imports.wbg.__wbg_set_view_formats_dbd4d0d50ed403ff = function(arg0, arg1) {\n      getObject(arg0).viewFormats = getObject(arg1);\n    };\n    imports.wbg.__wbg_set_visibility_f4f66940005e5c39 = function(arg0, arg1) {\n      getObject(arg0).visibility = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_width_64c5783b064042bc = function(arg0, arg1) {\n      getObject(arg0).width = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_x_d5236bf9391eb053 = function(arg0, arg1) {\n      getObject(arg0).x = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_y_413262ade3cc0d56 = function(arg0, arg1) {\n      getObject(arg0).y = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_set_z_a136ba9bd16085f0 = function(arg0, arg1) {\n      getObject(arg0).z = arg1 >>> 0;\n    };\n    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {\n      const ret = getObject(arg1).stack;\n      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);\n      const len1 = WASM_VECTOR_LEN;\n      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);\n      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);\n    };\n    imports.wbg.__wbg_static_accessor_GLOBAL_769e6b65d6557335 = function() {\n      const ret = typeof global === "undefined" ? null : global;\n      return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    };\n    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_60cf02db4de8e1c1 = function() {\n      const ret = typeof globalThis === "undefined" ? null : globalThis;\n      return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    };\n    imports.wbg.__wbg_static_accessor_SELF_08f5a74c69739274 = function() {\n      const ret = typeof self === "undefined" ? null : self;\n      return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    };\n    imports.wbg.__wbg_static_accessor_WINDOW_a8924b26aa92d024 = function() {\n      const ret = typeof window === "undefined" ? null : window;\n      return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    };\n    imports.wbg.__wbg_status_c547ab1614ba835e = function() {\n      return handleError(function(arg0) {\n        const ret = getObject(arg0).status;\n        return ret;\n      }, arguments);\n    };\n    imports.wbg.__wbg_subarray_845f2f5bce7d061a = function(arg0, arg1, arg2) {\n      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_submit_068b03683463d934 = function(arg0, arg1) {\n      getObject(arg0).submit(getObject(arg1));\n    };\n    imports.wbg.__wbg_then_429f7caf1026411d = function(arg0, arg1, arg2) {\n      const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_then_4f95312d68691235 = function(arg0, arg1) {\n      const ret = getObject(arg0).then(getObject(arg1));\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_toISOString_eca15cbe422eeea5 = function(arg0) {\n      const ret = getObject(arg0).toISOString();\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_value_57b7b035e117f7ee = function(arg0) {\n      const ret = getObject(arg0).value;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_versions_c01dfd4722a88165 = function(arg0) {\n      const ret = getObject(arg0).versions;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_warn_6e567d0d926ff881 = function(arg0) {\n      console.warn(getObject(arg0));\n    };\n    imports.wbg.__wbg_writeBuffer_b479dd5b90cd43eb = function() {\n      return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5) {\n        getObject(arg0).writeBuffer(getObject(arg1), arg2, getObject(arg3), arg4, arg5);\n      }, arguments);\n    };\n    imports.wbg.__wbg_writeTexture_c70826cc2ae8e127 = function() {\n      return handleError(function(arg0, arg1, arg2, arg3, arg4) {\n        getObject(arg0).writeTexture(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4));\n      }, arguments);\n    };\n    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {\n      const ret = getStringFromWasm0(arg0, arg1);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_cast_4625c577ab2ec9ee = function(arg0) {\n      const ret = BigInt.asUintN(64, arg0);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_cast_77bc3e92745e9a35 = function(arg0, arg1) {\n      var v0 = getArrayU8FromWasm0(arg0, arg1).slice();\n      wasm.__wbindgen_export4(arg0, arg1 * 1, 1);\n      const ret = v0;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_cast_9ae0607507abb057 = function(arg0) {\n      const ret = arg0;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_cast_cb9088102bce6b30 = function(arg0, arg1) {\n      const ret = getArrayU8FromWasm0(arg0, arg1);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(arg0) {\n      const ret = arg0;\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_cast_e9aaf3c74dd8443a = function(arg0, arg1) {\n      const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_4179, __wasm_bindgen_func_elem_4195);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {\n      const ret = getObject(arg0);\n      return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {\n      takeObject(arg0);\n    };\n    return imports;\n  }\n  function __wbg_finalize_init(instance, module2) {\n    wasm = instance.exports;\n    __wbg_init.__wbindgen_wasm_module = module2;\n    cachedDataViewMemory0 = null;\n    cachedUint32ArrayMemory0 = null;\n    cachedUint8ArrayMemory0 = null;\n    return wasm;\n  }\n  async function __wbg_init(module_or_path) {\n    if (wasm !== void 0) return wasm;\n    if (typeof module_or_path !== "undefined") {\n      if (Object.getPrototypeOf(module_or_path) === Object.prototype) {\n        ({ module_or_path } = module_or_path);\n      } else {\n        console.warn("using deprecated parameters for the initialization function; pass a single object instead");\n      }\n    }\n    if (typeof module_or_path === "undefined") {\n      module_or_path = new URL("udoc_bg.wasm", "about:blank");\n    }\n    const imports = __wbg_get_imports();\n    if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {\n      module_or_path = fetch(module_or_path);\n    }\n    const { instance, module: module2 } = await __wbg_load(await module_or_path, imports);\n    return __wbg_finalize_init(instance, module2);\n  }\n  var udoc_default = __wbg_init;\n\n  // dist/src/worker/worker.js\n  var wasm2 = null;\n  var wasmMemory = null;\n  var gpuAvailable = false;\n  var currentRequestId;\n  var processing = false;\n  var messageQueue = [];\n  self.onmessage = (event) => {\n    messageQueue.push(event);\n    if (!processing) {\n      processQueue();\n    }\n  };\n  async function processQueue() {\n    processing = true;\n    while (messageQueue.length > 0) {\n      const event = messageQueue.shift();\n      await handleMessage(event);\n    }\n    processing = false;\n  }\n  async function handleMessage(event) {\n    const { _id, ...request } = event.data;\n    currentRequestId = _id;\n    try {\n      switch (request.type) {\n        case "init": {\n          const exports = await udoc_default(request.wasmUrl ? { module_or_path: request.wasmUrl } : void 0);\n          wasmMemory = exports.memory ?? null;\n          wasm2 = new Wasm(request.domain, request.viewerVersion);\n          if (request.gpu) {\n            try {\n              gpuAvailable = await wasm2.init_gpu();\n            } catch {\n              gpuAvailable = false;\n            }\n          }\n          respond({ type: "init", success: true });\n          break;\n        }\n        case "setupTelemetry": {\n          ensureInitialized();\n          wasm2.setup_telemetry(request.distinctId);\n          respond({ type: "setupTelemetry", success: true });\n          break;\n        }\n        case "disableTelemetry": {\n          ensureInitialized();\n          const disabled = wasm2.disable_telemetry();\n          respond({ type: "disableTelemetry", success: true, disabled });\n          break;\n        }\n        case "setLicense": {\n          ensureInitialized();\n          const result = wasm2.set_license(request.license);\n          respond({ type: "setLicense", success: true, result });\n          break;\n        }\n        case "getLicenseStatus": {\n          ensureInitialized();\n          const result = wasm2.license_status();\n          respond({ type: "getLicenseStatus", success: true, result });\n          break;\n        }\n        case "load": {\n          ensureInitialized();\n          const documentId = wasm2.load(request.bytes);\n          respond({ type: "load", success: true, documentId });\n          break;\n        }\n        case "getDocumentFormat": {\n          ensureInitialized();\n          const format = wasm2.document_format(request.documentId);\n          respond({ type: "getDocumentFormat", success: true, format });\n          break;\n        }\n        case "loadPdf": {\n          ensureInitialized();\n          const documentId = wasm2.load_pdf(request.bytes);\n          respond({ type: "loadPdf", success: true, documentId });\n          break;\n        }\n        case "loadImage": {\n          ensureInitialized();\n          const documentId = wasm2.load_image(request.bytes);\n          respond({ type: "loadImage", success: true, documentId });\n          break;\n        }\n        case "loadPptx": {\n          ensureInitialized();\n          const documentId = wasm2.load_pptx(request.bytes);\n          respond({ type: "loadPptx", success: true, documentId });\n          break;\n        }\n        case "loadDocx": {\n          ensureInitialized();\n          const documentId = wasm2.load_docx(request.bytes);\n          respond({ type: "loadDocx", success: true, documentId });\n          break;\n        }\n        case "loadXlsx": {\n          ensureInitialized();\n          const documentId = wasm2.load_xlsx(request.bytes);\n          respond({ type: "loadXlsx", success: true, documentId });\n          break;\n        }\n        case "unloadPdf": {\n          ensureInitialized();\n          const removed = wasm2.remove_document(request.documentId);\n          respond({ type: "unloadPdf", success: true, removed });\n          break;\n        }\n        case "needsPassword": {\n          ensureInitialized();\n          const needsPassword = wasm2.needs_password(request.documentId);\n          respond({ type: "needsPassword", success: true, needsPassword });\n          break;\n        }\n        case "authenticate": {\n          ensureInitialized();\n          const authenticated = wasm2.authenticate(request.documentId, request.password);\n          respond({ type: "authenticate", success: true, authenticated });\n          break;\n        }\n        case "getPageCount": {\n          ensureInitialized();\n          const pageCount = wasm2.page_count(request.documentId);\n          respond({ type: "getPageCount", success: true, pageCount });\n          break;\n        }\n        case "getPageInfo": {\n          ensureInitialized();\n          const info = wasm2.page_info(request.documentId, request.pageIndex);\n          respond({\n            type: "getPageInfo",\n            success: true,\n            width: info.width,\n            height: info.height,\n            rotation: info.rotation,\n            transition: info.transition\n          });\n          break;\n        }\n        case "getAllPageInfo": {\n          ensureInitialized();\n          const pages = wasm2.all_page_info(request.documentId);\n          respond({ type: "getAllPageInfo", success: true, pages });\n          break;\n        }\n        case "getPageGroups": {\n          ensureInitialized();\n          const groups = wasm2.page_groups(request.documentId);\n          respond({ type: "getPageGroups", success: true, groups });\n          break;\n        }\n        case "renderPage": {\n          ensureInitialized();\n          if (!wasm2.has_document(request.documentId)) {\n            respond({ type: "renderPage", success: false, error: `Document not found: ${request.documentId}` });\n            break;\n          }\n          let rgba;\n          if (gpuAvailable) {\n            const gpuResult = await wasm2.render_page_gpu(request.documentId, request.pageIndex, request.width, request.height);\n            rgba = new Uint8Array(gpuResult);\n          } else {\n            rgba = wasm2.render_page_to_rgba(request.documentId, request.pageIndex, request.width, request.height);\n          }\n          respond({ type: "renderPage", success: true, rgba, width: request.width, height: request.height }, [\n            rgba.buffer\n          ]);\n          break;\n        }\n        case "getOutline": {\n          ensureInitialized();\n          const outline = wasm2.get_outline(request.documentId);\n          respond({ type: "getOutline", success: true, outline });\n          break;\n        }\n        case "getPageAnnotations": {\n          ensureInitialized();\n          const annotations = wasm2.get_page_annotations(request.documentId, request.pageIndex);\n          respond({ type: "getPageAnnotations", success: true, annotations });\n          break;\n        }\n        case "getLayoutPage": {\n          ensureInitialized();\n          const layout = wasm2.get_layout_page(request.documentId, request.pageIndex);\n          respond({ type: "getLayoutPage", success: true, layout });\n          break;\n        }\n        case "getAllAnnotations": {\n          ensureInitialized();\n          const annotations = wasm2.get_all_annotations(request.documentId);\n          respond({ type: "getAllAnnotations", success: true, annotations });\n          break;\n        }\n        case "pdfCompose": {\n          ensureInitialized();\n          const documentIds = wasm2.pdf_compose(request.compositions.map((comp) => comp.map((pick) => ({ ...pick, rotation: pick.rotation ?? void 0 }))), request.docIds);\n          respond({ type: "pdfCompose", success: true, documentIds });\n          break;\n        }\n        case "getBytes": {\n          ensureInitialized();\n          const bytes = wasm2.get_bytes(request.documentId);\n          respond({ type: "getBytes", success: true, bytes }, [bytes.buffer]);\n          break;\n        }\n        case "pdfSplitByOutline": {\n          ensureInitialized();\n          const result = wasm2.pdf_split_by_outline(request.documentId, request.maxLevel, request.splitMidPage);\n          respond({ type: "pdfSplitByOutline", success: true, result });\n          break;\n        }\n        case "pdfExtractImages": {\n          ensureInitialized();\n          const rawImages = wasm2.pdf_extract_images(request.documentId, request.convertRawToPng);\n          const images = rawImages.map((img) => ({\n            ...img,\n            data: new Uint8Array(img.data)\n          }));\n          const transfers = images.map((img) => img.data.buffer);\n          respond({ type: "pdfExtractImages", success: true, images }, transfers);\n          break;\n        }\n        case "pdfExtractFonts": {\n          ensureInitialized();\n          const rawFonts = wasm2.pdf_extract_fonts(request.documentId);\n          const fonts = rawFonts.map((font) => ({\n            ...font,\n            data: new Uint8Array(font.data)\n          }));\n          const transfers = fonts.map((font) => font.data.buffer);\n          respond({ type: "pdfExtractFonts", success: true, fonts }, transfers);\n          break;\n        }\n        case "pdfCompress": {\n          ensureInitialized();\n          const compressedBytes = wasm2.pdf_compress(request.documentId);\n          respond({ type: "pdfCompress", success: true, bytes: compressedBytes }, [compressedBytes.buffer]);\n          break;\n        }\n        case "pdfDecompress": {\n          ensureInitialized();\n          const decompressedBytes = wasm2.pdf_decompress(request.documentId);\n          respond({ type: "pdfDecompress", success: true, bytes: decompressedBytes }, [decompressedBytes.buffer]);\n          break;\n        }\n        case "registerFonts": {\n          ensureInitialized();\n          wasm2.registerFonts(request.fonts);\n          respond({ type: "registerFonts", success: true });\n          break;\n        }\n        case "enableGoogleFonts": {\n          ensureInitialized();\n          wasm2.enableGoogleFonts();\n          respond({ type: "enableGoogleFonts", success: true });\n          break;\n        }\n        case "getVisibilityGroups": {\n          ensureInitialized();\n          const groups = wasm2.get_visibility_groups(request.documentId);\n          respond({ type: "getVisibilityGroups", success: true, groups });\n          break;\n        }\n        case "setVisibilityGroupVisible": {\n          ensureInitialized();\n          const updated = wasm2.set_visibility_group_visible(request.documentId, request.groupId, request.visible);\n          respond({ type: "setVisibilityGroupVisible", success: true, updated });\n          break;\n        }\n        case "parseFontInfo": {\n          ensureInitialized();\n          const info = parseFontInfo(request.data);\n          respond({ type: "parseFontInfo", success: true, info });\n          break;\n        }\n        case "getFontUsage": {\n          ensureInitialized();\n          const entries = wasm2.get_font_usage(request.documentId);\n          respond({ type: "getFontUsage", success: true, entries });\n          break;\n        }\n        case "pdfSaveAnnotations": {\n          ensureInitialized();\n          const bytes = wasm2.pdf_save_annotations(request.documentId, request.annotationsByPage);\n          respond({ type: "pdfSaveAnnotations", success: true, bytes }, [bytes.buffer]);\n          break;\n        }\n        case "getWasmMemoryBytes": {\n          respond({ type: "getWasmMemoryBytes", success: true, bytes: wasmMemory?.buffer.byteLength ?? 0 });\n          break;\n        }\n        default: {\n          const _exhaustive = request;\n          throw new Error(`Unknown request type: ${request.type}`);\n        }\n      }\n    } catch (error) {\n      const errorMessage = error instanceof Error ? error.message : String(error);\n      respond({ type: request.type, success: false, error: errorMessage });\n    }\n  }\n  function ensureInitialized() {\n    if (!wasm2) {\n      throw new Error("Worker not initialized. Call init first.");\n    }\n  }\n  function respond(response, transfer) {\n    const message = currentRequestId !== void 0 ? { ...response, _id: currentRequestId } : response;\n    if (transfer) {\n      self.postMessage(message, transfer);\n    } else {\n      self.postMessage(message);\n    }\n  }\n})();\n';

// node_modules/@docmentis/udoc-viewer/dist/src/worker/WorkerClient.js
function makeWorkKey(item) {
  if (item.kind === "render") {
    return `render:${makeRenderKey(item.docId, item.page, item.type, item.scale)}`;
  }
  if (item.kind === "fontUsageCheck") {
    return `fontUsageCheck:${item.docId}`;
  }
  return `${item.kind}:${item.docId}:${item.page}`;
}
function makeRenderKey(docId, page, type, scale) {
  return `${docId}:${page}:${type}:${scale.toFixed(4)}`;
}
function isOOMError(err) {
  if (!err)
    return false;
  if (err instanceof RangeError)
    return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /out of memory|allocation failed|memory access out of bounds|unreachable executed|RuntimeError/i.test(msg);
}
var WorkerClient = class _WorkerClient {
  worker;
  requestId = 0;
  pending = /* @__PURE__ */ new Map();
  // Render management state - separate caches for page, thumbnail, and preview; single queue
  pageRenderCache = /* @__PURE__ */ new Map();
  thumbnailRenderCache = /* @__PURE__ */ new Map();
  previewRenderCache = /* @__PURE__ */ new Map();
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
  renderInvalidatedCallbacks = /* @__PURE__ */ new Set();
  // Callbacks notified when an OOM error is detected during render
  oomCallbacks = /* @__PURE__ */ new Set();
  lastOOMClearAt = 0;
  // Font usage change detection
  fontUsageChangedCallbacks = /* @__PURE__ */ new Set();
  lastFontUsageLength = /* @__PURE__ */ new Map();
  // Performance counter per document (for tracking operations)
  performanceCounters = /* @__PURE__ */ new Map();
  // Page info cache per document (populated by getAllPageInfo, used by getPageInfo)
  pageInfoCache = /* @__PURE__ */ new Map();
  // Page group cache per document (populated by getPageGroups)
  pageGroupsCache = /* @__PURE__ */ new Map();
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
      const worker2 = new Worker(url);
      return new _WorkerClient(worker2);
    }
    const worker = new Worker(new URL("./worker.js", "about:blank"), { type: "module" });
    return new _WorkerClient(worker);
  }
  /**
   * Create a WorkerClient with a custom worker URL.
   * Use this when hosting worker files at a custom location.
   */
  static createWithUrl(workerUrl) {
    const worker = new Worker(workerUrl, { type: "module" });
    return new _WorkerClient(worker);
  }
  /**
   * Initialize the WASM module.
   */
  async init(wasmUrl2, gpu, domain, viewerVersion) {
    await this.send({ type: "init", wasmUrl: wasmUrl2, gpu, domain, viewerVersion });
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
    const response = await this.send({ type: "disableTelemetry" });
    return response.disabled;
  }
  /**
   * Set the license key.
   * @param license - The license key string
   * @param domain - The current domain (from window.location.hostname)
   * @returns License validation result
   */
  async setLicense(license, domain) {
    const response = await this.send({ type: "setLicense", license, domain });
    return response.result;
  }
  /**
   * Get current license status.
   */
  async getLicenseStatus() {
    const response = await this.send({ type: "getLicenseStatus" });
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
    const response = await this.send({
      type: "load",
      id: "",
      bytes
    });
    return response.documentId;
  }
  /**
   * Get the detected format of a loaded document.
   * @returns The format string: "pdf", "docx", "pptx", "xlsx", or "image".
   */
  async getDocumentFormat(documentId) {
    const response = await this.send({
      type: "getDocumentFormat",
      documentId
    });
    return response.format;
  }
  async loadPdf(bytes) {
    const response = await this.send({
      type: "loadPdf",
      id: "",
      // Not used, will be assigned by worker
      bytes
    });
    return response.documentId;
  }
  /**
   * Load an image file.
   * Supports various formats: JPEG, PNG, GIF, BMP, TIFF, WebP, etc.
   * Multi-page TIFF files will create a document with multiple pages.
   * @returns The document ID.
   */
  async loadImage(bytes) {
    const response = await this.send({
      type: "loadImage",
      id: "",
      // Not used, will be assigned by worker
      bytes
    });
    return response.documentId;
  }
  /**
   * Load a PPTX (PowerPoint) document.
   * @returns The document ID.
   */
  async loadPptx(bytes) {
    const response = await this.send({
      type: "loadPptx",
      id: "",
      // Not used, will be assigned by worker
      bytes
    });
    return response.documentId;
  }
  /**
   * Load a DOCX (Word) document.
   * @returns The document ID.
   */
  async loadDocx(bytes) {
    const response = await this.send({
      type: "loadDocx",
      id: "",
      // Not used, will be assigned by worker
      bytes
    });
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
    const response = await this.send({ type: "unloadPdf", documentId });
    return response.removed;
  }
  /**
   * Check if a document requires a password to open.
   * @returns True if the document needs authentication.
   */
  async needsPassword(documentId) {
    const response = await this.send({ type: "needsPassword", documentId });
    return response.needsPassword;
  }
  /**
   * Authenticate with a password to unlock an encrypted document.
   * @param documentId - The document ID
   * @param password - The password to try
   * @returns True if authentication succeeded, false if the password was incorrect.
   */
  async authenticate(documentId, password) {
    const response = await this.send({ type: "authenticate", documentId, password });
    return response.authenticated;
  }
  /**
   * Get the page count of a document.
   * Returns from cache if available.
   */
  async getPageCount(documentId) {
    const cached = this.pageInfoCache.get(documentId);
    if (cached) {
      return cached.length;
    }
    const counter = this.getCounter(documentId);
    const eventId = counter?.markStart("getPageCount");
    try {
      const response = await this.send({ type: "getPageCount", documentId });
      if (eventId)
        counter?.markEnd(eventId);
      return response.pageCount;
    } catch (error) {
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
    const cached = this.pageInfoCache.get(documentId);
    if (cached && pageIndex < cached.length) {
      return cached[pageIndex];
    }
    const counter = this.getCounter(documentId);
    const eventId = counter?.markStart("getPageInfo", { pageIndex });
    try {
      const response = await this.send({ type: "getPageInfo", documentId, pageIndex });
      if (eventId)
        counter?.markEnd(eventId);
      return {
        width: response.width,
        height: response.height,
        rotation: response.rotation ?? 0,
        transition: response.transition
      };
    } catch (error) {
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
    const cached = this.pageInfoCache.get(documentId);
    if (cached) {
      return cached;
    }
    const counter = this.getCounter(documentId);
    const eventId = counter?.markStart("getAllPageInfo");
    try {
      const response = await this.send({ type: "getAllPageInfo", documentId });
      if (eventId)
        counter?.markEnd(eventId);
      this.pageInfoCache.set(documentId, response.pages);
      return response.pages;
    } catch (error) {
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
    const response = await this.send({ type: "getPageGroups", documentId });
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
      const response = await this.send({ type: "getOutline", documentId });
      if (eventId)
        counter?.markEnd(eventId);
      return response.outline;
    } catch (error) {
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
      const response = await this.send({ type: "getFontUsage", documentId });
      if (eventId)
        counter?.markEnd(eventId);
      return response.entries;
    } catch (error) {
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
    const page = pageIndex + 1;
    const key = `annotation:${docId}:${page}`;
    if (this.currentWork?.key === key) {
      return this.currentWork.promise;
    }
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
        reject
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
    const page = pageIndex + 1;
    const key = `text:${docId}:${page}`;
    if (this.currentWork?.key === key) {
      return this.currentWork.promise;
    }
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
        reject
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
      const response = await this.send({ type: "getAllAnnotations", documentId });
      if (eventId)
        counter?.markEnd(eventId);
      return response.annotations;
    } catch (error) {
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
    const response = await this.send({ type: "pdfSaveAnnotations", documentId, annotationsByPage });
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
    const response = await this.send({ type: "pdfCompose", compositions, docIds });
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
    const response = await this.send({ type: "pdfSplitByOutline", documentId, maxLevel, splitMidPage });
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
    const response = await this.send({ type: "pdfExtractImages", documentId, convertRawToPng });
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
    const response = await this.send({ type: "parseFontInfo", data });
    return response.info;
  }
  async pdfExtractFonts(documentId) {
    const response = await this.send({ type: "pdfExtractFonts", documentId });
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
    const response = await this.send({ type: "pdfCompress", documentId });
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
    const response = await this.send({ type: "pdfDecompress", documentId });
    return response.bytes;
  }
  /**
   * Get the raw PDF bytes of a document.
   */
  async getBytes(documentId) {
    const response = await this.send({ type: "getBytes", documentId });
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
    const response = await this.send({ type: "getVisibilityGroups", documentId });
    return response.groups;
  }
  /**
   * Set visibility of a specific group.
   *
   * @returns true if the group was found and updated
   */
  async setVisibilityGroupVisible(documentId, groupId, visible) {
    const response = await this.send({ type: "setVisibilityGroupVisible", documentId, groupId, visible });
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
    const cached = cache.get(key);
    if (cached) {
      cached.lastAccess = Date.now();
      return Promise.resolve(cached.result);
    }
    if (this.currentWork?.key === key) {
      return this.currentWork.promise;
    }
    const queued = this.workQueue.find((q) => q.kind === "render" && q.docId === req.docId && q.page === req.page && q.type === req.type && q.scale === req.scale);
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
    this.cancelQueuedRequestsForPage(req.docId, req.page, req.type);
    return new Promise((resolve, reject) => {
      const queuedReq = {
        kind: "render",
        ...req,
        priority: 0,
        // Priority is now determined by distance-based sorting
        resolve,
        reject
      };
      this.workQueue.push(queuedReq);
      this.sortQueue();
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
      const match = (docId === void 0 || item.docId === docId) && (page === void 0 || item.page === page) && (type === void 0 || item.type === type);
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
      if (docId === void 0) {
        for (const entry of cache.values()) {
          entry.result.bitmap.close();
        }
        cache.clear();
      } else {
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
      if (docId === void 0) {
        for (const entry of cache.values()) {
          entry.result.bitmap.close();
        }
        cache.clear();
      } else {
        for (const [key, entry] of cache) {
          if (key.startsWith(docId + ":")) {
            entry.result.bitmap.close();
            cache.delete(key);
          }
        }
      }
    };
    if (type === void 0 || type === "page") {
      invalidateCache(this.pageRenderCache);
    }
    if (type === void 0 || type === "thumbnail") {
      invalidateCache(this.thumbnailRenderCache);
    }
    if (type === void 0 || type === "preview") {
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
    const response = await this.send({ type: "getWasmMemoryBytes" });
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
        bytes: page.bytes + thumbnail.bytes + preview.bytes
      }
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
    const key = `fontUsageCheck:${docId}`;
    if (this.workQueue.some((item) => makeWorkKey(item) === key))
      return;
    this.workQueue.push({
      kind: "fontUsageCheck",
      docId,
      page: 0,
      priority: Infinity,
      resolve: () => {
      },
      reject: () => {
      }
    });
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
      item.resolve(void 0);
    } catch {
      item.resolve(void 0);
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
  static PRERENDER_RANGE = 2;
  // Prerender pages within ±2 of current
  /**
   * Prerender adjacent pages for smooth page flipping in single spread mode.
   * Queues renders for pages before and after the current page (fire and forget).
   * Boosts current page priority so it renders first during rapid flipping.
   */
  prerenderAdjacentPages(docId, currentPage, scale, totalPages) {
    this.boostPageRenderPriority(docId, currentPage);
    for (let offset = 1; offset <= _WorkerClient.PRERENDER_RANGE; offset++) {
      const nextPage = currentPage + offset;
      if (nextPage >= 1 && nextPage <= totalPages) {
        this.requestRender({
          docId,
          page: nextPage,
          type: "page",
          scale
        }).catch(() => {
        });
      }
      const prevPage = currentPage - offset;
      if (prevPage >= 1 && prevPage <= totalPages) {
        this.requestRender({
          docId,
          page: prevPage,
          type: "page",
          scale
        }).catch(() => {
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
      const rendered = await this.send({
        type: "renderPage",
        documentId: req.docId,
        pageIndex,
        width,
        height
      });
      const source = rendered.rgba;
      const clamped = source.buffer instanceof ArrayBuffer ? new Uint8ClampedArray(source.buffer, source.byteOffset, source.byteLength) : new Uint8ClampedArray(source);
      const imageData = new ImageData(clamped, rendered.width, rendered.height);
      const bitmap = await createImageBitmap(imageData);
      const result = {
        bitmap,
        width: bitmap.width,
        height: bitmap.height
      };
      if (eventId)
        counter?.markEnd(eventId);
      return result;
    } catch (error) {
      if (eventId)
        counter?.markEnd(eventId, false, error.message);
      if (isOOMError(error))
        this.handleOOM(error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
  static BOOST_RANGE = 5;
  // Boost pages within ±5 of focus (11 pages total)
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
      } else {
        pageItems.push(item);
      }
    }
    const typeOrder = (item) => {
      if (item.kind === "render" && item.type === "preview")
        return 0;
      if (item.kind === "render" && item.type === "page")
        return 1;
      if (item.kind === "annotation")
        return 2;
      if (item.kind === "text")
        return 3;
      return 4;
    };
    pageItems.sort((a, b) => {
      const aIsCheck = a.kind === "fontUsageCheck" ? 1 : 0;
      const bIsCheck = b.kind === "fontUsageCheck" ? 1 : 0;
      if (aIsCheck !== bIsCheck)
        return aIsCheck - bIsCheck;
      const ad = pageFocus && a.docId === pageFocus.docId ? Math.abs(a.page - pageFocus.page) : Infinity;
      const bd = pageFocus && b.docId === pageFocus.docId ? Math.abs(b.page - pageFocus.page) : Infinity;
      const aBoosted = ad <= _WorkerClient.BOOST_RANGE;
      const bBoosted = bd <= _WorkerClient.BOOST_RANGE;
      if (aBoosted !== bBoosted)
        return aBoosted ? -1 : 1;
      if (ad !== bd)
        return ad - bd;
      return typeOrder(a) - typeOrder(b);
    });
    thumbnailItems.sort((a, b) => {
      const ad = thumbnailFocus && a.docId === thumbnailFocus.docId ? Math.abs(a.page - thumbnailFocus.page) : Infinity;
      const bd = thumbnailFocus && b.docId === thumbnailFocus.docId ? Math.abs(b.page - thumbnailFocus.page) : Infinity;
      return ad - bd;
    });
    this.workQueue = [...pageItems, ...thumbnailItems];
  }
  /**
   * Clean up render resources.
   */
  destroyRenderResources() {
    for (const req of this.workQueue) {
      req.reject(new Error("WorkerClient destroyed"));
    }
    this.workQueue = [];
    for (const entry of this.pageRenderCache.values()) {
      entry.result.bitmap.close();
    }
    this.pageRenderCache.clear();
    for (const entry of this.thumbnailRenderCache.values()) {
      entry.result.bitmap.close();
    }
    this.thumbnailRenderCache.clear();
    for (const entry of this.previewRenderCache.values()) {
      entry.result.bitmap.close();
    }
    this.previewRenderCache.clear();
  }
  processWorkQueue() {
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
      const cached = cache.get(renderKey);
      if (cached) {
        cached.lastAccess = Date.now();
        item.resolve(cached.result);
        this.processWorkQueue();
        return;
      }
      promise = this.doRender(item, renderKey);
    } else if (item.kind === "annotation") {
      promise = this.doAnnotation(item);
    } else if (item.kind === "text") {
      promise = this.doText(item);
    } else {
      promise = this.doFontUsageCheck(item);
    }
    this.currentWork = { key, promise };
    const onSettled = () => {
      this.currentWork = null;
      this.processWorkQueue();
    };
    promise.then(onSettled, onSettled);
  }
  async doRender(req, key) {
    const counter = this.getCounter(req.docId);
    const eventType = req.type === "thumbnail" ? "renderThumbnail" : req.type === "preview" ? "renderPreview" : "renderPage";
    const pageIndex = req.page - 1;
    const eventId = counter?.markStart(eventType, { pageIndex, scale: req.scale });
    try {
      const pageInfo = await this.getPageInfo(req.docId, pageIndex);
      const width = Math.round(pageInfo.width * req.scale);
      const height = Math.round(pageInfo.height * req.scale);
      const rendered = await this.send({
        type: "renderPage",
        documentId: req.docId,
        pageIndex,
        width,
        height
      });
      const source = rendered.rgba;
      const clamped = source.buffer instanceof ArrayBuffer ? new Uint8ClampedArray(source.buffer, source.byteOffset, source.byteLength) : new Uint8ClampedArray(source);
      const imageData = new ImageData(clamped, rendered.width, rendered.height);
      const bitmap = await createImageBitmap(imageData);
      const result = {
        bitmap,
        width: bitmap.width,
        height: bitmap.height
      };
      this.addToRenderCache(req.type, key, result);
      if (eventId)
        counter?.markEnd(eventId);
      req.resolve(result);
      if (req.type === "page") {
        this.scheduleFontUsageCheck(req.docId);
      }
      return result;
    } catch (error) {
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
      const response = await this.send({
        type: "getPageAnnotations",
        documentId: item.docId,
        pageIndex
      });
      if (eventId)
        counter?.markEnd(eventId);
      item.resolve(response.annotations);
      return response.annotations;
    } catch (error) {
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
      const response = await this.send({
        type: "getLayoutPage",
        documentId: item.docId,
        pageIndex
      });
      if (eventId)
        counter?.markEnd(eventId);
      item.resolve(response.layout);
      return response.layout;
    } catch (error) {
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
      while (cache.size > 0 && this.cacheTotalBytes(cache) + incoming > this.maxPageCacheBytes) {
        if (!this.evictLRU(cache))
          break;
      }
    } else {
      const maxSize = this.getMaxCacheSize(type);
      while (cache.size >= maxSize) {
        if (!this.evictLRU(cache))
          break;
      }
    }
    cache.set(key, {
      result,
      lastAccess: Date.now()
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
    if (_id === void 0)
      return;
    const pending = this.pending.get(_id);
    if (!pending)
      return;
    this.pending.delete(_id);
    if (response.success) {
      pending.resolve(response);
    } else {
      pending.reject(new Error(response.error));
    }
  }
  handleError(event) {
    console.error("Worker error:", event.message);
  }
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/framework/store.js
function createStore(reducer2, initialState2, options = {}) {
  let state = initialState2;
  const renderSubs = /* @__PURE__ */ new Set();
  const effectSubs = /* @__PURE__ */ new Set();
  const actionSubs = /* @__PURE__ */ new Set();
  const batched = options.batched ?? true;
  let pending = false;
  let lastPrev = null;
  let lastNext = null;
  function notify(prev, next) {
    for (const fn of renderSubs) {
      try {
        fn(prev, next);
      } catch (e) {
        console.error("Render subscriber error:", e);
      }
    }
    for (const fn of effectSubs) {
      try {
        fn(prev, next);
      } catch (e) {
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
    const next = reducer2(prev, action);
    if (next === prev)
      return;
    state = next;
    for (const fn of actionSubs) {
      try {
        fn(action, prev, next);
      } catch (e) {
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

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/state.js
var LEFT_TABS = /* @__PURE__ */ new Set(["thumbnail", "outline", "bookmarks", "layers", "attachments", "fonts"]);
function isLeftPanelTab(tab) {
  return LEFT_TABS.has(tab);
}
var DEFAULT_TOOL_OPTIONS = {
  strokeColor: "#ff0000",
  fillColor: null,
  strokeWidth: 2,
  opacity: 1,
  fontSize: 16,
  lineStyle: "solid",
  arrowHeadStart: "none",
  arrowHeadEnd: "open"
};
function isToolSetKind(kind) {
  return kind === "annotate" || kind === "markup";
}
var ANNOTATION_FORMATS = /* @__PURE__ */ new Set(["pdf"]);
function getFormatDefaults(format) {
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
        zoomMode: "fit-spread-width-max"
      };
    case "pptx":
    case "image":
      return { viewMode: "paged", scrollMode: "spread", zoomMode: "fit-spread" };
  }
}
var DEFAULT_ZOOM_STEPS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];
var PDF_DPI = 72;
var DEFAULT_DPI = 96;
var POINTS_TO_PIXELS = DEFAULT_DPI / PDF_DPI;
function getPointsToPixels(dpi) {
  return dpi / PDF_DPI;
}
var initialState = {
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
  pageAnnotations: /* @__PURE__ */ new Map(),
  annotationsLoading: /* @__PURE__ */ new Set(),
  pageText: /* @__PURE__ */ new Map(),
  textLoading: /* @__PURE__ */ new Set(),
  textFailed: /* @__PURE__ */ new Set(),
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
  disabledPanels: /* @__PURE__ */ new Set(),
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
  annotationsDirtyPages: /* @__PURE__ */ new Set(),
  selectedAnnotation: null,
  zoomAnchor: null,
  disabledTools: /* @__PURE__ */ new Set(["annotate", "markup"]),
  activeTool: { kind: "pointer" },
  lastSubToolPerSet: { annotate: "freehand", markup: "highlight" },
  toolOptions: {}
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/navigation.js
function destinationToNavigationTarget(dest, pageCount) {
  const page = Math.max(1, Math.min(dest.pageIndex + 1, Math.max(1, pageCount)));
  const target = { page };
  switch (dest.display.type) {
    case "xyz":
      if (dest.display.top !== void 0 || dest.display.left !== void 0) {
        target.scrollTo = {
          x: dest.display.left,
          y: dest.display.top
        };
      }
      if (dest.display.zoom !== void 0 && dest.display.zoom > 0) {
        target.zoom = dest.display.zoom;
      }
      break;
    case "fitH":
      if (dest.display.top !== void 0) {
        target.scrollTo = { y: dest.display.top };
      }
      break;
    case "fitV":
      if (dest.display.left !== void 0) {
        target.scrollTo = { x: dest.display.left };
      }
      break;
    case "fitBH":
      if (dest.display.top !== void 0) {
        target.scrollTo = { y: dest.display.top };
      }
      break;
    case "fitBV":
      if (dest.display.left !== void 0) {
        target.scrollTo = { x: dest.display.left };
      }
      break;
    case "fit":
    case "fitB":
    case "fitR":
      break;
  }
  return target;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/reducer.js
function reducer(state, action) {
  switch (action.type) {
    case "__INIT__":
      return state;
    case "SET_DOC": {
      if (state.doc === action.doc)
        return state;
      const vd = action.viewDefaults;
      const supportsAnnotations = ANNOTATION_FORMATS.has(action.documentFormat);
      const toolNowUnavailable = !supportsAnnotations && isToolSetKind(state.activeTool.kind);
      return {
        ...state,
        doc: action.doc,
        documentFormat: action.documentFormat,
        page: 1,
        pageCount: action.pageCount,
        pageInfos: action.pageInfos,
        pageGroups: action.pageGroups,
        activeGroupIndex: 0,
        activeTool: toolNowUnavailable ? { kind: "pointer" } : state.activeTool,
        // Reset view mode to defaults (format-specific if provided)
        viewMode: vd?.viewMode ?? initialState.viewMode,
        scrollMode: vd?.scrollMode ?? initialState.scrollMode,
        layoutMode: vd?.layoutMode ?? initialState.layoutMode,
        zoomMode: vd?.zoomMode ?? initialState.zoomMode,
        zoom: vd?.zoom ?? initialState.zoom,
        effectiveZoom: vd?.effectiveZoom !== void 0 ? vd.effectiveZoom : initialState.effectiveZoom,
        pageRotation: vd?.pageRotation ?? initialState.pageRotation,
        spacingMode: vd?.spacingMode ?? initialState.spacingMode,
        pageSpacing: vd?.pageSpacing ?? initialState.pageSpacing,
        spreadSpacing: vd?.spreadSpacing ?? initialState.spreadSpacing
      };
    }
    case "UPDATE_PAGE_SIZES": {
      return { ...state, pageInfos: action.pageInfos };
    }
    case "CLEAR_DOC": {
      if (!state.doc && state.pageCount === 0)
        return state;
      return {
        ...state,
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
        pageAnnotations: /* @__PURE__ */ new Map(),
        annotationsLoading: /* @__PURE__ */ new Set(),
        annotationsDirtyPages: /* @__PURE__ */ new Set(),
        selectedAnnotation: null,
        pageText: /* @__PURE__ */ new Map(),
        textLoading: /* @__PURE__ */ new Set(),
        textFailed: /* @__PURE__ */ new Set(),
        searchQuery: "",
        searchCaseSensitive: false,
        searchMatches: [],
        searchActiveIndex: -1,
        searchTextLoaded: false,
        searchTextLoading: false,
        isProcessing: false,
        // Close panels instantly when clearing a document
        activePanel: null,
        panelTransitionsDisabled: true
      };
    }
    case "SET_PAGE": {
      const page = clamp(action.page, 1, Math.max(1, state.pageCount || 1));
      if (state.page === page)
        return state;
      return { ...state, page };
    }
    case "SET_ACTIVE_GROUP": {
      const groupIndex = clamp(action.groupIndex, 0, Math.max(0, state.pageGroups.length - 1));
      if (state.activeGroupIndex === groupIndex)
        return state;
      const group = state.pageGroups[groupIndex];
      const firstPage = group ? group.startPageIndex + 1 : 1;
      return { ...state, activeGroupIndex: groupIndex, page: firstPage };
    }
    case "SET_NEEDS_PASSWORD": {
      if (state.needsPassword === action.needsPassword)
        return state;
      return { ...state, needsPassword: action.needsPassword, passwordError: null };
    }
    case "AUTHENTICATE_START": {
      if (state.isAuthenticating)
        return state;
      return { ...state, isAuthenticating: true, passwordError: null };
    }
    case "AUTHENTICATE_SUCCESS": {
      return { ...state, isAuthenticating: false, needsPassword: false, passwordError: null };
    }
    case "AUTHENTICATE_FAILURE": {
      return { ...state, isAuthenticating: false, passwordError: action.error };
    }
    case "CLEAR_PASSWORD_ERROR": {
      if (state.passwordError === null)
        return state;
      return { ...state, passwordError: null };
    }
    case "LOAD_OUTLINE": {
      if (state.outlineLoading)
        return state;
      return { ...state, outlineLoading: true };
    }
    case "SET_OUTLINE": {
      return { ...state, outline: action.outline, outlineLoading: false };
    }
    case "LOAD_VISIBILITY_GROUPS": {
      if (state.visibilityGroupsLoading)
        return state;
      return { ...state, visibilityGroupsLoading: true };
    }
    case "SET_VISIBILITY_GROUPS": {
      return { ...state, visibilityGroups: action.groups, visibilityGroupsLoading: false };
    }
    case "SET_VISIBILITY_GROUP_VISIBLE": {
      if (!state.visibilityGroups)
        return state;
      const groups = state.visibilityGroups.map((g) => g.id === action.groupId ? { ...g, visible: action.visible } : g);
      return { ...state, visibilityGroups: groups };
    }
    case "LOAD_PAGE_ANNOTATIONS": {
      if (state.annotationsLoading.has(action.pageIndex))
        return state;
      if (state.pageAnnotations.has(action.pageIndex))
        return state;
      const newLoading = new Set(state.annotationsLoading);
      newLoading.add(action.pageIndex);
      return { ...state, annotationsLoading: newLoading };
    }
    case "SET_PAGE_ANNOTATIONS": {
      const newAnnotations = new Map(state.pageAnnotations);
      newAnnotations.set(action.pageIndex, action.annotations);
      const newLoading = new Set(state.annotationsLoading);
      newLoading.delete(action.pageIndex);
      return {
        ...state,
        pageAnnotations: newAnnotations,
        annotationsLoading: newLoading
      };
    }
    case "CLEAR_ANNOTATIONS": {
      if (state.pageAnnotations.size === 0 && state.annotationsLoading.size === 0)
        return state;
      return {
        ...state,
        pageAnnotations: /* @__PURE__ */ new Map(),
        annotationsLoading: /* @__PURE__ */ new Set()
      };
    }
    case "LOAD_PAGE_TEXT": {
      if (state.textLoading.has(action.pageIndex))
        return state;
      if (state.pageText.has(action.pageIndex))
        return state;
      const newLoading = new Set(state.textLoading);
      newLoading.add(action.pageIndex);
      return { ...state, textLoading: newLoading };
    }
    case "SET_PAGE_TEXT": {
      const newText = new Map(state.pageText);
      newText.set(action.pageIndex, action.text);
      const newLoading = new Set(state.textLoading);
      newLoading.delete(action.pageIndex);
      return {
        ...state,
        pageText: newText,
        textLoading: newLoading
      };
    }
    case "CLEAR_PAGE_TEXT_LOADING": {
      if (!state.textLoading.has(action.pageIndex))
        return state;
      const newLoading = new Set(state.textLoading);
      newLoading.delete(action.pageIndex);
      return { ...state, textLoading: newLoading };
    }
    case "SET_PAGE_TEXT_FAILED": {
      const newLoading = new Set(state.textLoading);
      newLoading.delete(action.pageIndex);
      const newFailed = new Set(state.textFailed);
      newFailed.add(action.pageIndex);
      return { ...state, textLoading: newLoading, textFailed: newFailed };
    }
    case "CLEAR_TEXT": {
      if (state.pageText.size === 0 && state.textLoading.size === 0 && state.textFailed.size === 0)
        return state;
      return {
        ...state,
        pageText: /* @__PURE__ */ new Map(),
        textLoading: /* @__PURE__ */ new Set(),
        textFailed: /* @__PURE__ */ new Set()
      };
    }
    case "NAVIGATE_TO_PAGE": {
      const page = clamp(action.page, 1, Math.max(1, state.pageCount || 1));
      const target = { page };
      if (state.navigationTarget?.page === page && !state.navigationTarget.scrollTo && !state.navigationTarget.zoom) {
        return state;
      }
      return { ...state, navigationTarget: target };
    }
    case "NAVIGATE_TO_DESTINATION": {
      const target = destinationToNavigationTarget(action.destination, state.pageCount);
      target.scrollAlignment = action.scrollAlignment ?? state.navigationScrollAlignment;
      if (action.scrollToHeight !== void 0 && target.scrollTo) {
        target.scrollTo.height = action.scrollToHeight;
      }
      return { ...state, navigationTarget: target };
    }
    case "CLEAR_NAVIGATION_TARGET": {
      if (state.navigationTarget === null)
        return state;
      return { ...state, navigationTarget: null };
    }
    case "SET_NAVIGATION_SCROLL_ALIGNMENT": {
      if (state.navigationScrollAlignment === action.alignment)
        return state;
      return { ...state, navigationScrollAlignment: action.alignment };
    }
    case "SET_SEARCH_SCROLL_ALIGNMENT": {
      if (state.searchScrollAlignment === action.alignment)
        return state;
      return { ...state, searchScrollAlignment: action.alignment };
    }
    case "SET_VIEW_MODE": {
      if (state.viewMode === action.mode)
        return state;
      switch (action.mode) {
        case "continuous":
          return {
            ...state,
            viewMode: "continuous",
            layoutMode: "single-page",
            scrollMode: "continuous",
            spacingMode: "none",
            pageSpacing: 0,
            spreadSpacing: 0,
            pageRotation: 0
          };
        case "paged":
          return {
            ...state,
            viewMode: "paged",
            // Restore paged defaults
            spacingMode: "all",
            pageSpacing: 20,
            spreadSpacing: 20
          };
      }
      break;
    }
    case "SET_SCROLL_MODE": {
      if (state.scrollMode === action.mode)
        return state;
      return { ...state, scrollMode: action.mode };
    }
    case "SET_LAYOUT_MODE": {
      if (state.layoutMode === action.mode)
        return state;
      return { ...state, layoutMode: action.mode };
    }
    case "SET_ZOOM_MODE": {
      if (state.zoomMode === action.mode)
        return state;
      return { ...state, zoomMode: action.mode };
    }
    case "SET_ZOOM": {
      const zoom = clamp(action.zoom, state.minZoom, state.maxZoom);
      if (state.zoom === zoom && state.zoomMode === "custom")
        return state;
      return { ...state, zoom, zoomMode: "custom" };
    }
    case "SET_EFFECTIVE_ZOOM": {
      if (state.effectiveZoom === action.zoom)
        return state;
      return { ...state, effectiveZoom: action.zoom };
    }
    case "SET_ZOOM_STEPS": {
      if (state.zoomSteps === action.steps)
        return state;
      return { ...state, zoomSteps: action.steps };
    }
    case "ZOOM_IN": {
      const steps = state.zoomSteps;
      const currentZoom = state.effectiveZoom ?? state.zoom;
      const nextStep = steps.find((s) => s > currentZoom + 1e-9) ?? steps[steps.length - 1];
      const clamped = Math.min(nextStep, state.maxZoom);
      if (currentZoom >= clamped - 1e-9 && state.zoomMode === "custom")
        return state;
      return { ...state, zoom: clamped, zoomMode: "custom", zoomAnchor: action.anchor ?? null };
    }
    case "ZOOM_OUT": {
      const steps = state.zoomSteps;
      const currentZoom = state.effectiveZoom ?? state.zoom;
      const prevStep = [...steps].reverse().find((s) => s < currentZoom - 1e-9) ?? steps[0];
      const clamped = Math.max(prevStep, state.minZoom);
      if (currentZoom <= clamped + 1e-9 && state.zoomMode === "custom")
        return state;
      return { ...state, zoom: clamped, zoomMode: "custom", zoomAnchor: action.anchor ?? null };
    }
    case "CLEAR_ZOOM_ANCHOR": {
      if (!state.zoomAnchor)
        return state;
      return { ...state, zoomAnchor: null };
    }
    case "SET_PAGE_ROTATION": {
      if (state.pageRotation === action.rotation)
        return state;
      return { ...state, pageRotation: action.rotation };
    }
    case "SET_SPACING_MODE": {
      if (state.spacingMode === action.mode)
        return state;
      switch (action.mode) {
        case "all":
          return { ...state, spacingMode: action.mode, pageSpacing: 20, spreadSpacing: 20 };
        case "none":
          return { ...state, spacingMode: action.mode, pageSpacing: 0, spreadSpacing: 0 };
        case "spread-only":
          return { ...state, spacingMode: action.mode, pageSpacing: 0, spreadSpacing: 20 };
        case "page-only":
          return { ...state, spacingMode: action.mode, pageSpacing: 20, spreadSpacing: 0 };
      }
      break;
    }
    case "SET_PAGE_SPACING": {
      const spacing = Math.max(0, action.spacing);
      if (state.pageSpacing === spacing)
        return state;
      return { ...state, pageSpacing: spacing };
    }
    case "SET_SPREAD_SPACING": {
      const spacing = Math.max(0, action.spacing);
      if (state.spreadSpacing === spacing)
        return state;
      return { ...state, spreadSpacing: spacing };
    }
    case "TOGGLE_PANEL": {
      if (isLeftPanelTab(action.panel) && !state.leftPanelVisible)
        return state;
      if (!isLeftPanelTab(action.panel) && !state.rightPanelVisible)
        return state;
      if (state.disabledPanels.has(action.panel))
        return state;
      const newPanel = state.activePanel === action.panel ? null : action.panel;
      if (state.activePanel === newPanel)
        return state;
      if (newPanel === "search" && state.searchPageRange !== null) {
        return {
          ...state,
          activePanel: newPanel,
          searchPageRange: null,
          searchMatches: [],
          searchActiveIndex: -1,
          searchTextLoaded: false
        };
      }
      return { ...state, activePanel: newPanel };
    }
    case "CLOSE_PANEL": {
      if (state.activePanel === null)
        return state;
      return { ...state, activePanel: null };
    }
    case "SET_LEFT_PANEL_WIDTH": {
      if (state.leftPanelWidth === action.width)
        return state;
      return { ...state, leftPanelWidth: action.width };
    }
    case "SET_RIGHT_PANEL_WIDTH": {
      if (state.rightPanelWidth === action.width)
        return state;
      return { ...state, rightPanelWidth: action.width };
    }
    case "SET_TOOLBAR_VISIBLE": {
      if (state.toolbarVisible === action.visible)
        return state;
      return { ...state, toolbarVisible: action.visible };
    }
    case "SET_FLOATING_TOOLBAR_VISIBLE": {
      if (state.floatingToolbarVisible === action.visible)
        return state;
      return { ...state, floatingToolbarVisible: action.visible };
    }
    case "SET_LEFT_PANEL_VISIBLE": {
      if (state.leftPanelVisible === action.visible)
        return state;
      const activePanel = !action.visible && state.activePanel !== null && isLeftPanelTab(state.activePanel) ? null : state.activePanel;
      return { ...state, leftPanelVisible: action.visible, activePanel };
    }
    case "SET_RIGHT_PANEL_VISIBLE": {
      if (state.rightPanelVisible === action.visible)
        return state;
      const activePanel = !action.visible && state.activePanel !== null && !isLeftPanelTab(state.activePanel) ? null : state.activePanel;
      return { ...state, rightPanelVisible: action.visible, activePanel };
    }
    case "SET_FULLSCREEN_BUTTON_VISIBLE": {
      if (state.fullscreenButtonVisible === action.visible)
        return state;
      return { ...state, fullscreenButtonVisible: action.visible };
    }
    case "SET_DOWNLOAD_BUTTON_VISIBLE": {
      if (state.downloadButtonVisible === action.visible)
        return state;
      return { ...state, downloadButtonVisible: action.visible };
    }
    case "SET_PRINT_BUTTON_VISIBLE": {
      if (state.printButtonVisible === action.visible)
        return state;
      return { ...state, printButtonVisible: action.visible };
    }
    case "SET_THEME": {
      if (state.theme === action.theme)
        return state;
      return { ...state, theme: action.theme };
    }
    case "SET_THEME_SWITCHING_DISABLED": {
      if (state.themeSwitchingDisabled === action.disabled)
        return state;
      return { ...state, themeSwitchingDisabled: action.disabled };
    }
    case "SET_TEXT_SELECTION_DISABLED": {
      if (state.textSelectionDisabled === action.disabled)
        return state;
      return { ...state, textSelectionDisabled: action.disabled };
    }
    case "SET_MIN_ZOOM": {
      if (state.minZoom === action.zoom)
        return state;
      const zoom = state.zoom < action.zoom ? action.zoom : state.zoom;
      return { ...state, minZoom: action.zoom, zoom };
    }
    case "SET_MAX_ZOOM": {
      if (state.maxZoom === action.zoom)
        return state;
      const zoom = state.zoom > action.zoom ? action.zoom : state.zoom;
      return { ...state, maxZoom: action.zoom, zoom };
    }
    case "SET_PANEL_DISABLED": {
      const alreadyDisabled = state.disabledPanels.has(action.panel);
      if (alreadyDisabled === action.disabled)
        return state;
      const newDisabled = new Set(state.disabledPanels);
      if (action.disabled) {
        newDisabled.add(action.panel);
      } else {
        newDisabled.delete(action.panel);
      }
      const activePanel = action.disabled && state.activePanel === action.panel ? null : state.activePanel;
      return { ...state, disabledPanels: newDisabled, activePanel };
    }
    case "HIGHLIGHT_ANNOTATION": {
      return {
        ...state,
        highlightedAnnotation: {
          pageIndex: action.pageIndex,
          bounds: action.bounds
        }
      };
    }
    case "CLEAR_ANNOTATION_HIGHLIGHT": {
      if (state.highlightedAnnotation === null)
        return state;
      return { ...state, highlightedAnnotation: null };
    }
    case "SET_FULLSCREEN": {
      if (state.isFullscreen === action.isFullscreen)
        return state;
      return { ...state, isFullscreen: action.isFullscreen };
    }
    case "SET_SEARCH_QUERY": {
      if (state.searchQuery === action.query)
        return state;
      return { ...state, searchQuery: action.query };
    }
    case "SET_SEARCH_CASE_SENSITIVE": {
      if (state.searchCaseSensitive === action.caseSensitive)
        return state;
      return { ...state, searchCaseSensitive: action.caseSensitive, searchMatches: [], searchActiveIndex: -1 };
    }
    case "SET_SEARCH_FUZZY": {
      if (state.searchFuzzy === action.fuzzy)
        return state;
      return { ...state, searchFuzzy: action.fuzzy, searchMatches: [], searchActiveIndex: -1 };
    }
    case "SET_SEARCH_MATCHES": {
      const hasMatches = action.matches.length > 0;
      const hadMatches = state.searchActiveIndex >= 0;
      const resetActive = action.resetActiveIndex !== false;
      const shouldReset = resetActive || !hadMatches;
      const activeIndex = hasMatches ? shouldReset ? 0 : Math.min(state.searchActiveIndex, action.matches.length - 1) : -1;
      const navChanged = shouldReset && hasMatches;
      return {
        ...state,
        searchMatches: action.matches,
        searchActiveIndex: activeIndex,
        searchNavGen: navChanged ? state.searchNavGen + 1 : state.searchNavGen
      };
    }
    case "SET_SEARCH_ACTIVE_INDEX": {
      const index = action.index;
      if (index < 0 || index >= state.searchMatches.length)
        return state;
      return {
        ...state,
        searchActiveIndex: index,
        searchNavGen: state.searchNavGen + 1,
        searchNavScrollAlignment: action.scrollAlignment ?? null
      };
    }
    case "SEARCH_NEXT": {
      if (state.searchMatches.length === 0)
        return state;
      const next = (state.searchActiveIndex + 1) % state.searchMatches.length;
      return {
        ...state,
        searchActiveIndex: next,
        searchNavGen: state.searchNavGen + 1,
        searchNavScrollAlignment: action.scrollAlignment ?? null
      };
    }
    case "SEARCH_PREV": {
      if (state.searchMatches.length === 0)
        return state;
      const prev = (state.searchActiveIndex - 1 + state.searchMatches.length) % state.searchMatches.length;
      return {
        ...state,
        searchActiveIndex: prev,
        searchNavGen: state.searchNavGen + 1,
        searchNavScrollAlignment: action.scrollAlignment ?? null
      };
    }
    case "CLEAR_SEARCH": {
      if (state.searchQuery === "" && state.searchMatches.length === 0 && state.searchActiveIndex === -1)
        return state;
      return { ...state, searchQuery: "", searchMatches: [], searchActiveIndex: -1 };
    }
    case "SET_SEARCH_PAGE_RANGE": {
      const prev = state.searchPageRange;
      const next = action.range;
      const same = prev === next || prev !== null && next !== null && prev.start === next.start && prev.end === next.end;
      if (same)
        return state;
      return {
        ...state,
        searchPageRange: next,
        searchMatches: [],
        searchActiveIndex: -1,
        searchTextLoaded: false
      };
    }
    case "SET_SEARCH_TEXT_LOADING": {
      if (state.searchTextLoading === action.loading)
        return state;
      return { ...state, searchTextLoading: action.loading };
    }
    case "SET_SEARCH_TEXT_LOADED": {
      if (state.searchTextLoaded === action.loaded)
        return state;
      return { ...state, searchTextLoaded: action.loaded };
    }
    case "SET_DOWNLOAD_PROGRESS": {
      return {
        ...state,
        isDownloading: true,
        downloadLoaded: action.loaded,
        downloadTotal: action.total
      };
    }
    case "CLEAR_DOWNLOAD_PROGRESS": {
      if (!state.isDownloading)
        return state;
      return {
        ...state,
        isDownloading: false,
        downloadLoaded: 0,
        downloadTotal: 0
      };
    }
    case "SET_PROCESSING": {
      if (state.isProcessing === action.processing)
        return state;
      return { ...state, isProcessing: action.processing };
    }
    case "SET_PRINT_PROGRESS": {
      return {
        ...state,
        isPrinting: true,
        printCurrentPage: action.currentPage,
        printTotalPages: action.totalPages
      };
    }
    case "CLEAR_PRINT_PROGRESS": {
      if (!state.isPrinting)
        return state;
      return {
        ...state,
        isPrinting: false,
        printCurrentPage: 0,
        printTotalPages: 0
      };
    }
    case "SHOW_PRINT_DIALOG": {
      if (state.showPrintDialog)
        return state;
      return { ...state, showPrintDialog: true };
    }
    case "HIDE_PRINT_DIALOG": {
      if (!state.showPrintDialog)
        return state;
      return { ...state, showPrintDialog: false };
    }
    case "ENABLE_PANEL_TRANSITIONS": {
      if (!state.panelTransitionsDisabled)
        return state;
      return { ...state, panelTransitionsDisabled: false };
    }
    case "SET_ACTIVE_TOOL": {
      const next = action.tool;
      if (state.activeTool.kind === next.kind && (next.kind === "annotate" || next.kind === "markup")) {
        return { ...state, activeTool: { kind: "pointer" }, selectedAnnotation: null };
      }
      const lastSubToolPerSet = next.kind === "annotate" && state.lastSubToolPerSet.annotate !== next.sub ? { ...state.lastSubToolPerSet, annotate: next.sub } : next.kind === "markup" && state.lastSubToolPerSet.markup !== next.sub ? { ...state.lastSubToolPerSet, markup: next.sub } : state.lastSubToolPerSet;
      const keepSelection = (next.kind === "annotate" || next.kind === "markup") && next.sub === "select";
      return {
        ...state,
        activeTool: next,
        lastSubToolPerSet,
        selectedAnnotation: keepSelection ? state.selectedAnnotation : null
      };
    }
    case "SET_SUB_TOOL": {
      const at = state.activeTool;
      if (at.kind !== "annotate" && at.kind !== "markup")
        return state;
      if (at.sub === action.subTool)
        return state;
      const nextActive = at.kind === "annotate" ? { kind: "annotate", sub: action.subTool } : { kind: "markup", sub: action.subTool };
      const lastSubToolPerSet = at.kind === "annotate" ? { ...state.lastSubToolPerSet, annotate: action.subTool } : { ...state.lastSubToolPerSet, markup: action.subTool };
      return {
        ...state,
        activeTool: nextActive,
        lastSubToolPerSet,
        // Clear selection when switching away from select tool
        selectedAnnotation: action.subTool !== "select" ? null : state.selectedAnnotation
      };
    }
    case "SET_TOOL_OPTION": {
      const current = state.toolOptions[action.subTool] ?? { ...DEFAULT_TOOL_OPTIONS };
      const updated = { ...current, [action.key]: action.value };
      return {
        ...state,
        toolOptions: { ...state.toolOptions, [action.subTool]: updated }
      };
    }
    case "ADD_ANNOTATION": {
      const existing = state.pageAnnotations.get(action.pageIndex) ?? [];
      const newAnnotations = new Map(state.pageAnnotations);
      newAnnotations.set(action.pageIndex, [...existing, action.annotation]);
      const newDirty = action.annotation.ephemeral ? state.annotationsDirtyPages : new Set(state.annotationsDirtyPages).add(action.pageIndex);
      return { ...state, pageAnnotations: newAnnotations, annotationsDirtyPages: newDirty };
    }
    case "ADD_ANNOTATIONS": {
      if (action.annotations.length === 0)
        return state;
      const existing = state.pageAnnotations.get(action.pageIndex) ?? [];
      const newAnnotations = new Map(state.pageAnnotations);
      newAnnotations.set(action.pageIndex, [...existing, ...action.annotations]);
      const hasReal = action.annotations.some((a) => !a.ephemeral);
      const newDirty = hasReal ? new Set(state.annotationsDirtyPages).add(action.pageIndex) : state.annotationsDirtyPages;
      return { ...state, pageAnnotations: newAnnotations, annotationsDirtyPages: newDirty };
    }
    case "REMOVE_ANNOTATION": {
      const existing = state.pageAnnotations.get(action.pageIndex);
      if (!existing || action.annotationIndex >= existing.length)
        return state;
      const removed = existing[action.annotationIndex];
      const newList = existing.filter((_, i) => i !== action.annotationIndex);
      const newAnnotations = new Map(state.pageAnnotations);
      newAnnotations.set(action.pageIndex, newList);
      const newDirty = removed.ephemeral ? state.annotationsDirtyPages : new Set(state.annotationsDirtyPages).add(action.pageIndex);
      return {
        ...state,
        pageAnnotations: newAnnotations,
        annotationsDirtyPages: newDirty,
        selectedAnnotation: null
      };
    }
    case "UPDATE_ANNOTATION": {
      const existing = state.pageAnnotations.get(action.pageIndex);
      if (!existing || action.annotationIndex >= existing.length)
        return state;
      const prevAnn = existing[action.annotationIndex];
      const newList = existing.map((a, i) => i === action.annotationIndex ? action.annotation : a);
      const newAnnotations = new Map(state.pageAnnotations);
      newAnnotations.set(action.pageIndex, newList);
      const touchesReal = !prevAnn.ephemeral || !action.annotation.ephemeral;
      const newDirty = touchesReal ? new Set(state.annotationsDirtyPages).add(action.pageIndex) : state.annotationsDirtyPages;
      return { ...state, pageAnnotations: newAnnotations, annotationsDirtyPages: newDirty };
    }
    case "UPDATE_ANNOTATIONS": {
      if (action.updates.length === 0)
        return state;
      const existing = state.pageAnnotations.get(action.pageIndex);
      if (!existing)
        return state;
      const newList = existing.slice();
      let touchesReal = false;
      for (const { annotationIndex, annotation } of action.updates) {
        if (annotationIndex < 0 || annotationIndex >= newList.length)
          continue;
        const prevAnn = newList[annotationIndex];
        newList[annotationIndex] = annotation;
        if (!prevAnn.ephemeral || !annotation.ephemeral)
          touchesReal = true;
      }
      const newAnnotations = new Map(state.pageAnnotations);
      newAnnotations.set(action.pageIndex, newList);
      const newDirty = touchesReal ? new Set(state.annotationsDirtyPages).add(action.pageIndex) : state.annotationsDirtyPages;
      return { ...state, pageAnnotations: newAnnotations, annotationsDirtyPages: newDirty };
    }
    case "RESTORE_PAGE_ANNOTATIONS": {
      const newAnnotations = new Map(state.pageAnnotations);
      newAnnotations.set(action.pageIndex, action.annotations);
      const newDirty = new Set(state.annotationsDirtyPages);
      newDirty.add(action.pageIndex);
      return {
        ...state,
        pageAnnotations: newAnnotations,
        annotationsDirtyPages: newDirty,
        selectedAnnotation: null
      };
    }
    case "SELECT_ANNOTATION": {
      const sel = state.selectedAnnotation;
      if (sel && sel.pageIndex === action.pageIndex && sel.annotationIndex === action.annotationIndex)
        return state;
      return {
        ...state,
        selectedAnnotation: { pageIndex: action.pageIndex, annotationIndex: action.annotationIndex }
      };
    }
    case "DESELECT_ANNOTATION": {
      if (state.selectedAnnotation === null)
        return state;
      return { ...state, selectedAnnotation: null };
    }
    default:
      return state;
  }
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/search/search.js
function trimToLastNWords(text, n) {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  if (words.length <= n)
    return text;
  const trimmed = words.slice(-n).join(" ");
  return /\s$/.test(text) ? trimmed + text[text.length - 1] : trimmed;
}
function trimToFirstNWords(text, n) {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  if (words.length <= n)
    return text;
  const trimmed = words.slice(0, n).join(" ");
  return /^\s/.test(text) ? text[0] + trimmed : trimmed;
}
function compose(a, b) {
  return {
    scaleX: a.scaleX * b.scaleX + a.skewX * b.skewY,
    skewY: a.skewY * b.scaleX + a.scaleY * b.skewY,
    skewX: a.scaleX * b.skewX + a.skewX * b.scaleY,
    scaleY: a.skewY * b.skewX + a.scaleY * b.scaleY,
    translateX: a.scaleX * b.translateX + a.skewX * b.translateY + a.translateX,
    translateY: a.skewY * b.translateX + a.scaleY * b.translateY + a.translateY
  };
}
function translate(t, dx, dy) {
  return {
    scaleX: t.scaleX,
    skewY: t.skewY,
    skewX: t.skewX,
    scaleY: t.scaleY,
    translateX: t.scaleX * dx + t.skewX * dy + t.translateX,
    translateY: t.skewY * dx + t.scaleY * dy + t.translateY
  };
}
function extractRuns(layout) {
  const out = [];
  for (const frame of layout.frames) {
    if (frame.parcel) {
      collectParcel(out, frame.transform, frame.parcel);
    }
  }
  if (layout.grid) {
    collectGrid(out, layout.grid);
  }
  return out;
}
function collectParcel(out, base, parcel) {
  const t = translate(base, parcel.x, parcel.y);
  for (const line of parcel.lines) {
    collectLine(out, t, line);
  }
}
function collectLine(out, base, line) {
  const content = line.content;
  if (content.type === "runList") {
    const t = translate(base, 0, line.y + line.spaceBefore + content.baseline);
    for (const run of content.runs) {
      collectRun(out, t, run);
    }
  } else {
    const t = translate(base, 0, line.y);
    collectTable(out, t, content);
  }
}
function collectRun(out, base, run) {
  const c = run.content;
  const t = translate(base, run.x, 0);
  const combined = compose(t, run.transform);
  if (c.type === "glyphs" && c.text && c.glyphs.length > 0) {
    out.push({
      text: c.text,
      glyphs: c.glyphs,
      fontSize: c.fontSize,
      transform: combined
    });
  } else if (c.type === "space") {
    out.push({
      text: " ",
      glyphs: [{ x: 0, y: 0, advance: c.advance }],
      fontSize: c.fontSize,
      transform: combined
    });
  } else if (c.type === "tab") {
    out.push({
      text: " ",
      glyphs: [{ x: 0, y: 0, advance: c.advance }],
      fontSize: c.fontSize,
      transform: combined
    });
  } else if (c.type === "break") {
    out.push({
      text: "\n",
      glyphs: [{ x: 0, y: 0, advance: 0 }],
      fontSize: 0,
      transform: combined
    });
  } else if (c.type === "paragraphEnd") {
    out.push({
      text: "\n",
      glyphs: [{ x: 0, y: 0, advance: 0 }],
      fontSize: 0,
      transform: combined
    });
  } else if (c.type === "inlineDrawing") {
    out.push({
      text: "\uFFFC",
      glyphs: [{ x: 0, y: 0, advance: c.width }],
      fontSize: 0,
      transform: combined
    });
  }
}
function collectTable(out, base, table) {
  for (const row of table.rows) {
    for (const cell of row.cells) {
      if (cell.parcel) {
        const t = translate(base, cell.x, cell.y);
        collectParcel(out, t, cell.parcel);
      }
    }
  }
}
function collectGrid(out, grid) {
  const base = {
    scaleX: grid.scale,
    skewY: 0,
    skewX: 0,
    scaleY: grid.scale,
    translateX: grid.x,
    translateY: grid.y
  };
  for (const row of grid.rows) {
    for (const cell of row.cells) {
      if (cell.parcel) {
        const t = translate(base, cell.x, cell.y);
        collectParcel(out, t, cell.parcel);
      }
    }
  }
}
function extractPageText(layout) {
  const runs = extractRuns(layout);
  let text = "";
  for (const run of runs) {
    if (!run.text || run.glyphs.length === 0)
      continue;
    text += run.text;
  }
  return text;
}
function buildPageTextMap(runs) {
  let fullText = "";
  const charMap = [];
  for (const run of runs) {
    if (!run.text || run.glyphs.length === 0)
      continue;
    for (let i = 0; i < run.text.length; i++) {
      const glyphIndex = Math.min(i, run.glyphs.length - 1);
      charMap.push({ run, glyphIndex });
    }
    fullText += run.text;
  }
  return { fullText, charMap };
}
function computeMatchRects(charMap, offset, length) {
  const rects = [];
  let hasRect = false;
  let rectAngle = 0;
  let rectAngleRad = 0;
  let rectFontSize = 0;
  let rectBaseX = 0;
  let rectBaseY = 0;
  let rectAlongEnd = 0;
  for (let i = offset; i < offset + length && i < charMap.length; i++) {
    const { run, glyphIndex } = charMap[i];
    const glyph = run.glyphs[glyphIndex];
    const transform = run.transform;
    const angleRad = Math.atan2(transform.skewY, transform.scaleX);
    const angle = angleRad * (180 / Math.PI);
    const effectiveScaleX = Math.sqrt(transform.scaleX ** 2 + transform.skewY ** 2);
    const effectiveScaleY = Math.sqrt(transform.scaleY ** 2 + transform.skewX ** 2);
    const fontSize = run.fontSize * effectiveScaleY;
    const glyphBaseX = transform.scaleX * glyph.x + transform.translateX;
    const glyphBaseY = transform.skewY * glyph.x + transform.translateY;
    const glyphAdvance = glyph.advance * effectiveScaleX;
    let canMerge = false;
    if (hasRect && Math.abs(angle - rectAngle) < 0.5) {
      const dx = glyphBaseX - rectBaseX;
      const dy = glyphBaseY - rectBaseY;
      const perpDist = Math.abs(-Math.sin(rectAngleRad) * dx + Math.cos(rectAngleRad) * dy);
      canMerge = perpDist < Math.max(rectFontSize, fontSize) * 0.5;
    }
    if (canMerge) {
      const dx = glyphBaseX - rectBaseX;
      const dy = glyphBaseY - rectBaseY;
      const along = Math.cos(rectAngleRad) * dx + Math.sin(rectAngleRad) * dy;
      rectAlongEnd = Math.max(rectAlongEnd, along + glyphAdvance);
      rectFontSize = Math.max(rectFontSize, fontSize);
    } else {
      if (hasRect) {
        pushRect(rects, rectBaseX, rectBaseY, rectAlongEnd, rectFontSize, rectAngle, rectAngleRad);
      }
      hasRect = true;
      rectAngle = angle;
      rectAngleRad = angleRad;
      rectFontSize = fontSize;
      rectBaseX = glyphBaseX;
      rectBaseY = glyphBaseY;
      rectAlongEnd = glyphAdvance;
    }
  }
  if (hasRect) {
    pushRect(rects, rectBaseX, rectBaseY, rectAlongEnd, rectFontSize, rectAngle, rectAngleRad);
  }
  return rects;
}
function pushRect(rects, baseX, baseY, width, fontSize, angle, angleRad) {
  const ascent = fontSize * 0.8;
  const x = baseX + Math.sin(angleRad) * ascent;
  const y = baseY - Math.cos(angleRad) * ascent;
  rects.push({ x, y, width, height: fontSize, angle });
}
var LIST_MARKER_CHARS = /* @__PURE__ */ new Set([
  "\u2022",
  // U+2022 bullet
  "\xB7",
  // U+00B7 middle dot (commonly pasted as a list marker)
  "\u2023",
  // ‣ triangular bullet
  "\u2043",
  // ⁃ hyphen bullet
  "\u2219",
  // ∙ bullet operator
  "\u25AA",
  // ▪ black small square
  "\u25AB",
  // ▫ white small square
  "\u25A0",
  // ■ black square
  "\u25A1",
  // □ white square
  "\u25CB",
  // ○ white circle
  "\u25CF",
  // ● black circle
  "\u25E6",
  // ◦ white bullet
  "\u25C6",
  // ◆ black diamond
  "\u25C7",
  // ◇ white diamond
  "\u25B6",
  // ▶ black right-pointing triangle
  "\u25B7",
  // ▷ white right-pointing triangle
  "\u2605",
  // ★ black star
  "\u2606",
  // ☆ white star
  "\u2756",
  // ❖ black diamond minus white x
  "\u2B25",
  // ⬥ black medium diamond
  "\u2B26"
  // ⬦ white medium diamond
]);
function isNormalizableChar(code, ch) {
  return ch === " " || ch === "	" || ch === "\n" || ch === "\r" || ch === "|" || ch === "\uFFFC" || // inline drawing placeholder
  ch === "\xA0" || // non-breaking space
  ch === "\uFEFF" || // BOM / zero-width no-break space
  ch === "\u200B" || // zero-width space
  ch === "\u200C" || // zero-width non-joiner
  ch === "\u200D" || // zero-width joiner
  ch === "\u2028" || // line separator
  ch === "\u2029" || // paragraph separator
  code < 32 || // other control characters
  LIST_MARKER_CHARS.has(ch);
}
var PUNCTUATION_FOLD = {
  "\u2018": "'",
  // left single quotation mark
  "\u2019": "'",
  // right single quotation mark (curly apostrophe)
  "\u201A": "'",
  // single low-9 quotation mark
  "\u201B": "'",
  // single high-reversed-9 quotation mark
  "\u2032": "'",
  // prime
  "\u201C": '"',
  // left double quotation mark
  "\u201D": '"',
  // right double quotation mark
  "\u201E": '"',
  // double low-9 quotation mark
  "\u201F": '"',
  // double high-reversed-9 quotation mark
  "\u2033": '"',
  // double prime
  "\u2013": "-",
  // en dash
  "\u2014": "-",
  // em dash
  "\u2212": "-",
  // minus sign
  "\xAD": "-"
  // soft hyphen
};
function foldChar(ch) {
  return PUNCTUATION_FOLD[ch] ?? ch;
}
function normalizeText(text) {
  let normalized = "";
  const origIndices = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);
    if (isNormalizableChar(code, ch)) {
      continue;
    }
    normalized += foldChar(ch);
    origIndices.push(i);
  }
  return { normalized, origIndices };
}
function executeSearch(query, caseSensitive, pageLayouts, pageCount, pageRange = null, fuzzy = false) {
  if (!query.trim())
    return [];
  const matches = [];
  const startPage = pageRange ? Math.max(0, pageRange.start) : 0;
  const endPage = pageRange ? Math.min(pageCount - 1, pageRange.end) : pageCount - 1;
  let searchQuery;
  if (fuzzy) {
    const { normalized } = normalizeText(query);
    searchQuery = caseSensitive ? normalized : normalized.toLowerCase();
  } else {
    searchQuery = caseSensitive ? query : query.toLowerCase();
  }
  if (!searchQuery)
    return [];
  for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
    const layout = pageLayouts.get(pageIndex);
    if (!layout)
      continue;
    const runs = extractRuns(layout);
    if (runs.length === 0)
      continue;
    const { fullText, charMap } = buildPageTextMap(runs);
    if (fuzzy) {
      const caseText = caseSensitive ? fullText : fullText.toLowerCase();
      const { normalized: normText, origIndices } = normalizeText(caseText);
      let searchStart = 0;
      while (searchStart < normText.length) {
        const idx = normText.indexOf(searchQuery, searchStart);
        if (idx === -1)
          break;
        const origStart = origIndices[idx];
        const origEndChar = origIndices[idx + searchQuery.length - 1];
        const origLen = origEndChar - origStart + 1;
        const rects = computeMatchRects(charMap, origStart, origLen);
        const context = buildContext(fullText, origStart, origLen);
        matches.push({ pageIndex, charOffset: origStart, length: origLen, rects, context });
        searchStart = idx + 1;
      }
    } else {
      const compareText = caseSensitive ? fullText : fullText.toLowerCase();
      let searchStart = 0;
      while (searchStart < compareText.length) {
        const idx = compareText.indexOf(searchQuery, searchStart);
        if (idx === -1)
          break;
        const rects = computeMatchRects(charMap, idx, searchQuery.length);
        const context = buildContext(fullText, idx, searchQuery.length);
        matches.push({ pageIndex, charOffset: idx, length: searchQuery.length, rects, context });
        searchStart = idx + 1;
      }
    }
  }
  return matches;
}
function buildContext(fullText, offset, length) {
  const rawBefore = fullText.substring(Math.max(0, offset - 30), offset);
  const rawAfter = fullText.substring(offset + length, offset + length + 30);
  const beforeUpToNl = rawBefore.includes("\n") ? rawBefore.substring(rawBefore.lastIndexOf("\n") + 1) : rawBefore;
  const afterUpToNl = rawAfter.includes("\n") ? rawAfter.substring(0, rawAfter.indexOf("\n")) : rawAfter;
  const before = trimToLastNWords(beforeUpToNl, 3);
  const matched = fullText.substring(offset, offset + length);
  const after = trimToFirstNWords(afterUpToNl, 3);
  const beforePrefix = before.length < beforeUpToNl.length ? "\u2026" : "";
  const afterSuffix = after.length < afterUpToNl.length ? "\u2026" : "";
  return [beforePrefix + before, matched, after + afterSuffix];
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/effects.js
function getPagesToLoad(state) {
  const pages = [];
  const currentPageIndex = state.page - 1;
  pages.push(currentPageIndex);
  if (state.layoutMode.startsWith("double-page")) {
    if (currentPageIndex > 0)
      pages.push(currentPageIndex - 1);
    if (currentPageIndex < state.pageCount - 1)
      pages.push(currentPageIndex + 1);
  }
  return pages.filter((p) => p >= 0 && p < state.pageCount);
}
function createEffects(store, engine) {
  const unsubscribers = [];
  let docGeneration = 0;
  let destroyed = false;
  unsubscribers.push(store.subscribeEffect(async (prev, next) => {
    if (prev.doc !== next.doc)
      docGeneration++;
    const gen = docGeneration;
    const shouldLoad = next.doc !== null && next.activePanel === "outline" && next.outline === null && !next.outlineLoading;
    if (shouldLoad) {
      store.dispatch({ type: "LOAD_OUTLINE" });
      try {
        const outline = await engine.getOutline(next.doc);
        if (gen !== docGeneration)
          return;
        store.dispatch({ type: "SET_OUTLINE", outline });
      } catch (error) {
        if (destroyed || gen !== docGeneration)
          return;
        console.error("Failed to load outline", error);
        store.dispatch({ type: "SET_OUTLINE", outline: [] });
      }
    }
  }));
  unsubscribers.push(store.subscribeEffect(async (prev, next) => {
    if (prev.doc !== next.doc)
      docGeneration++;
    const gen = docGeneration;
    const shouldLoad = next.doc !== null && next.activePanel === "layers" && next.visibilityGroups === null && !next.visibilityGroupsLoading;
    if (shouldLoad) {
      store.dispatch({ type: "LOAD_VISIBILITY_GROUPS" });
      try {
        const groups = await engine.getVisibilityGroups(next.doc);
        if (gen !== docGeneration)
          return;
        store.dispatch({ type: "SET_VISIBILITY_GROUPS", groups });
      } catch (error) {
        if (destroyed || gen !== docGeneration)
          return;
        console.error("Failed to load visibility groups", error);
        store.dispatch({ type: "SET_VISIBILITY_GROUPS", groups: [] });
      }
    }
  }));
  unsubscribers.push(store.subscribeEffect(async (prev, next) => {
    if (!next.doc)
      return;
    const pagesToLoad = getPagesToLoad(next);
    const pagesToActuallyLoad = pagesToLoad.filter((pageIndex) => !next.pageAnnotations.has(pageIndex) && !next.annotationsLoading.has(pageIndex));
    if (pagesToActuallyLoad.length === 0)
      return;
    const doc = next.doc;
    const gen = docGeneration;
    await new Promise((r) => requestAnimationFrame(r));
    if (gen !== docGeneration)
      return;
    for (const pageIndex of pagesToActuallyLoad) {
      if (gen !== docGeneration)
        return;
      const currentState = store.getState();
      if (currentState.pageAnnotations.has(pageIndex))
        continue;
      if (currentState.annotationsLoading.has(pageIndex))
        continue;
      store.dispatch({ type: "LOAD_PAGE_ANNOTATIONS", pageIndex });
      try {
        const annotations = await engine.getPageAnnotations(doc, pageIndex);
        if (gen !== docGeneration)
          return;
        store.dispatch({ type: "SET_PAGE_ANNOTATIONS", pageIndex, annotations });
      } catch (error) {
        if (destroyed || gen !== docGeneration)
          return;
        console.error(`Failed to load annotations for page ${pageIndex}`, error);
        store.dispatch({ type: "SET_PAGE_ANNOTATIONS", pageIndex, annotations: [] });
      }
    }
  }));
  unsubscribers.push(store.subscribeEffect(async (prev, next) => {
    if (!next.doc)
      return;
    const pagesToLoad = getPagesToLoad(next);
    const pagesToActuallyLoad = pagesToLoad.filter((pageIndex) => !next.pageText.has(pageIndex) && !next.textLoading.has(pageIndex) && !next.textFailed.has(pageIndex));
    if (pagesToActuallyLoad.length === 0)
      return;
    const doc = next.doc;
    const gen = docGeneration;
    await new Promise((r) => requestAnimationFrame(r));
    if (gen !== docGeneration)
      return;
    for (const pageIndex of pagesToActuallyLoad) {
      if (gen !== docGeneration)
        return;
      const currentState = store.getState();
      if (currentState.pageText.has(pageIndex))
        continue;
      if (currentState.textLoading.has(pageIndex))
        continue;
      store.dispatch({ type: "LOAD_PAGE_TEXT", pageIndex });
      try {
        const text = await engine.getLayoutPage(doc, pageIndex);
        if (gen !== docGeneration)
          return;
        store.dispatch({ type: "SET_PAGE_TEXT", pageIndex, text });
      } catch (error) {
        if (destroyed || gen !== docGeneration)
          return;
        console.error(`Failed to load text for page ${pageIndex}`, error);
        store.dispatch({ type: "SET_PAGE_TEXT_FAILED", pageIndex });
      }
    }
  }));
  unsubscribers.push(store.subscribeEffect(async (prev, next) => {
    if (!next.doc)
      return;
    const commentsJustOpened = next.activePanel === "comments" && prev.activePanel !== "comments";
    const docLoadedWithCommentsOpen = next.activePanel === "comments" && prev.doc !== next.doc;
    if (!commentsJustOpened && !docLoadedWithCommentsOpen)
      return;
    const gen = docGeneration;
    for (let pageIndex = 0; pageIndex < next.pageCount; pageIndex++) {
      if (gen !== docGeneration)
        return;
      if (next.pageAnnotations.has(pageIndex))
        continue;
      if (next.annotationsLoading.has(pageIndex))
        continue;
      store.dispatch({ type: "LOAD_PAGE_ANNOTATIONS", pageIndex });
      try {
        const annotations = await engine.getPageAnnotations(next.doc, pageIndex);
        if (gen !== docGeneration)
          return;
        store.dispatch({ type: "SET_PAGE_ANNOTATIONS", pageIndex, annotations });
      } catch (error) {
        if (destroyed || gen !== docGeneration)
          return;
        console.error(`Failed to load annotations for page ${pageIndex}`, error);
        store.dispatch({ type: "SET_PAGE_ANNOTATIONS", pageIndex, annotations: [] });
      }
    }
  }));
  let highlightTimer = null;
  unsubscribers.push(store.subscribeEffect((prev, next) => {
    if (prev.highlightedAnnotation !== null && next.highlightedAnnotation === null) {
      if (highlightTimer) {
        clearTimeout(highlightTimer);
        highlightTimer = null;
      }
      return;
    }
    if (prev.highlightedAnnotation !== next.highlightedAnnotation && next.highlightedAnnotation !== null) {
      if (highlightTimer) {
        clearTimeout(highlightTimer);
      }
      highlightTimer = setTimeout(() => {
        highlightTimer = null;
        store.dispatch({ type: "CLEAR_ANNOTATION_HIGHLIGHT" });
      }, 2e3);
    }
  }));
  const cleanupHighlightTimer = () => {
    if (highlightTimer) {
      clearTimeout(highlightTimer);
      highlightTimer = null;
    }
  };
  unsubscribers.push(cleanupHighlightTimer);
  unsubscribers.push(store.subscribeEffect(async (prev, next) => {
    if (!next.doc)
      return;
    const searchJustOpened = next.activePanel === "search" && prev.activePanel !== "search";
    const docLoadedWithSearchOpen = next.activePanel === "search" && prev.doc !== next.doc;
    const queryJustSet = next.searchQuery !== "" && prev.searchQuery === "";
    const docLoadedWithQuery = next.searchQuery !== "" && prev.doc !== next.doc;
    const rangeChangedWithQuery = next.searchQuery !== "" && prev.searchPageRange !== next.searchPageRange;
    if (!searchJustOpened && !docLoadedWithSearchOpen && !queryJustSet && !docLoadedWithQuery && !rangeChangedWithQuery)
      return;
    if (next.searchTextLoaded || next.searchTextLoading)
      return;
    const gen = docGeneration;
    const startPage = next.searchPageRange ? Math.max(0, next.searchPageRange.start) : 0;
    const endPage = next.searchPageRange ? Math.min(next.pageCount - 1, next.searchPageRange.end) : next.pageCount - 1;
    store.dispatch({ type: "SET_SEARCH_TEXT_LOADING", loading: true });
    for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
      if (gen !== docGeneration)
        return;
      const currentState = store.getState();
      if (currentState.pageText.has(pageIndex))
        continue;
      if (currentState.textLoading.has(pageIndex))
        continue;
      if (currentState.textFailed.has(pageIndex))
        continue;
      store.dispatch({ type: "LOAD_PAGE_TEXT", pageIndex });
      try {
        const text = await engine.getLayoutPage(next.doc, pageIndex);
        if (gen !== docGeneration)
          return;
        store.dispatch({ type: "SET_PAGE_TEXT", pageIndex, text });
      } catch (error) {
        if (destroyed || gen !== docGeneration)
          return;
        console.error(`Failed to load text for page ${pageIndex}`, error);
        store.dispatch({ type: "SET_PAGE_TEXT_FAILED", pageIndex });
      }
    }
    if (destroyed || gen !== docGeneration)
      return;
    store.dispatch({ type: "SET_SEARCH_TEXT_LOADING", loading: false });
    store.dispatch({ type: "SET_SEARCH_TEXT_LOADED", loaded: true });
  }));
  unsubscribers.push(store.subscribeEffect((prev, next) => {
    const queryChanged = prev.searchQuery !== next.searchQuery || prev.searchCaseSensitive !== next.searchCaseSensitive || prev.searchFuzzy !== next.searchFuzzy;
    const textChanged = prev.pageText !== next.pageText;
    const rangeChanged = prev.searchPageRange !== next.searchPageRange;
    if (!queryChanged && !textChanged && !rangeChanged)
      return;
    if (!next.searchQuery.trim()) {
      if (next.searchMatches.length > 0) {
        store.dispatch({ type: "SET_SEARCH_MATCHES", matches: [] });
      }
      return;
    }
    const matches = executeSearch(next.searchQuery, next.searchCaseSensitive, next.pageText, next.pageCount, next.searchPageRange, next.searchFuzzy);
    store.dispatch({
      type: "SET_SEARCH_MATCHES",
      matches,
      resetActiveIndex: queryChanged || rangeChanged
    });
  }));
  unsubscribers.push(store.subscribeEffect((prev, next) => {
    if (next.searchActiveIndex === -1)
      return;
    if (prev.searchNavGen === next.searchNavGen)
      return;
    if (next.searchMatches.length === 0)
      return;
    const match = next.searchMatches[next.searchActiveIndex];
    if (!match)
      return;
    const rect = match.rects[0];
    store.dispatch({
      type: "NAVIGATE_TO_DESTINATION",
      destination: {
        pageIndex: match.pageIndex,
        display: {
          type: "xyz",
          left: rect ? rect.x : void 0,
          top: rect ? rect.y : void 0
        }
      },
      scrollAlignment: next.searchNavScrollAlignment ?? next.searchScrollAlignment,
      scrollToHeight: rect ? rect.height : void 0
    });
  }));
  return {
    destroy: () => {
      destroyed = true;
      for (const unsub of unsubscribers) {
        unsub();
      }
    }
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/framework/selectors.js
function shallowEqual(a, b) {
  for (const k in a)
    if (a[k] !== b[k])
      return false;
  for (const k in b)
    if (!(k in a))
      return false;
  return true;
}
function subscribeSelector(store, selector, listener, options = {}) {
  const equality = options.equality ?? Object.is;
  let prevSlice = selector(store.getState());
  const handler = (_prev, next) => {
    const nextSlice = selector(next);
    if (equality(prevSlice, nextSlice))
      return;
    const prev = prevSlice;
    prevSlice = nextSlice;
    listener(nextSlice, prev);
  };
  return options.phase === "effect" ? store.subscribeEffect(handler) : store.subscribeRender(handler);
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/framework/events.js
function on(el, type, handler) {
  el.addEventListener(type, handler);
  return () => el.removeEventListener(type, handler);
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/a11y.js
var FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function trapFocus(container) {
  const handler = (e) => {
    if (e.key !== "Tab")
      return;
    const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);
    if (focusable.length === 0)
      return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  container.addEventListener("keydown", handler);
  return () => container.removeEventListener("keydown", handler);
}
function createLiveRegion() {
  const el = document.createElement("div");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-atomic", "true");
  el.setAttribute("role", "status");
  el.className = "udoc-sr-only";
  let timer = null;
  function announce(msg) {
    el.textContent = "";
    if (timer)
      clearTimeout(timer);
    timer = setTimeout(() => {
      el.textContent = msg;
    }, 50);
  }
  function destroy() {
    if (timer)
      clearTimeout(timer);
    el.remove();
  }
  return { announce, el, destroy };
}
function setupRovingTabindex(container, itemSelector, direction = "horizontal") {
  let activeIndex = 0;
  function getItems() {
    return Array.from(container.querySelectorAll(itemSelector)).filter((el) => el.offsetParent !== null && !el.hasAttribute("disabled"));
  }
  function refresh() {
    const items = getItems();
    if (items.length === 0)
      return;
    if (activeIndex >= items.length)
      activeIndex = 0;
    for (let i = 0; i < items.length; i++) {
      items[i].setAttribute("tabindex", i === activeIndex ? "0" : "-1");
    }
  }
  function handler(e) {
    const prevKey = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const nextKey = direction === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (e.key !== prevKey && e.key !== nextKey && e.key !== "Home" && e.key !== "End")
      return;
    const items = getItems();
    if (items.length === 0)
      return;
    e.preventDefault();
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    let nextIndex;
    if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = items.length - 1;
    } else if (e.key === nextKey) {
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    }
    items[currentIndex]?.setAttribute("tabindex", "-1");
    items[nextIndex].setAttribute("tabindex", "0");
    items[nextIndex].focus();
    activeIndex = nextIndex;
  }
  container.addEventListener("keydown", handler);
  refresh();
  return {
    refresh,
    destroy: () => container.removeEventListener("keydown", handler)
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/icons.js
var ICON_CLEAR = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
var ICON_MORE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;
var ICON_MENU = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`;
var ICON_SEARCH = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
var ICON_COMMENTS = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
var ICON_FULLSCREEN = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
var ICON_FULLSCREEN_EXIT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;
var ICON_THUMBNAIL = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h4v4H4V5zm6 0h4v4h-4V5zm6 0h4v4h-4V5zM4 11h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 17h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>`;
var ICON_OUTLINE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`;
var ICON_BOOKMARK = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`;
var ICON_LAYERS = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg>`;
var ICON_ATTACHMENT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>`;
var ICON_FONTS = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z"/><path d="M8.5 7h7v2.5h-4.5v2.5h4v2.5h-4V18H8.5z"/></svg>`;
var ICON_VISIBILITY = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
var ICON_LOCK = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`;
var ICON_VISIBILITY_OFF = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;
var ICON_CHEVRON_LEFT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
var ICON_CHEVRON_RIGHT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`;
var ICON_CHEVRON_DOWN = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
var ICON_CHEVRON_UP = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>`;
var ICON_ZOOM_IN = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg>`;
var ICON_ZOOM_OUT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>`;
var ICON_VIEW_MODE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>`;
var ICON_VIEW_PAGED = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="1"/></svg>`;
var ICON_VIEW_CONTINUOUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="3" x2="5" y2="21"/><line x1="19" y1="3" x2="19" y2="21"/><path d="M5 12 C5 7 12 7 12 12 C12 17 19 17 19 12" stroke-width="1.5" fill="none"/></svg>`;
var ICON_SCROLL_SPREAD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="4" width="14" height="16" rx="1"/></svg>`;
var ICON_SCROLL_CONTINUOUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 2 L5 11 L19 11 L19 2"/><path d="M5 24 L5 15 L19 15 L19 24"/></svg>`;
var ICON_LAYOUT_SINGLE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="3" width="12" height="18" rx="1"/></svg>`;
var ICON_LAYOUT_DOUBLE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="8" height="16" rx="1"/><rect x="14" y="4" width="8" height="16" rx="1"/></svg>`;
var ICON_LAYOUT_DOUBLE_ODD_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="8" height="16" rx="1" stroke-dasharray="3 2"/><rect x="14" y="4" width="8" height="16" rx="1"/></svg>`;
var ICON_LAYOUT_DOUBLE_ODD_LEFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="8" height="16" rx="1"/><rect x="14" y="4" width="8" height="16" rx="1" stroke-dasharray="3 2"/></svg>`;
var ICON_ROTATE_0 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4 L14 4 L18 8 L18 20 L6 20 Z"/><path d="M14 4 L14 8 L18 8"/></svg>`;
var ICON_ROTATE_90 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 18 L20 10 L16 6 L4 6 L4 18 Z"/><path d="M20 10 L16 10 L16 6"/></svg>`;
var ICON_ROTATE_180 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20 L10 20 L6 16 L6 4 L18 4 Z"/><path d="M10 20 L10 16 L6 16"/></svg>`;
var ICON_ROTATE_270 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6 L4 14 L8 18 L20 18 L20 6 Z"/><path d="M4 14 L8 14 L8 18"/></svg>`;
var ICON_SPACING_ALL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3v7H3M14 3v7h7M10 21v-7H3M14 21v-7h7"/></svg>`;
var ICON_SPACING_NONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18"/></svg>`;
var ICON_SPACING_SPREAD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v7H3M12 3v7h9M12 21v-7H3M12 21v-7h9"/></svg>`;
var ICON_SPACING_PAGE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3v9H3M14 3v9h7M10 21v-9H3M14 21v-9h7"/></svg>`;
var ICON_DOWNLOAD = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
var ICON_PRINT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>`;
var ICON_TOOL_POINTER = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4L7 18.5V2z"/></svg>`;
var ICON_TOOL_HAND = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6V6c0-.55.45-1 1-1s1 .45 1 1v5h1V3c0-.55.45-1 1-1s1 .45 1 1v8h1V3c0-.55.45-1 1-1s1 .45 1 1v8h1V5c0-.55.45-1 1-1s1 .45 1 1v8h1V9c0-.55.45-1 1-1s1 .45 1 1v4z"/></svg>`;
var ICON_TOOL_ZOOM = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg>`;
var ICON_TOOL_ANNOTATE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>`;
var ICON_TOOL_MARKUP = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 1.15C17.97 1.15 17.47 1.36 17.09 1.74L11 7.83V15H18.17L24.26 8.91C25.04 8.13 25.04 6.87 24.26 6.09L19.91 1.74C19.53 1.36 19.03 1.15 18.5 1.15M18.5 3.16L20.84 5.5L18.17 8.17L15.83 5.83L18.5 3.16M10 1H4C2.89 1 2 1.89 2 3V21C2 22.11 2.89 23 4 23H20C21.11 23 22 22.11 22 21V13H20V21H4V3H10V1z"/></svg>`;
var ICON_SUBTOOL_FREEHAND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c1-2 3-6 5-6s2 4 4 4 3-5 5-5 2 3 4 3"/></svg>`;
var ICON_SUBTOOL_LINE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="19" x2="19" y2="5"/></svg>`;
var ICON_SUBTOOL_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/></svg>`;
var ICON_SUBTOOL_RECTANGLE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="14" rx="1"/></svg>`;
var ICON_SUBTOOL_ELLIPSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="9" ry="7"/></svg>`;
var ICON_SUBTOOL_POLYGON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 3 21 10 18 20 6 20 3 10"/></svg>`;
var ICON_SUBTOOL_POLYLINE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polyline points="3 17 9 8 15 14 21 5"/></svg>`;
var ICON_SUBTOOL_HIGHLIGHT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm2-3h8v3.17l-3 3V19h-4v-1.83l-3-3V11zm5-10h-2v3h2V1zM3.5 5.88l1.41-1.41 2.12 2.12-1.41 1.41L3.5 5.88zm13.46.71l2.12-2.12 1.41 1.41-2.12 2.12-1.41-1.41z"/></svg>`;
var ICON_SUBTOOL_UNDERLINE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>`;
var ICON_SUBTOOL_STRIKETHROUGH = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>`;
var ICON_SUBTOOL_SQUIGGLY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 18c1.5-1.5 2.5-1.5 4 0s2.5 1.5 4 0 2.5-1.5 4 0 2.5 1.5 4 0"/><path d="M6 4v8M10 4v8M14 4v8M18 4v8" stroke-width="1.5"/></svg>`;
var ICON_THEME_LIGHT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
var ICON_THEME_DARK = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.37 5.51A7.35 7.35 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0 1 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
var ICON_THEME_SYSTEM = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`;
var ICON_LINE_SOLID = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>`;
var ICON_LINE_DASHED = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 3"><line x1="3" y1="12" x2="21" y2="12"/></svg>`;
var ICON_LINE_DOTTED = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 3"><line x1="3" y1="12" x2="21" y2="12"/></svg>`;
var ICON_ARROW_NONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="12" x2="20" y2="12"/></svg>`;
var ICON_ARROW_OPEN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="15 7 20 12 15 17"/></svg>`;
var ICON_ARROW_CLOSED = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="17" y2="12"/><polygon points="15 7 21 12 15 17" fill="currentColor"/></svg>`;
var ICON_STROKE_WIDTH = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="5" width="16" height="1" rx="0.5"/><rect x="4" y="10" width="16" height="2" rx="1"/><rect x="4" y="16" width="16" height="3" rx="1.5"/></svg>`;
var ICON_OPACITY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg>`;
var ICON_FONT_SIZE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 4v3h5v12h3V7h5V4H9zM3 12v3h4v8h3v-8h4v-3H3z"/></svg>`;
var ICON_SUBTOOL_SELECT = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="M5 2l8 7.5-3.9.3 2.2 4.9-1.5.7-2.2-5L5 12.4V2z" stroke="none"/><rect x="11" y="11" width="11" height="11" rx="1" fill="none" stroke-width="1.5" stroke-dasharray="2 2"/></svg>`;
var ICON_UNDO = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05 1.04-6.83 2.73L3 8v8h8l-2.68-2.68A7.46 7.46 0 0 1 12.5 11c3.12 0 5.78 1.91 6.9 4.62l2.1-.81A9.977 9.977 0 0 0 12.5 8z"/></svg>`;
var ICON_REDO = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.33 10.73A9.948 9.948 0 0 0 11.5 8c-3.71 0-6.96 2.03-8.7 5.04l2.1.81A7.488 7.488 0 0 1 11.5 11c1.73 0 3.32.59 4.59 1.58L13.5 15.17l-.01.01H21.5v-8l-3.17 3.56z"/></svg>`;
var ICON_DELETE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>`;

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/ViewModeMenu.js
function sliceEqual(a, b) {
  return a.viewMode === b.viewMode && a.scrollMode === b.scrollMode && a.layoutMode === b.layoutMode && a.pageRotation === b.pageRotation && a.spacingMode === b.spacingMode;
}
var VIEW_MODE_OPTIONS = [
  { value: "paged", icon: ICON_VIEW_PAGED, label: "viewMode.paged" },
  { value: "continuous", icon: ICON_VIEW_CONTINUOUS, label: "viewMode.continuousView" }
];
var SCROLL_OPTIONS = [
  { value: "spread", icon: ICON_SCROLL_SPREAD, label: "viewMode.spread" },
  { value: "continuous", icon: ICON_SCROLL_CONTINUOUS, label: "viewMode.continuous" }
];
var LAYOUT_OPTIONS = [
  { value: "single-page", icon: ICON_LAYOUT_SINGLE, label: "viewMode.single" },
  { value: "double-page", icon: ICON_LAYOUT_DOUBLE, label: "viewMode.double" },
  { value: "double-page-odd-right", icon: ICON_LAYOUT_DOUBLE_ODD_RIGHT, label: "viewMode.coverRight" },
  { value: "double-page-odd-left", icon: ICON_LAYOUT_DOUBLE_ODD_LEFT, label: "viewMode.coverLeft" }
];
var ROTATION_OPTIONS = [
  { value: 0, icon: ICON_ROTATE_0, label: "0\xB0" },
  { value: 90, icon: ICON_ROTATE_90, label: "90\xB0" },
  { value: 180, icon: ICON_ROTATE_180, label: "180\xB0" },
  { value: 270, icon: ICON_ROTATE_270, label: "270\xB0" }
];
var SPACING_OPTIONS = [
  { value: "all", icon: ICON_SPACING_ALL, label: "viewMode.spacingAll" },
  { value: "none", icon: ICON_SPACING_NONE, label: "viewMode.spacingNone" },
  { value: "spread-only", icon: ICON_SPACING_SPREAD, label: "viewMode.spacingSpread" },
  { value: "page-only", icon: ICON_SPACING_PAGE, label: "viewMode.spacingPage" }
];
function createViewModeMenu() {
  const el = document.createElement("div");
  el.className = "udoc-view-mode-menu";
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "udoc-toolbar__btn";
  toggleBtn.innerHTML = ICON_VIEW_MODE;
  toggleBtn.title = "View settings";
  toggleBtn.setAttribute("aria-label", "View settings");
  toggleBtn.setAttribute("aria-haspopup", "true");
  toggleBtn.setAttribute("aria-expanded", "false");
  el.appendChild(toggleBtn);
  const dropdown = document.createElement("div");
  dropdown.className = "udoc-view-mode-menu__dropdown";
  dropdown.setAttribute("role", "group");
  dropdown.setAttribute("aria-label", "View settings");
  dropdown.style.display = "none";
  el.appendChild(dropdown);
  let unsub = null;
  const unsubEvents = [];
  let dropdownListeners = [];
  let storeRef = null;
  let i18nRef = null;
  let isOpen = false;
  function createSection(title, options, currentValue, onSelect, sectionOptions = {}) {
    const section = document.createElement("div");
    section.className = "udoc-view-mode-menu__section";
    const titleEl = document.createElement("div");
    titleEl.className = "udoc-view-mode-menu__title";
    titleEl.textContent = title;
    section.appendChild(titleEl);
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "udoc-view-mode-menu__options";
    optionsContainer.setAttribute("role", "radiogroup");
    optionsContainer.setAttribute("aria-label", title);
    for (const opt of options) {
      const btn = document.createElement("button");
      btn.className = "udoc-view-mode-menu__option";
      const isActive = opt.value === currentValue && !sectionOptions.allowNoSelection;
      if (isActive) {
        btn.classList.add("udoc-view-mode-menu__option--active");
      }
      if (sectionOptions.disabled) {
        btn.disabled = true;
        btn.classList.add("udoc-view-mode-menu__option--disabled");
      }
      btn.title = i18nRef ? i18nRef.t(opt.label) : opt.label;
      btn.setAttribute("aria-label", i18nRef ? i18nRef.t(opt.label) : opt.label);
      btn.setAttribute("aria-pressed", String(isActive));
      const iconSpan = document.createElement("span");
      iconSpan.className = "udoc-view-mode-menu__option-icon";
      iconSpan.innerHTML = opt.icon;
      btn.appendChild(iconSpan);
      if (!sectionOptions.disabled) {
        dropdownListeners.push(on(btn, "click", (e) => {
          e.stopPropagation();
          onSelect(opt.value);
        }));
      }
      optionsContainer.appendChild(btn);
    }
    section.appendChild(optionsContainer);
    return section;
  }
  function buildDropdown(slice) {
    for (const off of dropdownListeners)
      off();
    dropdownListeners = [];
    dropdown.innerHTML = "";
    const isPaged = slice.viewMode === "paged";
    dropdown.appendChild(createSection(i18nRef.t("viewMode.view"), VIEW_MODE_OPTIONS, slice.viewMode, (mode) => {
      storeRef?.dispatch({ type: "SET_VIEW_MODE", mode });
    }));
    const disabledInContinuous = !isPaged ? { disabled: true, allowNoSelection: true } : {};
    dropdown.appendChild(createSection(i18nRef.t("viewMode.scroll"), SCROLL_OPTIONS, slice.scrollMode, (mode) => {
      storeRef?.dispatch({ type: "SET_SCROLL_MODE", mode });
    }, disabledInContinuous));
    dropdown.appendChild(createSection(i18nRef.t("viewMode.layout"), LAYOUT_OPTIONS, slice.layoutMode, (mode) => {
      storeRef?.dispatch({ type: "SET_LAYOUT_MODE", mode });
    }, disabledInContinuous));
    dropdown.appendChild(createSection(i18nRef.t("viewMode.rotation"), ROTATION_OPTIONS, slice.pageRotation, (rotation) => {
      storeRef?.dispatch({ type: "SET_PAGE_ROTATION", rotation });
    }, disabledInContinuous));
    dropdown.appendChild(createSection(i18nRef.t("viewMode.spacing"), SPACING_OPTIONS, slice.spacingMode, (mode) => {
      storeRef?.dispatch({ type: "SET_SPACING_MODE", mode });
    }, disabledInContinuous));
  }
  function toggleDropdown() {
    isOpen = !isOpen;
    dropdown.style.display = isOpen ? "block" : "none";
    toggleBtn.classList.toggle("udoc-toolbar__btn--active", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  }
  function closeDropdown() {
    if (isOpen) {
      isOpen = false;
      dropdown.style.display = "none";
      toggleBtn.classList.remove("udoc-toolbar__btn--active");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  }
  function mount(store, i18n) {
    storeRef = store;
    i18nRef = i18n;
    toggleBtn.title = i18n.t("viewMode.label");
    toggleBtn.setAttribute("aria-label", i18n.t("viewMode.label"));
    dropdown.setAttribute("aria-label", i18n.t("viewMode.label"));
    unsubEvents.push(on(toggleBtn, "click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    }));
    const handleOutsideClick = (e) => {
      if (!el.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    unsubEvents.push(() => document.removeEventListener("click", handleOutsideClick));
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeDropdown();
      }
    };
    document.addEventListener("keydown", handleEscape);
    unsubEvents.push(() => document.removeEventListener("keydown", handleEscape));
    const applyState = (slice) => {
      buildDropdown(slice);
    };
    applyState(selectSlice(store.getState()));
    unsub = subscribeSelector(store, selectSlice, applyState, {
      equality: sliceEqual
    });
  }
  function destroy() {
    if (unsub)
      unsub();
    for (const off of dropdownListeners)
      off();
    dropdownListeners = [];
    for (const off of unsubEvents)
      off();
    el.remove();
  }
  return { el, mount, destroy };
}
function selectSlice(state) {
  return {
    viewMode: state.viewMode,
    scrollMode: state.scrollMode,
    layoutMode: state.layoutMode,
    pageRotation: state.pageRotation,
    spacingMode: state.spacingMode
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/Toolbar.js
function createButton(className, label, iconSvg, keyshortcuts) {
  const btn = document.createElement("button");
  btn.className = `udoc-toolbar__btn ${className}`;
  btn.setAttribute("aria-label", label);
  if (keyshortcuts) {
    btn.setAttribute("aria-keyshortcuts", keyshortcuts);
  }
  btn.innerHTML = iconSvg;
  return btn;
}
function formatZoomPercent(zoom) {
  const percent = Math.round(zoom * 1e3) / 10;
  return percent % 1 === 0 ? `${percent}%` : `${percent.toFixed(1)}%`;
}
var LEFT_TABS2 = ["thumbnail", "outline", "bookmarks", "layers", "attachments"];
function sliceEqual2(a, b) {
  return a.toolbarVisible === b.toolbarVisible && a.floatingToolbarVisible === b.floatingToolbarVisible && a.fullscreenButtonVisible === b.fullscreenButtonVisible && a.downloadButtonVisible === b.downloadButtonVisible && a.printButtonVisible === b.printButtonVisible && a.isFullscreen === b.isFullscreen && a.theme === b.theme && a.themeSwitchingDisabled === b.themeSwitchingDisabled && a.leftPanelVisible === b.leftPanelVisible && a.rightPanelVisible === b.rightPanelVisible && a.disabledPanels === b.disabledPanels && a.page === b.page && a.pageCount === b.pageCount && a.zoom === b.zoom && a.zoomMode === b.zoomMode && a.effectiveZoom === b.effectiveZoom && a.zoomSteps === b.zoomSteps && a.documentFormat === b.documentFormat && a.disabledTools === b.disabledTools && a.activeTool === b.activeTool;
}
function selectSlice2(state) {
  return {
    toolbarVisible: state.toolbarVisible,
    floatingToolbarVisible: state.floatingToolbarVisible,
    fullscreenButtonVisible: state.fullscreenButtonVisible,
    downloadButtonVisible: state.downloadButtonVisible,
    printButtonVisible: state.printButtonVisible,
    isFullscreen: state.isFullscreen,
    theme: state.theme,
    themeSwitchingDisabled: state.themeSwitchingDisabled,
    leftPanelVisible: state.leftPanelVisible,
    rightPanelVisible: state.rightPanelVisible,
    disabledPanels: state.disabledPanels,
    page: state.page,
    pageCount: state.pageCount,
    zoom: state.zoom,
    zoomMode: state.zoomMode,
    effectiveZoom: state.effectiveZoom,
    zoomSteps: state.zoomSteps,
    documentFormat: state.documentFormat,
    disabledTools: state.disabledTools,
    activeTool: state.activeTool
  };
}
function createToolbar() {
  const el = document.createElement("div");
  el.className = "udoc-toolbar";
  el.setAttribute("role", "toolbar");
  el.setAttribute("aria-label", "Document toolbar");
  const leftSection = document.createElement("div");
  leftSection.className = "udoc-toolbar__left";
  const menuBtn = createButton("udoc-toolbar__btn--menu", "Menu", ICON_MENU);
  const pointerSplitBtn = document.createElement("div");
  pointerSplitBtn.className = "udoc-toolbar__split-btn";
  const pointerMainBtn = document.createElement("button");
  pointerMainBtn.className = "udoc-toolbar__btn udoc-toolbar__split-btn-main";
  pointerMainBtn.innerHTML = ICON_TOOL_POINTER;
  const pointerDropBtn = document.createElement("button");
  pointerDropBtn.className = "udoc-toolbar__btn udoc-toolbar__split-btn-drop";
  pointerDropBtn.innerHTML = ICON_CHEVRON_DOWN;
  pointerDropBtn.setAttribute("aria-haspopup", "true");
  pointerDropBtn.setAttribute("aria-expanded", "false");
  const pointerDropdown = document.createElement("div");
  pointerDropdown.className = "udoc-toolbar__split-dropdown";
  pointerDropdown.style.display = "none";
  pointerSplitBtn.append(pointerMainBtn, pointerDropBtn, pointerDropdown);
  const annotateBtn = createButton("udoc-toolbar__btn--tool udoc-toolbar__btn--annotate", "Annotate", ICON_TOOL_ANNOTATE);
  const markupBtn = createButton("udoc-toolbar__btn--tool udoc-toolbar__btn--markup", "Markup", ICON_TOOL_MARKUP);
  leftSection.append(menuBtn, pointerSplitBtn, annotateBtn, markupBtn);
  const centerSection = document.createElement("div");
  centerSection.className = "udoc-toolbar__center";
  centerSection.style.display = "none";
  const navGroup = document.createElement("div");
  navGroup.className = "udoc-toolbar__group";
  const prevBtn = document.createElement("button");
  prevBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  prevBtn.innerHTML = ICON_CHEVRON_LEFT;
  prevBtn.title = "Previous page";
  prevBtn.setAttribute("aria-label", "Previous page");
  const pageInfo = document.createElement("div");
  pageInfo.className = "udoc-toolbar__page-info";
  const pageInput = document.createElement("input");
  pageInput.className = "udoc-toolbar__page-input";
  pageInput.type = "text";
  pageInput.inputMode = "numeric";
  pageInput.setAttribute("aria-label", "Page number");
  const pageTotal = document.createElement("span");
  pageTotal.className = "udoc-toolbar__page-total";
  pageInfo.append(pageInput, pageTotal);
  const nextBtn = document.createElement("button");
  nextBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  nextBtn.innerHTML = ICON_CHEVRON_RIGHT;
  nextBtn.title = "Next page";
  nextBtn.setAttribute("aria-label", "Next page");
  navGroup.append(prevBtn, pageInfo, nextBtn);
  const divider1 = document.createElement("div");
  divider1.className = "udoc-toolbar__divider";
  const zoomGroup = document.createElement("div");
  zoomGroup.className = "udoc-toolbar__group";
  const zoomOutBtn = document.createElement("button");
  zoomOutBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  zoomOutBtn.innerHTML = ICON_ZOOM_OUT;
  zoomOutBtn.title = "Zoom out";
  zoomOutBtn.setAttribute("aria-label", "Zoom out");
  zoomOutBtn.setAttribute("aria-keyshortcuts", "Control+- Meta+-");
  const zoomDropdownContainer = document.createElement("div");
  zoomDropdownContainer.className = "udoc-zoom-dropdown udoc-zoom-dropdown--toolbar";
  const zoomToggle = document.createElement("div");
  zoomToggle.className = "udoc-zoom-dropdown__toggle";
  const zoomInput = document.createElement("input");
  zoomInput.className = "udoc-zoom-dropdown__input";
  zoomInput.type = "text";
  zoomInput.inputMode = "numeric";
  zoomInput.title = "Zoom level";
  zoomInput.setAttribute("aria-label", "Zoom level");
  const zoomChevron = document.createElement("button");
  zoomChevron.className = "udoc-zoom-dropdown__chevron";
  zoomChevron.innerHTML = ICON_CHEVRON_DOWN;
  zoomChevron.title = "Zoom options";
  zoomChevron.setAttribute("aria-label", "Zoom options");
  zoomChevron.setAttribute("aria-haspopup", "listbox");
  zoomChevron.setAttribute("aria-expanded", "false");
  zoomToggle.append(zoomInput, zoomChevron);
  const zoomDropdown = document.createElement("div");
  zoomDropdown.className = "udoc-zoom-dropdown__menu";
  zoomDropdown.setAttribute("role", "listbox");
  zoomDropdown.setAttribute("aria-label", "Zoom levels");
  zoomDropdown.style.display = "none";
  zoomDropdownContainer.append(zoomToggle, zoomDropdown);
  const zoomInBtn = document.createElement("button");
  zoomInBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  zoomInBtn.innerHTML = ICON_ZOOM_IN;
  zoomInBtn.title = "Zoom in";
  zoomInBtn.setAttribute("aria-label", "Zoom in");
  zoomInBtn.setAttribute("aria-keyshortcuts", "Control+= Meta+=");
  zoomGroup.append(zoomOutBtn, zoomDropdownContainer, zoomInBtn);
  const divider2 = document.createElement("div");
  divider2.className = "udoc-toolbar__divider";
  const viewModeMenu = createViewModeMenu();
  centerSection.append(navGroup, divider1, zoomGroup, divider2, viewModeMenu.el);
  const rightSection = document.createElement("div");
  rightSection.className = "udoc-toolbar__right";
  const searchBtn = createButton("udoc-toolbar__btn--search", "Search", ICON_SEARCH, "Control+F Meta+F");
  const commentsBtn = createButton("udoc-toolbar__btn--comments", "Comments", ICON_COMMENTS);
  const printBtn = createButton("udoc-toolbar__btn--print", "Print", ICON_PRINT);
  const downloadBtn = createButton("udoc-toolbar__btn--download", "Download", ICON_DOWNLOAD);
  const themeBtn = createButton("udoc-toolbar__btn--theme", "Toggle theme", ICON_THEME_DARK);
  const fullscreenBtn = createButton("udoc-toolbar__btn--fullscreen", "Fullscreen", ICON_FULLSCREEN);
  const overflowContainer = document.createElement("div");
  overflowContainer.className = "udoc-overflow-menu";
  const overflowBtn = createButton("udoc-toolbar__btn--more", "More", ICON_MORE);
  overflowBtn.setAttribute("aria-haspopup", "true");
  overflowBtn.setAttribute("aria-expanded", "false");
  const overflowDropdown = document.createElement("div");
  overflowDropdown.className = "udoc-overflow-menu__dropdown";
  overflowDropdown.setAttribute("role", "menu");
  overflowDropdown.style.display = "none";
  overflowContainer.append(overflowBtn, overflowDropdown);
  rightSection.append(searchBtn, commentsBtn, printBtn, downloadBtn, themeBtn, fullscreenBtn, overflowContainer);
  el.append(leftSection, centerSection, rightSection);
  const unsubEvents = [];
  let unsubRender = null;
  let viewModeMounted = false;
  let rovingTabindex = null;
  let onDownloadCallback = null;
  let onPrintCallback = null;
  let isOverflowOpen = false;
  const openOverflow = () => {
    if (!isOverflowOpen) {
      isOverflowOpen = true;
      overflowDropdown.style.display = "block";
      overflowBtn.setAttribute("aria-expanded", "true");
    }
  };
  const closeOverflow = () => {
    if (isOverflowOpen) {
      isOverflowOpen = false;
      overflowDropdown.style.display = "none";
      overflowBtn.setAttribute("aria-expanded", "false");
    }
  };
  let isZoomDropdownOpen = false;
  const openZoomDropdown = () => {
    if (!isZoomDropdownOpen) {
      isZoomDropdownOpen = true;
      zoomDropdown.style.display = "block";
      zoomChevron.classList.add("udoc-zoom-dropdown__chevron--active");
      zoomChevron.setAttribute("aria-expanded", "true");
    }
  };
  const closeZoomDropdown = () => {
    if (isZoomDropdownOpen) {
      isZoomDropdownOpen = false;
      zoomDropdown.style.display = "none";
      zoomChevron.classList.remove("udoc-zoom-dropdown__chevron--active");
      zoomChevron.setAttribute("aria-expanded", "false");
    }
  };
  function getDisplayZoom2(slice) {
    if (slice.zoomMode === "custom")
      return slice.zoom;
    return slice.effectiveZoom ?? slice.zoom;
  }
  function mount(container, store, i18n) {
    container.appendChild(el);
    el.setAttribute("aria-label", i18n.t("toolbar.label"));
    menuBtn.setAttribute("aria-label", i18n.t("toolbar.menu"));
    prevBtn.title = i18n.t("toolbar.previousPage");
    prevBtn.setAttribute("aria-label", i18n.t("toolbar.previousPage"));
    pageInput.setAttribute("aria-label", i18n.t("toolbar.pageNumber"));
    nextBtn.title = i18n.t("toolbar.nextPage");
    nextBtn.setAttribute("aria-label", i18n.t("toolbar.nextPage"));
    zoomOutBtn.title = i18n.t("toolbar.zoomOut");
    zoomOutBtn.setAttribute("aria-label", i18n.t("toolbar.zoomOut"));
    zoomInput.title = i18n.t("toolbar.zoomLevel");
    zoomInput.setAttribute("aria-label", i18n.t("toolbar.zoomLevel"));
    zoomChevron.title = i18n.t("toolbar.zoomOptions");
    zoomChevron.setAttribute("aria-label", i18n.t("toolbar.zoomOptions"));
    zoomDropdown.setAttribute("aria-label", i18n.t("toolbar.zoomLevels"));
    zoomInBtn.title = i18n.t("toolbar.zoomIn");
    zoomInBtn.setAttribute("aria-label", i18n.t("toolbar.zoomIn"));
    menuBtn.title = i18n.t("toolbar.menu");
    searchBtn.title = i18n.t("toolbar.search");
    searchBtn.setAttribute("aria-label", i18n.t("toolbar.search"));
    commentsBtn.title = i18n.t("toolbar.comments");
    commentsBtn.setAttribute("aria-label", i18n.t("toolbar.comments"));
    printBtn.title = i18n.t("toolbar.print");
    printBtn.setAttribute("aria-label", i18n.t("toolbar.print"));
    downloadBtn.title = i18n.t("toolbar.download");
    downloadBtn.setAttribute("aria-label", i18n.t("toolbar.download"));
    themeBtn.title = i18n.t("toolbar.darkMode");
    themeBtn.setAttribute("aria-label", i18n.t("toolbar.darkMode"));
    fullscreenBtn.title = i18n.t("toolbar.fullscreen");
    fullscreenBtn.setAttribute("aria-label", i18n.t("toolbar.fullscreen"));
    const ZOOM_MODE_OPTIONS = [
      { mode: "fit-spread-width", label: i18n.t("zoom.fitWidth") },
      { mode: "fit-spread-height", label: i18n.t("zoom.fitHeight") },
      { mode: "fit-spread", label: i18n.t("zoom.fitPage") }
    ];
    function buildZoomDropdown(slice, store2) {
      zoomDropdown.innerHTML = "";
      const stepsSection = document.createElement("div");
      stepsSection.className = "udoc-zoom-dropdown__section";
      for (const step of slice.zoomSteps) {
        const item = document.createElement("button");
        item.className = "udoc-zoom-dropdown__item";
        item.setAttribute("role", "option");
        const stepPercent = Math.round(step * 100);
        const currentPercent = Math.round(slice.zoom * 100);
        const isActive = slice.zoomMode === "custom" && stepPercent === currentPercent;
        if (isActive) {
          item.classList.add("udoc-zoom-dropdown__item--active");
        }
        item.setAttribute("aria-selected", String(isActive));
        item.textContent = `${stepPercent}%`;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          store2.dispatch({ type: "SET_ZOOM", zoom: step });
          closeZoomDropdown();
        });
        stepsSection.appendChild(item);
      }
      zoomDropdown.appendChild(stepsSection);
      const dividerEl = document.createElement("div");
      dividerEl.className = "udoc-zoom-dropdown__divider";
      dividerEl.setAttribute("role", "separator");
      zoomDropdown.appendChild(dividerEl);
      const modeSection = document.createElement("div");
      modeSection.className = "udoc-zoom-dropdown__section";
      for (const opt of ZOOM_MODE_OPTIONS) {
        const item = document.createElement("button");
        item.className = "udoc-zoom-dropdown__item";
        item.setAttribute("role", "option");
        const isActive = slice.zoomMode === opt.mode;
        if (isActive) {
          item.classList.add("udoc-zoom-dropdown__item--active");
        }
        item.setAttribute("aria-selected", String(isActive));
        item.textContent = opt.label;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const state = store2.getState();
          store2.dispatch({ type: "SET_ZOOM_MODE", mode: opt.mode });
          if (state.zoomMode === opt.mode) {
            store2.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page });
          }
          closeZoomDropdown();
        });
        modeSection.appendChild(item);
      }
      zoomDropdown.appendChild(modeSection);
    }
    rovingTabindex = setupRovingTabindex(el, ".udoc-toolbar__btn, .udoc-toolbar__btn--nav, input");
    const SIMPLE_TOOLS = [
      { tool: "pointer", icon: ICON_TOOL_POINTER, labelKey: "tools.pointer" },
      { tool: "hand", icon: ICON_TOOL_HAND, labelKey: "tools.hand" },
      { tool: "zoom", icon: ICON_TOOL_ZOOM, labelKey: "tools.zoom" }
    ];
    let lastSimpleTool = "pointer";
    let isPointerDropdownOpen = false;
    const openPointerDropdown = () => {
      if (!isPointerDropdownOpen) {
        isPointerDropdownOpen = true;
        pointerDropdown.style.display = "block";
        pointerDropBtn.setAttribute("aria-expanded", "true");
      }
    };
    const closePointerDropdown = () => {
      if (isPointerDropdownOpen) {
        isPointerDropdownOpen = false;
        pointerDropdown.style.display = "none";
        pointerDropBtn.setAttribute("aria-expanded", "false");
      }
    };
    function buildPointerDropdown() {
      pointerDropdown.innerHTML = "";
      for (const st of SIMPLE_TOOLS) {
        const item = document.createElement("button");
        item.className = "udoc-toolbar__split-dropdown-item";
        const state = store.getState();
        const isActive = state.activeTool.kind === st.tool;
        if (isActive)
          item.classList.add("udoc-toolbar__split-dropdown-item--active");
        item.innerHTML = `<span class="udoc-toolbar__split-dropdown-icon">${st.icon}</span><span>${i18n.t(st.labelKey)}</span>`;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          lastSimpleTool = st.tool;
          store.dispatch({ type: "SET_ACTIVE_TOOL", tool: { kind: st.tool } });
          closePointerDropdown();
        });
        pointerDropdown.appendChild(item);
      }
    }
    pointerMainBtn.title = i18n.t("tools.pointer");
    pointerMainBtn.setAttribute("aria-label", i18n.t("tools.pointer"));
    pointerDropBtn.title = i18n.t("tools.pointer");
    pointerDropBtn.setAttribute("aria-label", i18n.t("tools.pointer"));
    annotateBtn.title = i18n.t("tools.annotate");
    annotateBtn.setAttribute("aria-label", i18n.t("tools.annotate"));
    markupBtn.title = i18n.t("tools.markup");
    markupBtn.setAttribute("aria-label", i18n.t("tools.markup"));
    const onPointerMainClick = () => {
      store.dispatch({ type: "SET_ACTIVE_TOOL", tool: { kind: lastSimpleTool } });
    };
    pointerMainBtn.addEventListener("click", onPointerMainClick);
    unsubEvents.push(() => pointerMainBtn.removeEventListener("click", onPointerMainClick));
    const onPointerDropClick = (e) => {
      e.stopPropagation();
      if (isPointerDropdownOpen) {
        closePointerDropdown();
      } else {
        buildPointerDropdown();
        openPointerDropdown();
      }
    };
    pointerDropBtn.addEventListener("click", onPointerDropClick);
    unsubEvents.push(() => pointerDropBtn.removeEventListener("click", onPointerDropClick));
    const handlePointerOutsideClick = (e) => {
      if (!pointerSplitBtn.contains(e.target)) {
        closePointerDropdown();
      }
    };
    document.addEventListener("click", handlePointerOutsideClick);
    unsubEvents.push(() => document.removeEventListener("click", handlePointerOutsideClick));
    const onAnnotateClick = () => {
      const sub = store.getState().lastSubToolPerSet.annotate;
      store.dispatch({ type: "SET_ACTIVE_TOOL", tool: { kind: "annotate", sub } });
    };
    annotateBtn.addEventListener("click", onAnnotateClick);
    unsubEvents.push(() => annotateBtn.removeEventListener("click", onAnnotateClick));
    const onMarkupClick = () => {
      const sub = store.getState().lastSubToolPerSet.markup;
      store.dispatch({ type: "SET_ACTIVE_TOOL", tool: { kind: "markup", sub } });
    };
    markupBtn.addEventListener("click", onMarkupClick);
    unsubEvents.push(() => markupBtn.removeEventListener("click", onMarkupClick));
    const onMenuClick = () => {
      const state = store.getState();
      if (state.activePanel !== null && isLeftPanelTab(state.activePanel)) {
        store.dispatch({ type: "CLOSE_PANEL" });
        return;
      }
      const firstTab = LEFT_TABS2.find((t) => !state.disabledPanels.has(t));
      if (firstTab) {
        store.dispatch({ type: "TOGGLE_PANEL", panel: firstTab });
      }
    };
    menuBtn.addEventListener("click", onMenuClick);
    unsubEvents.push(() => menuBtn.removeEventListener("click", onMenuClick));
    const onSearchClick = () => {
      store.dispatch({ type: "TOGGLE_PANEL", panel: "search" });
    };
    searchBtn.addEventListener("click", onSearchClick);
    unsubEvents.push(() => searchBtn.removeEventListener("click", onSearchClick));
    const onCommentsClick = () => {
      store.dispatch({ type: "TOGGLE_PANEL", panel: "comments" });
    };
    commentsBtn.addEventListener("click", onCommentsClick);
    unsubEvents.push(() => commentsBtn.removeEventListener("click", onCommentsClick));
    const onThemeClick = () => {
      const state = store.getState();
      const nextTheme = state.theme === "light" ? "dark" : state.theme === "dark" ? "system" : "light";
      store.dispatch({ type: "SET_THEME", theme: nextTheme });
    };
    themeBtn.addEventListener("click", onThemeClick);
    unsubEvents.push(() => themeBtn.removeEventListener("click", onThemeClick));
    const onFullscreenClick = () => {
      const root = el.closest(".udoc-viewer-root");
      if (!root)
        return;
      if (!document.fullscreenElement) {
        root.requestFullscreen().catch(() => {
        });
      } else {
        document.exitFullscreen().catch(() => {
        });
      }
    };
    fullscreenBtn.addEventListener("click", onFullscreenClick);
    unsubEvents.push(() => fullscreenBtn.removeEventListener("click", onFullscreenClick));
    const onPrintClick = () => {
      onPrintCallback?.();
    };
    printBtn.addEventListener("click", onPrintClick);
    unsubEvents.push(() => printBtn.removeEventListener("click", onPrintClick));
    const onDownloadClick = () => {
      onDownloadCallback?.();
    };
    downloadBtn.addEventListener("click", onDownloadClick);
    unsubEvents.push(() => downloadBtn.removeEventListener("click", onDownloadClick));
    const onFullscreenChange = () => {
      const root = el.closest(".udoc-viewer-root");
      const isFullscreen = document.fullscreenElement === root;
      store.dispatch({ type: "SET_FULLSCREEN", isFullscreen });
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    unsubEvents.push(() => document.removeEventListener("fullscreenchange", onFullscreenChange));
    unsubEvents.push(on(prevBtn, "click", () => {
      const state = store.getState();
      if (state.page > 1) {
        store.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page - 1 });
      }
    }), on(nextBtn, "click", () => {
      const state = store.getState();
      if (state.page < state.pageCount) {
        store.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page + 1 });
      }
    }), on(pageInput, "keydown", (e) => {
      if (e.key === "Enter") {
        const value = parseInt(pageInput.value, 10);
        const state = store.getState();
        if (!isNaN(value) && value >= 1 && value <= state.pageCount) {
          store.dispatch({ type: "NAVIGATE_TO_PAGE", page: value });
        } else {
          pageInput.value = String(state.page);
        }
        pageInput.blur();
      }
    }), on(pageInput, "blur", () => {
      const state = store.getState();
      pageInput.value = String(state.page);
    }));
    unsubEvents.push(on(zoomOutBtn, "click", () => {
      store.dispatch({ type: "ZOOM_OUT" });
    }), on(zoomInBtn, "click", () => {
      store.dispatch({ type: "ZOOM_IN" });
    }), on(zoomInput, "keydown", (e) => {
      if (e.key === "Enter") {
        const value = parseFloat(zoomInput.value);
        const state = store.getState();
        if (!isNaN(value) && value >= 10 && value <= 500) {
          store.dispatch({ type: "SET_ZOOM", zoom: value / 100 });
        } else {
          const displayZoom = state.zoomMode === "custom" ? state.zoom : state.effectiveZoom ?? state.zoom;
          zoomInput.value = formatZoomPercent(displayZoom);
        }
        zoomInput.blur();
      }
    }), on(zoomInput, "focus", () => {
      zoomInput.select();
    }), on(zoomInput, "blur", () => {
      const state = store.getState();
      const displayZoom = state.zoomMode === "custom" ? state.zoom : state.effectiveZoom ?? state.zoom;
      zoomInput.value = formatZoomPercent(displayZoom);
    }));
    unsubEvents.push(on(zoomChevron, "click", (e) => {
      e.stopPropagation();
      if (isZoomDropdownOpen) {
        closeZoomDropdown();
      } else {
        openZoomDropdown();
      }
    }));
    const handleOutsideClick = (e) => {
      if (!zoomDropdownContainer.contains(e.target)) {
        closeZoomDropdown();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    unsubEvents.push(() => document.removeEventListener("click", handleOutsideClick));
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeZoomDropdown();
      }
    };
    document.addEventListener("keydown", handleEscape);
    unsubEvents.push(() => document.removeEventListener("keydown", handleEscape));
    overflowBtn.title = i18n.t("toolbar.more");
    overflowBtn.setAttribute("aria-label", i18n.t("toolbar.more"));
    const onOverflowClick = (e) => {
      e.stopPropagation();
      if (isOverflowOpen) {
        closeOverflow();
      } else {
        openOverflow();
      }
    };
    overflowBtn.addEventListener("click", onOverflowClick);
    unsubEvents.push(() => overflowBtn.removeEventListener("click", onOverflowClick));
    const handleOverflowOutsideClick = (e) => {
      if (!overflowContainer.contains(e.target)) {
        closeOverflow();
      }
    };
    document.addEventListener("click", handleOverflowOutsideClick);
    unsubEvents.push(() => document.removeEventListener("click", handleOverflowOutsideClick));
    const handleOverflowEscape = (e) => {
      if (e.key === "Escape") {
        closeOverflow();
      }
    };
    document.addEventListener("keydown", handleOverflowEscape);
    unsubEvents.push(() => document.removeEventListener("keydown", handleOverflowEscape));
    const applyState = (slice) => {
      el.style.display = slice.toolbarVisible ? "" : "none";
      const allLeftDisabled = LEFT_TABS2.every((t) => slice.disabledPanels.has(t));
      menuBtn.style.display = !slice.leftPanelVisible || allLeftDisabled ? "none" : "";
      searchBtn.style.display = !slice.rightPanelVisible || slice.disabledPanels.has("search") ? "none" : "";
      commentsBtn.style.display = !slice.rightPanelVisible || slice.disabledPanels.has("comments") ? "none" : "";
      themeBtn.style.display = slice.themeSwitchingDisabled ? "none" : "";
      const themeIcon = slice.theme === "light" ? ICON_THEME_DARK : slice.theme === "dark" ? ICON_THEME_SYSTEM : ICON_THEME_LIGHT;
      const themeLabel = slice.theme === "light" ? i18n.t("toolbar.darkMode") : slice.theme === "dark" ? i18n.t("toolbar.systemTheme") : i18n.t("toolbar.lightMode");
      themeBtn.innerHTML = themeIcon;
      themeBtn.setAttribute("aria-label", themeLabel);
      themeBtn.title = themeLabel;
      printBtn.style.display = slice.printButtonVisible ? "" : "none";
      downloadBtn.style.display = slice.downloadButtonVisible ? "" : "none";
      fullscreenBtn.style.display = slice.fullscreenButtonVisible ? "" : "none";
      fullscreenBtn.innerHTML = slice.isFullscreen ? ICON_FULLSCREEN_EXIT : ICON_FULLSCREEN;
      const fsLabel = slice.isFullscreen ? i18n.t("toolbar.exitFullscreen") : i18n.t("toolbar.fullscreen");
      fullscreenBtn.setAttribute("aria-label", fsLabel);
      fullscreenBtn.title = fsLabel;
      {
        overflowDropdown.innerHTML = "";
        const items = [];
        const searchVisible = slice.rightPanelVisible && !slice.disabledPanels.has("search");
        if (searchVisible) {
          items.push({ icon: ICON_SEARCH, label: i18n.t("toolbar.search"), action: onSearchClick });
        }
        const commentsVisible = slice.rightPanelVisible && !slice.disabledPanels.has("comments");
        if (commentsVisible) {
          items.push({ icon: ICON_COMMENTS, label: i18n.t("toolbar.comments"), action: onCommentsClick });
        }
        if (slice.printButtonVisible) {
          items.push({ icon: ICON_PRINT, label: i18n.t("toolbar.print"), action: onPrintClick });
        }
        if (slice.downloadButtonVisible) {
          items.push({ icon: ICON_DOWNLOAD, label: i18n.t("toolbar.download"), action: onDownloadClick });
        }
        if (!slice.themeSwitchingDisabled) {
          items.push({ icon: themeIcon, label: themeLabel, action: onThemeClick });
        }
        if (slice.fullscreenButtonVisible) {
          const fsIcon = slice.isFullscreen ? ICON_FULLSCREEN_EXIT : ICON_FULLSCREEN;
          items.push({ icon: fsIcon, label: fsLabel, action: onFullscreenClick });
        }
        for (const item of items) {
          const menuItem = document.createElement("button");
          menuItem.className = "udoc-overflow-menu__item";
          menuItem.setAttribute("role", "menuitem");
          menuItem.innerHTML = `<span class="udoc-overflow-menu__item-icon">${item.icon}</span><span class="udoc-overflow-menu__item-label">${item.label}</span>`;
          menuItem.addEventListener("click", (e) => {
            e.stopPropagation();
            closeOverflow();
            item.action();
          });
          overflowDropdown.appendChild(menuItem);
        }
      }
      const anySimpleEnabled = !slice.disabledTools.has("pointer") || !slice.disabledTools.has("hand") || !slice.disabledTools.has("zoom");
      pointerSplitBtn.style.display = anySimpleEnabled ? "flex" : "none";
      const formatSupportsAnnotations = slice.documentFormat !== null && ANNOTATION_FORMATS.has(slice.documentFormat);
      annotateBtn.style.display = slice.disabledTools.has("annotate") || !formatSupportsAnnotations ? "none" : "";
      markupBtn.style.display = slice.disabledTools.has("markup") || !formatSupportsAnnotations ? "none" : "";
      {
        const kind = slice.activeTool.kind;
        const simpleActive = kind === "pointer" || kind === "hand" || kind === "zoom";
        pointerSplitBtn.classList.toggle("udoc-toolbar__split-btn--active", simpleActive);
        if (simpleActive) {
          lastSimpleTool = kind;
          const toolDef = SIMPLE_TOOLS.find((t) => t.tool === kind);
          if (toolDef) {
            pointerMainBtn.innerHTML = toolDef.icon;
            pointerMainBtn.title = i18n.t(toolDef.labelKey);
            pointerMainBtn.setAttribute("aria-label", i18n.t(toolDef.labelKey));
          }
        }
        annotateBtn.classList.toggle("udoc-toolbar__btn--tool-active", kind === "annotate");
        markupBtn.classList.toggle("udoc-toolbar__btn--tool-active", kind === "markup");
      }
      const showCenter = slice.toolbarVisible && !slice.floatingToolbarVisible;
      centerSection.style.display = showCenter ? "flex" : "none";
      if (showCenter && !viewModeMounted) {
        viewModeMenu.mount(store, i18n);
        viewModeMounted = true;
      }
      if (showCenter) {
        pageInput.value = String(slice.page);
        pageTotal.textContent = `\xA0/ ${slice.pageCount}`;
        prevBtn.disabled = slice.page <= 1;
        nextBtn.disabled = slice.page >= slice.pageCount;
        if (document.activeElement !== zoomInput) {
          zoomInput.value = formatZoomPercent(getDisplayZoom2(slice));
        }
        buildZoomDropdown(slice, store);
      }
      rovingTabindex?.refresh();
    };
    applyState(selectSlice2(store.getState()));
    unsubRender = subscribeSelector(store, selectSlice2, applyState, {
      equality: sliceEqual2
    });
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    if (rovingTabindex)
      rovingTabindex.destroy();
    for (const off of unsubEvents)
      off();
    if (viewModeMounted)
      viewModeMenu.destroy();
    el.remove();
  }
  function setOnDownload(callback) {
    onDownloadCallback = callback;
  }
  function setOnPrint(callback) {
    onPrintCallback = callback;
  }
  return { el, mount, destroy, setOnDownload, setOnPrint };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/annotation/propertyUtils.js
function parseHexColor(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255
  };
}
function annotationColorToHex(color) {
  const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
  const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
  const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}
function toLineEnding(style) {
  switch (style) {
    case "open":
      return "OpenArrow";
    case "closed":
      return "ClosedArrow";
    default:
      return "None";
  }
}
function fromLineEnding(ending) {
  switch (ending) {
    case "OpenArrow":
    case "ROpenArrow":
      return "open";
    case "ClosedArrow":
    case "RClosedArrow":
      return "closed";
    default:
      return "none";
  }
}
function toBorderStyle(lineStyle) {
  if (lineStyle === "dashed" || lineStyle === "dotted")
    return "dashed";
  return "solid";
}
function fromBorderStyle(borderStyle) {
  switch (borderStyle) {
    case "dashed":
    case "dotted":
      return "dashed";
    default:
      return "solid";
  }
}
var ANNOTATION_EDITABLE_OPTIONS = {
  ink: ["strokeColor", "strokeWidth", "opacity", "lineStyle"],
  line: ["strokeColor", "strokeWidth", "opacity", "lineStyle", "arrowHead"],
  square: ["strokeColor", "fillColor", "strokeWidth", "opacity", "lineStyle"],
  circle: ["strokeColor", "fillColor", "strokeWidth", "opacity", "lineStyle"],
  polygon: ["strokeColor", "fillColor", "strokeWidth", "opacity", "lineStyle"],
  polyLine: ["strokeColor", "strokeWidth", "opacity", "lineStyle"],
  highlight: ["strokeColor", "opacity"],
  underline: ["strokeColor"],
  strikeOut: ["strokeColor"],
  squiggly: ["strokeColor"]
};
function getEditableOptionsForAnnotation(annotation) {
  return ANNOTATION_EDITABLE_OPTIONS[annotation.type] ?? null;
}
function annotationToToolOptions(annotation) {
  const opts = { ...DEFAULT_TOOL_OPTIONS };
  if ("color" in annotation && annotation.color) {
    opts.strokeColor = annotationColorToHex(annotation.color);
  }
  if ("interiorColor" in annotation && annotation.interiorColor) {
    opts.fillColor = annotationColorToHex(annotation.interiorColor);
  } else {
    opts.fillColor = null;
  }
  if ("borderWidth" in annotation && annotation.borderWidth != null) {
    opts.strokeWidth = annotation.borderWidth;
  }
  if ("opacity" in annotation && annotation.opacity != null) {
    opts.opacity = annotation.opacity;
  }
  if ("borderStyle" in annotation) {
    opts.lineStyle = fromBorderStyle(annotation.borderStyle);
  }
  if ("startEnding" in annotation) {
    opts.arrowHeadStart = fromLineEnding(annotation.startEnding);
  }
  if ("endEnding" in annotation) {
    opts.arrowHeadEnd = fromLineEnding(annotation.endEnding);
  }
  return opts;
}
function applyToolOptionsToAnnotation(annotation, changed) {
  const updated = { ...annotation };
  if ("strokeColor" in changed && changed.strokeColor != null) {
    updated.color = parseHexColor(changed.strokeColor);
  }
  if ("fillColor" in changed) {
    updated.interiorColor = changed.fillColor ? parseHexColor(changed.fillColor) : void 0;
  }
  if ("strokeWidth" in changed && changed.strokeWidth != null) {
    updated.borderWidth = changed.strokeWidth;
  }
  if ("opacity" in changed && changed.opacity != null) {
    updated.opacity = changed.opacity;
  }
  if ("lineStyle" in changed && changed.lineStyle != null) {
    updated.borderStyle = toBorderStyle(changed.lineStyle);
  }
  if ("arrowHeadStart" in changed && changed.arrowHeadStart != null) {
    updated.startEnding = toLineEnding(changed.arrowHeadStart);
  }
  if ("arrowHeadEnd" in changed && changed.arrowHeadEnd != null) {
    updated.endEnding = toLineEnding(changed.arrowHeadEnd);
  }
  return updated;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/NumberInput.js
function createNumberInput(config) {
  let currentValue = config.value;
  const el = document.createElement("button");
  el.className = "udoc-number-input__trigger";
  el.title = config.label;
  el.setAttribute("aria-label", `${config.label} ${config.formatValue(currentValue)}`);
  if (config.icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = "udoc-number-input__icon";
    iconSpan.innerHTML = config.icon;
    el.appendChild(iconSpan);
  }
  const valueSpan = document.createElement("span");
  valueSpan.className = "udoc-number-input__value";
  valueSpan.textContent = config.formatValue(currentValue);
  const arrow = document.createElement("span");
  arrow.className = "udoc-subtoolbar__dropdown-arrow";
  arrow.textContent = "\u25BE";
  el.append(valueSpan, arrow);
  const panel = document.createElement("div");
  panel.className = "udoc-number-input-panel";
  panel.addEventListener("click", (e) => e.stopPropagation());
  const slider = document.createElement("input");
  slider.type = "range";
  slider.className = "udoc-number-input-panel__slider";
  slider.min = String(config.min);
  slider.max = String(config.max);
  slider.step = String(config.step);
  slider.value = String(currentValue);
  slider.setAttribute("aria-label", config.label);
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "udoc-number-input-panel__text";
  textInput.value = config.formatValue(currentValue);
  textInput.setAttribute("aria-label", config.label);
  panel.append(slider, textInput);
  function clamp3(v) {
    return Math.min(config.max, Math.max(config.min, v));
  }
  function roundToStep(v) {
    return Math.round(v / config.step) * config.step;
  }
  function setValue(v, fromSlider = false) {
    currentValue = roundToStep(clamp3(v));
    valueSpan.textContent = config.formatValue(currentValue);
    el.setAttribute("aria-label", `${config.label} ${config.formatValue(currentValue)}`);
    if (!fromSlider)
      slider.value = String(currentValue);
    textInput.value = config.formatValue(currentValue);
    config.onChange(currentValue);
  }
  slider.addEventListener("input", () => {
    setValue(parseFloat(slider.value), true);
  });
  function commitTextInput() {
    const parsed = config.parseValue(textInput.value);
    if (parsed !== null && !isNaN(parsed)) {
      setValue(parsed);
    } else {
      textInput.value = config.formatValue(currentValue);
    }
  }
  textInput.addEventListener("blur", commitTextInput);
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTextInput();
    }
  });
  function update(value) {
    currentValue = roundToStep(clamp3(value));
    valueSpan.textContent = config.formatValue(currentValue);
    el.setAttribute("aria-label", `${config.label} ${config.formatValue(currentValue)}`);
    slider.value = String(currentValue);
    textInput.value = config.formatValue(currentValue);
  }
  function isOpen() {
    return panel.classList.contains("udoc-number-input-panel--open");
  }
  function open(anchorRect, containerRect) {
    panel.style.left = `${anchorRect.left - containerRect.left}px`;
    panel.classList.add("udoc-number-input-panel--open");
  }
  function close() {
    panel.classList.remove("udoc-number-input-panel--open");
  }
  function destroy() {
    el.remove();
    panel.remove();
  }
  return { el, panel, update, isOpen, open, close, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/ColorSelect.js
var COLOR_PRESETS = [
  { hex: "#ff0000", name: "Red" },
  { hex: "#ff8800", name: "Orange" },
  { hex: "#ffcc00", name: "Yellow" },
  { hex: "#88cc00", name: "Lime" },
  { hex: "#00cc00", name: "Green" },
  { hex: "#00cccc", name: "Cyan" },
  { hex: "#0088ff", name: "Blue" },
  { hex: "#8800ff", name: "Purple" },
  { hex: "#ff00cc", name: "Pink" },
  { hex: "#884400", name: "Brown" },
  { hex: "#000000", name: "Black" },
  { hex: "#444444", name: "Dark Gray" },
  { hex: "#999999", name: "Gray" },
  { hex: "#cccccc", name: "Light Gray" },
  { hex: "#ffffff", name: "White" }
];
function createColorSelect(config) {
  let currentColor = null;
  const el = document.createElement("button");
  el.className = "udoc-subtoolbar__dropdown-trigger";
  el.title = config.label;
  const swatch = document.createElement("span");
  swatch.className = "udoc-subtoolbar__color-swatch";
  const arrow = document.createElement("span");
  arrow.className = "udoc-subtoolbar__dropdown-arrow";
  arrow.textContent = "\u25BE";
  el.append(swatch, arrow);
  const panel = document.createElement("div");
  panel.className = "udoc-color-panel";
  panel.addEventListener("click", (e) => e.stopPropagation());
  function updateSwatch(color) {
    swatch.classList.remove("udoc-subtoolbar__color-swatch--stroke", "udoc-subtoolbar__color-swatch--stroke-none", "udoc-subtoolbar__color-swatch--fill", "udoc-subtoolbar__color-swatch--fill-none");
    swatch.style.removeProperty("--swatch-color");
    if (config.variant === "stroke") {
      swatch.classList.add("udoc-subtoolbar__color-swatch--stroke");
      if (color)
        swatch.style.setProperty("--swatch-color", color);
      else
        swatch.classList.add("udoc-subtoolbar__color-swatch--stroke-none");
    } else {
      swatch.classList.add("udoc-subtoolbar__color-swatch--fill");
      if (color)
        swatch.style.setProperty("--swatch-color", color);
      else
        swatch.classList.add("udoc-subtoolbar__color-swatch--fill-none");
    }
    el.setAttribute("aria-label", `${config.label} ${color ?? "none"}`);
  }
  function rebuildPanel(color) {
    panel.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "udoc-color-panel__grid";
    grid.classList.add(config.variant === "stroke" ? "udoc-color-panel__grid--stroke" : "udoc-color-panel__grid--fill");
    const noBtn = document.createElement("button");
    noBtn.className = "udoc-color-panel__swatch udoc-color-panel__swatch--none";
    noBtn.classList.add(config.variant === "stroke" ? "udoc-color-panel__swatch--none-stroke" : "udoc-color-panel__swatch--none-fill");
    if (color === null)
      noBtn.classList.add("udoc-color-panel__swatch--active");
    noBtn.title = config.noneLabel;
    noBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      config.onSelect?.();
      config.onChange(null);
    });
    grid.appendChild(noBtn);
    for (const preset of COLOR_PRESETS) {
      const sw = document.createElement("button");
      sw.className = "udoc-color-panel__swatch";
      if (color === preset.hex)
        sw.classList.add("udoc-color-panel__swatch--active");
      sw.style.setProperty("--swatch-color", preset.hex);
      sw.title = preset.name;
      sw.addEventListener("click", (e) => {
        e.stopPropagation();
        config.onSelect?.();
        config.onChange(preset.hex);
      });
      grid.appendChild(sw);
    }
    panel.appendChild(grid);
  }
  function update(color) {
    currentColor = color;
    updateSwatch(color);
    rebuildPanel(color);
  }
  function open(anchorRect, containerRect) {
    panel.style.left = `${anchorRect.left - containerRect.left}px`;
    panel.classList.add("udoc-color-panel--open");
  }
  function close() {
    panel.classList.remove("udoc-color-panel--open");
  }
  function isOpen() {
    return panel.classList.contains("udoc-color-panel--open");
  }
  function destroy() {
    el.remove();
    panel.remove();
  }
  updateSwatch(currentColor);
  rebuildPanel(currentColor);
  return { el, panel, update, open, close, isOpen, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/SubToolbar.js
var ANNOTATE_SUB_TOOLS = [
  { id: "select", icon: ICON_SUBTOOL_SELECT, labelKey: "tools.select" },
  { id: "freehand", icon: ICON_SUBTOOL_FREEHAND, labelKey: "tools.freehand" },
  { id: "line", icon: ICON_SUBTOOL_LINE, labelKey: "tools.line" },
  { id: "arrow", icon: ICON_SUBTOOL_ARROW, labelKey: "tools.arrow" },
  { id: "rectangle", icon: ICON_SUBTOOL_RECTANGLE, labelKey: "tools.rectangle" },
  { id: "ellipse", icon: ICON_SUBTOOL_ELLIPSE, labelKey: "tools.ellipse" },
  { id: "polygon", icon: ICON_SUBTOOL_POLYGON, labelKey: "tools.polygon" },
  { id: "polyline", icon: ICON_SUBTOOL_POLYLINE, labelKey: "tools.polyline" }
];
var MARKUP_SUB_TOOLS = [
  { id: "select", icon: ICON_SUBTOOL_SELECT, labelKey: "tools.select" },
  { id: "highlight", icon: ICON_SUBTOOL_HIGHLIGHT, labelKey: "tools.highlight" },
  { id: "underline", icon: ICON_SUBTOOL_UNDERLINE, labelKey: "tools.underline" },
  { id: "strikethrough", icon: ICON_SUBTOOL_STRIKETHROUGH, labelKey: "tools.strikethrough" },
  { id: "squiggly", icon: ICON_SUBTOOL_SQUIGGLY, labelKey: "tools.squiggly" }
];
var SUB_TOOLS_MAP = { annotate: ANNOTATE_SUB_TOOLS, markup: MARKUP_SUB_TOOLS };
var TOOL_OPTIONS_CONFIG = {
  freehand: ["strokeColor", "strokeWidth", "opacity"],
  line: ["strokeColor", "strokeWidth", "opacity", "lineStyle"],
  arrow: ["strokeColor", "strokeWidth", "opacity", "lineStyle", "arrowHead"],
  rectangle: ["strokeColor", "fillColor", "strokeWidth", "opacity", "lineStyle"],
  ellipse: ["strokeColor", "fillColor", "strokeWidth", "opacity", "lineStyle"],
  polygon: ["strokeColor", "fillColor", "strokeWidth", "opacity", "lineStyle"],
  polyline: ["strokeColor", "strokeWidth", "opacity", "lineStyle"],
  highlight: ["strokeColor", "opacity"],
  underline: ["strokeColor"],
  strikethrough: ["strokeColor"],
  squiggly: ["strokeColor"]
};
var LINE_STYLE_DEFS = [
  { id: "solid", icon: ICON_LINE_SOLID, labelKey: "tools.lineStyleSolid" },
  { id: "dashed", icon: ICON_LINE_DASHED, labelKey: "tools.lineStyleDashed" },
  { id: "dotted", icon: ICON_LINE_DOTTED, labelKey: "tools.lineStyleDotted" }
];
var ARROW_HEAD_DEFS = [
  { id: "none", icon: ICON_ARROW_NONE, labelKey: "tools.arrowHeadNone" },
  { id: "open", icon: ICON_ARROW_OPEN, labelKey: "tools.arrowHeadOpen" },
  { id: "closed", icon: ICON_ARROW_CLOSED, labelKey: "tools.arrowHeadClosed" }
];
function resolveAnnotation(s) {
  const sel = s.selectedAnnotation;
  if (!sel)
    return null;
  const list = s.pageAnnotations.get(sel.pageIndex);
  if (!list || sel.annotationIndex >= list.length)
    return null;
  return list[sel.annotationIndex];
}
function selectSlice3(s) {
  const at = s.activeTool;
  return {
    activeTool: at,
    activeSubTool: at.kind === "annotate" || at.kind === "markup" ? at.sub : null,
    toolOptions: s.toolOptions,
    selectedAnnotation: s.selectedAnnotation,
    selectedAnnotationObj: resolveAnnotation(s)
  };
}
function sliceEqual3(a, b) {
  return a.activeTool === b.activeTool && a.activeSubTool === b.activeSubTool && a.toolOptions === b.toolOptions && a.selectedAnnotation === b.selectedAnnotation && a.selectedAnnotationObj === b.selectedAnnotationObj;
}
function createSubToolbar() {
  const el = document.createElement("div");
  el.className = "udoc-subtoolbar";
  el.setAttribute("role", "toolbar");
  el.style.display = "none";
  const toolsSection = document.createElement("div");
  toolsSection.className = "udoc-subtoolbar__tools";
  const dividerEl = document.createElement("div");
  dividerEl.className = "udoc-subtoolbar__divider";
  const optionsSection = document.createElement("div");
  optionsSection.className = "udoc-subtoolbar__options";
  const undoDivider = document.createElement("div");
  undoDivider.className = "udoc-subtoolbar__divider";
  undoDivider.style.display = "none";
  const undoSection = document.createElement("div");
  undoSection.className = "udoc-subtoolbar__undo";
  undoSection.style.display = "none";
  el.append(toolsSection, dividerEl, optionsSection, undoDivider, undoSection);
  let containerRef = null;
  let unsubRender = null;
  const currentToolBtns = /* @__PURE__ */ new Map();
  let currentToolSet = null;
  let builtSubTool = null;
  let builtForAnnotationType = null;
  let activeSubTool = null;
  let openPanel = null;
  let strokeColorSelect = null;
  let fillColorSelect = null;
  let strokeWidthInput = null;
  let opacityInput = null;
  let fontSizeInput = null;
  let deleteBtn = null;
  const lineStylePanel = document.createElement("div");
  lineStylePanel.className = "udoc-linestyle-panel";
  lineStylePanel.addEventListener("click", (e) => e.stopPropagation());
  const arrowHeadPanel = document.createElement("div");
  arrowHeadPanel.className = "udoc-arrowhead-panel";
  arrowHeadPanel.addEventListener("click", (e) => e.stopPropagation());
  let lineStyleTrigger = null;
  let arrowHeadTrigger = null;
  function closeAllPanels() {
    openPanel = null;
    strokeColorSelect?.close();
    fillColorSelect?.close();
    lineStylePanel.classList.remove("udoc-linestyle-panel--open");
    arrowHeadPanel.classList.remove("udoc-arrowhead-panel--open");
    strokeWidthInput?.close();
    opacityInput?.close();
    fontSizeInput?.close();
  }
  const onDocumentClick = () => closeAllPanels();
  function openPanelAt(key, trigger) {
    const wasOpen = openPanel === key;
    closeAllPanels();
    if (wasOpen)
      return;
    const rect = trigger.getBoundingClientRect();
    const cRect = containerRef.getBoundingClientRect();
    const left = `${rect.left - cRect.left}px`;
    if (key === "strokeColor")
      strokeColorSelect?.open(rect, cRect);
    else if (key === "fillColor")
      fillColorSelect?.open(rect, cRect);
    else if (key === "strokeWidth")
      strokeWidthInput?.open(rect, cRect);
    else if (key === "opacity")
      opacityInput?.open(rect, cRect);
    else if (key === "fontSize")
      fontSizeInput?.open(rect, cRect);
    else if (key === "lineStyle") {
      lineStylePanel.style.left = left;
      lineStylePanel.classList.add("udoc-linestyle-panel--open");
    } else if (key === "arrowHead") {
      arrowHeadPanel.style.left = left;
      arrowHeadPanel.classList.add("udoc-arrowhead-panel--open");
    }
    openPanel = key;
  }
  let editingAnnotation = false;
  function dispatchOpt(store, key, value) {
    if (editingAnnotation) {
      const state = store.getState();
      const sel = state.selectedAnnotation;
      if (!sel)
        return;
      const list = state.pageAnnotations.get(sel.pageIndex);
      if (!list || sel.annotationIndex >= list.length)
        return;
      const annotation = list[sel.annotationIndex];
      const updated = applyToolOptionsToAnnotation(annotation, { [key]: value });
      store.dispatch({
        type: "UPDATE_ANNOTATION",
        pageIndex: sel.pageIndex,
        annotationIndex: sel.annotationIndex,
        annotation: updated
      });
    } else if (activeSubTool) {
      store.dispatch({ type: "SET_TOOL_OPTION", subTool: activeSubTool, key, value });
    }
  }
  function mount(container, store, i18n, undoManager) {
    containerRef = container;
    container.appendChild(el);
    container.appendChild(lineStylePanel);
    container.appendChild(arrowHeadPanel);
    el.setAttribute("aria-label", i18n.t("tools.subtoolbar"));
    document.addEventListener("click", onDocumentClick);
    if (undoManager) {
      const undoBtn = document.createElement("button");
      undoBtn.className = "udoc-subtoolbar__btn";
      undoBtn.innerHTML = ICON_UNDO;
      undoBtn.title = i18n.t("tools.undo");
      undoBtn.setAttribute("aria-label", i18n.t("tools.undo"));
      undoBtn.disabled = true;
      undoBtn.addEventListener("click", () => undoManager.undo());
      const redoBtn = document.createElement("button");
      redoBtn.className = "udoc-subtoolbar__btn";
      redoBtn.innerHTML = ICON_REDO;
      redoBtn.title = i18n.t("tools.redo");
      redoBtn.setAttribute("aria-label", i18n.t("tools.redo"));
      redoBtn.disabled = true;
      redoBtn.addEventListener("click", () => undoManager.redo());
      undoSection.append(undoBtn, redoBtn);
      undoSection.style.display = "";
      undoDivider.style.display = "";
      undoManager.subscribe(() => {
        undoBtn.disabled = !undoManager.canUndo();
        redoBtn.disabled = !undoManager.canRedo();
      });
    }
    const applyState = (slice) => {
      const kind = slice.activeTool.kind;
      const visible = kind === "annotate" || kind === "markup";
      el.style.display = visible ? "flex" : "none";
      if (!visible) {
        closeAllPanels();
        return;
      }
      const toolSet = kind;
      const subTools = SUB_TOOLS_MAP[toolSet];
      if (!subTools)
        return;
      if (currentToolSet !== toolSet) {
        currentToolSet = toolSet;
        toolsSection.innerHTML = "";
        currentToolBtns.clear();
        for (const def of subTools) {
          const btn = document.createElement("button");
          btn.className = "udoc-subtoolbar__btn";
          btn.innerHTML = def.icon;
          btn.title = i18n.t(def.labelKey);
          btn.setAttribute("aria-label", i18n.t(def.labelKey));
          btn.addEventListener("click", () => {
            const at = store.getState().activeTool;
            const currentSub = at.kind === "annotate" || at.kind === "markup" ? at.sub : null;
            if (currentSub === def.id && (def.id === "polygon" || def.id === "polyline")) {
              document.dispatchEvent(new Event("udoc-finish-drawing"));
            } else {
              store.dispatch({ type: "SET_SUB_TOOL", subTool: def.id });
            }
          });
          toolsSection.appendChild(btn);
          currentToolBtns.set(def.id, btn);
        }
      }
      for (const [id, btn] of currentToolBtns) {
        btn.classList.toggle("udoc-subtoolbar__btn--active", id === slice.activeSubTool);
      }
      if (!slice.activeSubTool) {
        optionsSection.innerHTML = "";
        builtSubTool = null;
        builtForAnnotationType = null;
        editingAnnotation = false;
        return;
      }
      activeSubTool = slice.activeSubTool;
      const selAnnotation = slice.activeSubTool === "select" ? slice.selectedAnnotationObj : null;
      const selAnnotationType = selAnnotation ? selAnnotation.type : null;
      const selEditableKeys = selAnnotation ? getEditableOptionsForAnnotation(selAnnotation) : null;
      if (slice.activeSubTool === "select" && selAnnotation && selEditableKeys) {
        editingAnnotation = true;
        const opts = annotationToToolOptions(selAnnotation);
        if (builtSubTool !== "select" || builtForAnnotationType !== selAnnotationType) {
          closeAllPanels();
          buildControlsForAnnotation(selEditableKeys, opts, store, i18n);
          builtSubTool = "select";
          builtForAnnotationType = selAnnotationType;
        }
        updateValues(opts, store, i18n);
        if (deleteBtn)
          deleteBtn.disabled = false;
      } else {
        editingAnnotation = false;
        const opts = slice.toolOptions[slice.activeSubTool] ?? { ...DEFAULT_TOOL_OPTIONS };
        if (builtSubTool !== slice.activeSubTool || builtForAnnotationType !== null) {
          closeAllPanels();
          buildControls(slice.activeSubTool, opts, store, i18n);
          builtSubTool = slice.activeSubTool;
          builtForAnnotationType = null;
        }
        updateValues(opts, store, i18n);
        if (deleteBtn) {
          deleteBtn.disabled = !slice.selectedAnnotation;
        }
      }
    };
    applyState(selectSlice3(store.getState()));
    unsubRender = subscribeSelector(store, selectSlice3, applyState, { equality: sliceEqual3 });
  }
  function buildControls(subTool, opts, store, i18n) {
    optionsSection.innerHTML = "";
    lineStyleTrigger = null;
    arrowHeadTrigger = null;
    deleteBtn = null;
    if (subTool === "select") {
      deleteBtn = document.createElement("button");
      deleteBtn.className = "udoc-subtoolbar__btn udoc-subtoolbar__btn--delete";
      deleteBtn.innerHTML = ICON_DELETE;
      deleteBtn.title = i18n.t("tools.deleteAnnotation");
      deleteBtn.setAttribute("aria-label", i18n.t("tools.deleteAnnotation"));
      deleteBtn.disabled = true;
      deleteBtn.addEventListener("click", () => {
        const sel = store.getState().selectedAnnotation;
        if (sel) {
          store.dispatch({
            type: "REMOVE_ANNOTATION",
            pageIndex: sel.pageIndex,
            annotationIndex: sel.annotationIndex
          });
        }
      });
      optionsSection.appendChild(deleteBtn);
      return;
    }
    const supported = TOOL_OPTIONS_CONFIG[subTool];
    if (!supported || supported.length === 0)
      return;
    for (const optKey of supported) {
      if (optKey === "strokeColor") {
        if (!strokeColorSelect) {
          strokeColorSelect = createColorSelect({
            variant: "stroke",
            label: i18n.t("tools.strokeColor"),
            noneLabel: i18n.t("tools.noFill"),
            onSelect: () => closeAllPanels(),
            onChange: (color) => dispatchOpt(store, "strokeColor", color)
          });
          containerRef.appendChild(strokeColorSelect.panel);
          strokeColorSelect.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("strokeColor", strokeColorSelect.el);
          });
        }
        optionsSection.appendChild(strokeColorSelect.el);
      } else if (optKey === "fillColor") {
        if (!fillColorSelect) {
          fillColorSelect = createColorSelect({
            variant: "fill",
            label: i18n.t("tools.fillColor"),
            noneLabel: i18n.t("tools.noFill"),
            onSelect: () => closeAllPanels(),
            onChange: (color) => dispatchOpt(store, "fillColor", color)
          });
          containerRef.appendChild(fillColorSelect.panel);
          fillColorSelect.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("fillColor", fillColorSelect.el);
          });
        }
        optionsSection.appendChild(fillColorSelect.el);
      } else if (optKey === "strokeWidth") {
        if (!strokeWidthInput) {
          strokeWidthInput = createNumberInput({
            min: 0.5,
            max: 12,
            step: 0.5,
            value: opts.strokeWidth,
            icon: ICON_STROKE_WIDTH,
            formatValue: (v) => `${v}pt`,
            parseValue: (s) => {
              const n = parseFloat(s.replace(/pt$/i, ""));
              return isNaN(n) ? null : n;
            },
            label: i18n.t("tools.strokeWidth"),
            onChange: (v) => dispatchOpt(store, "strokeWidth", v)
          });
          containerRef.appendChild(strokeWidthInput.panel);
          strokeWidthInput.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("strokeWidth", strokeWidthInput.el);
          });
        }
        optionsSection.appendChild(strokeWidthInput.el);
      } else if (optKey === "opacity") {
        if (!opacityInput) {
          opacityInput = createNumberInput({
            min: 10,
            max: 100,
            step: 10,
            value: Math.round(opts.opacity * 100),
            icon: ICON_OPACITY,
            formatValue: (v) => `${Math.round(v)}%`,
            parseValue: (s) => {
              const n = parseFloat(s.replace(/%$/i, ""));
              return isNaN(n) ? null : n;
            },
            label: i18n.t("tools.opacity"),
            onChange: (v) => dispatchOpt(store, "opacity", v / 100)
          });
          containerRef.appendChild(opacityInput.panel);
          opacityInput.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("opacity", opacityInput.el);
          });
        }
        optionsSection.appendChild(opacityInput.el);
      } else if (optKey === "fontSize") {
        if (!fontSizeInput) {
          fontSizeInput = createNumberInput({
            min: 8,
            max: 144,
            step: 1,
            value: opts.fontSize,
            icon: ICON_FONT_SIZE,
            formatValue: (v) => `${v}pt`,
            parseValue: (s) => {
              const n = parseFloat(s.replace(/pt$/i, ""));
              return isNaN(n) ? null : n;
            },
            label: i18n.t("tools.fontSize"),
            onChange: (v) => dispatchOpt(store, "fontSize", v)
          });
          containerRef.appendChild(fontSizeInput.panel);
          fontSizeInput.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("fontSize", fontSizeInput.el);
          });
        }
        optionsSection.appendChild(fontSizeInput.el);
      } else if (optKey === "lineStyle") {
        lineStyleTrigger = document.createElement("button");
        lineStyleTrigger.className = "udoc-subtoolbar__dropdown-trigger udoc-subtoolbar__dropdown-trigger--icon";
        lineStyleTrigger.title = i18n.t("tools.lineStyle");
        const arrow = document.createElement("span");
        arrow.className = "udoc-subtoolbar__dropdown-arrow";
        arrow.textContent = "\u25BE";
        lineStyleTrigger.appendChild(arrow);
        lineStyleTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          openPanelAt("lineStyle", lineStyleTrigger);
        });
        optionsSection.appendChild(lineStyleTrigger);
      } else if (optKey === "arrowHead") {
        arrowHeadTrigger = document.createElement("button");
        arrowHeadTrigger.className = "udoc-subtoolbar__dropdown-trigger udoc-subtoolbar__dropdown-trigger--icon";
        arrowHeadTrigger.title = i18n.t("tools.arrowHeadEnd");
        const arrow = document.createElement("span");
        arrow.className = "udoc-subtoolbar__dropdown-arrow";
        arrow.textContent = "\u25BE";
        arrowHeadTrigger.appendChild(arrow);
        arrowHeadTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          openPanelAt("arrowHead", arrowHeadTrigger);
        });
        optionsSection.appendChild(arrowHeadTrigger);
      }
    }
  }
  function buildControlsForAnnotation(editableKeys, opts, store, i18n) {
    optionsSection.innerHTML = "";
    lineStyleTrigger = null;
    arrowHeadTrigger = null;
    deleteBtn = null;
    for (const optKey of editableKeys) {
      if (optKey === "strokeColor") {
        if (!strokeColorSelect) {
          strokeColorSelect = createColorSelect({
            variant: "stroke",
            label: i18n.t("tools.strokeColor"),
            noneLabel: i18n.t("tools.noFill"),
            onSelect: () => closeAllPanels(),
            onChange: (color) => dispatchOpt(store, "strokeColor", color)
          });
          containerRef.appendChild(strokeColorSelect.panel);
          strokeColorSelect.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("strokeColor", strokeColorSelect.el);
          });
        }
        optionsSection.appendChild(strokeColorSelect.el);
      } else if (optKey === "fillColor") {
        if (!fillColorSelect) {
          fillColorSelect = createColorSelect({
            variant: "fill",
            label: i18n.t("tools.fillColor"),
            noneLabel: i18n.t("tools.noFill"),
            onSelect: () => closeAllPanels(),
            onChange: (color) => dispatchOpt(store, "fillColor", color)
          });
          containerRef.appendChild(fillColorSelect.panel);
          fillColorSelect.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("fillColor", fillColorSelect.el);
          });
        }
        optionsSection.appendChild(fillColorSelect.el);
      } else if (optKey === "strokeWidth") {
        if (!strokeWidthInput) {
          strokeWidthInput = createNumberInput({
            min: 0.5,
            max: 12,
            step: 0.5,
            value: opts.strokeWidth,
            icon: ICON_STROKE_WIDTH,
            formatValue: (v) => `${v}pt`,
            parseValue: (s) => {
              const n = parseFloat(s.replace(/pt$/i, ""));
              return isNaN(n) ? null : n;
            },
            label: i18n.t("tools.strokeWidth"),
            onChange: (v) => dispatchOpt(store, "strokeWidth", v)
          });
          containerRef.appendChild(strokeWidthInput.panel);
          strokeWidthInput.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("strokeWidth", strokeWidthInput.el);
          });
        }
        optionsSection.appendChild(strokeWidthInput.el);
      } else if (optKey === "opacity") {
        if (!opacityInput) {
          opacityInput = createNumberInput({
            min: 10,
            max: 100,
            step: 10,
            value: Math.round(opts.opacity * 100),
            icon: ICON_OPACITY,
            formatValue: (v) => `${Math.round(v)}%`,
            parseValue: (s) => {
              const n = parseFloat(s.replace(/%$/i, ""));
              return isNaN(n) ? null : n;
            },
            label: i18n.t("tools.opacity"),
            onChange: (v) => dispatchOpt(store, "opacity", v / 100)
          });
          containerRef.appendChild(opacityInput.panel);
          opacityInput.el.addEventListener("click", (e) => {
            e.stopPropagation();
            openPanelAt("opacity", opacityInput.el);
          });
        }
        optionsSection.appendChild(opacityInput.el);
      } else if (optKey === "lineStyle") {
        lineStyleTrigger = document.createElement("button");
        lineStyleTrigger.className = "udoc-subtoolbar__dropdown-trigger udoc-subtoolbar__dropdown-trigger--icon";
        lineStyleTrigger.title = i18n.t("tools.lineStyle");
        const arrow = document.createElement("span");
        arrow.className = "udoc-subtoolbar__dropdown-arrow";
        arrow.textContent = "\u25BE";
        lineStyleTrigger.appendChild(arrow);
        lineStyleTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          openPanelAt("lineStyle", lineStyleTrigger);
        });
        optionsSection.appendChild(lineStyleTrigger);
      } else if (optKey === "arrowHead") {
        arrowHeadTrigger = document.createElement("button");
        arrowHeadTrigger.className = "udoc-subtoolbar__dropdown-trigger udoc-subtoolbar__dropdown-trigger--icon";
        arrowHeadTrigger.title = i18n.t("tools.arrowHeadEnd");
        const arrow = document.createElement("span");
        arrow.className = "udoc-subtoolbar__dropdown-arrow";
        arrow.textContent = "\u25BE";
        arrowHeadTrigger.appendChild(arrow);
        arrowHeadTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          openPanelAt("arrowHead", arrowHeadTrigger);
        });
        optionsSection.appendChild(arrowHeadTrigger);
      }
    }
    deleteBtn = document.createElement("button");
    deleteBtn.className = "udoc-subtoolbar__btn udoc-subtoolbar__btn--delete";
    deleteBtn.innerHTML = ICON_DELETE;
    deleteBtn.title = i18n.t("tools.deleteAnnotation");
    deleteBtn.setAttribute("aria-label", i18n.t("tools.deleteAnnotation"));
    deleteBtn.addEventListener("click", () => {
      const sel = store.getState().selectedAnnotation;
      if (sel) {
        store.dispatch({
          type: "REMOVE_ANNOTATION",
          pageIndex: sel.pageIndex,
          annotationIndex: sel.annotationIndex
        });
      }
    });
    optionsSection.appendChild(deleteBtn);
  }
  function updateValues(opts, store, i18n) {
    strokeColorSelect?.update(opts.strokeColor);
    fillColorSelect?.update(opts.fillColor);
    strokeWidthInput?.update(opts.strokeWidth);
    opacityInput?.update(Math.round(opts.opacity * 100));
    fontSizeInput?.update(opts.fontSize);
    if (lineStyleTrigger) {
      const def = LINE_STYLE_DEFS.find((s) => s.id === opts.lineStyle) ?? LINE_STYLE_DEFS[0];
      const arrowEl = lineStyleTrigger.lastElementChild;
      lineStyleTrigger.innerHTML = def.icon;
      if (arrowEl)
        lineStyleTrigger.appendChild(arrowEl);
      lineStyleTrigger.setAttribute("aria-label", `${i18n.t("tools.lineStyle")}: ${i18n.t(def.labelKey)}`);
    }
    rebuildLineStylePanel(opts.lineStyle, store, i18n);
    if (arrowHeadTrigger) {
      const endDef = ARROW_HEAD_DEFS.find((a) => a.id === opts.arrowHeadEnd) ?? ARROW_HEAD_DEFS[0];
      const arrowEl = arrowHeadTrigger.lastElementChild;
      arrowHeadTrigger.innerHTML = endDef.icon;
      if (arrowEl)
        arrowHeadTrigger.appendChild(arrowEl);
    }
    rebuildArrowHeadPanel(opts.arrowHeadStart, opts.arrowHeadEnd, store, i18n);
  }
  function rebuildLineStylePanel(current, store, i18n) {
    lineStylePanel.innerHTML = "";
    for (const def of LINE_STYLE_DEFS) {
      const item = document.createElement("button");
      item.className = "udoc-linestyle-panel__item";
      if (current === def.id)
        item.classList.add("udoc-linestyle-panel__item--active");
      const icon = document.createElement("span");
      icon.className = "udoc-linestyle-panel__icon";
      icon.innerHTML = def.icon;
      const label = document.createElement("span");
      label.className = "udoc-linestyle-panel__label";
      label.textContent = i18n.t(def.labelKey);
      item.append(icon, label);
      item.title = i18n.t(def.labelKey);
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllPanels();
        dispatchOpt(store, "lineStyle", def.id);
      });
      lineStylePanel.appendChild(item);
    }
  }
  function rebuildArrowHeadPanel(startVal, endVal, store, i18n) {
    arrowHeadPanel.innerHTML = "";
    for (const [rowKey, rowLabel, currentVal] of [
      ["arrowHeadStart", i18n.t("tools.arrowHeadStart"), startVal],
      ["arrowHeadEnd", i18n.t("tools.arrowHeadEnd"), endVal]
    ]) {
      const row = document.createElement("div");
      row.className = "udoc-arrowhead-panel__row";
      const lbl = document.createElement("span");
      lbl.className = "udoc-arrowhead-panel__row-label";
      lbl.textContent = rowLabel;
      row.appendChild(lbl);
      for (const def of ARROW_HEAD_DEFS) {
        const btn = document.createElement("button");
        btn.className = "udoc-arrowhead-panel__btn";
        if (currentVal === def.id)
          btn.classList.add("udoc-arrowhead-panel__btn--active");
        btn.innerHTML = def.icon;
        btn.title = i18n.t(def.labelKey);
        if (rowKey === "arrowHeadStart")
          btn.style.transform = "scaleX(-1)";
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          dispatchOpt(store, rowKey, def.id);
        });
        row.appendChild(btn);
      }
      arrowHeadPanel.appendChild(row);
    }
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    document.removeEventListener("click", onDocumentClick);
    currentToolBtns.clear();
    strokeColorSelect?.destroy();
    fillColorSelect?.destroy();
    strokeWidthInput?.destroy();
    opacityInput?.destroy();
    fontSizeInput?.destroy();
    lineStylePanel.remove();
    arrowHeadPanel.remove();
    el.remove();
  }
  return { el, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/layout/pixelAlign.js
function getDevicePixelRatio() {
  if (typeof window === "undefined")
    return 1;
  const dpr = window.devicePixelRatio || 1;
  return Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
}
function toDevicePixels(value, dpr = getDevicePixelRatio()) {
  return Math.round(value * dpr);
}
function toCssPixels(value, dpr = getDevicePixelRatio()) {
  return value / dpr;
}
function snapToDevice(value, dpr = getDevicePixelRatio()) {
  return toCssPixels(toDevicePixels(value, dpr), dpr);
}
var MAX_CANVAS_AREA = 16777216;
var MAX_CANVAS_DIMENSION = 4096;
function getEffectiveDpr(cssWidth, cssHeight, dpr = getDevicePixelRatio()) {
  if (cssWidth <= 0 || cssHeight <= 0)
    return dpr;
  const targetWidth = cssWidth * dpr;
  const targetHeight = cssHeight * dpr;
  let factor = 1;
  const area = targetWidth * targetHeight;
  if (area > MAX_CANVAS_AREA) {
    factor = Math.sqrt(MAX_CANVAS_AREA / area);
  }
  if (targetWidth * factor > MAX_CANVAS_DIMENSION) {
    factor = Math.min(factor, MAX_CANVAS_DIMENSION / targetWidth);
  }
  if (targetHeight * factor > MAX_CANVAS_DIMENSION) {
    factor = Math.min(factor, MAX_CANVAS_DIMENSION / targetHeight);
  }
  return factor < 1 ? dpr * factor : dpr;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/layout/spreadLayout.js
function calculateSpreads(pageCount, layoutMode) {
  if (pageCount === 0)
    return [];
  switch (layoutMode) {
    case "single-page":
      return calculateSinglePageSpreads(pageCount);
    case "double-page":
      return calculateDoublePageSpreads(pageCount);
    case "double-page-odd-right":
      return calculateDoublePageOddRightSpreads(pageCount);
    case "double-page-odd-left":
      return calculateDoublePageOddLeftSpreads(pageCount);
  }
}
function calculateSinglePageSpreads(pageCount) {
  const spreads = [];
  for (let i = 0; i < pageCount; i++) {
    spreads.push({
      index: i,
      slots: [i + 1]
    });
  }
  return spreads;
}
function calculateDoublePageSpreads(pageCount) {
  const spreads = [];
  let spreadIndex = 0;
  for (let page = 1; page <= pageCount; page += 2) {
    const leftPage = page;
    const rightPage = page + 1 <= pageCount ? page + 1 : null;
    spreads.push({
      index: spreadIndex++,
      slots: [leftPage, rightPage]
    });
  }
  return spreads;
}
function calculateDoublePageOddRightSpreads(pageCount) {
  const spreads = [];
  spreads.push({
    index: 0,
    slots: [null, 1]
  });
  let spreadIndex = 1;
  for (let page = 2; page <= pageCount; page += 2) {
    const leftPage = page;
    const rightPage = page + 1 <= pageCount ? page + 1 : null;
    spreads.push({
      index: spreadIndex++,
      slots: [leftPage, rightPage]
    });
  }
  return spreads;
}
function calculateDoublePageOddLeftSpreads(pageCount) {
  const spreads = [];
  if (pageCount === 0)
    return spreads;
  spreads.push({
    index: 0,
    slots: [1, null]
  });
  let spreadIndex = 1;
  for (let oddPage = 3; oddPage <= pageCount; oddPage += 2) {
    const evenPage = oddPage - 1;
    spreads.push({
      index: spreadIndex++,
      slots: [oddPage, evenPage]
    });
  }
  if (pageCount % 2 === 0) {
    spreads.push({
      index: spreadIndex,
      slots: [null, pageCount]
    });
  }
  return spreads;
}
function findSpreadForPage(spreads, page) {
  if (spreads.length === 0)
    return 0;
  const firstSpread = spreads[0];
  const lastSpread = spreads[spreads.length - 1];
  const maxPageInDoc = Math.max(...lastSpread.slots.filter((slot) => slot !== null));
  if (page < 1 || page > maxPageInDoc) {
    return 0;
  }
  let spreadIndex;
  if (firstSpread.slots.length === 1) {
    spreadIndex = page - 1;
  } else {
    const [slot0, slot1] = firstSpread.slots;
    if (slot0 === null && slot1 === 1) {
      spreadIndex = Math.floor(page / 2);
    } else if (slot0 === 1 && slot1 === null) {
      spreadIndex = Math.floor(page / 2);
    } else {
      spreadIndex = Math.floor((page - 1) / 2);
    }
  }
  return spreadIndex;
}
function getSpreadPrimaryPage(spread) {
  for (const slot of spread.slots) {
    if (slot !== null)
      return slot;
  }
  return 1;
}
function normalizeRotation(rotation) {
  switch (rotation) {
    case 90:
    case 180:
    case 270:
      return rotation;
    default:
      return 0;
  }
}
function combineRotation(documentRotation, userRotation) {
  const combined = (documentRotation + userRotation) % 360;
  return normalizeRotation(combined);
}
function applyRotation(pageInfo, userRotation) {
  const documentRotation = normalizeRotation(pageInfo.rotation ?? 0);
  const effectiveRotation = combineRotation(documentRotation, userRotation);
  if (effectiveRotation === 90 || effectiveRotation === 270) {
    return { width: pageInfo.height, height: pageInfo.width };
  }
  return { width: pageInfo.width, height: pageInfo.height };
}
function calculateSpreadLayouts(spreads, pageInfos, scale, pageSpacing, spreadSpacing, dpi, rotation) {
  const dpr = getDevicePixelRatio();
  const layouts = [];
  const spacingDevice = toDevicePixels(spreadSpacing, dpr);
  let currentTopDevice = spreads.length > 0 ? spacingDevice : 0;
  let maxWidthDevice = 0;
  for (const spread of spreads) {
    const { width, height } = getSpreadDimensionsDevice(spread, pageInfos, scale, pageSpacing, dpi, rotation, dpr);
    layouts.push({
      index: spread.index,
      slots: spread.slots,
      top: toCssPixels(currentTopDevice, dpr),
      width: toCssPixels(width, dpr),
      height: toCssPixels(height, dpr)
    });
    currentTopDevice += height + spacingDevice;
    maxWidthDevice = Math.max(maxWidthDevice, width);
  }
  const contentHeight = spreads.length > 0 ? toCssPixels(currentTopDevice, dpr) : 0;
  return {
    layouts,
    contentWidth: toCssPixels(maxWidthDevice, dpr),
    contentHeight
  };
}
function getSpreadDimensions(spread, pageInfos, scale, pageSpacing, dpi, rotation) {
  const dpr = getDevicePixelRatio();
  const deviceDims = getSpreadDimensionsDevice(spread, pageInfos, scale, pageSpacing, dpi, rotation, dpr);
  return {
    width: toCssPixels(deviceDims.width, dpr),
    height: toCssPixels(deviceDims.height, dpr)
  };
}
function getSpreadDimensionsDevice(spread, pageInfos, scale, pageSpacing, dpi, rotation, dpr) {
  const pointsToPixels = getPointsToPixels(dpi);
  let totalWidth = 0;
  let maxHeight = 0;
  const hasMultipleSlots = spread.slots.length > 1;
  let referenceSize = null;
  for (const slot of spread.slots) {
    if (slot !== null) {
      const pageInfo = pageInfos[slot - 1];
      if (pageInfo) {
        referenceSize = applyRotation(pageInfo, rotation);
        break;
      }
    }
  }
  for (const slot of spread.slots) {
    if (slot !== null) {
      const pageIndex = slot - 1;
      const size = pageInfos[pageIndex];
      if (size) {
        const rotated = applyRotation(size, rotation);
        const widthDevice = toDevicePixels(rotated.width * pointsToPixels * scale, dpr);
        const heightDevice = toDevicePixels(rotated.height * pointsToPixels * scale, dpr);
        totalWidth += widthDevice;
        maxHeight = Math.max(maxHeight, heightDevice);
      }
    } else if (referenceSize) {
      const widthDevice = toDevicePixels(referenceSize.width * pointsToPixels * scale, dpr);
      const heightDevice = toDevicePixels(referenceSize.height * pointsToPixels * scale, dpr);
      totalWidth += widthDevice;
      maxHeight = Math.max(maxHeight, heightDevice);
    }
  }
  if (hasMultipleSlots) {
    totalWidth += toDevicePixels(pageSpacing, dpr);
  }
  return { width: totalWidth, height: maxHeight };
}
function findVisibleSpreadRange(layouts, scrollTop, viewportHeight, buffer = 1) {
  if (layouts.length === 0) {
    return { start: 0, end: -1 };
  }
  const viewportBottom = scrollTop + viewportHeight;
  const start = findFirstVisibleSpread(layouts, scrollTop);
  const end = findLastVisibleSpread(layouts, viewportBottom, start);
  return {
    start: Math.max(0, start - buffer),
    end: Math.min(layouts.length - 1, end + buffer)
  };
}
function findFirstVisibleSpread(layouts, scrollTop) {
  let left = 0;
  let right = layouts.length - 1;
  let result = 0;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const layout = layouts[mid];
    if (layout.top + layout.height >= scrollTop) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result;
}
function findLastVisibleSpread(layouts, viewportBottom, startFrom) {
  let left = startFrom;
  let right = layouts.length - 1;
  let result = startFrom;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const layout = layouts[mid];
    if (layout.top <= viewportBottom) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}
function getCroppedPageSize(pageInfo, rotation) {
  if (pageInfo.contentRect) {
    const cr = pageInfo.contentRect;
    const size = { width: cr.width, height: cr.height };
    return applyRotationToSize(size, pageInfo, rotation);
  }
  return applyRotation(pageInfo, rotation);
}
function applyRotationToSize(size, pageInfo, userRotation) {
  const documentRotation = normalizeRotation(pageInfo.rotation ?? 0);
  const effectiveRotation = combineRotation(documentRotation, userRotation);
  if (effectiveRotation === 90 || effectiveRotation === 270) {
    return { width: size.height, height: size.width };
  }
  return size;
}
function gridFromTiledGroup(group, pageInfos) {
  if (group.layout.type !== "tiled") {
    throw new Error("gridFromTiledGroup called with non-tiled group");
  }
  const { rows, cols } = group.layout;
  const pageGrid = [];
  for (let i = 0; i < group.pageCount; i++) {
    const globalIndex = group.startPageIndex + i;
    const pi = pageInfos[globalIndex];
    if (pi?.tilePos) {
      pageGrid.push({ pageIndex: globalIndex, row: pi.tilePos.row, col: pi.tilePos.col });
    }
  }
  return { columns: cols, rows, pageGrid };
}
function calculateContinuousLayout(spreads, pageInfos, scale, dpi, rotation, activeGroup) {
  if (activeGroup?.layout.type === "tiled") {
    const grid = gridFromTiledGroup(activeGroup, pageInfos);
    return calculateGridContinuousLayout(spreads, pageInfos, scale, dpi, rotation, grid);
  }
  return calculateLinearContinuousLayout(spreads, pageInfos, scale, dpi, rotation);
}
function getVerticallyCroppedPageSize(pageInfo, rotation) {
  const fullSize = applyRotation(pageInfo, rotation);
  if (!pageInfo.contentRect)
    return fullSize;
  const cr = pageInfo.contentRect;
  const size = { width: pageInfo.width, height: cr.height };
  return applyRotationToSize(size, pageInfo, rotation);
}
function calculateLinearContinuousLayout(spreads, pageInfos, scale, dpi, rotation) {
  const dpr = getDevicePixelRatio();
  const pointsToPixels = getPointsToPixels(dpi);
  const layouts = [];
  let currentTopDevice = 0;
  let maxWidthDevice = 0;
  for (const spread of spreads) {
    let spreadWidthDevice = 0;
    let spreadHeightDevice = 0;
    for (const slot of spread.slots) {
      if (slot !== null) {
        const pageInfo = pageInfos[slot - 1];
        if (pageInfo) {
          const cropped = getVerticallyCroppedPageSize(pageInfo, rotation);
          const wDevice = toDevicePixels(cropped.width * pointsToPixels * scale, dpr);
          const hDevice = toDevicePixels(cropped.height * pointsToPixels * scale, dpr);
          spreadWidthDevice = Math.max(spreadWidthDevice, wDevice);
          spreadHeightDevice = Math.max(spreadHeightDevice, hDevice);
        }
      }
    }
    layouts.push({
      index: spread.index,
      slots: spread.slots,
      top: toCssPixels(currentTopDevice, dpr),
      width: toCssPixels(spreadWidthDevice, dpr),
      height: toCssPixels(spreadHeightDevice, dpr)
    });
    currentTopDevice += spreadHeightDevice;
    maxWidthDevice = Math.max(maxWidthDevice, spreadWidthDevice);
  }
  return {
    layouts,
    rowLayouts: [],
    contentWidth: toCssPixels(maxWidthDevice, dpr),
    contentHeight: toCssPixels(currentTopDevice, dpr),
    columnWidths: [],
    isGridLayout: false
  };
}
function calculateGridContinuousLayout(spreads, pageInfos, scale, dpi, rotation, grid) {
  const dpr = getDevicePixelRatio();
  const pointsToPixels = getPointsToPixels(dpi);
  const pageDims = [];
  for (let i = 0; i < pageInfos.length; i++) {
    const cropped = getCroppedPageSize(pageInfos[i], rotation);
    pageDims.push({
      width: toCssPixels(toDevicePixels(cropped.width * pointsToPixels * scale, dpr), dpr),
      height: toCssPixels(toDevicePixels(cropped.height * pointsToPixels * scale, dpr), dpr)
    });
  }
  const columnWidths = new Array(grid.columns).fill(0);
  for (const pg of grid.pageGrid) {
    const dim = pageDims[pg.pageIndex];
    if (dim) {
      columnWidths[pg.col] = Math.max(columnWidths[pg.col], dim.width);
    }
  }
  const rowPages = /* @__PURE__ */ new Map();
  for (const pg of grid.pageGrid) {
    let pages = rowPages.get(pg.row);
    if (!pages) {
      pages = [];
      rowPages.set(pg.row, pages);
    }
    pages.push({ pageIndex: pg.pageIndex, col: pg.col });
  }
  const rowIndices = Array.from(rowPages.keys()).sort((a, b) => a - b);
  const rowLayouts = [];
  const layouts = [];
  let currentTop = 0;
  const totalWidth = columnWidths.reduce((sum, w) => sum + w, 0);
  for (const rowIdx of rowIndices) {
    const pages = rowPages.get(rowIdx);
    pages.sort((a, b) => a.col - b.col);
    let rowHeight = 0;
    for (const p of pages) {
      const dim = pageDims[p.pageIndex];
      if (dim) {
        rowHeight = Math.max(rowHeight, dim.height);
      }
    }
    const rowPageLayouts = [];
    for (const p of pages) {
      let left = 0;
      for (let c = 0; c < p.col; c++) {
        left += columnWidths[c];
      }
      const dim = pageDims[p.pageIndex];
      rowPageLayouts.push({
        pageIndex: p.pageIndex,
        col: p.col,
        left,
        width: dim?.width ?? 0,
        height: dim?.height ?? 0
      });
    }
    rowLayouts.push({
      row: rowIdx,
      top: currentTop,
      width: totalWidth,
      height: rowHeight,
      pages: rowPageLayouts
    });
    for (const p of pages) {
      const spreadIndex = p.pageIndex;
      if (spreadIndex < spreads.length) {
        const dim = pageDims[p.pageIndex];
        layouts.push({
          index: spreadIndex,
          slots: spreads[spreadIndex].slots,
          top: currentTop,
          width: dim?.width ?? 0,
          height: rowHeight
        });
      }
    }
    currentTop += rowHeight;
  }
  return {
    layouts,
    rowLayouts,
    contentWidth: totalWidth,
    contentHeight: currentTop,
    columnWidths,
    isGridLayout: true
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/ThumbnailPanel.js
function selectThumbnailSlice(state) {
  return {
    docId: state.doc?.id ?? null,
    pageCount: state.pageCount,
    pageInfos: state.pageInfos,
    currentPage: state.page,
    dpi: state.dpi,
    thumbnailWidth: state.thumbnailWidth
  };
}
function createThumbnailPanel() {
  const el = document.createElement("div");
  el.className = "udoc-thumbnail-panel";
  el.setAttribute("role", "listbox");
  el.setAttribute("aria-label", "Page thumbnails");
  el.setAttribute("tabindex", "0");
  let focusedPage = 1;
  el.addEventListener("keydown", (e) => {
    if (!storeRef || thumbnailItems.length === 0)
      return;
    let handled = true;
    switch (e.key) {
      case "ArrowDown":
        focusedPage = Math.min(focusedPage + 1, thumbnailItems.length);
        break;
      case "ArrowUp":
        focusedPage = Math.max(focusedPage - 1, 1);
        break;
      case "Home":
        focusedPage = 1;
        break;
      case "End":
        focusedPage = thumbnailItems.length;
        break;
      case "Enter":
      case " ":
        storeRef.dispatch({ type: "NAVIGATE_TO_PAGE", page: focusedPage });
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
      el.setAttribute("aria-activedescendant", `udoc-thumb-${focusedPage}`);
      const item = thumbnailItems[focusedPage - 1];
      if (item) {
        item.container.scrollIntoView({ block: "nearest", behavior: "instant" });
      }
    }
  });
  let mounted = false;
  let storeRef = null;
  let workerClient = null;
  let i18nRef = null;
  let thumbnailItems = [];
  let intersectionObserver = null;
  let currentSlice = null;
  let unsubRender = null;
  const unsubEvents = [];
  function createThumbnailItem(pageNumber, pageInfo, thumbnailWidth) {
    const container = document.createElement("div");
    container.className = "udoc-thumbnail-item";
    container.dataset.page = String(pageNumber);
    container.setAttribute("role", "option");
    container.setAttribute("aria-label", i18nRef ? i18nRef.t("thumbnails.pageLabel", { page: pageNumber }) : `Page ${pageNumber}`);
    container.id = `udoc-thumb-${pageNumber}`;
    const canvas = document.createElement("canvas");
    canvas.className = "udoc-thumbnail-item__canvas";
    canvas.setAttribute("aria-hidden", "true");
    const aspectRatio = pageInfo.width / pageInfo.height;
    canvas.style.aspectRatio = String(aspectRatio);
    canvas.style.width = `${thumbnailWidth}px`;
    container.appendChild(canvas);
    const label = document.createElement("div");
    label.className = "udoc-thumbnail-item__label";
    label.textContent = String(pageNumber);
    container.appendChild(label);
    const onClick = () => {
      if (storeRef) {
        storeRef.dispatch({ type: "NAVIGATE_TO_PAGE", page: pageNumber });
      }
    };
    container.addEventListener("click", onClick);
    unsubEvents.push(() => container.removeEventListener("click", onClick));
    return {
      container,
      canvas,
      pageNumber,
      renderKey: "",
      pendingKey: null,
      renderToken: 0
    };
  }
  function buildThumbnailList(slice) {
    for (const item of thumbnailItems) {
      item.container.remove();
    }
    thumbnailItems = [];
    if (!slice.docId || slice.pageCount === 0)
      return;
    const defaultPageInfo = { width: 612, height: 792, rotation: 0 };
    for (let i = 1; i <= slice.pageCount; i++) {
      const pageInfo = slice.pageInfos[i - 1] || defaultPageInfo;
      const item = createThumbnailItem(i, pageInfo, slice.thumbnailWidth);
      thumbnailItems.push(item);
      el.appendChild(item.container);
    }
    setupIntersectionObserver();
    updateCurrentPageHighlight(slice.currentPage);
    scrollActiveIntoView(slice.currentPage);
  }
  function setupIntersectionObserver() {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
    intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const pageNumber = parseInt(entry.target.dataset.page || "0", 10);
          if (pageNumber > 0) {
            requestThumbnailRender(pageNumber);
          }
        }
      }
    }, {
      root: el,
      rootMargin: "100px 0px",
      threshold: 0
    });
    for (const item of thumbnailItems) {
      intersectionObserver.observe(item.container);
    }
    setupScrollHandler();
  }
  function setupScrollHandler() {
    const onScroll = () => {
      if (!workerClient || !currentSlice?.docId)
        return;
      const focusPage = findFocusThumbnail();
      if (focusPage !== null) {
        workerClient.boostThumbnailRenderPriority(currentSlice.docId, focusPage);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    unsubEvents.push(() => el.removeEventListener("scroll", onScroll));
  }
  function findFocusThumbnail() {
    if (thumbnailItems.length === 0)
      return null;
    const panelRect = el.getBoundingClientRect();
    const panelCenter = panelRect.top + panelRect.height / 2;
    let closestPage = null;
    let closestDistance = Infinity;
    for (const item of thumbnailItems) {
      const itemRect = item.container.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      const distance = Math.abs(itemCenter - panelCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = item.pageNumber;
      }
    }
    return closestPage;
  }
  async function requestThumbnailRender(pageNumber) {
    const item = thumbnailItems[pageNumber - 1];
    if (!item || !workerClient || !currentSlice || !currentSlice.docId)
      return;
    const pageInfo = currentSlice.pageInfos[pageNumber - 1];
    if (!pageInfo)
      return;
    const dpr = getDevicePixelRatio();
    const pointsToPixels = getPointsToPixels(currentSlice.dpi);
    const scale = currentSlice.thumbnailWidth / (pageInfo.width * pointsToPixels);
    const renderScale = scale * pointsToPixels * dpr;
    const key = `${currentSlice.docId}:${pageNumber}:${renderScale.toFixed(4)}`;
    if (item.renderKey === key || item.pendingKey === key)
      return;
    const token = ++item.renderToken;
    item.pendingKey = key;
    try {
      const result = await workerClient.requestRender({
        docId: currentSlice.docId,
        page: pageNumber,
        type: "thumbnail",
        scale: renderScale
      });
      if (!mounted || item.renderToken !== token) {
        if (item.pendingKey === key)
          item.pendingKey = null;
        return;
      }
      const canvas = item.canvas;
      if (canvas.width !== result.width)
        canvas.width = result.width;
      if (canvas.height !== result.height)
        canvas.height = result.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(result.bitmap, 0, 0);
      }
      item.renderKey = key;
    } catch (error) {
      if (mounted && !(error instanceof Error && error.message === "Request cancelled")) {
        console.error(`Thumbnail render failed for page ${pageNumber}:`, error);
      }
    } finally {
      if (item.pendingKey === key)
        item.pendingKey = null;
    }
  }
  function updateCurrentPageHighlight(currentPage) {
    for (const item of thumbnailItems) {
      const isActive = item.pageNumber === currentPage;
      item.container.classList.toggle("udoc-thumbnail-item--active", isActive);
      item.container.setAttribute("aria-selected", String(isActive));
    }
    el.setAttribute("aria-activedescendant", `udoc-thumb-${currentPage}`);
    focusedPage = currentPage;
  }
  function scrollActiveIntoView(currentPage) {
    const item = thumbnailItems[currentPage - 1];
    if (!item)
      return;
    item.container.scrollIntoView({
      behavior: "instant",
      block: "nearest"
    });
  }
  function applyState(slice) {
    const docChanged = !currentSlice || slice.docId !== currentSlice.docId || slice.pageCount !== currentSlice.pageCount || slice.pageInfos !== currentSlice.pageInfos || slice.thumbnailWidth !== currentSlice.thumbnailWidth;
    if (docChanged) {
      buildThumbnailList(slice);
    } else if (slice.currentPage !== currentSlice?.currentPage) {
      updateCurrentPageHighlight(slice.currentPage);
      scrollActiveIntoView(slice.currentPage);
    }
    currentSlice = slice;
  }
  function mount(container, store, rm, i18n) {
    container.appendChild(el);
    mounted = true;
    storeRef = store;
    workerClient = rm;
    i18nRef = i18n;
    el.setAttribute("aria-label", i18n.t("thumbnails.label"));
    applyState(selectThumbnailSlice(store.getState()));
    unsubRender = subscribeSelector(store, selectThumbnailSlice, applyState, { equality: shallowEqual });
  }
  function destroy() {
    mounted = false;
    if (unsubRender)
      unsubRender();
    for (const off of unsubEvents)
      off();
    unsubEvents.length = 0;
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
    thumbnailItems = [];
    storeRef = null;
    workerClient = null;
    currentSlice = null;
    el.remove();
  }
  return { el, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/OutlinePanel.js
function selectOutlineSlice(state) {
  return {
    outline: state.outline,
    outlineLoading: state.outlineLoading,
    currentPage: state.page
  };
}
function createOutlinePanel() {
  const el = document.createElement("div");
  el.className = "udoc-outline-panel";
  let storeRef = null;
  let i18nRef = null;
  let currentSlice = null;
  const collapsedItems = /* @__PURE__ */ new Set();
  let unsubRender = null;
  const unsubEvents = [];
  function createOutlineItemElement(item, path, depth) {
    const container = document.createElement("div");
    container.className = "udoc-outline-item";
    container.dataset.path = path;
    container.setAttribute("role", "treeitem");
    container.setAttribute("aria-label", item.title);
    const header = document.createElement("div");
    header.className = "udoc-outline-item__header";
    header.style.paddingLeft = `${8 + depth * 16}px`;
    header.setAttribute("tabindex", "-1");
    if (item.children.length > 0) {
      const toggle = document.createElement("button");
      toggle.className = "udoc-outline-item__toggle";
      toggle.type = "button";
      toggle.setAttribute("tabindex", "-1");
      toggle.setAttribute("aria-hidden", "true");
      toggle.innerHTML = `<svg viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
      const isCollapsed = item.initiallyCollapsed || collapsedItems.has(path);
      if (isCollapsed) {
        collapsedItems.add(path);
      }
      toggle.classList.toggle("udoc-outline-item__toggle--expanded", !isCollapsed);
      container.setAttribute("aria-expanded", String(!isCollapsed));
      const onToggle = (e) => {
        e.stopPropagation();
        if (collapsedItems.has(path)) {
          collapsedItems.delete(path);
        } else {
          collapsedItems.add(path);
        }
        updateExpandState(container, path);
      };
      toggle.addEventListener("click", onToggle);
      unsubEvents.push(() => toggle.removeEventListener("click", onToggle));
      header.appendChild(toggle);
    } else {
      const spacer = document.createElement("span");
      spacer.className = "udoc-outline-item__spacer";
      header.appendChild(spacer);
    }
    const title = document.createElement("span");
    title.className = "udoc-outline-item__title";
    title.textContent = item.title;
    header.appendChild(title);
    container.appendChild(header);
    if (item.destination) {
      header.classList.add("udoc-outline-item__header--clickable");
      const dest = item.destination;
      const onClick = () => {
        if (storeRef) {
          storeRef.dispatch({
            type: "NAVIGATE_TO_DESTINATION",
            destination: dest
          });
        }
      };
      header.addEventListener("click", onClick);
      unsubEvents.push(() => header.removeEventListener("click", onClick));
    }
    const onKeyDown = (e) => {
      const handled = handleTreeKeyDown(e, container, path);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    header.addEventListener("keydown", onKeyDown);
    unsubEvents.push(() => header.removeEventListener("keydown", onKeyDown));
    if (item.children.length > 0) {
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "udoc-outline-item__children";
      childrenContainer.setAttribute("role", "group");
      const isCollapsed = collapsedItems.has(path);
      childrenContainer.style.display = isCollapsed ? "none" : "block";
      item.children.forEach((child, index) => {
        const childPath = `${path}/${index}`;
        const childEl = createOutlineItemElement(child, childPath, depth + 1);
        childrenContainer.appendChild(childEl);
      });
      container.appendChild(childrenContainer);
    }
    return container;
  }
  function handleTreeKeyDown(e, container, path) {
    const hasChildren = container.querySelector(":scope > .udoc-outline-item__children") !== null;
    const isExpanded = hasChildren && !collapsedItems.has(path);
    switch (e.key) {
      case "ArrowDown": {
        const next = getNextVisibleTreeItem(container);
        if (next)
          focusTreeItem(next);
        return true;
      }
      case "ArrowUp": {
        const prev = getPrevVisibleTreeItem(container);
        if (prev)
          focusTreeItem(prev);
        return true;
      }
      case "ArrowRight": {
        if (hasChildren && !isExpanded) {
          collapsedItems.delete(path);
          updateExpandState(container, path);
        } else if (hasChildren && isExpanded) {
          const firstChild = container.querySelector(":scope > .udoc-outline-item__children > .udoc-outline-item");
          if (firstChild)
            focusTreeItem(firstChild);
        }
        return true;
      }
      case "ArrowLeft": {
        if (hasChildren && isExpanded) {
          collapsedItems.add(path);
          updateExpandState(container, path);
        } else {
          const parent = container.parentElement?.closest(".udoc-outline-item");
          if (parent)
            focusTreeItem(parent);
        }
        return true;
      }
      case "Home": {
        const first = el.querySelector(".udoc-outline-item");
        if (first)
          focusTreeItem(first);
        return true;
      }
      case "End": {
        const allVisible = el.querySelectorAll(".udoc-outline-item");
        for (let i = allVisible.length - 1; i >= 0; i--) {
          const item = allVisible[i];
          if (item.offsetParent !== null) {
            focusTreeItem(item);
            break;
          }
        }
        return true;
      }
      case "Enter":
      case " ": {
        const header = container.querySelector(":scope > .udoc-outline-item__header");
        if (header)
          header.click();
        return true;
      }
      default:
        return false;
    }
  }
  function focusTreeItem(item) {
    const header = item.querySelector(":scope > .udoc-outline-item__header");
    if (header)
      header.focus();
  }
  function getNextVisibleTreeItem(current) {
    const children = current.querySelector(":scope > .udoc-outline-item__children");
    if (children && children.style.display !== "none") {
      const firstChild = children.querySelector(":scope > .udoc-outline-item");
      if (firstChild)
        return firstChild;
    }
    let node = current;
    while (node) {
      const next = node.nextElementSibling;
      if (next && next.classList.contains("udoc-outline-item"))
        return next;
      node = node.parentElement?.closest(".udoc-outline-item");
    }
    return null;
  }
  function getPrevVisibleTreeItem(current) {
    const prev = current.previousElementSibling;
    if (prev && prev.classList.contains("udoc-outline-item")) {
      return getLastVisibleDescendant(prev);
    }
    const parent = current.parentElement?.closest(".udoc-outline-item");
    return parent;
  }
  function getLastVisibleDescendant(item) {
    const children = item.querySelector(":scope > .udoc-outline-item__children");
    if (children && children.style.display !== "none") {
      const lastChild = children.querySelector(":scope > .udoc-outline-item:last-child");
      if (lastChild)
        return getLastVisibleDescendant(lastChild);
    }
    return item;
  }
  function updateExpandState(container, path) {
    const toggle = container.querySelector(":scope > .udoc-outline-item__header > .udoc-outline-item__toggle");
    const children = container.querySelector(":scope > .udoc-outline-item__children");
    if (!toggle || !children)
      return;
    const isCollapsed = collapsedItems.has(path);
    toggle.classList.toggle("udoc-outline-item__toggle--expanded", !isCollapsed);
    children.style.display = isCollapsed ? "none" : "block";
    container.setAttribute("aria-expanded", String(!isCollapsed));
  }
  function buildOutlineTree(outline) {
    el.innerHTML = "";
    if (outline.length === 0) {
      el.removeAttribute("role");
      const empty = document.createElement("div");
      empty.className = "udoc-panel-empty";
      empty.textContent = i18nRef.t("outline.empty");
      el.appendChild(empty);
      return;
    }
    el.setAttribute("role", "tree");
    el.setAttribute("aria-label", i18nRef.t("outline.label"));
    outline.forEach((item, index) => {
      const path = String(index);
      const itemEl = createOutlineItemElement(item, path, 0);
      el.appendChild(itemEl);
    });
    const firstHeader = el.querySelector(".udoc-outline-item__header");
    if (firstHeader)
      firstHeader.setAttribute("tabindex", "0");
  }
  function showLoading() {
    el.innerHTML = "";
    const loading = document.createElement("div");
    loading.className = "udoc-outline-panel__loading";
    loading.textContent = i18nRef.t("outline.loading");
    el.appendChild(loading);
  }
  function applyState(slice) {
    const outlineChanged = !currentSlice || slice.outline !== currentSlice.outline || slice.outlineLoading !== currentSlice.outlineLoading;
    if (outlineChanged) {
      for (const off of unsubEvents)
        off();
      unsubEvents.length = 0;
      if (slice.outlineLoading) {
        showLoading();
      } else if (slice.outline === null) {
        el.innerHTML = "";
      } else {
        buildOutlineTree(slice.outline);
      }
    }
    currentSlice = slice;
  }
  function mount(container, store, i18n) {
    container.appendChild(el);
    storeRef = store;
    i18nRef = i18n;
    applyState(selectOutlineSlice(store.getState()));
    unsubRender = subscribeSelector(store, selectOutlineSlice, applyState, { equality: shallowEqual });
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    for (const off of unsubEvents)
      off();
    unsubEvents.length = 0;
    collapsedItems.clear();
    storeRef = null;
    currentSlice = null;
    el.remove();
  }
  return { el, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/BookmarksPanel.js
function createBookmarksPanel() {
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

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/LayersPanel.js
function selectLayersSlice(state) {
  return {
    groups: state.visibilityGroups,
    loading: state.visibilityGroupsLoading,
    docId: state.doc?.id ?? null
  };
}
function createLayersPanel() {
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
          } catch {
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
      for (const off of unsubEvents)
        off();
      unsubEvents.length = 0;
      if (slice.loading) {
        showLoading();
      } else if (slice.groups === null) {
        el.innerHTML = "";
      } else {
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

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/AttachmentsPanel.js
function createAttachmentsPanel() {
  const el = document.createElement("div");
  el.className = "udoc-attachments-panel";
  function mount(container, i18n) {
    const empty = document.createElement("div");
    empty.className = "udoc-panel-empty";
    empty.textContent = i18n.t("attachments.empty");
    el.appendChild(empty);
    container.appendChild(el);
  }
  function destroy() {
    el.remove();
  }
  return { el, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/FontsPanel.js
function selectFontsSlice(state) {
  return { docId: state.doc?.id ?? null };
}
function formatSource(source) {
  if (typeof source === "string")
    return source;
  return source.custom;
}
function createFontsPanel() {
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
      } else {
        specEl.textContent = entry.spec.fontId;
      }
      item.appendChild(specEl);
      const treeEl = document.createElement("div");
      treeEl.className = "udoc-fonts-panel__tree";
      const allFonts = [
        { info: entry.resolved, primary: true },
        ...entry.fallbacks.map((fb) => ({ info: fb, primary: false }))
      ];
      for (const { info, primary } of allFonts) {
        const row = document.createElement("div");
        row.className = `udoc-fonts-panel__font-row${primary ? "" : " udoc-fonts-panel__font-row--fallback"}`;
        const dot = document.createElement("span");
        dot.className = `udoc-fonts-panel__dot${primary ? " udoc-fonts-panel__dot--primary" : ""}`;
        row.appendChild(dot);
        const nameEl = document.createElement("span");
        nameEl.className = "udoc-fonts-panel__font-name";
        let fontName = info.familyName || info.postscriptName || ("typeface" in entry.spec ? entry.spec.typeface : entry.spec.fontId);
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
      const entries = await workerClientRef.getFontUsage(docId);
      if (currentDocId === docId) {
        renderEntries(entries);
      }
    } catch {
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
      equality: (a, b) => a.docId === b.docId
    });
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

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/LeftPanel.js
var TABS = [
  { id: "thumbnail", label: "Thumbnails", icon: ICON_THUMBNAIL },
  { id: "outline", label: "Outline", icon: ICON_OUTLINE },
  { id: "bookmarks", label: "Bookmarks", icon: ICON_BOOKMARK },
  { id: "layers", label: "Layers", icon: ICON_LAYERS },
  { id: "attachments", label: "Attachments", icon: ICON_ATTACHMENT },
  { id: "fonts", label: "Fonts", icon: ICON_FONTS }
];
function createLeftPanel() {
  const el = document.createElement("div");
  el.className = "udoc-left-panel";
  const tabBar = document.createElement("div");
  tabBar.className = "udoc-left-panel__tabs";
  tabBar.setAttribute("role", "tablist");
  tabBar.setAttribute("aria-label", "Panel tabs");
  const tabButtons = /* @__PURE__ */ new Map();
  for (const tab of TABS) {
    const btn = document.createElement("button");
    btn.className = "udoc-left-panel__tab";
    btn.id = `udoc-left-tab-${tab.id}`;
    btn.setAttribute("aria-label", tab.label);
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.setAttribute("aria-controls", "udoc-left-panel-content");
    btn.setAttribute("data-tab", tab.id);
    btn.innerHTML = tab.icon;
    tabButtons.set(tab.id, btn);
    tabBar.appendChild(btn);
  }
  const content = document.createElement("div");
  content.className = "udoc-left-panel__content";
  content.id = "udoc-left-panel-content";
  content.setAttribute("role", "tabpanel");
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "udoc-left-panel__resize-handle";
  resizeHandle.setAttribute("role", "separator");
  resizeHandle.setAttribute("aria-orientation", "vertical");
  resizeHandle.setAttribute("aria-label", "Resize side panel");
  resizeHandle.setAttribute("tabindex", "0");
  resizeHandle.setAttribute("aria-valuenow", "280");
  resizeHandle.setAttribute("aria-valuemin", "200");
  resizeHandle.setAttribute("aria-valuemax", "500");
  el.append(tabBar, content, resizeHandle);
  let unsubRender = null;
  let unsubContent = null;
  const unsubEvents = [];
  let thumbnailPanel = null;
  let outlinePanel = null;
  let bookmarksPanel = null;
  let layersPanel = null;
  let attachmentsPanel = null;
  let fontsPanel = null;
  let storeRef = null;
  let workerClientRef = null;
  let i18nRef = null;
  function applyState(slice) {
    el.style.display = !slice.panelVisible || slice.allDisabled ? "none" : "";
    el.style.transition = slice.noTransition ? "none" : "";
    el.classList.toggle("udoc-left-panel--closed", !slice.open);
    if (slice.open && slice.width !== null) {
      el.style.width = `${slice.width}px`;
    } else {
      el.style.width = "";
    }
    for (const [tabId, btn] of tabButtons) {
      const isActive = tabId === slice.activeTab;
      btn.classList.toggle("udoc-left-panel__tab--active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      btn.style.display = slice.disabledPanels.has(tabId) ? "none" : "";
    }
    if (slice.activeTab) {
      content.setAttribute("aria-labelledby", `udoc-left-tab-${slice.activeTab}`);
    } else {
      content.removeAttribute("aria-labelledby");
    }
  }
  function applyContent(activeTab) {
    if (thumbnailPanel) {
      thumbnailPanel.destroy();
      thumbnailPanel = null;
    }
    if (outlinePanel) {
      outlinePanel.destroy();
      outlinePanel = null;
    }
    if (bookmarksPanel) {
      bookmarksPanel.destroy();
      bookmarksPanel = null;
    }
    if (layersPanel) {
      layersPanel.destroy();
      layersPanel = null;
    }
    if (attachmentsPanel) {
      attachmentsPanel.destroy();
      attachmentsPanel = null;
    }
    if (fontsPanel) {
      fontsPanel.destroy();
      fontsPanel = null;
    }
    if (activeTab === "thumbnail" && storeRef && workerClientRef) {
      thumbnailPanel = createThumbnailPanel();
      thumbnailPanel.mount(content, storeRef, workerClientRef, i18nRef);
    } else if (activeTab === "outline" && storeRef) {
      outlinePanel = createOutlinePanel();
      outlinePanel.mount(content, storeRef, i18nRef);
    } else if (activeTab === "bookmarks") {
      bookmarksPanel = createBookmarksPanel();
      bookmarksPanel.mount(content, i18nRef);
    } else if (activeTab === "layers" && storeRef && workerClientRef) {
      layersPanel = createLayersPanel();
      layersPanel.mount(content, storeRef, workerClientRef, i18nRef);
    } else if (activeTab === "attachments") {
      attachmentsPanel = createAttachmentsPanel();
      attachmentsPanel.mount(content, i18nRef);
    } else if (activeTab === "fonts" && storeRef && workerClientRef) {
      fontsPanel = createFontsPanel();
      fontsPanel.mount(content, storeRef, workerClientRef, i18nRef);
    }
  }
  function setupResize() {
    let startX = 0;
    let startWidth = 0;
    const onPointerMove = (e) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(200, Math.min(500, startWidth + delta));
      el.style.width = `${newWidth}px`;
    };
    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      el.classList.remove("udoc-left-panel--resizing");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (storeRef) {
        const finalWidth = el.offsetWidth;
        storeRef.dispatch({ type: "SET_LEFT_PANEL_WIDTH", width: finalWidth });
      }
    };
    const onPointerDown = (e) => {
      e.preventDefault();
      startX = e.clientX;
      startWidth = el.offsetWidth;
      el.classList.add("udoc-left-panel--resizing");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    };
    resizeHandle.addEventListener("pointerdown", onPointerDown);
    unsubEvents.push(() => resizeHandle.removeEventListener("pointerdown", onPointerDown));
    const RESIZE_STEP = 20;
    const onKeyDown = (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft")
        return;
      e.preventDefault();
      const currentWidth = el.offsetWidth;
      const delta = e.key === "ArrowRight" ? RESIZE_STEP : -RESIZE_STEP;
      const newWidth = Math.max(200, Math.min(500, currentWidth + delta));
      el.style.width = `${newWidth}px`;
      resizeHandle.setAttribute("aria-valuenow", String(newWidth));
      if (storeRef) {
        storeRef.dispatch({ type: "SET_LEFT_PANEL_WIDTH", width: newWidth });
      }
    };
    resizeHandle.addEventListener("keydown", onKeyDown);
    unsubEvents.push(() => resizeHandle.removeEventListener("keydown", onKeyDown));
  }
  function mount(container, store, workerClient, i18n) {
    container.appendChild(el);
    storeRef = store;
    workerClientRef = workerClient;
    i18nRef = i18n;
    tabBar.setAttribute("aria-label", i18n.t("leftPanel.tabs"));
    resizeHandle.setAttribute("aria-label", i18n.t("leftPanel.resizeHandle"));
    for (const [tabId, btn] of tabButtons) {
      const labelKey = tabId === "thumbnail" ? "leftPanel.thumbnails" : `leftPanel.${tabId}`;
      const label = i18n.t(labelKey);
      btn.setAttribute("aria-label", label);
      btn.title = label;
    }
    for (const [tabId, btn] of tabButtons) {
      const onClick = () => {
        store.dispatch({ type: "TOGGLE_PANEL", panel: tabId });
      };
      btn.addEventListener("click", onClick);
      unsubEvents.push(() => btn.removeEventListener("click", onClick));
    }
    setupResize();
    const initialSlice = selectLeftPanel(store.getState());
    applyState(initialSlice);
    unsubRender = subscribeSelector(store, selectLeftPanel, applyState, {
      equality: (a, b) => a.open === b.open && a.activeTab === b.activeTab && a.width === b.width && a.panelVisible === b.panelVisible && a.disabledPanels === b.disabledPanels && a.allDisabled === b.allDisabled && a.noTransition === b.noTransition
    });
    applyContent(initialSlice.activeTab);
    unsubContent = subscribeSelector(store, (state) => selectLeftPanel(state).activeTab, applyContent);
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    if (unsubContent)
      unsubContent();
    for (const off of unsubEvents)
      off();
    if (thumbnailPanel) {
      thumbnailPanel.destroy();
      thumbnailPanel = null;
    }
    if (outlinePanel) {
      outlinePanel.destroy();
      outlinePanel = null;
    }
    if (bookmarksPanel) {
      bookmarksPanel.destroy();
      bookmarksPanel = null;
    }
    if (layersPanel) {
      layersPanel.destroy();
      layersPanel = null;
    }
    if (attachmentsPanel) {
      attachmentsPanel.destroy();
      attachmentsPanel = null;
    }
    if (fontsPanel) {
      fontsPanel.destroy();
      fontsPanel = null;
    }
    storeRef = null;
    workerClientRef = null;
    el.remove();
  }
  return { el, mount, destroy };
}
function selectLeftPanel(state) {
  const panel = state.activePanel;
  const isLeftTab = panel !== null && isLeftPanelTab(panel);
  const allDisabled = TABS.every((tab) => state.disabledPanels.has(tab.id));
  return {
    open: isLeftTab,
    activeTab: isLeftTab ? panel : null,
    width: state.leftPanelWidth,
    panelVisible: state.leftPanelVisible,
    disabledPanels: state.disabledPanels,
    allDisabled,
    noTransition: state.panelTransitionsDisabled
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/annotation/utils.js
function colorToRgba(color, opacity, defaultColor = "rgba(255, 255, 0, 0.3)") {
  if (!color)
    return defaultColor;
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
function colorToRgb(color, defaultColor = "rgb(0, 0, 0)") {
  if (!color)
    return defaultColor;
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgb(${r}, ${g}, ${b})`;
}
function scaleBounds(bounds, scale) {
  return {
    x: bounds.x * scale,
    y: bounds.y * scale,
    width: bounds.width * scale,
    height: bounds.height * scale
  };
}
function applyBoundsStyle(el, bounds, scale) {
  el.style.position = "absolute";
  el.style.left = `${bounds.x * scale}px`;
  el.style.top = `${bounds.y * scale}px`;
  el.style.width = `${bounds.width * scale}px`;
  el.style.height = `${bounds.height * scale}px`;
}
function createSvgOverlay() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.overflow = "visible";
  return svg;
}
function createSvgElement(tagName) {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}
function boundsMatch(a, b, epsilon = 0.1) {
  return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon && Math.abs(a.width - b.width) < epsilon && Math.abs(a.height - b.height) < epsilon;
}
function invertPageRotation(dx, dy, rotation) {
  switch (rotation) {
    case 0:
      return { x: dx, y: dy };
    case 90:
      return { x: dy, y: -dx };
    case 180:
      return { x: -dx, y: -dy };
    case 270:
      return { x: -dy, y: dx };
  }
}
function remapPoint(p, oldBounds, newBounds) {
  const sx = oldBounds.width > 0 ? (p.x - oldBounds.x) / oldBounds.width : 0;
  const sy = oldBounds.height > 0 ? (p.y - oldBounds.y) / oldBounds.height : 0;
  return { x: newBounds.x + sx * newBounds.width, y: newBounds.y + sy * newBounds.height };
}
function remapQuads(quads, oldBounds, newBounds) {
  return quads.map((q) => ({
    points: q.points.map((p) => remapPoint(p, oldBounds, newBounds))
  }));
}
function resizeAnnotation(annotation, newBounds) {
  const oldBounds = annotation.bounds;
  const base = { bounds: newBounds };
  switch (annotation.type) {
    case "line":
      return {
        ...annotation,
        ...base,
        start: remapPoint(annotation.start, oldBounds, newBounds),
        end: remapPoint(annotation.end, oldBounds, newBounds)
      };
    case "polygon":
    case "polyLine":
      return {
        ...annotation,
        ...base,
        vertices: annotation.vertices.map((p) => remapPoint(p, oldBounds, newBounds))
      };
    case "ink":
      return {
        ...annotation,
        ...base,
        inkList: annotation.inkList.map((stroke) => stroke.map((p) => remapPoint(p, oldBounds, newBounds)))
      };
    case "highlight":
    case "underline":
    case "strikeOut":
    case "squiggly":
      return { ...annotation, ...base, quads: remapQuads(annotation.quads, oldBounds, newBounds) };
    case "redact":
      return {
        ...annotation,
        ...base,
        quads: annotation.quads ? remapQuads(annotation.quads, oldBounds, newBounds) : void 0
      };
    case "freeText":
      return {
        ...annotation,
        ...base,
        calloutLine: annotation.calloutLine?.map((p) => remapPoint(p, oldBounds, newBounds))
      };
    default:
      return { ...annotation, ...base };
  }
}
function offsetRect(r, dx, dy) {
  return { x: r.x + dx, y: r.y + dy, width: r.width, height: r.height };
}
function offsetPoint(p, dx, dy) {
  return { x: p.x + dx, y: p.y + dy };
}
function offsetQuads(quads, dx, dy) {
  return quads.map((q) => ({
    points: q.points.map((p) => offsetPoint(p, dx, dy))
  }));
}
function offsetAnnotation(annotation, dx, dy) {
  const base = { bounds: offsetRect(annotation.bounds, dx, dy) };
  switch (annotation.type) {
    case "line":
      return {
        ...annotation,
        ...base,
        start: offsetPoint(annotation.start, dx, dy),
        end: offsetPoint(annotation.end, dx, dy)
      };
    case "polygon":
    case "polyLine":
      return { ...annotation, ...base, vertices: annotation.vertices.map((p) => offsetPoint(p, dx, dy)) };
    case "ink":
      return {
        ...annotation,
        ...base,
        inkList: annotation.inkList.map((stroke) => stroke.map((p) => offsetPoint(p, dx, dy)))
      };
    case "highlight":
    case "underline":
    case "strikeOut":
    case "squiggly":
      return { ...annotation, ...base, quads: offsetQuads(annotation.quads, dx, dy) };
    case "redact":
      return {
        ...annotation,
        ...base,
        quads: annotation.quads ? offsetQuads(annotation.quads, dx, dy) : void 0
      };
    case "freeText":
      return { ...annotation, ...base, calloutLine: annotation.calloutLine?.map((p) => offsetPoint(p, dx, dy)) };
    default:
      return { ...annotation, ...base };
  }
}
function applyAnnotationPatch(existing, patch) {
  const result = { ...existing };
  const patchRecord = patch;
  for (const key of Object.keys(patchRecord)) {
    if (key === "type" || key === "name")
      continue;
    const value = patchRecord[key];
    if (value === void 0)
      continue;
    if (key === "metadata" && value && typeof value === "object") {
      result.metadata = { ...existing.metadata ?? {}, ...value };
    } else {
      result[key] = value;
    }
  }
  return result;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/annotation/MarkupRenderer.js
function renderHighlight(layer, annotation, scale) {
  const container = document.createElement("div");
  container.className = "udoc-annotation udoc-annotation--highlight";
  container.style.position = "absolute";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  const opacity = annotation.opacity ?? 0.3;
  for (const quad of annotation.quads) {
    const quadEl = createQuadElement(quad, scale, annotation.color, opacity);
    container.appendChild(quadEl);
  }
  layer.appendChild(container);
  return container;
}
function renderUnderline(layer, annotation, scale) {
  const container = document.createElement("div");
  container.className = "udoc-annotation udoc-annotation--underline";
  container.style.position = "absolute";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  const opacity = annotation.opacity ?? 1;
  for (const quad of annotation.quads) {
    const lineEl = createUnderlineElement(quad, scale, annotation.color, opacity);
    container.appendChild(lineEl);
  }
  layer.appendChild(container);
  return container;
}
function renderStrikeOut(layer, annotation, scale) {
  const container = document.createElement("div");
  container.className = "udoc-annotation udoc-annotation--strikeout";
  container.style.position = "absolute";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  const opacity = annotation.opacity ?? 1;
  for (const quad of annotation.quads) {
    const lineEl = createStrikeOutElement(quad, scale, annotation.color, opacity);
    container.appendChild(lineEl);
  }
  layer.appendChild(container);
  return container;
}
function renderSquiggly(layer, annotation, scale) {
  const container = document.createElement("div");
  container.className = "udoc-annotation udoc-annotation--squiggly";
  container.style.position = "absolute";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  const opacity = annotation.opacity ?? 1;
  for (const quad of annotation.quads) {
    const lineEl = createSquigglyElement(quad, scale, annotation.color, opacity);
    container.appendChild(lineEl);
  }
  layer.appendChild(container);
  return container;
}
function createQuadElement(quad, scale, color, opacity) {
  const el = document.createElement("div");
  el.className = "udoc-annotation__quad";
  const points = quad.points.map((p) => `${p.x * scale}px ${p.y * scale}px`).join(", ");
  el.style.position = "absolute";
  el.style.inset = "0";
  el.style.clipPath = `polygon(${points})`;
  el.style.backgroundColor = colorToRgba(color, opacity);
  return el;
}
function createUnderlineElement(quad, scale, color, opacity) {
  const el = document.createElement("div");
  el.className = "udoc-annotation__line";
  const [bl, br] = quad.points;
  const x = Math.min(bl.x, br.x) * scale;
  const y = Math.max(bl.y, br.y) * scale;
  const width = Math.abs(br.x - bl.x) * scale;
  el.style.position = "absolute";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${width}px`;
  el.style.height = "1px";
  el.style.backgroundColor = colorToRgba(color, opacity, "rgba(0, 0, 255, 1)");
  return el;
}
function createStrikeOutElement(quad, scale, color, opacity) {
  const el = document.createElement("div");
  el.className = "udoc-annotation__line";
  const [bl, br, _tr, tl] = quad.points;
  const x = Math.min(bl.x, tl.x) * scale;
  const y = (bl.y + tl.y) / 2 * scale;
  const width = Math.abs(br.x - bl.x) * scale;
  el.style.position = "absolute";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${width}px`;
  el.style.height = "1px";
  el.style.backgroundColor = colorToRgba(color, opacity, "rgba(255, 0, 0, 1)");
  return el;
}
function createSquigglyElement(quad, scale, color, opacity) {
  const el = document.createElement("div");
  el.className = "udoc-annotation__squiggly";
  const [bl, br] = quad.points;
  const x = Math.min(bl.x, br.x) * scale;
  const y = Math.max(bl.y, br.y) * scale;
  const width = Math.abs(br.x - bl.x) * scale;
  el.style.position = "absolute";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${width}px`;
  el.style.height = "3px";
  const colorStr = colorToRgb(color, "rgb(255, 0, 0)");
  el.style.backgroundImage = `repeating-linear-gradient(90deg, ${colorStr}, ${colorStr} 2px, transparent 2px, transparent 4px)`;
  el.style.opacity = String(opacity);
  return el;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/annotation/LinkRenderer.js
function renderLink(layer, annotation, scale) {
  const el = document.createElement("div");
  el.className = "udoc-annotation udoc-annotation--link";
  applyBoundsStyle(el, annotation.bounds, scale);
  el.style.pointerEvents = "auto";
  el.style.cursor = "pointer";
  if (annotation.action) {
    el.dataset.action = JSON.stringify(annotation.action);
  }
  layer.appendChild(el);
  return el;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/annotation/TextRenderer.js
var STICKY_NOTE_ICON_SIZE = 18;
var DEFAULT_STICKY_NOTE_COLOR = { r: 1, g: 0.8, b: 0.2 };
function createStickyNoteSvg(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const fill = `rgb(${r}, ${g}, ${b})`;
  const strokeR = Math.round(color.r * 180);
  const strokeG = Math.round(color.g * 180);
  const strokeB = Math.round(color.b * 180);
  const stroke = `rgb(${strokeR}, ${strokeG}, ${strokeB})`;
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
</svg>`;
}
function renderText(layer, annotation, scale, onShowPopup) {
  const el = document.createElement("div");
  el.className = "udoc-annotation udoc-annotation--text";
  el.style.position = "absolute";
  el.style.left = `${annotation.bounds.x * scale}px`;
  el.style.top = `${(annotation.bounds.y + annotation.bounds.height) * scale - STICKY_NOTE_ICON_SIZE}px`;
  el.style.width = `${STICKY_NOTE_ICON_SIZE}px`;
  el.style.height = `${STICKY_NOTE_ICON_SIZE}px`;
  el.style.pointerEvents = "auto";
  el.style.cursor = "pointer";
  const color = annotation.color || DEFAULT_STICKY_NOTE_COLOR;
  el.innerHTML = createStickyNoteSvg(color);
  el.dataset.annotationType = "text";
  el.dataset.annotation = JSON.stringify({
    contents: annotation.contents,
    metadata: annotation.metadata
  });
  const contents = annotation.metadata?.contents || annotation.contents;
  if (contents) {
    el.title = contents;
  }
  if (annotation.metadata && onShowPopup) {
    const colorStr = colorToRgb(color, "rgb(255, 208, 0)");
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onShowPopup(el, annotation.metadata, colorStr);
    });
  }
  layer.appendChild(el);
  return el;
}
function renderFreeText(layer, annotation, scale) {
  const scaled = scaleBounds(annotation.bounds, scale);
  const color = colorToRgb(annotation.color, "rgb(0, 0, 0)");
  const borderColor = colorToRgb(annotation.borderColor, "transparent");
  const el = document.createElement("div");
  el.className = "udoc-annotation udoc-annotation--freetext";
  el.style.position = "absolute";
  el.style.left = `${scaled.x}px`;
  el.style.top = `${scaled.y}px`;
  el.style.width = `${scaled.width}px`;
  el.style.height = `${scaled.height}px`;
  el.style.color = color;
  el.style.border = `1px solid ${borderColor}`;
  el.style.fontSize = `${12 * (scale / 96 * 72)}px`;
  el.style.fontFamily = "Helvetica, Arial, sans-serif";
  el.style.textAlign = annotation.justification || "left";
  el.style.overflow = "hidden";
  el.style.wordWrap = "break-word";
  el.style.pointerEvents = "none";
  el.style.padding = "2px";
  el.style.boxSizing = "border-box";
  if (annotation.contents) {
    el.textContent = annotation.contents;
  }
  if (annotation.calloutLine && annotation.calloutLine.length >= 2) {
    const svg = createSvgOverlay();
    const lineColor = colorToRgb(annotation.borderColor, "rgb(0, 0, 0)");
    const strokeWidth = Math.max(1, scale);
    const pathData = annotation.calloutLine.map((point, i) => {
      const x = point.x * scale;
      const y = point.y * scale;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    const path = createSvgElement("path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", lineColor);
    path.setAttribute("stroke-width", String(strokeWidth));
    path.setAttribute("fill", "none");
    svg.appendChild(path);
    layer.appendChild(svg);
  }
  layer.appendChild(el);
  return el;
}
function renderStamp(layer, annotation, scale) {
  const scaled = scaleBounds(annotation.bounds, scale);
  const color = colorToRgb(annotation.color, "rgb(255, 0, 0)");
  const el = document.createElement("div");
  el.className = "udoc-annotation udoc-annotation--stamp";
  el.style.position = "absolute";
  el.style.left = `${scaled.x}px`;
  el.style.top = `${scaled.y}px`;
  el.style.width = `${scaled.width}px`;
  el.style.height = `${scaled.height}px`;
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.pointerEvents = "none";
  if (!annotation.hasCustomAppearance && annotation.name) {
    const zoomFactor = scale / 1.333;
    const label = document.createElement("span");
    label.style.color = color;
    label.style.fontSize = `${Math.min(scaled.height * 0.4, 16 * zoomFactor)}px`;
    label.style.fontWeight = "bold";
    label.style.fontFamily = "Helvetica, Arial, sans-serif";
    label.style.textTransform = "uppercase";
    label.style.border = `2px solid ${color}`;
    label.style.padding = `${2 * zoomFactor}px ${4 * zoomFactor}px`;
    label.style.transform = "rotate(-15deg)";
    label.style.whiteSpace = "nowrap";
    label.textContent = annotation.name;
    el.appendChild(label);
  }
  layer.appendChild(el);
  return el;
}
var CARET_ICON_SIZE = 12;
function renderCaret(layer, annotation, scale) {
  const svg = createSvgOverlay();
  const color = colorToRgb(annotation.color, "rgb(0, 128, 255)");
  const opacity = annotation.opacity ?? 1;
  const scaled = scaleBounds(annotation.bounds, scale);
  const g = createSvgElement("g");
  g.setAttribute("opacity", String(opacity));
  const zoomFactor = scale / 1.333;
  const iconSize = Math.max(CARET_ICON_SIZE * zoomFactor, scaled.height);
  if (annotation.symbol === "P") {
    const text = createSvgElement("text");
    text.setAttribute("x", String(scaled.x + scaled.width / 2));
    text.setAttribute("y", String(scaled.y + scaled.height * 0.8));
    text.setAttribute("fill", color);
    text.setAttribute("font-size", String(iconSize));
    text.setAttribute("text-anchor", "middle");
    text.textContent = "\xB6";
    g.appendChild(text);
  } else {
    const caretHeight = Math.min(scaled.height, iconSize);
    const caretWidth = caretHeight * 0.8;
    const centerX = scaled.x + scaled.width / 2;
    const bottomY = scaled.y + scaled.height;
    const path = createSvgElement("path");
    path.setAttribute("d", `M ${centerX - caretWidth / 2} ${bottomY} L ${centerX} ${bottomY - caretHeight} L ${centerX + caretWidth / 2} ${bottomY}`);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", String(Math.max(2, 2 * zoomFactor)));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    g.appendChild(path);
  }
  svg.appendChild(g);
  layer.appendChild(svg);
  return svg;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/annotation/ShapeRenderer.js
function applyDashPattern(el, borderStyle, strokeWidth) {
  if (borderStyle === "dashed") {
    el.setAttribute("stroke-dasharray", `${strokeWidth * 3} ${strokeWidth * 2}`);
  } else if (borderStyle === "dotted") {
    el.setAttribute("stroke-dasharray", `${strokeWidth} ${strokeWidth}`);
  }
}
function renderLine(layer, annotation, scale) {
  const svg = createSvgOverlay();
  const color = colorToRgb(annotation.color, "rgb(0, 0, 0)");
  const interiorColor = colorToRgb(annotation.interiorColor, color);
  const strokeWidth = (annotation.borderWidth ?? 1) * scale;
  const opacity = annotation.opacity ?? 1;
  const startX = annotation.start.x * scale;
  const startY = annotation.start.y * scale;
  const endX = annotation.end.x * scale;
  const endY = annotation.end.y * scale;
  const g = createSvgElement("g");
  g.setAttribute("opacity", String(opacity));
  const line = createSvgElement("line");
  line.setAttribute("x1", String(startX));
  line.setAttribute("y1", String(startY));
  line.setAttribute("x2", String(endX));
  line.setAttribute("y2", String(endY));
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", String(strokeWidth));
  applyDashPattern(line, annotation.borderStyle, strokeWidth);
  g.appendChild(line);
  const angle = Math.atan2(endY - startY, endX - startX);
  drawLineEnding(g, startX, startY, annotation.startEnding || "None", angle + Math.PI, strokeWidth, color, interiorColor);
  drawLineEnding(g, endX, endY, annotation.endEnding || "None", angle, strokeWidth, color, interiorColor);
  svg.appendChild(g);
  layer.appendChild(svg);
  return svg;
}
function drawLineEnding(g, x, y, ending, angle, strokeWidth, color, interiorColor) {
  if (ending === "None")
    return;
  const size = strokeWidth * 4;
  switch (ending) {
    case "OpenArrow": {
      const p1x = x - size * Math.cos(angle - Math.PI / 6);
      const p1y = y - size * Math.sin(angle - Math.PI / 6);
      const p2x = x - size * Math.cos(angle + Math.PI / 6);
      const p2y = y - size * Math.sin(angle + Math.PI / 6);
      const path = createSvgElement("path");
      path.setAttribute("d", `M ${p1x} ${p1y} L ${x} ${y} L ${p2x} ${p2y}`);
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", String(strokeWidth));
      path.setAttribute("fill", "none");
      g.appendChild(path);
      break;
    }
    case "ClosedArrow": {
      const p1x = x - size * Math.cos(angle - Math.PI / 6);
      const p1y = y - size * Math.sin(angle - Math.PI / 6);
      const p2x = x - size * Math.cos(angle + Math.PI / 6);
      const p2y = y - size * Math.sin(angle + Math.PI / 6);
      const polygon = createSvgElement("polygon");
      polygon.setAttribute("points", `${x},${y} ${p1x},${p1y} ${p2x},${p2y}`);
      polygon.setAttribute("fill", interiorColor);
      polygon.setAttribute("stroke", color);
      polygon.setAttribute("stroke-width", String(strokeWidth * 0.5));
      g.appendChild(polygon);
      break;
    }
    case "Circle": {
      const circle = createSvgElement("circle");
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("r", String(size / 2));
      circle.setAttribute("fill", interiorColor);
      circle.setAttribute("stroke", color);
      circle.setAttribute("stroke-width", String(strokeWidth * 0.5));
      g.appendChild(circle);
      break;
    }
    case "Square": {
      const rect = createSvgElement("rect");
      rect.setAttribute("x", String(x - size / 2));
      rect.setAttribute("y", String(y - size / 2));
      rect.setAttribute("width", String(size));
      rect.setAttribute("height", String(size));
      rect.setAttribute("fill", interiorColor);
      rect.setAttribute("stroke", color);
      rect.setAttribute("stroke-width", String(strokeWidth * 0.5));
      g.appendChild(rect);
      break;
    }
    case "Diamond": {
      const dx = size / 2;
      const points = `${x},${y - dx} ${x + dx},${y} ${x},${y + dx} ${x - dx},${y}`;
      const polygon = createSvgElement("polygon");
      polygon.setAttribute("points", points);
      polygon.setAttribute("fill", interiorColor);
      polygon.setAttribute("stroke", color);
      polygon.setAttribute("stroke-width", String(strokeWidth * 0.5));
      g.appendChild(polygon);
      break;
    }
    case "Butt": {
      const perpAngle = angle + Math.PI / 2;
      const p1x = x + size / 2 * Math.cos(perpAngle);
      const p1y = y + size / 2 * Math.sin(perpAngle);
      const p2x = x - size / 2 * Math.cos(perpAngle);
      const p2y = y - size / 2 * Math.sin(perpAngle);
      const line = createSvgElement("line");
      line.setAttribute("x1", String(p1x));
      line.setAttribute("y1", String(p1y));
      line.setAttribute("x2", String(p2x));
      line.setAttribute("y2", String(p2y));
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", String(strokeWidth));
      g.appendChild(line);
      break;
    }
    case "ROpenArrow": {
      const p1x = x + size * Math.cos(angle - Math.PI / 6);
      const p1y = y + size * Math.sin(angle - Math.PI / 6);
      const p2x = x + size * Math.cos(angle + Math.PI / 6);
      const p2y = y + size * Math.sin(angle + Math.PI / 6);
      const path = createSvgElement("path");
      path.setAttribute("d", `M ${p1x} ${p1y} L ${x} ${y} L ${p2x} ${p2y}`);
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", String(strokeWidth));
      path.setAttribute("fill", "none");
      g.appendChild(path);
      break;
    }
    case "RClosedArrow": {
      const p1x = x + size * Math.cos(angle - Math.PI / 6);
      const p1y = y + size * Math.sin(angle - Math.PI / 6);
      const p2x = x + size * Math.cos(angle + Math.PI / 6);
      const p2y = y + size * Math.sin(angle + Math.PI / 6);
      const polygon = createSvgElement("polygon");
      polygon.setAttribute("points", `${x},${y} ${p1x},${p1y} ${p2x},${p2y}`);
      polygon.setAttribute("fill", interiorColor);
      polygon.setAttribute("stroke", color);
      polygon.setAttribute("stroke-width", String(strokeWidth * 0.5));
      g.appendChild(polygon);
      break;
    }
    case "Slash": {
      const slashAngle = angle + Math.PI / 4;
      const p1x = x + size / 2 * Math.cos(slashAngle);
      const p1y = y + size / 2 * Math.sin(slashAngle);
      const p2x = x - size / 2 * Math.cos(slashAngle);
      const p2y = y - size / 2 * Math.sin(slashAngle);
      const line = createSvgElement("line");
      line.setAttribute("x1", String(p1x));
      line.setAttribute("y1", String(p1y));
      line.setAttribute("x2", String(p2x));
      line.setAttribute("y2", String(p2y));
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", String(strokeWidth));
      g.appendChild(line);
      break;
    }
  }
}
function renderSquare(layer, annotation, scale) {
  const svg = createSvgOverlay();
  const color = colorToRgb(annotation.color, "rgb(0, 0, 0)");
  const interiorColor = annotation.interiorColor ? colorToRgb(annotation.interiorColor, "none") : "none";
  const strokeWidth = (annotation.borderWidth ?? 1) * scale;
  const opacity = annotation.opacity ?? 1;
  const scaled = scaleBounds(annotation.bounds, scale);
  const rect = createSvgElement("rect");
  rect.setAttribute("x", String(scaled.x + strokeWidth / 2));
  rect.setAttribute("y", String(scaled.y + strokeWidth / 2));
  rect.setAttribute("width", String(Math.max(0, scaled.width - strokeWidth)));
  rect.setAttribute("height", String(Math.max(0, scaled.height - strokeWidth)));
  rect.setAttribute("fill", interiorColor);
  rect.setAttribute("stroke", color);
  rect.setAttribute("stroke-width", String(strokeWidth));
  rect.setAttribute("opacity", String(opacity));
  applyDashPattern(rect, annotation.borderStyle, strokeWidth);
  svg.appendChild(rect);
  layer.appendChild(svg);
  return svg;
}
function renderCircle(layer, annotation, scale) {
  const svg = createSvgOverlay();
  const color = colorToRgb(annotation.color, "rgb(0, 0, 0)");
  const interiorColor = annotation.interiorColor ? colorToRgb(annotation.interiorColor, "none") : "none";
  const strokeWidth = (annotation.borderWidth ?? 1) * scale;
  const opacity = annotation.opacity ?? 1;
  const scaled = scaleBounds(annotation.bounds, scale);
  const cx = scaled.x + scaled.width / 2;
  const cy = scaled.y + scaled.height / 2;
  const rx = (scaled.width - strokeWidth) / 2;
  const ry = (scaled.height - strokeWidth) / 2;
  const ellipse = createSvgElement("ellipse");
  ellipse.setAttribute("cx", String(cx));
  ellipse.setAttribute("cy", String(cy));
  ellipse.setAttribute("rx", String(Math.max(0, rx)));
  ellipse.setAttribute("ry", String(Math.max(0, ry)));
  ellipse.setAttribute("fill", interiorColor);
  ellipse.setAttribute("stroke", color);
  ellipse.setAttribute("stroke-width", String(strokeWidth));
  ellipse.setAttribute("opacity", String(opacity));
  applyDashPattern(ellipse, annotation.borderStyle, strokeWidth);
  svg.appendChild(ellipse);
  layer.appendChild(svg);
  return svg;
}
function renderPolygon(layer, annotation, scale) {
  if (!annotation.vertices || annotation.vertices.length < 2) {
    return document.createElement("div");
  }
  const svg = createSvgOverlay();
  const color = colorToRgb(annotation.color, "rgb(0, 0, 0)");
  const interiorColor = annotation.interiorColor ? colorToRgb(annotation.interiorColor, "none") : "none";
  const strokeWidth = (annotation.borderWidth ?? 1) * scale;
  const opacity = annotation.opacity ?? 1;
  const scaledPoints = annotation.vertices.map((p) => ({
    x: p.x * scale,
    y: p.y * scale
  }));
  const el = scaledPoints.length < 3 ? createSvgElement("polyline") : createSvgElement("polygon");
  el.setAttribute("points", scaledPoints.map((p) => `${p.x},${p.y}`).join(" "));
  el.setAttribute("fill", scaledPoints.length < 3 ? "none" : interiorColor);
  el.setAttribute("stroke", color);
  el.setAttribute("stroke-width", String(strokeWidth));
  el.setAttribute("opacity", String(opacity));
  svg.appendChild(el);
  layer.appendChild(svg);
  return svg;
}
function renderPolyLine(layer, annotation, scale) {
  if (!annotation.vertices || annotation.vertices.length < 2) {
    return document.createElement("div");
  }
  const svg = createSvgOverlay();
  const color = colorToRgb(annotation.color, "rgb(0, 0, 0)");
  const strokeWidth = (annotation.borderWidth ?? 1) * scale;
  const opacity = annotation.opacity ?? 1;
  const scaledPoints = annotation.vertices.map((p) => ({
    x: p.x * scale,
    y: p.y * scale
  }));
  const polyline = createSvgElement("polyline");
  polyline.setAttribute("points", scaledPoints.map((p) => `${p.x},${p.y}`).join(" "));
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", color);
  polyline.setAttribute("stroke-width", String(strokeWidth));
  polyline.setAttribute("opacity", String(opacity));
  applyDashPattern(polyline, annotation.borderStyle, strokeWidth);
  svg.appendChild(polyline);
  layer.appendChild(svg);
  return svg;
}
function renderInk(layer, annotation, scale) {
  if (!annotation.inkList || annotation.inkList.length === 0) {
    return document.createElement("div");
  }
  const svg = createSvgOverlay();
  const color = colorToRgb(annotation.color, "rgb(0, 0, 0)");
  const strokeWidth = (annotation.borderWidth ?? 1) * scale;
  const opacity = annotation.opacity ?? 1;
  const g = createSvgElement("g");
  g.setAttribute("opacity", String(opacity));
  for (const stroke of annotation.inkList) {
    if (stroke.length < 2)
      continue;
    const pathData = stroke.map((p, i) => {
      const x = p.x * scale;
      const y = p.y * scale;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    const path = createSvgElement("path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", String(strokeWidth));
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    applyDashPattern(path, annotation.borderStyle, strokeWidth);
    g.appendChild(path);
  }
  svg.appendChild(g);
  layer.appendChild(svg);
  return svg;
}
function renderRedact(layer, annotation, scale) {
  const svg = createSvgOverlay();
  const borderColor = colorToRgb(annotation.color, "rgb(255, 0, 0)");
  const fillColor = colorToRgb(annotation.interiorColor, "rgb(0, 0, 0)");
  const opacity = annotation.opacity ?? 1;
  const strokeWidth = 2 * scale;
  const g = createSvgElement("g");
  g.setAttribute("opacity", String(opacity));
  if (annotation.quads && annotation.quads.length > 0) {
    for (const quad of annotation.quads) {
      const scaledPoints = quad.points.map((p) => ({
        x: p.x * scale,
        y: p.y * scale
      }));
      const polygon = createSvgElement("polygon");
      polygon.setAttribute("points", scaledPoints.map((p) => `${p.x},${p.y}`).join(" "));
      polygon.setAttribute("fill", fillColor);
      polygon.setAttribute("fill-opacity", "0.3");
      polygon.setAttribute("stroke", borderColor);
      polygon.setAttribute("stroke-width", String(strokeWidth));
      polygon.setAttribute("stroke-dasharray", `${4 * scale} ${2 * scale}`);
      g.appendChild(polygon);
    }
  } else {
    const scaled = scaleBounds(annotation.bounds, scale);
    const rect = createSvgElement("rect");
    rect.setAttribute("x", String(scaled.x));
    rect.setAttribute("y", String(scaled.y));
    rect.setAttribute("width", String(scaled.width));
    rect.setAttribute("height", String(scaled.height));
    rect.setAttribute("fill", fillColor);
    rect.setAttribute("fill-opacity", "0.3");
    rect.setAttribute("stroke", borderColor);
    rect.setAttribute("stroke-width", String(strokeWidth));
    rect.setAttribute("stroke-dasharray", `${4 * scale} ${2 * scale}`);
    g.appendChild(rect);
    if (annotation.overlayText) {
      const text = createSvgElement("text");
      text.setAttribute("x", String(scaled.x + scaled.width / 2));
      text.setAttribute("y", String(scaled.y + scaled.height / 2));
      text.setAttribute("fill", borderColor);
      text.setAttribute("font-size", String(Math.min(scaled.height * 0.6, 14 * scale)));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.textContent = annotation.overlayText;
      g.appendChild(text);
    }
  }
  svg.appendChild(g);
  layer.appendChild(svg);
  return svg;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/annotation/render.js
function isSvgBasedAnnotation(type) {
  return type === "caret" || type === "line" || type === "square" || type === "circle" || type === "polygon" || type === "polyLine" || type === "ink" || type === "redact";
}
function isFullLayerAnnotation(type) {
  return type === "highlight" || type === "underline" || type === "strikeOut" || type === "squiggly";
}
function createHighlightIndicator(bounds, scale) {
  const el = document.createElement("div");
  el.className = "udoc-annotation-highlight-indicator";
  applyBoundsStyle(el, bounds, scale);
  return el;
}
function renderAnnotation(layer, annotation, scale, onShowPopup) {
  switch (annotation.type) {
    case "link":
      return renderLink(layer, annotation, scale);
    case "highlight":
      return renderHighlight(layer, annotation, scale);
    case "underline":
      return renderUnderline(layer, annotation, scale);
    case "strikeOut":
      return renderStrikeOut(layer, annotation, scale);
    case "squiggly":
      return renderSquiggly(layer, annotation, scale);
    case "text":
      return renderText(layer, annotation, scale, onShowPopup);
    case "freeText":
      return renderFreeText(layer, annotation, scale);
    case "stamp":
      return renderStamp(layer, annotation, scale);
    case "caret":
      return renderCaret(layer, annotation, scale);
    case "line":
      return renderLine(layer, annotation, scale);
    case "square":
      return renderSquare(layer, annotation, scale);
    case "circle":
      return renderCircle(layer, annotation, scale);
    case "polygon":
      return renderPolygon(layer, annotation, scale);
    case "polyLine":
      return renderPolyLine(layer, annotation, scale);
    case "ink":
      return renderInk(layer, annotation, scale);
    case "redact":
      return renderRedact(layer, annotation, scale);
    default: {
      const unknown = annotation;
      if (!unknown.bounds)
        return null;
      return createGenericAnnotation(layer, unknown, scale);
    }
  }
}
function createGenericAnnotation(layer, annotation, scale) {
  const el = document.createElement("div");
  el.className = `udoc-annotation udoc-annotation--${annotation.type}`;
  applyBoundsStyle(el, annotation.bounds, scale);
  layer.appendChild(el);
  return el;
}
function renderAnnotationsToLayer(layer, annotations, scale, highlightBounds, onShowPopup) {
  if (annotations.length === 0) {
    if (layer.childElementCount > 0) {
      layer.innerHTML = "";
    }
    return;
  }
  layer.innerHTML = "";
  for (let i = 0; i < annotations.length; i++) {
    const annotation = annotations[i];
    const el = renderAnnotation(layer, annotation, scale, onShowPopup);
    if (el) {
      el.setAttribute("data-annotation-index", String(i));
      if (highlightBounds && boundsMatch(annotation.bounds, highlightBounds)) {
        if (isFullLayerAnnotation(annotation.type) || isSvgBasedAnnotation(annotation.type)) {
          const indicator = createHighlightIndicator(annotation.bounds, scale);
          layer.appendChild(indicator);
        } else {
          el.classList.add("udoc-annotation--highlighted");
        }
      }
    }
  }
}
var activePopup = null;
function closeAnnotationPopup() {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
}
function showAnnotationPopup(annotation, anchorEl, container) {
  closeAnnotationPopup();
  const contents = annotation.metadata?.contents || annotation.contents;
  if (!contents)
    return;
  const popup = document.createElement("div");
  popup.className = "udoc-annotation-popup";
  const header = document.createElement("div");
  header.className = "udoc-annotation-popup__header";
  const author = document.createElement("span");
  author.className = "udoc-annotation-popup__author";
  author.textContent = annotation.metadata?.author || "Note";
  header.appendChild(author);
  const closeBtn = document.createElement("button");
  closeBtn.className = "udoc-annotation-popup__close";
  closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    closeAnnotationPopup();
  };
  header.appendChild(closeBtn);
  popup.appendChild(header);
  const content = document.createElement("div");
  content.className = "udoc-annotation-popup__content";
  content.textContent = contents;
  popup.appendChild(content);
  const anchorRect = anchorEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const left = anchorRect.right - containerRect.left + 4;
  const top = anchorRect.top - containerRect.top;
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  container.appendChild(popup);
  activePopup = popup;
  requestAnimationFrame(() => {
    const popupRect = popup.getBoundingClientRect();
    if (popupRect.right > containerRect.right - 8) {
      popup.style.left = `${anchorRect.left - containerRect.left - popupRect.width - 4}px`;
    }
    if (popupRect.bottom > containerRect.bottom - 8) {
      popup.style.top = `${containerRect.bottom - containerRect.top - popupRect.height - 8}px`;
    }
  });
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/text/render.js
var pendingMeasure = null;
var measureRaf = 0;
function scheduleMeasure(spans) {
  if (pendingMeasure) {
    pendingMeasure.push(...spans);
  } else {
    pendingMeasure = spans;
  }
  if (!measureRaf) {
    measureRaf = requestAnimationFrame(flushMeasure);
  }
}
function flushMeasure() {
  measureRaf = 0;
  const spans = pendingMeasure;
  if (!spans || spans.length === 0) {
    pendingMeasure = null;
    return;
  }
  pendingMeasure = null;
  const measurements = new Array(spans.length);
  for (let i = 0; i < spans.length; i++) {
    measurements[i] = spans[i].span.offsetWidth;
  }
  for (let i = 0; i < spans.length; i++) {
    const { span, targetWidth, angle } = spans[i];
    const naturalWidth = measurements[i];
    const hasRotation = Math.abs(angle) > 0.1;
    if (naturalWidth > 0 && targetWidth > 0) {
      const sx = targetWidth / naturalWidth;
      if (Math.abs(sx - 1) > 1e-3) {
        span.style.transform = hasRotation ? `rotate(${angle}deg) scaleX(${sx})` : `scaleX(${sx})`;
      } else if (hasRotation) {
        span.style.transform = `rotate(${angle}deg)`;
      }
    } else if (hasRotation) {
      span.style.transform = `rotate(${angle}deg)`;
    }
    span.style.width = px(naturalWidth);
  }
}
function px(v) {
  return `${v}px`;
}
function cssMatrix(t, scale) {
  return `matrix(${t.scaleX},${t.skewY},${t.skewX},${t.scaleY},${t.translateX * scale},${t.translateY * scale})`;
}
function compose2(a, b) {
  return {
    scaleX: a.scaleX * b.scaleX + a.skewX * b.skewY,
    skewY: a.skewY * b.scaleX + a.scaleY * b.skewY,
    skewX: a.scaleX * b.skewX + a.skewX * b.scaleY,
    scaleY: a.skewY * b.skewX + a.scaleY * b.scaleY,
    translateX: a.scaleX * b.translateX + a.skewX * b.translateY + a.translateX,
    translateY: a.skewY * b.translateX + a.scaleY * b.translateY + a.translateY
  };
}
function translate2(t, dx, dy) {
  return {
    scaleX: t.scaleX,
    skewY: t.skewY,
    skewX: t.skewX,
    scaleY: t.scaleY,
    translateX: t.scaleX * dx + t.skewX * dy + t.translateX,
    translateY: t.skewY * dx + t.scaleY * dy + t.translateY
  };
}
function isFlat(layout) {
  for (const frame of layout.frames) {
    if (!frame.parcel)
      continue;
    for (const line of frame.parcel.lines) {
      if (line.content.type !== "runList")
        continue;
      for (const run of line.content.runs) {
        const t = run.transform;
        if (Math.abs(t.scaleX - 1) > 1e-3 || Math.abs(t.scaleY - 1) > 1e-3 || Math.abs(t.skewX) > 1e-3 || Math.abs(t.skewY) > 1e-3 || Math.abs(t.translateX) > 1e-3 || Math.abs(t.translateY) > 1e-3) {
          return true;
        }
        if (run.content.type === "glyphs")
          return false;
      }
    }
  }
  return false;
}
function renderTextToLayer(layer, layout, scale, _pageHeight) {
  if (!layout) {
    layer.replaceChildren();
    return;
  }
  if (isFlat(layout)) {
    renderFlat(layer, layout, scale);
  } else {
    renderHierarchical(layer, layout, scale);
  }
}
function renderFlat(layer, layout, scale) {
  const pendingSpans = [];
  const fragment = document.createDocumentFragment();
  for (const frame of layout.frames) {
    if (frame.parcel) {
      flattenParcel(fragment, frame.transform, frame.parcel, scale, pendingSpans);
    }
  }
  layer.replaceChildren(fragment);
  if (pendingSpans.length > 0) {
    scheduleMeasure(pendingSpans);
  }
}
function flattenParcel(parent, base, parcel, scale, pending) {
  const t = translate2(base, parcel.x, parcel.y);
  for (const line of parcel.lines) {
    flattenLine(parent, t, line, scale, pending);
  }
}
function flattenLine(parent, base, line, scale, pending) {
  const content = line.content;
  if (content.type === "runList") {
    const t = translate2(base, 0, line.y + content.baseline);
    for (const run of content.runs) {
      const span = flattenRun(t, run, scale, pending);
      if (span)
        parent.appendChild(span);
    }
  } else {
    const t = translate2(base, 0, line.y);
    flattenTable(parent, t, content, scale, pending);
  }
}
function flattenRun(base, run, scale, pending) {
  const c = run.content;
  const t = translate2(base, run.x, 0);
  const combined = compose2(t, run.transform);
  const effectiveScaleX = Math.sqrt(combined.scaleX ** 2 + combined.skewY ** 2);
  const effectiveScaleY = Math.sqrt(combined.scaleY ** 2 + combined.skewX ** 2);
  if (c.type === "glyphs") {
    if (!c.text || c.glyphs.length === 0)
      return null;
    const fontSize = c.fontSize * effectiveScaleY;
    const ascent = c.ascent * effectiveScaleY;
    const height = (c.ascent + c.descent) * effectiveScaleY * scale;
    const lastGlyph = c.glyphs[c.glyphs.length - 1];
    const targetWidth = (lastGlyph.x + lastGlyph.advance) * effectiveScaleX * scale;
    const angleRad = Math.atan2(combined.skewY, combined.scaleX);
    const angle = angleRad * (180 / Math.PI);
    const x = (combined.translateX + Math.sin(angleRad) * ascent) * scale;
    const y = (combined.translateY - Math.cos(angleRad) * ascent) * scale;
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = c.text;
    span.style.left = px(x);
    span.style.top = px(y);
    span.style.fontSize = px(fontSize * scale);
    span.style.lineHeight = px(height);
    span.style.height = px(height);
    span.style.transformOrigin = "0 0";
    pending.push({ span, targetWidth, angle });
    return span;
  }
  if (c.type === "space" || c.type === "tab") {
    const fontSize = c.fontSize * effectiveScaleY;
    const ascent = c.ascent * effectiveScaleY;
    const width = c.advance * effectiveScaleX * scale;
    const height = (c.ascent + c.descent) * effectiveScaleY * scale;
    const angleRad = Math.atan2(combined.skewY, combined.scaleX);
    const angle = angleRad * (180 / Math.PI);
    const x = (combined.translateX + Math.sin(angleRad) * ascent) * scale;
    const y = (combined.translateY - Math.cos(angleRad) * ascent) * scale;
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = c.type === "tab" ? "	" : " ";
    span.style.left = px(x);
    span.style.top = px(y);
    span.style.fontSize = px(fontSize * scale);
    span.style.lineHeight = px(height);
    span.style.width = px(width);
    span.style.height = px(height);
    if (Math.abs(angle) > 0.1) {
      span.style.transformOrigin = "0 0";
      span.style.transform = `rotate(${angle}deg)`;
    }
    return span;
  }
  if (c.type === "break") {
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = "\n";
    span.style.position = "absolute";
    span.style.width = "0";
    span.style.height = "0";
    span.style.overflow = "hidden";
    return span;
  }
  if (c.type === "paragraphEnd") {
    const x = combined.translateX * scale;
    const y = combined.translateY * scale;
    const width = c.advance * effectiveScaleX * scale;
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = "\n";
    span.style.left = px(x);
    span.style.top = px(y);
    span.style.width = px(width);
    span.style.fontSize = "1px";
    span.style.lineHeight = "1px";
    return span;
  }
  if (c.type === "inlineDrawing") {
    const x = combined.translateX * scale;
    const y = combined.translateY * scale;
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = "\uFFFC";
    span.style.left = px(x);
    span.style.top = px(y);
    span.style.width = px(c.width * effectiveScaleX * scale);
    span.style.height = px(c.height * effectiveScaleY * scale);
    span.style.fontSize = "0";
    return span;
  }
  return null;
}
function flattenTable(parent, base, table, scale, pending) {
  for (const row of table.rows) {
    for (const cell of row.cells) {
      if (cell.parcel) {
        const t = translate2(base, cell.x, cell.y);
        flattenParcel(parent, t, cell.parcel, scale, pending);
      }
    }
  }
}
function renderHierarchical(layer, layout, scale) {
  const pendingSpans = [];
  const fragment = document.createDocumentFragment();
  for (const frame of layout.frames) {
    if (frame.parcel) {
      fragment.appendChild(buildFrame(frame, scale, pendingSpans));
    }
  }
  if (layout.grid) {
    fragment.appendChild(buildGrid(layout.grid, scale, pendingSpans));
  }
  layer.replaceChildren(fragment);
  if (pendingSpans.length > 0) {
    scheduleMeasure(pendingSpans);
  }
}
function buildFrame(frame, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-frame";
  el.style.transform = cssMatrix(frame.transform, scale);
  el.style.transformOrigin = "0 0";
  const p = frame.parcel;
  el.style.width = px((p.x + p.width) * scale);
  el.style.height = px((p.y + p.height) * scale);
  buildParcel(el, p, scale, pending);
  return el;
}
function buildParcel(parent, parcel, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-parcel";
  el.style.left = px(parcel.x * scale);
  el.style.top = px(parcel.y * scale);
  el.style.width = px(parcel.width * scale);
  el.style.height = px(parcel.height * scale);
  for (const line of parcel.lines) {
    el.appendChild(buildLine(line, parcel.width, scale, pending));
  }
  parent.appendChild(el);
}
function buildLine(line, _parcelWidth, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-line";
  el.style.top = px(line.y * scale);
  el.style.width = px(line.width * scale);
  el.style.height = px(line.height * scale);
  const content = line.content;
  if (content.type === "runList") {
    const runs = content.runs;
    const baseline = line.spaceBefore + content.baseline;
    for (let i = 0; i < runs.length; i++) {
      const run = runs[i];
      const nextX = i + 1 < runs.length ? runs[i + 1].x : run.x + run.width;
      const effectiveWidth = nextX - run.x;
      const contentHeight = line.height - line.spaceBefore - line.spaceAfter;
      const runEl = buildRunHierarchical(run, baseline, effectiveWidth, contentHeight, scale, pending);
      if (runEl)
        el.appendChild(runEl);
    }
  } else {
    el.appendChild(buildTable(content, scale, pending));
  }
  return el;
}
function buildRunHierarchical(run, baseline, effectiveWidth, lineHeight, scale, pending) {
  const c = run.content;
  if (c.type === "glyphs") {
    if (!c.text || c.glyphs.length === 0)
      return null;
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = c.text;
    span.style.left = px(run.x * scale);
    span.style.top = px((baseline - c.ascent) * scale);
    span.style.fontSize = px(c.fontSize * scale);
    span.style.lineHeight = px(lineHeight * scale);
    span.style.transformOrigin = "0 0";
    const targetWidth = effectiveWidth * scale;
    pending.push({ span, targetWidth, angle: 0 });
    return span;
  }
  if (c.type === "space" || c.type === "tab") {
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = c.type === "tab" ? "	" : " ";
    span.style.left = px(run.x * scale);
    span.style.top = px((baseline - c.ascent) * scale);
    span.style.fontSize = px(c.fontSize * scale);
    span.style.lineHeight = px(lineHeight * scale);
    span.style.width = px(effectiveWidth * scale);
    return span;
  }
  if (c.type === "break") {
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = "\n";
    span.style.left = px(run.x * scale);
    span.style.width = "0";
    span.style.height = "0";
    span.style.overflow = "hidden";
    return span;
  }
  if (c.type === "paragraphEnd") {
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = "\n";
    span.style.left = px(run.x * scale);
    span.style.width = px(effectiveWidth * scale);
    span.style.fontSize = "1px";
    span.style.lineHeight = px(lineHeight * scale);
    return span;
  }
  if (c.type === "inlineDrawing") {
    const span = document.createElement("span");
    span.className = "udoc-text-run";
    span.textContent = "\uFFFC";
    span.style.left = px(run.x * scale);
    span.style.top = px(baseline * scale);
    span.style.width = px(c.width * scale);
    span.style.height = px(c.height * scale);
    span.style.fontSize = "0";
    return span;
  }
  return null;
}
function buildTable(table, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-table";
  el.style.width = px(table.width * scale);
  el.style.height = px(table.height * scale);
  for (const row of table.rows) {
    el.appendChild(buildTableRow(row, table.width, scale, pending));
  }
  return el;
}
function buildTableRow(row, tableWidth, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-row";
  el.style.top = px(row.y * scale);
  el.style.width = px(tableWidth * scale);
  el.style.height = px(row.height * scale);
  for (const cell of row.cells) {
    el.appendChild(buildTableCell(cell, row.y, scale, pending));
  }
  return el;
}
function buildTableCell(cell, rowY, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-cell";
  el.style.left = px(cell.x * scale);
  el.style.top = px((cell.y - rowY) * scale);
  el.style.width = px(cell.width * scale);
  el.style.height = px(cell.height * scale);
  if (cell.parcel) {
    buildParcel(el, cell.parcel, scale, pending);
  }
  return el;
}
function buildGrid(grid, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-grid";
  el.style.left = px(grid.x * scale);
  el.style.top = px(grid.y * scale);
  el.style.width = px(grid.width * scale);
  el.style.height = px(grid.height * scale);
  if (Math.abs(grid.scale - 1) > 1e-3) {
    el.style.transform = `scale(${grid.scale})`;
    el.style.transformOrigin = "0 0";
  }
  for (const row of grid.rows) {
    el.appendChild(buildGridRow(row, grid.width, scale, pending));
  }
  return el;
}
function buildGridRow(row, gridWidth, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-row";
  el.style.top = px(row.y * scale);
  el.style.width = px(gridWidth * scale);
  el.style.height = px(row.height * scale);
  for (const cell of row.cells) {
    el.appendChild(buildGridCell(cell, row.y, scale, pending));
  }
  return el;
}
function buildGridCell(cell, rowY, scale, pending) {
  const el = document.createElement("div");
  el.className = "udoc-text-cell";
  el.style.left = px(cell.x * scale);
  el.style.top = px((cell.y - rowY) * scale);
  el.style.width = px(cell.width * scale);
  el.style.height = px(cell.height * scale);
  if (cell.parcel) {
    buildParcel(el, cell.parcel, scale, pending);
  }
  return el;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/text/selection.js
function attachSelectionController(layer) {
  let isSelecting = false;
  let lastValidRange = null;
  function handleMouseDown(e) {
    if (e.button !== 0)
      return;
    isSelecting = true;
    lastValidRange = null;
  }
  function handleMouseMove(e) {
    if (!isSelecting || e.buttons !== 1) {
      return;
    }
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0)
      return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const isOverSpan = target?.classList.contains("udoc-text-run");
    if (isOverSpan) {
      try {
        lastValidRange = selection.getRangeAt(0).cloneRange();
      } catch {
      }
    } else if (lastValidRange) {
      try {
        const currentRange = selection.getRangeAt(0);
        if (selection.isCollapsed || currentRange.toString().length < lastValidRange.toString().length * 0.5) {
          selection.removeAllRanges();
          selection.addRange(lastValidRange.cloneRange());
        }
      } catch {
      }
    }
  }
  function handleMouseUp() {
    isSelecting = false;
    lastValidRange = null;
  }
  layer.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  return () => {
    layer.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/Branding.js
var __attachShadow = typeof Element !== "undefined" ? Element.prototype.attachShadow : void 0;
var __getComputedStyle = typeof window !== "undefined" ? window.getComputedStyle.bind(window) : void 0;
var ATTRIBUTION_URL_B64 = "aHR0cHM6Ly9kb2NtZW50aXMuY29t";
var LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.4 11.2 247.3 39.4" width="124" height="20" aria-hidden="true"><path d="M13.92 48.58L13.92 48.58Q10.61 48.58 7.99 46.94Q5.38 45.31 3.89 42.43Q2.40 39.55 2.40 35.95L2.40 35.95Q2.40 32.26 3.91 29.40Q5.42 26.54 8.09 24.89Q10.75 23.23 14.06 23.23L14.06 23.23Q16.66 23.23 18.62 24.19Q20.59 25.15 21.79 26.93L21.79 26.93L21.79 13.44L28.27 13.44L28.27 48L22.51 48L21.79 44.69L21.79 44.69Q21.07 45.70 19.99 46.61Q18.91 47.52 17.42 48.05Q15.94 48.58 13.92 48.58ZM15.46 42.91L15.46 42.91Q17.38 42.91 18.84 42.02Q20.30 41.14 21.12 39.55Q21.94 37.97 21.94 35.90L21.94 35.90Q21.94 33.84 21.12 32.26Q20.30 30.67 18.84 29.78Q17.38 28.90 15.46 28.90L15.46 28.90Q13.63 28.90 12.14 29.78Q10.66 30.67 9.82 32.26Q8.98 33.84 8.98 35.86L8.98 35.86Q8.98 37.97 9.82 39.55Q10.66 41.14 12.12 42.02Q13.58 42.91 15.46 42.91ZM46.03 48.58L46.03 48.58Q42.58 48.58 39.82 46.97Q37.06 45.36 35.45 42.50Q33.84 39.65 33.84 35.95L33.84 35.95Q33.84 32.16 35.45 29.30Q37.06 26.45 39.84 24.84Q42.62 23.23 46.08 23.23L46.08 23.23Q49.58 23.23 52.34 24.84Q55.10 26.45 56.71 29.30Q58.32 32.16 58.32 35.90L58.32 35.90Q58.32 39.65 56.71 42.50Q55.10 45.36 52.32 46.97Q49.54 48.58 46.03 48.58ZM46.03 42.96L46.03 42.96Q47.66 42.96 48.94 42.19Q50.21 41.42 50.95 39.84Q51.70 38.26 51.70 35.90L51.70 35.90Q51.70 33.55 50.95 31.99Q50.21 30.43 48.94 29.64Q47.66 28.85 46.08 28.85L46.08 28.85Q44.54 28.85 43.25 29.64Q41.95 30.43 41.21 31.99Q40.46 33.55 40.46 35.90L40.46 35.90Q40.46 38.26 41.21 39.84Q41.95 41.42 43.22 42.19Q44.50 42.96 46.03 42.96ZM75.60 48.58L75.60 48.58Q71.95 48.58 69.12 46.94Q66.29 45.31 64.70 42.48Q63.12 39.65 63.12 36L63.12 36Q63.12 32.26 64.70 29.40Q66.29 26.54 69.12 24.89Q71.95 23.23 75.60 23.23L75.60 23.23Q80.26 23.23 83.42 25.68Q86.59 28.13 87.46 32.40L87.46 32.40L80.59 32.40Q80.16 30.72 78.79 29.76Q77.42 28.80 75.55 28.80L75.55 28.80Q73.87 28.80 72.55 29.64Q71.23 30.48 70.49 32.09Q69.74 33.70 69.74 35.90L69.74 35.90Q69.74 37.58 70.18 38.90Q70.61 40.22 71.38 41.16Q72.14 42.10 73.22 42.58Q74.30 43.06 75.55 43.06L75.55 43.06Q76.80 43.06 77.83 42.62Q78.86 42.19 79.58 41.40Q80.30 40.61 80.59 39.46L80.59 39.46L87.46 39.46Q86.59 43.63 83.40 46.10Q80.21 48.58 75.60 48.58Z" class="logo-doc"/><path d="M97.25 48L90.77 48L90.77 14.40L98.50 14.40L108.77 35.38L108.77 35.38L118.94 14.40L126.67 14.40L126.67 48L120.19 48L120.19 25.44L120.19 25.44L111.31 43.30L106.18 43.30L97.25 25.44L97.25 25.44L97.25 48ZM144.77 48.58L144.77 48.58Q141.12 48.58 138.31 47.02Q135.50 45.46 133.94 42.65Q132.38 39.84 132.38 36.14L132.38 36.14Q132.38 32.35 133.94 29.45Q135.50 26.54 138.29 24.89Q141.07 23.23 144.77 23.23L144.77 23.23Q148.37 23.23 151.06 24.82Q153.74 26.40 155.23 29.09Q156.72 31.78 156.72 35.18L156.72 35.18Q156.72 35.66 156.72 36.26Q156.72 36.86 156.62 37.49L156.62 37.49L136.99 37.49L136.99 33.55L150.19 33.55Q150.05 31.20 148.54 29.86Q147.02 28.51 144.77 28.51L144.77 28.51Q143.14 28.51 141.74 29.26Q140.35 30 139.56 31.54Q138.77 33.07 138.77 35.42L138.77 35.42L138.77 36.82Q138.77 38.78 139.51 40.25Q140.26 41.71 141.60 42.50Q142.94 43.30 144.72 43.30L144.72 43.30Q146.50 43.30 147.67 42.53Q148.85 41.76 149.42 40.56L149.42 40.56L156.05 40.56Q155.38 42.82 153.79 44.64Q152.21 46.46 149.90 47.52Q147.60 48.58 144.77 48.58ZM168.53 48L162.05 48L162.05 23.81L167.76 23.81L168.24 27.74L168.24 27.74Q169.34 25.73 171.38 24.48Q173.42 23.23 176.26 23.23L176.26 23.23Q179.28 23.23 181.34 24.48Q183.41 25.73 184.49 28.13Q185.57 30.53 185.57 34.03L185.57 34.03L185.57 48L179.14 48L179.14 34.66Q179.14 31.78 177.91 30.24Q176.69 28.70 174.14 28.70L174.14 28.70Q172.51 28.70 171.24 29.47Q169.97 30.24 169.25 31.66Q168.53 33.07 168.53 35.09L168.53 35.09L168.53 48ZM206.93 48L202.56 48Q200.02 48 198.12 47.21Q196.22 46.42 195.17 44.57Q194.11 42.72 194.11 39.50L194.11 39.50L194.11 29.23L189.98 29.23L189.98 23.81L194.11 23.81L194.83 17.23L200.59 17.23L200.59 23.81L206.98 23.81L206.98 29.23L200.59 29.23L200.59 39.60Q200.59 41.23 201.31 41.86Q202.03 42.48 203.76 42.48L203.76 42.48L206.93 42.48L206.93 48ZM219.07 48L212.59 48L212.59 23.81L219.07 23.81L219.07 48ZM215.86 20.50L215.86 20.50Q214.13 20.50 213.00 19.46Q211.87 18.43 211.87 16.85L211.87 16.85Q211.87 15.26 213.00 14.23Q214.13 13.20 215.86 13.20L215.86 13.20Q217.63 13.20 218.76 14.23Q219.89 15.26 219.89 16.85L219.89 16.85Q219.89 18.43 218.76 19.46Q217.63 20.50 215.86 20.50ZM235.49 48.58L235.49 48.58Q232.18 48.58 229.73 47.52Q227.28 46.46 225.89 44.59Q224.50 42.72 224.30 40.37L224.30 40.37L230.74 40.37Q230.98 41.28 231.55 42.02Q232.13 42.77 233.09 43.20Q234.05 43.63 235.39 43.63L235.39 43.63Q236.69 43.63 237.50 43.27Q238.32 42.91 238.73 42.29Q239.14 41.66 239.14 40.99L239.14 40.99Q239.14 39.98 238.56 39.43Q237.98 38.88 236.88 38.54Q235.78 38.21 234.19 37.87L234.19 37.87Q232.46 37.54 230.81 37.03Q229.15 36.53 227.86 35.76Q226.56 34.99 225.79 33.79Q225.02 32.59 225.02 30.82L225.02 30.82Q225.02 28.66 226.18 26.95Q227.33 25.25 229.54 24.24Q231.74 23.23 234.86 23.23L234.86 23.23Q239.23 23.23 241.78 25.20Q244.32 27.17 244.80 30.62L244.80 30.62L238.70 30.62Q238.42 29.52 237.43 28.87Q236.45 28.22 234.82 28.22L234.82 28.22Q233.09 28.22 232.18 28.85Q231.26 29.47 231.26 30.48L231.26 30.48Q231.26 31.15 231.86 31.68Q232.46 32.21 233.57 32.57Q234.67 32.93 236.26 33.26L236.26 33.26Q239.04 33.84 241.15 34.58Q243.26 35.33 244.46 36.70Q245.66 38.06 245.66 40.66L245.66 40.66Q245.66 42.96 244.42 44.76Q243.17 46.56 240.89 47.57Q238.61 48.58 235.49 48.58Z" class="logo-mentis"/></svg>`;
var LIGHT_DOC_FILL = "#0f172a";
var LIGHT_MENTIS_FILL = "#4f46e5";
var DARK_DOC_FILL = "#e2e8f0";
var DARK_MENTIS_FILL = "#818cf8";
var SUPPRESSED_EVENT = "udoc:branding-suppressed";
var TRIPWIRE_INTERVAL_MS = 2e3;
var MIN_VISIBLE_OPACITY = 0.05;
var MIN_VISIBLE_WIDTH_PX = 24;
var MIN_VISIBLE_HEIGHT_PX = 8;
function createBranding(opts) {
  const hostClass = "_b" + Math.random().toString(36).slice(2, 11);
  const host = document.createElement("div");
  host.className = hostClass;
  const shadow = __attachShadow.call(host, { mode: "closed" });
  const style = document.createElement("style");
  style.textContent = buildShadowCss(opts.variant);
  shadow.appendChild(style);
  const link = document.createElement("button");
  link.type = "button";
  link.className = "link";
  link.setAttribute("role", "link");
  link.setAttribute("aria-label", "Powered by docMentis");
  link.setAttribute("part", "link");
  link.dataset.h = ATTRIBUTION_URL_B64;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = atob(link.dataset.h ?? "");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
    }
  });
  if (opts.variant === "viewport-corner") {
    link.innerHTML = `Powered by <span class="logo-doc">doc</span><span class="logo-mentis">Mentis</span>`;
    shadow.appendChild(link);
  } else if (opts.variant === "loading-block") {
    link.innerHTML = LOGO_SVG;
    shadow.appendChild(link);
  } else {
    link.innerHTML = LOGO_SVG;
    link.setAttribute("tabindex", "-1");
    shadow.appendChild(link);
  }
  function applyHostInlineStyles() {
    const decls = [
      "visibility: visible !important",
      "opacity: 1 !important",
      "clip: auto !important",
      "clip-path: none !important",
      "filter: none !important",
      "pointer-events: auto !important"
      // Variant-specific layout. Crucially these include !important `display`
      // so that an external `display: none !important` cannot collapse us.
    ];
    if (opts.variant === "viewport-corner") {
      decls.push("display: inline-flex !important", "position: absolute !important", "right: 18px !important", "bottom: 4px !important", "z-index: 10 !important");
    } else if (opts.variant === "loading-block") {
      decls.push("display: inline-flex !important", "margin-top: 12px !important");
    } else {
      decls.push("display: inline-flex !important");
    }
    host.style.cssText = decls.join(";");
  }
  applyHostInlineStyles();
  let themeObserver = null;
  function setupThemeSync() {
    const root = host.closest(".udoc-viewer-root");
    if (!root)
      return;
    const apply = () => {
      if (root.classList.contains("udoc-viewer-dark")) {
        host.setAttribute("data-dark", "");
      } else {
        host.removeAttribute("data-dark");
      }
    };
    apply();
    themeObserver = new MutationObserver(apply);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
  }
  let parentRef = null;
  let parentObserver = null;
  function setupTamperProtection() {
    parentRef = host.parentNode;
    if (!parentRef)
      return;
    parentObserver = new MutationObserver(() => {
      if (parentRef && !parentRef.contains(host)) {
        parentRef.appendChild(host);
        applyHostInlineStyles();
      }
    });
    parentObserver.observe(parentRef, { childList: true });
  }
  let tripwireInterval = null;
  let intersectionObserver = null;
  let suppressed = false;
  function trigger(reason) {
    if (suppressed)
      return;
    suppressed = true;
    try {
      host.dispatchEvent(new CustomEvent(SUPPRESSED_EVENT, {
        bubbles: true,
        composed: true,
        detail: { reason, variant: opts.variant }
      }));
    } catch {
    }
    try {
      opts.onSuppressed?.({ reason });
    } catch {
    }
  }
  function checkVisibility() {
    if (suppressed)
      return;
    if (!host.isConnected) {
      trigger("host-disconnected");
      return;
    }
    if (host.className !== hostClass)
      host.className = hostClass;
    applyHostInlineStyles();
    const cs = __getComputedStyle(host);
    const rect = host.getBoundingClientRect();
    if (cs.display === "none")
      return trigger("display:none");
    if (cs.visibility === "hidden" || cs.visibility === "collapse")
      return trigger(`visibility:${cs.visibility}`);
    if (parseFloat(cs.opacity) < MIN_VISIBLE_OPACITY)
      return trigger(`opacity:${cs.opacity}`);
    if (cs.clip !== "auto" && cs.clip !== "")
      return trigger(`clip:${cs.clip}`);
    if (cs.clipPath && cs.clipPath !== "none")
      return trigger(`clip-path:${cs.clipPath}`);
    if (rect.width < MIN_VISIBLE_WIDTH_PX)
      return trigger(`width:${rect.width}`);
    if (rect.height < MIN_VISIBLE_HEIGHT_PX)
      return trigger(`height:${rect.height}`);
    if (opts.variant === "viewport-corner" && parseFloat(cs.fontSize) < 6)
      return trigger(`font-size:${cs.fontSize}`);
    if (cs.transform && cs.transform !== "none") {
      const m = cs.transform.match(/matrix\(([-0-9.,\s]+)\)/);
      if (m) {
        const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
        const a = parts[0];
        const d = parts[3];
        if (Math.abs(a) < 0.05 || Math.abs(d) < 0.05)
          return trigger(`transform:${cs.transform}`);
      }
    }
  }
  function setupTripwire() {
    if (opts.variant !== "viewport-corner")
      return;
    requestAnimationFrame(checkVisibility);
    tripwireInterval = setInterval(checkVisibility, TRIPWIRE_INTERVAL_MS);
    try {
      intersectionObserver = new IntersectionObserver(() => checkVisibility(), {
        threshold: [0, 0.01, 0.5, 1]
      });
      intersectionObserver.observe(host);
    } catch {
    }
  }
  function start() {
    setupThemeSync();
    setupTamperProtection();
    setupTripwire();
  }
  function destroy() {
    themeObserver?.disconnect();
    parentObserver?.disconnect();
    intersectionObserver?.disconnect();
    if (tripwireInterval !== null)
      clearInterval(tripwireInterval);
    host.remove();
  }
  return { el: host, start, destroy };
}
function buildShadowCss(variant) {
  const common = `
        :host, :host * {
            box-sizing: border-box;
        }
        .link {
            all: unset;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            color: ${LIGHT_DOC_FILL};
            text-decoration: none;
        }
        :host([data-dark]) .link {
            color: ${DARK_DOC_FILL};
        }
        .logo-doc { fill: ${LIGHT_DOC_FILL}; }
        .logo-mentis { fill: ${LIGHT_MENTIS_FILL}; font-weight: 700; }
        :host([data-dark]) .logo-doc { fill: ${DARK_DOC_FILL}; }
        :host([data-dark]) .logo-mentis { fill: ${DARK_MENTIS_FILL}; }
    `;
  if (variant === "viewport-corner") {
    return `${common}
            .link {
                display: inline-block;
                padding: 2px 6px;
                opacity: 0.5;
                text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
                white-space: nowrap;
                transition: opacity 0.15s ease;
            }
            .link:hover, .link:focus-visible { opacity: 1.0; }
            :host([data-dark]) .link { text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); }
            .logo-doc, .logo-mentis { font-weight: 700; }
            .logo-doc { color: ${LIGHT_DOC_FILL}; fill: ${LIGHT_DOC_FILL}; }
            .logo-mentis { color: ${LIGHT_MENTIS_FILL}; fill: ${LIGHT_MENTIS_FILL}; }
            :host([data-dark]) .logo-doc { color: ${DARK_DOC_FILL}; fill: ${DARK_DOC_FILL}; }
            :host([data-dark]) .logo-mentis { color: ${DARK_MENTIS_FILL}; fill: ${DARK_MENTIS_FILL}; }
        `;
  }
  if (variant === "loading-block") {
    return `${common}
            .link {
                display: inline-block;
                margin: 0;
                padding: 0;
            }
            svg {
                display: block;
                width: 124px;
                height: 20px;
            }
        `;
  }
  return `${common}
        .link {
            display: inline-block;
            cursor: default;
            pointer-events: none;
            padding: 0;
            margin: 0;
        }
        svg {
            display: block;
            width: 124px;
            height: 20px;
        }
    `;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/Spread.js
function normalizeRotation2(rotation) {
  switch (rotation) {
    case 90:
    case 180:
    case 270:
      return rotation;
    default:
      return 0;
  }
}
function rotateSize(size, rotation) {
  const normalized = normalizeRotation2(rotation);
  if (normalized === 90 || normalized === 270) {
    return { width: size.height, height: size.width };
  }
  return size;
}
function combineRotation2(documentRotation, userRotation) {
  const combined = (documentRotation + userRotation) % 360;
  return normalizeRotation2(combined);
}
function formatCssSize(value) {
  return `${value.toFixed(3)}px`;
}
function createSpread(data, showAttribution = true, i18n, customPageOverlay) {
  const el = document.createElement("div");
  el.className = "udoc-spread";
  el.dataset.spreadIndex = String(data.index);
  const wrapper = document.createElement("div");
  wrapper.className = "udoc-spread__wrapper";
  el.appendChild(wrapper);
  const slotElements = [];
  let mounted = false;
  for (const slot of data.slots) {
    const slotEl = createSlotElement(slot);
    slotElements.push(slotEl);
    wrapper.appendChild(slotEl.container);
  }
  function createSlotElement(pageNumber) {
    const container = document.createElement("div");
    container.className = "udoc-spread__slot";
    container.style.position = "relative";
    container.style.overflow = "hidden";
    if (pageNumber !== null) {
      container.dataset.page = String(pageNumber);
      container.setAttribute("role", "group");
      container.setAttribute("aria-label", i18n ? i18n.t("spread.pageLabel", { page: pageNumber }) : `Page ${pageNumber}`);
      const loadingTimer = setTimeout(() => {
        container.classList.add("udoc-spread__slot--loading");
      }, 200);
      const previewCanvas = document.createElement("canvas");
      previewCanvas.className = "udoc-spread__preview-canvas";
      previewCanvas.style.position = "absolute";
      previewCanvas.style.transformOrigin = "center";
      previewCanvas.style.display = "none";
      previewCanvas.setAttribute("aria-hidden", "true");
      container.appendChild(previewCanvas);
      const canvas = document.createElement("canvas");
      canvas.className = "udoc-spread__canvas";
      canvas.style.position = "absolute";
      canvas.style.transformOrigin = "center";
      canvas.setAttribute("aria-label", i18n ? i18n.t("spread.pageContent", { page: pageNumber }) : `Page ${pageNumber} content`);
      canvas.textContent = i18n ? i18n.t("spread.pageLabel", { page: pageNumber }) : `Page ${pageNumber}`;
      container.appendChild(canvas);
      const textLayer = document.createElement("div");
      textLayer.className = "udoc-spread__text-layer";
      textLayer.style.position = "absolute";
      textLayer.style.transformOrigin = "center";
      container.appendChild(textLayer);
      const cleanupSelectionController = attachSelectionController(textLayer);
      const annotationLayer = document.createElement("div");
      annotationLayer.className = "udoc-spread__annotation-layer";
      annotationLayer.style.position = "absolute";
      annotationLayer.style.transformOrigin = "center";
      annotationLayer.style.pointerEvents = "none";
      container.appendChild(annotationLayer);
      const searchHighlightLayer = document.createElement("div");
      searchHighlightLayer.className = "udoc-spread__search-highlight-layer";
      searchHighlightLayer.style.position = "absolute";
      searchHighlightLayer.style.transformOrigin = "center";
      searchHighlightLayer.style.pointerEvents = "none";
      container.appendChild(searchHighlightLayer);
      const customPageOverlayLayer = document.createElement("div");
      customPageOverlayLayer.className = "udoc-spread__custom-page-overlay-layer";
      customPageOverlayLayer.style.position = "absolute";
      customPageOverlayLayer.style.transformOrigin = "center";
      customPageOverlayLayer.style.pointerEvents = "none";
      container.appendChild(customPageOverlayLayer);
      let brandingHandle = null;
      {
        const indicatorClass = "_" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
        const textClass = "_" + Math.random().toString(36).slice(2, 10);
        const indicatorStyle = document.createElement("style");
        indicatorStyle.textContent = `
                    .${indicatorClass} {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        pointer-events: none;
                        z-index: 1;
                        user-select: none;
                        opacity: 0.5;
                    }
                    .${textClass} {
                        font-size: 11px;
                        font-weight: 500;
                        color: #0f172a;
                    }
                    .udoc-viewer-dark .${textClass} {
                        color: #e2e8f0;
                    }
                    .udoc-spread__slot:not(.udoc-spread__slot--loading) .${indicatorClass} {
                        display: none;
                    }
                `;
        container.appendChild(indicatorStyle);
        const renderingLabel = i18n ? i18n.t("spread.rendering") : "Rendering...";
        const indicator = document.createElement("div");
        indicator.className = indicatorClass;
        if (showAttribution) {
          brandingHandle = createBranding({ variant: "spread-indicator" });
          indicator.appendChild(brandingHandle.el);
        }
        const span = document.createElement("span");
        span.className = textClass;
        span.textContent = renderingLabel;
        indicator.appendChild(span);
        container.appendChild(indicator);
        brandingHandle?.start();
      }
      const cleanupAttrObserver = brandingHandle ? () => brandingHandle.destroy() : null;
      return {
        container,
        canvas,
        previewCanvas,
        textLayer,
        annotationLayer,
        searchHighlightLayer,
        customPageOverlayLayer,
        pageNumber,
        renderKey: "",
        pendingKey: null,
        previewRenderKey: "",
        renderToken: 0,
        loadingTimer,
        cssWidth: 0,
        cssHeight: 0,
        lastAnnotations: null,
        lastAnnotationScale: 0,
        lastHighlightedBounds: null,
        lastTextLayout: null,
        lastTextScale: 0,
        cleanupSelectionController,
        cleanupAttrObserver,
        lastSearchMatches: null,
        lastSearchActiveIndex: -1,
        lastSearchScale: 0,
        customPageOverlayInvoked: false,
        cleanupCustomPageOverlay: null
      };
    }
    container.classList.add("udoc-spread__slot--empty");
    return {
      container,
      canvas: null,
      previewCanvas: null,
      textLayer: null,
      annotationLayer: null,
      searchHighlightLayer: null,
      customPageOverlayLayer: null,
      pageNumber: null,
      renderKey: "",
      pendingKey: null,
      previewRenderKey: "",
      renderToken: 0,
      loadingTimer: null,
      cssWidth: 0,
      cssHeight: 0,
      lastAnnotations: null,
      lastAnnotationScale: 0,
      lastHighlightedBounds: null,
      lastTextLayout: null,
      lastTextScale: 0,
      cleanupSelectionController: null,
      cleanupAttrObserver: null,
      lastSearchMatches: null,
      lastSearchActiveIndex: -1,
      lastSearchScale: 0,
      customPageOverlayInvoked: false,
      cleanupCustomPageOverlay: null
    };
  }
  function updateLayout(options) {
    const dpr = getDevicePixelRatio();
    const pointsToPixels = getPointsToPixels(options.dpi);
    const userRotation = normalizeRotation2(options.rotation);
    const cropMode = options.cropMode ?? "none";
    const gapCss = toCssPixels(toDevicePixels(options.pageSpacing, dpr), dpr);
    wrapper.style.gap = `${gapCss}px`;
    let referenceSize = null;
    for (const slotEl of slotElements) {
      if (slotEl.pageNumber === null)
        continue;
      const pageInfo = options.pageInfos[slotEl.pageNumber - 1];
      if (pageInfo) {
        referenceSize = {
          width: pageInfo.width * pointsToPixels * options.scale,
          height: pageInfo.height * pointsToPixels * options.scale
        };
        break;
      }
    }
    for (const slotEl of slotElements) {
      const pageInfo = slotEl.pageNumber === null ? null : options.pageInfos[slotEl.pageNumber - 1];
      const baseSize = pageInfo ? {
        width: pageInfo.width * pointsToPixels * options.scale,
        height: pageInfo.height * pointsToPixels * options.scale
      } : referenceSize;
      if (!baseSize) {
        slotEl.container.style.width = "0px";
        slotEl.container.style.height = "0px";
        continue;
      }
      const documentRotation = normalizeRotation2(pageInfo?.rotation ?? 0);
      const effectiveRotation = combineRotation2(documentRotation, userRotation);
      const baseWidthDevice = toDevicePixels(baseSize.width, dpr);
      const baseHeightDevice = toDevicePixels(baseSize.height, dpr);
      const rotatedSize = rotateSize({ width: baseWidthDevice, height: baseHeightDevice }, effectiveRotation);
      slotEl.cssWidth = toCssPixels(baseWidthDevice, dpr);
      slotEl.cssHeight = toCssPixels(baseHeightDevice, dpr);
      const cr = cropMode !== "none" && pageInfo?.contentRect ? pageInfo.contentRect : null;
      let containerWidth;
      let containerHeight;
      let cropOffsetLeft = 0;
      let cropOffsetTop = 0;
      if (cr) {
        const crLeft = cr.x * pointsToPixels * options.scale;
        const crTop = cr.y * pointsToPixels * options.scale;
        const crWidth = cr.width * pointsToPixels * options.scale;
        const crHeight = cr.height * pointsToPixels * options.scale;
        const crWidthDevice = toDevicePixels(crWidth, dpr);
        const crHeightDevice = toDevicePixels(crHeight, dpr);
        if (cropMode === "vertical") {
          const crRotatedHeight = rotateSize({ width: crWidthDevice, height: crHeightDevice }, effectiveRotation);
          containerWidth = toCssPixels(rotatedSize.width, dpr);
          containerHeight = toCssPixels(crRotatedHeight.height, dpr);
          const crTopDevice = toDevicePixels(crTop, dpr);
          switch (effectiveRotation) {
            case 0:
              cropOffsetTop = -toCssPixels(crTopDevice, dpr);
              break;
            case 90:
              cropOffsetTop = -(slotEl.cssWidth - toCssPixels(toDevicePixels(crLeft, dpr), dpr) - toCssPixels(crWidthDevice, dpr));
              break;
            case 180:
              cropOffsetTop = -(slotEl.cssHeight - toCssPixels(crTopDevice, dpr) - toCssPixels(crHeightDevice, dpr));
              break;
            case 270:
              cropOffsetTop = -toCssPixels(toDevicePixels(crLeft, dpr), dpr);
              break;
          }
        } else {
          const crRotated = rotateSize({ width: crWidthDevice, height: crHeightDevice }, effectiveRotation);
          containerWidth = toCssPixels(crRotated.width, dpr);
          containerHeight = toCssPixels(crRotated.height, dpr);
          const crLeftDevice = toDevicePixels(crLeft, dpr);
          const crTopDevice = toDevicePixels(crTop, dpr);
          switch (effectiveRotation) {
            case 0:
              cropOffsetLeft = -toCssPixels(crLeftDevice, dpr);
              cropOffsetTop = -toCssPixels(crTopDevice, dpr);
              break;
            case 90:
              cropOffsetLeft = -toCssPixels(crTopDevice, dpr);
              cropOffsetTop = -(slotEl.cssWidth - toCssPixels(crLeftDevice, dpr) - toCssPixels(crWidthDevice, dpr));
              break;
            case 180:
              cropOffsetLeft = -(slotEl.cssWidth - toCssPixels(crLeftDevice, dpr) - toCssPixels(crWidthDevice, dpr));
              cropOffsetTop = -(slotEl.cssHeight - toCssPixels(crTopDevice, dpr) - toCssPixels(crHeightDevice, dpr));
              break;
            case 270:
              cropOffsetLeft = -(slotEl.cssHeight - toCssPixels(crTopDevice, dpr) - toCssPixels(crHeightDevice, dpr));
              cropOffsetTop = -toCssPixels(crLeftDevice, dpr);
              break;
          }
        }
      } else {
        containerWidth = toCssPixels(rotatedSize.width, dpr);
        containerHeight = toCssPixels(rotatedSize.height, dpr);
      }
      slotEl.container.style.width = formatCssSize(containerWidth);
      slotEl.container.style.height = formatCssSize(containerHeight);
      let centerLeft;
      let centerTop;
      if (cr) {
        centerLeft = cropOffsetLeft;
        centerTop = cropOffsetTop;
      } else {
        centerLeft = snapToDevice((containerWidth - slotEl.cssWidth) / 2, dpr);
        centerTop = snapToDevice((containerHeight - slotEl.cssHeight) / 2, dpr);
      }
      if (slotEl.previewCanvas) {
        slotEl.previewCanvas.style.width = formatCssSize(slotEl.cssWidth);
        slotEl.previewCanvas.style.height = formatCssSize(slotEl.cssHeight);
        slotEl.previewCanvas.style.left = formatCssSize(centerLeft);
        slotEl.previewCanvas.style.top = formatCssSize(centerTop);
        slotEl.previewCanvas.style.transform = effectiveRotation === 0 ? "none" : `rotate(${effectiveRotation}deg)`;
      }
      if (slotEl.canvas) {
        slotEl.canvas.style.width = formatCssSize(slotEl.cssWidth);
        slotEl.canvas.style.height = formatCssSize(slotEl.cssHeight);
        slotEl.canvas.style.left = formatCssSize(centerLeft);
        slotEl.canvas.style.top = formatCssSize(centerTop);
        slotEl.canvas.style.transform = effectiveRotation === 0 ? "none" : `rotate(${effectiveRotation}deg)`;
      }
      if (slotEl.textLayer) {
        slotEl.textLayer.style.width = formatCssSize(slotEl.cssWidth);
        slotEl.textLayer.style.height = formatCssSize(slotEl.cssHeight);
        slotEl.textLayer.style.left = formatCssSize(centerLeft);
        slotEl.textLayer.style.top = formatCssSize(centerTop);
        slotEl.textLayer.style.transform = effectiveRotation === 0 ? "none" : `rotate(${effectiveRotation}deg)`;
      }
      if (slotEl.annotationLayer) {
        slotEl.annotationLayer.style.width = formatCssSize(slotEl.cssWidth);
        slotEl.annotationLayer.style.height = formatCssSize(slotEl.cssHeight);
        slotEl.annotationLayer.style.left = formatCssSize(centerLeft);
        slotEl.annotationLayer.style.top = formatCssSize(centerTop);
        slotEl.annotationLayer.style.transform = effectiveRotation === 0 ? "none" : `rotate(${effectiveRotation}deg)`;
      }
      if (slotEl.searchHighlightLayer) {
        slotEl.searchHighlightLayer.style.width = formatCssSize(slotEl.cssWidth);
        slotEl.searchHighlightLayer.style.height = formatCssSize(slotEl.cssHeight);
        slotEl.searchHighlightLayer.style.left = formatCssSize(centerLeft);
        slotEl.searchHighlightLayer.style.top = formatCssSize(centerTop);
        slotEl.searchHighlightLayer.style.transform = effectiveRotation === 0 ? "none" : `rotate(${effectiveRotation}deg)`;
      }
      if (slotEl.customPageOverlayLayer) {
        slotEl.customPageOverlayLayer.style.width = formatCssSize(slotEl.cssWidth);
        slotEl.customPageOverlayLayer.style.height = formatCssSize(slotEl.cssHeight);
        slotEl.customPageOverlayLayer.style.left = formatCssSize(centerLeft);
        slotEl.customPageOverlayLayer.style.top = formatCssSize(centerTop);
        slotEl.customPageOverlayLayer.style.transform = effectiveRotation === 0 ? "none" : `rotate(${effectiveRotation}deg)`;
      }
    }
  }
  function drawToCanvas(canvas, result, slotEl, dpr) {
    let targetWidth;
    let targetHeight;
    if (slotEl.cssWidth > 0 && slotEl.cssHeight > 0) {
      targetWidth = Math.max(1, Math.round(slotEl.cssWidth * dpr));
      targetHeight = Math.max(1, Math.round(slotEl.cssHeight * dpr));
      canvas.style.width = formatCssSize(slotEl.cssWidth);
      canvas.style.height = formatCssSize(slotEl.cssHeight);
    } else {
      targetWidth = result.width;
      targetHeight = result.height;
    }
    if (canvas.width !== targetWidth)
      canvas.width = targetWidth;
    if (canvas.height !== targetHeight)
      canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas.width === result.width && canvas.height === result.height) {
        ctx.drawImage(result.bitmap, 0, 0);
      } else {
        ctx.drawImage(result.bitmap, 0, 0, canvas.width, canvas.height);
      }
    }
  }
  const PREVIEW_SCALE = 0.15;
  const PREVIEW_ENABLED = false;
  async function render(workerClient, options) {
    const dpr = getDevicePixelRatio();
    const pointsToPixels = getPointsToPixels(options.dpi);
    for (const slotEl of slotElements) {
      if (slotEl.pageNumber === null || slotEl.canvas === null) {
        slotEl.renderKey = "";
        slotEl.pendingKey = null;
        continue;
      }
      const effDpr = getEffectiveDpr(slotEl.cssWidth, slotEl.cssHeight, dpr);
      const renderScale = pointsToPixels * options.scale * effDpr;
      const key = makeRenderKey(options.docId, slotEl.pageNumber, "page", renderScale);
      if (slotEl.renderKey === key || slotEl.pendingKey === key)
        continue;
      const token = ++slotEl.renderToken;
      slotEl.pendingKey = key;
      if (PREVIEW_ENABLED && slotEl.previewCanvas && slotEl.renderKey === "") {
        const previewRenderScale = renderScale * PREVIEW_SCALE;
        const previewKey = makeRenderKey(options.docId, slotEl.pageNumber, "preview", previewRenderScale);
        if (slotEl.previewRenderKey !== previewKey) {
          workerClient.requestRender({
            docId: options.docId,
            page: slotEl.pageNumber,
            type: "preview",
            scale: previewRenderScale
          }).then((result) => {
            if (!mounted || slotEl.renderToken !== token)
              return;
            if (slotEl.renderKey === key)
              return;
            drawToCanvas(slotEl.previewCanvas, result, slotEl, effDpr);
            slotEl.previewCanvas.style.display = "block";
            slotEl.previewRenderKey = previewKey;
            if (slotEl.loadingTimer) {
              clearTimeout(slotEl.loadingTimer);
              slotEl.loadingTimer = null;
            }
            slotEl.container.classList.remove("udoc-spread__slot--loading");
          }).catch(() => {
          });
        }
      }
      try {
        const result = await workerClient.requestRender({
          docId: options.docId,
          page: slotEl.pageNumber,
          type: "page",
          scale: renderScale
        });
        if (!mounted || slotEl.renderToken !== token) {
          if (slotEl.pendingKey === key)
            slotEl.pendingKey = null;
          continue;
        }
        drawToCanvas(slotEl.canvas, result, slotEl, effDpr);
        if (slotEl.loadingTimer) {
          clearTimeout(slotEl.loadingTimer);
          slotEl.loadingTimer = null;
        }
        slotEl.container.classList.remove("udoc-spread__slot--loading");
        if (slotEl.previewCanvas) {
          slotEl.previewCanvas.style.display = "none";
        }
        slotEl.previewRenderKey = "";
        slotEl.renderKey = key;
      } catch (error) {
        if (mounted && !(error instanceof Error && error.message === "Request cancelled")) {
          console.error(`Spread render failed for page ${slotEl.pageNumber}:`, error);
        }
      } finally {
        if (slotEl.pendingKey === key)
          slotEl.pendingKey = null;
      }
    }
  }
  function mount(container) {
    container.appendChild(el);
    mounted = true;
  }
  function destroy() {
    mounted = false;
    for (const slotEl of slotElements) {
      slotEl.renderKey = "";
      slotEl.pendingKey = null;
      slotEl.renderToken = 0;
      if (slotEl.cleanupSelectionController) {
        slotEl.cleanupSelectionController();
        slotEl.cleanupSelectionController = null;
      }
      if (slotEl.cleanupAttrObserver) {
        slotEl.cleanupAttrObserver();
        slotEl.cleanupAttrObserver = null;
      }
      if (slotEl.cleanupCustomPageOverlay) {
        try {
          slotEl.cleanupCustomPageOverlay();
        } catch (e) {
          console.error("Custom page overlay cleanup threw:", e);
        }
        slotEl.cleanupCustomPageOverlay = null;
      }
      slotEl.customPageOverlayInvoked = false;
    }
    el.remove();
  }
  function getElement() {
    return el;
  }
  function getData() {
    return data;
  }
  function updateAnnotations(annotations, options, highlightedAnnotation) {
    const pointsToPixels = getPointsToPixels(options.dpi);
    const scale = pointsToPixels * options.scale;
    for (const slotEl of slotElements) {
      if (!slotEl.annotationLayer || slotEl.pageNumber === null)
        continue;
      const pageIndex = slotEl.pageNumber - 1;
      const pageAnnotations = annotations.get(pageIndex);
      const highlightBounds = highlightedAnnotation?.pageIndex === pageIndex ? highlightedAnnotation.bounds : null;
      const scaleUnchanged = Math.abs(scale - slotEl.lastAnnotationScale) < 1e-4;
      if (pageAnnotations === slotEl.lastAnnotations && scaleUnchanged && highlightBounds === slotEl.lastHighlightedBounds) {
        continue;
      }
      renderAnnotationsToLayer(slotEl.annotationLayer, pageAnnotations || [], scale, highlightBounds);
      slotEl.lastAnnotations = pageAnnotations ?? null;
      slotEl.lastAnnotationScale = scale;
      slotEl.lastHighlightedBounds = highlightBounds;
    }
  }
  function updateTextLayer(textContent, options) {
    const pointsToPixels = getPointsToPixels(options.dpi);
    const scale = pointsToPixels * options.scale;
    for (const slotEl of slotElements) {
      if (!slotEl.textLayer || slotEl.pageNumber === null)
        continue;
      const pageIndex = slotEl.pageNumber - 1;
      const layout = textContent.get(pageIndex) ?? null;
      const pageInfo = options.pageInfos[pageIndex];
      const scaleUnchanged = Math.abs(scale - slotEl.lastTextScale) < 1e-4;
      if (layout === slotEl.lastTextLayout && scaleUnchanged) {
        continue;
      }
      const pageHeight = pageInfo?.height ?? 0;
      renderTextToLayer(slotEl.textLayer, layout, scale, pageHeight);
      slotEl.lastTextLayout = layout;
      slotEl.lastTextScale = scale;
    }
  }
  function updateSearchHighlights(matches, activeIndex, options) {
    const pointsToPixels = getPointsToPixels(options.dpi);
    const scale = pointsToPixels * options.scale;
    for (const slotEl of slotElements) {
      if (!slotEl.searchHighlightLayer || slotEl.pageNumber === null)
        continue;
      const pageIndex = slotEl.pageNumber - 1;
      const scaleUnchanged = Math.abs(scale - slotEl.lastSearchScale) < 1e-4;
      if (matches === slotEl.lastSearchMatches && activeIndex === slotEl.lastSearchActiveIndex && scaleUnchanged) {
        continue;
      }
      slotEl.searchHighlightLayer.innerHTML = "";
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        if (match.pageIndex !== pageIndex)
          continue;
        const isActive = i === activeIndex;
        for (const rect of match.rects) {
          const highlightEl = document.createElement("div");
          highlightEl.className = isActive ? "udoc-search-highlight udoc-search-highlight--active" : "udoc-search-highlight";
          highlightEl.style.position = "absolute";
          highlightEl.style.left = `${rect.x * scale}px`;
          highlightEl.style.top = `${rect.y * scale}px`;
          highlightEl.style.width = `${rect.width * scale}px`;
          highlightEl.style.height = `${rect.height * scale}px`;
          if (Math.abs(rect.angle) > 0.1) {
            highlightEl.style.transformOrigin = "0 0";
            highlightEl.style.transform = `rotate(${rect.angle}deg)`;
          }
          slotEl.searchHighlightLayer.appendChild(highlightEl);
        }
      }
      slotEl.lastSearchMatches = matches;
      slotEl.lastSearchActiveIndex = activeIndex;
      slotEl.lastSearchScale = scale;
    }
  }
  function updateCustomPageOverlay(options) {
    if (!customPageOverlay)
      return;
    const pointsToPixels = getPointsToPixels(options.dpi);
    const scale = pointsToPixels * options.scale;
    for (const slotEl of slotElements) {
      if (!slotEl.customPageOverlayLayer || slotEl.pageNumber === null)
        continue;
      if (slotEl.customPageOverlayInvoked)
        continue;
      const pageIndex = slotEl.pageNumber - 1;
      try {
        const cleanup = customPageOverlay(pageIndex, slotEl.customPageOverlayLayer, scale);
        slotEl.cleanupCustomPageOverlay = typeof cleanup === "function" ? cleanup : null;
      } catch (e) {
        console.error(`Custom page overlay renderer threw for page ${pageIndex}:`, e);
      }
      slotEl.customPageOverlayInvoked = true;
    }
  }
  function resetRenderKeys() {
    for (const slotEl of slotElements) {
      slotEl.renderKey = "";
      slotEl.pendingKey = null;
      slotEl.previewRenderKey = "";
      if (slotEl.previewCanvas) {
        slotEl.previewCanvas.style.display = "none";
      }
    }
  }
  return {
    el,
    mount,
    destroy,
    render,
    updateLayout,
    updateAnnotations,
    updateTextLayer,
    updateSearchHighlights,
    updateCustomPageOverlay,
    resetRenderKeys,
    getElement,
    getData
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/FloatingToolbar.js
function sliceEqual4(a, b) {
  return a.floatingToolbarVisible === b.floatingToolbarVisible && a.page === b.page && a.pageCount === b.pageCount && a.zoom === b.zoom && a.zoomMode === b.zoomMode && a.effectiveZoom === b.effectiveZoom && a.zoomSteps === b.zoomSteps;
}
function formatZoomPercent2(zoom) {
  const percent = Math.round(zoom * 1e3) / 10;
  return percent % 1 === 0 ? `${percent}%` : `${percent.toFixed(1)}%`;
}
function getDisplayZoom(slice) {
  if (slice.zoomMode === "custom")
    return slice.zoom;
  return slice.effectiveZoom ?? slice.zoom;
}
function createFloatingToolbar() {
  const el = document.createElement("div");
  el.className = "udoc-floating-toolbar";
  el.setAttribute("role", "toolbar");
  el.setAttribute("aria-label", "Page navigation and zoom");
  const navSection = document.createElement("div");
  navSection.className = "udoc-toolbar__group";
  const prevBtn = document.createElement("button");
  prevBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  prevBtn.innerHTML = ICON_CHEVRON_LEFT;
  prevBtn.title = "Previous page";
  prevBtn.setAttribute("aria-label", "Previous page");
  const pageInfo = document.createElement("div");
  pageInfo.className = "udoc-toolbar__page-info";
  const pageInput = document.createElement("input");
  pageInput.className = "udoc-toolbar__page-input";
  pageInput.type = "text";
  pageInput.inputMode = "numeric";
  pageInput.setAttribute("aria-label", "Page number");
  const pageTotal = document.createElement("span");
  pageTotal.className = "udoc-toolbar__page-total";
  pageInfo.appendChild(pageInput);
  pageInfo.appendChild(pageTotal);
  const nextBtn = document.createElement("button");
  nextBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  nextBtn.innerHTML = ICON_CHEVRON_RIGHT;
  nextBtn.title = "Next page";
  nextBtn.setAttribute("aria-label", "Next page");
  navSection.appendChild(prevBtn);
  navSection.appendChild(pageInfo);
  navSection.appendChild(nextBtn);
  const divider = document.createElement("div");
  divider.className = "udoc-toolbar__divider";
  const zoomSection = document.createElement("div");
  zoomSection.className = "udoc-toolbar__group";
  const zoomOutBtn = document.createElement("button");
  zoomOutBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  zoomOutBtn.innerHTML = ICON_ZOOM_OUT;
  zoomOutBtn.title = "Zoom out";
  zoomOutBtn.setAttribute("aria-label", "Zoom out");
  const zoomDropdownContainer = document.createElement("div");
  zoomDropdownContainer.className = "udoc-zoom-dropdown";
  const zoomToggle = document.createElement("div");
  zoomToggle.className = "udoc-zoom-dropdown__toggle";
  const zoomInput = document.createElement("input");
  zoomInput.className = "udoc-zoom-dropdown__input";
  zoomInput.type = "text";
  zoomInput.inputMode = "numeric";
  zoomInput.title = "Zoom level";
  zoomInput.setAttribute("aria-label", "Zoom level");
  const zoomChevron = document.createElement("button");
  zoomChevron.className = "udoc-zoom-dropdown__chevron";
  zoomChevron.innerHTML = ICON_CHEVRON_DOWN;
  zoomChevron.title = "Zoom options";
  zoomChevron.setAttribute("aria-label", "Zoom options");
  zoomChevron.setAttribute("aria-haspopup", "listbox");
  zoomChevron.setAttribute("aria-expanded", "false");
  zoomToggle.appendChild(zoomInput);
  zoomToggle.appendChild(zoomChevron);
  const zoomDropdown = document.createElement("div");
  zoomDropdown.className = "udoc-zoom-dropdown__menu";
  zoomDropdown.setAttribute("role", "listbox");
  zoomDropdown.setAttribute("aria-label", "Zoom levels");
  zoomDropdown.style.display = "none";
  zoomDropdownContainer.appendChild(zoomToggle);
  zoomDropdownContainer.appendChild(zoomDropdown);
  const zoomInBtn = document.createElement("button");
  zoomInBtn.className = "udoc-toolbar__btn udoc-toolbar__btn--nav";
  zoomInBtn.innerHTML = ICON_ZOOM_IN;
  zoomInBtn.title = "Zoom in";
  zoomInBtn.setAttribute("aria-label", "Zoom in");
  zoomSection.appendChild(zoomOutBtn);
  zoomSection.appendChild(zoomDropdownContainer);
  zoomSection.appendChild(zoomInBtn);
  const divider2 = document.createElement("div");
  divider2.className = "udoc-toolbar__divider";
  const viewModeMenu = createViewModeMenu();
  el.appendChild(navSection);
  el.appendChild(divider);
  el.appendChild(zoomSection);
  el.appendChild(divider2);
  el.appendChild(viewModeMenu.el);
  let unsub = null;
  const unsubEvents = [];
  let rovingTabindex = null;
  let idleTimer = null;
  const IDLE_TIMEOUT_MS = 3e3;
  function isFloating() {
    return getComputedStyle(el).position === "absolute";
  }
  function resetIdleTimer() {
    el.classList.remove("udoc-floating-toolbar--idle");
    if (idleTimer !== null)
      clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!isFloating() || el.contains(document.activeElement))
        return;
      el.classList.add("udoc-floating-toolbar--idle");
    }, IDLE_TIMEOUT_MS);
  }
  function mount(container, store, i18n) {
    container.appendChild(el);
    el.setAttribute("aria-label", i18n.t("floatingToolbar.label"));
    prevBtn.title = i18n.t("toolbar.previousPage");
    prevBtn.setAttribute("aria-label", i18n.t("toolbar.previousPage"));
    pageInput.setAttribute("aria-label", i18n.t("toolbar.pageNumber"));
    nextBtn.title = i18n.t("toolbar.nextPage");
    nextBtn.setAttribute("aria-label", i18n.t("toolbar.nextPage"));
    zoomOutBtn.title = i18n.t("toolbar.zoomOut");
    zoomOutBtn.setAttribute("aria-label", i18n.t("toolbar.zoomOut"));
    zoomInput.title = i18n.t("toolbar.zoomLevel");
    zoomInput.setAttribute("aria-label", i18n.t("toolbar.zoomLevel"));
    zoomChevron.title = i18n.t("toolbar.zoomOptions");
    zoomChevron.setAttribute("aria-label", i18n.t("toolbar.zoomOptions"));
    zoomDropdown.setAttribute("aria-label", i18n.t("toolbar.zoomLevels"));
    zoomInBtn.title = i18n.t("toolbar.zoomIn");
    zoomInBtn.setAttribute("aria-label", i18n.t("toolbar.zoomIn"));
    rovingTabindex = setupRovingTabindex(el, ".udoc-toolbar__btn, input");
    const onActivity = () => resetIdleTimer();
    container.addEventListener("mousemove", onActivity);
    container.addEventListener("mousedown", onActivity);
    container.addEventListener("wheel", onActivity);
    container.addEventListener("touchstart", onActivity);
    container.addEventListener("keydown", onActivity);
    unsubEvents.push(() => {
      container.removeEventListener("mousemove", onActivity);
      container.removeEventListener("mousedown", onActivity);
      container.removeEventListener("wheel", onActivity);
      container.removeEventListener("touchstart", onActivity);
      container.removeEventListener("keydown", onActivity);
    });
    unsubEvents.push(on(el, "mouseenter", () => {
      if (idleTimer !== null)
        clearTimeout(idleTimer);
      el.classList.remove("udoc-floating-toolbar--idle");
    }), on(el, "mouseleave", () => resetIdleTimer()));
    unsubEvents.push(on(el, "focusin", () => {
      if (idleTimer !== null)
        clearTimeout(idleTimer);
      el.classList.remove("udoc-floating-toolbar--idle");
    }), on(el, "focusout", () => resetIdleTimer()));
    resetIdleTimer();
    viewModeMenu.mount(store, i18n);
    unsubEvents.push(on(prevBtn, "click", () => {
      const state = store.getState();
      if (state.page > 1) {
        store.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page - 1 });
      }
    }), on(nextBtn, "click", () => {
      const state = store.getState();
      if (state.page < state.pageCount) {
        store.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page + 1 });
      }
    }), on(zoomOutBtn, "click", () => {
      store.dispatch({ type: "ZOOM_OUT" });
    }), on(zoomInBtn, "click", () => {
      store.dispatch({ type: "ZOOM_IN" });
    }), on(pageInput, "keydown", (e) => {
      if (e.key === "Enter") {
        const value = parseInt(pageInput.value, 10);
        const state = store.getState();
        if (!isNaN(value) && value >= 1 && value <= state.pageCount) {
          store.dispatch({ type: "NAVIGATE_TO_PAGE", page: value });
        } else {
          pageInput.value = String(state.page);
        }
        pageInput.blur();
      }
    }), on(pageInput, "blur", () => {
      const state = store.getState();
      pageInput.value = String(state.page);
    }));
    let isZoomDropdownOpen = false;
    const openZoomDropdown = () => {
      if (!isZoomDropdownOpen) {
        isZoomDropdownOpen = true;
        zoomDropdown.style.display = "block";
        zoomChevron.classList.add("udoc-zoom-dropdown__chevron--active");
        zoomChevron.setAttribute("aria-expanded", "true");
      }
    };
    const closeZoomDropdown = () => {
      if (isZoomDropdownOpen) {
        isZoomDropdownOpen = false;
        zoomDropdown.style.display = "none";
        zoomChevron.classList.remove("udoc-zoom-dropdown__chevron--active");
        zoomChevron.setAttribute("aria-expanded", "false");
      }
    };
    const toggleZoomDropdown = () => {
      if (isZoomDropdownOpen) {
        closeZoomDropdown();
      } else {
        openZoomDropdown();
      }
    };
    unsubEvents.push(on(zoomInput, "keydown", (e) => {
      if (e.key === "Enter") {
        const value = parseFloat(zoomInput.value);
        const state = store.getState();
        if (!isNaN(value) && value >= 10 && value <= 500) {
          store.dispatch({ type: "SET_ZOOM", zoom: value / 100 });
        } else {
          const displayZoom = state.zoomMode === "custom" ? state.zoom : state.effectiveZoom ?? state.zoom;
          zoomInput.value = formatZoomPercent2(displayZoom);
        }
        zoomInput.blur();
      }
    }), on(zoomInput, "focus", () => {
      zoomInput.select();
    }), on(zoomInput, "blur", () => {
      const state = store.getState();
      const displayZoom = state.zoomMode === "custom" ? state.zoom : state.effectiveZoom ?? state.zoom;
      zoomInput.value = formatZoomPercent2(displayZoom);
    }));
    unsubEvents.push(on(zoomChevron, "click", (e) => {
      e.stopPropagation();
      toggleZoomDropdown();
    }));
    const handleOutsideClick = (e) => {
      if (!zoomDropdownContainer.contains(e.target)) {
        closeZoomDropdown();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    unsubEvents.push(() => document.removeEventListener("click", handleOutsideClick));
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeZoomDropdown();
      }
    };
    document.addEventListener("keydown", handleEscape);
    unsubEvents.push(() => document.removeEventListener("keydown", handleEscape));
    const ZOOM_MODE_OPTIONS = [
      { mode: "fit-spread-width", label: i18n.t("zoom.fitWidth") },
      { mode: "fit-spread-height", label: i18n.t("zoom.fitHeight") },
      { mode: "fit-spread", label: i18n.t("zoom.fitPage") }
    ];
    const buildZoomDropdown = (slice) => {
      zoomDropdown.innerHTML = "";
      const stepsSection = document.createElement("div");
      stepsSection.className = "udoc-zoom-dropdown__section";
      for (const step of slice.zoomSteps) {
        const item = document.createElement("button");
        item.className = "udoc-zoom-dropdown__item";
        item.setAttribute("role", "option");
        const stepPercent = Math.round(step * 100);
        const currentPercent = Math.round(slice.zoom * 100);
        const isActive = slice.zoomMode === "custom" && stepPercent === currentPercent;
        if (isActive) {
          item.classList.add("udoc-zoom-dropdown__item--active");
        }
        item.setAttribute("aria-selected", String(isActive));
        item.textContent = `${stepPercent}%`;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          store.dispatch({ type: "SET_ZOOM", zoom: step });
          closeZoomDropdown();
        });
        stepsSection.appendChild(item);
      }
      zoomDropdown.appendChild(stepsSection);
      const dividerEl = document.createElement("div");
      dividerEl.className = "udoc-zoom-dropdown__divider";
      dividerEl.setAttribute("role", "separator");
      zoomDropdown.appendChild(dividerEl);
      const modeSection = document.createElement("div");
      modeSection.className = "udoc-zoom-dropdown__section";
      for (const opt of ZOOM_MODE_OPTIONS) {
        const item = document.createElement("button");
        item.className = "udoc-zoom-dropdown__item";
        item.setAttribute("role", "option");
        const isActive = slice.zoomMode === opt.mode;
        if (isActive) {
          item.classList.add("udoc-zoom-dropdown__item--active");
        }
        item.setAttribute("aria-selected", String(isActive));
        item.textContent = opt.label;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const state = store.getState();
          store.dispatch({ type: "SET_ZOOM_MODE", mode: opt.mode });
          if (state.zoomMode === opt.mode) {
            store.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page });
          }
          closeZoomDropdown();
        });
        modeSection.appendChild(item);
      }
      zoomDropdown.appendChild(modeSection);
    };
    const applyState = (slice) => {
      el.style.display = slice.floatingToolbarVisible ? "" : "none";
      if (!slice.floatingToolbarVisible)
        return;
      pageInput.value = String(slice.page);
      pageTotal.textContent = `\xA0/ ${slice.pageCount}`;
      if (document.activeElement !== zoomInput) {
        zoomInput.value = formatZoomPercent2(getDisplayZoom(slice));
      }
      prevBtn.disabled = slice.page <= 1;
      nextBtn.disabled = slice.page >= slice.pageCount;
      buildZoomDropdown(slice);
    };
    applyState(selectSlice4(store.getState()));
    unsub = subscribeSelector(store, selectSlice4, applyState, {
      equality: sliceEqual4
    });
  }
  function destroy() {
    if (idleTimer !== null)
      clearTimeout(idleTimer);
    if (unsub)
      unsub();
    if (rovingTabindex)
      rovingTabindex.destroy();
    for (const off of unsubEvents)
      off();
    viewModeMenu.destroy();
    el.remove();
  }
  return { el, mount, destroy };
}
function selectSlice4(state) {
  return {
    floatingToolbarVisible: state.floatingToolbarVisible,
    page: state.page,
    pageCount: state.pageCount,
    zoom: state.zoom,
    zoomMode: state.zoomMode,
    effectiveZoom: state.effectiveZoom,
    zoomSteps: state.zoomSteps
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/transition-gl.js
var VORTEX_COLS = 80;
var VORTEX_ROWS = 44;
function tryRunGLTransition(outgoing, incoming, transition, _forward, durationMs, onComplete) {
  const effect = transition.effect;
  if (effect.type === "vortex") {
    return runVortex(outgoing, incoming, effect.direction, durationMs, onComplete);
  }
  if (effect.type === "switch") {
    return runSwitch(outgoing, incoming, effect.direction, durationMs, onComplete);
  }
  return null;
}
function runVortex(outgoing, incoming, dir, durationMs, onComplete) {
  const outCanvas = outgoing.querySelector("canvas");
  const inCanvas = incoming.querySelector(".udoc-spread__canvas") ?? incoming.querySelector("canvas");
  if (!outCanvas || !inCanvas || outCanvas.width === 0 || inCanvas.width === 0) {
    return null;
  }
  const dpr = window.devicePixelRatio || 1;
  const slideW = outCanvas.width / dpr;
  const slideH = outCanvas.height / dpr;
  const glCanvas = document.createElement("canvas");
  glCanvas.width = outCanvas.width;
  glCanvas.height = outCanvas.height;
  const gl = glCanvas.getContext("webgl2", {
    alpha: false,
    antialias: true,
    depth: true,
    premultipliedAlpha: false
  });
  if (!gl)
    return null;
  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (outCanvas.width > maxTex || outCanvas.height > maxTex || inCanvas.width > maxTex || inCanvas.height > maxTex) {
    return null;
  }
  const program = createProgram(gl, VORTEX_VS, VORTEX_FS);
  if (!program)
    return null;
  const outTex = uploadTexture(gl, outCanvas);
  const inTex = uploadTexture(gl, inCanvas);
  if (!outTex || !inTex) {
    if (outTex)
      gl.deleteTexture(outTex);
    if (inTex)
      gl.deleteTexture(inTex);
    gl.deleteProgram(program);
    return null;
  }
  const mesh = buildVortexMesh(VORTEX_COLS, VORTEX_ROWS, slideW, slideH, dir);
  const vbo = gl.createBuffer();
  if (!vbo) {
    gl.deleteTexture(outTex);
    gl.deleteTexture(inTex);
    gl.deleteProgram(program);
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.data, gl.STATIC_DRAW);
  gl.useProgram(program);
  const F = 4;
  const STRIDE = 11 * F;
  bindAttrib(gl, program, "a_localPos", 2, STRIDE, 0 * F);
  bindAttrib(gl, program, "a_tileCenter", 2, STRIDE, 2 * F);
  bindAttrib(gl, program, "a_uv", 2, STRIDE, 4 * F);
  bindAttrib(gl, program, "a_staggerOut", 1, STRIDE, 6 * F);
  bindAttrib(gl, program, "a_staggerIn", 1, STRIDE, 7 * F);
  bindAttrib(gl, program, "a_jitter", 3, STRIDE, 8 * F);
  const uT = gl.getUniformLocation(program, "u_t");
  const uResolution = gl.getUniformLocation(program, "u_resolution");
  const uIsHorizontal = gl.getUniformLocation(program, "u_isHorizontal");
  const uRotSign = gl.getUniformLocation(program, "u_rotSign");
  const uPhase = gl.getUniformLocation(program, "u_phase");
  const uTex = gl.getUniformLocation(program, "u_tex");
  const uPerspective = gl.getUniformLocation(program, "u_perspective");
  const isH = dir === "left" || dir === "right";
  const rotSign = dir === "right" || dir === "up" ? 1 : -1;
  gl.uniform2f(uResolution, slideW, slideH);
  gl.uniform1f(uIsHorizontal, isH ? 1 : 0);
  gl.uniform1f(uRotSign, rotSign);
  gl.uniform1f(uPerspective, Math.max(slideW, slideH) * 2);
  gl.uniform1i(uTex, 0);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.activeTexture(gl.TEXTURE0);
  glCanvas.style.position = "absolute";
  glCanvas.style.left = "0";
  glCanvas.style.top = "0";
  glCanvas.style.width = `${slideW}px`;
  glCanvas.style.height = `${slideH}px`;
  glCanvas.style.display = "block";
  outgoing.innerHTML = "";
  outgoing.style.overflow = "visible";
  outgoing.style.zIndex = "1";
  outgoing.style.pointerEvents = "none";
  outgoing.appendChild(glCanvas);
  incoming.style.opacity = "0";
  drawFrame(0);
  let rafId = 0;
  let done = false;
  const startTime = performance.now();
  function drawFrame(t) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(uT, t);
    gl.uniform1f(uPhase, 0);
    gl.bindTexture(gl.TEXTURE_2D, outTex);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
    gl.uniform1f(uPhase, 1);
    gl.bindTexture(gl.TEXTURE_2D, inTex);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
  }
  function tick(now) {
    if (done)
      return;
    const elapsed = now - startTime;
    const raw = Math.min(elapsed / durationMs, 1);
    const eased = easeInOut(raw);
    drawFrame(eased);
    if (raw < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      finish();
    }
  }
  function finish() {
    if (done)
      return;
    done = true;
    cancelAnimationFrame(rafId);
    try {
      gl.deleteTexture(outTex);
      gl.deleteTexture(inTex);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose)
        lose.loseContext();
    } catch {
    }
    incoming.style.opacity = "";
    incoming.style.clipPath = "";
    onComplete();
  }
  glCanvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    finish();
  });
  rafId = requestAnimationFrame(tick);
  return { cancel: finish };
}
var VORTEX_VS = `#version 300 es
precision highp float;

in vec2 a_localPos;    // vertex xy relative to tile center, in slide pixels
in vec2 a_tileCenter;  // tile center in slide pixels
in vec2 a_uv;          // texture coord (0..1, origin top-left)
in float a_staggerOut;
in float a_staggerIn;
in vec3 a_jitter;      // (zSign, zRand, driftRand)

uniform float u_t;            // eased animation time 0..1
uniform vec2  u_resolution;   // slide width/height in CSS pixels
uniform float u_isHorizontal; // 1 for left/right, 0 for up/down
uniform float u_rotSign;      // +1 or -1
uniform float u_phase;        // 0 = outgoing, 1 = incoming
uniform float u_perspective;  // CSS perspective, in pixels

out vec2 v_uv;
out float v_facing;

const float PI = 3.14159265;

// Rotation axis is pushed back into the screen by this fraction of the
// slide's longest side. A larger value means a bigger orbit radius \u2014 tiles
// arc visibly backward through the screen plane instead of only sliding
// sideways. The CSS fallback uses 0 (axis on the slide plane itself).
const float AXIS_DEPTH_FACTOR = 0.5;

float clamp01(float x) { return clamp(x, 0.0, 1.0); }

void main() {
    vec2 center = u_resolution * 0.5;
    vec2 rest = a_tileCenter + a_localPos;
    float axisDepth = max(u_resolution.x, u_resolution.y) * AXIS_DEPTH_FACTOR;

    float stagger = (u_phase < 0.5) ? a_staggerOut : a_staggerIn;
    float offset = (u_phase < 0.5) ? 0.0 : 0.1;
    float localT = clamp01((u_t - offset - stagger * 0.4) / 0.55);

    float baseDeg = (u_phase < 0.5)
        ? (localT * 180.0)
        : (-180.0 + localT * 180.0);
    float angle = radians(u_rotSign * baseDeg);

    // A tile shows its front while |rotation| < 90\xB0.
    //   Outgoing: visible for localT < 0.5
    //   Incoming: visible for localT > 0.5
    v_facing = (u_phase < 0.5) ? step(localT, 0.5) : step(0.5, localT);

    float zSign = a_jitter.x;
    float zRand = a_jitter.y;
    float driftRand = a_jitter.z;
    float sinPi = sin(localT * PI);
    float zOffset = zSign * sinPi * 200.0 * zRand;

    // Drift is perpendicular to the rotation axis.
    vec2 d = center - a_tileCenter;
    float dPerp = (u_isHorizontal > 0.5) ? d.y : d.x;
    float drift = sinPi * dPerp * 0.5 * driftRand;

    float c = cos(angle);
    float s = sin(angle);

    // 3D orbit around an axis pushed back into the screen by axisDepth.
    //
    // Each vertex, relative to the axis, starts at offset (u, axisDepth)
    // in the rotation plane (xz for horizontal, yz for vertical). After
    // rotating by the angle, its new in-plane offset is:
    //   u' = c*u + s*axisDepth
    //   z' = -s*u + c*axisDepth
    // Converting back to world coords (axis sits at z = -axisDepth) gives
    // the formulas below. At angle=0 every vertex is at rest; at 180\xB0 the
    // tile is mirrored across the axis AND pushed to z = -2*axisDepth \u2014
    // a real semicircular arc rather than an in-plane flip.
    vec3 world;
    if (u_isHorizontal > 0.5) {
        float u = rest.x - center.x;
        world.x = center.x + c * u + s * axisDepth;
        world.y = rest.y + drift;
        world.z = -s * u + axisDepth * (c - 1.0) + zOffset;
    } else {
        float v = rest.y - center.y;
        world.x = rest.x + drift;
        world.y = center.y + c * v - s * axisDepth;
        world.z = s * v + axisDepth * (c - 1.0) + zOffset;
    }

    // CSS-style perspective: camera at z = +P, perspective-origin = center.
    float wp = max(1.0 - world.z / u_perspective, 0.001);
    vec2 screen = center + (world.xy - center) / wp;

    // Slide pixels \u2192 clip space. Screen uses +y down; clip is +y up.
    float clipX = (screen.x / u_resolution.x) * 2.0 - 1.0;
    float clipY = 1.0 - (screen.y / u_resolution.y) * 2.0;
    // Preserve z for depth testing so overlapping tiles sort correctly.
    float clipZ = clamp(-world.z / u_perspective, -0.99, 0.99);

    gl_Position = vec4(clipX, clipY, clipZ, 1.0);
    v_uv = a_uv;
}
`;
var VORTEX_FS = `#version 300 es
precision highp float;

in vec2 v_uv;
in float v_facing;

uniform sampler2D u_tex;

out vec4 outColor;

void main() {
    // Backface hide without relying on winding/cull, so the shader works
    // regardless of y-flip conventions.
    if (v_facing < 0.5) discard;
    outColor = texture(u_tex, v_uv);
}
`;
var SWITCH_MAX_ANGLE_RAD = Math.PI / 180 * 45;
var SWITCH_HAND_SHIFT_PX = 200;
var SWITCH_Z_MAX = 350;
function computeSwitchGeometry(dir, slideW, slideH) {
  switch (dir) {
    case "left":
      return {
        p1HingeLocal: [0, 0],
        p2HingeLocal: [slideW, 0],
        p1RotSign: 1,
        p2RotSign: -1,
        p1Shift: [-1, 0],
        p2Shift: [1, 0]
      };
    case "right":
      return {
        p1HingeLocal: [slideW, 0],
        p2HingeLocal: [0, 0],
        p1RotSign: -1,
        p2RotSign: 1,
        p1Shift: [1, 0],
        p2Shift: [-1, 0]
      };
    case "up":
      return {
        p1HingeLocal: [0, 0],
        p2HingeLocal: [0, slideH],
        p1RotSign: -1,
        p2RotSign: 1,
        p1Shift: [0, -1],
        p2Shift: [0, 1]
      };
    case "down":
      return {
        p1HingeLocal: [0, slideH],
        p2HingeLocal: [0, 0],
        p1RotSign: 1,
        p2RotSign: -1,
        p1Shift: [0, 1],
        p2Shift: [0, -1]
      };
  }
}
function runSwitch(outgoing, incoming, dir, durationMs, onComplete) {
  const outCanvas = outgoing.querySelector("canvas");
  const inCanvas = incoming.querySelector(".udoc-spread__canvas") ?? incoming.querySelector("canvas");
  if (!outCanvas || !inCanvas || outCanvas.width === 0 || inCanvas.width === 0) {
    return null;
  }
  const dpr = window.devicePixelRatio || 1;
  const slideW = outCanvas.width / dpr;
  const slideH = outCanvas.height / dpr;
  const glCanvas = document.createElement("canvas");
  glCanvas.width = outCanvas.width;
  glCanvas.height = outCanvas.height;
  const gl = glCanvas.getContext("webgl2", {
    alpha: false,
    antialias: true,
    depth: true,
    premultipliedAlpha: false
  });
  if (!gl)
    return null;
  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (outCanvas.width > maxTex || outCanvas.height > maxTex || inCanvas.width > maxTex || inCanvas.height > maxTex) {
    return null;
  }
  const program = createProgram(gl, SWITCH_VS, SWITCH_FS);
  if (!program)
    return null;
  const outTex = uploadTexture(gl, outCanvas);
  const inTex = uploadTexture(gl, inCanvas);
  if (!outTex || !inTex) {
    if (outTex)
      gl.deleteTexture(outTex);
    if (inTex)
      gl.deleteTexture(inTex);
    gl.deleteProgram(program);
    return null;
  }
  const meshData = new Float32Array([
    0,
    0,
    0,
    0,
    slideW,
    0,
    1,
    0,
    slideW,
    slideH,
    1,
    1,
    0,
    0,
    0,
    0,
    slideW,
    slideH,
    1,
    1,
    0,
    slideH,
    0,
    1
  ]);
  const vertexCount = 6;
  const vbo = gl.createBuffer();
  if (!vbo) {
    gl.deleteTexture(outTex);
    gl.deleteTexture(inTex);
    gl.deleteProgram(program);
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, meshData, gl.STATIC_DRAW);
  gl.useProgram(program);
  const F = 4;
  const STRIDE = 4 * F;
  bindAttrib(gl, program, "a_localPos", 2, STRIDE, 0 * F);
  bindAttrib(gl, program, "a_uv", 2, STRIDE, 2 * F);
  const uResolution = gl.getUniformLocation(program, "u_resolution");
  const uPerspective = gl.getUniformLocation(program, "u_perspective");
  const uIsHorizontal = gl.getUniformLocation(program, "u_isHorizontal");
  const uHingeWorld = gl.getUniformLocation(program, "u_hingeWorld");
  const uHingeLocal = gl.getUniformLocation(program, "u_hingeLocal");
  const uAngle = gl.getUniformLocation(program, "u_angle");
  const uTex = gl.getUniformLocation(program, "u_tex");
  const isH = dir === "left" || dir === "right";
  const maxDim = Math.max(slideW, slideH);
  const geom = computeSwitchGeometry(dir, slideW, slideH);
  gl.uniform2f(uResolution, slideW, slideH);
  gl.uniform1f(uPerspective, maxDim * 2);
  gl.uniform1f(uIsHorizontal, isH ? 1 : 0);
  gl.uniform1i(uTex, 0);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.activeTexture(gl.TEXTURE0);
  glCanvas.style.position = "absolute";
  glCanvas.style.left = "0";
  glCanvas.style.top = "0";
  glCanvas.style.width = `${slideW}px`;
  glCanvas.style.height = `${slideH}px`;
  glCanvas.style.display = "block";
  outgoing.innerHTML = "";
  outgoing.style.overflow = "visible";
  outgoing.style.zIndex = "1";
  outgoing.style.pointerEvents = "none";
  outgoing.appendChild(glCanvas);
  incoming.style.opacity = "0";
  function drawFrame(t) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const sinPiT = Math.sin(Math.PI * t);
    const theta = SWITCH_MAX_ANGLE_RAD * sinPiT;
    const shift = SWITCH_HAND_SHIFT_PX * sinPiT;
    const p1BaseZ = -SWITCH_Z_MAX * t;
    const p2BaseZ = -SWITCH_Z_MAX * (1 - t);
    const p1Wx = geom.p1HingeLocal[0] + geom.p1Shift[0] * shift;
    const p1Wy = geom.p1HingeLocal[1] + geom.p1Shift[1] * shift;
    const p2Wx = geom.p2HingeLocal[0] + geom.p2Shift[0] * shift;
    const p2Wy = geom.p2HingeLocal[1] + geom.p2Shift[1] * shift;
    gl.uniform3f(uHingeWorld, p1Wx, p1Wy, p1BaseZ);
    gl.uniform2f(uHingeLocal, geom.p1HingeLocal[0], geom.p1HingeLocal[1]);
    gl.uniform1f(uAngle, geom.p1RotSign * theta);
    gl.bindTexture(gl.TEXTURE_2D, outTex);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    gl.uniform3f(uHingeWorld, p2Wx, p2Wy, p2BaseZ);
    gl.uniform2f(uHingeLocal, geom.p2HingeLocal[0], geom.p2HingeLocal[1]);
    gl.uniform1f(uAngle, geom.p2RotSign * theta);
    gl.bindTexture(gl.TEXTURE_2D, inTex);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  }
  drawFrame(0);
  let rafId = 0;
  let done = false;
  const startTime = performance.now();
  function tick(now) {
    if (done)
      return;
    const elapsed = now - startTime;
    const raw = Math.min(elapsed / durationMs, 1);
    const eased = easeInOut(raw);
    drawFrame(eased);
    if (raw < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      finish();
    }
  }
  function finish() {
    if (done)
      return;
    done = true;
    cancelAnimationFrame(rafId);
    try {
      gl.deleteTexture(outTex);
      gl.deleteTexture(inTex);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose)
        lose.loseContext();
    } catch {
    }
    incoming.style.opacity = "";
    incoming.style.clipPath = "";
    onComplete();
  }
  glCanvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    finish();
  });
  rafId = requestAnimationFrame(tick);
  return { cancel: finish };
}
var SWITCH_VS = `#version 300 es
precision highp float;

in vec2 a_localPos;
in vec2 a_uv;

uniform vec2 u_resolution;
uniform float u_perspective;
uniform float u_isHorizontal;
uniform vec3 u_hingeWorld;
uniform vec2 u_hingeLocal;
uniform float u_angle;

out vec2 v_uv;

void main() {
    vec2 rel = a_localPos - u_hingeLocal;

    float c = cos(u_angle);
    float s = sin(u_angle);

    vec3 rotated;
    if (u_isHorizontal > 0.5) {
        // Rotate around Y axis: x' = c*x, z' = -s*x  (initial z = 0)
        rotated = vec3(c * rel.x, rel.y, -s * rel.x);
    } else {
        // Rotate around X axis: y' = c*y, z' =  s*y  (initial z = 0)
        rotated = vec3(rel.x, c * rel.y, s * rel.y);
    }

    vec3 world = u_hingeWorld + rotated;

    // CSS-style perspective divide around slide center.
    vec2 center = u_resolution * 0.5;
    float wp = max(1.0 - world.z / u_perspective, 0.001);
    vec2 screen = center + (world.xy - center) / wp;

    float clipX = (screen.x / u_resolution.x) * 2.0 - 1.0;
    float clipY = 1.0 - (screen.y / u_resolution.y) * 2.0;
    float clipZ = clamp(-world.z / u_perspective, -0.99, 0.99);

    // Output in full homogeneous form so GL's own perspective divide
    // undoes the *wp multiply and, crucially, uses 1/w for
    // perspective-correct interpolation of v_uv across the quad's two
    // triangles. Outputting w=1 (pre-divided) makes GL interpolate
    // linearly in screen space, which produces a visible fold along
    // the shared diagonal once the paper is significantly rotated.
    gl_Position = vec4(clipX * wp, clipY * wp, clipZ * wp, wp);
    v_uv = a_uv;
}
`;
var SWITCH_FS = `#version 300 es
precision highp float;

in vec2 v_uv;

uniform sampler2D u_tex;

out vec4 outColor;

void main() {
    outColor = texture(u_tex, v_uv);
}
`;
function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    if (vs)
      gl.deleteShader(vs);
    if (fs)
      gl.deleteShader(fs);
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader)
    return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
function bindAttrib(gl, program, name, size, stride, offset) {
  const loc = gl.getAttribLocation(program, name);
  if (loc < 0)
    return;
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
}
function uploadTexture(gl, source) {
  const tex = gl.createTexture();
  if (!tex)
    return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  } catch {
    gl.deleteTexture(tex);
    return null;
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}
function buildVortexMesh(cols, rows, slideW, slideH, dir) {
  const tileW = slideW / cols;
  const tileH = slideH / rows;
  const FLOATS_PER_VERT = 11;
  const VERTS_PER_TILE = 6;
  const totalVerts = rows * cols * VERTS_PER_TILE;
  const data = new Float32Array(totalVerts * FLOATS_PER_VERT);
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileCenterX = (c + 0.5) * tileW;
      const tileCenterY = (r + 0.5) * tileH;
      const u0 = c / cols;
      const u1 = (c + 1) / cols;
      const v0 = r / rows;
      const v1 = (r + 1) / rows;
      const colN = c / Math.max(1, cols - 1);
      const rowN = r / Math.max(1, rows - 1);
      let outSt;
      let inSt;
      switch (dir) {
        case "right":
          outSt = colN * 0.7 + rowN * 0.3;
          inSt = (1 - colN) * 0.7 + (1 - rowN) * 0.3;
          break;
        case "left":
          outSt = (1 - colN) * 0.7 + rowN * 0.3;
          inSt = colN * 0.7 + (1 - rowN) * 0.3;
          break;
        case "down":
          outSt = rowN * 0.7 + colN * 0.3;
          inSt = (1 - rowN) * 0.7 + (1 - colN) * 0.3;
          break;
        case "up":
          outSt = (1 - rowN) * 0.7 + colN * 0.3;
          inSt = rowN * 0.7 + (1 - colN) * 0.3;
          break;
      }
      const jitter = (Math.random() - 0.5) * 0.15;
      const staggerOut = Math.max(0, Math.min(1, outSt + jitter));
      const staggerIn = Math.max(0, Math.min(1, inSt + jitter));
      const zSign = Math.random() < 0.5 ? -1 : 1;
      const zRand = 0.5 + Math.random();
      const driftRand = 0.3 + Math.random() * 1.4;
      const hw = tileW / 2;
      const hh = tileH / 2;
      const tileVerts = [
        [-hw, -hh, u0, v0],
        // A
        [hw, -hh, u1, v0],
        // B
        [hw, hh, u1, v1],
        // C
        [-hw, -hh, u0, v0],
        // A
        [hw, hh, u1, v1],
        // C
        [-hw, hh, u0, v1]
        // D
      ];
      for (const [lx, ly, u, v] of tileVerts) {
        data[idx++] = lx;
        data[idx++] = ly;
        data[idx++] = tileCenterX;
        data[idx++] = tileCenterY;
        data[idx++] = u;
        data[idx++] = v;
        data[idx++] = staggerOut;
        data[idx++] = staggerIn;
        data[idx++] = zSign;
        data[idx++] = zRand;
        data[idx++] = driftRand;
      }
    }
  }
  return { data, vertexCount: totalVerts };
}
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/transition.js
function runTransition(outgoing, incoming, transition, forward, onComplete) {
  const durationMs = transition.durationMs ?? 500;
  if (durationMs > 0) {
    const glHandle = tryRunGLTransition(outgoing, incoming, transition, forward, durationMs, onComplete);
    if (glHandle)
      return glHandle;
  }
  const apply = resolveEffect(transition.effect, forward);
  if (durationMs <= 0 || !apply) {
    onComplete();
    return { cancel() {
    } };
  }
  outgoing.style.pointerEvents = "none";
  apply(0, outgoing, incoming);
  let rafId = 0;
  let done = false;
  const startTime = performance.now();
  function tick(now) {
    if (done)
      return;
    const elapsed = now - startTime;
    const raw = Math.min(elapsed / durationMs, 1);
    const t = easeInOut2(raw);
    apply(t, outgoing, incoming);
    if (raw < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      finish();
    }
  }
  function finish() {
    if (done)
      return;
    done = true;
    cancelAnimationFrame(rafId);
    resetOutgoing(outgoing);
    resetIncoming(incoming);
    onComplete();
  }
  rafId = requestAnimationFrame(tick);
  return {
    cancel() {
      finish();
    }
  };
}
function easeInOut2(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function resetOutgoing(el) {
  el.style.pointerEvents = "";
  el.style.zIndex = "";
  el.style.opacity = "";
  el.style.clipPath = "";
  el.style.transform = "none";
  el.style.filter = "";
}
function resetIncoming(el) {
  el.style.opacity = "";
  el.style.clipPath = "";
  el.style.maskImage = "";
  el.style.setProperty("-webkit-mask-image", "");
}
function sideToTranslate(dir, progress) {
  const p = progress * 100;
  switch (dir) {
    case "left":
      return `translateX(${-p}%)`;
    case "right":
      return `translateX(${p}%)`;
    case "up":
      return `translateY(${-p}%)`;
    case "down":
      return `translateY(${p}%)`;
  }
}
function oppositeSide(dir) {
  switch (dir) {
    case "left":
      return "right";
    case "right":
      return "left";
    case "up":
      return "down";
    case "down":
      return "up";
  }
}
function eightDirToTranslate(dir, progress) {
  const p = progress * 100;
  const x = dir === "left" || dir === "leftUp" || dir === "leftDown" ? -p : dir === "right" || dir === "rightUp" || dir === "rightDown" ? p : 0;
  const y = dir === "up" || dir === "leftUp" || dir === "rightUp" ? -p : dir === "down" || dir === "leftDown" || dir === "rightDown" ? p : 0;
  return `translate(${x}%, ${y}%)`;
}
function oppositeEightDir(dir) {
  const map = {
    left: "right",
    right: "left",
    up: "down",
    down: "up",
    leftUp: "rightDown",
    rightUp: "leftDown",
    leftDown: "rightUp",
    rightDown: "leftUp"
  };
  return map[dir];
}
function eightDirToRevealInset(dir, t) {
  const p = (1 - t) * 100;
  let top = 0, right = 0, bottom = 0, left = 0;
  if (dir === "left" || dir === "leftUp" || dir === "leftDown")
    right = p;
  if (dir === "right" || dir === "rightUp" || dir === "rightDown")
    left = p;
  if (dir === "up" || dir === "leftUp" || dir === "rightUp")
    bottom = p;
  if (dir === "down" || dir === "leftDown" || dir === "rightDown")
    top = p;
  return `inset(${top}% ${right}% ${bottom}% ${left}%)`;
}
function resolveEffect(effect, forward) {
  switch (effect.type) {
    case "replace":
      return null;
    case "fade":
      return effect.throughBlack ? fadeThroughBlack : crossfade;
    case "cut":
      return effect.throughBlack ? cutThroughBlack : null;
    case "dissolve":
      return dissolveEffect();
    case "push":
      return pushEffect(effect.direction);
    case "wipe":
      return wipeEffect(effect.direction);
    case "cover":
      return coverEffect(oppositeEightDir(effect.direction));
    case "uncover":
      return uncoverEffect(effect.direction);
    case "pull":
      return pullEffect(effect.direction);
    case "split":
      return splitEffect(effect.orientation, effect.inOut);
    case "zoom":
    case "box":
      return effect.inOut === "in" ? shrinkToCenter : expandFromCenter;
    case "fly": {
      const dir = forward ? effect.direction : oppositeSide(effect.direction);
      return flyEffect(dir);
    }
    case "glitter": {
      const dir = forward ? effect.direction : oppositeSide(effect.direction);
      return wipeEffect(dir);
    }
    case "circle":
      return circleEffect;
    case "diamond":
      return diamondEffect;
    case "plus":
      return plusEffect;
    case "wedge":
      return wedgeEffect;
    case "wheel":
      return wheelSweepEffect(effect.spokes, true);
    case "newsflash":
      return newsflashEffect;
    case "blinds":
      return blindsEffect(effect.orientation);
    case "checker":
      return checkerEffect(effect.orientation);
    case "comb":
      return combEffect(effect.orientation);
    case "strips":
      return stripsEffect(effect.direction);
    case "random": {
      const options = [
        crossfade,
        fadeThroughBlack,
        wipeEffect("left"),
        wipeEffect("right"),
        wipeEffect("up"),
        wipeEffect("down"),
        pushEffect("left"),
        pushEffect("right"),
        blindsEffect("horizontal"),
        blindsEffect("vertical"),
        circleEffect,
        diamondEffect,
        plusEffect,
        splitEffect("horizontal", "out"),
        splitEffect("vertical", "out")
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    case "randomBar":
      return randomBarEffect(effect.orientation);
    case "vortex":
      return vortexEffect(effect.direction);
    case "switch":
    case "flip":
    case "gallery":
    case "conveyor":
      return flyEffect(effect.direction);
    case "ripple":
      return circleEffect;
    case "honeycomb":
      return crossfade;
    case "prism":
      return wipeEffect(effect.direction);
    case "doors":
      return splitEffect(effect.orientation, "out");
    case "window":
      return splitEffect(effect.orientation, "in");
    case "ferris":
      return flyEffect(effect.direction);
    case "pan": {
      const dir = forward ? effect.direction : oppositeSide(effect.direction);
      return pushEffect(dir);
    }
    case "warp":
    case "flythrough":
      return effect.inOut === "in" ? shrinkToCenter : expandFromCenter;
    case "flash":
      return fadeThroughBlack;
    case "shred":
      return effect.inOut === "in" ? shrinkToCenter : expandFromCenter;
    case "reveal":
      return effect.throughBlack ? fadeThroughBlack : wipeEffect(effect.direction);
    case "wheelReverse":
      return wheelSweepEffect(effect.spokes, false);
    case "morph":
      return crossfade;
    default:
      return crossfade;
  }
}
function crossfade(t, outgoing, _incoming) {
  outgoing.style.zIndex = "1";
  outgoing.style.opacity = `${1 - t}`;
}
function fadeThroughBlack(t, outgoing, _incoming) {
  outgoing.style.zIndex = "1";
  if (t < 0.5) {
    outgoing.style.filter = `brightness(${1 - t * 2})`;
    outgoing.style.opacity = "1";
  } else {
    outgoing.style.filter = "brightness(0)";
    outgoing.style.opacity = `${1 - (t - 0.5) * 2}`;
  }
}
function cutThroughBlack(t, outgoing, _incoming) {
  outgoing.style.zIndex = "1";
  if (t < 0.5) {
    outgoing.style.filter = "brightness(0)";
    outgoing.style.opacity = "1";
  } else {
    outgoing.style.opacity = "0";
  }
}
function pushEffect(dir) {
  const opp = oppositeSide(dir);
  return (t, outgoing, incoming) => {
    if (t >= 1) {
      incoming.style.transform = "";
      return;
    }
    outgoing.style.zIndex = "1";
    outgoing.style.transform = sideToTranslate(dir, t);
    incoming.style.transform = sideToTranslate(opp, 1 - t);
  };
}
function wipeEffect(dir) {
  return (t, _outgoing, incoming) => {
    if (t >= 1) {
      clearMask(incoming);
      return;
    }
    const p = (1 - t) * 100;
    const blur = Math.max(0.5, t * 50 * 0.08);
    const E = 50;
    let rect;
    switch (dir) {
      case "right":
        rect = `<rect x="${p}" y="${-E}" width="${100 - p + E}" height="${100 + 2 * E}" fill="white" filter="url(#b)"/>`;
        break;
      case "left":
        rect = `<rect x="${-E}" y="${-E}" width="${100 - p + E}" height="${100 + 2 * E}" fill="white" filter="url(#b)"/>`;
        break;
      case "down":
        rect = `<rect x="${-E}" y="${-E}" width="${100 + 2 * E}" height="${100 - p + E}" fill="white" filter="url(#b)"/>`;
        break;
      case "up":
        rect = `<rect x="${-E}" y="${p}" width="${100 + 2 * E}" height="${100 - p + E}" fill="white" filter="url(#b)"/>`;
        break;
    }
    applyMask(incoming, svgMask(rect, blur));
  };
}
function coverEffect(dir) {
  return (t, _outgoing, incoming) => {
    incoming.style.clipPath = eightDirToRevealInset(dir, t);
  };
}
function uncoverEffect(dir) {
  return (t, outgoing, _incoming) => {
    outgoing.style.zIndex = "1";
    outgoing.style.transform = eightDirToTranslate(dir, t);
  };
}
function pullEffect(dir) {
  return (t, outgoing, _incoming) => {
    outgoing.style.zIndex = "1";
    outgoing.style.transform = eightDirToTranslate(dir, t);
  };
}
function splitEffect(orientation, inOut) {
  const isH = orientation === "horizontal";
  const E = 50;
  if (inOut === "out") {
    return (t, _outgoing, incoming) => {
      if (t >= 1) {
        clearMask(incoming);
        return;
      }
      const p = (1 - t) * 50;
      const blur = Math.max(0.5, t * 50 * 0.08);
      const rect = isH ? `<rect x="${-E}" y="${p}" width="${100 + 2 * E}" height="${100 - 2 * p}" fill="white" filter="url(#b)"/>` : `<rect x="${p}" y="${-E}" width="${100 - 2 * p}" height="${100 + 2 * E}" fill="white" filter="url(#b)"/>`;
      applyMask(incoming, svgMask(rect, blur));
    };
  } else {
    return (t, outgoing, _incoming) => {
      if (t >= 1) {
        clearMask(outgoing);
        return;
      }
      outgoing.style.zIndex = "1";
      const p = t * 50;
      const blur = Math.max(0.5, p * 0.08);
      const rect = isH ? `<rect x="${-E}" y="${p}" width="${100 + 2 * E}" height="${100 - 2 * p}" fill="white" filter="url(#b)"/>` : `<rect x="${p}" y="${-E}" width="${100 - 2 * p}" height="${100 + 2 * E}" fill="white" filter="url(#b)"/>`;
      applyMask(outgoing, svgMask(rect, blur));
    };
  }
}
function shrinkToCenter(t, outgoing, _incoming) {
  outgoing.style.zIndex = "1";
  if (t <= 0) {
    clearMask(outgoing);
    return;
  }
  const p = t * 50;
  const blur = Math.max(0.5, p * 0.08);
  applyMask(outgoing, svgMask(`<rect x="${p}" y="${p}" width="${100 - 2 * p}" height="${100 - 2 * p}" fill="white" filter="url(#b)"/>`, blur));
}
function expandFromCenter(t, _outgoing, incoming) {
  if (t >= 1) {
    clearMask(incoming);
    return;
  }
  const p = (1 - t) * 50;
  const blur = Math.max(0.5, p * 0.08);
  applyMask(incoming, svgMask(`<rect x="${p}" y="${p}" width="${100 - 2 * p}" height="${100 - 2 * p}" fill="white" filter="url(#b)"/>`, blur));
}
function flyEffect(dir) {
  return (t, outgoing, incoming) => {
    outgoing.style.zIndex = "1";
    outgoing.style.transform = `${sideToTranslate(dir, t)} scale(${1 - t * 0.5})`;
    outgoing.style.opacity = `${1 - t}`;
    incoming.style.opacity = `${t}`;
  };
}
function circleEffect(t, _outgoing, incoming) {
  if (t >= 1) {
    incoming.style.maskImage = "";
    incoming.style.setProperty("-webkit-mask-image", "");
    return;
  }
  if (t <= 0) {
    const mask2 = "radial-gradient(circle at 50% 50%, #000 0%, transparent 0%)";
    incoming.style.maskImage = mask2;
    incoming.style.setProperty("-webkit-mask-image", mask2);
    return;
  }
  const r = t * 100;
  const edge = Math.max(1, r * 0.15);
  const inner = Math.max(0, r - edge);
  const mask = `radial-gradient(circle at 50% 50%, #000 ${inner}%, transparent ${r + 0.5}%)`;
  incoming.style.maskImage = mask;
  incoming.style.setProperty("-webkit-mask-image", mask);
}
function diamondEffect(t, _outgoing, incoming) {
  if (t >= 1) {
    clearMask(incoming);
    return;
  }
  const p = t * 100;
  const blur = Math.max(0.5, p * 0.08);
  applyMask(incoming, diamondMaskSvg(p, blur));
}
function svgMask(shapeContent, blur) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` + shapeContent + `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
function applyMask(el, mask) {
  el.style.maskImage = mask;
  el.style.maskSize = "100% 100%";
  el.style.setProperty("-webkit-mask-image", mask);
  el.style.setProperty("-webkit-mask-size", "100% 100%");
}
function clearMask(el) {
  el.style.maskImage = "";
  el.style.setProperty("-webkit-mask-image", "");
}
function diamondMaskSvg(p, blur) {
  return svgMask(`<polygon points="50,${50 - p} ${50 + p},50 50,${50 + p} ${50 - p},50" fill="white" filter="url(#b)"/>`, blur);
}
function plusEffect(t, _outgoing, incoming) {
  if (t >= 1) {
    clearMask(incoming);
    return;
  }
  const p = t * 50;
  const blur = Math.max(0.5, p * 0.08);
  applyMask(incoming, plusMaskSvg(p, blur));
}
function plusMaskSvg(p, blur) {
  const E = 50;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs><polygon points="${50 - p},${-E} ${50 + p},${-E} ${50 + p},${50 - p} ${100 + E},${50 - p} ${100 + E},${50 + p} ${50 + p},${50 + p} ${50 + p},${100 + E} ${50 - p},${100 + E} ${50 - p},${50 + p} ${-E},${50 + p} ${-E},${50 - p} ${50 - p},${50 - p}" fill="white" filter="url(#b)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
function newsflashEffect(t, _outgoing, incoming) {
  if (t >= 1) {
    incoming.style.transform = "";
    incoming.style.opacity = "";
    return;
  }
  const scale = Math.max(0.01, t);
  const deg = -t * 360;
  incoming.style.transform = `scale(${scale}) rotate(${deg}deg)`;
  incoming.style.transformOrigin = "50% 50%";
  incoming.style.opacity = String(t);
}
function stripsEffect(dir) {
  const E = 50;
  return (t, _outgoing, incoming) => {
    if (t >= 1) {
      clearMask(incoming);
      return;
    }
    if (t <= 0) {
      applyMask(incoming, svgMask(`<polygon points="0,0 0,0 0,0" fill="white" filter="url(#b)"/>`, 0));
      return;
    }
    const d = t * 200;
    const blur = Math.max(0.5, t * 50 * 0.08);
    let points;
    if (d <= 100) {
      switch (dir) {
        case "rightDown":
          points = `${-E},${-E} ${d},${-E} ${d},0 0,${d} ${-E},${d}`;
          break;
        case "leftDown":
          points = `${100 + E},${-E} ${100 - d},${-E} ${100 - d},0 100,${d} ${100 + E},${d}`;
          break;
        case "rightUp":
          points = `${-E},${100 + E} ${d},${100 + E} ${d},100 0,${100 - d} ${-E},${100 - d}`;
          break;
        case "leftUp":
          points = `${100 + E},${100 + E} ${100 - d},${100 + E} ${100 - d},100 100,${100 - d} ${100 + E},${100 - d}`;
          break;
      }
    } else {
      const e = d - 100;
      switch (dir) {
        case "rightDown":
          points = `${-E},${-E} ${100 + E},${-E} ${100 + E},${e} ${e},${100 + E} ${-E},${100 + E}`;
          break;
        case "leftDown":
          points = `${100 + E},${-E} ${-E},${-E} ${-E},${e} ${100 - e},${100 + E} ${100 + E},${100 + E}`;
          break;
        case "rightUp":
          points = `${-E},${100 + E} ${100 + E},${100 + E} ${100 + E},${100 - e} ${e},${-E} ${-E},${-E}`;
          break;
        case "leftUp":
          points = `${100 + E},${100 + E} ${-E},${100 + E} ${-E},${100 - e} ${100 - e},${-E} ${100 + E},${-E}`;
          break;
      }
    }
    applyMask(incoming, svgMask(`<polygon points="${points}" fill="white" filter="url(#b)"/>`, blur));
  };
}
var BLIND_STRIPS = 14;
function blindsEffect(orientation) {
  const N = BLIND_STRIPS;
  const isH = orientation === "horizontal";
  let setup = null;
  return (t, outgoing, incoming) => {
    if (t >= 1) {
      incoming.style.opacity = "";
      incoming.style.clipPath = "none";
      return;
    }
    if (!setup) {
      setup = setupBlinds3D(outgoing, incoming, N, isH);
    }
    if (!setup || setup.flippers.length === 0) {
      outgoing.style.zIndex = "1";
      outgoing.style.opacity = `${1 - t}`;
      return;
    }
    const hd = setup.halfDepth;
    const stagger = 0.7;
    const center = (N - 1) / 2;
    for (let i = 0; i < setup.flippers.length; i++) {
      const dist = Math.abs(i - center) / center;
      const delay = dist * stagger;
      const stripT = Math.max(0, Math.min(1, (t - delay) / (1 - stagger)));
      const angle = stripT * 90;
      setup.flippers[i].style.transform = isH ? `translateZ(-${hd}px) rotateX(${angle}deg)` : `translateZ(-${hd}px) rotateY(-${angle}deg)`;
    }
  };
}
function setupBlinds3D(outgoing, incoming, N, isH) {
  const outCanvas = outgoing.querySelector("canvas");
  const inCanvas = incoming.querySelector(".udoc-spread__canvas") ?? incoming.querySelector("canvas");
  if (!outCanvas || !inCanvas || outCanvas.width === 0 || inCanvas.width === 0) {
    return { flippers: [], halfDepth: 0 };
  }
  const dpr = window.devicePixelRatio || 1;
  const slideW = outCanvas.width / dpr;
  const slideH = outCanvas.height / dpr;
  const d = isH ? slideH / N : slideW / N;
  outgoing.innerHTML = "";
  outgoing.style.overflow = "visible";
  outgoing.style.zIndex = "1";
  incoming.style.opacity = "0";
  const backdrop = document.createElement("div");
  backdrop.style.position = "absolute";
  backdrop.style.left = "0";
  backdrop.style.top = "0";
  backdrop.style.width = `${slideW}px`;
  backdrop.style.height = `${slideH}px`;
  backdrop.style.background = "#000";
  outgoing.appendChild(backdrop);
  const scene = document.createElement("div");
  scene.style.position = "absolute";
  scene.style.left = "0";
  scene.style.top = "0";
  scene.style.width = `${slideW}px`;
  scene.style.height = `${slideH}px`;
  scene.style.perspective = `${(isH ? slideH : slideW) * 2}px`;
  scene.style.transformStyle = "preserve-3d";
  outgoing.appendChild(scene);
  const flippers = [];
  for (let i = 0; i < N; i++) {
    const flipper = document.createElement("div");
    flipper.style.position = "absolute";
    flipper.style.transformStyle = "preserve-3d";
    const pad = 0.5;
    if (isH) {
      flipper.style.left = "0";
      flipper.style.top = `${i * d - pad}px`;
      flipper.style.width = `${slideW}px`;
      flipper.style.height = `${d + pad * 2}px`;
    } else {
      flipper.style.top = "0";
      flipper.style.left = `${i * d - pad}px`;
      flipper.style.width = `${d + pad * 2}px`;
      flipper.style.height = `${slideH}px`;
    }
    const front = createBlindFace(outCanvas, i, N, isH, pad);
    front.style.backfaceVisibility = "hidden";
    front.style.transform = `translateZ(${d / 2}px)`;
    const bottom = createBlindFace(inCanvas, i, N, isH, pad);
    bottom.style.backfaceVisibility = "hidden";
    bottom.style.transform = isH ? `rotateX(-90deg) translateZ(${d / 2}px)` : `rotateY(90deg) translateZ(${d / 2}px)`;
    flipper.appendChild(front);
    flipper.appendChild(bottom);
    scene.appendChild(flipper);
    flippers.push(flipper);
  }
  return { flippers, halfDepth: d / 2 };
}
function createBlindFace(source, index, total, isHorizontal, pad) {
  const dpr = window.devicePixelRatio || 1;
  const padPx = Math.ceil(pad * dpr);
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  if (isHorizontal) {
    const stripTop = Math.round(index * source.height / total);
    const stripBot = Math.round((index + 1) * source.height / total);
    const sy = Math.max(0, stripTop - padPx);
    const syEnd = Math.min(source.height, stripBot + padPx);
    const sh = syEnd - sy;
    canvas.width = source.width;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (ctx)
      ctx.drawImage(source, 0, sy, source.width, sh, 0, 0, source.width, sh);
  } else {
    const stripLeft = Math.round(index * source.width / total);
    const stripRight = Math.round((index + 1) * source.width / total);
    const sx = Math.max(0, stripLeft - padPx);
    const sxEnd = Math.min(source.width, stripRight + padPx);
    const sw = sxEnd - sx;
    canvas.width = sw;
    canvas.height = source.height;
    const ctx = canvas.getContext("2d");
    if (ctx)
      ctx.drawImage(source, sx, 0, sw, source.height, 0, 0, sw, source.height);
  }
  return canvas;
}
function combEffect(orientation) {
  const N = BLIND_STRIPS;
  return (t, _outgoing, incoming) => {
    if (t >= 1) {
      incoming.style.clipPath = "none";
      return;
    }
    const points = [];
    if (orientation === "horizontal") {
      const stripH = 100 / N;
      for (let i = 0; i < N; i++) {
        const top = i * stripH;
        const bot = (i + 1) * stripH;
        points.push("0% 0%");
        if (i % 2 === 0) {
          const r = t * 100;
          points.push(`0% ${top}%`, `${r}% ${top}%`, `${r}% ${bot}%`, `0% ${bot}%`, `0% ${top}%`);
        } else {
          const l = (1 - t) * 100;
          points.push(`${l}% ${top}%`, `100% ${top}%`, `100% ${bot}%`, `${l}% ${bot}%`, `${l}% ${top}%`);
        }
        points.push("0% 0%");
      }
    } else {
      const stripW = 100 / N;
      for (let i = 0; i < N; i++) {
        const left = i * stripW;
        const right = (i + 1) * stripW;
        points.push("0% 0%");
        if (i % 2 === 0) {
          const b = t * 100;
          points.push(`${left}% 0%`, `${right}% 0%`, `${right}% ${b}%`, `${left}% ${b}%`, `${left}% 0%`);
        } else {
          const tp = (1 - t) * 100;
          points.push(`${left}% ${tp}%`, `${right}% ${tp}%`, `${right}% 100%`, `${left}% 100%`, `${left}% ${tp}%`);
        }
        points.push("0% 0%");
      }
    }
    incoming.style.clipPath = `polygon(${points.join(", ")})`;
  };
}
var ARC_STEPS = 12;
var SWEEP_RADIUS = 75;
function wheelSweepEffect(spokes, clockwise) {
  const n = Math.max(1, spokes);
  const dir = clockwise ? 1 : -1;
  return (t, _outgoing, incoming) => {
    if (t >= 1) {
      clearMask(incoming);
      return;
    }
    if (t <= 0) {
      applyMask(incoming, svgMask(`<polygon points="50,50 50,50 50,50" fill="white" filter="url(#b)"/>`, 0));
      return;
    }
    const blur = Math.max(0.1, t * 50 * 0.01);
    const sectorAngle = 360 / n;
    const sweep = t * sectorAngle;
    let path = "";
    for (let s = 0; s < n; s++) {
      const startDeg = -90 + s * sectorAngle;
      path += "M50,50 ";
      for (let j = 0; j <= ARC_STEPS; j++) {
        const deg = startDeg + dir * (j / ARC_STEPS) * sweep;
        const rad = deg * Math.PI / 180;
        path += `L${50 + SWEEP_RADIUS * Math.cos(rad)},${50 + SWEEP_RADIUS * Math.sin(rad)} `;
      }
      path += "Z ";
    }
    applyMask(incoming, svgMask(`<path d="${path}" fill="white" filter="url(#b)"/>`, blur));
  };
}
function wedgeEffect(t, _outgoing, incoming) {
  if (t >= 1) {
    clearMask(incoming);
    return;
  }
  if (t <= 0) {
    applyMask(incoming, svgMask(`<polygon points="50,50 50,50 50,50" fill="white" filter="url(#b)"/>`, 0));
    return;
  }
  const blur = Math.max(0.3, t * 50 * 0.06);
  const sweep = t * 180;
  let path = "M50,50 ";
  for (let j = ARC_STEPS; j >= 0; j--) {
    const deg = -90 - j / ARC_STEPS * sweep;
    const rad = deg * Math.PI / 180;
    path += `L${50 + SWEEP_RADIUS * Math.cos(rad)},${50 + SWEEP_RADIUS * Math.sin(rad)} `;
  }
  for (let j = 0; j <= ARC_STEPS; j++) {
    const deg = -90 + j / ARC_STEPS * sweep;
    const rad = deg * Math.PI / 180;
    path += `L${50 + SWEEP_RADIUS * Math.cos(rad)},${50 + SWEEP_RADIUS * Math.sin(rad)} `;
  }
  path += "Z";
  applyMask(incoming, svgMask(`<path d="${path}" fill="white" filter="url(#b)"/>`, blur));
}
var CHECKER_COLS = 8;
var CHECKER_ROWS = 6;
function checkerEffect(orientation) {
  const isH = orientation === "horizontal";
  const cols = CHECKER_COLS;
  const rows = CHECKER_ROWS;
  let setup = null;
  const sweepLen = (isH ? cols : rows) + 1;
  const flipDur = 3;
  const totalLen = sweepLen + flipDur;
  return (t, outgoing, incoming) => {
    if (t >= 1) {
      incoming.style.opacity = "";
      incoming.style.clipPath = "none";
      return;
    }
    if (!setup) {
      setup = setupChecker3D(outgoing, incoming, cols, rows, isH);
    }
    const sweep = t * totalLen;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const pos = isH ? c : r;
        const phase = (r + c) % 2;
        const cellStart = pos + phase;
        const cellT = Math.max(0, Math.min(1, (sweep - cellStart) / flipDur));
        const angle = cellT * 180;
        setup.flippers[idx].style.transform = isH ? `rotateY(-${angle}deg)` : `rotateX(${angle}deg)`;
      }
    }
  };
}
function setupChecker3D(outgoing, incoming, cols, rows, isH) {
  const outCanvas = outgoing.querySelector("canvas");
  const inCanvas = incoming.querySelector(".udoc-spread__canvas") ?? incoming.querySelector("canvas");
  if (!outCanvas || !inCanvas || outCanvas.width === 0 || inCanvas.width === 0) {
    return { flippers: [] };
  }
  const dpr = window.devicePixelRatio || 1;
  const slideW = outCanvas.width / dpr;
  const slideH = outCanvas.height / dpr;
  const tileW = slideW / cols;
  const tileH = slideH / rows;
  outgoing.innerHTML = "";
  outgoing.style.overflow = "visible";
  outgoing.style.zIndex = "1";
  incoming.style.opacity = "0";
  const backdrop = document.createElement("div");
  backdrop.style.position = "absolute";
  backdrop.style.left = "0";
  backdrop.style.top = "0";
  backdrop.style.width = `${slideW}px`;
  backdrop.style.height = `${slideH}px`;
  backdrop.style.background = "#000";
  outgoing.appendChild(backdrop);
  const scene = document.createElement("div");
  scene.style.position = "absolute";
  scene.style.left = "0";
  scene.style.top = "0";
  scene.style.width = `${slideW}px`;
  scene.style.height = `${slideH}px`;
  scene.style.perspective = `${Math.max(slideW, slideH) * 2}px`;
  scene.style.transformStyle = "preserve-3d";
  outgoing.appendChild(scene);
  const flippers = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const flipper = document.createElement("div");
      flipper.style.position = "absolute";
      flipper.style.transformStyle = "preserve-3d";
      const pad = 0.5;
      flipper.style.left = `${c * tileW - pad}px`;
      flipper.style.top = `${r * tileH - pad}px`;
      flipper.style.width = `${tileW + pad * 2}px`;
      flipper.style.height = `${tileH + pad * 2}px`;
      const front = createCheckerFace(outCanvas, c, r, cols, rows, pad);
      front.style.backfaceVisibility = "hidden";
      const back = createCheckerFace(inCanvas, c, r, cols, rows, pad);
      back.style.backfaceVisibility = "hidden";
      back.style.transform = isH ? "rotateY(-180deg)" : "rotateX(180deg)";
      flipper.appendChild(front);
      flipper.appendChild(back);
      scene.appendChild(flipper);
      flippers.push(flipper);
    }
  }
  return { flippers };
}
function createCheckerFace(source, col, row, cols, rows, pad) {
  const dpr = window.devicePixelRatio || 1;
  const padPx = Math.ceil(pad * dpr);
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  const tileLeft = Math.round(col * source.width / cols);
  const tileRight = Math.round((col + 1) * source.width / cols);
  const tileTop = Math.round(row * source.height / rows);
  const tileBot = Math.round((row + 1) * source.height / rows);
  const sx = Math.max(0, tileLeft - padPx);
  const sxEnd = Math.min(source.width, tileRight + padPx);
  const sy = Math.max(0, tileTop - padPx);
  const syEnd = Math.min(source.height, tileBot + padPx);
  const sw = sxEnd - sx;
  const sh = syEnd - sy;
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  if (ctx)
    ctx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas;
}
var VORTEX_COLS2 = 40;
var VORTEX_ROWS2 = 22;
function vortexEffect(dir) {
  let setup = null;
  const isH = dir === "left" || dir === "right";
  const rotSign = dir === "right" || dir === "up" ? 1 : -1;
  return (t, outgoing, incoming) => {
    if (t >= 1) {
      incoming.style.opacity = "";
      incoming.style.clipPath = "none";
      return;
    }
    if (!setup) {
      setup = setupVortex(outgoing, incoming, VORTEX_COLS2, VORTEX_ROWS2, dir);
    }
    if (!setup) {
      outgoing.style.zIndex = "1";
      outgoing.style.opacity = `${1 - t}`;
      return;
    }
    const { outTiles, inTiles, tileData } = setup;
    for (let i = 0; i < tileData.length; i++) {
      const { dx, dy, outStagger, inStagger, zSign, zRand, driftRand } = tileData[i];
      const outLocalT = vortexClamp01((t - outStagger * 0.4) / 0.55);
      const outDeg = rotSign * outLocalT * 180;
      const outZ = zSign * Math.sin(outLocalT * Math.PI) * 200 * zRand;
      const outDrift = Math.sin(outLocalT * Math.PI) * (isH ? dy * 0.5 : dx * 0.5) * driftRand;
      outTiles[i].style.transform = isH ? `translate3d(${dx}px,${outDrift}px,${outZ}px) rotateY(${outDeg}deg) translateX(${-dx}px)` : `translate3d(${outDrift}px,${dy}px,${outZ}px) rotateX(${outDeg}deg) translateY(${-dy}px)`;
      const inLocalT = vortexClamp01((t - 0.1 - inStagger * 0.4) / 0.55);
      if (inLocalT >= 1) {
        inTiles[i].style.transform = "none";
      } else {
        const inDeg = rotSign * (-180 + inLocalT * 180);
        const inZ = zSign * Math.sin(inLocalT * Math.PI) * 200 * zRand;
        const inDrift = Math.sin(inLocalT * Math.PI) * (isH ? dy * 0.5 : dx * 0.5) * driftRand;
        inTiles[i].style.transform = isH ? `translate3d(${dx}px,${inDrift}px,${inZ}px) rotateY(${inDeg}deg) translateX(${-dx}px)` : `translate3d(${inDrift}px,${dy}px,${inZ}px) rotateX(${inDeg}deg) translateY(${-dy}px)`;
      }
    }
  };
}
function vortexClamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function setupVortex(outgoing, incoming, cols, rows, dir) {
  const outCanvas = outgoing.querySelector("canvas");
  const inCanvas = incoming.querySelector(".udoc-spread__canvas") ?? incoming.querySelector("canvas");
  if (!outCanvas || !inCanvas || outCanvas.width === 0 || inCanvas.width === 0) {
    return null;
  }
  const dpr = window.devicePixelRatio || 1;
  const slideW = outCanvas.width / dpr;
  const slideH = outCanvas.height / dpr;
  const tileW = slideW / cols;
  const tileH = slideH / rows;
  const cx = slideW / 2;
  const cy = slideH / 2;
  const isH = dir === "left" || dir === "right";
  const rotSign = dir === "right" || dir === "up" ? 1 : -1;
  outgoing.innerHTML = "";
  outgoing.style.overflow = "visible";
  outgoing.style.zIndex = "1";
  incoming.style.opacity = "0";
  const backdrop = document.createElement("div");
  backdrop.style.position = "absolute";
  backdrop.style.left = "0";
  backdrop.style.top = "0";
  backdrop.style.width = `${slideW}px`;
  backdrop.style.height = `${slideH}px`;
  backdrop.style.background = "#000";
  outgoing.appendChild(backdrop);
  const scene = document.createElement("div");
  scene.style.position = "absolute";
  scene.style.left = "0";
  scene.style.top = "0";
  scene.style.width = `${slideW}px`;
  scene.style.height = `${slideH}px`;
  scene.style.perspective = `${Math.max(slideW, slideH) * 2}px`;
  scene.style.transformStyle = "preserve-3d";
  outgoing.appendChild(scene);
  const outTiles = [];
  const inTiles = [];
  const tileData = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileX = (c + 0.5) * tileW;
      const tileY = (r + 0.5) * tileH;
      const dx = cx - tileX;
      const dy = cy - tileY;
      const colN = c / Math.max(1, cols - 1);
      const rowN = r / Math.max(1, rows - 1);
      let outSt;
      let inSt;
      switch (dir) {
        case "right":
          outSt = colN * 0.7 + rowN * 0.3;
          inSt = (1 - colN) * 0.7 + (1 - rowN) * 0.3;
          break;
        case "left":
          outSt = (1 - colN) * 0.7 + rowN * 0.3;
          inSt = colN * 0.7 + (1 - rowN) * 0.3;
          break;
        case "down":
          outSt = rowN * 0.7 + colN * 0.3;
          inSt = (1 - rowN) * 0.7 + (1 - colN) * 0.3;
          break;
        case "up":
          outSt = (1 - rowN) * 0.7 + colN * 0.3;
          inSt = rowN * 0.7 + (1 - colN) * 0.3;
          break;
      }
      const jitter = (Math.random() - 0.5) * 0.15;
      tileData.push({
        dx,
        dy,
        outStagger: Math.max(0, Math.min(1, outSt + jitter)),
        inStagger: Math.max(0, Math.min(1, inSt + jitter)),
        zSign: Math.random() < 0.5 ? -1 : 1,
        // half toward camera, half away
        zRand: 0.5 + Math.random(),
        driftRand: 0.3 + Math.random() * 1.4
      });
      const outTile = createCheckerFace(outCanvas, c, r, cols, rows, 0);
      outTile.style.left = `${c * tileW}px`;
      outTile.style.top = `${r * tileH}px`;
      outTile.style.width = `${tileW}px`;
      outTile.style.height = `${tileH}px`;
      outTile.style.backfaceVisibility = "hidden";
      outTile.style.setProperty("-webkit-backface-visibility", "hidden");
      scene.appendChild(outTile);
      outTiles.push(outTile);
      const inTile = createCheckerFace(inCanvas, c, r, cols, rows, 0);
      inTile.style.left = `${c * tileW}px`;
      inTile.style.top = `${r * tileH}px`;
      inTile.style.width = `${tileW}px`;
      inTile.style.height = `${tileH}px`;
      inTile.style.backfaceVisibility = "hidden";
      inTile.style.setProperty("-webkit-backface-visibility", "hidden");
      const initDeg = rotSign * -180;
      inTile.style.transform = isH ? `translate3d(${dx}px,0px,0px) rotateY(${initDeg}deg) translateX(${-dx}px)` : `translate3d(0px,${dy}px,0px) rotateX(${initDeg}deg) translateY(${-dy}px)`;
      scene.appendChild(inTile);
      inTiles.push(inTile);
    }
  }
  return { outTiles, inTiles, tileData };
}
var DISSOLVE_COLS = 60;
var DISSOLVE_ROWS = 40;
function dissolveEffect() {
  const total = DISSOLVE_COLS * DISSOLVE_ROWS;
  const order = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return (t, _outgoing, incoming) => {
    if (t >= 1) {
      incoming.style.clipPath = "none";
      return;
    }
    const revealed = Math.ceil(t * total);
    if (revealed <= 0) {
      incoming.style.clipPath = "polygon(0% 0%, 0% 0%, 0% 0%)";
      return;
    }
    const cellW = 100 / DISSOLVE_COLS;
    const cellH = 100 / DISSOLVE_ROWS;
    const points = [];
    for (let k = 0; k < revealed; k++) {
      const idx = order[k];
      const c = idx % DISSOLVE_COLS;
      const r = Math.floor(idx / DISSOLVE_COLS);
      const left = c * cellW;
      const top = r * cellH;
      points.push("0% 0%", `${left}% ${top}%`, `${left + cellW}% ${top}%`, `${left + cellW}% ${top + cellH}%`, `${left}% ${top + cellH}%`, `${left}% ${top}%`, "0% 0%");
    }
    incoming.style.clipPath = `polygon(${points.join(", ")})`;
  };
}
var RANDOM_BAR_COUNT = 10;
function randomBarEffect(orientation) {
  const N = RANDOM_BAR_COUNT;
  const order = Array.from({ length: N }, (_, i) => i);
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return (t, _outgoing, incoming) => {
    if (t >= 1) {
      incoming.style.clipPath = "none";
      return;
    }
    const progress = t * N;
    const revealed = Math.floor(progress);
    const partial = progress - revealed;
    const points = [];
    for (let k = 0; k <= revealed && k < N; k++) {
      const barIndex = order[k];
      const barT = k < revealed ? 1 : partial;
      if (barT <= 0)
        continue;
      if (orientation === "horizontal") {
        const stripH = 100 / N;
        const top = barIndex * stripH;
        const right = barT * 100;
        points.push(`0% ${top}%`, `${right}% ${top}%`, `${right}% ${top + stripH}%`, `0% ${top + stripH}%`, `0% ${top}%`);
      } else {
        const stripW = 100 / N;
        const left = barIndex * stripW;
        const bot = barT * 100;
        points.push(`${left}% 0%`, `${left + stripW}% 0%`, `${left + stripW}% ${bot}%`, `${left}% ${bot}%`, `${left}% 0%`);
      }
    }
    if (points.length === 0) {
      incoming.style.clipPath = "polygon(0% 0%, 0% 0%, 0% 0%)";
    } else {
      incoming.style.clipPath = `polygon(${points.join(", ")})`;
    }
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/tools/ViewToolController.js
var CURSOR_CLASSES = {
  pointer: "",
  hand: "udoc-viewer--tool-hand",
  zoom: "udoc-viewer--tool-zoom"
};
var HAND_GRABBING_CLASS = "udoc-viewer--tool-hand-grabbing";
function createViewToolController(options) {
  const { scrollArea, viewerRoot, store } = options;
  let currentTool = "pointer";
  let cleanupFn = null;
  function attachHandTool() {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;
    const onPointerDown = (e) => {
      if (e.button !== 0)
        return;
      const target = e.target;
      if (target.closest("a, button, input, [role=button]"))
        return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = scrollArea.scrollLeft;
      startScrollTop = scrollArea.scrollTop;
      viewerRoot.classList.add(HAND_GRABBING_CLASS);
      scrollArea.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const onPointerMove = (e) => {
      if (!isDragging)
        return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      scrollArea.scrollLeft = startScrollLeft - dx;
      scrollArea.scrollTop = startScrollTop - dy;
    };
    const onPointerUp = (e) => {
      if (!isDragging)
        return;
      isDragging = false;
      viewerRoot.classList.remove(HAND_GRABBING_CLASS);
      scrollArea.releasePointerCapture(e.pointerId);
    };
    scrollArea.addEventListener("pointerdown", onPointerDown);
    scrollArea.addEventListener("pointermove", onPointerMove);
    scrollArea.addEventListener("pointerup", onPointerUp);
    scrollArea.addEventListener("pointercancel", onPointerUp);
    return () => {
      scrollArea.removeEventListener("pointerdown", onPointerDown);
      scrollArea.removeEventListener("pointermove", onPointerMove);
      scrollArea.removeEventListener("pointerup", onPointerUp);
      scrollArea.removeEventListener("pointercancel", onPointerUp);
      viewerRoot.classList.remove(HAND_GRABBING_CLASS);
    };
  }
  function attachZoomTool() {
    const ZOOM_OUT_CLASS = "udoc-viewer--tool-zoom-out";
    const updateZoomCursor = (e) => {
      const out = e.altKey || e.shiftKey;
      viewerRoot.classList.toggle(ZOOM_OUT_CLASS, out);
    };
    const onKeyDown = (e) => updateZoomCursor(e);
    const onKeyUp = (e) => updateZoomCursor(e);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    const onClick = (e) => {
      const target = e.target;
      if (target.closest("a, button, input, [role=button]"))
        return;
      const rect = scrollArea.getBoundingClientRect();
      const viewX = (e.clientX - rect.left) / rect.width;
      const viewY = (e.clientY - rect.top) / rect.height;
      const anchor = {
        viewX,
        viewY,
        scrollLeft: scrollArea.scrollLeft,
        scrollTop: scrollArea.scrollTop,
        scrollWidth: scrollArea.scrollWidth,
        scrollHeight: scrollArea.scrollHeight
      };
      if (e.altKey || e.shiftKey) {
        store.dispatch({ type: "ZOOM_OUT", anchor });
      } else {
        store.dispatch({ type: "ZOOM_IN", anchor });
      }
    };
    scrollArea.addEventListener("click", onClick);
    return () => {
      scrollArea.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      viewerRoot.classList.remove(ZOOM_OUT_CLASS);
    };
  }
  function setCursorClass(tool) {
    for (const cls2 of Object.values(CURSOR_CLASSES)) {
      if (cls2)
        viewerRoot.classList.remove(cls2);
    }
    viewerRoot.classList.remove(HAND_GRABBING_CLASS);
    const cls = CURSOR_CLASSES[tool];
    if (cls)
      viewerRoot.classList.add(cls);
  }
  function switchTool(tool) {
    if (tool === currentTool)
      return;
    if (cleanupFn) {
      cleanupFn();
      cleanupFn = null;
    }
    currentTool = tool;
    setCursorClass(tool);
    switch (tool) {
      case "hand":
        cleanupFn = attachHandTool();
        break;
      case "zoom":
        cleanupFn = attachZoomTool();
        break;
    }
  }
  let prevKind = store.getState().activeTool.kind;
  const unsub = store.subscribeRender((_prev, next) => {
    const kind = next.activeTool.kind;
    if (kind !== prevKind) {
      prevKind = kind;
      if (kind === "pointer" || kind === "hand" || kind === "zoom") {
        switchTool(kind);
      } else {
        switchTool("pointer");
      }
    }
  });
  const initialKind = store.getState().activeTool.kind;
  if (initialKind === "hand" || initialKind === "zoom") {
    switchTool(initialKind);
  }
  function destroy() {
    unsub();
    if (cleanupFn) {
      cleanupFn();
      cleanupFn = null;
    }
    setCursorClass("pointer");
  }
  return { destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/tools/AnnotationDrawController.js
function normalizeRotation3(rotation) {
  const v = ((rotation ?? 0) % 360 + 360) % 360;
  if (v === 90 || v === 180 || v === 270)
    return v;
  return 0;
}
var DRAW_CURSOR_CLASS = "udoc-viewer--tool-draw";
function boundingRect(points) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX)
      minX = p.x;
    if (p.y < minY)
      minY = p.y;
    if (p.x > maxX)
      maxX = p.x;
    if (p.y > maxY)
      maxY = p.y;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
function createAnnotationDrawController(options) {
  const { scrollArea, viewerRoot, store } = options;
  let previewLayer = null;
  let isDrawing = false;
  let drawPageIndex = -1;
  let drawSlot = null;
  let drawAnnotationLayer = null;
  let drawScale = 1;
  let drawRotation = 0;
  let drawPageWidthPx = 0;
  let drawPageHeightPx = 0;
  let drawSubTool = null;
  let drawOptions = { ...DEFAULT_TOOL_OPTIONS };
  let inkPoints = [];
  let startPt = { x: 0, y: 0 };
  let endPt = { x: 0, y: 0 };
  let polygonVertices = [];
  function clientToPageCoords(e) {
    if (!drawSlot)
      return null;
    const rect = drawSlot.getBoundingClientRect();
    const px2 = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const rel = invertPageRotation(px2 - rect.width / 2, py - rect.height / 2, drawRotation);
    return {
      x: (rel.x + drawPageWidthPx / 2) / drawScale,
      y: (rel.y + drawPageHeightPx / 2) / drawScale
    };
  }
  function buildCurrentAnnotation() {
    const color = parseHexColor(drawOptions.strokeColor);
    const opacity = drawOptions.opacity;
    const borderWidth = drawOptions.strokeWidth;
    const borderStyle = toBorderStyle(drawOptions.lineStyle);
    if (drawSubTool === "freehand" && inkPoints.length >= 2) {
      return {
        type: "ink",
        bounds: boundingRect(inkPoints),
        inkList: [inkPoints],
        color,
        borderWidth,
        borderStyle,
        opacity
      };
    }
    if ((drawSubTool === "line" || drawSubTool === "arrow") && (startPt.x !== endPt.x || startPt.y !== endPt.y)) {
      return {
        type: "line",
        bounds: boundingRect([startPt, endPt]),
        start: startPt,
        end: endPt,
        startEnding: drawSubTool === "arrow" ? toLineEnding(drawOptions.arrowHeadStart) : "None",
        endEnding: drawSubTool === "arrow" ? toLineEnding(drawOptions.arrowHeadEnd) : "None",
        color,
        borderWidth,
        borderStyle,
        opacity
      };
    }
    if (drawSubTool === "rectangle" && startPt.x !== endPt.x && startPt.y !== endPt.y) {
      const x = Math.min(startPt.x, endPt.x);
      const y = Math.min(startPt.y, endPt.y);
      return {
        type: "square",
        bounds: { x, y, width: Math.abs(endPt.x - startPt.x), height: Math.abs(endPt.y - startPt.y) },
        color,
        interiorColor: drawOptions.fillColor ? parseHexColor(drawOptions.fillColor) : void 0,
        borderWidth,
        borderStyle,
        opacity
      };
    }
    if (drawSubTool === "ellipse" && startPt.x !== endPt.x && startPt.y !== endPt.y) {
      const x = Math.min(startPt.x, endPt.x);
      const y = Math.min(startPt.y, endPt.y);
      return {
        type: "circle",
        bounds: { x, y, width: Math.abs(endPt.x - startPt.x), height: Math.abs(endPt.y - startPt.y) },
        color,
        interiorColor: drawOptions.fillColor ? parseHexColor(drawOptions.fillColor) : void 0,
        borderWidth,
        borderStyle,
        opacity
      };
    }
    if (drawSubTool === "polygon" || drawSubTool === "polyline") {
      const verts = isDrawing ? [...polygonVertices, endPt] : polygonVertices;
      if (verts.length >= 2) {
        if (drawSubTool === "polygon") {
          return {
            type: "polygon",
            bounds: boundingRect(verts),
            vertices: verts,
            color,
            interiorColor: drawOptions.fillColor ? parseHexColor(drawOptions.fillColor) : void 0,
            borderWidth,
            borderStyle,
            startEnding: "None",
            endEnding: "None",
            opacity
          };
        } else {
          return {
            type: "polyLine",
            bounds: boundingRect(verts),
            vertices: verts,
            color,
            borderWidth,
            borderStyle,
            startEnding: "None",
            endEnding: "None",
            opacity
          };
        }
      }
    }
    return null;
  }
  function createPreviewLayer() {
    if (!drawAnnotationLayer)
      return;
    previewLayer = document.createElement("div");
    previewLayer.style.position = "absolute";
    previewLayer.style.inset = "0";
    previewLayer.style.pointerEvents = "none";
    previewLayer.style.zIndex = "10";
    previewLayer.className = "udoc-annotation-draw-preview";
    drawAnnotationLayer.appendChild(previewLayer);
  }
  function updatePreview() {
    if (!previewLayer)
      return;
    previewLayer.innerHTML = "";
    const annotation = buildCurrentAnnotation();
    if (annotation) {
      renderAnnotation(previewLayer, annotation, drawScale);
    }
  }
  function removePreview() {
    if (previewLayer) {
      previewLayer.remove();
      previewLayer = null;
    }
  }
  function finishDrawing() {
    if (!isDrawing)
      return;
    const minVerts = drawSubTool === "polygon" ? 3 : 2;
    if ((drawSubTool === "polygon" || drawSubTool === "polyline") && polygonVertices.length < minVerts) {
      isDrawing = false;
      removePreview();
      polygonVertices = [];
      return;
    }
    isDrawing = false;
    const annotation = buildCurrentAnnotation();
    if (annotation && drawPageIndex >= 0) {
      store.dispatch({ type: "ADD_ANNOTATION", pageIndex: drawPageIndex, annotation });
    }
    removePreview();
    inkPoints = [];
    polygonVertices = [];
  }
  function beginDrawOnSlot(e) {
    const state = store.getState();
    const at = state.activeTool;
    if (at.kind !== "annotate")
      return null;
    const tool = at.sub;
    const target = e.target;
    const slotEl = target.closest("[data-page]");
    if (!slotEl)
      return null;
    const pageNum = parseInt(slotEl.dataset.page, 10);
    if (isNaN(pageNum))
      return null;
    drawPageIndex = pageNum - 1;
    drawSlot = slotEl;
    drawAnnotationLayer = slotEl.querySelector(".udoc-spread__annotation-layer");
    drawSubTool = tool;
    drawOptions = state.toolOptions[tool] ?? { ...DEFAULT_TOOL_OPTIONS };
    const pointsToPixels = getPointsToPixels(state.dpi);
    const zoom = state.effectiveZoom ?? state.zoom;
    drawScale = pointsToPixels * zoom;
    const pageInfo = state.pageInfos[drawPageIndex];
    const documentRotation = normalizeRotation3(pageInfo?.rotation);
    const userRotation = normalizeRotation3(state.pageRotation);
    drawRotation = normalizeRotation3(documentRotation + userRotation);
    drawPageWidthPx = (pageInfo?.width ?? 0) * drawScale;
    drawPageHeightPx = (pageInfo?.height ?? 0) * drawScale;
    return clientToPageCoords(e);
  }
  function onPointerDown(e) {
    if (e.button !== 0)
      return;
    if (isDrawing && (drawSubTool === "polygon" || drawSubTool === "polyline"))
      return;
    const state = store.getState();
    const sub = state.activeTool.kind === "annotate" ? state.activeTool.sub : null;
    if (sub === "polygon" || sub === "polyline")
      return;
    const pt = beginDrawOnSlot(e);
    if (!pt)
      return;
    isDrawing = true;
    startPt = pt;
    endPt = pt;
    inkPoints = [pt];
    createPreviewLayer();
    scrollArea.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onPointerMove(e) {
    if (!isDrawing)
      return;
    const pt = clientToPageCoords(e);
    if (!pt)
      return;
    endPt = pt;
    if (drawSubTool === "freehand") {
      inkPoints.push(pt);
    }
    updatePreview();
  }
  function onPointerUp(e) {
    if (!isDrawing)
      return;
    if (drawSubTool === "polygon" || drawSubTool === "polyline")
      return;
    scrollArea.releasePointerCapture(e.pointerId);
    finishDrawing();
  }
  function onPointerCancel(e) {
    if (!isDrawing)
      return;
    scrollArea.releasePointerCapture(e.pointerId);
    isDrawing = false;
    removePreview();
    inkPoints = [];
    polygonVertices = [];
  }
  function onClick(e) {
    if (e.button !== 0)
      return;
    const state = store.getState();
    const sub = state.activeTool.kind === "annotate" ? state.activeTool.sub : null;
    if (sub !== "polygon" && sub !== "polyline")
      return;
    if (!isDrawing) {
      const pt = beginDrawOnSlot(e);
      if (!pt)
        return;
      isDrawing = true;
      polygonVertices = [pt];
      endPt = pt;
      createPreviewLayer();
      e.preventDefault();
    } else {
      const pt = clientToPageCoords(e);
      if (!pt)
        return;
      polygonVertices.push(pt);
      endPt = pt;
      updatePreview();
      e.preventDefault();
    }
  }
  function onDblClick(e) {
    if (!isDrawing || drawSubTool !== "polygon" && drawSubTool !== "polyline")
      return;
    e.preventDefault();
    finishDrawing();
  }
  let active = false;
  function activate() {
    if (active)
      return;
    active = true;
    viewerRoot.classList.add(DRAW_CURSOR_CLASS);
    scrollArea.addEventListener("pointerdown", onPointerDown);
    scrollArea.addEventListener("pointermove", onPointerMove);
    scrollArea.addEventListener("pointerup", onPointerUp);
    scrollArea.addEventListener("pointercancel", onPointerCancel);
    scrollArea.addEventListener("click", onClick);
    scrollArea.addEventListener("dblclick", onDblClick);
  }
  function deactivate() {
    if (!active)
      return;
    active = false;
    viewerRoot.classList.remove(DRAW_CURSOR_CLASS);
    scrollArea.removeEventListener("pointerdown", onPointerDown);
    scrollArea.removeEventListener("pointermove", onPointerMove);
    scrollArea.removeEventListener("pointerup", onPointerUp);
    scrollArea.removeEventListener("pointercancel", onPointerCancel);
    scrollArea.removeEventListener("click", onClick);
    scrollArea.removeEventListener("dblclick", onDblClick);
    if (isDrawing) {
      finishDrawing();
    }
  }
  function canDraw(s) {
    const at = s.activeTool;
    return s.documentFormat !== null && ANNOTATION_FORMATS.has(s.documentFormat) && at.kind === "annotate" && at.sub !== "select";
  }
  function annotateSub(s) {
    return s.activeTool.kind === "annotate" ? s.activeTool.sub : null;
  }
  const unsub = store.subscribeRender((prev, next) => {
    if (canDraw(next)) {
      if (isDrawing && annotateSub(prev) !== annotateSub(next)) {
        finishDrawing();
      }
      activate();
    } else {
      deactivate();
    }
  });
  const onFinishDrawing = () => {
    if (isDrawing)
      finishDrawing();
  };
  document.addEventListener("udoc-finish-drawing", onFinishDrawing);
  if (canDraw(store.getState())) {
    activate();
  }
  function destroy() {
    unsub();
    document.removeEventListener("udoc-finish-drawing", onFinishDrawing);
    deactivate();
  }
  return { destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/tools/AnnotationSelectController.js
function normalizeRotation4(rotation) {
  const v = ((rotation ?? 0) % 360 + 360) % 360;
  if (v === 90 || v === 180 || v === 270)
    return v;
  return 0;
}
var SELECT_CURSOR_CLASS = "udoc-viewer--tool-select";
var MOVING_CLASS = "udoc-viewer--annotation-moving";
var RESIZING_CLASS = "udoc-viewer--annotation-resizing";
var BBOX_CLASS = "udoc-annotation-select-bbox";
var HANDLE_POSITIONS = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
var HANDLE_CURSORS = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize"
};
function createAnnotationSelectController(options) {
  const { scrollArea, viewerRoot, store } = options;
  let active = false;
  let bboxEl = null;
  let innerEl = null;
  let isDragging = false;
  let dragMode = "move";
  let dragScale = 1;
  let dragRotation = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragDx = 0;
  let dragDy = 0;
  let dragAnnotationPageIndex = -1;
  let dragAnnotationIndex = -1;
  let dragOriginalBounds = { x: 0, y: 0, width: 0, height: 0 };
  let dragHandle = "se";
  function removeBbox() {
    if (bboxEl) {
      bboxEl.remove();
      bboxEl = null;
      innerEl = null;
    }
  }
  function updateSelectionVisual() {
    removeBbox();
    const state = store.getState();
    const sel = state.selectedAnnotation;
    if (!sel)
      return;
    const annotations = state.pageAnnotations.get(sel.pageIndex);
    if (!annotations || sel.annotationIndex >= annotations.length)
      return;
    const annotation = annotations[sel.annotationIndex];
    const bounds = annotation.bounds;
    if (!bounds || bounds.width === 0 && bounds.height === 0)
      return;
    const pageNum = sel.pageIndex + 1;
    const slot = scrollArea.querySelector(`[data-page="${pageNum}"]`);
    if (!slot)
      return;
    const annotationLayer = slot.querySelector(".udoc-spread__annotation-layer");
    if (!annotationLayer)
      return;
    const pointsToPixels = getPointsToPixels(state.dpi);
    const zoom = state.effectiveZoom ?? state.zoom;
    const scale = pointsToPixels * zoom;
    bboxEl = document.createElement("div");
    bboxEl.className = BBOX_CLASS;
    bboxEl.style.position = "absolute";
    bboxEl.style.width = annotationLayer.style.width;
    bboxEl.style.height = annotationLayer.style.height;
    bboxEl.style.left = annotationLayer.style.left;
    bboxEl.style.top = annotationLayer.style.top;
    bboxEl.style.transform = annotationLayer.style.transform;
    bboxEl.style.transformOrigin = "center";
    innerEl = document.createElement("div");
    innerEl.className = BBOX_CLASS + "__inner";
    innerEl.style.position = "absolute";
    innerEl.style.left = `${bounds.x * scale}px`;
    innerEl.style.top = `${bounds.y * scale}px`;
    innerEl.style.width = `${bounds.width * scale}px`;
    innerEl.style.height = `${bounds.height * scale}px`;
    for (const pos of HANDLE_POSITIONS) {
      const handle = document.createElement("div");
      handle.className = `${BBOX_CLASS}__handle ${BBOX_CLASS}__handle--${pos}`;
      handle.style.cursor = HANDLE_CURSORS[pos];
      handle.dataset.handle = pos;
      innerEl.appendChild(handle);
    }
    bboxEl.appendChild(innerEl);
    slot.appendChild(bboxEl);
  }
  function updateInnerPreview(bounds, newBounds) {
    if (!innerEl)
      return;
    innerEl.style.left = `${newBounds.x * dragScale}px`;
    innerEl.style.top = `${newBounds.y * dragScale}px`;
    innerEl.style.width = `${newBounds.width * dragScale}px`;
    innerEl.style.height = `${newBounds.height * dragScale}px`;
  }
  function computeResizedBounds(original, handle, dx, dy) {
    let { x, y, width, height } = original;
    if (handle.includes("w")) {
      x += dx;
      width -= dx;
    }
    if (handle.includes("e") || handle === "e") {
      width += dx;
    }
    if (handle === "nw" || handle === "n" || handle === "ne") {
      y += dy;
      height -= dy;
    }
    if (handle === "sw" || handle === "s" || handle === "se") {
      height += dy;
    }
    const MIN = 2;
    if (width < MIN) {
      x = x + width - MIN;
      width = MIN;
    }
    if (height < MIN) {
      y = y + height - MIN;
      height = MIN;
    }
    return { x, y, width, height };
  }
  function onPointerDown(e) {
    if (e.button !== 0)
      return;
    const target = e.target;
    const handleEl = target.closest(`[data-handle]`);
    if (handleEl && bboxEl?.contains(handleEl)) {
      const sel = store.getState().selectedAnnotation;
      if (sel) {
        const slotEl = bboxEl.closest("[data-page]");
        if (slotEl) {
          startDrag(e, sel.pageIndex, sel.annotationIndex, "resize", handleEl.dataset.handle);
          return;
        }
      }
    }
    const annotationEl = target.closest("[data-annotation-index]");
    if (annotationEl) {
      const slotEl = annotationEl.closest("[data-page]");
      if (!slotEl)
        return;
      const pageNum = parseInt(slotEl.dataset.page, 10);
      if (isNaN(pageNum))
        return;
      const annotationIndex = parseInt(annotationEl.getAttribute("data-annotation-index"), 10);
      if (isNaN(annotationIndex))
        return;
      const pageIndex = pageNum - 1;
      const sel = store.getState().selectedAnnotation;
      if (sel && sel.pageIndex === pageIndex && sel.annotationIndex === annotationIndex) {
        startDrag(e, pageIndex, annotationIndex, "move");
        return;
      }
      store.dispatch({ type: "SELECT_ANNOTATION", pageIndex, annotationIndex });
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (innerEl && (target === innerEl || innerEl.contains(target))) {
      const sel = store.getState().selectedAnnotation;
      if (sel) {
        startDrag(e, sel.pageIndex, sel.annotationIndex, "move");
        return;
      }
    }
    store.dispatch({ type: "DESELECT_ANNOTATION" });
  }
  function startDrag(e, pageIndex, annotationIndex, mode, handle) {
    const state = store.getState();
    const pointsToPixels = getPointsToPixels(state.dpi);
    const zoom = state.effectiveZoom ?? state.zoom;
    const annotations = state.pageAnnotations.get(pageIndex);
    if (!annotations || annotationIndex >= annotations.length)
      return;
    isDragging = true;
    dragMode = mode;
    dragScale = pointsToPixels * zoom;
    const pageInfo = state.pageInfos[pageIndex];
    const documentRotation = normalizeRotation4(pageInfo?.rotation);
    const userRotation = normalizeRotation4(state.pageRotation);
    dragRotation = normalizeRotation4(documentRotation + userRotation);
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragDx = 0;
    dragDy = 0;
    dragAnnotationPageIndex = pageIndex;
    dragAnnotationIndex = annotationIndex;
    dragOriginalBounds = { ...annotations[annotationIndex].bounds };
    dragHandle = handle ?? "se";
    viewerRoot.classList.add(mode === "move" ? MOVING_CLASS : RESIZING_CLASS);
    if (mode === "resize") {
      viewerRoot.style.cursor = HANDLE_CURSORS[dragHandle];
    }
    scrollArea.setPointerCapture(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  }
  function onPointerMove(e) {
    if (!isDragging)
      return;
    const rotated = invertPageRotation(e.clientX - dragStartX, e.clientY - dragStartY, dragRotation);
    dragDx = rotated.x / dragScale;
    dragDy = rotated.y / dragScale;
    if (dragMode === "move") {
      if (innerEl) {
        const b = dragOriginalBounds;
        updateInnerPreview(b, { x: b.x + dragDx, y: b.y + dragDy, width: b.width, height: b.height });
      }
    } else {
      const newBounds = computeResizedBounds(dragOriginalBounds, dragHandle, dragDx, dragDy);
      updateInnerPreview(dragOriginalBounds, newBounds);
    }
  }
  function onPointerUp(e) {
    if (!isDragging)
      return;
    scrollArea.releasePointerCapture(e.pointerId);
    viewerRoot.classList.remove(MOVING_CLASS);
    viewerRoot.classList.remove(RESIZING_CLASS);
    viewerRoot.style.cursor = "";
    isDragging = false;
    if (Math.abs(dragDx) < 0.5 && Math.abs(dragDy) < 0.5) {
      updateSelectionVisual();
      return;
    }
    const state = store.getState();
    const annotations = state.pageAnnotations.get(dragAnnotationPageIndex);
    if (!annotations || dragAnnotationIndex >= annotations.length)
      return;
    const original = annotations[dragAnnotationIndex];
    let updated;
    if (dragMode === "move") {
      updated = offsetAnnotation(original, dragDx, dragDy);
    } else {
      const newBounds = computeResizedBounds(dragOriginalBounds, dragHandle, dragDx, dragDy);
      updated = resizeAnnotation(original, newBounds);
    }
    store.dispatch({
      type: "UPDATE_ANNOTATION",
      pageIndex: dragAnnotationPageIndex,
      annotationIndex: dragAnnotationIndex,
      annotation: updated
    });
  }
  function onPointerCancel(e) {
    if (!isDragging)
      return;
    scrollArea.releasePointerCapture(e.pointerId);
    viewerRoot.classList.remove(MOVING_CLASS);
    viewerRoot.classList.remove(RESIZING_CLASS);
    viewerRoot.style.cursor = "";
    isDragging = false;
    updateSelectionVisual();
  }
  function onKeyDown(e) {
    if (e.key !== "Delete" && e.key !== "Backspace")
      return;
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")
      return;
    const sel = store.getState().selectedAnnotation;
    if (!sel)
      return;
    store.dispatch({ type: "REMOVE_ANNOTATION", pageIndex: sel.pageIndex, annotationIndex: sel.annotationIndex });
    e.preventDefault();
  }
  function activate() {
    if (active)
      return;
    active = true;
    viewerRoot.classList.add(SELECT_CURSOR_CLASS);
    scrollArea.addEventListener("pointerdown", onPointerDown);
    scrollArea.addEventListener("pointermove", onPointerMove);
    scrollArea.addEventListener("pointerup", onPointerUp);
    scrollArea.addEventListener("pointercancel", onPointerCancel);
    document.addEventListener("keydown", onKeyDown);
  }
  function deactivate() {
    if (!active)
      return;
    active = false;
    viewerRoot.classList.remove(SELECT_CURSOR_CLASS);
    viewerRoot.classList.remove(MOVING_CLASS);
    viewerRoot.classList.remove(RESIZING_CLASS);
    viewerRoot.style.cursor = "";
    scrollArea.removeEventListener("pointerdown", onPointerDown);
    scrollArea.removeEventListener("pointermove", onPointerMove);
    scrollArea.removeEventListener("pointerup", onPointerUp);
    scrollArea.removeEventListener("pointercancel", onPointerCancel);
    document.removeEventListener("keydown", onKeyDown);
    removeBbox();
    isDragging = false;
  }
  function isSelectMode(s) {
    const at = s.activeTool;
    return s.documentFormat !== null && ANNOTATION_FORMATS.has(s.documentFormat) && (at.kind === "annotate" || at.kind === "markup") && at.sub === "select";
  }
  const unsub = store.subscribeRender((_prev, next) => {
    if (isSelectMode(next)) {
      activate();
      if (!isDragging) {
        updateSelectionVisual();
      }
    } else {
      deactivate();
    }
  });
  if (isSelectMode(store.getState())) {
    activate();
  }
  function destroy() {
    unsub();
    deactivate();
  }
  return { destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/Viewport.js
function viewportSliceEqual(a, b) {
  return a.docId === b.docId && a.page === b.page && a.pageCount === b.pageCount && a.pageInfos === b.pageInfos && a.pageGroups === b.pageGroups && a.activeGroupIndex === b.activeGroupIndex && a.viewMode === b.viewMode && a.scrollMode === b.scrollMode && a.layoutMode === b.layoutMode && a.zoomMode === b.zoomMode && a.zoom === b.zoom && a.dpi === b.dpi && a.pageRotation === b.pageRotation && a.spacingMode === b.spacingMode && a.pageSpacing === b.pageSpacing && a.spreadSpacing === b.spreadSpacing && a.pageAnnotations === b.pageAnnotations && a.highlightedAnnotation === b.highlightedAnnotation && a.pageText === b.pageText && a.zoomAnchor === b.zoomAnchor;
}
var cachedScrollbarSize = null;
var RENDER_BUFFER = 2;
function parsePixel(value) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
function readInsets(style) {
  return {
    top: parsePixel(style.paddingTop),
    right: parsePixel(style.paddingRight),
    bottom: parsePixel(style.paddingBottom),
    left: parsePixel(style.paddingLeft)
  };
}
function addInsets(a, b) {
  return {
    top: a.top + b.top,
    right: a.right + b.right,
    bottom: a.bottom + b.bottom,
    left: a.left + b.left
  };
}
function readViewportMetrics(scrollArea, container) {
  const scrollStyle = getComputedStyle(scrollArea);
  const containerStyle = getComputedStyle(container);
  const padding = addInsets(readInsets(scrollStyle), readInsets(containerStyle));
  const width = scrollArea.clientWidth;
  const height = scrollArea.clientHeight;
  const innerWidth = Math.max(0, width - padding.left - padding.right);
  const innerHeight = Math.max(0, height - padding.top - padding.bottom);
  return {
    width,
    height,
    innerWidth,
    innerHeight,
    padding
  };
}
function metricsEqual(a, b) {
  const epsilon = 1;
  return Math.abs(a.width - b.width) <= epsilon && Math.abs(a.height - b.height) <= epsilon && Math.abs(a.innerWidth - b.innerWidth) <= epsilon && Math.abs(a.innerHeight - b.innerHeight) <= epsilon && a.padding.top === b.padding.top && a.padding.right === b.padding.right && a.padding.bottom === b.padding.bottom && a.padding.left === b.padding.left;
}
function resolveOverflowState(prev, delta, threshold) {
  if (prev === null)
    return delta > threshold;
  if (prev)
    return delta >= -threshold;
  return delta > threshold;
}
function clamp2(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function computePrerenderScale(pageInfos, currentPage, zoom, pointsToPixels, dpr) {
  let minEffDpr = dpr;
  const range = 2;
  for (let offset = -range; offset <= range; offset++) {
    const p = pageInfos[currentPage - 1 + offset];
    if (!p)
      continue;
    const cssW = p.width * pointsToPixels * zoom;
    const cssH = p.height * pointsToPixels * zoom;
    const eff = getEffectiveDpr(cssW, cssH, dpr);
    if (eff < minEffDpr)
      minEffDpr = eff;
  }
  return pointsToPixels * zoom * minEffDpr;
}
function getCenteredOffset(containerSize, contentSize) {
  const dpr = getDevicePixelRatio();
  const containerDevice = toDevicePixels(containerSize, dpr);
  const contentDevice = toDevicePixels(contentSize, dpr);
  const offsetDevice = Math.max(0, Math.floor((containerDevice - contentDevice) / 2));
  return toCssPixels(offsetDevice, dpr);
}
function getScrollbarSize() {
  if (cachedScrollbarSize)
    return cachedScrollbarSize;
  if (!document.body) {
    cachedScrollbarSize = { width: 0, height: 0 };
    return cachedScrollbarSize;
  }
  const probe = document.createElement("div");
  probe.style.width = "100px";
  probe.style.height = "100px";
  probe.style.overflow = "scroll";
  probe.style.position = "absolute";
  probe.style.top = "-9999px";
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  const height = probe.offsetHeight - probe.clientHeight;
  probe.remove();
  cachedScrollbarSize = { width, height };
  return cachedScrollbarSize;
}
function computeScale(slice, metrics, spreads, scrollbarVisible) {
  if (slice.zoomMode === "custom")
    return slice.zoom;
  if (metrics.innerWidth <= 0 || metrics.innerHeight <= 0)
    return slice.zoom;
  if (spreads.length === 0)
    return slice.zoom;
  let maxWidth = 0;
  let maxHeight = 0;
  for (const spread of spreads) {
    const dims = getSpreadDimensions(spread, slice.pageInfos, 1, slice.pageSpacing, slice.dpi, slice.pageRotation);
    maxWidth = Math.max(maxWidth, dims.width);
    maxHeight = Math.max(maxHeight, dims.height);
  }
  if (maxWidth <= 0 || maxHeight <= 0)
    return slice.zoom;
  const snappedSpacing = snapToDevice(slice.spreadSpacing);
  const snappedViewportHeight = snapToDevice(metrics.innerHeight);
  const scrollbar = getScrollbarSize();
  const baseViewportWidth = scrollbarVisible ? snapToDevice(metrics.innerWidth + scrollbar.width) : snapToDevice(metrics.innerWidth);
  const verticalSpacing = snappedSpacing * 2;
  const targetHeight = Math.max(0, snappedViewportHeight - verticalSpacing + 1);
  switch (slice.zoomMode) {
    case "fit-spread-width-max":
    case "fit-spread-width": {
      const fullWidthScale = baseViewportWidth / maxWidth;
      let needsScrollbar;
      if (slice.scrollMode === "continuous") {
        let totalHeight = 0;
        for (const spread of spreads) {
          const dims = getSpreadDimensions(spread, slice.pageInfos, fullWidthScale, slice.pageSpacing, slice.dpi, slice.pageRotation);
          totalHeight += dims.height;
        }
        totalHeight += snappedSpacing * (spreads.length + 1);
        needsScrollbar = totalHeight > snappedViewportHeight;
      } else {
        const scaledMaxHeight = maxHeight * fullWidthScale;
        needsScrollbar = scaledMaxHeight + verticalSpacing > snappedViewportHeight;
      }
      let scale;
      if (needsScrollbar && scrollbar.width > 0) {
        const adjustedWidth = baseViewportWidth - scrollbar.width;
        scale = adjustedWidth / maxWidth;
      } else {
        scale = fullWidthScale;
      }
      return slice.zoomMode === "fit-spread-width-max" ? Math.min(scale, 1) : scale;
    }
    case "fit-spread-height":
      return targetHeight / maxHeight;
    case "fit-spread":
      return Math.min(baseViewportWidth / maxWidth, targetHeight / maxHeight);
    default:
      return slice.zoom;
  }
}
function buildLayout(slice, metrics, scrollbarVisible) {
  const spreads = calculateSpreads(slice.pageCount, slice.layoutMode);
  const scale = computeScale(slice, metrics, spreads, scrollbarVisible);
  if (slice.viewMode === "continuous") {
    const activeGroup = slice.pageGroups[slice.activeGroupIndex] ?? null;
    const contLayout = calculateContinuousLayout(spreads, slice.pageInfos, scale, slice.dpi, slice.pageRotation, activeGroup);
    return {
      spreads,
      layouts: contLayout.layouts,
      contentWidth: contLayout.contentWidth,
      contentHeight: contLayout.contentHeight,
      scale,
      continuousLayout: contLayout
    };
  }
  const layout = calculateSpreadLayouts(spreads, slice.pageInfos, scale, slice.pageSpacing, slice.spreadSpacing, slice.dpi, slice.pageRotation);
  return {
    spreads,
    layouts: layout.layouts,
    contentWidth: layout.contentWidth,
    contentHeight: layout.contentHeight,
    scale,
    continuousLayout: null
  };
}
function computeViewportUpdate(prevSlice, nextSlice, prevMetrics, nextMetrics) {
  const metricsChanged = !prevMetrics || !metricsEqual(prevMetrics, nextMetrics);
  const layoutChanged = !prevSlice || nextSlice.docId !== prevSlice.docId || nextSlice.pageCount !== prevSlice.pageCount || nextSlice.pageInfos !== prevSlice.pageInfos || nextSlice.pageGroups !== prevSlice.pageGroups || nextSlice.activeGroupIndex !== prevSlice.activeGroupIndex || nextSlice.viewMode !== prevSlice.viewMode || nextSlice.scrollMode !== prevSlice.scrollMode || nextSlice.layoutMode !== prevSlice.layoutMode || nextSlice.zoomMode !== prevSlice.zoomMode || nextSlice.zoom !== prevSlice.zoom || nextSlice.dpi !== prevSlice.dpi || nextSlice.pageRotation !== prevSlice.pageRotation || nextSlice.pageSpacing !== prevSlice.pageSpacing || nextSlice.spreadSpacing !== prevSlice.spreadSpacing || metricsChanged;
  const zoomModeChanged = !prevSlice || nextSlice.zoomMode !== prevSlice.zoomMode;
  const spreadsChanged = !prevSlice || nextSlice.docId !== prevSlice.docId || nextSlice.pageCount !== prevSlice.pageCount || nextSlice.pageInfos !== prevSlice.pageInfos || nextSlice.pageGroups !== prevSlice.pageGroups || nextSlice.activeGroupIndex !== prevSlice.activeGroupIndex || nextSlice.viewMode !== prevSlice.viewMode || nextSlice.layoutMode !== prevSlice.layoutMode;
  const shouldClearSpreads = layoutChanged && spreadsChanged;
  const shouldScrollToPage = spreadsChanged || zoomModeChanged;
  const shouldRestorePosition = layoutChanged && !spreadsChanged && !zoomModeChanged;
  return {
    layoutChanged,
    shouldClearSpreads,
    shouldRestorePosition,
    shouldScrollToPage
  };
}
function createViewport(showAttribution = true, customPageOverlay) {
  const el = document.createElement("div");
  el.className = "udoc-viewport";
  el.setAttribute("role", "document");
  el.setAttribute("aria-label", "Document content");
  el.setAttribute("tabindex", "0");
  const contentArea = document.createElement("div");
  contentArea.className = "udoc-viewport__content";
  el.appendChild(contentArea);
  const scrollArea = document.createElement("div");
  scrollArea.className = "udoc-viewport__scroll";
  contentArea.appendChild(scrollArea);
  const container = document.createElement("div");
  container.className = "udoc-viewport__container";
  scrollArea.appendChild(container);
  let branding = null;
  if (showAttribution) {
    branding = createBranding({ variant: "viewport-corner" });
    contentArea.appendChild(branding.el);
  }
  const floatingToolbar = createFloatingToolbar();
  let viewToolController = null;
  let annotationDrawController = null;
  let annotationSelectController = null;
  let workerClient = null;
  let storeRef = null;
  let i18nRef = null;
  let unsubRender = null;
  let unsubScroll = null;
  let unsubNavigation = null;
  let unsubSearch = null;
  let currentSearchMatches = [];
  let currentSearchActiveIndex = -1;
  let resizeObserver = null;
  let currentSlice = null;
  let lastSlice = null;
  let lastMetrics = null;
  let layoutState = null;
  const spreadComponents = /* @__PURE__ */ new Map();
  let layoutDirty = false;
  let lastVisibleRange = { start: 0, end: -1 };
  let lastEmittedViewport = null;
  let onViewportChangeCb = null;
  let onAnnotationHoverCb = null;
  let onAnnotationClickCb = null;
  let lastHoveredAnnotation = null;
  let containerSize = { width: 0, height: 0 };
  let lastOverflowX = null;
  let lastOverflowY = null;
  let viewportTopPosition = null;
  let navigationPage = null;
  let navigationScrollTop = null;
  let updateRaf = 0;
  let scrollRaf = 0;
  let renderDebounceTimer = 0;
  let rendersPaused = false;
  let resumeRenderAfterResize = false;
  const RENDER_DEBOUNCE_MS = 50;
  const unsubEvents = [];
  let activeTransition = null;
  let transitionOverlay = null;
  let transitionShadow = null;
  let previousSpreadIndex = null;
  function mount(parent, store, wc, i18n, onViewportChange, onAnnotationHover, onAnnotationClick) {
    parent.appendChild(el);
    branding?.start();
    workerClient = wc;
    storeRef = store;
    i18nRef = i18n ?? null;
    onViewportChangeCb = onViewportChange ?? null;
    onAnnotationHoverCb = onAnnotationHover ?? null;
    onAnnotationClickCb = onAnnotationClick ?? null;
    if (i18n) {
      el.setAttribute("aria-label", i18n.t("viewport.documentContent"));
    }
    floatingToolbar.mount(el, store, i18n);
    currentSlice = selectViewport(store.getState());
    scheduleUpdate();
    unsubRender = subscribeSelector(store, selectViewport, (slice) => {
      currentSlice = slice;
      scheduleUpdate();
    }, {
      equality: viewportSliceEqual
    });
    currentSearchMatches = store.getState().searchMatches;
    currentSearchActiveIndex = store.getState().searchActiveIndex;
    unsubSearch = store.subscribeRender((_prev, next) => {
      if (next.searchMatches === currentSearchMatches && next.searchActiveIndex === currentSearchActiveIndex)
        return;
      currentSearchMatches = next.searchMatches;
      currentSearchActiveIndex = next.searchActiveIndex;
      updateVisibleSearchHighlights();
    });
    unsubEvents.push(wc.onRenderInvalidated(() => {
      for (const spread of spreadComponents.values()) {
        spread.resetRenderKeys();
      }
      if (currentSlice && lastMetrics && layoutState) {
        layoutDirty = true;
        if (currentSlice.scrollMode === "continuous") {
          updateVisibleSpreads(currentSlice, lastMetrics, layoutState);
        } else {
          showSingleSpread(currentSlice, lastMetrics, layoutState);
        }
      }
    }));
    unsubScroll = on(scrollArea, "scroll", () => {
      if (!currentSlice || !layoutState)
        return;
      if (scrollRaf)
        return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        if (!currentSlice || !layoutState || !lastMetrics)
          return;
        if (currentSlice.scrollMode === "continuous") {
          updateVisibleSpreads(currentSlice, lastMetrics, layoutState);
        }
        updateViewportTopPosition(currentSlice, layoutState);
        fireViewportChangeIfChanged();
      });
    });
    const handleResize = () => {
      const isOngoingResize = renderDebounceTimer !== 0;
      if (isOngoingResize) {
        rendersPaused = true;
        resumeRenderAfterResize = true;
      }
      if (renderDebounceTimer) {
        clearTimeout(renderDebounceTimer);
      }
      renderDebounceTimer = window.setTimeout(() => {
        renderDebounceTimer = 0;
        if (resumeRenderAfterResize) {
          resumeRenderAfterResize = false;
          rendersPaused = false;
          scheduleUpdate();
        }
      }, RENDER_DEBOUNCE_MS);
      scheduleUpdate();
    };
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(scrollArea);
    }
    window.addEventListener("resize", handleResize);
    unsubEvents.push(() => window.removeEventListener("resize", handleResize));
    const handleAnnotationClick = (e) => {
      const target = e.target;
      const annotationEl = target.closest("[data-annotation-index]");
      if (annotationEl && onAnnotationClickCb && storeRef) {
        const slotEl = annotationEl.closest("[data-page]");
        const pageNum = slotEl ? parseInt(slotEl.dataset.page, 10) : NaN;
        const annotationIndex = parseInt(annotationEl.getAttribute("data-annotation-index"), 10);
        if (!isNaN(pageNum) && !isNaN(annotationIndex)) {
          const pageIndex = pageNum - 1;
          const annotation = storeRef.getState().pageAnnotations.get(pageIndex)?.[annotationIndex];
          if (annotation) {
            onAnnotationClickCb({ pageIndex, annotation, clientX: e.clientX, clientY: e.clientY });
          }
        }
      }
      const textEl = target.closest(".udoc-annotation--text");
      if (textEl) {
        e.stopPropagation();
        const annotationData = textEl.dataset.annotation;
        if (annotationData) {
          try {
            const annotation = JSON.parse(annotationData);
            showAnnotationPopup(annotation, textEl, container);
          } catch {
          }
        }
        return;
      }
      const linkEl = target.closest(".udoc-annotation--link");
      if (linkEl) {
        const actionData = linkEl.getAttribute("data-action");
        if (!actionData)
          return;
        try {
          const action = JSON.parse(actionData);
          if (action.actionType === "goTo" && action.destination) {
            store.dispatch({
              type: "NAVIGATE_TO_DESTINATION",
              destination: action.destination
            });
          } else if (action.actionType === "uri" && action.uri) {
            window.open(action.uri, "_blank", "noopener");
          }
        } catch {
        }
        return;
      }
      closeAnnotationPopup();
    };
    container.addEventListener("click", handleAnnotationClick);
    unsubEvents.push(() => container.removeEventListener("click", handleAnnotationClick));
    const emitHover = (next, coords) => {
      const last = lastHoveredAnnotation;
      if (last === next || last !== null && next !== null && last.pageIndex === next.pageIndex && last.annotationIndex === next.annotationIndex) {
        return;
      }
      lastHoveredAnnotation = next;
      if (!onAnnotationHoverCb || !storeRef)
        return;
      if (next === null) {
        onAnnotationHoverCb(null);
        return;
      }
      const annotations = storeRef.getState().pageAnnotations.get(next.pageIndex);
      const annotation = annotations?.[next.annotationIndex];
      if (!annotation || !coords)
        return;
      onAnnotationHoverCb({
        pageIndex: next.pageIndex,
        annotation,
        clientX: coords.clientX,
        clientY: coords.clientY
      });
    };
    const handleAnnotationPointerMove = (e) => {
      const target = e.target;
      const annotationEl = target?.closest("[data-annotation-index]");
      if (!annotationEl) {
        emitHover(null, null);
        return;
      }
      const slotEl = annotationEl.closest("[data-page]");
      const pageNum = slotEl ? parseInt(slotEl.dataset.page, 10) : NaN;
      const annotationIndex = parseInt(annotationEl.getAttribute("data-annotation-index"), 10);
      if (isNaN(pageNum) || isNaN(annotationIndex)) {
        emitHover(null, null);
        return;
      }
      emitHover({ pageIndex: pageNum - 1, annotationIndex }, { clientX: e.clientX, clientY: e.clientY });
    };
    const handleAnnotationPointerLeave = () => emitHover(null, null);
    container.addEventListener("pointermove", handleAnnotationPointerMove);
    container.addEventListener("pointerleave", handleAnnotationPointerLeave);
    unsubEvents.push(() => container.removeEventListener("pointermove", handleAnnotationPointerMove));
    unsubEvents.push(() => container.removeEventListener("pointerleave", handleAnnotationPointerLeave));
    let wheelCooldown = false;
    const handleWheel = (e) => {
      if (!currentSlice || currentSlice.scrollMode !== "spread")
        return;
      if (!layoutState || layoutState.spreads.length === 0)
        return;
      e.preventDefault();
      if (wheelCooldown)
        return;
      wheelCooldown = true;
      setTimeout(() => {
        wheelCooldown = false;
      }, 150);
      const currentSpreadIndex = findSpreadForPage(layoutState.spreads, currentSlice.page);
      if (e.deltaY > 0) {
        const nextSpreadIndex = Math.min(currentSpreadIndex + 1, layoutState.spreads.length - 1);
        if (nextSpreadIndex !== currentSpreadIndex) {
          const nextPage = getSpreadPrimaryPage(layoutState.spreads[nextSpreadIndex]);
          store.dispatch({ type: "SET_PAGE", page: nextPage });
        }
      } else if (e.deltaY < 0) {
        const prevSpreadIndex = Math.max(currentSpreadIndex - 1, 0);
        if (prevSpreadIndex !== currentSpreadIndex) {
          const prevPage = getSpreadPrimaryPage(layoutState.spreads[prevSpreadIndex]);
          store.dispatch({ type: "SET_PAGE", page: prevPage });
        }
      }
    };
    scrollArea.addEventListener("wheel", handleWheel, { passive: false });
    unsubEvents.push(() => scrollArea.removeEventListener("wheel", handleWheel));
    const viewerRoot = el.closest(".udoc-viewer-root");
    if (viewerRoot) {
      viewToolController = createViewToolController({
        scrollArea,
        viewerRoot,
        store
      });
      annotationDrawController = createAnnotationDrawController({
        scrollArea,
        viewerRoot,
        store
      });
      annotationSelectController = createAnnotationSelectController({
        scrollArea,
        viewerRoot,
        store
      });
    }
    unsubNavigation = store.subscribeEffect((prev, next) => {
      if (prev.navigationTarget === next.navigationTarget)
        return;
      if (next.navigationTarget === null)
        return;
      const target = next.navigationTarget;
      if (target.zoom !== void 0 && target.zoom !== next.zoom) {
        store.dispatch({ type: "SET_ZOOM", zoom: target.zoom });
      }
      if (next.scrollMode === "continuous") {
        navigationPage = target.page;
        scrollToTarget(target);
        navigationScrollTop = scrollArea.scrollTop;
      }
      store.dispatch({ type: "SET_PAGE", page: target.page });
      store.dispatch({ type: "CLEAR_NAVIGATION_TARGET" });
    });
  }
  function fireViewportChangeIfChanged() {
    if (!onViewportChangeCb || !currentSlice || !layoutState)
      return;
    if (lastVisibleRange.start > lastVisibleRange.end)
      return;
    let firstPage = Number.POSITIVE_INFINITY;
    let lastPage = Number.NEGATIVE_INFINITY;
    for (let i = lastVisibleRange.start; i <= lastVisibleRange.end; i++) {
      const layout = layoutState.layouts[i];
      if (!layout)
        continue;
      const spread = layoutState.spreads[layout.index];
      if (!spread)
        continue;
      for (const slot of spread.slots) {
        if (slot == null)
          continue;
        const pageIndex = slot - 1;
        if (pageIndex < firstPage)
          firstPage = pageIndex;
        if (pageIndex > lastPage)
          lastPage = pageIndex;
      }
    }
    if (firstPage === Number.POSITIVE_INFINITY)
      return;
    const payload = {
      firstVisiblePage: firstPage,
      lastVisiblePage: lastPage,
      zoom: currentSlice.zoom,
      scrollTop: scrollArea.scrollTop
    };
    const last = lastEmittedViewport;
    if (last !== null && last.firstVisiblePage === payload.firstVisiblePage && last.lastVisiblePage === payload.lastVisiblePage && last.zoom === payload.zoom && last.scrollTop === payload.scrollTop) {
      return;
    }
    lastEmittedViewport = payload;
    onViewportChangeCb(payload);
  }
  function updateVisibleSearchHighlights() {
    if (!currentSlice || !layoutState)
      return;
    const layoutOptions = {
      pageInfos: currentSlice.pageInfos,
      scale: layoutState.scale,
      dpi: currentSlice.dpi,
      rotation: currentSlice.pageRotation,
      pageSpacing: currentSlice.pageSpacing
    };
    for (let i = lastVisibleRange.start; i <= lastVisibleRange.end; i++) {
      const spreadComp = spreadComponents.get(i);
      if (spreadComp) {
        spreadComp.updateSearchHighlights(currentSearchMatches, currentSearchActiveIndex, layoutOptions);
      }
    }
  }
  function scheduleUpdate() {
    if (!currentSlice)
      return;
    if (updateRaf)
      return;
    updateRaf = requestAnimationFrame(() => {
      updateRaf = 0;
      if (!currentSlice)
        return;
      applyState(currentSlice);
    });
  }
  function applyState(slice) {
    const sidePadding = slice.viewMode === "continuous" ? 0 : slice.pageSpacing;
    scrollArea.style.paddingLeft = `${sidePadding}px`;
    scrollArea.style.paddingRight = `${sidePadding}px`;
    el.classList.toggle("udoc-viewport--seamless", slice.spacingMode === "none" || slice.viewMode === "continuous");
    el.classList.toggle("udoc-viewport--continuous", slice.viewMode === "continuous");
    const metrics = readViewportMetrics(scrollArea, container);
    const hasDoc = !!slice.docId && slice.pageCount > 0 && slice.pageInfos.length > 0;
    if (!hasDoc || metrics.innerWidth <= 0 || metrics.innerHeight <= 0) {
      clearSpreads();
      container.style.height = "";
      container.style.width = "";
      container.style.minWidth = "";
      scrollArea.style.overflowX = "hidden";
      scrollArea.style.overflowY = "hidden";
      layoutState = null;
      lastVisibleRange = { start: 0, end: -1 };
      viewportTopPosition = null;
      syncEffectiveZoom(slice, null);
      lastSlice = slice;
      lastMetrics = metrics;
      return;
    }
    const plan = computeViewportUpdate(lastSlice, slice, lastMetrics, metrics);
    if (plan.shouldClearSpreads) {
      clearSpreads();
      lastVisibleRange = { start: 0, end: -1 };
      viewportTopPosition = null;
    }
    if (plan.layoutChanged || !layoutState) {
      layoutState = buildLayout(slice, metrics, lastOverflowY ?? false);
      layoutDirty = true;
      lastMetrics = metrics;
    }
    syncEffectiveZoom(slice, layoutState);
    if (slice.scrollMode === "continuous") {
      applyContinuousLayout(metrics, layoutState);
      if (!slice.zoomAnchor) {
        if (plan.shouldScrollToPage) {
          scrollToPage(slice.page, metrics);
        } else if (plan.shouldRestorePosition && viewportTopPosition) {
          restoreViewportPosition(viewportTopPosition, metrics, layoutState);
        }
      }
      updateVisibleSpreads(slice, metrics, layoutState);
    } else {
      applySingleLayout(slice, metrics, layoutState);
      if (!slice.zoomAnchor) {
        if (plan.shouldScrollToPage) {
          scrollArea.scrollTop = 0;
          scrollArea.scrollLeft = 0;
          lastOverflowX = null;
          lastOverflowY = null;
        } else if (plan.shouldRestorePosition && viewportTopPosition) {
          const targetPage = viewportTopPosition.page;
          if (slice.page !== targetPage && storeRef) {
            storeRef.dispatch({ type: "SET_PAGE", page: targetPage });
          }
          scrollArea.scrollLeft = 0;
          const spreadIndex = findSpreadForPage(layoutState.spreads, targetPage);
          const layout = layoutState.layouts[spreadIndex];
          if (layout && layout.height > metrics.innerHeight && !viewportTopPosition.inSpacing) {
            const spreadTopInContainer = getCenteredOffset(containerSize.height, layout.height);
            const offsetPixels = viewportTopPosition.offset * layout.height;
            scrollArea.scrollTop = Math.max(0, spreadTopInContainer + offsetPixels);
          } else {
            scrollArea.scrollTop = 0;
          }
          lastOverflowX = null;
          lastOverflowY = null;
        }
      }
      showSingleSpread(slice, metrics, layoutState);
    }
    updateOverflow(slice, metrics);
    if (slice.zoomAnchor) {
      applyZoomAnchor(slice.zoomAnchor, metrics);
    }
    updateViewportTopPosition(slice, layoutState);
    if (slice.zoomAnchor && storeRef) {
      storeRef.dispatch({ type: "CLEAR_ZOOM_ANCHOR" });
    }
    lastSlice = slice;
  }
  function updateOverflow(_slice, _metrics) {
    const epsilon = 1;
    const scrollWidth = scrollArea.scrollWidth;
    const scrollHeight = scrollArea.scrollHeight;
    const clientWidth = scrollArea.clientWidth;
    const clientHeight = scrollArea.clientHeight;
    const scrollbar = getScrollbarSize();
    const assumeY = lastOverflowY ?? scrollHeight - clientHeight > epsilon;
    const availableWidth = clientWidth + (assumeY ? scrollbar.width : 0);
    const deltaX = scrollWidth - availableWidth;
    const needsX = resolveOverflowState(lastOverflowX, deltaX, epsilon);
    const availableHeight = clientHeight + (needsX ? scrollbar.height : 0);
    const deltaY = scrollHeight - availableHeight;
    const finalNeedsY = resolveOverflowState(lastOverflowY, deltaY, epsilon);
    lastOverflowX = needsX;
    lastOverflowY = finalNeedsY;
    scrollArea.style.overflowX = needsX ? "auto" : "hidden";
    scrollArea.style.overflowY = finalNeedsY ? "auto" : "hidden";
  }
  function applyContinuousLayout(metrics, state) {
    container.style.display = "block";
    const height = snapToDevice(Math.max(metrics.innerHeight, state.contentHeight));
    container.style.height = `${height}px`;
    const contentWidth = snapToDevice(state.contentWidth);
    if (contentWidth > metrics.innerWidth) {
      container.style.minWidth = `${contentWidth}px`;
      container.style.width = "";
      containerSize = { width: contentWidth, height };
    } else {
      container.style.minWidth = "";
      container.style.width = "";
      containerSize = { width: snapToDevice(metrics.innerWidth), height };
    }
  }
  function applySingleLayout(slice, metrics, state) {
    container.style.display = "block";
    const spreadIndex = findSpreadForPage(state.spreads, slice.page);
    const layout = state.layouts[spreadIndex];
    const spreadWidth = layout ? layout.width : 0;
    const spreadHeight = layout ? layout.height : 0;
    const snappedSpreadSpacing = snapToDevice(slice.spreadSpacing);
    const height = snapToDevice(Math.max(metrics.innerHeight, spreadHeight + snappedSpreadSpacing * 2));
    container.style.height = `${height}px`;
    const contentWidth = snapToDevice(spreadWidth);
    if (contentWidth > metrics.innerWidth) {
      container.style.minWidth = `${contentWidth}px`;
      container.style.width = "";
      containerSize = { width: contentWidth, height };
    } else {
      container.style.minWidth = "";
      container.style.width = "";
      containerSize = { width: snapToDevice(metrics.innerWidth), height };
    }
  }
  function syncEffectiveZoom(slice, state) {
    if (!storeRef)
      return;
    const nextZoom = slice.zoomMode === "custom" ? null : state?.scale ?? null;
    const current = storeRef.getState().effectiveZoom;
    if (nextZoom === null) {
      if (current === null)
        return;
      storeRef.dispatch({ type: "SET_EFFECTIVE_ZOOM", zoom: null });
      return;
    }
    if (current !== null && Math.abs(nextZoom - current) < 1e-3)
      return;
    storeRef.dispatch({ type: "SET_EFFECTIVE_ZOOM", zoom: nextZoom });
  }
  function updateViewportTopPosition(slice, state) {
    if (state.layouts.length === 0 || state.spreads.length === 0) {
      viewportTopPosition = null;
      return;
    }
    if (slice.scrollMode !== "continuous") {
      const spreadIndex = findSpreadForPage(state.spreads, slice.page);
      const spread = state.spreads[spreadIndex];
      const layout = state.layouts[spreadIndex];
      if (!layout || !spread) {
        viewportTopPosition = null;
        return;
      }
      const spreadTopInContainer = getCenteredOffset(containerSize.height, layout.height);
      const offsetInSpread = scrollArea.scrollTop - spreadTopInContainer;
      const offsetRatio = layout.height > 0 ? offsetInSpread / layout.height : 0;
      viewportTopPosition = {
        page: getSpreadPrimaryPage(spread),
        offset: offsetRatio,
        inSpacing: offsetInSpread < 0
      };
      return;
    }
    const viewportTopInLayout = scrollArea.scrollTop;
    for (let i = 0; i < state.layouts.length; i++) {
      const layout = state.layouts[i];
      const spread = state.spreads[i];
      if (!spread)
        continue;
      const spreadTop = layout.top;
      const spreadBottom = layout.top + layout.height;
      const offsetFromSpreadTop = viewportTopInLayout - spreadTop;
      if (viewportTopInLayout < spreadTop) {
        viewportTopPosition = {
          page: getSpreadPrimaryPage(spread),
          offset: offsetFromSpreadTop,
          // negative value
          inSpacing: true
        };
        return;
      }
      if (viewportTopInLayout < spreadBottom || i === state.layouts.length - 1) {
        const offsetRatio = layout.height > 0 ? offsetFromSpreadTop / layout.height : 0;
        viewportTopPosition = {
          page: getSpreadPrimaryPage(spread),
          offset: offsetRatio,
          inSpacing: false
        };
        return;
      }
    }
    viewportTopPosition = null;
  }
  function restoreViewportPosition(position, metrics, state) {
    const spreadIndex = findSpreadForPage(state.spreads, position.page);
    const layout = state.layouts[spreadIndex];
    if (!layout)
      return;
    let targetScrollTop;
    if (position.inSpacing) {
      targetScrollTop = layout.top + position.offset;
    } else {
      const offsetPixels = position.offset * layout.height;
      targetScrollTop = layout.top + offsetPixels;
    }
    const maxScrollTop = Math.max(0, containerSize.height - metrics.innerHeight);
    scrollArea.scrollTop = clamp2(targetScrollTop, 0, maxScrollTop);
  }
  function applyZoomAnchor(anchor, metrics) {
    const newScrollWidth = scrollArea.scrollWidth;
    const newScrollHeight = scrollArea.scrollHeight;
    if (anchor.scrollWidth === 0 || anchor.scrollHeight === 0)
      return;
    const scaleX = newScrollWidth / anchor.scrollWidth;
    const scaleY = newScrollHeight / anchor.scrollHeight;
    const pointX = anchor.scrollLeft + anchor.viewX * metrics.innerWidth;
    const pointY = anchor.scrollTop + anchor.viewY * metrics.innerHeight;
    const newPointX = pointX * scaleX;
    const newPointY = pointY * scaleY;
    scrollArea.scrollLeft = newPointX - anchor.viewX * metrics.innerWidth;
    scrollArea.scrollTop = newPointY - anchor.viewY * metrics.innerHeight;
  }
  function updateVisibleSpreads(slice, metrics, state) {
    if (!workerClient || !slice.docId)
      return;
    if (state.layouts.length === 0)
      return;
    const scrollTop = scrollArea.scrollTop;
    const visibleRange = findVisibleSpreadRange(state.layouts, scrollTop, metrics.innerHeight, RENDER_BUFFER);
    const rangeChanged = visibleRange.start !== lastVisibleRange.start || visibleRange.end !== lastVisibleRange.end;
    const isContinuousView = slice.viewMode === "continuous";
    const contLayout = state.continuousLayout;
    const cropMode = isContinuousView ? contLayout?.isGridLayout ? "full" : "vertical" : "none";
    const layoutOptions = {
      pageInfos: slice.pageInfos,
      scale: state.scale,
      dpi: slice.dpi,
      rotation: slice.pageRotation,
      pageSpacing: slice.pageSpacing,
      cropMode
    };
    if (layoutDirty || rangeChanged) {
      for (const [index, spread] of spreadComponents) {
        if (index < visibleRange.start || index > visibleRange.end) {
          spread.destroy();
          spreadComponents.delete(index);
        }
      }
      const renderOptions = {
        docId: slice.docId,
        scale: state.scale,
        dpi: slice.dpi
      };
      for (let i = visibleRange.start; i <= visibleRange.end; i++) {
        const layout = state.layouts[i];
        if (!layout)
          continue;
        let spreadComp = spreadComponents.get(i);
        if (!spreadComp) {
          const spreadData = state.spreads[layout.index];
          spreadComp = createSpread(spreadData, showAttribution, i18nRef ?? void 0, customPageOverlay);
          spreadComp.mount(container);
          spreadComponents.set(i, spreadComp);
        }
        spreadComp.updateLayout(layoutOptions);
        const spreadEl = spreadComp.getElement();
        spreadEl.style.position = "absolute";
        spreadEl.style.top = `${layout.top}px`;
        spreadEl.style.height = `${layout.height}px`;
        if (isContinuousView && contLayout?.isGridLayout) {
          const pageIndex = layout.slots[0] ? layout.slots[0] - 1 : i;
          const rowLayout = contLayout.rowLayouts.find((r) => r.pages.some((p) => p.pageIndex === pageIndex));
          const pageDef = rowLayout?.pages.find((p) => p.pageIndex === pageIndex);
          if (pageDef) {
            spreadEl.style.left = `${pageDef.left}px`;
            spreadEl.style.width = `${pageDef.width}px`;
            spreadEl.style.right = "";
          } else {
            spreadEl.style.left = "0px";
            spreadEl.style.right = "0px";
            spreadEl.style.width = "";
          }
          spreadEl.style.justifyContent = "flex-start";
          const isLastCol = pageDef ? pageDef.col === contLayout.columnWidths.length - 1 : false;
          const isLastRow = rowLayout ? rowLayout.row === contLayout.rowLayouts[contLayout.rowLayouts.length - 1].row : false;
          spreadEl.classList.toggle("udoc-spread--last-col", isLastCol);
          spreadEl.classList.toggle("udoc-spread--last-row", isLastRow);
        } else if (isContinuousView) {
          spreadEl.style.left = "0px";
          spreadEl.style.right = "0px";
          spreadEl.style.width = "";
          spreadEl.style.justifyContent = "";
          spreadEl.classList.add("udoc-spread--last-col");
          spreadEl.classList.toggle("udoc-spread--last-row", i === state.layouts.length - 1);
        } else {
          spreadEl.style.left = "0px";
          spreadEl.style.right = "0px";
          spreadEl.style.width = "";
          spreadEl.style.justifyContent = "";
          spreadEl.classList.remove("udoc-spread--last-col", "udoc-spread--last-row");
        }
        spreadEl.style.transform = "none";
        if (!rendersPaused) {
          spreadComp.render(workerClient, renderOptions);
        }
      }
      lastVisibleRange = visibleRange;
      if (!rendersPaused) {
        layoutDirty = false;
      }
    }
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      const spreadComp = spreadComponents.get(i);
      if (spreadComp) {
        spreadComp.updateAnnotations(slice.pageAnnotations, layoutOptions, slice.highlightedAnnotation);
        spreadComp.updateTextLayer(slice.pageText, layoutOptions);
        spreadComp.updateSearchHighlights(currentSearchMatches, currentSearchActiveIndex, layoutOptions);
        spreadComp.updateCustomPageOverlay(layoutOptions);
      }
    }
    const viewportCenter = scrollTop + metrics.innerHeight / 2;
    const focusPage = findSpreadAtCenter(viewportCenter, state);
    if (focusPage !== null) {
      workerClient.boostPageRenderPriority(slice.docId, focusPage);
    }
    updateCurrentPageFromScroll(scrollTop, metrics.innerHeight, state);
    fireViewportChangeIfChanged();
  }
  function cleanupTransition() {
    if (activeTransition) {
      activeTransition.cancel();
      activeTransition = null;
    }
    if (transitionOverlay) {
      transitionOverlay.remove();
      transitionOverlay = null;
    }
    if (transitionShadow) {
      transitionShadow.remove();
      transitionShadow = null;
    }
  }
  function captureSnapshot(spreadComp) {
    const el2 = spreadComp.getElement();
    const mainCanvas = el2.querySelector(".udoc-spread__canvas") ?? el2.querySelector("canvas");
    if (!mainCanvas || mainCanvas.width === 0 || mainCanvas.height === 0)
      return null;
    const canvas = document.createElement("canvas");
    canvas.width = mainCanvas.width;
    canvas.height = mainCanvas.height;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    if (!ctx)
      return null;
    ctx.drawImage(mainCanvas, 0, 0);
    const dpr = window.devicePixelRatio || 1;
    const cssW = mainCanvas.width / dpr;
    const cssH = mainCanvas.height / dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const containerRect = container.getBoundingClientRect();
    const canvasRect = mainCanvas.getBoundingClientRect();
    const rawLeft = canvasRect.left - containerRect.left;
    const rawTop = canvasRect.top - containerRect.top;
    const snappedLeft = Math.round(rawLeft * dpr) / dpr;
    const snappedTop = Math.round(rawTop * dpr) / dpr;
    const snapshot = document.createElement("div");
    snapshot.style.position = "absolute";
    snapshot.style.left = `${snappedLeft}px`;
    snapshot.style.top = `${snappedTop}px`;
    snapshot.style.width = `${cssW}px`;
    snapshot.style.height = `${cssH}px`;
    snapshot.style.pointerEvents = "none";
    snapshot.appendChild(canvas);
    return snapshot;
  }
  function showSingleSpread(slice, _metrics, state) {
    if (!workerClient || !slice.docId)
      return;
    const spreadIndex = findSpreadForPage(state.spreads, slice.page);
    const layout = state.layouts[spreadIndex];
    if (!layout)
      return;
    const isNewSpread = previousSpreadIndex !== null && spreadIndex !== previousSpreadIndex;
    if ((activeTransition || transitionOverlay) && !isNewSpread) {
      const spreadComp2 = spreadComponents.get(spreadIndex);
      if (spreadComp2) {
        const layoutOptions2 = {
          pageInfos: slice.pageInfos,
          scale: state.scale,
          dpi: slice.dpi,
          rotation: slice.pageRotation,
          pageSpacing: slice.pageSpacing
        };
        spreadComp2.updateAnnotations(slice.pageAnnotations, layoutOptions2, slice.highlightedAnnotation);
        spreadComp2.updateTextLayer(slice.pageText, layoutOptions2);
        spreadComp2.updateSearchHighlights(currentSearchMatches, currentSearchActiveIndex, layoutOptions2);
        spreadComp2.updateCustomPageOverlay(layoutOptions2);
      }
      lastVisibleRange = { start: spreadIndex, end: spreadIndex };
      fireViewportChangeIfChanged();
      return;
    }
    const forward = previousSpreadIndex !== null ? spreadIndex > previousSpreadIndex : true;
    const targetPageIndex = getSpreadPrimaryPage(state.spreads[spreadIndex]) - 1;
    const pageTransition = isNewSpread ? slice.pageInfos[targetPageIndex]?.transition : void 0;
    const wantTransition = isNewSpread && pageTransition != null && pageTransition.effect.type !== "replace" && storeRef !== null && storeRef.getState().transitionsEnabled;
    let snapshot = null;
    if (wantTransition) {
      const outgoingComp = spreadComponents.get(previousSpreadIndex);
      if (outgoingComp) {
        snapshot = captureSnapshot(outgoingComp);
      }
    }
    cleanupTransition();
    for (const [index, spread] of spreadComponents) {
      if (index !== spreadIndex) {
        spread.destroy();
        spreadComponents.delete(index);
      }
    }
    let spreadComp = spreadComponents.get(spreadIndex);
    if (!spreadComp) {
      const spreadData = state.spreads[spreadIndex];
      spreadComp = createSpread(spreadData, showAttribution, i18nRef ?? void 0);
      spreadComp.mount(container);
      spreadComponents.set(spreadIndex, spreadComp);
    }
    const layoutOptions = {
      pageInfos: slice.pageInfos,
      scale: state.scale,
      dpi: slice.dpi,
      rotation: slice.pageRotation,
      pageSpacing: slice.pageSpacing
    };
    spreadComp.updateLayout(layoutOptions);
    spreadComp.updateAnnotations(slice.pageAnnotations, layoutOptions, slice.highlightedAnnotation);
    spreadComp.updateTextLayer(slice.pageText, layoutOptions);
    spreadComp.updateSearchHighlights(currentSearchMatches, currentSearchActiveIndex, layoutOptions);
    spreadComp.updateCustomPageOverlay(layoutOptions);
    const top = getCenteredOffset(containerSize.height, layout.height);
    const spreadEl = spreadComp.getElement();
    spreadEl.style.position = "absolute";
    spreadEl.style.top = `${top}px`;
    spreadEl.style.height = `${layout.height}px`;
    spreadEl.style.left = "0px";
    spreadEl.style.right = "0px";
    spreadEl.style.width = "";
    spreadEl.style.transform = "none";
    if (snapshot && wantTransition) {
      const slot = spreadEl.querySelector(".udoc-spread__slot");
      if (slot) {
        const shadowEl = document.createElement("div");
        const containerRect = container.getBoundingClientRect();
        const slotRect = slot.getBoundingClientRect();
        shadowEl.style.position = "absolute";
        shadowEl.style.left = `${slotRect.left - containerRect.left}px`;
        shadowEl.style.top = `${slotRect.top - containerRect.top}px`;
        shadowEl.style.width = `${slotRect.width}px`;
        shadowEl.style.height = `${slotRect.height}px`;
        shadowEl.style.boxShadow = "var(--udoc-shadow-page)";
        shadowEl.style.pointerEvents = "none";
        container.insertBefore(shadowEl, spreadEl);
        transitionShadow = shadowEl;
        slot.style.boxShadow = "none";
      }
      container.insertBefore(snapshot, spreadEl);
      transitionOverlay = snapshot;
      snapshot.style.zIndex = "1";
      if (!rendersPaused) {
        spreadComp.render(workerClient, {
          docId: slice.docId,
          scale: state.scale,
          dpi: slice.dpi
        }).then(() => {
          if (transitionOverlay !== snapshot)
            return;
          snapshot.style.zIndex = "";
          activeTransition = runTransition(snapshot, spreadEl, pageTransition, forward, () => {
            if (transitionOverlay === snapshot) {
              transitionOverlay.remove();
              transitionOverlay = null;
            }
            if (slot)
              slot.style.boxShadow = "";
            if (transitionShadow) {
              transitionShadow.remove();
              transitionShadow = null;
            }
            activeTransition = null;
          });
        });
        const dpr = getDevicePixelRatio();
        const pointsToPixels = getPointsToPixels(slice.dpi);
        const renderScale = computePrerenderScale(slice.pageInfos, slice.page, state.scale, pointsToPixels, dpr);
        workerClient.prerenderAdjacentPages(slice.docId, slice.page, renderScale, slice.pageInfos.length);
      }
    } else if (!rendersPaused) {
      spreadComp.render(workerClient, {
        docId: slice.docId,
        scale: state.scale,
        dpi: slice.dpi
      });
      const dpr = getDevicePixelRatio();
      const pointsToPixels = getPointsToPixels(slice.dpi);
      const renderScale = computePrerenderScale(slice.pageInfos, slice.page, state.scale, pointsToPixels, dpr);
      workerClient.prerenderAdjacentPages(slice.docId, slice.page, renderScale, slice.pageInfos.length);
    }
    previousSpreadIndex = spreadIndex;
    lastVisibleRange = { start: spreadIndex, end: spreadIndex };
    if (!rendersPaused) {
      layoutDirty = false;
    }
    fireViewportChangeIfChanged();
  }
  function findSpreadAtCenter(y, state) {
    if (state.layouts.length === 0 || state.spreads.length === 0)
      return null;
    let closestIndex = 0;
    let closestDistance = Infinity;
    for (let i = 0; i < state.layouts.length; i++) {
      const layout = state.layouts[i];
      const spreadCenter = layout.top + layout.height / 2;
      const distance = Math.abs(spreadCenter - y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    const spread = state.spreads[closestIndex];
    return spread ? getSpreadPrimaryPage(spread) : null;
  }
  function updateCurrentPageFromScroll(scrollTop, viewportHeight, state) {
    if (!storeRef)
      return;
    let primaryPage;
    if (navigationPage !== null && navigationScrollTop !== null && scrollTop === navigationScrollTop) {
      primaryPage = navigationPage;
    } else {
      navigationPage = null;
      navigationScrollTop = null;
      const viewportCenter = scrollTop + viewportHeight / 2;
      primaryPage = findSpreadAtCenter(viewportCenter, state);
    }
    if (primaryPage === null)
      return;
    const currentState = storeRef.getState();
    if (currentState.page !== primaryPage) {
      storeRef.dispatch({ type: "SET_PAGE", page: primaryPage });
    }
  }
  function scrollToPage(page, metrics, center) {
    if (!layoutState)
      return;
    if (layoutState.layouts.length === 0)
      return;
    const viewport = metrics ?? lastMetrics;
    if (!viewport)
      return;
    const slice = currentSlice ?? lastSlice;
    if (!slice)
      return;
    const spreadIndex = findSpreadForPage(layoutState.spreads, page);
    const layout = layoutState.layouts.find((l) => l.index === spreadIndex) ?? layoutState.layouts[0];
    if (!layout)
      return;
    const snappedSpreadSpacing = snapToDevice(slice.spreadSpacing);
    const targetScrollTop = center ? layout.top - (viewport.innerHeight - layout.height) / 2 : layout.top - snappedSpreadSpacing;
    const maxScrollTop = Math.max(0, containerSize.height - viewport.innerHeight);
    scrollArea.scrollTop = clamp2(targetScrollTop, 0, maxScrollTop);
  }
  function scrollToTarget(target, metrics) {
    if (!layoutState)
      return;
    if (layoutState.layouts.length === 0)
      return;
    const viewport = metrics ?? lastMetrics;
    if (!viewport)
      return;
    const slice = currentSlice ?? lastSlice;
    if (!slice)
      return;
    const spreadIndex = findSpreadForPage(layoutState.spreads, target.page);
    const layout = layoutState.layouts[spreadIndex];
    if (!layout)
      return;
    let targetScrollTop;
    let targetScrollLeft = 0;
    const alignment = target.scrollAlignment ?? "top";
    if (target.scrollTo && target.scrollTo.y !== void 0) {
      const dpiScale = getPointsToPixels(slice.dpi);
      const pointsToPixels = dpiScale * layoutState.scale;
      const yInPixels = target.scrollTo.y * pointsToPixels;
      const targetTop = layout.top + yInPixels;
      const targetHeight = (target.scrollTo.height ?? 0) * pointsToPixels;
      switch (alignment) {
        case "center":
          targetScrollTop = targetTop - (viewport.innerHeight - targetHeight) / 2;
          break;
        case "bottom":
          targetScrollTop = targetTop - viewport.innerHeight + targetHeight;
          break;
        case "nearest": {
          const currentTop = scrollArea.scrollTop;
          const currentBottom = currentTop + viewport.innerHeight;
          const targetBottom = targetTop + targetHeight;
          if (targetTop >= currentTop && targetBottom <= currentBottom) {
            targetScrollTop = currentTop;
          } else if (targetTop < currentTop) {
            targetScrollTop = targetTop;
          } else {
            targetScrollTop = targetBottom - viewport.innerHeight;
          }
          break;
        }
        case "top":
        default:
          targetScrollTop = targetTop;
          break;
      }
      if (target.scrollTo.x !== void 0) {
        const xInPixels = target.scrollTo.x * pointsToPixels;
        targetScrollLeft = Math.max(0, xInPixels - viewport.innerWidth / 2);
      }
    } else {
      const snappedSpreadSpacing = snapToDevice(slice.spreadSpacing);
      targetScrollTop = layout.top - snappedSpreadSpacing;
    }
    const maxScrollTop = Math.max(0, containerSize.height - viewport.innerHeight);
    const maxScrollLeft = Math.max(0, containerSize.width - viewport.innerWidth);
    scrollArea.scrollTop = clamp2(targetScrollTop, 0, maxScrollTop);
    scrollArea.scrollLeft = clamp2(targetScrollLeft, 0, maxScrollLeft);
  }
  function clearSpreads() {
    cleanupTransition();
    for (const spread of spreadComponents.values()) {
      spread.destroy();
    }
    spreadComponents.clear();
    lastOverflowX = null;
    lastOverflowY = null;
    previousSpreadIndex = null;
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    if (unsubScroll)
      unsubScroll();
    if (unsubNavigation)
      unsubNavigation();
    if (unsubSearch)
      unsubSearch();
    if (resizeObserver)
      resizeObserver.disconnect();
    for (const off of unsubEvents)
      off();
    if (updateRaf)
      cancelAnimationFrame(updateRaf);
    if (scrollRaf)
      cancelAnimationFrame(scrollRaf);
    if (renderDebounceTimer)
      clearTimeout(renderDebounceTimer);
    if (branding)
      branding.destroy();
    if (viewToolController)
      viewToolController.destroy();
    viewToolController = null;
    if (annotationDrawController)
      annotationDrawController.destroy();
    annotationDrawController = null;
    if (annotationSelectController)
      annotationSelectController.destroy();
    annotationSelectController = null;
    floatingToolbar.destroy();
    clearSpreads();
    workerClient = null;
    storeRef = null;
    currentSlice = null;
    lastSlice = null;
    layoutState = null;
    el.remove();
  }
  return { el, mount, destroy };
}
function selectViewport(state) {
  return {
    docId: state.doc?.id ?? null,
    page: state.page,
    pageCount: state.pageCount,
    pageInfos: state.pageInfos,
    pageGroups: state.pageGroups,
    activeGroupIndex: state.activeGroupIndex,
    viewMode: state.viewMode,
    scrollMode: state.scrollMode,
    layoutMode: state.layoutMode,
    zoomMode: state.zoomMode,
    zoom: state.zoom,
    dpi: state.dpi,
    pageRotation: state.pageRotation,
    spacingMode: state.spacingMode,
    pageSpacing: state.pageSpacing,
    spreadSpacing: state.spreadSpacing,
    pageAnnotations: state.pageAnnotations,
    highlightedAnnotation: state.highlightedAnnotation,
    pageText: state.pageText,
    zoomAnchor: state.zoomAnchor
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/SheetTabBar.js
function selectSheetTabBar(state) {
  return {
    pageGroups: state.pageGroups,
    activeGroupIndex: state.activeGroupIndex,
    isXlsx: state.documentFormat === "xlsx"
  };
}
function sliceEqual5(a, b) {
  return a.pageGroups === b.pageGroups && a.activeGroupIndex === b.activeGroupIndex && a.isXlsx === b.isXlsx;
}
function createSheetTabBar() {
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
    unsub = subscribeSelector(store, selectSheetTabBar, (slice) => render(slice, store), { equality: sliceEqual5 });
  }
  function destroy() {
    unsub?.();
    unsub = null;
    el.remove();
  }
  return { el, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/AnnotationPanel.js
var ICON_STICKY_NOTE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;
var ICON_HIGHLIGHT = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
var ICON_UNDERLINE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>`;
var ICON_STRIKEOUT = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>`;
var ICON_SQUIGGLY = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`;
var ICON_FREETEXT = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>`;
var ICON_SHAPE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2 6v6h6V6H2zm16 0v6h6V6h-6zM7 17l5-5 5 5H7z"/></svg>`;
var ICON_INK = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
var ICON_STAMP = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`;
var ICON_CARET = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 14l5-5 5 5H7z"/></svg>`;
var ICON_REDACT = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7z"/></svg>`;
function filterAnnotationsWithMetadata(annotations) {
  return annotations.filter((annotation) => {
    const meta = annotation.metadata;
    return meta && (meta.author || meta.contents || meta.subject);
  });
}
function getAnnotationTypeIcon(type) {
  switch (type) {
    case "text":
      return ICON_STICKY_NOTE;
    case "highlight":
      return ICON_HIGHLIGHT;
    case "underline":
      return ICON_UNDERLINE;
    case "strikeOut":
      return ICON_STRIKEOUT;
    case "squiggly":
      return ICON_SQUIGGLY;
    case "freeText":
      return ICON_FREETEXT;
    case "line":
    case "square":
    case "circle":
    case "polygon":
    case "polyLine":
      return ICON_SHAPE;
    case "ink":
      return ICON_INK;
    case "stamp":
      return ICON_STAMP;
    case "caret":
      return ICON_CARET;
    case "redact":
      return ICON_REDACT;
    default:
      return ICON_COMMENTS;
  }
}
function createAnnotationPanel() {
  const el = document.createElement("div");
  el.className = "udoc-annotation-panel";
  let unsubRender = null;
  let storeRef = null;
  let i18nRef = null;
  function renderPlaceholder() {
    el.innerHTML = `<div class="udoc-panel-empty">${i18nRef.t("annotations.noComments")}</div>`;
  }
  function renderLoading() {
    el.innerHTML = `
            <div class="udoc-annotation-panel__loading">
                ${i18nRef.t("annotations.loading")}
            </div>
        `;
  }
  function renderCommentItem(container, annotation, pageIndex, depth) {
    const item = document.createElement("div");
    item.className = depth > 0 ? `udoc-comment-item udoc-comment-reply udoc-comment-depth-${Math.min(depth, 3)}` : "udoc-comment-item";
    const icon = document.createElement("div");
    icon.className = "udoc-comment-icon";
    icon.innerHTML = getAnnotationTypeIcon(annotation.type);
    item.appendChild(icon);
    const body = document.createElement("div");
    body.className = "udoc-comment-body";
    const header = document.createElement("div");
    header.className = "udoc-comment-header";
    const meta = annotation.metadata;
    const title = meta?.author || meta?.subject;
    if (title) {
      const titleEl = document.createElement("span");
      titleEl.className = "udoc-comment-author";
      titleEl.textContent = title;
      header.appendChild(titleEl);
    }
    if (meta?.state) {
      const badge = document.createElement("span");
      badge.className = `udoc-comment-status udoc-comment-status--${meta.state.toLowerCase()}`;
      badge.textContent = meta.state;
      header.appendChild(badge);
    }
    body.appendChild(header);
    if (meta?.contents) {
      const contents = document.createElement("div");
      contents.className = "udoc-comment-contents";
      contents.textContent = meta.contents;
      body.appendChild(contents);
    }
    if (annotation.replies && annotation.replies.length > 0) {
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "udoc-comment-toggle";
      toggleBtn.innerHTML = `${ICON_CHEVRON_RIGHT}<span>${annotation.replies.length === 1 ? i18nRef.t("annotations.replyCountSingle") : i18nRef.t("annotations.replyCount", { count: annotation.replies.length })}</span>`;
      toggleBtn.title = i18nRef.t("annotations.showReplies");
      body.appendChild(toggleBtn);
    }
    item.appendChild(body);
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (storeRef) {
        storeRef.dispatch({ type: "NAVIGATE_TO_PAGE", page: pageIndex + 1 });
        storeRef.dispatch({
          type: "HIGHLIGHT_ANNOTATION",
          pageIndex,
          bounds: annotation.bounds
        });
      }
    });
    container.appendChild(item);
    if (annotation.replies && annotation.replies.length > 0) {
      const toggleBtn = body.querySelector(".udoc-comment-toggle");
      const repliesContainer = document.createElement("div");
      repliesContainer.className = "udoc-comment-replies udoc-comment-replies--collapsed";
      for (const reply of annotation.replies) {
        renderCommentItem(repliesContainer, reply, pageIndex, depth + 1);
      }
      container.appendChild(repliesContainer);
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isCollapsed = repliesContainer.classList.contains("udoc-comment-replies--collapsed");
        if (isCollapsed) {
          repliesContainer.classList.remove("udoc-comment-replies--collapsed");
          toggleBtn.classList.add("udoc-comment-toggle--expanded");
          toggleBtn.title = i18nRef.t("annotations.hideReplies");
        } else {
          repliesContainer.classList.add("udoc-comment-replies--collapsed");
          toggleBtn.classList.remove("udoc-comment-toggle--expanded");
          toggleBtn.title = i18nRef.t("annotations.showReplies");
        }
      });
    }
  }
  function render(slice) {
    if (!slice.isOpen || !slice.isCommentsTab) {
      el.style.display = "none";
      return;
    }
    el.style.display = "";
    if (!slice.allAnnotationsLoaded) {
      renderLoading();
      return;
    }
    const annotationsByPage = /* @__PURE__ */ new Map();
    for (const [pageIndex, annotations] of slice.annotationsByPage) {
      const filtered = filterAnnotationsWithMetadata(annotations);
      if (filtered.length > 0) {
        annotationsByPage.set(pageIndex, filtered);
      }
    }
    if (annotationsByPage.size === 0) {
      renderPlaceholder();
      return;
    }
    el.innerHTML = "";
    const list = document.createElement("div");
    list.className = "udoc-comments-list";
    const sortedPages = Array.from(annotationsByPage.keys()).sort((a, b) => a - b);
    for (const pageIndex of sortedPages) {
      const annotations = annotationsByPage.get(pageIndex);
      const pageGroup = document.createElement("div");
      pageGroup.className = "udoc-comments-page-group";
      const pageHeader = document.createElement("div");
      pageHeader.className = "udoc-comments-page-header";
      pageHeader.innerHTML = `${ICON_CHEVRON_DOWN}<span>${i18nRef.t("annotations.pageHeader", { page: pageIndex + 1 })}</span><span class="udoc-comments-page-count">${annotations.length}</span>`;
      pageGroup.appendChild(pageHeader);
      const pageContent = document.createElement("div");
      pageContent.className = "udoc-comments-page-content";
      for (const annotation of annotations) {
        renderCommentItem(pageContent, annotation, pageIndex, 0);
      }
      pageGroup.appendChild(pageContent);
      pageHeader.addEventListener("click", () => {
        const isCollapsed = pageGroup.classList.contains("udoc-comments-page-group--collapsed");
        if (isCollapsed) {
          pageGroup.classList.remove("udoc-comments-page-group--collapsed");
        } else {
          pageGroup.classList.add("udoc-comments-page-group--collapsed");
        }
      });
      list.appendChild(pageGroup);
    }
    el.appendChild(list);
  }
  function applyState(slice) {
    render(slice);
  }
  function mount(container, store, i18n) {
    container.appendChild(el);
    storeRef = store;
    i18nRef = i18n;
    applyState(selectAnnotationPanel(store.getState()));
    unsubRender = subscribeSelector(store, selectAnnotationPanel, applyState, {
      equality: annotationPanelEqual
    });
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    storeRef = null;
    el.remove();
  }
  return { el, mount, destroy };
}
function selectAnnotationPanel(state) {
  const isCommentsTab = state.activePanel === "comments";
  const isOpen = isCommentsTab;
  const allAnnotationsLoaded = state.doc !== null && state.pageCount > 0 && state.pageAnnotations.size >= state.pageCount;
  return {
    isOpen,
    isCommentsTab,
    annotationsByPage: state.pageAnnotations,
    allAnnotationsLoaded
  };
}
function annotationPanelEqual(a, b) {
  if (a.isOpen !== b.isOpen)
    return false;
  if (a.isCommentsTab !== b.isCommentsTab)
    return false;
  if (a.allAnnotationsLoaded !== b.allAnnotationsLoaded)
    return false;
  if (a.annotationsByPage !== b.annotationsByPage)
    return false;
  return true;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/SearchPanel.js
function matchEquals(a, b) {
  return a.pageIndex === b.pageIndex && a.charOffset === b.charOffset && a.length === b.length;
}
function createSearchPanel() {
  const el = document.createElement("div");
  el.className = "udoc-search-panel";
  const header = document.createElement("div");
  header.className = "udoc-search-panel__header";
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "udoc-search-panel__input-wrapper";
  const inputIcon = document.createElement("span");
  inputIcon.className = "udoc-search-panel__input-icon";
  inputIcon.innerHTML = ICON_SEARCH;
  const input = document.createElement("input");
  input.className = "udoc-search-panel__input";
  input.type = "text";
  input.placeholder = "Search in document...";
  input.setAttribute("aria-label", "Search text");
  const clearBtn = document.createElement("button");
  clearBtn.className = "udoc-search-panel__clear";
  clearBtn.innerHTML = ICON_CLEAR;
  clearBtn.title = "Clear search";
  clearBtn.setAttribute("aria-label", "Clear search");
  clearBtn.style.display = "none";
  inputWrapper.append(inputIcon, input, clearBtn);
  const caseBtn = document.createElement("button");
  caseBtn.className = "udoc-search-panel__case";
  caseBtn.textContent = "Aa";
  caseBtn.title = "Match case";
  caseBtn.setAttribute("aria-label", "Match case");
  caseBtn.setAttribute("aria-pressed", "false");
  const fuzzyBtn = document.createElement("button");
  fuzzyBtn.className = "udoc-search-panel__fuzzy";
  fuzzyBtn.textContent = "~";
  fuzzyBtn.title = "Fuzzy match";
  fuzzyBtn.setAttribute("aria-label", "Fuzzy match");
  fuzzyBtn.setAttribute("aria-pressed", "false");
  header.append(inputWrapper, caseBtn, fuzzyBtn);
  const nav = document.createElement("div");
  nav.className = "udoc-search-panel__nav";
  const status = document.createElement("span");
  status.className = "udoc-search-panel__status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const navButtons = document.createElement("div");
  navButtons.className = "udoc-search-panel__nav-buttons";
  const prevBtn = document.createElement("button");
  prevBtn.className = "udoc-search-panel__nav-btn";
  prevBtn.innerHTML = ICON_CHEVRON_UP;
  prevBtn.title = "Previous match (Shift+Enter)";
  prevBtn.setAttribute("aria-label", "Previous match");
  const nextBtn = document.createElement("button");
  nextBtn.className = "udoc-search-panel__nav-btn";
  nextBtn.innerHTML = ICON_CHEVRON_DOWN;
  nextBtn.title = "Next match (Enter)";
  nextBtn.setAttribute("aria-label", "Next match");
  navButtons.append(prevBtn, nextBtn);
  nav.append(status, navButtons);
  const results = document.createElement("div");
  results.className = "udoc-search-panel__results";
  results.setAttribute("role", "listbox");
  results.setAttribute("aria-label", "Search results");
  el.append(header, nav, results);
  let unsubRender = null;
  let storeRef = null;
  let i18n = null;
  const unsubEvents = [];
  let lastSlice = null;
  let renderedMatchesRef = null;
  function applyState(slice) {
    if (!slice.isOpen) {
      el.style.display = "none";
      lastSlice = slice;
      return;
    }
    el.style.display = "";
    if (lastSlice && !lastSlice.isOpen && slice.isOpen) {
      requestAnimationFrame(() => input.focus({ preventScroll: true }));
    }
    if (input.value !== slice.query) {
      input.value = slice.query;
    }
    clearBtn.style.display = slice.query ? "" : "none";
    caseBtn.classList.toggle("udoc-search-panel__case--active", slice.caseSensitive);
    caseBtn.setAttribute("aria-pressed", String(slice.caseSensitive));
    fuzzyBtn.classList.toggle("udoc-search-panel__fuzzy--active", slice.fuzzy);
    fuzzyBtn.setAttribute("aria-pressed", String(slice.fuzzy));
    const hasMatches = slice.matches.length > 0;
    prevBtn.disabled = !hasMatches;
    nextBtn.disabled = !hasMatches;
    if (slice.textLoading) {
      status.textContent = i18n.t("search.loadingText");
    } else if (slice.query && slice.matches.length === 0 && slice.textLoaded) {
      status.textContent = i18n.t("search.noResults");
    } else if (slice.matches.length > 0) {
      status.textContent = i18n.t("search.resultStatus", {
        current: slice.activeIndex + 1,
        total: slice.matches.length
      });
    } else {
      status.textContent = "";
    }
    if (slice.matches !== renderedMatchesRef) {
      const prevLen = renderedMatchesRef ? renderedMatchesRef.length : 0;
      const isAppend = prevLen > 0 && slice.matches.length >= prevLen && matchEquals(renderedMatchesRef[prevLen - 1], slice.matches[prevLen - 1]);
      if (isAppend && slice.matches.length > prevLen) {
        appendResultItems(slice.matches, prevLen);
      } else if (!isAppend) {
        renderResultList(slice);
      }
      renderedMatchesRef = slice.matches;
    }
    updateActiveResult(slice.activeIndex);
    lastSlice = slice;
  }
  function createResultItem(match, globalIndex) {
    const item = document.createElement("div");
    item.className = "udoc-search-result";
    item.setAttribute("role", "option");
    item.dataset.matchIndex = String(globalIndex);
    const contextEl = document.createElement("span");
    contextEl.className = "udoc-search-result__context";
    const [before, matched, after] = match.context;
    const beforeText = document.createTextNode(before);
    const matchSpan = document.createElement("mark");
    matchSpan.className = "udoc-search-result__match";
    matchSpan.textContent = matched;
    const afterText = document.createTextNode(after);
    contextEl.append(beforeText, matchSpan, afterText);
    item.appendChild(contextEl);
    const idx = globalIndex;
    item.addEventListener("click", () => {
      if (storeRef) {
        storeRef.dispatch({ type: "SET_SEARCH_ACTIVE_INDEX", index: idx });
      }
    });
    return item;
  }
  let lastRenderedPage = -1;
  function renderResultList(slice) {
    results.innerHTML = "";
    lastRenderedPage = -1;
    if (slice.matches.length === 0)
      return;
    appendResultItems(slice.matches, 0);
  }
  function appendResultItems(matches, fromIndex) {
    for (let i = fromIndex; i < matches.length; i++) {
      const match = matches[i];
      if (match.pageIndex !== lastRenderedPage) {
        lastRenderedPage = match.pageIndex;
        const pageHeader = document.createElement("div");
        pageHeader.className = "udoc-search-result__page-header";
        pageHeader.textContent = i18n.t("search.pageHeader", { page: match.pageIndex + 1 });
        results.appendChild(pageHeader);
      }
      results.appendChild(createResultItem(match, i));
    }
  }
  function updateActiveResult(activeIndex) {
    const prev = results.querySelector(".udoc-search-result--active");
    if (prev) {
      prev.classList.remove("udoc-search-result--active");
      prev.setAttribute("aria-selected", "false");
    }
    if (activeIndex >= 0) {
      const active = results.querySelector(`[data-match-index="${activeIndex}"]`);
      if (active) {
        active.classList.add("udoc-search-result--active");
        active.setAttribute("aria-selected", "true");
        active.scrollIntoView({ block: "nearest" });
      }
    }
  }
  function mount(container, store, i18nArg) {
    container.appendChild(el);
    storeRef = store;
    i18n = i18nArg;
    input.placeholder = i18n.t("search.placeholder");
    input.setAttribute("aria-label", i18n.t("search.label"));
    caseBtn.title = i18n.t("search.matchCase");
    caseBtn.setAttribute("aria-label", i18n.t("search.matchCase"));
    fuzzyBtn.title = i18n.t("search.fuzzyMatch");
    fuzzyBtn.setAttribute("aria-label", i18n.t("search.fuzzyMatch"));
    prevBtn.title = i18n.t("search.previousMatch");
    prevBtn.setAttribute("aria-label", i18n.t("search.previousMatch"));
    nextBtn.title = i18n.t("search.nextMatch");
    nextBtn.setAttribute("aria-label", i18n.t("search.nextMatch"));
    results.setAttribute("aria-label", i18n.t("search.resultsLabel"));
    unsubEvents.push(on(input, "keydown", (e) => {
      if (e.key === "Enter" && storeRef) {
        e.preventDefault();
        const queryChanged = storeRef.getState().searchQuery !== input.value;
        if (queryChanged) {
          storeRef.dispatch({ type: "SET_SEARCH_PAGE_RANGE", range: null });
          storeRef.dispatch({ type: "SET_SEARCH_QUERY", query: input.value });
        } else if (e.shiftKey) {
          storeRef.dispatch({ type: "SEARCH_PREV" });
        } else {
          storeRef.dispatch({ type: "SEARCH_NEXT" });
        }
      }
      if (e.key === "Escape" && storeRef) {
        storeRef.dispatch({ type: "CLOSE_PANEL" });
      }
    }));
    unsubEvents.push(on(caseBtn, "click", () => {
      if (storeRef) {
        const current = storeRef.getState().searchCaseSensitive;
        storeRef.dispatch({ type: "SET_SEARCH_CASE_SENSITIVE", caseSensitive: !current });
      }
    }));
    unsubEvents.push(on(fuzzyBtn, "click", () => {
      if (storeRef) {
        const current = storeRef.getState().searchFuzzy;
        storeRef.dispatch({ type: "SET_SEARCH_FUZZY", fuzzy: !current });
      }
    }));
    unsubEvents.push(on(clearBtn, "click", () => {
      if (storeRef) {
        storeRef.dispatch({ type: "CLEAR_SEARCH" });
        input.focus({ preventScroll: true });
      }
    }));
    unsubEvents.push(on(prevBtn, "click", () => {
      if (storeRef)
        storeRef.dispatch({ type: "SEARCH_PREV" });
    }));
    unsubEvents.push(on(nextBtn, "click", () => {
      if (storeRef)
        storeRef.dispatch({ type: "SEARCH_NEXT" });
    }));
    applyState(selectSearchPanel(store.getState()));
    unsubRender = subscribeSelector(store, selectSearchPanel, applyState, {
      equality: searchPanelEqual
    });
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    for (const off of unsubEvents)
      off();
    storeRef = null;
    lastSlice = null;
    renderedMatchesRef = null;
    el.remove();
  }
  return { el, mount, destroy };
}
function selectSearchPanel(state) {
  return {
    isOpen: state.activePanel === "search",
    query: state.searchQuery,
    caseSensitive: state.searchCaseSensitive,
    fuzzy: state.searchFuzzy,
    matches: state.searchMatches,
    activeIndex: state.searchActiveIndex,
    textLoading: state.searchTextLoading,
    textLoaded: state.searchTextLoaded,
    pageCount: state.pageCount
  };
}
function searchPanelEqual(a, b) {
  return a.isOpen === b.isOpen && a.query === b.query && a.caseSensitive === b.caseSensitive && a.fuzzy === b.fuzzy && a.matches === b.matches && a.activeIndex === b.activeIndex && a.textLoading === b.textLoading && a.textLoaded === b.textLoaded && a.pageCount === b.pageCount;
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/RightPanel.js
var RIGHT_TABS = ["search", "comments"];
function createRightPanel() {
  const el = document.createElement("div");
  el.className = "udoc-right-panel";
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "udoc-right-panel__resize-handle";
  resizeHandle.setAttribute("role", "separator");
  resizeHandle.setAttribute("aria-orientation", "vertical");
  resizeHandle.setAttribute("aria-label", "Resize panel");
  resizeHandle.setAttribute("tabindex", "0");
  resizeHandle.setAttribute("aria-valuenow", "320");
  resizeHandle.setAttribute("aria-valuemin", "200");
  resizeHandle.setAttribute("aria-valuemax", "500");
  const content = document.createElement("div");
  content.className = "udoc-right-panel__content";
  content.setAttribute("role", "region");
  el.append(resizeHandle, content);
  const searchPanel = createSearchPanel();
  const annotationPanel = createAnnotationPanel();
  let unsubRender = null;
  const unsubEvents = [];
  let storeRef = null;
  let i18nRef = null;
  function applyState(slice) {
    el.style.display = !slice.panelVisible || slice.allDisabled ? "none" : "";
    el.style.transition = slice.noTransition ? "none" : "";
    el.classList.toggle("udoc-right-panel--closed", !slice.open);
    if (slice.open && slice.width !== null) {
      el.style.width = `${slice.width}px`;
    } else {
      el.style.width = "";
    }
    if (slice.activeTab) {
      content.setAttribute("data-tab", slice.activeTab);
      const label = slice.activeTab === "search" ? i18nRef.t("rightPanel.searchPanel") : i18nRef.t("rightPanel.commentsPanel");
      content.setAttribute("aria-label", label);
    } else {
      content.removeAttribute("data-tab");
      content.removeAttribute("aria-label");
    }
  }
  function setupResize() {
    let startX = 0;
    let startWidth = 0;
    const onPointerMove = (e) => {
      const delta = startX - e.clientX;
      const newWidth = Math.max(200, Math.min(500, startWidth + delta));
      el.style.width = `${newWidth}px`;
    };
    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      el.classList.remove("udoc-right-panel--resizing");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (storeRef) {
        const finalWidth = el.offsetWidth;
        storeRef.dispatch({ type: "SET_RIGHT_PANEL_WIDTH", width: finalWidth });
      }
    };
    const onPointerDown = (e) => {
      e.preventDefault();
      startX = e.clientX;
      startWidth = el.offsetWidth;
      el.classList.add("udoc-right-panel--resizing");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    };
    resizeHandle.addEventListener("pointerdown", onPointerDown);
    unsubEvents.push(() => resizeHandle.removeEventListener("pointerdown", onPointerDown));
    const RESIZE_STEP = 20;
    const onKeyDown = (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft")
        return;
      e.preventDefault();
      const currentWidth = el.offsetWidth;
      const delta = e.key === "ArrowLeft" ? RESIZE_STEP : -RESIZE_STEP;
      const newWidth = Math.max(200, Math.min(500, currentWidth + delta));
      el.style.width = `${newWidth}px`;
      resizeHandle.setAttribute("aria-valuenow", String(newWidth));
      if (storeRef) {
        storeRef.dispatch({ type: "SET_RIGHT_PANEL_WIDTH", width: newWidth });
      }
    };
    resizeHandle.addEventListener("keydown", onKeyDown);
    unsubEvents.push(() => resizeHandle.removeEventListener("keydown", onKeyDown));
  }
  function mount(container, store, i18n) {
    container.appendChild(el);
    storeRef = store;
    i18nRef = i18n;
    resizeHandle.setAttribute("aria-label", i18n.t("rightPanel.resizeHandle"));
    setupResize();
    searchPanel.mount(content, store, i18n);
    annotationPanel.mount(content, store, i18n);
    applyState(selectRightPanel(store.getState()));
    unsubRender = subscribeSelector(store, selectRightPanel, applyState, {
      equality: (a, b) => a.open === b.open && a.activeTab === b.activeTab && a.width === b.width && a.panelVisible === b.panelVisible && a.allDisabled === b.allDisabled && a.noTransition === b.noTransition
    });
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    for (const off of unsubEvents)
      off();
    searchPanel.destroy();
    annotationPanel.destroy();
    storeRef = null;
    el.remove();
  }
  return { el, mount, destroy };
}
function selectRightPanel(state) {
  const panel = state.activePanel;
  const isRightTab = panel !== null && !isLeftPanelTab(panel);
  const allDisabled = RIGHT_TABS.every((tab) => state.disabledPanels.has(tab));
  return {
    open: isRightTab,
    activeTab: isRightTab ? panel : null,
    width: state.rightPanelWidth,
    panelVisible: state.rightPanelVisible,
    allDisabled,
    noTransition: state.panelTransitionsDisabled
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/PasswordDialog.js
function createPasswordDialog() {
  const overlay = document.createElement("div");
  overlay.className = "udoc-password-overlay";
  const dialog = document.createElement("div");
  dialog.className = "udoc-password-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-labelledby", "udoc-password-title");
  dialog.setAttribute("aria-modal", "true");
  dialog.innerHTML = `
        <div class="udoc-password-header">
            <svg class="udoc-password-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h2 id="udoc-password-title" class="udoc-password-title">Password Required</h2>
        </div>
        <p class="udoc-password-message">This document is protected. Please enter the password to open it.</p>
        <form class="udoc-password-form">
            <div class="udoc-password-input-wrapper">
                <input
                    type="password"
                    class="udoc-password-input"
                    placeholder="Enter password"
                    autocomplete="off"
                    aria-label="Password"
                    aria-describedby="udoc-password-error"
                />
                <button type="button" class="udoc-password-toggle" aria-label="Show password">
                    <svg class="udoc-password-eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg class="udoc-password-eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                </button>
            </div>
            <p class="udoc-password-error" id="udoc-password-error" aria-live="polite"></p>
            <button type="submit" class="udoc-password-submit">
                <span class="udoc-password-submit-text">Unlock</span>
                <span class="udoc-password-submit-spinner" style="display:none">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-dashoffset="0">
                            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                </span>
            </button>
        </form>
    `;
  overlay.appendChild(dialog);
  const form = dialog.querySelector(".udoc-password-form");
  const input = dialog.querySelector(".udoc-password-input");
  const toggleBtn = dialog.querySelector(".udoc-password-toggle");
  const eyeOpen = dialog.querySelector(".udoc-password-eye-open");
  const eyeClosed = dialog.querySelector(".udoc-password-eye-closed");
  const errorEl = dialog.querySelector(".udoc-password-error");
  const submitBtn = dialog.querySelector(".udoc-password-submit");
  const submitText = dialog.querySelector(".udoc-password-submit-text");
  const submitSpinner = dialog.querySelector(".udoc-password-submit-spinner");
  let callbacks = null;
  let unsubRender = null;
  let cleanupTrap = null;
  let previousFocus = null;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = input.value;
    if (password && callbacks?.onSubmit) {
      callbacks.onSubmit(password);
    }
  });
  input.addEventListener("input", () => {
    if (errorEl.textContent) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
  });
  function mount(container, store, i18n, cb) {
    container.appendChild(overlay);
    callbacks = cb;
    const titleEl = dialog.querySelector("#udoc-password-title");
    if (titleEl)
      titleEl.textContent = i18n.t("password.title");
    const messageEl = dialog.querySelector(".udoc-password-message");
    if (messageEl)
      messageEl.textContent = i18n.t("password.message");
    input.placeholder = i18n.t("password.placeholder");
    input.setAttribute("aria-label", i18n.t("password.label"));
    toggleBtn.setAttribute("aria-label", i18n.t("password.showPassword"));
    const submitTextEl = dialog.querySelector(".udoc-password-submit-text");
    if (submitTextEl)
      submitTextEl.textContent = i18n.t("password.unlock");
    toggleBtn.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      eyeOpen.style.display = isPassword ? "none" : "";
      eyeClosed.style.display = isPassword ? "" : "none";
      toggleBtn.setAttribute("aria-label", isPassword ? i18n.t("password.hidePassword") : i18n.t("password.showPassword"));
    });
    unsubRender = store.subscribeRender((prev, next) => {
      const wasVisible = prev.needsPassword && prev.doc !== null;
      const isVisible2 = next.needsPassword && next.doc !== null;
      if (wasVisible !== isVisible2) {
        overlay.style.display = isVisible2 ? "" : "none";
        if (isVisible2) {
          previousFocus = document.activeElement;
          setTimeout(() => input.focus(), 0);
          input.value = "";
          input.type = "password";
          eyeOpen.style.display = "";
          eyeClosed.style.display = "none";
          cleanupTrap = trapFocus(dialog);
        } else {
          if (cleanupTrap) {
            cleanupTrap();
            cleanupTrap = null;
          }
          if (previousFocus && previousFocus.focus) {
            previousFocus.focus();
            previousFocus = null;
          }
        }
      }
      if (prev.passwordError !== next.passwordError) {
        errorEl.textContent = next.passwordError ?? "";
        errorEl.style.display = next.passwordError ? "" : "none";
      }
      if (prev.isAuthenticating !== next.isAuthenticating) {
        submitBtn.disabled = next.isAuthenticating;
        input.disabled = next.isAuthenticating;
        submitText.style.display = next.isAuthenticating ? "none" : "";
        submitSpinner.style.display = next.isAuthenticating ? "" : "none";
      }
    });
    const initialState2 = store.getState();
    const isVisible = initialState2.needsPassword && initialState2.doc !== null;
    overlay.style.display = isVisible ? "" : "none";
    errorEl.style.display = initialState2.passwordError ? "" : "none";
    errorEl.textContent = initialState2.passwordError ?? "";
    if (isVisible) {
      setTimeout(() => input.focus(), 0);
    }
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    if (cleanupTrap) {
      cleanupTrap();
      cleanupTrap = null;
    }
    callbacks = null;
    previousFocus = null;
    overlay.remove();
  }
  return { el: overlay, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/PrintDialog.js
function parsePageRange(input, maxPage) {
  const pages = /* @__PURE__ */ new Set();
  const parts = input.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed)
      continue;
    const rangeParts = trimmed.split("-");
    if (rangeParts.length === 1) {
      const n = parseInt(rangeParts[0], 10);
      if (isNaN(n) || n < 1 || n > maxPage)
        return null;
      pages.add(n);
    } else if (rangeParts.length === 2) {
      const a = parseInt(rangeParts[0], 10);
      const b = parseInt(rangeParts[1], 10);
      if (isNaN(a) || isNaN(b) || a < 1 || b < 1 || a > maxPage || b > maxPage || a > b)
        return null;
      for (let i = a; i <= b; i++)
        pages.add(i);
    } else {
      return null;
    }
  }
  if (pages.size === 0)
    return null;
  return Array.from(pages).sort((a, b) => a - b);
}
function createPrintDialog() {
  const overlay = document.createElement("div");
  overlay.className = "udoc-print-overlay";
  overlay.style.display = "none";
  const dialog = document.createElement("div");
  dialog.className = "udoc-print-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-labelledby", "udoc-print-title");
  dialog.setAttribute("aria-modal", "true");
  dialog.innerHTML = `
        <h2 id="udoc-print-title" class="udoc-print-title">Print</h2>

        <div class="udoc-print-section">
            <label class="udoc-print-section-label">Pages</label>
            <div class="udoc-print-radios">
                <label class="udoc-print-radio">
                    <input type="radio" name="udoc-print-range" value="all" checked>
                    <span>All pages</span>
                </label>
                <label class="udoc-print-radio">
                    <input type="radio" name="udoc-print-range" value="current">
                    <span>Current page (<span class="udoc-print-current-page">1</span>)</span>
                </label>
                <label class="udoc-print-radio">
                    <input type="radio" name="udoc-print-range" value="fromTo">
                    <span>Pages</span>
                    <input type="number" class="udoc-print-input udoc-print-from" min="1" value="1" disabled aria-describedby="udoc-print-error">
                    <span>to</span>
                    <input type="number" class="udoc-print-input udoc-print-to" min="1" value="1" disabled aria-describedby="udoc-print-error">
                </label>
                <label class="udoc-print-radio">
                    <input type="radio" name="udoc-print-range" value="custom">
                    <span>Custom</span>
                    <input type="text" class="udoc-print-input udoc-print-custom" placeholder="e.g. 1,3,5-8" disabled aria-describedby="udoc-print-error">
                </label>
            </div>
        </div>

        <div class="udoc-print-section">
            <label class="udoc-print-section-label" for="udoc-print-quality">Quality</label>
            <select id="udoc-print-quality" class="udoc-print-select">
                <option value="draft">Draft (150 DPI)</option>
                <option value="standard" selected>Standard (300 DPI)</option>
                <option value="high">High (600 DPI)</option>
            </select>
        </div>

        <p class="udoc-print-error" id="udoc-print-error" aria-live="polite"></p>

        <div class="udoc-print-actions">
            <button type="button" class="udoc-print-btn udoc-print-btn--cancel">Cancel</button>
            <button type="button" class="udoc-print-btn udoc-print-btn--print">Print</button>
        </div>
    `;
  overlay.appendChild(dialog);
  const radios = dialog.querySelectorAll('input[name="udoc-print-range"]');
  const currentPageSpan = dialog.querySelector(".udoc-print-current-page");
  const fromInput = dialog.querySelector(".udoc-print-from");
  const toInput = dialog.querySelector(".udoc-print-to");
  const customInput = dialog.querySelector(".udoc-print-custom");
  const qualitySelect = dialog.querySelector("#udoc-print-quality");
  const errorEl = dialog.querySelector(".udoc-print-error");
  const cancelBtn = dialog.querySelector(".udoc-print-btn--cancel");
  const printBtn = dialog.querySelector(".udoc-print-btn--print");
  let callbacks = null;
  let i18nRef = null;
  let unsubRender = null;
  let cleanupTrap = null;
  let previousFocus = null;
  let pageCount = 1;
  function getSelectedRange() {
    for (const r of radios) {
      if (r.checked)
        return r.value;
    }
    return "all";
  }
  function updateInputStates() {
    const selected = getSelectedRange();
    fromInput.disabled = selected !== "fromTo";
    toInput.disabled = selected !== "fromTo";
    customInput.disabled = selected !== "custom";
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
  for (const r of radios) {
    r.addEventListener("change", updateInputStates);
  }
  fromInput.addEventListener("focus", () => {
    const radio = dialog.querySelector('input[value="fromTo"]');
    if (radio)
      radio.checked = true;
    updateInputStates();
  });
  toInput.addEventListener("focus", () => {
    const radio = dialog.querySelector('input[value="fromTo"]');
    if (radio)
      radio.checked = true;
    updateInputStates();
  });
  customInput.addEventListener("focus", () => {
    const radio = dialog.querySelector('input[value="custom"]');
    if (radio)
      radio.checked = true;
    updateInputStates();
  });
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = "";
  }
  function handlePrint() {
    const selected = getSelectedRange();
    const quality = qualitySelect.value;
    let pageRange;
    switch (selected) {
      case "all":
        pageRange = { kind: "all" };
        break;
      case "current":
        pageRange = { kind: "current" };
        break;
      case "fromTo": {
        const from = parseInt(fromInput.value, 10);
        const to = parseInt(toInput.value, 10);
        if (isNaN(from) || isNaN(to) || from < 1 || to < 1 || from > pageCount || to > pageCount) {
          showError(i18nRef.t("print.errorPageRange", { max: pageCount }));
          return;
        }
        if (from > to) {
          showError(i18nRef.t("print.errorStartEnd"));
          return;
        }
        pageRange = { kind: "fromTo", from, to };
        break;
      }
      case "custom": {
        const parsed = parsePageRange(customInput.value, pageCount);
        if (!parsed) {
          showError(i18nRef.t("print.errorCustomRange", { max: pageCount }));
          return;
        }
        pageRange = { kind: "custom", pages: parsed };
        break;
      }
      default:
        pageRange = { kind: "all" };
    }
    callbacks?.onPrint({ pageRange, quality });
  }
  printBtn.addEventListener("click", handlePrint);
  cancelBtn.addEventListener("click", () => callbacks?.onCancel());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay)
      callbacks?.onCancel();
  });
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      callbacks?.onCancel();
    }
  });
  function mount(container, store, i18n, cb) {
    container.appendChild(overlay);
    callbacks = cb;
    i18nRef = i18n;
    const titleEl = dialog.querySelector("#udoc-print-title");
    if (titleEl)
      titleEl.textContent = i18n.t("print.title");
    const sectionLabels = dialog.querySelectorAll(".udoc-print-section-label");
    if (sectionLabels[0])
      sectionLabels[0].textContent = i18n.t("print.pagesLabel");
    if (sectionLabels[1])
      sectionLabels[1].textContent = i18n.t("print.qualityLabel");
    const radioLabels = dialog.querySelectorAll(".udoc-print-radio");
    const allPagesSpan = radioLabels[0]?.querySelector("span");
    if (allPagesSpan)
      allPagesSpan.textContent = i18n.t("print.allPages");
    const cpParent = radioLabels[1]?.querySelector(":scope > span");
    if (cpParent) {
      const tpl = i18n.t("print.currentPage", { page: "\0" });
      const [before, after] = tpl.split("\0");
      cpParent.textContent = "";
      cpParent.append(document.createTextNode(before), currentPageSpan, document.createTextNode(after));
    }
    const pagesRangeSpans = radioLabels[2]?.querySelectorAll(":scope > span");
    if (pagesRangeSpans && pagesRangeSpans[0])
      pagesRangeSpans[0].textContent = i18n.t("print.pagesRange");
    if (pagesRangeSpans && pagesRangeSpans[1])
      pagesRangeSpans[1].textContent = i18n.t("print.pagesTo");
    const customSpan = radioLabels[3]?.querySelector(":scope > span");
    if (customSpan)
      customSpan.textContent = i18n.t("print.custom");
    customInput.placeholder = i18n.t("print.customPlaceholder");
    const qualityOptions = qualitySelect.querySelectorAll("option");
    if (qualityOptions[0])
      qualityOptions[0].textContent = i18n.t("print.qualityDraft");
    if (qualityOptions[1])
      qualityOptions[1].textContent = i18n.t("print.qualityStandard");
    if (qualityOptions[2])
      qualityOptions[2].textContent = i18n.t("print.qualityHigh");
    cancelBtn.textContent = i18n.t("print.cancel");
    printBtn.textContent = i18n.t("print.print");
    unsubRender = store.subscribeRender((prev, next) => {
      const wasVisible = prev.showPrintDialog;
      const isVisible = next.showPrintDialog;
      if (wasVisible !== isVisible) {
        overlay.style.display = isVisible ? "" : "none";
        if (isVisible) {
          previousFocus = document.activeElement;
          const allRadio = dialog.querySelector('input[value="all"]');
          if (allRadio)
            allRadio.checked = true;
          fromInput.value = "1";
          toInput.value = String(next.pageCount);
          customInput.value = "";
          qualitySelect.value = "standard";
          errorEl.textContent = "";
          errorEl.style.display = "none";
          updateInputStates();
          setTimeout(() => printBtn.focus(), 0);
          cleanupTrap = trapFocus(dialog);
        } else {
          if (cleanupTrap) {
            cleanupTrap();
            cleanupTrap = null;
          }
          if (previousFocus && previousFocus.focus) {
            previousFocus.focus();
            previousFocus = null;
          }
        }
      }
      if (prev.page !== next.page || prev.pageCount !== next.pageCount) {
        currentPageSpan.textContent = String(next.page);
        pageCount = next.pageCount;
        fromInput.max = String(next.pageCount);
        toInput.max = String(next.pageCount);
      }
    });
    const state = store.getState();
    currentPageSpan.textContent = String(state.page);
    pageCount = state.pageCount;
    fromInput.max = String(state.pageCount);
    toInput.max = String(state.pageCount);
    toInput.value = String(state.pageCount);
  }
  function destroy() {
    if (unsubRender)
      unsubRender();
    if (cleanupTrap) {
      cleanupTrap();
      cleanupTrap = null;
    }
    callbacks = null;
    previousFocus = null;
    overlay.remove();
  }
  return { el: overlay, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/components/LoadingOverlay.js
function createLoadingOverlay(showAttribution = true) {
  const overlay = document.createElement("div");
  overlay.className = "udoc-loading-overlay";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");
  overlay.style.display = "none";
  const content = document.createElement("div");
  content.className = "udoc-loading-content";
  const spinner = document.createElement("div");
  spinner.className = "udoc-loading-spinner";
  spinner.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-dashoffset="0">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
            </circle>
        </svg>
    `;
  const progressContainer = document.createElement("div");
  progressContainer.className = "udoc-loading-progress-container";
  const progressTrack = document.createElement("div");
  progressTrack.className = "udoc-loading-progress-track";
  const progressFill = document.createElement("div");
  progressFill.className = "udoc-loading-progress-fill";
  progressTrack.appendChild(progressFill);
  progressContainer.appendChild(progressTrack);
  const progressText = document.createElement("div");
  progressText.className = "udoc-loading-progress-text";
  progressText.setAttribute("aria-live", "polite");
  progressText.setAttribute("aria-atomic", "true");
  progressText.textContent = "Loading...";
  const branding = showAttribution ? createBranding({ variant: "loading-block" }) : null;
  if (branding)
    content.appendChild(branding.el);
  content.append(spinner, progressContainer, progressText);
  overlay.appendChild(content);
  let unsubRender = null;
  let showTimer = null;
  const SHOW_DELAY_MS = 300;
  function mount(container, store, i18n) {
    container.appendChild(overlay);
    progressText.textContent = i18n.t("loading.loading");
    branding?.start();
    unsubRender = store.subscribeRender((prev, next) => {
      const wasVisible = prev.isDownloading || prev.isProcessing || prev.isPrinting;
      const isVisible = next.isDownloading || next.isProcessing || next.isPrinting;
      if (wasVisible !== isVisible) {
        if (isVisible) {
          showTimer = setTimeout(() => {
            overlay.style.display = "flex";
            overlay.setAttribute("aria-busy", "true");
            showTimer = null;
          }, SHOW_DELAY_MS);
        } else {
          if (showTimer !== null) {
            clearTimeout(showTimer);
            showTimer = null;
          }
          overlay.style.display = "none";
          overlay.setAttribute("aria-busy", "false");
        }
      }
      if (next.isPrinting) {
        const { printCurrentPage, printTotalPages } = next;
        progressContainer.style.display = "";
        progressFill.classList.remove("udoc-loading-progress-fill--indeterminate");
        if (printCurrentPage === 0) {
          progressFill.style.width = "0%";
          progressText.textContent = i18n.t("loading.preparingPrint");
        } else {
          const percent = Math.round(printCurrentPage / printTotalPages * 100);
          progressFill.style.width = `${percent}%`;
          progressText.textContent = i18n.t("loading.renderingPage", {
            current: printCurrentPage,
            total: printTotalPages
          });
        }
      } else if (next.isProcessing) {
        progressContainer.style.display = "";
        progressFill.style.width = "100%";
        progressFill.classList.add("udoc-loading-progress-fill--indeterminate");
        progressText.textContent = i18n.t("loading.processing");
      } else if (next.isDownloading) {
        const { downloadLoaded, downloadTotal } = next;
        if (downloadLoaded === 0 && downloadTotal === 0) {
          progressContainer.style.display = "none";
          progressText.textContent = i18n.t("loading.connecting");
        } else if (downloadTotal > 0) {
          progressContainer.style.display = "";
          const percent = Math.round(downloadLoaded / downloadTotal * 100);
          progressFill.style.width = `${percent}%`;
          progressFill.classList.remove("udoc-loading-progress-fill--indeterminate");
          const loadedMB = (downloadLoaded / (1024 * 1024)).toFixed(1);
          const totalMB = (downloadTotal / (1024 * 1024)).toFixed(1);
          progressText.textContent = i18n.t("loading.progressSize", {
            loaded: loadedMB,
            total: totalMB,
            percent
          });
        } else {
          progressContainer.style.display = "";
          progressFill.style.width = "30%";
          progressFill.classList.add("udoc-loading-progress-fill--indeterminate");
          const loadedMB = (downloadLoaded / (1024 * 1024)).toFixed(1);
          progressText.textContent = i18n.t("loading.progressLoaded", { loaded: loadedMB });
        }
      }
    });
  }
  function destroy() {
    if (showTimer !== null) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    branding?.destroy();
    if (unsubRender) {
      unsubRender();
      unsubRender = null;
    }
    overlay.remove();
  }
  return { el: overlay, mount, destroy };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/styles-inline.js
var inlineStyles = `.udoc-viewer-root {
    /* === Theme Variables (Light) === */
    --udoc-bg-viewport: #e0e0e0;
    --udoc-bg-surface: #fff;
    --udoc-bg-panel: #f5f5f5;
    --udoc-bg-panel-tabs: #e8e8e8;
    --udoc-bg-page-header: #f0f0f0;
    --udoc-bg-reply: #fafafa;
    --udoc-bg-input: #fff;
    --udoc-bg-overlay: rgba(0, 0, 0, 0.5);
    --udoc-bg-loading: rgba(224, 224, 224, 0.95);

    --udoc-text-primary: rgba(0, 0, 0, 0.8);
    --udoc-text-secondary: rgba(0, 0, 0, 0.7);
    --udoc-text-tertiary: rgba(0, 0, 0, 0.6);
    --udoc-text-muted: rgba(0, 0, 0, 0.58);
    --udoc-text-faint: rgba(0, 0, 0, 0.52);
    --udoc-text-disabled: rgba(0, 0, 0, 0.25);
    --udoc-text-heading: #333;
    --udoc-text-body: #555;
    --udoc-text-label: #666;
    --udoc-text-subtle: #767676;
    --udoc-text-placeholder: #999;
    --udoc-text-on-primary: #fff;

    --udoc-primary: #333;
    --udoc-primary-hover: #1a1a1a;
    --udoc-primary-active-bg: rgba(0, 0, 0, 0.1);
    --udoc-primary-active-bg-hover: rgba(0, 0, 0, 0.14);
    --udoc-primary-subtle-bg: rgba(0, 0, 0, 0.06);
    --udoc-primary-focus-ring: rgba(0, 0, 0, 0.15);
    --udoc-primary-muted: rgba(0, 0, 0, 0.25);
    --udoc-primary-disabled: #94a3b8;

    --udoc-border: #ddd;
    --udoc-border-input: #ccc;
    --udoc-border-light: #eee;
    --udoc-border-medium: #e0e0e0;

    --udoc-hover-overlay: rgba(0, 0, 0, 0.08);
    --udoc-active-overlay: rgba(0, 0, 0, 0.12);
    --udoc-pressed-overlay: rgba(0, 0, 0, 0.15);
    --udoc-subtle-hover: rgba(0, 0, 0, 0.05);
    --udoc-faint-hover: rgba(0, 0, 0, 0.04);

    --udoc-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --udoc-shadow-page: 0 2px 8px rgba(0, 0, 0, 0.15);
    --udoc-shadow-toolbar: 0 2px 12px rgba(0, 0, 0, 0.15);
    --udoc-shadow-dropdown: 0 4px 16px rgba(0, 0, 0, 0.2);
    --udoc-shadow-dialog: 0 8px 32px rgba(0, 0, 0, 0.3);
    --udoc-shadow-panel: 4px 0 20px rgba(0, 0, 0, 0.15);

    --udoc-search-highlight: rgba(255, 200, 0, 0.35);
    --udoc-search-highlight-active: rgba(255, 140, 0, 0.6);
    --udoc-search-highlight-active-outline: rgba(255, 140, 0, 0.8);
    --udoc-search-match-bg: rgba(255, 200, 0, 0.4);
    --udoc-search-match-text: #000;
    --udoc-search-result-active-bg: rgba(0, 0, 0, 0.06);

    --udoc-text-selection: rgba(0, 120, 215, 0.5);
    --udoc-selection-color: rgb(0, 120, 215);

    --udoc-annotation-bg: #ffffc0;
    --udoc-annotation-header-bg: #f0f0c0;
    --udoc-annotation-border: #d4d4a0;

    --udoc-status-accepted-bg: #d4edda;
    --udoc-status-accepted-text: #155724;
    --udoc-status-rejected-bg: #f8d7da;
    --udoc-status-rejected-text: #721c24;
    --udoc-status-completed-bg: #cce5ff;
    --udoc-status-completed-text: #004085;
    --udoc-status-cancelled-bg: #e2e3e5;
    --udoc-status-cancelled-text: #383d41;
    --udoc-status-marked-bg: #fff3cd;
    --udoc-status-marked-text: #856404;

    --udoc-error-bg: #fef2f2;
    --udoc-error-border: #fecaca;
    --udoc-error-text: #dc2626;

    --udoc-progress-track: #e5e7eb;
    --udoc-progress-fill: #333;

    --udoc-scrollbar-thumb: rgba(0, 0, 0, 0.3);
    --udoc-scrollbar-thumb-hover: rgba(0, 0, 0, 0.5);

    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    container-type: inline-size;
    container-name: udoc-viewer;
    isolation: isolate;
}

.udoc-viewer-root.udoc-viewer-dark {
    --udoc-bg-viewport: #1a1a1a;
    --udoc-bg-surface: #2d2d2d;
    --udoc-bg-panel: #252525;
    --udoc-bg-panel-tabs: #1e1e1e;
    --udoc-bg-page-header: #2a2a2a;
    --udoc-bg-reply: #333;
    --udoc-bg-input: #3a3a3a;
    --udoc-bg-overlay: rgba(0, 0, 0, 0.7);
    --udoc-bg-loading: rgba(30, 30, 30, 0.95);

    --udoc-text-primary: rgba(255, 255, 255, 0.87);
    --udoc-text-secondary: rgba(255, 255, 255, 0.7);
    --udoc-text-tertiary: rgba(255, 255, 255, 0.6);
    --udoc-text-muted: rgba(255, 255, 255, 0.64);
    --udoc-text-faint: rgba(255, 255, 255, 0.56);
    --udoc-text-disabled: rgba(255, 255, 255, 0.25);
    --udoc-text-heading: #e0e0e0;
    --udoc-text-body: #bbb;
    --udoc-text-label: #aaa;
    --udoc-text-subtle: #a0a0a0;
    --udoc-text-placeholder: #777;
    --udoc-text-on-primary: #fff;

    --udoc-primary: #e0e0e0;
    --udoc-primary-hover: #f0f0f0;
    --udoc-primary-active-bg: rgba(255, 255, 255, 0.12);
    --udoc-primary-active-bg-hover: rgba(255, 255, 255, 0.16);
    --udoc-primary-subtle-bg: rgba(255, 255, 255, 0.07);
    --udoc-primary-focus-ring: rgba(255, 255, 255, 0.2);
    --udoc-primary-muted: rgba(255, 255, 255, 0.3);
    --udoc-primary-disabled: #4a5568;

    --udoc-border: #444;
    --udoc-border-input: #555;
    --udoc-border-light: #3a3a3a;
    --udoc-border-medium: #404040;

    --udoc-hover-overlay: rgba(255, 255, 255, 0.08);
    --udoc-active-overlay: rgba(255, 255, 255, 0.12);
    --udoc-pressed-overlay: rgba(255, 255, 255, 0.15);
    --udoc-subtle-hover: rgba(255, 255, 255, 0.05);
    --udoc-faint-hover: rgba(255, 255, 255, 0.04);

    --udoc-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
    --udoc-shadow-page: 0 2px 8px rgba(0, 0, 0, 0.4);
    --udoc-shadow-toolbar: 0 2px 12px rgba(0, 0, 0, 0.4);
    --udoc-shadow-dropdown: 0 4px 16px rgba(0, 0, 0, 0.5);
    --udoc-shadow-dialog: 0 8px 32px rgba(0, 0, 0, 0.6);
    --udoc-shadow-panel: 4px 0 20px rgba(0, 0, 0, 0.4);

    --udoc-search-highlight: rgba(255, 200, 0, 0.4);
    --udoc-search-highlight-active: rgba(255, 140, 0, 0.65);
    --udoc-search-highlight-active-outline: rgba(255, 140, 0, 0.85);
    --udoc-search-match-bg: rgba(255, 200, 0, 0.3);
    --udoc-search-match-text: #fff;
    --udoc-search-result-active-bg: rgba(255, 255, 255, 0.08);

    --udoc-text-selection: rgba(77, 166, 255, 0.5);
    --udoc-selection-color: rgb(77, 166, 255);

    --udoc-annotation-bg: #4a4a20;
    --udoc-annotation-header-bg: #3a3a18;
    --udoc-annotation-border: #5a5a30;

    --udoc-status-accepted-bg: #1a3a1a;
    --udoc-status-accepted-text: #6fcf6f;
    --udoc-status-rejected-bg: #3a1a1a;
    --udoc-status-rejected-text: #f08080;
    --udoc-status-completed-bg: #1a2a3a;
    --udoc-status-completed-text: #80b8ff;
    --udoc-status-cancelled-bg: #2a2a2a;
    --udoc-status-cancelled-text: #aaa;
    --udoc-status-marked-bg: #3a3520;
    --udoc-status-marked-text: #d4b44a;

    --udoc-error-bg: #3a1c1c;
    --udoc-error-border: #6b2c2c;
    --udoc-error-text: #f87171;

    --udoc-progress-track: #404040;
    --udoc-progress-fill: #e0e0e0;

    --udoc-scrollbar-thumb: rgba(255, 255, 255, 0.3);
    --udoc-scrollbar-thumb-hover: rgba(255, 255, 255, 0.5);
}

.udoc-viewer-root .udoc-toolbar-slot {
    flex: 0 0 auto;
    position: relative;
    z-index: 11;
}

.udoc-viewer-root .udoc-body-slot {
    flex: 1 1 auto;
    display: flex;
    overflow: hidden;
}

.udoc-viewer-root .udoc-left-panel-slot {
    flex: 0 0 auto;
}

.udoc-viewer-root .udoc-right-panel-slot {
    flex: 0 0 auto;
}

.udoc-viewer-root .udoc-viewport-slot {
    position: relative;
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.udoc-viewer-root .udoc-viewport {
    position: relative;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    background: var(--udoc-bg-viewport);
}

.udoc-viewer-root .udoc-sheet-tabs {
    display: flex;
    flex: 0 0 auto;
    align-items: flex-start;
    gap: 2px;
    padding: 0 8px;
    background: var(--udoc-bg-viewport);
    border-bottom: 1px solid var(--udoc-border);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
}

.udoc-viewer-root .udoc-sheet-tab {
    flex: 0 0 auto;
    padding: 4px 12px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: transparent;
    border: 1px solid transparent;
    border-top: none;
    border-radius: 0 0 4px 4px;
    color: var(--udoc-text-body);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
}

.udoc-viewer-root .udoc-sheet-tab:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-sheet-tab--active {
    background: var(--udoc-bg-surface);
    border-color: var(--udoc-border);
    color: var(--udoc-text-heading);
    font-weight: 600;
}

.udoc-viewer-root .udoc-viewport__content {
    position: relative;
    width: 100%;
    height: 100%;
}

.udoc-viewer-root .udoc-viewport__scroll {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    /* scrollbar visibility is managed dynamically by Viewport.ts */
}

.udoc-viewer-root .udoc-viewport__container {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
    /* height set dynamically for virtual scrolling */
}

/* Spread */
.udoc-viewer-root .udoc-spread {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-spread__wrapper {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    /* gap is set dynamically by Spread.ts based on pageSpacing */
}

.udoc-viewer-root .udoc-spread--hidden {
    display: none;
}

/* Page slot within spread */
.udoc-viewer-root .udoc-spread__slot {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    box-shadow: var(--udoc-shadow-page);
}

.udoc-viewer-root .udoc-viewport--seamless .udoc-spread__slot {
    box-shadow: none;
}

/* Continuous view mode: seamless stitching, no page chrome */
.udoc-viewer-root .udoc-viewport--continuous .udoc-spread__slot {
    box-shadow: none;
    background: transparent;
    --stitch-color: rgba(0, 0, 0, 0.15);
}

.udoc-viewer-dark .udoc-viewport--continuous .udoc-spread__slot {
    --stitch-color: rgba(255, 255, 255, 0.15);
}

.udoc-viewer-root .udoc-viewport--continuous .udoc-spread__slot::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;
    background-image:
        repeating-linear-gradient(
            to right,
            var(--stitch-color) 0,
            var(--stitch-color) 6px,
            transparent 6px,
            transparent 12px
        ),
        repeating-linear-gradient(
            to bottom,
            var(--stitch-color) 0,
            var(--stitch-color) 6px,
            transparent 6px,
            transparent 12px
        );
    background-size:
        100% 1px,
        1px 100%;
    background-position:
        bottom left,
        top right;
    background-repeat: repeat-x, repeat-y;
}

/* Hide bottom stitch line on last row */
.udoc-viewer-root .udoc-viewport--continuous .udoc-spread--last-row .udoc-spread__slot::after {
    background-image: repeating-linear-gradient(
        to bottom,
        var(--stitch-color) 0,
        var(--stitch-color) 6px,
        transparent 6px,
        transparent 12px
    );
    background-size: 1px 100%;
    background-position: top right;
    background-repeat: repeat-y;
}

/* Hide right stitch line on last column */
.udoc-viewer-root .udoc-viewport--continuous .udoc-spread--last-col .udoc-spread__slot::after {
    background-image: repeating-linear-gradient(
        to right,
        var(--stitch-color) 0,
        var(--stitch-color) 6px,
        transparent 6px,
        transparent 12px
    );
    background-size: 100% 1px;
    background-position: bottom left;
    background-repeat: repeat-x;
}

/* Hide both on last row + last column */
.udoc-viewer-root .udoc-viewport--continuous .udoc-spread--last-row.udoc-spread--last-col .udoc-spread__slot::after {
    background-image: none;
}

.udoc-viewer-root .udoc-spread__slot--empty {
    background: transparent;
    box-shadow: none;
}

.udoc-viewer-root .udoc-spread__preview-canvas {
    display: none;
    image-rendering: auto;
}

.udoc-viewer-root .udoc-spread__canvas {
    display: block;
}

/* Floating Toolbar */
.udoc-viewer-root .udoc-floating-toolbar {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 0 6px;
    background: var(--udoc-bg-surface);
    border-radius: 8px;
    box-shadow: var(--udoc-shadow-toolbar);
    z-index: 30;
    transition: opacity 0.3s ease;
}

.udoc-viewer-root .udoc-floating-toolbar--idle {
    opacity: 0;
    pointer-events: none;
}

/* Zoom Dropdown */
.udoc-viewer-root .udoc-zoom-dropdown {
    position: relative;
    height: 28px;
    display: flex;
    align-items: center;
}

.udoc-viewer-root .udoc-zoom-dropdown__toggle {
    display: flex;
    align-items: center;
    gap: 0;
    height: 100%;
    border: 1px solid var(--udoc-pressed-overlay);
    border-radius: 4px;
    background: transparent;
}

.udoc-viewer-root .udoc-zoom-dropdown__toggle:focus-within {
    border-color: var(--udoc-scrollbar-thumb);
    background: var(--udoc-bg-input);
}

.udoc-viewer-root .udoc-zoom-dropdown__input {
    width: 44px;
    padding: 2px 4px;
    border: none;
    border-radius: 4px 0 0 4px;
    background: transparent;
    color: var(--udoc-text-primary);
    font-size: 13px;
    text-align: center;
}

.udoc-viewer-root .udoc-zoom-dropdown__input:focus {
    outline: none;
}

.udoc-viewer-root .udoc-zoom-dropdown__chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 100%;
    padding: 2px 2px;
    border: none;
    border-left: 1px solid var(--udoc-subtle-hover);
    border-radius: 0 4px 4px 0;
    background: transparent;
    color: var(--udoc-text-muted);
    cursor: pointer;
}

.udoc-viewer-root .udoc-zoom-dropdown__chevron svg {
    width: 14px;
    height: 14px;
}

.udoc-viewer-root .udoc-zoom-dropdown__chevron:hover {
    background: var(--udoc-hover-overlay);
    color: var(--udoc-text-secondary);
}

.udoc-viewer-root .udoc-zoom-dropdown__chevron--active {
    background: var(--udoc-active-overlay);
}

.udoc-viewer-root .udoc-zoom-dropdown__chevron svg {
    width: 14px;
    height: 14px;
}

.udoc-viewer-root .udoc-zoom-dropdown__menu {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    padding: 6px;
    background: var(--udoc-bg-surface);
    border-radius: 8px;
    box-shadow: var(--udoc-shadow-dropdown);
    min-width: 100px;
}

.udoc-viewer-root .udoc-zoom-dropdown__section {
    display: flex;
    flex-direction: column;
}

.udoc-viewer-root .udoc-zoom-dropdown__divider {
    height: 1px;
    background: var(--udoc-subtle-hover);
    margin: 6px 0;
}

.udoc-viewer-root .udoc-zoom-dropdown__item {
    display: block;
    width: 100%;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--udoc-text-primary);
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
}

.udoc-viewer-root .udoc-zoom-dropdown__item:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-zoom-dropdown__item--active {
    background: var(--udoc-primary-active-bg);
    color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-zoom-dropdown__item--active:hover {
    background: var(--udoc-primary-active-bg-hover);
}

/* View Mode Menu */
.udoc-viewer-root .udoc-view-mode-menu {
    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
}

.udoc-viewer-root .udoc-view-mode-menu__dropdown {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    padding: 8px;
    background: var(--udoc-bg-surface);
    border-radius: 8px;
    box-shadow: var(--udoc-shadow-dropdown);
    min-width: 160px;
}

.udoc-viewer-root .udoc-view-mode-menu__section {
    margin-bottom: 8px;
}

.udoc-viewer-root .udoc-view-mode-menu__section:last-child {
    margin-bottom: 0;
}

.udoc-viewer-root .udoc-view-mode-menu__title {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--udoc-text-muted);
    margin-bottom: 4px;
    padding: 0 4px;
}

.udoc-viewer-root .udoc-view-mode-menu__options {
    display: flex;
    gap: 2px;
}

.udoc-viewer-root .udoc-view-mode-menu__option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--udoc-text-tertiary);
    cursor: pointer;
}

.udoc-viewer-root .udoc-view-mode-menu__option:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-view-mode-menu__option--active {
    background: var(--udoc-primary-active-bg);
    color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-view-mode-menu__option--active:hover {
    background: var(--udoc-primary-active-bg-hover);
}

.udoc-viewer-root .udoc-view-mode-menu__option--disabled {
    color: var(--udoc-text-disabled);
    cursor: default;
}

.udoc-viewer-root .udoc-view-mode-menu__option--disabled:hover {
    background: transparent;
}

.udoc-viewer-root .udoc-view-mode-menu__option-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.udoc-viewer-root .udoc-view-mode-menu__option-icon svg {
    width: 20px;
    height: 20px;
}

/* Left Panel */
.udoc-viewer-root .udoc-left-panel {
    position: relative;
    display: flex;
    width: 240px;
    height: 100%;
    background: var(--udoc-bg-panel);
    border-right: 1px solid var(--udoc-border);
    overflow: hidden;
    transition: width 0.2s ease;
}

.udoc-viewer-root .udoc-left-panel--closed {
    width: 0;
    border-right: none;
}

.udoc-viewer-root .udoc-left-panel__tabs {
    display: flex;
    flex-direction: column;
    width: 40px;
    background: var(--udoc-bg-panel-tabs);
    border-right: 1px solid var(--udoc-border);
}

.udoc-viewer-root .udoc-left-panel__tab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--udoc-text-label);
    cursor: pointer;
}

.udoc-viewer-root .udoc-left-panel__tab:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-left-panel__tab--active {
    background: var(--udoc-bg-panel);
    color: var(--udoc-text-heading);
    border-right: 2px solid var(--udoc-primary);
}

.udoc-viewer-root .udoc-left-panel__tab svg {
    width: 20px;
    height: 20px;
}

.udoc-viewer-root .udoc-left-panel__content {
    flex: 1;
    overflow: hidden;
}

.udoc-viewer-root .udoc-left-panel__resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    width: 4px;
    height: 100%;
    cursor: col-resize;
    background: transparent;
    z-index: 10;
}

.udoc-viewer-root .udoc-left-panel__resize-handle:hover,
.udoc-viewer-root .udoc-left-panel--resizing .udoc-left-panel__resize-handle {
    background: var(--udoc-primary-muted);
}

.udoc-viewer-root .udoc-left-panel--resizing {
    transition: none;
}

/* Thumbnail Panel */
.udoc-viewer-root .udoc-thumbnail-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.udoc-viewer-root .udoc-thumbnail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s ease;
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
}

.udoc-viewer-root .udoc-thumbnail-item:hover {
    background: var(--udoc-subtle-hover);
}

.udoc-viewer-root .udoc-thumbnail-item--active {
    background: var(--udoc-primary-subtle-bg);
    outline: 2px solid var(--udoc-primary);
    outline-offset: -2px;
}

.udoc-viewer-root .udoc-thumbnail-item__canvas {
    display: block;
    max-width: calc(100% - 16px);
    background: white;
    box-shadow: var(--udoc-shadow-sm);
}

.udoc-viewer-root .udoc-thumbnail-item__label {
    font-size: 11px;
    color: var(--udoc-text-label);
    text-align: center;
}

.udoc-viewer-root .udoc-thumbnail-item--active .udoc-thumbnail-item__label {
    color: var(--udoc-primary);
    font-weight: 500;
}

/* Outline Panel */
.udoc-viewer-root .udoc-outline-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 0;
}

.udoc-viewer-root .udoc-outline-panel__loading,
.udoc-viewer-root .udoc-panel-empty {
    padding: 16px;
    color: var(--udoc-text-subtle);
    font-size: 13px;
    text-align: center;
}

.udoc-viewer-root .udoc-outline-item {
    display: flex;
    flex-direction: column;
}

.udoc-viewer-root .udoc-outline-item__header {
    display: flex;
    align-items: center;
    padding: 6px 12px 6px 8px;
    gap: 4px;
    min-height: 28px;
}

.udoc-viewer-root .udoc-outline-item__header--clickable {
    cursor: pointer;
}

.udoc-viewer-root .udoc-outline-item__header--clickable:hover {
    background: var(--udoc-subtle-hover);
}

.udoc-viewer-root .udoc-outline-item__header--active {
    background: var(--udoc-primary-subtle-bg);
}

.udoc-viewer-root .udoc-outline-item__header--active .udoc-outline-item__title {
    color: var(--udoc-primary);
    font-weight: 500;
}

.udoc-viewer-root .udoc-outline-item__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--udoc-text-label);
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.15s ease;
}

.udoc-viewer-root .udoc-outline-item__toggle:hover {
    color: var(--udoc-text-heading);
}

.udoc-viewer-root .udoc-outline-item__toggle--expanded {
    transform: rotate(90deg);
}

.udoc-viewer-root .udoc-outline-item__spacer {
    width: 16px;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-outline-item__title {
    font-size: 13px;
    color: var(--udoc-text-heading);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

/* .udoc-outline-item__children: Indentation is handled via padding-left on header */

/* Layers panel */
.udoc-viewer-root .udoc-layers-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 0;
}

.udoc-viewer-root .udoc-layers-panel__loading,
.udoc-viewer-root .udoc-layers-panel__item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    gap: 8px;
    min-height: 32px;
    cursor: pointer;
}

.udoc-viewer-root .udoc-layers-panel__item:hover {
    background: var(--udoc-subtle-hover);
}

.udoc-viewer-root .udoc-layers-panel__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--udoc-text-heading);
    cursor: pointer;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-layers-panel__toggle svg {
    width: 18px;
    height: 18px;
}

.udoc-viewer-root .udoc-layers-panel__toggle:hover {
    color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-layers-panel__toggle--hidden {
    color: var(--udoc-text-subtle);
}

.udoc-viewer-root .udoc-layers-panel__label {
    font-size: 13px;
    color: var(--udoc-text-heading);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    cursor: pointer;
}

.udoc-viewer-root .udoc-layers-panel__label--hidden {
    color: var(--udoc-text-subtle);
}

.udoc-viewer-root .udoc-layers-panel__item--locked {
    cursor: default;
}

.udoc-viewer-root .udoc-layers-panel__item--locked .udoc-layers-panel__toggle {
    cursor: default;
    opacity: 0.5;
}

.udoc-viewer-root .udoc-layers-panel__item--locked .udoc-layers-panel__label {
    cursor: default;
}

.udoc-viewer-root .udoc-layers-panel__lock {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: var(--udoc-text-subtle);
}

.udoc-viewer-root .udoc-layers-panel__lock svg {
    width: 14px;
    height: 14px;
}

/* Fonts panel */
.udoc-viewer-root .udoc-fonts-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 0;
}

.udoc-viewer-root .udoc-fonts-panel__loading {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    gap: 8px;
    min-height: 32px;
    color: var(--udoc-text-subtle);
    font-size: 13px;
}

.udoc-viewer-root .udoc-fonts-panel__item {
    display: flex;
    flex-direction: column;
    padding: 6px 12px;
    gap: 2px;
}

.udoc-viewer-root .udoc-fonts-panel__item:hover {
    background: var(--udoc-subtle-hover);
}

.udoc-viewer-root .udoc-fonts-panel__spec {
    font-size: 13px;
    font-weight: 500;
    color: var(--udoc-text-heading);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.udoc-viewer-root .udoc-fonts-panel__tree {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding-left: 4px;
}

.udoc-viewer-root .udoc-fonts-panel__font-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 18px;
}

.udoc-viewer-root .udoc-fonts-panel__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1.5px solid var(--udoc-text-subtle);
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-fonts-panel__dot--primary {
    background: var(--udoc-text-heading);
    border-color: var(--udoc-text-heading);
}

.udoc-viewer-root .udoc-fonts-panel__font-name {
    font-size: 12px;
    color: var(--udoc-text-subtle);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.udoc-viewer-root .udoc-fonts-panel__font-row--fallback .udoc-fonts-panel__font-name {
    color: var(--udoc-text-label);
}

.udoc-viewer-root .udoc-fonts-panel__source {
    font-size: 10px;
    padding: 1px 5px;
    border-radius: 3px;
    background: var(--udoc-hover-overlay);
    color: var(--udoc-text-label);
    white-space: nowrap;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 0 4px;
    background: var(--udoc-bg-panel);
    border-bottom: 1px solid var(--udoc-border);
}

.udoc-viewer-root .udoc-toolbar__left,
.udoc-viewer-root .udoc-toolbar__right {
    display: flex;
    align-items: center;
    gap: 4px;
}

.udoc-viewer-root .udoc-toolbar__right {
    margin-left: auto;
}

.udoc-viewer-root .udoc-toolbar__spacer {
    flex: 1;
}

.udoc-viewer-root .udoc-toolbar__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--udoc-text-body);
    cursor: pointer;
}

.udoc-viewer-root .udoc-toolbar__btn:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-toolbar__btn:active {
    background: var(--udoc-active-overlay);
}

.udoc-viewer-root .udoc-toolbar__btn svg {
    width: 20px;
    height: 20px;
}

/* Toolbar center section (inline controls when floating toolbar is hidden) */
.udoc-viewer-root .udoc-toolbar__center {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: flex-start;
}

/* Overflow menu (hidden on desktop, shown on mobile) */
.udoc-viewer-root .udoc-overflow-menu {
    display: none;
    position: relative;
}

.udoc-viewer-root .udoc-overflow-menu__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    min-width: 180px;
    background: var(--udoc-bg-surface);
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    box-shadow: var(--udoc-shadow-dialog);
    padding: 4px 0;
    z-index: 80;
}

.udoc-viewer-root .udoc-overflow-menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: none;
    background: transparent;
    color: var(--udoc-text-body);
    font-size: 14px;
    cursor: pointer;
    text-align: left;
}

.udoc-viewer-root .udoc-overflow-menu__item:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-overflow-menu__item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-overflow-menu__item-icon svg {
    width: 18px;
    height: 18px;
}

.udoc-viewer-root .udoc-toolbar__group {
    display: flex;
    align-items: center;
    gap: 0;
}

.udoc-viewer-root .udoc-toolbar__divider {
    width: 1px;
    height: 20px;
    background: var(--udoc-border);
    margin: 0 2px;
}

.udoc-viewer-root .udoc-toolbar__btn--nav {
    width: 32px;
    height: 32px;
}

.udoc-viewer-root .udoc-toolbar__btn--nav svg {
    width: 18px;
    height: 18px;
}

.udoc-viewer-root .udoc-toolbar__page-info {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: var(--udoc-text-body);
}

.udoc-viewer-root .udoc-toolbar__page-input {
    width: 36px;
    height: 24px;
    border: 1px solid var(--udoc-border-input);
    border-radius: 3px;
    text-align: center;
    font-size: 13px;
    padding: 0 2px;
    background: var(--udoc-bg-input);
    color: var(--udoc-text-heading);
}

.udoc-viewer-root .udoc-toolbar__page-input:focus {
    outline: none;
    border-color: var(--udoc-text-placeholder);
}

.udoc-viewer-root .udoc-toolbar__page-total {
    font-size: 13px;
    color: var(--udoc-text-muted);
    white-space: nowrap;
}

/* Zoom dropdown in toolbar: drops down instead of up */
.udoc-viewer-root .udoc-zoom-dropdown--toolbar .udoc-zoom-dropdown__menu {
    bottom: auto;
    top: calc(100% + 8px);
}

/* View mode menu in toolbar: drops down instead of up */
.udoc-viewer-root .udoc-toolbar__center .udoc-view-mode-menu__dropdown {
    bottom: auto;
    top: calc(100% + 8px);
}

/* ===== Tool buttons (pointer split button & tool set buttons) ===== */

/* Split button container */
.udoc-viewer-root .udoc-toolbar__split-btn {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 4px;
}

.udoc-viewer-root .udoc-toolbar__split-btn--active {
    background: var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-toolbar__split-btn--active:hover {
    background: var(--udoc-primary-active-bg-hover);
}

.udoc-viewer-root .udoc-toolbar__split-btn-main {
    width: 26px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.udoc-viewer-root .udoc-toolbar__split-btn-drop {
    width: 16px;
    padding: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.udoc-viewer-root .udoc-toolbar__split-btn-drop svg {
    width: 12px;
    height: 12px;
}

/* Split button dropdown */
.udoc-viewer-root .udoc-toolbar__split-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 140px;
    background: var(--udoc-bg-surface);
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    box-shadow: var(--udoc-shadow-dialog);
    padding: 4px 0;
    z-index: 80;
}

.udoc-viewer-root .udoc-toolbar__split-dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 12px;
    border: none;
    background: transparent;
    color: var(--udoc-text-body);
    font-size: 13px;
    cursor: pointer;
    text-align: left;
}

.udoc-viewer-root .udoc-toolbar__split-dropdown-item:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-toolbar__split-dropdown-item--active {
    background: var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-toolbar__split-dropdown-item--active:hover {
    background: var(--udoc-primary-active-bg-hover);
}

.udoc-viewer-root .udoc-toolbar__split-dropdown-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-toolbar__split-dropdown-icon svg {
    width: 18px;
    height: 18px;
}

/* Tool set buttons active state */
.udoc-viewer-root .udoc-toolbar__btn--tool-active {
    background: var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-toolbar__btn--tool-active:hover {
    background: var(--udoc-primary-active-bg-hover);
}

/* ===== Sub-toolbar (tool options bar) ===== */

.udoc-viewer-root .udoc-subtoolbar-slot {
    flex: 0 0 auto;
    position: relative;
    z-index: 10;
}

.udoc-viewer-root .udoc-subtoolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 0 8px;
    background: var(--udoc-bg-panel);
    border-bottom: 1px solid var(--udoc-border);
}

.udoc-viewer-root .udoc-subtoolbar__tools {
    display: flex;
    align-items: center;
    gap: 2px;
}

.udoc-viewer-root .udoc-subtoolbar__undo {
    display: flex;
    align-items: center;
    gap: 2px;
}

.udoc-viewer-root .udoc-subtoolbar__divider {
    width: 1px;
    height: 20px;
    background: var(--udoc-border);
    margin: 0 4px;
}

.udoc-viewer-root .udoc-subtoolbar__options {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    overflow-x: auto;
}

.udoc-viewer-root .udoc-subtoolbar__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--udoc-text-body);
    cursor: pointer;
}

.udoc-viewer-root .udoc-subtoolbar__btn:disabled {
    opacity: 0.35;
    cursor: default;
}

.udoc-viewer-root .udoc-subtoolbar__btn:hover:not(:disabled) {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-subtoolbar__btn--active {
    background: var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-subtoolbar__btn--active:hover {
    background: var(--udoc-primary-active-bg-hover);
}

.udoc-viewer-root .udoc-subtoolbar__btn svg {
    width: 20px;
    height: 20px;
}

/* ---- Dropdown trigger (shared) ---- */
.udoc-viewer-root .udoc-subtoolbar__dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 28px;
    padding: 0 6px;
    border: 1px solid var(--udoc-border);
    border-radius: 4px;
    background: var(--udoc-bg-panel);
    cursor: pointer;
    color: var(--udoc-text-body);
    box-sizing: border-box;
}

.udoc-viewer-root .udoc-subtoolbar__dropdown-trigger:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-subtoolbar__dropdown-trigger--icon svg {
    width: 20px;
    height: 20px;
}

.udoc-viewer-root .udoc-subtoolbar__dropdown-arrow {
    font-size: 10px;
    line-height: 1;
    color: var(--udoc-text-muted);
}

/* ---- Color swatch in trigger ---- */
.udoc-viewer-root .udoc-subtoolbar__color-swatch {
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    padding: 0;
    box-sizing: border-box;
    pointer-events: none;
}

/* Stroke swatch: outlined ring */
.udoc-viewer-root .udoc-subtoolbar__color-swatch--stroke {
    background: transparent;
    border: 3px solid var(--swatch-color);
}

/* Stroke none: dashed ring */
.udoc-viewer-root .udoc-subtoolbar__color-swatch--stroke-none {
    border-color: var(--udoc-text-muted);
    border-style: dashed;
    border-width: 2px;
}

/* Fill swatch: solid disc */
.udoc-viewer-root .udoc-subtoolbar__color-swatch--fill {
    background: var(--swatch-color);
    border: 2px solid var(--udoc-border);
}

/* Fill none: diagonal strike */
.udoc-viewer-root .udoc-subtoolbar__color-swatch--fill-none {
    background: transparent;
    position: relative;
    overflow: hidden;
}

.udoc-viewer-root .udoc-subtoolbar__color-swatch--fill-none::after {
    content: "";
    position: absolute;
    width: 140%;
    height: 2px;
    background: var(--udoc-text-muted);
    top: 50%;
    left: -20%;
    transform: rotate(-45deg);
}

/* ---- NumberInput trigger ---- */
.udoc-viewer-root .udoc-number-input__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    width: 68px;
    height: 28px;
    padding: 0 4px;
    border: 1px solid var(--udoc-border);
    border-radius: 4px;
    background: var(--udoc-bg-panel);
    cursor: pointer;
    color: var(--udoc-text-body);
    box-sizing: border-box;
}

.udoc-viewer-root .udoc-number-input__trigger:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-number-input__icon {
    display: flex;
    align-items: center;
    width: 14px;
    height: 14px;
    color: var(--udoc-text-muted);
}

.udoc-viewer-root .udoc-number-input__icon svg {
    width: 14px;
    height: 14px;
}

.udoc-viewer-root .udoc-number-input__value {
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
}

/* ---- NumberInput floating panel ---- */
.udoc-viewer-root .udoc-number-input-panel {
    display: none;
    position: absolute;
    top: 100%;
    margin-top: 2px;
    padding: 8px 10px;
    background: var(--udoc-bg-panel);
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
}

.udoc-viewer-root .udoc-number-input-panel--open {
    display: flex;
    align-items: center;
    gap: 8px;
}

.udoc-viewer-root .udoc-number-input-panel__slider {
    width: 100px;
    height: 4px;
    cursor: pointer;
    accent-color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-number-input-panel__text {
    width: 48px;
    text-align: center;
    border: 1px solid var(--udoc-border);
    border-radius: 4px;
    padding: 3px 4px;
    font-size: 11px;
    font-family: inherit;
    color: var(--udoc-text-body);
    background: var(--udoc-bg-panel);
    box-sizing: border-box;
}

.udoc-viewer-root .udoc-number-input-panel__text:focus {
    outline: 2px solid var(--udoc-primary);
    outline-offset: -1px;
}

/* ---- Color panel (floating) ---- */
.udoc-viewer-root .udoc-color-panel {
    display: none;
    position: absolute;
    top: 100%;
    margin-top: 2px;
    padding: 8px;
    background: var(--udoc-bg-panel);
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
}

.udoc-viewer-root .udoc-color-panel--open {
    display: block;
}

.udoc-viewer-root .udoc-color-panel__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    justify-items: center;
}

/* Base swatch (shared) */
.udoc-viewer-root .udoc-color-panel__swatch {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    box-sizing: border-box;
}

/* Fill panel: solid discs with subtle border */
.udoc-viewer-root .udoc-color-panel__grid--fill .udoc-color-panel__swatch:not(.udoc-color-panel__swatch--none) {
    background: var(--swatch-color);
    border: 2px solid rgba(0, 0, 0, 0.1);
}

/* Stroke panel: outlined rings */
.udoc-viewer-root .udoc-color-panel__grid--stroke .udoc-color-panel__swatch:not(.udoc-color-panel__swatch--none) {
    background: transparent;
    border: 3px solid var(--swatch-color);
}

/* Hover: both use outline */
.udoc-viewer-root .udoc-color-panel__swatch:hover:not(.udoc-color-panel__swatch--active) {
    outline: 2px solid var(--udoc-text-muted);
    outline-offset: 1px;
}

/* Active: both use outline */
.udoc-viewer-root .udoc-color-panel__swatch--active:not(.udoc-color-panel__swatch--none) {
    outline: 2px solid var(--udoc-primary);
    outline-offset: 2px;
}

/* None swatch \u2014 shared base */
.udoc-viewer-root .udoc-color-panel__swatch--none {
    background: transparent;
    cursor: pointer;
}

.udoc-viewer-root .udoc-color-panel__swatch--none.udoc-color-panel__swatch--active {
    outline: 2px solid var(--udoc-primary);
    outline-offset: 2px;
}

/* None stroke: dashed ring (matches toolbar trigger) */
.udoc-viewer-root .udoc-color-panel__swatch--none-stroke {
    border: 2px dashed var(--udoc-text-muted);
}

/* None fill: diagonal strike (matches toolbar trigger) */
.udoc-viewer-root .udoc-color-panel__swatch--none-fill {
    border: 2px solid var(--udoc-border);
    position: relative;
    overflow: hidden;
}

.udoc-viewer-root .udoc-color-panel__swatch--none-fill::after {
    content: "";
    position: absolute;
    width: 140%;
    height: 2px;
    background: var(--udoc-text-muted);
    top: 50%;
    left: -20%;
    transform: rotate(-45deg);
}

.udoc-viewer-root .udoc-color-panel__swatch--none:hover {
    border-color: var(--udoc-text-muted);
}

/* ---- Line style panel (floating) ---- */
.udoc-viewer-root .udoc-linestyle-panel {
    display: none;
    position: absolute;
    top: 100%;
    margin-top: 2px;
    padding: 4px;
    background: var(--udoc-bg-panel);
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
}

.udoc-viewer-root .udoc-linestyle-panel--open {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.udoc-viewer-root .udoc-linestyle-panel__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    color: var(--udoc-text-body);
}

.udoc-viewer-root .udoc-linestyle-panel__item:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-linestyle-panel__item--active {
    background: var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-linestyle-panel__icon {
    display: flex;
    width: 24px;
    height: 24px;
}

.udoc-viewer-root .udoc-linestyle-panel__icon svg {
    width: 24px;
    height: 24px;
}

.udoc-viewer-root .udoc-linestyle-panel__label {
    font-size: 11px;
}

/* ---- Arrow head panel (floating) ---- */
.udoc-viewer-root .udoc-arrowhead-panel {
    display: none;
    position: absolute;
    top: 100%;
    margin-top: 2px;
    padding: 8px;
    background: var(--udoc-bg-panel);
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
}

.udoc-viewer-root .udoc-arrowhead-panel--open {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.udoc-viewer-root .udoc-arrowhead-panel__row {
    display: flex;
    align-items: center;
    gap: 4px;
}

.udoc-viewer-root .udoc-arrowhead-panel__row-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--udoc-text-muted);
    letter-spacing: 0.05em;
    width: 36px;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-arrowhead-panel__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    color: var(--udoc-text-body);
}

.udoc-viewer-root .udoc-arrowhead-panel__btn svg {
    width: 20px;
    height: 20px;
}

.udoc-viewer-root .udoc-arrowhead-panel__btn:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-arrowhead-panel__btn--active {
    background: var(--udoc-primary-active-bg);
}

/* Right Panel */
.udoc-viewer-root .udoc-right-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100%;
    background: var(--udoc-bg-panel);
    border-left: 1px solid var(--udoc-border);
    overflow: hidden;
    transition: width 0.2s ease;
}

.udoc-viewer-root .udoc-right-panel--closed {
    width: 0;
    border-left: none;
}

.udoc-viewer-root .udoc-right-panel__resize-handle {
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    cursor: col-resize;
    background: transparent;
    z-index: 10;
}

.udoc-viewer-root .udoc-right-panel__resize-handle:hover,
.udoc-viewer-root .udoc-right-panel--resizing .udoc-right-panel__resize-handle {
    background: var(--udoc-primary-muted);
}

.udoc-viewer-root .udoc-right-panel--resizing {
    transition: none;
}

.udoc-viewer-root .udoc-right-panel__content {
    flex: 1;
    overflow: auto;
}

/* Text Layer (for text selection) */
.udoc-viewer-root .udoc-spread__text-layer {
    position: absolute;
    overflow: hidden;
    /* user-select: none prevents selection from starting/extending in gaps */
    user-select: none;
    pointer-events: auto;
    z-index: 1;
    /* Isolate compositing so overlapping run ::selection backgrounds
       don't double-darken.  Selection is painted opaque inside the group,
       then the whole layer is rendered at reduced opacity onto the page. */
    isolation: isolate;
    opacity: 0.6;
}

/* Layout structure containers \u2014 each positioned relative to its parent */
.udoc-viewer-root .udoc-text-frame,
.udoc-viewer-root .udoc-text-parcel,
.udoc-viewer-root .udoc-text-line,
.udoc-viewer-root .udoc-text-table,
.udoc-viewer-root .udoc-text-row,
.udoc-viewer-root .udoc-text-cell,
.udoc-viewer-root .udoc-text-grid {
    position: absolute;
}

.udoc-viewer-root .udoc-text-run {
    position: absolute;
    color: transparent;
    white-space: pre;
    line-height: 1;
    font-family: sans-serif;
    overflow: hidden;
    /* Allow selection on actual text runs */
    user-select: text;
}

.udoc-viewer-root .udoc-text-run::selection {
    background: var(--udoc-text-selection);
}

/* Text selection disabled */
.udoc-viewer--no-text-select .udoc-spread__text-layer {
    pointer-events: none;
}

.udoc-viewer--no-text-select .udoc-text-run {
    user-select: none;
}

/* View tool cursors */
.udoc-viewer--tool-hand .udoc-viewport__scroll {
    cursor: grab;
}

.udoc-viewer--tool-hand-grabbing .udoc-viewport__scroll {
    cursor: grabbing;
}

.udoc-viewer--tool-hand .udoc-spread__text-layer,
.udoc-viewer--tool-hand-grabbing .udoc-spread__text-layer {
    pointer-events: none;
}

.udoc-viewer--tool-hand .udoc-text-run,
.udoc-viewer--tool-hand-grabbing .udoc-text-run {
    user-select: none;
}

.udoc-viewer--tool-zoom .udoc-viewport__scroll {
    cursor: zoom-in;
}

.udoc-viewer--tool-zoom-out .udoc-viewport__scroll {
    cursor: zoom-out;
}

.udoc-viewer--tool-zoom .udoc-spread__text-layer {
    pointer-events: none;
}

.udoc-viewer--tool-zoom .udoc-text-run {
    user-select: none;
}

/* Annotation draw tool cursor */
.udoc-viewer--tool-draw .udoc-viewport__scroll {
    cursor: crosshair;
    touch-action: none;
}

.udoc-viewer--tool-draw .udoc-spread__text-layer {
    pointer-events: none;
}

.udoc-viewer--tool-draw .udoc-text-run {
    user-select: none;
}

/* Annotation Layer */
.udoc-viewer-root .udoc-spread__annotation-layer {
    position: absolute;
    pointer-events: none;
    z-index: 2;
}

/* Base annotation */
.udoc-viewer-root .udoc-annotation {
    position: absolute;
    box-sizing: border-box;
}

/* Link annotation */
.udoc-viewer-root .udoc-annotation--link {
    pointer-events: auto;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.udoc-viewer-root .udoc-annotation--link:hover {
    background-color: var(--udoc-primary-active-bg);
}

/* Highlight annotation */
.udoc-viewer-root .udoc-annotation--highlight {
    pointer-events: none;
}

.udoc-viewer-root .udoc-annotation__quad {
    mix-blend-mode: multiply;
}

/* Underline annotation */
.udoc-viewer-root .udoc-annotation--underline {
    pointer-events: none;
}

/* StrikeOut annotation */
.udoc-viewer-root .udoc-annotation--strikeout {
    pointer-events: none;
}

/* Squiggly annotation */
.udoc-viewer-root .udoc-annotation--squiggly {
    pointer-events: none;
}

/* Text (sticky note) annotation */
.udoc-viewer-root .udoc-annotation--text {
    pointer-events: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.15s ease;
}

.udoc-viewer-root .udoc-annotation--text:hover {
    filter: brightness(1.1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.udoc-viewer-root .udoc-annotation--text svg {
    width: 100%;
    height: 100%;
}

/* Annotation popup */
.udoc-viewer-root .udoc-annotation-popup {
    position: absolute;
    z-index: 30;
    min-width: 200px;
    max-width: 300px;
    background: var(--udoc-annotation-bg);
    border: 1px solid var(--udoc-annotation-border);
    border-radius: 4px;
    box-shadow: var(--udoc-shadow-page);
    font-size: 12px;
    color: var(--udoc-text-heading);
    pointer-events: auto;
}

.udoc-viewer-root .udoc-annotation-popup__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    background: var(--udoc-annotation-header-bg);
    border-bottom: 1px solid var(--udoc-annotation-border);
    border-radius: 4px 4px 0 0;
}

.udoc-viewer-root .udoc-annotation-popup__author {
    font-weight: 600;
    color: var(--udoc-text-body);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.udoc-viewer-root .udoc-annotation-popup__close {
    width: 16px;
    height: 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    flex-shrink: 0;
    margin-left: 8px;
}

.udoc-viewer-root .udoc-annotation-popup__close:hover {
    opacity: 1;
}

.udoc-viewer-root .udoc-annotation-popup__close svg {
    width: 12px;
    height: 12px;
}

.udoc-viewer-root .udoc-annotation-popup__content {
    padding: 8px;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 200px;
    overflow-y: auto;
}

/* FreeText annotation */
.udoc-viewer-root .udoc-annotation--freetext {
    pointer-events: auto;
    overflow: hidden;
    font-size: 12px;
    padding: 2px;
}

/* Stamp annotation */
.udoc-viewer-root .udoc-annotation--stamp {
    pointer-events: none;
}

/* Caret annotation - rendered via SVG, minimal styling needed */
.udoc-viewer-root .udoc-annotation--caret {
    pointer-events: none;
}

/* Shape annotations - rendered via SVG overlay */
.udoc-viewer-root .udoc-annotation--line,
.udoc-viewer-root .udoc-annotation--square,
.udoc-viewer-root .udoc-annotation--circle,
.udoc-viewer-root .udoc-annotation--polygon,
.udoc-viewer-root .udoc-annotation--polyLine,
.udoc-viewer-root .udoc-annotation--ink {
    pointer-events: none;
}

/* Redact annotation */
.udoc-viewer-root .udoc-annotation--redact {
    pointer-events: none;
}

/* Annotation Panel */
.udoc-viewer-root .udoc-annotation-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.udoc-viewer-root .udoc-annotation-panel__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--udoc-text-subtle);
    font-size: 13px;
}

/* Comments List */
.udoc-viewer-root .udoc-comments-list {
    display: flex;
    flex-direction: column;
}

/* Page Group */
.udoc-viewer-root .udoc-comments-page-group {
    border-bottom: 1px solid var(--udoc-border-medium);
}

.udoc-viewer-root .udoc-comments-page-group:last-child {
    border-bottom: none;
}

.udoc-viewer-root .udoc-comments-page-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    cursor: pointer;
    user-select: none;
    background: var(--udoc-bg-page-header);
    transition: background 0.15s;
}

.udoc-viewer-root .udoc-comments-page-header:hover {
    background: var(--udoc-bg-panel-tabs);
}

.udoc-viewer-root .udoc-comments-page-header svg {
    width: 16px;
    height: 16px;
    color: var(--udoc-text-label);
    flex-shrink: 0;
    transition: transform 0.2s ease;
}

.udoc-viewer-root .udoc-comments-page-header span {
    font-size: 13px;
    font-weight: 500;
    color: var(--udoc-text-heading);
}

.udoc-viewer-root .udoc-comments-page-count {
    margin-left: auto;
    padding: 2px 6px;
    background: var(--udoc-border);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    color: var(--udoc-text-label);
}

/* Collapsed state */
.udoc-viewer-root .udoc-comments-page-group--collapsed .udoc-comments-page-header svg {
    transform: rotate(-90deg);
}

.udoc-viewer-root .udoc-comments-page-group--collapsed .udoc-comments-page-content {
    display: none;
}

/* Page Content */
.udoc-viewer-root .udoc-comments-page-content {
    display: flex;
    flex-direction: column;
}

/* Comment Item */
.udoc-viewer-root .udoc-comment-item {
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid var(--udoc-border-light);
}

.udoc-viewer-root .udoc-comment-item:last-child {
    border-bottom: none;
}

.udoc-viewer-root .udoc-comment-item:hover {
    background: var(--udoc-subtle-hover);
}

/* Reply indentation */
.udoc-viewer-root .udoc-comment-reply {
    background: var(--udoc-bg-reply);
}

.udoc-viewer-root .udoc-comment-depth-1 {
    padding-left: 28px;
}

.udoc-viewer-root .udoc-comment-depth-2 {
    padding-left: 44px;
}

.udoc-viewer-root .udoc-comment-depth-3 {
    padding-left: 60px;
}

/* Comment Icon */
.udoc-viewer-root .udoc-comment-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--udoc-text-subtle);
}

.udoc-viewer-root .udoc-comment-icon svg {
    width: 16px;
    height: 16px;
}

/* Comment Body */
.udoc-viewer-root .udoc-comment-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* Comment Header */
.udoc-viewer-root .udoc-comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.udoc-viewer-root .udoc-comment-author {
    font-size: 12px;
    font-weight: 600;
    color: var(--udoc-text-heading);
}

/* Status Badge */
.udoc-viewer-root .udoc-comment-status {
    padding: 1px 6px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 500;
    text-transform: capitalize;
}

.udoc-viewer-root .udoc-comment-status--accepted {
    background: var(--udoc-status-accepted-bg);
    color: var(--udoc-status-accepted-text);
}

.udoc-viewer-root .udoc-comment-status--rejected {
    background: var(--udoc-status-rejected-bg);
    color: var(--udoc-status-rejected-text);
}

.udoc-viewer-root .udoc-comment-status--completed {
    background: var(--udoc-status-completed-bg);
    color: var(--udoc-status-completed-text);
}

.udoc-viewer-root .udoc-comment-status--cancelled {
    background: var(--udoc-status-cancelled-bg);
    color: var(--udoc-status-cancelled-text);
}

.udoc-viewer-root .udoc-comment-status--marked {
    background: var(--udoc-status-marked-bg);
    color: var(--udoc-status-marked-text);
}

.udoc-viewer-root .udoc-comment-status--unmarked {
    background: var(--udoc-status-cancelled-bg);
    color: var(--udoc-status-cancelled-text);
}

/* Comment Contents */
.udoc-viewer-root .udoc-comment-contents {
    font-size: 12px;
    color: var(--udoc-text-body);
    line-height: 1.4;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
}

/* Reply Toggle */
.udoc-viewer-root .udoc-comment-toggle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    margin-top: 4px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--udoc-primary);
    font-size: 11px;
    cursor: pointer;
    transition: background 0.15s;
}

.udoc-viewer-root .udoc-comment-toggle:hover {
    background: var(--udoc-primary-subtle-bg);
}

.udoc-viewer-root .udoc-comment-toggle svg {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
}

.udoc-viewer-root .udoc-comment-toggle--expanded svg {
    transform: rotate(90deg);
}

/* Replies Container */
.udoc-viewer-root .udoc-comment-replies {
    display: flex;
    flex-direction: column;
}

.udoc-viewer-root .udoc-comment-replies--collapsed {
    display: none;
}

/* Annotation Highlight Animation */
@keyframes udoc-annotation-pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.7);
    }
    50% {
        box-shadow: 0 0 0 8px rgba(0, 102, 204, 0.3);
    }
    100% {
        box-shadow: 0 0 0 12px rgba(0, 102, 204, 0);
    }
}

.udoc-viewer-root .udoc-annotation--highlighted {
    animation: udoc-annotation-pulse 1.5s ease-out;
    outline: 2px solid var(--udoc-primary);
    outline-offset: 2px;
    border-radius: 2px;
    z-index: 20;
}

/* Highlight indicator for full-layer markup annotations */
.udoc-viewer-root .udoc-annotation-highlight-indicator {
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
    animation: udoc-annotation-pulse 1.5s ease-out;
    outline: 2px solid var(--udoc-primary);
    outline-offset: 2px;
    border-radius: 2px;
    z-index: 20;
}

/* Annotation select tool */
.udoc-viewer--tool-select .udoc-viewport__scroll {
    touch-action: none;
}

.udoc-viewer--tool-select .udoc-spread__text-layer {
    pointer-events: none;
}

.udoc-viewer--tool-select .udoc-text-run {
    user-select: none;
}

/* SVG shape annotations: the <svg> root is transparent to pointer events;
   only painted child geometry catches hits. This keeps empty SVG space
   passing through to the PDF text underneath while painted shapes still
   fire \`annotation:hover\`/\`annotation:click\` in all tool modes. Rules live
   in CSS (not inline on the element) so host apps can override with a
   normal selector \u2014 no \`!important\` needed. Cursor affordance stays scoped
   to the select tool, where clicking a painted shape selects it. */
.udoc-spread__annotation-layer svg[data-annotation-index] {
    pointer-events: none;
}
.udoc-spread__annotation-layer svg[data-annotation-index] * {
    pointer-events: visiblePainted;
}
.udoc-viewer--tool-select .udoc-spread__annotation-layer svg[data-annotation-index] * {
    cursor: pointer;
}

/* HTML-based annotations (markup quads, text icons, etc.): make children
   clickable only in the select tool. The parent container keeps
   \`pointer-events: none\` inline so the highlight/underline/etc. fill stays
   transparent to text selection during normal reading; the \`!important\`
   override here re-enables hits on the children for the select tool only. */
.udoc-viewer--tool-select .udoc-spread__annotation-layer div[data-annotation-index] > * {
    pointer-events: auto !important;
    cursor: pointer;
}

/* Selected annotation bounding box */
.udoc-viewer-root .udoc-annotation-select-bbox {
    pointer-events: none;
    z-index: 10;
    overflow: visible;
}

.udoc-viewer-root .udoc-annotation-select-bbox__inner {
    box-sizing: border-box;
    border: 2px solid var(--udoc-selection-color);
    cursor: grab;
    pointer-events: auto;
}

/* Resize handles */
.udoc-viewer-root .udoc-annotation-select-bbox__handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    border: 2px solid var(--udoc-selection-color);
    border-radius: 2px;
    pointer-events: auto;
    box-sizing: border-box;
}

/* Corner handles */
.udoc-annotation-select-bbox__handle--nw {
    top: -5px;
    left: -5px;
}
.udoc-annotation-select-bbox__handle--ne {
    top: -5px;
    right: -5px;
}
.udoc-annotation-select-bbox__handle--se {
    bottom: -5px;
    right: -5px;
}
.udoc-annotation-select-bbox__handle--sw {
    bottom: -5px;
    left: -5px;
}

/* Edge midpoint handles */
.udoc-annotation-select-bbox__handle--n {
    top: -5px;
    left: 50%;
    margin-left: -5px;
}
.udoc-annotation-select-bbox__handle--e {
    top: 50%;
    right: -5px;
    margin-top: -5px;
}
.udoc-annotation-select-bbox__handle--s {
    bottom: -5px;
    left: 50%;
    margin-left: -5px;
}
.udoc-annotation-select-bbox__handle--w {
    top: 50%;
    left: -5px;
    margin-top: -5px;
}

/* Moving annotation cursor */
.udoc-viewer--annotation-moving .udoc-viewport__scroll {
    cursor: grabbing !important;
}

.udoc-viewer--annotation-moving .udoc-annotation-select-bbox__inner {
    cursor: grabbing;
}

/* Resizing annotation \u2014 lock cursor globally */
.udoc-viewer--annotation-resizing .udoc-viewport__scroll {
    cursor: inherit !important;
}

/* Delete button in sub-toolbar */
.udoc-viewer-root .udoc-subtoolbar__btn--delete {
    transition:
        color 0.15s ease,
        opacity 0.15s ease;
}

.udoc-viewer-root .udoc-subtoolbar__btn--delete:disabled {
    opacity: 0.35;
    cursor: default;
}

.udoc-viewer-root .udoc-subtoolbar__btn--delete:not(:disabled):hover {
    color: var(--udoc-error-text);
}

/* Mobile Panel Overlay */
.udoc-viewer-root .udoc-panel-overlay {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--udoc-bg-overlay);
    z-index: 40;
}

/* ===== Responsive: Small Mobile (\u2264480px) ===== */
@container udoc-viewer (max-width: 480px) {
    /* Make body-slot a positioning context */
    .udoc-viewer-root .udoc-body-slot {
        position: relative;
    }

    /* Collapse panels to slide-out drawers */
    .udoc-viewer-root .udoc-left-panel {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 280px !important;
        z-index: 50;
        transform: translateX(-100%);
        transition: transform 0.2s ease;
    }

    .udoc-viewer-root .udoc-left-panel:not(.udoc-left-panel--closed) {
        transform: translateX(0);
        box-shadow: var(--udoc-shadow-panel);
    }

    .udoc-viewer-root .udoc-left-panel--closed {
        width: 280px !important;
        transform: translateX(-100%);
    }

    .udoc-viewer-root .udoc-right-panel {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 280px !important;
        z-index: 50;
        transform: translateX(100%);
        transition: transform 0.2s ease;
    }

    .udoc-viewer-root .udoc-right-panel:not(.udoc-right-panel--closed) {
        transform: translateX(0);
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    }

    .udoc-viewer-root .udoc-right-panel--closed {
        width: 280px !important;
        transform: translateX(100%);
    }

    /* Show overlay when panel is open */
    .udoc-viewer-root.udoc-panel-open .udoc-panel-overlay {
        display: block;
    }

    /* Viewport becomes flex column so floating toolbar is a footer */
    .udoc-viewer-root .udoc-viewport {
        display: flex;
        flex-direction: column;
    }

    .udoc-viewer-root .udoc-viewport__content {
        flex: 1 1 auto;
        overflow: hidden;
    }

    /* Convert floating bar to full-width footer toolbar */
    .udoc-viewer-root .udoc-floating-toolbar {
        position: relative;
        bottom: auto;
        left: auto;
        flex: 0 0 auto;
        transform: none;
        border-radius: 0;
        box-sizing: border-box;
        background: var(--udoc-bg-panel);
        border-top: 1px solid var(--udoc-border);
        box-shadow: none;
        height: 40px;
        padding: 0 4px;
        gap: 4px;
        max-width: none;
        justify-content: center;
    }

    /* Raise toolbar above slide-out panels so overflow dropdown is not hidden */
    .udoc-viewer-root .udoc-toolbar-slot {
        z-index: 60;
    }

    /* Hide individual right-section buttons on mobile; show overflow menu */
    .udoc-viewer-root .udoc-toolbar__btn--search,
    .udoc-viewer-root .udoc-toolbar__btn--comments,
    .udoc-viewer-root .udoc-toolbar__btn--print,
    .udoc-viewer-root .udoc-toolbar__btn--download,
    .udoc-viewer-root .udoc-toolbar__btn--theme,
    .udoc-viewer-root .udoc-toolbar__btn--fullscreen {
        display: none !important;
    }

    .udoc-viewer-root .udoc-overflow-menu {
        display: block;
    }

    /* Panel tab buttons for touch */
    .udoc-viewer-root .udoc-left-panel__tabs {
        width: 32px;
        padding: 8px 0;
    }

    .udoc-viewer-root .udoc-left-panel__tab {
        width: 32px;
        height: 32px;
    }

    .udoc-viewer-root .udoc-left-panel__tab svg {
        width: 18px;
        height: 18px;
    }

    /* Toolbar adjustments */
    .udoc-viewer-root .udoc-toolbar {
        padding: 0 4px;
    }

    .udoc-viewer-root .udoc-toolbar__btn {
        box-sizing: border-box;
        padding: 6px;
    }

    /* View mode menu - right align */
    .udoc-viewer-root .udoc-view-mode-menu__dropdown {
        left: auto;
        right: 0;
    }

    .udoc-viewer-root .udoc-zoom-dropdown__item {
        padding: 12px 16px;
    }

    .udoc-viewer-root .udoc-view-mode-menu__option {
        width: 36px;
        height: 36px;
    }
}

/* ===== Password Dialog ===== */
.udoc-viewer-root .udoc-password-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--udoc-bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 80;
}

.udoc-viewer-root .udoc-password-dialog {
    background: var(--udoc-bg-surface);
    border-radius: 12px;
    box-shadow: var(--udoc-shadow-dialog);
    padding: 24px;
    max-width: 360px;
    width: 90%;
}

.udoc-viewer-root .udoc-password-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.udoc-viewer-root .udoc-password-icon {
    width: 32px;
    height: 32px;
    color: var(--udoc-text-label);
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-password-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--udoc-text-heading);
}

.udoc-viewer-root .udoc-password-message {
    margin: 0 0 20px 0;
    font-size: 14px;
    color: var(--udoc-text-label);
    line-height: 1.5;
}

.udoc-viewer-root .udoc-password-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.udoc-viewer-root .udoc-password-input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    background: var(--udoc-bg-input);
    transition:
        border-color 0.15s,
        box-shadow 0.15s;
}

.udoc-viewer-root .udoc-password-input-wrapper:focus-within {
    border-color: var(--udoc-primary);
    box-shadow: 0 0 0 3px var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-password-input {
    flex: 1;
    padding: 12px 14px;
    border: none;
    border-radius: 8px 0 0 8px;
    background: transparent;
    font-size: 15px;
    color: var(--udoc-text-heading);
    outline: none;
}

.udoc-viewer-root .udoc-password-input::placeholder {
    color: var(--udoc-text-placeholder);
}

.udoc-viewer-root .udoc-password-input:disabled {
    background: var(--udoc-bg-panel);
    color: var(--udoc-text-placeholder);
}

.udoc-viewer-root .udoc-password-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--udoc-text-subtle);
    cursor: pointer;
    transition: color 0.15s;
}

.udoc-viewer-root .udoc-password-toggle:hover {
    color: var(--udoc-text-heading);
}

.udoc-viewer-root .udoc-password-toggle svg {
    width: 20px;
    height: 20px;
}

.udoc-viewer-root .udoc-password-error {
    margin: 0;
    padding: 8px 12px;
    background: var(--udoc-error-bg);
    border: 1px solid var(--udoc-error-border);
    border-radius: 6px;
    font-size: 13px;
    color: var(--udoc-error-text);
}

.udoc-viewer-root .udoc-password-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: var(--udoc-primary);
    color: var(--udoc-text-on-primary);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
}

.udoc-viewer-root .udoc-password-submit:hover:not(:disabled) {
    background: var(--udoc-primary-hover);
}

.udoc-viewer-root .udoc-password-submit:disabled {
    background: var(--udoc-primary-disabled);
    cursor: not-allowed;
}

.udoc-viewer-root .udoc-password-submit-spinner svg {
    width: 20px;
    height: 20px;
}

/* ===== Print Dialog ===== */
.udoc-viewer-root .udoc-print-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--udoc-bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 90;
}

.udoc-viewer-root .udoc-print-dialog {
    background: var(--udoc-bg-surface);
    border-radius: 12px;
    box-shadow: var(--udoc-shadow-dialog);
    padding: 24px;
    max-width: 400px;
    width: 90%;
}

.udoc-viewer-root .udoc-print-title {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--udoc-text-heading);
}

.udoc-viewer-root .udoc-print-section {
    margin-bottom: 16px;
}

.udoc-viewer-root .udoc-print-section-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--udoc-text-label);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.udoc-viewer-root .udoc-print-radios {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.udoc-viewer-root .udoc-print-radio {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--udoc-text-heading);
    cursor: pointer;
    padding: 4px 0;
}

.udoc-viewer-root .udoc-print-radio input[type="radio"] {
    accent-color: var(--udoc-primary);
    margin: 0;
    cursor: pointer;
}

.udoc-viewer-root .udoc-print-input {
    padding: 4px 8px;
    border: 1px solid var(--udoc-border);
    border-radius: 6px;
    background: var(--udoc-bg-input);
    color: var(--udoc-text-heading);
    font-size: 14px;
    outline: none;
    transition:
        border-color 0.15s,
        box-shadow 0.15s;
}

.udoc-viewer-root .udoc-print-input:focus {
    border-color: var(--udoc-primary);
    box-shadow: 0 0 0 3px var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-print-input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.udoc-viewer-root .udoc-print-input[type="number"] {
    width: 64px;
}

.udoc-viewer-root .udoc-print-input[type="text"] {
    flex: 1;
    min-width: 0;
}

.udoc-viewer-root .udoc-print-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--udoc-border);
    border-radius: 8px;
    background: var(--udoc-bg-input);
    color: var(--udoc-text-heading);
    font-size: 14px;
    outline: none;
    cursor: pointer;
    transition:
        border-color 0.15s,
        box-shadow 0.15s;
}

.udoc-viewer-root .udoc-print-select:focus {
    border-color: var(--udoc-primary);
    box-shadow: 0 0 0 3px var(--udoc-primary-active-bg);
}

.udoc-viewer-root .udoc-print-error {
    margin: 0 0 12px 0;
    padding: 8px 12px;
    background: var(--udoc-error-bg);
    border: 1px solid var(--udoc-error-border);
    border-radius: 6px;
    font-size: 13px;
    color: var(--udoc-error-text);
    display: none;
}

.udoc-viewer-root .udoc-print-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
}

.udoc-viewer-root .udoc-print-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
}

.udoc-viewer-root .udoc-print-btn--cancel {
    background: transparent;
    color: var(--udoc-text-label);
}

.udoc-viewer-root .udoc-print-btn--cancel:hover {
    background: var(--udoc-bg-hover);
}

.udoc-viewer-root .udoc-print-btn--print {
    background: var(--udoc-primary);
    color: var(--udoc-text-on-primary);
}

.udoc-viewer-root .udoc-print-btn--print:hover {
    background: var(--udoc-primary-hover);
}

/* ===== Loading Overlay ===== */
.udoc-viewer-root .udoc-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--udoc-bg-loading);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 70;
    backdrop-filter: blur(2px);
}

.udoc-viewer-root .udoc-loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px;
}

.udoc-viewer-root .udoc-loading-spinner {
    width: 40px;
    height: 40px;
    color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-loading-spinner svg {
    width: 100%;
    height: 100%;
}

.udoc-viewer-root .udoc-loading-progress-container {
    width: 240px;
}

.udoc-viewer-root .udoc-loading-progress-track {
    width: 100%;
    height: 6px;
    background: var(--udoc-progress-track);
    border-radius: 3px;
    overflow: hidden;
}

.udoc-viewer-root .udoc-loading-progress-fill {
    height: 100%;
    background: var(--udoc-progress-fill);
    border-radius: 3px;
    width: 0%;
    transition: width 0.2s ease-out;
}

.udoc-viewer-root .udoc-loading-progress-fill--indeterminate {
    animation: udoc-loading-indeterminate 1.5s ease-in-out infinite;
}

@keyframes udoc-loading-indeterminate {
    0% {
        transform: translateX(-100%);
    }
    50% {
        transform: translateX(233%);
    }
    100% {
        transform: translateX(-100%);
    }
}

.udoc-viewer-root .udoc-loading-progress-text {
    font-size: 13px;
    color: var(--udoc-text-label);
    text-align: center;
}

/* Logo path colors live inside the Branding component's shadow root (see
   components/Branding.ts) so external CSS cannot select them. */

/* =============================================================================
   Search Panel
   ============================================================================= */

.udoc-viewer-root .udoc-search-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: 13px;
}

.udoc-viewer-root .udoc-search-panel__header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 12px 8px;
}

.udoc-viewer-root .udoc-search-panel__input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    border: 1px solid var(--udoc-border-input);
    border-radius: 4px;
    background: var(--udoc-bg-input);
    overflow: hidden;
}

.udoc-viewer-root .udoc-search-panel__input-wrapper:focus-within {
    border-color: var(--udoc-primary);
    box-shadow: 0 0 0 2px var(--udoc-primary-focus-ring);
}

.udoc-viewer-root .udoc-search-panel__input-icon {
    display: flex;
    align-items: center;
    padding: 0 6px 0 8px;
    color: var(--udoc-text-placeholder);
}

.udoc-viewer-root .udoc-search-panel__input-icon svg {
    width: 14px;
    height: 14px;
}

.udoc-viewer-root .udoc-search-panel__input {
    flex: 1;
    border: none;
    outline: none;
    padding: 6px 8px 6px 0;
    font-size: 13px;
    min-width: 0;
    background: transparent;
}

/* Suppress focus ring on the inner input \u2014 the wrapper handles :focus-within */
.udoc-viewer-root .udoc-search-panel__input:focus-visible {
    outline: none;
}

.udoc-viewer-root .udoc-search-panel__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 4px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--udoc-text-placeholder);
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-search-panel__clear:hover {
    background: var(--udoc-hover-overlay);
    color: var(--udoc-text-body);
}

.udoc-viewer-root .udoc-search-panel__clear svg {
    width: 14px;
    height: 14px;
}

.udoc-viewer-root .udoc-search-panel__clear:focus-visible {
    outline: none;
}

.udoc-viewer-root .udoc-search-panel__case {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--udoc-border-input);
    border-radius: 4px;
    background: var(--udoc-bg-input);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: var(--udoc-text-label);
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-search-panel__case:hover {
    background: var(--udoc-bg-page-header);
}

.udoc-viewer-root .udoc-search-panel__case--active {
    background: var(--udoc-primary);
    color: var(--udoc-text-on-primary);
    border-color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-search-panel__case--active:hover {
    background: var(--udoc-primary-hover);
}

.udoc-viewer-root .udoc-search-panel__fuzzy {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--udoc-border-input);
    border-radius: 4px;
    background: var(--udoc-bg-input);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: var(--udoc-text-label);
    flex-shrink: 0;
}

.udoc-viewer-root .udoc-search-panel__fuzzy:hover {
    background: var(--udoc-bg-page-header);
}

.udoc-viewer-root .udoc-search-panel__fuzzy--active {
    background: var(--udoc-primary);
    color: var(--udoc-text-on-primary);
    border-color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-search-panel__fuzzy--active:hover {
    background: var(--udoc-primary-hover);
}

.udoc-viewer-root .udoc-search-panel__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    border-bottom: 1px solid var(--udoc-border-light);
    min-height: 32px;
}

.udoc-viewer-root .udoc-search-panel__status {
    color: var(--udoc-text-label);
    font-size: 12px;
}

.udoc-viewer-root .udoc-search-panel__nav-buttons {
    display: flex;
    gap: 2px;
}

.udoc-viewer-root .udoc-search-panel__nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    color: var(--udoc-text-heading);
    padding: 0;
}

.udoc-viewer-root .udoc-search-panel__nav-btn svg {
    width: 16px;
    height: 16px;
}

.udoc-viewer-root .udoc-search-panel__nav-btn:hover {
    background: var(--udoc-hover-overlay);
}

.udoc-viewer-root .udoc-search-panel__nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
}

.udoc-viewer-root .udoc-search-panel__nav-btn:disabled:hover {
    background: transparent;
}

.udoc-viewer-root .udoc-search-panel__results {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

.udoc-viewer-root .udoc-search-result__page-header {
    padding: 8px 12px 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--udoc-text-placeholder);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    background: var(--udoc-bg-surface);
    z-index: 1;
}

.udoc-viewer-root .udoc-search-result {
    padding: 6px 12px;
    cursor: pointer;
    font-size: 12px;
    line-height: 1.4;
    color: var(--udoc-text-heading);
    border-left: 3px solid transparent;
}

.udoc-viewer-root .udoc-search-result:hover {
    background: var(--udoc-faint-hover);
}

.udoc-viewer-root .udoc-search-result--active {
    background: var(--udoc-search-result-active-bg);
    border-left-color: var(--udoc-primary);
}

.udoc-viewer-root .udoc-search-result__context {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    color: var(--udoc-text-body);
}

.udoc-viewer-root .udoc-search-result__match {
    background: var(--udoc-search-match-bg);
    color: var(--udoc-search-match-text);
    border-radius: 2px;
    padding: 0 1px;
}

/* =============================================================================
   Search Highlights on Pages
   ============================================================================= */

.udoc-viewer-root .udoc-spread__search-highlight-layer {
    position: absolute;
    pointer-events: none;
}

.udoc-viewer-root .udoc-spread__custom-page-overlay-layer {
    position: absolute;
    pointer-events: none;
    /* Above annotation layer (z-index: 2) so host overlays sit on top of every built-in layer. */
    z-index: 3;
}

.udoc-viewer-root .udoc-search-highlight {
    background-color: var(--udoc-search-highlight);
    mix-blend-mode: multiply;
    border-radius: 1px;
}

.udoc-viewer-root .udoc-search-highlight--active {
    background-color: var(--udoc-search-highlight-active);
    outline: 2px solid var(--udoc-search-highlight-active-outline);
    outline-offset: 1px;
}

/* Dark mode blend mode overrides */
.udoc-viewer-root.udoc-viewer-dark .udoc-annotation__quad {
    mix-blend-mode: screen;
}

.udoc-viewer-root.udoc-viewer-dark .udoc-search-highlight {
    mix-blend-mode: screen;
}

/* === Accessibility === */

/* Screen-reader-only utility (visually hidden but accessible) */
.udoc-viewer-root .udoc-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Skip navigation link */
.udoc-viewer-root .udoc-skip-link {
    position: absolute;
    top: -100px;
    left: 0;
    z-index: 100;
    padding: 8px 16px;
    background: var(--udoc-bg-surface);
    color: var(--udoc-text-heading);
    text-decoration: none;
    font-size: 14px;
    border-radius: 0 0 4px 0;
    box-shadow: var(--udoc-shadow-sm);
}

.udoc-viewer-root .udoc-skip-link:focus {
    top: 0;
}

/* Keyboard focus indicators */
.udoc-viewer-root :focus-visible {
    outline: 2px solid var(--udoc-primary);
    outline-offset: 2px;
}

.udoc-viewer-root :focus:not(:focus-visible) {
    outline: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .udoc-viewer-root,
    .udoc-viewer-root * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* High contrast preference */
@media (prefers-contrast: more) {
    .udoc-viewer-root {
        --udoc-border: #000;
        --udoc-border-input: #000;
        --udoc-text-muted: rgba(0, 0, 0, 0.7);
        --udoc-text-faint: rgba(0, 0, 0, 0.6);
        --udoc-primary-focus-ring: rgba(0, 0, 0, 0.4);
    }

    .udoc-viewer-root.udoc-viewer-dark {
        --udoc-border: #aaa;
        --udoc-border-input: #aaa;
        --udoc-text-muted: rgba(255, 255, 255, 0.7);
        --udoc-text-faint: rgba(255, 255, 255, 0.6);
        --udoc-primary-focus-ring: rgba(255, 255, 255, 0.45);
    }

    .udoc-viewer-root :focus-visible {
        outline-width: 3px;
    }
}

/* Forced colors (Windows High Contrast) */
@media (forced-colors: active) {
    .udoc-viewer-root .udoc-thumbnail-item--active {
        outline: 3px solid Highlight;
    }

    .udoc-viewer-root .udoc-toolbar__btn,
    .udoc-viewer-root .udoc-left-panel__tab {
        border: 1px solid ButtonText;
    }

    .udoc-viewer-root .udoc-left-panel__tab--active {
        background: Highlight;
        color: HighlightText;
    }

    .udoc-viewer-root .udoc-search-highlight {
        outline: 2px solid Highlight;
    }
}

/* Resize handle focus styles */
.udoc-viewer-root .udoc-left-panel__resize-handle:focus-visible,
.udoc-viewer-root .udoc-right-panel__resize-handle:focus-visible {
    background: var(--udoc-primary-muted);
    outline: 2px solid var(--udoc-primary);
    outline-offset: -2px;
}

/* Touch target sizes for coarse pointers (panels and side UI only \u2014 toolbars handle their own sizing) */
@media (pointer: coarse) {
    .udoc-viewer-root .udoc-left-panel__tab {
        width: 32px;
        height: 32px;
    }

    .udoc-viewer-root .udoc-left-panel__tabs {
        width: 32px;
    }

    .udoc-viewer-root .udoc-outline-item__toggle {
        min-width: 32px;
        min-height: 32px;
    }
}
`;

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/en.js
var en = {
  // Shell / regions
  "shell.skipToDocument": "Skip to document",
  "shell.regionToolbar": "Toolbar",
  "shell.regionSidePanel": "Side panel",
  "shell.regionDocument": "Document",
  "shell.regionSearchComments": "Search and comments",
  "shell.pageOfTotal": "Page {page} of {pageCount}",
  "shell.zoomPercent": "Zoom {percent}%",
  "shell.panelOpened": "{panel} panel opened",
  "shell.panelClosed": "Panel closed",
  "shell.shortcutHelp": "Keyboard shortcuts: F6 to navigate regions, Ctrl+F to search, Ctrl+P to print, Ctrl+Plus to zoom in, Ctrl+Minus to zoom out, Ctrl+0 to reset zoom, Escape to close panels. Press ? for a list of shortcuts.",
  "shell.shortcutHelpAnnounce": "Keyboard shortcuts: F6 navigate regions, Ctrl+F search, Ctrl+P print, Ctrl+Plus zoom in, Ctrl+Minus zoom out, Ctrl+0 reset zoom, Escape close panel, ? show this help.",
  // Toolbar
  "toolbar.label": "Document toolbar",
  "toolbar.menu": "Menu",
  "toolbar.search": "Search",
  "toolbar.comments": "Comments",
  "toolbar.print": "Print",
  "toolbar.download": "Download",
  "toolbar.fullscreen": "Fullscreen",
  "toolbar.exitFullscreen": "Exit fullscreen",
  "toolbar.darkMode": "Dark mode",
  "toolbar.systemTheme": "System theme",
  "toolbar.lightMode": "Light mode",
  "toolbar.previousPage": "Previous page",
  "toolbar.nextPage": "Next page",
  "toolbar.pageNumber": "Page number",
  "toolbar.zoomIn": "Zoom in",
  "toolbar.zoomOut": "Zoom out",
  "toolbar.zoomLevel": "Zoom level",
  "toolbar.zoomOptions": "Zoom options",
  "toolbar.zoomLevels": "Zoom levels",
  "toolbar.more": "More",
  // Zoom modes
  "zoom.fitWidth": "Fit Width",
  "zoom.fitHeight": "Fit Height",
  "zoom.fitPage": "Fit Page",
  // Floating toolbar
  "floatingToolbar.label": "Page navigation and zoom",
  // Search panel
  "search.placeholder": "Search in document...",
  "search.label": "Search text",
  "search.matchCase": "Match case",
  "search.fuzzyMatch": "Fuzzy match",
  "search.previousMatch": "Previous match (Shift+Enter)",
  "search.nextMatch": "Next match (Enter)",
  "search.loadingText": "Loading text\u2026",
  "search.noResults": "No results",
  "search.resultStatus": "{current} of {total}",
  "search.pageHeader": "Page {page}",
  "search.resultsLabel": "Search results",
  // Password dialog
  "password.title": "Password Required",
  "password.message": "This document is protected. Please enter the password to open it.",
  "password.placeholder": "Enter password",
  "password.label": "Password",
  "password.showPassword": "Show password",
  "password.hidePassword": "Hide password",
  "password.unlock": "Unlock",
  // Print dialog
  "print.title": "Print",
  "print.pagesLabel": "Pages",
  "print.allPages": "All pages",
  "print.currentPage": "Current page ({page})",
  "print.pagesRange": "Pages",
  "print.pagesTo": "to",
  "print.custom": "Custom",
  "print.customPlaceholder": "e.g. 1,3,5-8",
  "print.qualityLabel": "Quality",
  "print.qualityDraft": "Draft (150 DPI)",
  "print.qualityStandard": "Standard (300 DPI)",
  "print.qualityHigh": "High (600 DPI)",
  "print.cancel": "Cancel",
  "print.print": "Print",
  "print.errorPageRange": "Please enter page numbers between 1 and {max}.",
  "print.errorStartEnd": "Start page must be less than or equal to end page.",
  "print.errorCustomRange": 'Invalid range. Use format like "1,3,5-8". Pages must be between 1 and {max}.',
  // Loading overlay
  "loading.connecting": "Connecting...",
  "loading.loading": "Loading...",
  "loading.processing": "Processing document...",
  "loading.preparingPrint": "Preparing to print...",
  "loading.renderingPage": "Rendering page {current} of {total}...",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "{loaded} MB loaded...",
  // View mode menu
  "viewMode.label": "View settings",
  "viewMode.view": "View",
  "viewMode.paged": "Paged",
  "viewMode.continuousView": "Continuous",
  "viewMode.scroll": "Scroll",
  "viewMode.layout": "Layout",
  "viewMode.rotation": "Rotation",
  "viewMode.spacing": "Spacing",
  "viewMode.spread": "Spread",
  "viewMode.continuous": "Continuous",
  "viewMode.single": "Single",
  "viewMode.double": "Double",
  "viewMode.coverRight": "Cover Right",
  "viewMode.coverLeft": "Cover Left",
  "viewMode.spacingAll": "All",
  "viewMode.spacingNone": "None",
  "viewMode.spacingSpread": "Spread",
  "viewMode.spacingPage": "Page",
  // Annotation panel
  "annotations.comments": "Comments",
  "annotations.noComments": "No comments in this document",
  "annotations.loading": "Loading comments...",
  "annotations.replyCount": "{count} replies",
  "annotations.replyCountSingle": "1 reply",
  "annotations.showReplies": "Show replies",
  "annotations.hideReplies": "Hide replies",
  "annotations.pageHeader": "Page {page}",
  // Outline panel
  "outline.label": "Document outline",
  "outline.loading": "Loading outline...",
  "outline.empty": "No outline in this document",
  // Bookmarks panel
  "bookmarks.empty": "No bookmarks in this document",
  // Layers panel
  "layers.loading": "Loading layers...",
  "layers.empty": "No layers in this document",
  // Attachments panel
  "attachments.empty": "No attachments in this document",
  "layers.visibility": "{name} layer visibility",
  // Fonts panel
  "fonts.loading": "Loading fonts...",
  "fonts.empty": "No font usage data available",
  // Thumbnail panel
  "thumbnails.label": "Page thumbnails",
  "thumbnails.pageLabel": "Page {page}",
  // Spread / page rendering
  "spread.pageLabel": "Page {page}",
  "spread.pageContent": "Page {page} content",
  "spread.rendering": "Rendering...",
  // Viewport
  "viewport.documentContent": "Document content",
  // Left panel tabs
  "leftPanel.tabs": "Panel tabs",
  "leftPanel.thumbnails": "Thumbnails",
  "leftPanel.outline": "Outline",
  "leftPanel.bookmarks": "Bookmarks",
  "leftPanel.layers": "Layers",
  "leftPanel.attachments": "Attachments",
  "leftPanel.fonts": "Fonts",
  "leftPanel.resizeHandle": "Resize side panel",
  // Right panel
  "rightPanel.searchPanel": "Search panel",
  "rightPanel.commentsPanel": "Comments panel",
  "rightPanel.resizeHandle": "Resize panel",
  // Tools
  "tools.pointer": "Pointer",
  "tools.hand": "Hand",
  "tools.zoom": "Zoom",
  "tools.annotate": "Annotate",
  "tools.markup": "Markup",
  "tools.subtoolbar": "Tool options",
  // Shared sub-tools
  "tools.select": "Select",
  "tools.deleteAnnotation": "Delete annotation",
  // Annotate sub-tools
  "tools.freehand": "Freehand",
  "tools.line": "Line",
  "tools.arrow": "Arrow",
  "tools.rectangle": "Rectangle",
  "tools.ellipse": "Ellipse",
  "tools.polygon": "Polygon",
  "tools.polyline": "Polyline",
  "tools.textbox": "Text box",
  // Markup sub-tools
  "tools.highlight": "Highlight",
  "tools.underline": "Underline",
  "tools.strikethrough": "Strikethrough",
  "tools.squiggly": "Squiggly",
  // Tool options
  "tools.strokeColor": "Stroke color",
  "tools.fillColor": "Fill color",
  "tools.noFill": "No fill",
  "tools.strokeWidth": "Stroke width",
  "tools.opacity": "Opacity",
  "tools.fontSize": "Font size",
  "tools.lineStyle": "Line style",
  "tools.lineStyleSolid": "Solid",
  "tools.lineStyleDashed": "Dashed",
  "tools.lineStyleDotted": "Dotted",
  "tools.arrowHeadStart": "Start",
  "tools.arrowHeadEnd": "End",
  "tools.arrowHeadNone": "None",
  "tools.arrowHeadOpen": "Open",
  "tools.arrowHeadClosed": "Closed",
  // Undo/Redo
  "tools.undo": "Undo",
  "tools.redo": "Redo"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/zh-CN.js
var zhCN = {
  // Shell / regions
  "shell.skipToDocument": "\u8DF3\u8F6C\u5230\u6587\u6863",
  "shell.regionToolbar": "\u5DE5\u5177\u680F",
  "shell.regionSidePanel": "\u4FA7\u8FB9\u9762\u677F",
  "shell.regionDocument": "\u6587\u6863",
  "shell.regionSearchComments": "\u641C\u7D22\u4E0E\u6279\u6CE8",
  "shell.pageOfTotal": "\u7B2C {page} \u9875\uFF0C\u5171 {pageCount} \u9875",
  "shell.zoomPercent": "\u7F29\u653E {percent}%",
  "shell.panelOpened": "{panel}\u9762\u677F\u5DF2\u6253\u5F00",
  "shell.panelClosed": "\u9762\u677F\u5DF2\u5173\u95ED",
  "shell.shortcutHelp": "\u5FEB\u6377\u952E\uFF1AF6 \u5207\u6362\u533A\u57DF\uFF0CCtrl+F \u641C\u7D22\uFF0CCtrl+P \u6253\u5370\uFF0CCtrl+Plus \u653E\u5927\uFF0CCtrl+Minus \u7F29\u5C0F\uFF0CCtrl+0 \u91CD\u7F6E\u7F29\u653E\uFF0CEscape \u5173\u95ED\u9762\u677F\u3002\u6309 ? \u67E5\u770B\u5FEB\u6377\u952E\u5217\u8868\u3002",
  "shell.shortcutHelpAnnounce": "\u5FEB\u6377\u952E\uFF1AF6 \u5207\u6362\u533A\u57DF\uFF0CCtrl+F \u641C\u7D22\uFF0CCtrl+P \u6253\u5370\uFF0CCtrl+Plus \u653E\u5927\uFF0CCtrl+Minus \u7F29\u5C0F\uFF0CCtrl+0 \u91CD\u7F6E\u7F29\u653E\uFF0CEscape \u5173\u95ED\u9762\u677F\uFF0C? \u663E\u793A\u6B64\u5E2E\u52A9\u3002",
  // Toolbar
  "toolbar.label": "\u6587\u6863\u5DE5\u5177\u680F",
  "toolbar.menu": "\u83DC\u5355",
  "toolbar.search": "\u641C\u7D22",
  "toolbar.comments": "\u6279\u6CE8",
  "toolbar.print": "\u6253\u5370",
  "toolbar.download": "\u4E0B\u8F7D",
  "toolbar.fullscreen": "\u5168\u5C4F",
  "toolbar.exitFullscreen": "\u9000\u51FA\u5168\u5C4F",
  "toolbar.darkMode": "\u6DF1\u8272\u6A21\u5F0F",
  "toolbar.systemTheme": "\u8DDF\u968F\u7CFB\u7EDF",
  "toolbar.lightMode": "\u6D45\u8272\u6A21\u5F0F",
  "toolbar.previousPage": "\u4E0A\u4E00\u9875",
  "toolbar.nextPage": "\u4E0B\u4E00\u9875",
  "toolbar.pageNumber": "\u9875\u7801",
  "toolbar.zoomIn": "\u653E\u5927",
  "toolbar.zoomOut": "\u7F29\u5C0F",
  "toolbar.zoomLevel": "\u7F29\u653E\u7EA7\u522B",
  "toolbar.zoomOptions": "\u7F29\u653E\u9009\u9879",
  "toolbar.zoomLevels": "\u7F29\u653E\u7EA7\u522B",
  "toolbar.more": "\u66F4\u591A",
  // Zoom modes
  "zoom.fitWidth": "\u9002\u5408\u5BBD\u5EA6",
  "zoom.fitHeight": "\u9002\u5408\u9AD8\u5EA6",
  "zoom.fitPage": "\u9002\u5408\u9875\u9762",
  // Floating toolbar
  "floatingToolbar.label": "\u9875\u9762\u5BFC\u822A\u4E0E\u7F29\u653E",
  // Search panel
  "search.placeholder": "\u5728\u6587\u6863\u4E2D\u641C\u7D22\u2026",
  "search.label": "\u641C\u7D22\u6587\u672C",
  "search.matchCase": "\u533A\u5206\u5927\u5C0F\u5199",
  "search.fuzzyMatch": "\u6A21\u7CCA\u5339\u914D",
  "search.previousMatch": "\u4E0A\u4E00\u4E2A\u5339\u914D (Shift+Enter)",
  "search.nextMatch": "\u4E0B\u4E00\u4E2A\u5339\u914D (Enter)",
  "search.loadingText": "\u6B63\u5728\u52A0\u8F7D\u6587\u672C\u2026",
  "search.noResults": "\u65E0\u7ED3\u679C",
  "search.resultStatus": "\u7B2C {current} \u9879\uFF0C\u5171 {total} \u9879",
  "search.pageHeader": "\u7B2C {page} \u9875",
  "search.resultsLabel": "\u641C\u7D22\u7ED3\u679C",
  // Password dialog
  "password.title": "\u9700\u8981\u5BC6\u7801",
  "password.message": "\u6B64\u6587\u6863\u53D7\u5BC6\u7801\u4FDD\u62A4\uFF0C\u8BF7\u8F93\u5165\u5BC6\u7801\u4EE5\u6253\u5F00\u3002",
  "password.placeholder": "\u8F93\u5165\u5BC6\u7801",
  "password.label": "\u5BC6\u7801",
  "password.showPassword": "\u663E\u793A\u5BC6\u7801",
  "password.hidePassword": "\u9690\u85CF\u5BC6\u7801",
  "password.unlock": "\u89E3\u9501",
  // Print dialog
  "print.title": "\u6253\u5370",
  "print.pagesLabel": "\u9875\u9762\u8303\u56F4",
  "print.allPages": "\u5168\u90E8\u9875\u9762",
  "print.currentPage": "\u5F53\u524D\u9875 ({page})",
  "print.pagesRange": "\u9875\u9762\u8303\u56F4",
  "print.pagesTo": "\u81F3",
  "print.custom": "\u81EA\u5B9A\u4E49",
  "print.customPlaceholder": "\u4F8B\u5982 1,3,5-8",
  "print.qualityLabel": "\u8D28\u91CF",
  "print.qualityDraft": "\u8349\u7A3F (150 DPI)",
  "print.qualityStandard": "\u6807\u51C6 (300 DPI)",
  "print.qualityHigh": "\u9AD8\u8D28\u91CF (600 DPI)",
  "print.cancel": "\u53D6\u6D88",
  "print.print": "\u6253\u5370",
  "print.errorPageRange": "\u8BF7\u8F93\u5165 1 \u5230 {max} \u4E4B\u95F4\u7684\u9875\u7801\u3002",
  "print.errorStartEnd": "\u8D77\u59CB\u9875\u4E0D\u80FD\u5927\u4E8E\u7ED3\u675F\u9875\u3002",
  "print.errorCustomRange": '\u683C\u5F0F\u65E0\u6548\uFF0C\u8BF7\u4F7F\u7528\u7C7B\u4F3C "1,3,5-8" \u7684\u683C\u5F0F\u3002\u9875\u7801\u987B\u5728 1 \u5230 {max} \u4E4B\u95F4\u3002',
  // Loading overlay
  "loading.connecting": "\u6B63\u5728\u8FDE\u63A5\u2026",
  "loading.loading": "\u6B63\u5728\u52A0\u8F7D\u2026",
  "loading.processing": "\u6B63\u5728\u5904\u7406\u6587\u6863\u2026",
  "loading.preparingPrint": "\u6B63\u5728\u51C6\u5907\u6253\u5370\u2026",
  "loading.renderingPage": "\u6B63\u5728\u6E32\u67D3\u7B2C {current} \u9875\uFF0C\u5171 {total} \u9875\u2026",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "\u5DF2\u52A0\u8F7D {loaded} MB\u2026",
  // View mode menu
  "viewMode.label": "\u89C6\u56FE\u8BBE\u7F6E",
  "viewMode.view": "\u89C6\u56FE",
  "viewMode.paged": "\u5206\u9875",
  "viewMode.continuousView": "\u8FDE\u7EED",
  "viewMode.scroll": "\u6EDA\u52A8",
  "viewMode.layout": "\u5E03\u5C40",
  "viewMode.rotation": "\u65CB\u8F6C",
  "viewMode.spacing": "\u95F4\u8DDD",
  "viewMode.spread": "\u8DE8\u9875",
  "viewMode.continuous": "\u8FDE\u7EED",
  "viewMode.single": "\u5355\u9875",
  "viewMode.double": "\u53CC\u9875",
  "viewMode.coverRight": "\u5C01\u9762\u5C45\u53F3",
  "viewMode.coverLeft": "\u5C01\u9762\u5C45\u5DE6",
  "viewMode.spacingAll": "\u5168\u90E8",
  "viewMode.spacingNone": "\u65E0",
  "viewMode.spacingSpread": "\u8DE8\u9875",
  "viewMode.spacingPage": "\u9875\u95F4",
  // Annotation panel
  "annotations.comments": "\u6279\u6CE8",
  "annotations.noComments": "\u6B64\u6587\u6863\u6682\u65E0\u6279\u6CE8",
  "annotations.loading": "\u6B63\u5728\u52A0\u8F7D\u6279\u6CE8\u2026",
  "annotations.replyCount": "{count} \u6761\u56DE\u590D",
  "annotations.replyCountSingle": "1 \u6761\u56DE\u590D",
  "annotations.showReplies": "\u5C55\u5F00\u56DE\u590D",
  "annotations.hideReplies": "\u6536\u8D77\u56DE\u590D",
  "annotations.pageHeader": "\u7B2C {page} \u9875",
  // Outline panel
  "outline.label": "\u6587\u6863\u5927\u7EB2",
  "outline.loading": "\u6B63\u5728\u52A0\u8F7D\u5927\u7EB2\u2026",
  "outline.empty": "\u6B64\u6587\u6863\u6682\u65E0\u5927\u7EB2",
  // Bookmarks panel
  "bookmarks.empty": "\u6B64\u6587\u6863\u6682\u65E0\u4E66\u7B7E",
  // Layers panel
  "layers.loading": "\u6B63\u5728\u52A0\u8F7D\u56FE\u5C42\u2026",
  "layers.empty": "\u6B64\u6587\u6863\u6682\u65E0\u56FE\u5C42",
  // Attachments panel
  "attachments.empty": "\u6B64\u6587\u6863\u6682\u65E0\u9644\u4EF6",
  "layers.visibility": "{name} \u56FE\u5C42\u53EF\u89C1\u6027",
  // Fonts panel
  "fonts.loading": "\u6B63\u5728\u52A0\u8F7D\u5B57\u4F53\u2026",
  "fonts.empty": "\u6682\u65E0\u5B57\u4F53\u4F7F\u7528\u6570\u636E",
  // Thumbnail panel
  "thumbnails.label": "\u9875\u9762\u7F29\u7565\u56FE",
  "thumbnails.pageLabel": "\u7B2C {page} \u9875",
  // Spread and viewport
  "spread.pageLabel": "\u7B2C {page} \u9875",
  "spread.pageContent": "\u7B2C {page} \u9875\u5185\u5BB9",
  "spread.rendering": "\u6E32\u67D3\u4E2D...",
  "viewport.documentContent": "\u6587\u6863\u5185\u5BB9",
  // Left panel tabs
  "leftPanel.tabs": "\u9762\u677F\u9009\u9879\u5361",
  "leftPanel.thumbnails": "\u7F29\u7565\u56FE",
  "leftPanel.outline": "\u5927\u7EB2",
  "leftPanel.bookmarks": "\u4E66\u7B7E",
  "leftPanel.layers": "\u56FE\u5C42",
  "leftPanel.attachments": "\u9644\u4EF6",
  "leftPanel.fonts": "\u5B57\u4F53",
  "leftPanel.resizeHandle": "\u8C03\u6574\u4FA7\u8FB9\u9762\u677F\u5927\u5C0F",
  // Right panel
  "rightPanel.searchPanel": "\u641C\u7D22\u9762\u677F",
  "rightPanel.commentsPanel": "\u6279\u6CE8\u9762\u677F",
  "rightPanel.resizeHandle": "\u8C03\u6574\u9762\u677F\u5927\u5C0F",
  // Tools
  "tools.pointer": "\u6307\u9488",
  "tools.hand": "\u6293\u624B",
  "tools.zoom": "\u7F29\u653E",
  "tools.annotate": "\u6279\u6CE8",
  "tools.markup": "\u6807\u8BB0",
  "tools.subtoolbar": "\u5DE5\u5177\u9009\u9879",
  // Shared sub-tools
  "tools.select": "\u9009\u62E9",
  "tools.deleteAnnotation": "\u5220\u9664\u6279\u6CE8",
  // Annotate sub-tools
  "tools.freehand": "\u624B\u7ED8",
  "tools.line": "\u76F4\u7EBF",
  "tools.arrow": "\u7BAD\u5934",
  "tools.rectangle": "\u77E9\u5F62",
  "tools.ellipse": "\u692D\u5706",
  "tools.polygon": "\u591A\u8FB9\u5F62",
  "tools.polyline": "\u6298\u7EBF",
  "tools.textbox": "\u6587\u672C\u6846",
  // Markup sub-tools
  "tools.highlight": "\u9AD8\u4EAE",
  "tools.underline": "\u4E0B\u5212\u7EBF",
  "tools.strikethrough": "\u5220\u9664\u7EBF",
  "tools.squiggly": "\u6CE2\u6D6A\u7EBF",
  // Tool options
  "tools.strokeColor": "\u63CF\u8FB9\u989C\u8272",
  "tools.fillColor": "\u586B\u5145\u989C\u8272",
  "tools.noFill": "\u65E0\u586B\u5145",
  "tools.strokeWidth": "\u63CF\u8FB9\u5BBD\u5EA6",
  "tools.opacity": "\u4E0D\u900F\u660E\u5EA6",
  "tools.fontSize": "\u5B57\u53F7",
  "tools.lineStyle": "\u7EBF\u6761\u6837\u5F0F",
  "tools.lineStyleSolid": "\u5B9E\u7EBF",
  "tools.lineStyleDashed": "\u865A\u7EBF",
  "tools.lineStyleDotted": "\u70B9\u7EBF",
  "tools.arrowHeadStart": "\u8D77\u70B9",
  "tools.arrowHeadEnd": "\u7EC8\u70B9",
  "tools.arrowHeadNone": "\u65E0",
  "tools.arrowHeadOpen": "\u5F00\u653E",
  "tools.arrowHeadClosed": "\u5C01\u95ED",
  "tools.undo": "\u64A4\u9500",
  "tools.redo": "\u91CD\u505A"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/zh-TW.js
var zhTW = {
  // Shell / regions
  "shell.skipToDocument": "\u8DF3\u81F3\u6587\u4EF6",
  "shell.regionToolbar": "\u5DE5\u5177\u5217",
  "shell.regionSidePanel": "\u5074\u908A\u9762\u677F",
  "shell.regionDocument": "\u6587\u4EF6",
  "shell.regionSearchComments": "\u641C\u5C0B\u8207\u8A3B\u89E3",
  "shell.pageOfTotal": "\u7B2C {page} \u9801\uFF0C\u5171 {pageCount} \u9801",
  "shell.zoomPercent": "\u7E2E\u653E {percent}%",
  "shell.panelOpened": "{panel}\u9762\u677F\u5DF2\u958B\u555F",
  "shell.panelClosed": "\u9762\u677F\u5DF2\u95DC\u9589",
  "shell.shortcutHelp": "\u5FEB\u901F\u9375\uFF1AF6 \u5207\u63DB\u5340\u57DF\uFF0CCtrl+F \u641C\u5C0B\uFF0CCtrl+P \u5217\u5370\uFF0CCtrl+Plus \u653E\u5927\uFF0CCtrl+Minus \u7E2E\u5C0F\uFF0CCtrl+0 \u91CD\u8A2D\u7E2E\u653E\uFF0CEscape \u95DC\u9589\u9762\u677F\u3002\u6309 ? \u6AA2\u8996\u5FEB\u901F\u9375\u5217\u8868\u3002",
  "shell.shortcutHelpAnnounce": "\u5FEB\u901F\u9375\uFF1AF6 \u5207\u63DB\u5340\u57DF\uFF0CCtrl+F \u641C\u5C0B\uFF0CCtrl+P \u5217\u5370\uFF0CCtrl+Plus \u653E\u5927\uFF0CCtrl+Minus \u7E2E\u5C0F\uFF0CCtrl+0 \u91CD\u8A2D\u7E2E\u653E\uFF0CEscape \u95DC\u9589\u9762\u677F\uFF0C? \u986F\u793A\u6B64\u8AAA\u660E\u3002",
  // Toolbar
  "toolbar.label": "\u6587\u4EF6\u5DE5\u5177\u5217",
  "toolbar.menu": "\u9078\u55AE",
  "toolbar.search": "\u641C\u5C0B",
  "toolbar.comments": "\u8A3B\u89E3",
  "toolbar.print": "\u5217\u5370",
  "toolbar.download": "\u4E0B\u8F09",
  "toolbar.fullscreen": "\u5168\u87A2\u5E55",
  "toolbar.exitFullscreen": "\u9000\u51FA\u5168\u87A2\u5E55",
  "toolbar.darkMode": "\u6DF1\u8272\u6A21\u5F0F",
  "toolbar.systemTheme": "\u8DDF\u96A8\u7CFB\u7D71",
  "toolbar.lightMode": "\u6DFA\u8272\u6A21\u5F0F",
  "toolbar.previousPage": "\u4E0A\u4E00\u9801",
  "toolbar.nextPage": "\u4E0B\u4E00\u9801",
  "toolbar.pageNumber": "\u9801\u78BC",
  "toolbar.zoomIn": "\u653E\u5927",
  "toolbar.zoomOut": "\u7E2E\u5C0F",
  "toolbar.zoomLevel": "\u7E2E\u653E\u5C64\u7D1A",
  "toolbar.zoomOptions": "\u7E2E\u653E\u9078\u9805",
  "toolbar.zoomLevels": "\u7E2E\u653E\u5C64\u7D1A",
  "toolbar.more": "\u66F4\u591A",
  // Zoom modes
  "zoom.fitWidth": "\u7B26\u5408\u5BEC\u5EA6",
  "zoom.fitHeight": "\u7B26\u5408\u9AD8\u5EA6",
  "zoom.fitPage": "\u7B26\u5408\u9801\u9762",
  // Floating toolbar
  "floatingToolbar.label": "\u9801\u9762\u5C0E\u89BD\u8207\u7E2E\u653E",
  // Search panel
  "search.placeholder": "\u5728\u6587\u4EF6\u4E2D\u641C\u5C0B\u2026",
  "search.label": "\u641C\u5C0B\u6587\u5B57",
  "search.matchCase": "\u5340\u5206\u5927\u5C0F\u5BEB",
  "search.fuzzyMatch": "\u6A21\u7CCA\u6BD4\u5C0D",
  "search.previousMatch": "\u4E0A\u4E00\u500B\u7B26\u5408\u9805\u76EE (Shift+Enter)",
  "search.nextMatch": "\u4E0B\u4E00\u500B\u7B26\u5408\u9805\u76EE (Enter)",
  "search.loadingText": "\u6B63\u5728\u8F09\u5165\u6587\u5B57\u2026",
  "search.noResults": "\u6C92\u6709\u7D50\u679C",
  "search.resultStatus": "\u7B2C {current} \u9805\uFF0C\u5171 {total} \u9805",
  "search.pageHeader": "\u7B2C {page} \u9801",
  "search.resultsLabel": "\u641C\u5C0B\u7D50\u679C",
  // Password dialog
  "password.title": "\u9700\u8981\u5BC6\u78BC",
  "password.message": "\u6B64\u6587\u4EF6\u53D7\u5BC6\u78BC\u4FDD\u8B77\uFF0C\u8ACB\u8F38\u5165\u5BC6\u78BC\u4EE5\u958B\u555F\u3002",
  "password.placeholder": "\u8F38\u5165\u5BC6\u78BC",
  "password.label": "\u5BC6\u78BC",
  "password.showPassword": "\u986F\u793A\u5BC6\u78BC",
  "password.hidePassword": "\u96B1\u85CF\u5BC6\u78BC",
  "password.unlock": "\u89E3\u9396",
  // Print dialog
  "print.title": "\u5217\u5370",
  "print.pagesLabel": "\u9801\u9762\u7BC4\u570D",
  "print.allPages": "\u6240\u6709\u9801\u9762",
  "print.currentPage": "\u76EE\u524D\u9801\u9762 ({page})",
  "print.pagesRange": "\u9801\u9762\u7BC4\u570D",
  "print.pagesTo": "\u81F3",
  "print.custom": "\u81EA\u8A02",
  "print.customPlaceholder": "\u4F8B\u5982 1,3,5-8",
  "print.qualityLabel": "\u54C1\u8CEA",
  "print.qualityDraft": "\u8349\u7A3F (150 DPI)",
  "print.qualityStandard": "\u6A19\u6E96 (300 DPI)",
  "print.qualityHigh": "\u9AD8\u54C1\u8CEA (600 DPI)",
  "print.cancel": "\u53D6\u6D88",
  "print.print": "\u5217\u5370",
  "print.errorPageRange": "\u8ACB\u8F38\u5165 1 \u5230 {max} \u4E4B\u9593\u7684\u9801\u78BC\u3002",
  "print.errorStartEnd": "\u8D77\u59CB\u9801\u4E0D\u53EF\u5927\u65BC\u7D50\u675F\u9801\u3002",
  "print.errorCustomRange": '\u683C\u5F0F\u7121\u6548\uFF0C\u8ACB\u4F7F\u7528\u985E\u4F3C "1,3,5-8" \u7684\u683C\u5F0F\u3002\u9801\u78BC\u9808\u4ECB\u65BC 1 \u5230 {max} \u4E4B\u9593\u3002',
  // Loading overlay
  "loading.connecting": "\u6B63\u5728\u9023\u7DDA\u2026",
  "loading.loading": "\u6B63\u5728\u8F09\u5165\u2026",
  "loading.processing": "\u6B63\u5728\u8655\u7406\u6587\u4EF6\u2026",
  "loading.preparingPrint": "\u6B63\u5728\u6E96\u5099\u5217\u5370\u2026",
  "loading.renderingPage": "\u6B63\u5728\u7B97\u7E6A\u7B2C {current} \u9801\uFF0C\u5171 {total} \u9801\u2026",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "\u5DF2\u8F09\u5165 {loaded} MB\u2026",
  // View mode menu
  "viewMode.label": "\u6AA2\u8996\u8A2D\u5B9A",
  "viewMode.view": "\u6AA2\u8996",
  "viewMode.paged": "\u5206\u9801",
  "viewMode.continuousView": "\u9023\u7E8C",
  "viewMode.scroll": "\u6372\u52D5",
  "viewMode.layout": "\u7248\u9762",
  "viewMode.rotation": "\u65CB\u8F49",
  "viewMode.spacing": "\u9593\u8DDD",
  "viewMode.spread": "\u8DE8\u9801",
  "viewMode.continuous": "\u9023\u7E8C",
  "viewMode.single": "\u55AE\u9801",
  "viewMode.double": "\u96D9\u9801",
  "viewMode.coverRight": "\u5C01\u9762\u5C45\u53F3",
  "viewMode.coverLeft": "\u5C01\u9762\u5C45\u5DE6",
  "viewMode.spacingAll": "\u5168\u90E8",
  "viewMode.spacingNone": "\u7121",
  "viewMode.spacingSpread": "\u8DE8\u9801",
  "viewMode.spacingPage": "\u9801\u9593",
  // Annotation panel
  "annotations.comments": "\u8A3B\u89E3",
  "annotations.noComments": "\u6B64\u6587\u4EF6\u6C92\u6709\u8A3B\u89E3",
  "annotations.loading": "\u6B63\u5728\u8F09\u5165\u8A3B\u89E3\u2026",
  "annotations.replyCount": "{count} \u5247\u56DE\u8986",
  "annotations.replyCountSingle": "1 \u5247\u56DE\u8986",
  "annotations.showReplies": "\u5C55\u958B\u56DE\u8986",
  "annotations.hideReplies": "\u6536\u5408\u56DE\u8986",
  "annotations.pageHeader": "\u7B2C {page} \u9801",
  // Outline panel
  "outline.label": "\u6587\u4EF6\u5927\u7DB1",
  "outline.loading": "\u6B63\u5728\u8F09\u5165\u5927\u7DB1\u2026",
  "outline.empty": "\u6B64\u6587\u4EF6\u6C92\u6709\u5927\u7DB1",
  // Bookmarks panel
  "bookmarks.empty": "\u6B64\u6587\u4EF6\u6C92\u6709\u66F8\u7C64",
  // Layers panel
  "layers.loading": "\u6B63\u5728\u8F09\u5165\u5716\u5C64\u2026",
  "layers.empty": "\u6B64\u6587\u4EF6\u6C92\u6709\u5716\u5C64",
  // Attachments panel
  "attachments.empty": "\u6B64\u6587\u4EF6\u6C92\u6709\u9644\u4EF6",
  "layers.visibility": "{name} \u5716\u5C64\u53EF\u898B\u6027",
  // Fonts panel
  "fonts.loading": "\u6B63\u5728\u8F09\u5165\u5B57\u578B\u2026",
  "fonts.empty": "\u66AB\u7121\u5B57\u578B\u4F7F\u7528\u8CC7\u6599",
  // Thumbnail panel
  "thumbnails.label": "\u9801\u9762\u7E2E\u5716",
  "thumbnails.pageLabel": "\u7B2C {page} \u9801",
  // Spread and viewport
  "spread.pageLabel": "\u7B2C {page} \u9801",
  "spread.pageContent": "\u7B2C {page} \u9801\u5167\u5BB9",
  "spread.rendering": "\u6E32\u67D3\u4E2D...",
  "viewport.documentContent": "\u6587\u4EF6\u5167\u5BB9",
  // Left panel tabs
  "leftPanel.tabs": "\u9762\u677F\u5206\u9801",
  "leftPanel.thumbnails": "\u7E2E\u5716",
  "leftPanel.outline": "\u5927\u7DB1",
  "leftPanel.bookmarks": "\u66F8\u7C64",
  "leftPanel.layers": "\u5716\u5C64",
  "leftPanel.attachments": "\u9644\u4EF6",
  "leftPanel.fonts": "\u5B57\u578B",
  "leftPanel.resizeHandle": "\u8ABF\u6574\u5074\u908A\u9762\u677F\u5927\u5C0F",
  // Right panel
  "rightPanel.searchPanel": "\u641C\u5C0B\u9762\u677F",
  "rightPanel.commentsPanel": "\u8A3B\u89E3\u9762\u677F",
  "rightPanel.resizeHandle": "\u8ABF\u6574\u9762\u677F\u5927\u5C0F",
  // Tools
  "tools.pointer": "\u6307\u6A19",
  "tools.hand": "\u6293\u624B",
  "tools.zoom": "\u7E2E\u653E",
  "tools.annotate": "\u8A3B\u89E3",
  "tools.markup": "\u6A19\u8A18",
  "tools.subtoolbar": "\u5DE5\u5177\u9078\u9805",
  // Shared sub-tools
  "tools.select": "\u9078\u53D6",
  "tools.deleteAnnotation": "\u522A\u9664\u8A3B\u89E3",
  // Annotate sub-tools
  "tools.freehand": "\u624B\u7E6A",
  "tools.line": "\u76F4\u7DDA",
  "tools.arrow": "\u7BAD\u982D",
  "tools.rectangle": "\u77E9\u5F62",
  "tools.ellipse": "\u6A62\u5713",
  "tools.polygon": "\u591A\u908A\u5F62",
  "tools.polyline": "\u6298\u7DDA",
  "tools.textbox": "\u6587\u5B57\u65B9\u584A",
  // Markup sub-tools
  "tools.highlight": "\u87A2\u5149\u6A19\u8A18",
  "tools.underline": "\u5E95\u7DDA",
  "tools.strikethrough": "\u522A\u9664\u7DDA",
  "tools.squiggly": "\u6CE2\u6D6A\u7DDA",
  // Tool options
  "tools.strokeColor": "\u63CF\u908A\u984F\u8272",
  "tools.fillColor": "\u586B\u5145\u984F\u8272",
  "tools.noFill": "\u7121\u586B\u5145",
  "tools.strokeWidth": "\u63CF\u908A\u5BEC\u5EA6",
  "tools.opacity": "\u4E0D\u900F\u660E\u5EA6",
  "tools.fontSize": "\u5B57\u578B\u5927\u5C0F",
  "tools.lineStyle": "\u7DDA\u689D\u6A23\u5F0F",
  "tools.lineStyleSolid": "\u5BE6\u7DDA",
  "tools.lineStyleDashed": "\u865B\u7DDA",
  "tools.lineStyleDotted": "\u9EDE\u7DDA",
  "tools.arrowHeadStart": "\u8D77\u9EDE",
  "tools.arrowHeadEnd": "\u7D42\u9EDE",
  "tools.arrowHeadNone": "\u7121",
  "tools.arrowHeadOpen": "\u958B\u653E",
  "tools.arrowHeadClosed": "\u5C01\u9589",
  "tools.undo": "\u5FA9\u539F",
  "tools.redo": "\u91CD\u505A"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/ja.js
var ja = {
  // Shell / regions
  "shell.skipToDocument": "\u6587\u66F8\u3078\u30B9\u30AD\u30C3\u30D7",
  "shell.regionToolbar": "\u30C4\u30FC\u30EB\u30D0\u30FC",
  "shell.regionSidePanel": "\u30B5\u30A4\u30C9\u30D1\u30CD\u30EB",
  "shell.regionDocument": "\u6587\u66F8",
  "shell.regionSearchComments": "\u691C\u7D22\u3068\u30B3\u30E1\u30F3\u30C8",
  "shell.pageOfTotal": "{pageCount}\u30DA\u30FC\u30B8\u4E2D{page}\u30DA\u30FC\u30B8",
  "shell.zoomPercent": "\u30BA\u30FC\u30E0 {percent}%",
  "shell.panelOpened": "{panel}\u30D1\u30CD\u30EB\u3092\u958B\u304D\u307E\u3057\u305F",
  "shell.panelClosed": "\u30D1\u30CD\u30EB\u3092\u9589\u3058\u307E\u3057\u305F",
  "shell.shortcutHelp": "\u30AD\u30FC\u30DC\u30FC\u30C9\u30B7\u30E7\u30FC\u30C8\u30AB\u30C3\u30C8: F6\u3067\u9818\u57DF\u9593\u3092\u79FB\u52D5\u3001Ctrl+F\u3067\u691C\u7D22\u3001Ctrl+P\u3067\u5370\u5237\u3001Ctrl+Plus\u3067\u30BA\u30FC\u30E0\u30A4\u30F3\u3001Ctrl+Minus\u3067\u30BA\u30FC\u30E0\u30A2\u30A6\u30C8\u3001Ctrl+0\u3067\u30BA\u30FC\u30E0\u3092\u30EA\u30BB\u30C3\u30C8\u3001Escape\u3067\u30D1\u30CD\u30EB\u3092\u9589\u3058\u308B\u3002?\u30AD\u30FC\u3067\u30B7\u30E7\u30FC\u30C8\u30AB\u30C3\u30C8\u4E00\u89A7\u3092\u8868\u793A\u3002",
  "shell.shortcutHelpAnnounce": "\u30AD\u30FC\u30DC\u30FC\u30C9\u30B7\u30E7\u30FC\u30C8\u30AB\u30C3\u30C8: F6 \u9818\u57DF\u9593\u79FB\u52D5\u3001Ctrl+F \u691C\u7D22\u3001Ctrl+P \u5370\u5237\u3001Ctrl+Plus \u30BA\u30FC\u30E0\u30A4\u30F3\u3001Ctrl+Minus \u30BA\u30FC\u30E0\u30A2\u30A6\u30C8\u3001Ctrl+0 \u30BA\u30FC\u30E0\u30EA\u30BB\u30C3\u30C8\u3001Escape \u30D1\u30CD\u30EB\u3092\u9589\u3058\u308B\u3001? \u3053\u306E\u30D8\u30EB\u30D7\u3092\u8868\u793A\u3002",
  // Toolbar
  "toolbar.label": "\u6587\u66F8\u30C4\u30FC\u30EB\u30D0\u30FC",
  "toolbar.menu": "\u30E1\u30CB\u30E5\u30FC",
  "toolbar.search": "\u691C\u7D22",
  "toolbar.comments": "\u30B3\u30E1\u30F3\u30C8",
  "toolbar.print": "\u5370\u5237",
  "toolbar.download": "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
  "toolbar.fullscreen": "\u5168\u753B\u9762\u8868\u793A",
  "toolbar.exitFullscreen": "\u5168\u753B\u9762\u8868\u793A\u3092\u7D42\u4E86",
  "toolbar.darkMode": "\u30C0\u30FC\u30AF\u30E2\u30FC\u30C9",
  "toolbar.systemTheme": "\u30B7\u30B9\u30C6\u30E0\u30C6\u30FC\u30DE",
  "toolbar.lightMode": "\u30E9\u30A4\u30C8\u30E2\u30FC\u30C9",
  "toolbar.previousPage": "\u524D\u306E\u30DA\u30FC\u30B8",
  "toolbar.nextPage": "\u6B21\u306E\u30DA\u30FC\u30B8",
  "toolbar.pageNumber": "\u30DA\u30FC\u30B8\u756A\u53F7",
  "toolbar.zoomIn": "\u30BA\u30FC\u30E0\u30A4\u30F3",
  "toolbar.zoomOut": "\u30BA\u30FC\u30E0\u30A2\u30A6\u30C8",
  "toolbar.zoomLevel": "\u30BA\u30FC\u30E0\u30EC\u30D9\u30EB",
  "toolbar.zoomOptions": "\u30BA\u30FC\u30E0\u30AA\u30D7\u30B7\u30E7\u30F3",
  "toolbar.zoomLevels": "\u30BA\u30FC\u30E0\u30EC\u30D9\u30EB\u4E00\u89A7",
  "toolbar.more": "\u305D\u306E\u4ED6",
  // Zoom modes
  "zoom.fitWidth": "\u5E45\u306B\u5408\u308F\u305B\u308B",
  "zoom.fitHeight": "\u9AD8\u3055\u306B\u5408\u308F\u305B\u308B",
  "zoom.fitPage": "\u30DA\u30FC\u30B8\u306B\u5408\u308F\u305B\u308B",
  // Floating toolbar
  "floatingToolbar.label": "\u30DA\u30FC\u30B8\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3\u3068\u30BA\u30FC\u30E0",
  // Search panel
  "search.placeholder": "\u6587\u66F8\u5185\u3092\u691C\u7D22...",
  "search.label": "\u691C\u7D22\u30C6\u30AD\u30B9\u30C8",
  "search.matchCase": "\u5927\u6587\u5B57\u3068\u5C0F\u6587\u5B57\u3092\u533A\u5225",
  "search.fuzzyMatch": "\u3042\u3044\u307E\u3044\u691C\u7D22",
  "search.previousMatch": "\u524D\u306E\u4E00\u81F4 (Shift+Enter)",
  "search.nextMatch": "\u6B21\u306E\u4E00\u81F4 (Enter)",
  "search.loadingText": "\u30C6\u30AD\u30B9\u30C8\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",
  "search.noResults": "\u7D50\u679C\u306A\u3057",
  "search.resultStatus": "{total}\u4EF6\u4E2D{current}\u4EF6\u76EE",
  "search.pageHeader": "{page}\u30DA\u30FC\u30B8",
  "search.resultsLabel": "\u691C\u7D22\u7D50\u679C",
  // Password dialog
  "password.title": "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u5FC5\u8981\u3067\u3059",
  "password.message": "\u3053\u306E\u6587\u66F8\u306F\u4FDD\u8B77\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
  "password.placeholder": "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B",
  "password.label": "\u30D1\u30B9\u30EF\u30FC\u30C9",
  "password.showPassword": "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u8868\u793A",
  "password.hidePassword": "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u975E\u8868\u793A",
  "password.unlock": "\u30ED\u30C3\u30AF\u89E3\u9664",
  // Print dialog
  "print.title": "\u5370\u5237",
  "print.pagesLabel": "\u30DA\u30FC\u30B8",
  "print.allPages": "\u3059\u3079\u3066\u306E\u30DA\u30FC\u30B8",
  "print.currentPage": "\u73FE\u5728\u306E\u30DA\u30FC\u30B8 ({page})",
  "print.pagesRange": "\u30DA\u30FC\u30B8\u7BC4\u56F2",
  "print.pagesTo": "\u301C",
  "print.custom": "\u30AB\u30B9\u30BF\u30E0",
  "print.customPlaceholder": "\u4F8B: 1,3,5-8",
  "print.qualityLabel": "\u54C1\u8CEA",
  "print.qualityDraft": "\u4E0B\u66F8\u304D (150 DPI)",
  "print.qualityStandard": "\u6A19\u6E96 (300 DPI)",
  "print.qualityHigh": "\u9AD8\u54C1\u8CEA (600 DPI)",
  "print.cancel": "\u30AD\u30E3\u30F3\u30BB\u30EB",
  "print.print": "\u5370\u5237",
  "print.errorPageRange": "1\u304B\u3089{max}\u307E\u3067\u306E\u30DA\u30FC\u30B8\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  "print.errorStartEnd": "\u958B\u59CB\u30DA\u30FC\u30B8\u306F\u7D42\u4E86\u30DA\u30FC\u30B8\u4EE5\u4E0B\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  "print.errorCustomRange": "\u7121\u52B9\u306A\u7BC4\u56F2\u3067\u3059\u3002\u300C1,3,5-8\u300D\u306E\u3088\u3046\u306A\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u30DA\u30FC\u30B8\u756A\u53F7\u306F1\u304B\u3089{max}\u306E\u9593\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  // Loading overlay
  "loading.connecting": "\u63A5\u7D9A\u4E2D...",
  "loading.loading": "\u8AAD\u307F\u8FBC\u307F\u4E2D...",
  "loading.processing": "\u6587\u66F8\u3092\u51E6\u7406\u4E2D...",
  "loading.preparingPrint": "\u5370\u5237\u3092\u6E96\u5099\u4E2D...",
  "loading.renderingPage": "{total}\u30DA\u30FC\u30B8\u4E2D{current}\u30DA\u30FC\u30B8\u3092\u30EC\u30F3\u30C0\u30EA\u30F3\u30B0\u4E2D...",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "{loaded} MB \u8AAD\u307F\u8FBC\u307F\u6E08\u307F...",
  // View mode menu
  "viewMode.label": "\u8868\u793A\u8A2D\u5B9A",
  "viewMode.view": "\u8868\u793A",
  "viewMode.paged": "\u30DA\u30FC\u30B8",
  "viewMode.continuousView": "\u9023\u7D9A\u8868\u793A",
  "viewMode.scroll": "\u30B9\u30AF\u30ED\u30FC\u30EB",
  "viewMode.layout": "\u30EC\u30A4\u30A2\u30A6\u30C8",
  "viewMode.rotation": "\u56DE\u8EE2",
  "viewMode.spacing": "\u9593\u9694",
  "viewMode.spread": "\u898B\u958B\u304D",
  "viewMode.continuous": "\u9023\u7D9A",
  "viewMode.single": "\u5358\u4E00",
  "viewMode.double": "\u898B\u958B\u304D",
  "viewMode.coverRight": "\u8868\u7D19\u53F3",
  "viewMode.coverLeft": "\u8868\u7D19\u5DE6",
  "viewMode.spacingAll": "\u3059\u3079\u3066",
  "viewMode.spacingNone": "\u306A\u3057",
  "viewMode.spacingSpread": "\u898B\u958B\u304D",
  "viewMode.spacingPage": "\u30DA\u30FC\u30B8",
  // Annotation panel
  "annotations.comments": "\u30B3\u30E1\u30F3\u30C8",
  "annotations.noComments": "\u3053\u306E\u6587\u66F8\u306B\u30B3\u30E1\u30F3\u30C8\u306F\u3042\u308A\u307E\u305B\u3093",
  "annotations.loading": "\u30B3\u30E1\u30F3\u30C8\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...",
  "annotations.replyCount": "{count}\u4EF6\u306E\u8FD4\u4FE1",
  "annotations.replyCountSingle": "1\u4EF6\u306E\u8FD4\u4FE1",
  "annotations.showReplies": "\u8FD4\u4FE1\u3092\u8868\u793A",
  "annotations.hideReplies": "\u8FD4\u4FE1\u3092\u975E\u8868\u793A",
  "annotations.pageHeader": "{page}\u30DA\u30FC\u30B8",
  // Outline panel
  "outline.label": "\u6587\u66F8\u306E\u30A2\u30A6\u30C8\u30E9\u30A4\u30F3",
  "outline.loading": "\u30A2\u30A6\u30C8\u30E9\u30A4\u30F3\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...",
  "outline.empty": "\u3053\u306E\u6587\u66F8\u306B\u30A2\u30A6\u30C8\u30E9\u30A4\u30F3\u306F\u3042\u308A\u307E\u305B\u3093",
  // Bookmarks panel
  "bookmarks.empty": "\u3053\u306E\u6587\u66F8\u306B\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u306F\u3042\u308A\u307E\u305B\u3093",
  // Layers panel
  "layers.loading": "\u30EC\u30A4\u30E4\u30FC\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...",
  "layers.empty": "\u3053\u306E\u6587\u66F8\u306B\u30EC\u30A4\u30E4\u30FC\u306F\u3042\u308A\u307E\u305B\u3093",
  // Attachments panel
  "attachments.empty": "\u3053\u306E\u6587\u66F8\u306B\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u306F\u3042\u308A\u307E\u305B\u3093",
  "layers.visibility": "{name}\u30EC\u30A4\u30E4\u30FC\u306E\u8868\u793A\u5207\u66FF",
  // Fonts panel
  "fonts.loading": "\u30D5\u30A9\u30F3\u30C8\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...",
  "fonts.empty": "\u30D5\u30A9\u30F3\u30C8\u4F7F\u7528\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093",
  // Thumbnail panel
  "thumbnails.label": "\u30DA\u30FC\u30B8\u30B5\u30E0\u30CD\u30A4\u30EB",
  "thumbnails.pageLabel": "{page}\u30DA\u30FC\u30B8",
  // Spread and viewport
  "spread.pageLabel": "{page} \u30DA\u30FC\u30B8",
  "spread.pageContent": "{page} \u30DA\u30FC\u30B8\u306E\u5185\u5BB9",
  "spread.rendering": "\u30EC\u30F3\u30C0\u30EA\u30F3\u30B0\u4E2D...",
  "viewport.documentContent": "\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u30B3\u30F3\u30C6\u30F3\u30C4",
  // Left panel tabs
  "leftPanel.tabs": "\u30D1\u30CD\u30EB\u30BF\u30D6",
  "leftPanel.thumbnails": "\u30B5\u30E0\u30CD\u30A4\u30EB",
  "leftPanel.outline": "\u30A2\u30A6\u30C8\u30E9\u30A4\u30F3",
  "leftPanel.bookmarks": "\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF",
  "leftPanel.layers": "\u30EC\u30A4\u30E4\u30FC",
  "leftPanel.attachments": "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB",
  "leftPanel.fonts": "\u30D5\u30A9\u30F3\u30C8",
  "leftPanel.resizeHandle": "\u30B5\u30A4\u30C9\u30D1\u30CD\u30EB\u306E\u30B5\u30A4\u30BA\u5909\u66F4",
  // Right panel
  "rightPanel.searchPanel": "\u691C\u7D22\u30D1\u30CD\u30EB",
  "rightPanel.commentsPanel": "\u30B3\u30E1\u30F3\u30C8\u30D1\u30CD\u30EB",
  "rightPanel.resizeHandle": "\u30D1\u30CD\u30EB\u306E\u30B5\u30A4\u30BA\u5909\u66F4",
  // Tools
  "tools.pointer": "\u30DD\u30A4\u30F3\u30BF\u30FC",
  "tools.hand": "\u30CF\u30F3\u30C9",
  "tools.zoom": "\u30BA\u30FC\u30E0",
  "tools.annotate": "\u6CE8\u91C8",
  "tools.markup": "\u30DE\u30FC\u30AF\u30A2\u30C3\u30D7",
  "tools.subtoolbar": "\u30C4\u30FC\u30EB\u30AA\u30D7\u30B7\u30E7\u30F3",
  // Shared sub-tools
  "tools.select": "\u9078\u629E",
  "tools.deleteAnnotation": "\u6CE8\u91C8\u3092\u524A\u9664",
  // Annotate sub-tools
  "tools.freehand": "\u30D5\u30EA\u30FC\u30CF\u30F3\u30C9",
  "tools.line": "\u76F4\u7DDA",
  "tools.arrow": "\u77E2\u5370",
  "tools.rectangle": "\u56DB\u89D2\u5F62",
  "tools.ellipse": "\u6955\u5186",
  "tools.polygon": "\u591A\u89D2\u5F62",
  "tools.polyline": "\u6298\u308C\u7DDA",
  "tools.textbox": "\u30C6\u30AD\u30B9\u30C8\u30DC\u30C3\u30AF\u30B9",
  // Markup sub-tools
  "tools.highlight": "\u30CF\u30A4\u30E9\u30A4\u30C8",
  "tools.underline": "\u4E0B\u7DDA",
  "tools.strikethrough": "\u53D6\u308A\u6D88\u3057\u7DDA",
  "tools.squiggly": "\u6CE2\u7DDA",
  // Tool options
  "tools.strokeColor": "\u7DDA\u306E\u8272",
  "tools.fillColor": "\u5857\u308A\u306E\u8272",
  "tools.noFill": "\u5857\u308A\u306A\u3057",
  "tools.strokeWidth": "\u7DDA\u306E\u592A\u3055",
  "tools.opacity": "\u4E0D\u900F\u660E\u5EA6",
  "tools.fontSize": "\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA",
  "tools.lineStyle": "\u7DDA\u306E\u30B9\u30BF\u30A4\u30EB",
  "tools.lineStyleSolid": "\u5B9F\u7DDA",
  "tools.lineStyleDashed": "\u7834\u7DDA",
  "tools.lineStyleDotted": "\u70B9\u7DDA",
  "tools.arrowHeadStart": "\u59CB\u70B9",
  "tools.arrowHeadEnd": "\u7D42\u70B9",
  "tools.arrowHeadNone": "\u306A\u3057",
  "tools.arrowHeadOpen": "\u958B\u3044\u305F",
  "tools.arrowHeadClosed": "\u9589\u3058\u305F",
  "tools.undo": "\u5143\u306B\u623B\u3059",
  "tools.redo": "\u3084\u308A\u76F4\u3057"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/ko.js
var ko = {
  // Shell / regions
  "shell.skipToDocument": "\uBB38\uC11C\uB85C \uAC74\uB108\uB6F0\uAE30",
  "shell.regionToolbar": "\uB3C4\uAD6C \uBAA8\uC74C",
  "shell.regionSidePanel": "\uC0AC\uC774\uB4DC \uD328\uB110",
  "shell.regionDocument": "\uBB38\uC11C",
  "shell.regionSearchComments": "\uAC80\uC0C9 \uBC0F \uB313\uAE00",
  "shell.pageOfTotal": "{pageCount}\uD398\uC774\uC9C0 \uC911 {page}\uD398\uC774\uC9C0",
  "shell.zoomPercent": "\uD655\uB300/\uCD95\uC18C {percent}%",
  "shell.panelOpened": "{panel} \uD328\uB110 \uC5F4\uB9BC",
  "shell.panelClosed": "\uD328\uB110 \uB2EB\uD798",
  "shell.shortcutHelp": "\uD0A4\uBCF4\uB4DC \uB2E8\uCD95\uD0A4: F6\uC73C\uB85C \uC601\uC5ED \uAC04 \uC774\uB3D9, Ctrl+F\uB85C \uAC80\uC0C9, Ctrl+P\uB85C \uC778\uC1C4, Ctrl+Plus\uB85C \uD655\uB300, Ctrl+Minus\uB85C \uCD95\uC18C, Ctrl+0\uC73C\uB85C \uD655\uB300/\uCD95\uC18C \uCD08\uAE30\uD654, Escape\uB85C \uD328\uB110 \uB2EB\uAE30. ?\uD0A4\uB97C \uB20C\uB7EC \uB2E8\uCD95\uD0A4 \uBAA9\uB85D\uC744 \uD655\uC778\uD558\uC138\uC694.",
  "shell.shortcutHelpAnnounce": "\uD0A4\uBCF4\uB4DC \uB2E8\uCD95\uD0A4: F6 \uC601\uC5ED \uAC04 \uC774\uB3D9, Ctrl+F \uAC80\uC0C9, Ctrl+P \uC778\uC1C4, Ctrl+Plus \uD655\uB300, Ctrl+Minus \uCD95\uC18C, Ctrl+0 \uD655\uB300/\uCD95\uC18C \uCD08\uAE30\uD654, Escape \uD328\uB110 \uB2EB\uAE30, ? \uC774 \uB3C4\uC6C0\uB9D0 \uD45C\uC2DC.",
  // Toolbar
  "toolbar.label": "\uBB38\uC11C \uB3C4\uAD6C \uBAA8\uC74C",
  "toolbar.menu": "\uBA54\uB274",
  "toolbar.search": "\uAC80\uC0C9",
  "toolbar.comments": "\uB313\uAE00",
  "toolbar.print": "\uC778\uC1C4",
  "toolbar.download": "\uB2E4\uC6B4\uB85C\uB4DC",
  "toolbar.fullscreen": "\uC804\uCCB4 \uD654\uBA74",
  "toolbar.exitFullscreen": "\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC",
  "toolbar.darkMode": "\uB2E4\uD06C \uBAA8\uB4DC",
  "toolbar.systemTheme": "\uC2DC\uC2A4\uD15C \uD14C\uB9C8",
  "toolbar.lightMode": "\uB77C\uC774\uD2B8 \uBAA8\uB4DC",
  "toolbar.previousPage": "\uC774\uC804 \uD398\uC774\uC9C0",
  "toolbar.nextPage": "\uB2E4\uC74C \uD398\uC774\uC9C0",
  "toolbar.pageNumber": "\uD398\uC774\uC9C0 \uBC88\uD638",
  "toolbar.zoomIn": "\uD655\uB300",
  "toolbar.zoomOut": "\uCD95\uC18C",
  "toolbar.zoomLevel": "\uD655\uB300/\uCD95\uC18C \uC218\uC900",
  "toolbar.zoomOptions": "\uD655\uB300/\uCD95\uC18C \uC635\uC158",
  "toolbar.zoomLevels": "\uD655\uB300/\uCD95\uC18C \uC218\uC900 \uBAA9\uB85D",
  "toolbar.more": "\uB354\uBCF4\uAE30",
  // Zoom modes
  "zoom.fitWidth": "\uB108\uBE44\uC5D0 \uB9DE\uCD94\uAE30",
  "zoom.fitHeight": "\uB192\uC774\uC5D0 \uB9DE\uCD94\uAE30",
  "zoom.fitPage": "\uD398\uC774\uC9C0\uC5D0 \uB9DE\uCD94\uAE30",
  // Floating toolbar
  "floatingToolbar.label": "\uD398\uC774\uC9C0 \uD0D0\uC0C9 \uBC0F \uD655\uB300/\uCD95\uC18C",
  // Search panel
  "search.placeholder": "\uBB38\uC11C\uC5D0\uC11C \uAC80\uC0C9...",
  "search.label": "\uAC80\uC0C9 \uD14D\uC2A4\uD2B8",
  "search.matchCase": "\uB300\uC18C\uBB38\uC790 \uAD6C\uBD84",
  "search.fuzzyMatch": "\uC720\uC0AC \uAC80\uC0C9",
  "search.previousMatch": "\uC774\uC804 \uC77C\uCE58 (Shift+Enter)",
  "search.nextMatch": "\uB2E4\uC74C \uC77C\uCE58 (Enter)",
  "search.loadingText": "\uD14D\uC2A4\uD2B8 \uB85C\uB529 \uC911\u2026",
  "search.noResults": "\uACB0\uACFC \uC5C6\uC74C",
  "search.resultStatus": "{total}\uAC1C \uC911 {current}\uBC88\uC9F8",
  "search.pageHeader": "{page}\uD398\uC774\uC9C0",
  "search.resultsLabel": "\uAC80\uC0C9 \uACB0\uACFC",
  // Password dialog
  "password.title": "\uBE44\uBC00\uBC88\uD638 \uD544\uC694",
  "password.message": "\uC774 \uBB38\uC11C\uB294 \uBCF4\uD638\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD558\uC5EC \uC5F4\uC5B4\uC8FC\uC138\uC694.",
  "password.placeholder": "\uBE44\uBC00\uBC88\uD638 \uC785\uB825",
  "password.label": "\uBE44\uBC00\uBC88\uD638",
  "password.showPassword": "\uBE44\uBC00\uBC88\uD638 \uD45C\uC2DC",
  "password.hidePassword": "\uBE44\uBC00\uBC88\uD638 \uC228\uAE30\uAE30",
  "password.unlock": "\uC7A0\uAE08 \uD574\uC81C",
  // Print dialog
  "print.title": "\uC778\uC1C4",
  "print.pagesLabel": "\uD398\uC774\uC9C0",
  "print.allPages": "\uBAA8\uB4E0 \uD398\uC774\uC9C0",
  "print.currentPage": "\uD604\uC7AC \uD398\uC774\uC9C0 ({page})",
  "print.pagesRange": "\uD398\uC774\uC9C0 \uBC94\uC704",
  "print.pagesTo": "~",
  "print.custom": "\uC0AC\uC6A9\uC790 \uC9C0\uC815",
  "print.customPlaceholder": "\uC608: 1,3,5-8",
  "print.qualityLabel": "\uD488\uC9C8",
  "print.qualityDraft": "\uCD08\uC548 (150 DPI)",
  "print.qualityStandard": "\uD45C\uC900 (300 DPI)",
  "print.qualityHigh": "\uACE0\uD488\uC9C8 (600 DPI)",
  "print.cancel": "\uCDE8\uC18C",
  "print.print": "\uC778\uC1C4",
  "print.errorPageRange": "1\uBD80\uD130 {max}\uAE4C\uC9C0\uC758 \uD398\uC774\uC9C0 \uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  "print.errorStartEnd": "\uC2DC\uC791 \uD398\uC774\uC9C0\uB294 \uB05D \uD398\uC774\uC9C0\uBCF4\uB2E4 \uC791\uAC70\uB098 \uAC19\uC544\uC57C \uD569\uB2C8\uB2E4.",
  "print.errorCustomRange": '\uC798\uBABB\uB41C \uBC94\uC704\uC785\uB2C8\uB2E4. "1,3,5-8"\uACFC \uAC19\uC740 \uD615\uC2DD\uC73C\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694. \uD398\uC774\uC9C0 \uBC88\uD638\uB294 1\uBD80\uD130 {max} \uC0AC\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4.',
  // Loading overlay
  "loading.connecting": "\uC5F0\uACB0 \uC911...",
  "loading.loading": "\uB85C\uB529 \uC911...",
  "loading.processing": "\uBB38\uC11C \uCC98\uB9AC \uC911...",
  "loading.preparingPrint": "\uC778\uC1C4 \uC900\uBE44 \uC911...",
  "loading.renderingPage": "{total}\uD398\uC774\uC9C0 \uC911 {current}\uD398\uC774\uC9C0 \uB80C\uB354\uB9C1 \uC911...",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "{loaded} MB \uB85C\uB529\uB428...",
  // View mode menu
  "viewMode.label": "\uBCF4\uAE30 \uC124\uC815",
  "viewMode.view": "\uBCF4\uAE30",
  "viewMode.paged": "\uD398\uC774\uC9C0",
  "viewMode.continuousView": "\uC5F0\uC18D \uBCF4\uAE30",
  "viewMode.scroll": "\uC2A4\uD06C\uB864",
  "viewMode.layout": "\uB808\uC774\uC544\uC6C3",
  "viewMode.rotation": "\uD68C\uC804",
  "viewMode.spacing": "\uAC04\uACA9",
  "viewMode.spread": "\uD3BC\uCE68",
  "viewMode.continuous": "\uC5F0\uC18D",
  "viewMode.single": "\uB2E8\uC77C",
  "viewMode.double": "\uC591\uBA74",
  "viewMode.coverRight": "\uD45C\uC9C0 \uC624\uB978\uCABD",
  "viewMode.coverLeft": "\uD45C\uC9C0 \uC67C\uCABD",
  "viewMode.spacingAll": "\uC804\uCCB4",
  "viewMode.spacingNone": "\uC5C6\uC74C",
  "viewMode.spacingSpread": "\uD3BC\uCE68",
  "viewMode.spacingPage": "\uD398\uC774\uC9C0",
  // Annotation panel
  "annotations.comments": "\uB313\uAE00",
  "annotations.noComments": "\uC774 \uBB38\uC11C\uC5D0 \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",
  "annotations.loading": "\uB313\uAE00 \uB85C\uB529 \uC911...",
  "annotations.replyCount": "\uB2F5\uAE00 {count}\uAC1C",
  "annotations.replyCountSingle": "\uB2F5\uAE00 1\uAC1C",
  "annotations.showReplies": "\uB2F5\uAE00 \uD45C\uC2DC",
  "annotations.hideReplies": "\uB2F5\uAE00 \uC228\uAE30\uAE30",
  "annotations.pageHeader": "{page}\uD398\uC774\uC9C0",
  // Outline panel
  "outline.label": "\uBB38\uC11C \uAC1C\uC694",
  "outline.loading": "\uAC1C\uC694 \uB85C\uB529 \uC911...",
  "outline.empty": "\uC774 \uBB38\uC11C\uC5D0 \uAC1C\uC694\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
  // Bookmarks panel
  "bookmarks.empty": "\uC774 \uBB38\uC11C\uC5D0 \uBD81\uB9C8\uD06C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
  // Layers panel
  "layers.loading": "\uB808\uC774\uC5B4 \uB85C\uB529 \uC911...",
  "layers.empty": "\uC774 \uBB38\uC11C\uC5D0 \uB808\uC774\uC5B4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
  // Attachments panel
  "attachments.empty": "\uC774 \uBB38\uC11C\uC5D0 \uCCA8\uBD80 \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",
  "layers.visibility": "{name} \uB808\uC774\uC5B4 \uD45C\uC2DC \uC804\uD658",
  // Fonts panel
  "fonts.loading": "\uAE00\uAF34 \uB85C\uB529 \uC911...",
  "fonts.empty": "\uAE00\uAF34 \uC0AC\uC6A9 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
  // Thumbnail panel
  "thumbnails.label": "\uD398\uC774\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30",
  "thumbnails.pageLabel": "{page}\uD398\uC774\uC9C0",
  // Spread and viewport
  "spread.pageLabel": "{page}\uD398\uC774\uC9C0",
  "spread.pageContent": "{page}\uD398\uC774\uC9C0 \uCF58\uD150\uCE20",
  "spread.rendering": "\uB80C\uB354\uB9C1 \uC911...",
  "viewport.documentContent": "\uBB38\uC11C \uCF58\uD150\uCE20",
  // Left panel tabs
  "leftPanel.tabs": "\uD328\uB110 \uD0ED",
  "leftPanel.thumbnails": "\uBBF8\uB9AC\uBCF4\uAE30",
  "leftPanel.outline": "\uAC1C\uC694",
  "leftPanel.bookmarks": "\uBD81\uB9C8\uD06C",
  "leftPanel.layers": "\uB808\uC774\uC5B4",
  "leftPanel.attachments": "\uCCA8\uBD80 \uD30C\uC77C",
  "leftPanel.fonts": "\uAE00\uAF34",
  "leftPanel.resizeHandle": "\uC0AC\uC774\uB4DC \uD328\uB110 \uD06C\uAE30 \uC870\uC808",
  // Right panel
  "rightPanel.searchPanel": "\uAC80\uC0C9 \uD328\uB110",
  "rightPanel.commentsPanel": "\uB313\uAE00 \uD328\uB110",
  "rightPanel.resizeHandle": "\uD328\uB110 \uD06C\uAE30 \uC870\uC808",
  // Tools
  "tools.pointer": "\uD3EC\uC778\uD130",
  "tools.hand": "\uC190",
  "tools.zoom": "\uD655\uB300/\uCD95\uC18C",
  "tools.annotate": "\uC8FC\uC11D",
  "tools.markup": "\uB9C8\uD06C\uC5C5",
  "tools.subtoolbar": "\uB3C4\uAD6C \uC635\uC158",
  // Shared sub-tools
  "tools.select": "\uC120\uD0DD",
  "tools.deleteAnnotation": "\uC8FC\uC11D \uC0AD\uC81C",
  // Annotate sub-tools
  "tools.freehand": "\uC790\uC720 \uADF8\uB9AC\uAE30",
  "tools.line": "\uC9C1\uC120",
  "tools.arrow": "\uD654\uC0B4\uD45C",
  "tools.rectangle": "\uC0AC\uAC01\uD615",
  "tools.ellipse": "\uD0C0\uC6D0",
  "tools.polygon": "\uB2E4\uAC01\uD615",
  "tools.polyline": "\uAEBE\uC740\uC120",
  "tools.textbox": "\uD14D\uC2A4\uD2B8 \uC0C1\uC790",
  // Markup sub-tools
  "tools.highlight": "\uAC15\uC870",
  "tools.underline": "\uBC11\uC904",
  "tools.strikethrough": "\uCDE8\uC18C\uC120",
  "tools.squiggly": "\uBB3C\uACB0\uC120",
  // Tool options
  "tools.strokeColor": "\uC120 \uC0C9\uC0C1",
  "tools.fillColor": "\uCC44\uC6B0\uAE30 \uC0C9\uC0C1",
  "tools.noFill": "\uCC44\uC6B0\uAE30 \uC5C6\uC74C",
  "tools.strokeWidth": "\uC120 \uB450\uAED8",
  "tools.opacity": "\uBD88\uD22C\uBA85\uB3C4",
  "tools.fontSize": "\uAE00\uAF34 \uD06C\uAE30",
  "tools.lineStyle": "\uC120 \uC2A4\uD0C0\uC77C",
  "tools.lineStyleSolid": "\uC2E4\uC120",
  "tools.lineStyleDashed": "\uD30C\uC120",
  "tools.lineStyleDotted": "\uC810\uC120",
  "tools.arrowHeadStart": "\uC2DC\uC791\uC810",
  "tools.arrowHeadEnd": "\uB05D\uC810",
  "tools.arrowHeadNone": "\uC5C6\uC74C",
  "tools.arrowHeadOpen": "\uC5F4\uB9BC",
  "tools.arrowHeadClosed": "\uB2EB\uD798",
  "tools.undo": "\uC2E4\uD589 \uCDE8\uC18C",
  "tools.redo": "\uB2E4\uC2DC \uC2E4\uD589"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/es.js
var es = {
  // Shell / regions
  "shell.skipToDocument": "Ir al documento",
  "shell.regionToolbar": "Barra de herramientas",
  "shell.regionSidePanel": "Panel lateral",
  "shell.regionDocument": "Documento",
  "shell.regionSearchComments": "B\xFAsqueda y comentarios",
  "shell.pageOfTotal": "P\xE1gina {page} de {pageCount}",
  "shell.zoomPercent": "Zoom {percent}%",
  "shell.panelOpened": "Panel {panel} abierto",
  "shell.panelClosed": "Panel cerrado",
  "shell.shortcutHelp": "Atajos de teclado: F6 para navegar entre regiones, Ctrl+F para buscar, Ctrl+P para imprimir, Ctrl+Plus para ampliar, Ctrl+Minus para reducir, Ctrl+0 para restablecer el zoom, Escape para cerrar paneles. Pulse ? para ver la lista de atajos.",
  "shell.shortcutHelpAnnounce": "Atajos de teclado: F6 navegar entre regiones, Ctrl+F buscar, Ctrl+P imprimir, Ctrl+Plus ampliar, Ctrl+Minus reducir, Ctrl+0 restablecer zoom, Escape cerrar panel, ? mostrar esta ayuda.",
  // Toolbar
  "toolbar.label": "Barra de herramientas del documento",
  "toolbar.menu": "Men\xFA",
  "toolbar.search": "Buscar",
  "toolbar.comments": "Comentarios",
  "toolbar.print": "Imprimir",
  "toolbar.download": "Descargar",
  "toolbar.fullscreen": "Pantalla completa",
  "toolbar.exitFullscreen": "Salir de pantalla completa",
  "toolbar.darkMode": "Modo oscuro",
  "toolbar.systemTheme": "Tema del sistema",
  "toolbar.lightMode": "Modo claro",
  "toolbar.previousPage": "P\xE1gina anterior",
  "toolbar.nextPage": "P\xE1gina siguiente",
  "toolbar.pageNumber": "N\xFAmero de p\xE1gina",
  "toolbar.zoomIn": "Ampliar",
  "toolbar.zoomOut": "Reducir",
  "toolbar.zoomLevel": "Nivel de zoom",
  "toolbar.zoomOptions": "Opciones de zoom",
  "toolbar.zoomLevels": "Niveles de zoom",
  "toolbar.more": "M\xE1s",
  // Zoom modes
  "zoom.fitWidth": "Ajustar al ancho",
  "zoom.fitHeight": "Ajustar al alto",
  "zoom.fitPage": "Ajustar a la p\xE1gina",
  // Floating toolbar
  "floatingToolbar.label": "Navegaci\xF3n de p\xE1ginas y zoom",
  // Search panel
  "search.placeholder": "Buscar en el documento...",
  "search.label": "Texto de b\xFAsqueda",
  "search.matchCase": "Distinguir may\xFAsculas",
  "search.fuzzyMatch": "Coincidencia aproximada",
  "search.previousMatch": "Coincidencia anterior (Shift+Enter)",
  "search.nextMatch": "Siguiente coincidencia (Enter)",
  "search.loadingText": "Cargando texto\u2026",
  "search.noResults": "Sin resultados",
  "search.resultStatus": "{current} de {total}",
  "search.pageHeader": "P\xE1gina {page}",
  "search.resultsLabel": "Resultados de b\xFAsqueda",
  // Password dialog
  "password.title": "Contrase\xF1a requerida",
  "password.message": "Este documento est\xE1 protegido. Introduzca la contrase\xF1a para abrirlo.",
  "password.placeholder": "Introducir contrase\xF1a",
  "password.label": "Contrase\xF1a",
  "password.showPassword": "Mostrar contrase\xF1a",
  "password.hidePassword": "Ocultar contrase\xF1a",
  "password.unlock": "Desbloquear",
  // Print dialog
  "print.title": "Imprimir",
  "print.pagesLabel": "P\xE1ginas",
  "print.allPages": "Todas las p\xE1ginas",
  "print.currentPage": "P\xE1gina actual ({page})",
  "print.pagesRange": "P\xE1ginas",
  "print.pagesTo": "a",
  "print.custom": "Personalizado",
  "print.customPlaceholder": "p. ej. 1,3,5-8",
  "print.qualityLabel": "Calidad",
  "print.qualityDraft": "Borrador (150 DPI)",
  "print.qualityStandard": "Est\xE1ndar (300 DPI)",
  "print.qualityHigh": "Alta (600 DPI)",
  "print.cancel": "Cancelar",
  "print.print": "Imprimir",
  "print.errorPageRange": "Introduzca n\xFAmeros de p\xE1gina entre 1 y {max}.",
  "print.errorStartEnd": "La p\xE1gina inicial debe ser menor o igual que la p\xE1gina final.",
  "print.errorCustomRange": 'Rango no v\xE1lido. Use el formato "1,3,5-8". Las p\xE1ginas deben estar entre 1 y {max}.',
  // Loading overlay
  "loading.connecting": "Conectando...",
  "loading.loading": "Cargando...",
  "loading.processing": "Procesando documento...",
  "loading.preparingPrint": "Preparando impresi\xF3n...",
  "loading.renderingPage": "Renderizando p\xE1gina {current} de {total}...",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "{loaded} MB cargados...",
  // View mode menu
  "viewMode.label": "Ajustes de vista",
  "viewMode.view": "Vista",
  "viewMode.paged": "Paginado",
  "viewMode.continuousView": "Continuo",
  "viewMode.scroll": "Desplazamiento",
  "viewMode.layout": "Dise\xF1o",
  "viewMode.rotation": "Rotaci\xF3n",
  "viewMode.spacing": "Espaciado",
  "viewMode.spread": "Doble p\xE1gina",
  "viewMode.continuous": "Continuo",
  "viewMode.single": "Simple",
  "viewMode.double": "Doble",
  "viewMode.coverRight": "Portada a la derecha",
  "viewMode.coverLeft": "Portada a la izquierda",
  "viewMode.spacingAll": "Todo",
  "viewMode.spacingNone": "Ninguno",
  "viewMode.spacingSpread": "Doble p\xE1gina",
  "viewMode.spacingPage": "P\xE1gina",
  // Annotation panel
  "annotations.comments": "Comentarios",
  "annotations.noComments": "No hay comentarios en este documento",
  "annotations.loading": "Cargando comentarios...",
  "annotations.replyCount": "{count} respuestas",
  "annotations.replyCountSingle": "1 respuesta",
  "annotations.showReplies": "Mostrar respuestas",
  "annotations.hideReplies": "Ocultar respuestas",
  "annotations.pageHeader": "P\xE1gina {page}",
  // Outline panel
  "outline.label": "\xCDndice del documento",
  "outline.loading": "Cargando \xEDndice...",
  "outline.empty": "No hay \xEDndice en este documento",
  // Bookmarks panel
  "bookmarks.empty": "No hay marcadores en este documento",
  // Layers panel
  "layers.loading": "Cargando capas...",
  "layers.empty": "No hay capas en este documento",
  // Attachments panel
  "attachments.empty": "No hay adjuntos en este documento",
  "layers.visibility": "Visibilidad de la capa {name}",
  // Fonts panel
  "fonts.loading": "Cargando fuentes...",
  "fonts.empty": "No hay datos de fuentes disponibles",
  // Thumbnail panel
  "thumbnails.label": "Miniaturas de p\xE1ginas",
  "thumbnails.pageLabel": "P\xE1gina {page}",
  // Spread and viewport
  "spread.pageLabel": "P\xE1gina {page}",
  "spread.pageContent": "Contenido de la p\xE1gina {page}",
  "spread.rendering": "Renderizando...",
  "viewport.documentContent": "Contenido del documento",
  // Left panel tabs
  "leftPanel.tabs": "Pesta\xF1as del panel",
  "leftPanel.thumbnails": "Miniaturas",
  "leftPanel.outline": "\xCDndice",
  "leftPanel.bookmarks": "Marcadores",
  "leftPanel.layers": "Capas",
  "leftPanel.attachments": "Adjuntos",
  "leftPanel.fonts": "Fuentes",
  "leftPanel.resizeHandle": "Redimensionar panel lateral",
  // Right panel
  "rightPanel.searchPanel": "Panel de b\xFAsqueda",
  "rightPanel.commentsPanel": "Panel de comentarios",
  "rightPanel.resizeHandle": "Redimensionar panel",
  // Tools
  "tools.pointer": "Puntero",
  "tools.hand": "Mano",
  "tools.zoom": "Zoom",
  "tools.annotate": "Anotar",
  "tools.markup": "Marcado",
  "tools.subtoolbar": "Opciones de herramienta",
  // Shared sub-tools
  "tools.select": "Seleccionar",
  "tools.deleteAnnotation": "Eliminar anotaci\xF3n",
  // Annotate sub-tools
  "tools.freehand": "Mano alzada",
  "tools.line": "L\xEDnea",
  "tools.arrow": "Flecha",
  "tools.rectangle": "Rect\xE1ngulo",
  "tools.ellipse": "Elipse",
  "tools.polygon": "Pol\xEDgono",
  "tools.polyline": "Polil\xEDnea",
  "tools.textbox": "Cuadro de texto",
  // Markup sub-tools
  "tools.highlight": "Resaltar",
  "tools.underline": "Subrayar",
  "tools.strikethrough": "Tachar",
  "tools.squiggly": "Ondulado",
  // Tool options
  "tools.strokeColor": "Color de trazo",
  "tools.fillColor": "Color de relleno",
  "tools.noFill": "Sin relleno",
  "tools.strokeWidth": "Ancho de trazo",
  "tools.opacity": "Opacidad",
  "tools.fontSize": "Tama\xF1o de fuente",
  "tools.lineStyle": "Estilo de l\xEDnea",
  "tools.lineStyleSolid": "S\xF3lido",
  "tools.lineStyleDashed": "Discontinuo",
  "tools.lineStyleDotted": "Punteado",
  "tools.arrowHeadStart": "Inicio",
  "tools.arrowHeadEnd": "Final",
  "tools.arrowHeadNone": "Ninguna",
  "tools.arrowHeadOpen": "Abierta",
  "tools.arrowHeadClosed": "Cerrada",
  "tools.undo": "Deshacer",
  "tools.redo": "Rehacer"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/fr.js
var fr = {
  // Shell / regions
  "shell.skipToDocument": "Aller au document",
  "shell.regionToolbar": "Barre d'outils",
  "shell.regionSidePanel": "Panneau lat\xE9ral",
  "shell.regionDocument": "Document",
  "shell.regionSearchComments": "Recherche et commentaires",
  "shell.pageOfTotal": "Page {page} sur {pageCount}",
  "shell.zoomPercent": "Zoom {percent} %",
  "shell.panelOpened": "Panneau {panel} ouvert",
  "shell.panelClosed": "Panneau ferm\xE9",
  "shell.shortcutHelp": "Raccourcis clavier : F6 pour naviguer entre les zones, Ctrl+F pour rechercher, Ctrl+P pour imprimer, Ctrl+Plus pour zoomer, Ctrl+Minus pour d\xE9zoomer, Ctrl+0 pour r\xE9initialiser le zoom, \xC9chap pour fermer les panneaux. Appuyez sur ? pour afficher la liste des raccourcis.",
  "shell.shortcutHelpAnnounce": "Raccourcis clavier : F6 naviguer entre les zones, Ctrl+F rechercher, Ctrl+P imprimer, Ctrl+Plus zoomer, Ctrl+Minus d\xE9zoomer, Ctrl+0 r\xE9initialiser le zoom, \xC9chap fermer le panneau, ? afficher cette aide.",
  // Toolbar
  "toolbar.label": "Barre d'outils du document",
  "toolbar.menu": "Menu",
  "toolbar.search": "Rechercher",
  "toolbar.comments": "Commentaires",
  "toolbar.print": "Imprimer",
  "toolbar.download": "T\xE9l\xE9charger",
  "toolbar.fullscreen": "Plein \xE9cran",
  "toolbar.exitFullscreen": "Quitter le plein \xE9cran",
  "toolbar.darkMode": "Mode sombre",
  "toolbar.systemTheme": "Th\xE8me du syst\xE8me",
  "toolbar.lightMode": "Mode clair",
  "toolbar.previousPage": "Page pr\xE9c\xE9dente",
  "toolbar.nextPage": "Page suivante",
  "toolbar.pageNumber": "Num\xE9ro de page",
  "toolbar.zoomIn": "Zoomer",
  "toolbar.zoomOut": "D\xE9zoomer",
  "toolbar.zoomLevel": "Niveau de zoom",
  "toolbar.zoomOptions": "Options de zoom",
  "toolbar.zoomLevels": "Niveaux de zoom",
  "toolbar.more": "Plus",
  // Zoom modes
  "zoom.fitWidth": "Ajuster \xE0 la largeur",
  "zoom.fitHeight": "Ajuster \xE0 la hauteur",
  "zoom.fitPage": "Ajuster \xE0 la page",
  // Floating toolbar
  "floatingToolbar.label": "Navigation et zoom",
  // Search panel
  "search.placeholder": "Rechercher dans le document...",
  "search.label": "Texte de recherche",
  "search.matchCase": "Respecter la casse",
  "search.fuzzyMatch": "Correspondance floue",
  "search.previousMatch": "R\xE9sultat pr\xE9c\xE9dent (Shift+Enter)",
  "search.nextMatch": "R\xE9sultat suivant (Enter)",
  "search.loadingText": "Chargement du texte\u2026",
  "search.noResults": "Aucun r\xE9sultat",
  "search.resultStatus": "{current} sur {total}",
  "search.pageHeader": "Page {page}",
  "search.resultsLabel": "R\xE9sultats de recherche",
  // Password dialog
  "password.title": "Mot de passe requis",
  "password.message": "Ce document est prot\xE9g\xE9. Veuillez saisir le mot de passe pour l'ouvrir.",
  "password.placeholder": "Saisir le mot de passe",
  "password.label": "Mot de passe",
  "password.showPassword": "Afficher le mot de passe",
  "password.hidePassword": "Masquer le mot de passe",
  "password.unlock": "D\xE9verrouiller",
  // Print dialog
  "print.title": "Imprimer",
  "print.pagesLabel": "Pages",
  "print.allPages": "Toutes les pages",
  "print.currentPage": "Page actuelle ({page})",
  "print.pagesRange": "Pages",
  "print.pagesTo": "\xE0",
  "print.custom": "Personnalis\xE9",
  "print.customPlaceholder": "ex. 1,3,5-8",
  "print.qualityLabel": "Qualit\xE9",
  "print.qualityDraft": "Brouillon (150 DPI)",
  "print.qualityStandard": "Standard (300 DPI)",
  "print.qualityHigh": "Haute (600 DPI)",
  "print.cancel": "Annuler",
  "print.print": "Imprimer",
  "print.errorPageRange": "Veuillez saisir des num\xE9ros de page entre 1 et {max}.",
  "print.errorStartEnd": "La page de d\xE9but doit \xEAtre inf\xE9rieure ou \xE9gale \xE0 la page de fin.",
  "print.errorCustomRange": "Plage non valide. Utilisez le format \xAB 1,3,5-8 \xBB. Les pages doivent \xEAtre entre 1 et {max}.",
  // Loading overlay
  "loading.connecting": "Connexion...",
  "loading.loading": "Chargement...",
  "loading.processing": "Traitement du document...",
  "loading.preparingPrint": "Pr\xE9paration de l'impression...",
  "loading.renderingPage": "Rendu de la page {current} sur {total}...",
  "loading.progressSize": "{loaded} / {total} Mo ({percent} %)",
  "loading.progressLoaded": "{loaded} Mo charg\xE9s...",
  // View mode menu
  "viewMode.label": "Param\xE8tres d'affichage",
  "viewMode.view": "Vue",
  "viewMode.paged": "Pagin\xE9",
  "viewMode.continuousView": "Continu",
  "viewMode.scroll": "D\xE9filement",
  "viewMode.layout": "Disposition",
  "viewMode.rotation": "Rotation",
  "viewMode.spacing": "Espacement",
  "viewMode.spread": "Double page",
  "viewMode.continuous": "Continu",
  "viewMode.single": "Simple",
  "viewMode.double": "Double",
  "viewMode.coverRight": "Couverture \xE0 droite",
  "viewMode.coverLeft": "Couverture \xE0 gauche",
  "viewMode.spacingAll": "Tout",
  "viewMode.spacingNone": "Aucun",
  "viewMode.spacingSpread": "Double page",
  "viewMode.spacingPage": "Page",
  // Annotation panel
  "annotations.comments": "Commentaires",
  "annotations.noComments": "Aucun commentaire dans ce document",
  "annotations.loading": "Chargement des commentaires...",
  "annotations.replyCount": "{count} r\xE9ponses",
  "annotations.replyCountSingle": "1 r\xE9ponse",
  "annotations.showReplies": "Afficher les r\xE9ponses",
  "annotations.hideReplies": "Masquer les r\xE9ponses",
  "annotations.pageHeader": "Page {page}",
  // Outline panel
  "outline.label": "Sommaire du document",
  "outline.loading": "Chargement du sommaire...",
  "outline.empty": "Aucun sommaire dans ce document",
  // Bookmarks panel
  "bookmarks.empty": "Aucun signet dans ce document",
  // Layers panel
  "layers.loading": "Chargement des calques...",
  "layers.empty": "Aucun calque dans ce document",
  // Attachments panel
  "attachments.empty": "Aucune pi\xE8ce jointe dans ce document",
  "layers.visibility": "Visibilit\xE9 du calque {name}",
  // Fonts panel
  "fonts.loading": "Chargement des polices...",
  "fonts.empty": "Aucune donn\xE9e de police disponible",
  // Thumbnail panel
  "thumbnails.label": "Miniatures des pages",
  "thumbnails.pageLabel": "Page {page}",
  // Spread and viewport
  "spread.pageLabel": "Page {page}",
  "spread.pageContent": "Contenu de la page {page}",
  "spread.rendering": "Rendu en cours...",
  "viewport.documentContent": "Contenu du document",
  // Left panel tabs
  "leftPanel.tabs": "Onglets du panneau",
  "leftPanel.thumbnails": "Miniatures",
  "leftPanel.outline": "Sommaire",
  "leftPanel.bookmarks": "Signets",
  "leftPanel.layers": "Calques",
  "leftPanel.attachments": "Pi\xE8ces jointes",
  "leftPanel.fonts": "Polices",
  "leftPanel.resizeHandle": "Redimensionner le panneau lat\xE9ral",
  // Right panel
  "rightPanel.searchPanel": "Panneau de recherche",
  "rightPanel.commentsPanel": "Panneau de commentaires",
  "rightPanel.resizeHandle": "Redimensionner le panneau",
  // Tools
  "tools.pointer": "Pointeur",
  "tools.hand": "Main",
  "tools.zoom": "Zoom",
  "tools.annotate": "Annoter",
  "tools.markup": "Marquage",
  "tools.subtoolbar": "Options d'outil",
  // Shared sub-tools
  "tools.select": "S\xE9lectionner",
  "tools.deleteAnnotation": "Supprimer l'annotation",
  // Annotate sub-tools
  "tools.freehand": "Main lev\xE9e",
  "tools.line": "Ligne",
  "tools.arrow": "Fl\xE8che",
  "tools.rectangle": "Rectangle",
  "tools.ellipse": "Ellipse",
  "tools.polygon": "Polygone",
  "tools.polyline": "Polyligne",
  "tools.textbox": "Zone de texte",
  // Markup sub-tools
  "tools.highlight": "Surligner",
  "tools.underline": "Souligner",
  "tools.strikethrough": "Barrer",
  "tools.squiggly": "Ondul\xE9",
  // Tool options
  "tools.strokeColor": "Couleur du trait",
  "tools.fillColor": "Couleur de remplissage",
  "tools.noFill": "Sans remplissage",
  "tools.strokeWidth": "\xC9paisseur du trait",
  "tools.opacity": "Opacit\xE9",
  "tools.fontSize": "Taille de police",
  "tools.lineStyle": "Style de ligne",
  "tools.lineStyleSolid": "Continu",
  "tools.lineStyleDashed": "Tirets",
  "tools.lineStyleDotted": "Pointill\xE9",
  "tools.arrowHeadStart": "D\xE9but",
  "tools.arrowHeadEnd": "Fin",
  "tools.arrowHeadNone": "Aucune",
  "tools.arrowHeadOpen": "Ouverte",
  "tools.arrowHeadClosed": "Ferm\xE9e",
  "tools.undo": "Annuler",
  "tools.redo": "R\xE9tablir"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/de.js
var de = {
  // Shell / regions
  "shell.skipToDocument": "Zum Dokument springen",
  "shell.regionToolbar": "Symbolleiste",
  "shell.regionSidePanel": "Seitenleiste",
  "shell.regionDocument": "Dokument",
  "shell.regionSearchComments": "Suche und Kommentare",
  "shell.pageOfTotal": "Seite {page} von {pageCount}",
  "shell.zoomPercent": "Zoom {percent}%",
  "shell.panelOpened": "{panel}-Bereich ge\xF6ffnet",
  "shell.panelClosed": "Bereich geschlossen",
  "shell.shortcutHelp": "Tastenk\xFCrzel: F6 zum Navigieren zwischen Bereichen, Ctrl+F zum Suchen, Ctrl+P zum Drucken, Ctrl+Plus zum Vergr\xF6\xDFern, Ctrl+Minus zum Verkleinern, Ctrl+0 zum Zur\xFCcksetzen des Zooms, Escape zum Schlie\xDFen von Bereichen. Dr\xFCcken Sie ? f\xFCr eine Liste der Tastenk\xFCrzel.",
  "shell.shortcutHelpAnnounce": "Tastenk\xFCrzel: F6 Bereiche navigieren, Ctrl+F Suchen, Ctrl+P Drucken, Ctrl+Plus Vergr\xF6\xDFern, Ctrl+Minus Verkleinern, Ctrl+0 Zoom zur\xFCcksetzen, Escape Bereich schlie\xDFen, ? diese Hilfe anzeigen.",
  // Toolbar
  "toolbar.label": "Dokumentensymbolleiste",
  "toolbar.menu": "Men\xFC",
  "toolbar.search": "Suchen",
  "toolbar.comments": "Kommentare",
  "toolbar.print": "Drucken",
  "toolbar.download": "Herunterladen",
  "toolbar.fullscreen": "Vollbild",
  "toolbar.exitFullscreen": "Vollbild beenden",
  "toolbar.darkMode": "Dunkler Modus",
  "toolbar.systemTheme": "Systemdesign",
  "toolbar.lightMode": "Heller Modus",
  "toolbar.previousPage": "Vorherige Seite",
  "toolbar.nextPage": "N\xE4chste Seite",
  "toolbar.pageNumber": "Seitenzahl",
  "toolbar.zoomIn": "Vergr\xF6\xDFern",
  "toolbar.zoomOut": "Verkleinern",
  "toolbar.zoomLevel": "Zoomstufe",
  "toolbar.zoomOptions": "Zoomoptionen",
  "toolbar.zoomLevels": "Zoomstufen",
  "toolbar.more": "Mehr",
  // Zoom modes
  "zoom.fitWidth": "Breite anpassen",
  "zoom.fitHeight": "H\xF6he anpassen",
  "zoom.fitPage": "Seite anpassen",
  // Floating toolbar
  "floatingToolbar.label": "Seitennavigation und Zoom",
  // Search panel
  "search.placeholder": "Im Dokument suchen...",
  "search.label": "Suchtext",
  "search.matchCase": "Gro\xDF-/Kleinschreibung beachten",
  "search.fuzzyMatch": "Unscharfe Suche",
  "search.previousMatch": "Vorheriger Treffer (Shift+Enter)",
  "search.nextMatch": "N\xE4chster Treffer (Enter)",
  "search.loadingText": "Text wird geladen\u2026",
  "search.noResults": "Keine Ergebnisse",
  "search.resultStatus": "{current} von {total}",
  "search.pageHeader": "Seite {page}",
  "search.resultsLabel": "Suchergebnisse",
  // Password dialog
  "password.title": "Passwort erforderlich",
  "password.message": "Dieses Dokument ist gesch\xFCtzt. Bitte geben Sie das Passwort ein, um es zu \xF6ffnen.",
  "password.placeholder": "Passwort eingeben",
  "password.label": "Passwort",
  "password.showPassword": "Passwort anzeigen",
  "password.hidePassword": "Passwort verbergen",
  "password.unlock": "Entsperren",
  // Print dialog
  "print.title": "Drucken",
  "print.pagesLabel": "Seiten",
  "print.allPages": "Alle Seiten",
  "print.currentPage": "Aktuelle Seite ({page})",
  "print.pagesRange": "Seiten",
  "print.pagesTo": "bis",
  "print.custom": "Benutzerdefiniert",
  "print.customPlaceholder": "z.\xA0B. 1,3,5-8",
  "print.qualityLabel": "Qualit\xE4t",
  "print.qualityDraft": "Entwurf (150 DPI)",
  "print.qualityStandard": "Standard (300 DPI)",
  "print.qualityHigh": "Hoch (600 DPI)",
  "print.cancel": "Abbrechen",
  "print.print": "Drucken",
  "print.errorPageRange": "Bitte geben Sie Seitenzahlen zwischen 1 und {max} ein.",
  "print.errorStartEnd": "Die Startseite muss kleiner oder gleich der Endseite sein.",
  "print.errorCustomRange": 'Ung\xFCltiger Bereich. Verwenden Sie das Format \u201E1,3,5-8". Seiten m\xFCssen zwischen 1 und {max} liegen.',
  // Loading overlay
  "loading.connecting": "Verbinden...",
  "loading.loading": "Laden...",
  "loading.processing": "Dokument wird verarbeitet...",
  "loading.preparingPrint": "Druckvorgang wird vorbereitet...",
  "loading.renderingPage": "Seite {current} von {total} wird gerendert...",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "{loaded} MB geladen...",
  // View mode menu
  "viewMode.label": "Anzeigeeinstellungen",
  "viewMode.view": "Ansicht",
  "viewMode.paged": "Seitenweise",
  "viewMode.continuousView": "Fortlaufend",
  "viewMode.scroll": "Scrollen",
  "viewMode.layout": "Layout",
  "viewMode.rotation": "Drehung",
  "viewMode.spacing": "Abstand",
  "viewMode.spread": "Doppelseite",
  "viewMode.continuous": "Fortlaufend",
  "viewMode.single": "Einzeln",
  "viewMode.double": "Doppelt",
  "viewMode.coverRight": "Deckblatt rechts",
  "viewMode.coverLeft": "Deckblatt links",
  "viewMode.spacingAll": "Alle",
  "viewMode.spacingNone": "Keine",
  "viewMode.spacingSpread": "Doppelseite",
  "viewMode.spacingPage": "Seite",
  // Annotation panel
  "annotations.comments": "Kommentare",
  "annotations.noComments": "Keine Kommentare in diesem Dokument",
  "annotations.loading": "Kommentare werden geladen...",
  "annotations.replyCount": "{count} Antworten",
  "annotations.replyCountSingle": "1 Antwort",
  "annotations.showReplies": "Antworten anzeigen",
  "annotations.hideReplies": "Antworten ausblenden",
  "annotations.pageHeader": "Seite {page}",
  // Outline panel
  "outline.label": "Dokumentgliederung",
  "outline.loading": "Gliederung wird geladen...",
  "outline.empty": "Keine Gliederung in diesem Dokument",
  // Bookmarks panel
  "bookmarks.empty": "Keine Lesezeichen in diesem Dokument",
  // Layers panel
  "layers.loading": "Ebenen werden geladen...",
  "layers.empty": "Keine Ebenen in diesem Dokument",
  // Attachments panel
  "attachments.empty": "Keine Anh\xE4nge in diesem Dokument",
  "layers.visibility": "Sichtbarkeit der Ebene {name}",
  // Fonts panel
  "fonts.loading": "Schriftarten werden geladen...",
  "fonts.empty": "Keine Schriftartdaten verf\xFCgbar",
  // Thumbnail panel
  "thumbnails.label": "Seitenminiaturen",
  "thumbnails.pageLabel": "Seite {page}",
  // Spread and viewport
  "spread.pageLabel": "Seite {page}",
  "spread.pageContent": "Inhalt der Seite {page}",
  "spread.rendering": "Wird gerendert...",
  "viewport.documentContent": "Dokumentinhalt",
  // Left panel tabs
  "leftPanel.tabs": "Bereichsregisterkarten",
  "leftPanel.thumbnails": "Miniaturen",
  "leftPanel.outline": "Gliederung",
  "leftPanel.bookmarks": "Lesezeichen",
  "leftPanel.layers": "Ebenen",
  "leftPanel.attachments": "Anh\xE4nge",
  "leftPanel.fonts": "Schriftarten",
  "leftPanel.resizeHandle": "Seitenleiste anpassen",
  // Right panel
  "rightPanel.searchPanel": "Suchbereich",
  "rightPanel.commentsPanel": "Kommentarbereich",
  "rightPanel.resizeHandle": "Bereichsgr\xF6\xDFe anpassen",
  // Tools
  "tools.pointer": "Zeiger",
  "tools.hand": "Hand",
  "tools.zoom": "Zoom",
  "tools.annotate": "Kommentieren",
  "tools.markup": "Markierung",
  "tools.subtoolbar": "Werkzeugoptionen",
  // Shared sub-tools
  "tools.select": "Ausw\xE4hlen",
  "tools.deleteAnnotation": "Anmerkung l\xF6schen",
  // Annotate sub-tools
  "tools.freehand": "Freihand",
  "tools.line": "Linie",
  "tools.arrow": "Pfeil",
  "tools.rectangle": "Rechteck",
  "tools.ellipse": "Ellipse",
  "tools.polygon": "Polygon",
  "tools.polyline": "Polylinie",
  "tools.textbox": "Textfeld",
  // Markup sub-tools
  "tools.highlight": "Hervorheben",
  "tools.underline": "Unterstreichen",
  "tools.strikethrough": "Durchstreichen",
  "tools.squiggly": "Wellenlinie",
  // Tool options
  "tools.strokeColor": "Linienfarbe",
  "tools.fillColor": "F\xFCllfarbe",
  "tools.noFill": "Keine F\xFCllung",
  "tools.strokeWidth": "Linienst\xE4rke",
  "tools.opacity": "Deckkraft",
  "tools.fontSize": "Schriftgr\xF6\xDFe",
  "tools.lineStyle": "Linienstil",
  "tools.lineStyleSolid": "Durchgezogen",
  "tools.lineStyleDashed": "Gestrichelt",
  "tools.lineStyleDotted": "Gepunktet",
  "tools.arrowHeadStart": "Anfang",
  "tools.arrowHeadEnd": "Ende",
  "tools.arrowHeadNone": "Keine",
  "tools.arrowHeadOpen": "Offen",
  "tools.arrowHeadClosed": "Geschlossen",
  "tools.undo": "R\xFCckg\xE4ngig",
  "tools.redo": "Wiederherstellen"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/pt-BR.js
var ptBR = {
  // Shell / regions
  "shell.skipToDocument": "Ir para o documento",
  "shell.regionToolbar": "Barra de ferramentas",
  "shell.regionSidePanel": "Painel lateral",
  "shell.regionDocument": "Documento",
  "shell.regionSearchComments": "Pesquisa e coment\xE1rios",
  "shell.pageOfTotal": "P\xE1gina {page} de {pageCount}",
  "shell.zoomPercent": "Zoom {percent}%",
  "shell.panelOpened": "Painel {panel} aberto",
  "shell.panelClosed": "Painel fechado",
  "shell.shortcutHelp": "Atalhos de teclado: F6 para navegar entre regi\xF5es, Ctrl+F para pesquisar, Ctrl+P para imprimir, Ctrl+Plus para aumentar o zoom, Ctrl+Minus para diminuir o zoom, Ctrl+0 para redefinir o zoom, Escape para fechar pain\xE9is. Pressione ? para ver a lista de atalhos.",
  "shell.shortcutHelpAnnounce": "Atalhos de teclado: F6 navegar regi\xF5es, Ctrl+F pesquisar, Ctrl+P imprimir, Ctrl+Plus aumentar zoom, Ctrl+Minus diminuir zoom, Ctrl+0 redefinir zoom, Escape fechar painel, ? exibir esta ajuda.",
  // Toolbar
  "toolbar.label": "Barra de ferramentas do documento",
  "toolbar.menu": "Menu",
  "toolbar.search": "Pesquisar",
  "toolbar.comments": "Coment\xE1rios",
  "toolbar.print": "Imprimir",
  "toolbar.download": "Baixar",
  "toolbar.fullscreen": "Tela cheia",
  "toolbar.exitFullscreen": "Sair da tela cheia",
  "toolbar.darkMode": "Modo escuro",
  "toolbar.systemTheme": "Tema do sistema",
  "toolbar.lightMode": "Modo claro",
  "toolbar.previousPage": "P\xE1gina anterior",
  "toolbar.nextPage": "Pr\xF3xima p\xE1gina",
  "toolbar.pageNumber": "N\xFAmero da p\xE1gina",
  "toolbar.zoomIn": "Aumentar zoom",
  "toolbar.zoomOut": "Diminuir zoom",
  "toolbar.zoomLevel": "N\xEDvel de zoom",
  "toolbar.zoomOptions": "Op\xE7\xF5es de zoom",
  "toolbar.zoomLevels": "N\xEDveis de zoom",
  "toolbar.more": "Mais",
  // Zoom modes
  "zoom.fitWidth": "Ajustar \xE0 largura",
  "zoom.fitHeight": "Ajustar \xE0 altura",
  "zoom.fitPage": "Ajustar \xE0 p\xE1gina",
  // Floating toolbar
  "floatingToolbar.label": "Navega\xE7\xE3o de p\xE1ginas e zoom",
  // Search panel
  "search.placeholder": "Pesquisar no documento...",
  "search.label": "Texto de pesquisa",
  "search.matchCase": "Diferenciar mai\xFAsculas e min\xFAsculas",
  "search.fuzzyMatch": "Correspond\xEAncia aproximada",
  "search.previousMatch": "Resultado anterior (Shift+Enter)",
  "search.nextMatch": "Pr\xF3ximo resultado (Enter)",
  "search.loadingText": "Carregando texto\u2026",
  "search.noResults": "Nenhum resultado",
  "search.resultStatus": "{current} de {total}",
  "search.pageHeader": "P\xE1gina {page}",
  "search.resultsLabel": "Resultados da pesquisa",
  // Password dialog
  "password.title": "Senha necess\xE1ria",
  "password.message": "Este documento \xE9 protegido. Digite a senha para abri-lo.",
  "password.placeholder": "Digite a senha",
  "password.label": "Senha",
  "password.showPassword": "Mostrar senha",
  "password.hidePassword": "Ocultar senha",
  "password.unlock": "Desbloquear",
  // Print dialog
  "print.title": "Imprimir",
  "print.pagesLabel": "P\xE1ginas",
  "print.allPages": "Todas as p\xE1ginas",
  "print.currentPage": "P\xE1gina atual ({page})",
  "print.pagesRange": "P\xE1ginas",
  "print.pagesTo": "at\xE9",
  "print.custom": "Personalizado",
  "print.customPlaceholder": "ex: 1,3,5-8",
  "print.qualityLabel": "Qualidade",
  "print.qualityDraft": "Rascunho (150 DPI)",
  "print.qualityStandard": "Padr\xE3o (300 DPI)",
  "print.qualityHigh": "Alta (600 DPI)",
  "print.cancel": "Cancelar",
  "print.print": "Imprimir",
  "print.errorPageRange": "Digite n\xFAmeros de p\xE1gina entre 1 e {max}.",
  "print.errorStartEnd": "A p\xE1gina inicial deve ser menor ou igual \xE0 p\xE1gina final.",
  "print.errorCustomRange": 'Intervalo inv\xE1lido. Use o formato "1,3,5-8". As p\xE1ginas devem estar entre 1 e {max}.',
  // Loading overlay
  "loading.connecting": "Conectando...",
  "loading.loading": "Carregando...",
  "loading.processing": "Processando documento...",
  "loading.preparingPrint": "Preparando para imprimir...",
  "loading.renderingPage": "Renderizando p\xE1gina {current} de {total}...",
  "loading.progressSize": "{loaded} / {total} MB ({percent}%)",
  "loading.progressLoaded": "{loaded} MB carregados...",
  // View mode menu
  "viewMode.label": "Configura\xE7\xF5es de exibi\xE7\xE3o",
  "viewMode.view": "Visualiza\xE7\xE3o",
  "viewMode.paged": "Paginado",
  "viewMode.continuousView": "Cont\xEDnuo",
  "viewMode.scroll": "Rolagem",
  "viewMode.layout": "Layout",
  "viewMode.rotation": "Rota\xE7\xE3o",
  "viewMode.spacing": "Espa\xE7amento",
  "viewMode.spread": "P\xE1ginas duplas",
  "viewMode.continuous": "Cont\xEDnuo",
  "viewMode.single": "Simples",
  "viewMode.double": "Duplo",
  "viewMode.coverRight": "Capa \xE0 direita",
  "viewMode.coverLeft": "Capa \xE0 esquerda",
  "viewMode.spacingAll": "Todos",
  "viewMode.spacingNone": "Nenhum",
  "viewMode.spacingSpread": "P\xE1ginas duplas",
  "viewMode.spacingPage": "P\xE1gina",
  // Annotation panel
  "annotations.comments": "Coment\xE1rios",
  "annotations.noComments": "Nenhum coment\xE1rio neste documento",
  "annotations.loading": "Carregando coment\xE1rios...",
  "annotations.replyCount": "{count} respostas",
  "annotations.replyCountSingle": "1 resposta",
  "annotations.showReplies": "Mostrar respostas",
  "annotations.hideReplies": "Ocultar respostas",
  "annotations.pageHeader": "P\xE1gina {page}",
  // Outline panel
  "outline.label": "Sum\xE1rio do documento",
  "outline.loading": "Carregando sum\xE1rio...",
  "outline.empty": "Nenhum sum\xE1rio neste documento",
  // Bookmarks panel
  "bookmarks.empty": "Nenhum marcador neste documento",
  // Layers panel
  "layers.loading": "Carregando camadas...",
  "layers.empty": "Nenhuma camada neste documento",
  // Attachments panel
  "attachments.empty": "Nenhum anexo neste documento",
  "layers.visibility": "Visibilidade da camada {name}",
  // Fonts panel
  "fonts.loading": "Carregando fontes...",
  "fonts.empty": "Nenhum dado de fonte dispon\xEDvel",
  // Thumbnail panel
  "thumbnails.label": "Miniaturas das p\xE1ginas",
  "thumbnails.pageLabel": "P\xE1gina {page}",
  // Spread and viewport
  "spread.pageLabel": "P\xE1gina {page}",
  "spread.pageContent": "Conte\xFAdo da p\xE1gina {page}",
  "spread.rendering": "Renderizando...",
  "viewport.documentContent": "Conte\xFAdo do documento",
  // Left panel tabs
  "leftPanel.tabs": "Abas do painel",
  "leftPanel.thumbnails": "Miniaturas",
  "leftPanel.outline": "Sum\xE1rio",
  "leftPanel.bookmarks": "Marcadores",
  "leftPanel.layers": "Camadas",
  "leftPanel.attachments": "Anexos",
  "leftPanel.fonts": "Fontes",
  "leftPanel.resizeHandle": "Redimensionar painel lateral",
  // Right panel
  "rightPanel.searchPanel": "Painel de pesquisa",
  "rightPanel.commentsPanel": "Painel de coment\xE1rios",
  "rightPanel.resizeHandle": "Redimensionar painel",
  // Tools
  "tools.pointer": "Ponteiro",
  "tools.hand": "M\xE3o",
  "tools.zoom": "Zoom",
  "tools.annotate": "Anotar",
  "tools.markup": "Marca\xE7\xE3o",
  "tools.subtoolbar": "Op\xE7\xF5es de ferramenta",
  // Shared sub-tools
  "tools.select": "Selecionar",
  "tools.deleteAnnotation": "Excluir anota\xE7\xE3o",
  // Annotate sub-tools
  "tools.freehand": "M\xE3o livre",
  "tools.line": "Linha",
  "tools.arrow": "Seta",
  "tools.rectangle": "Ret\xE2ngulo",
  "tools.ellipse": "Elipse",
  "tools.polygon": "Pol\xEDgono",
  "tools.polyline": "Polilinha",
  "tools.textbox": "Caixa de texto",
  // Markup sub-tools
  "tools.highlight": "Real\xE7ar",
  "tools.underline": "Sublinhado",
  "tools.strikethrough": "Tachado",
  "tools.squiggly": "Ondulado",
  // Tool options
  "tools.strokeColor": "Cor do tra\xE7o",
  "tools.fillColor": "Cor de preenchimento",
  "tools.noFill": "Sem preenchimento",
  "tools.strokeWidth": "Largura do tra\xE7o",
  "tools.opacity": "Opacidade",
  "tools.fontSize": "Tamanho da fonte",
  "tools.lineStyle": "Estilo de linha",
  "tools.lineStyleSolid": "S\xF3lido",
  "tools.lineStyleDashed": "Tracejado",
  "tools.lineStyleDotted": "Pontilhado",
  "tools.arrowHeadStart": "In\xEDcio",
  "tools.arrowHeadEnd": "Final",
  "tools.arrowHeadNone": "Nenhuma",
  "tools.arrowHeadOpen": "Aberta",
  "tools.arrowHeadClosed": "Fechada",
  "tools.undo": "Desfazer",
  "tools.redo": "Refazer"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/ar.js
var ar = {
  // Shell / regions
  "shell.skipToDocument": "\u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  "shell.regionToolbar": "\u0634\u0631\u064A\u0637 \u0627\u0644\u0623\u062F\u0648\u0627\u062A",
  "shell.regionSidePanel": "\u0627\u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0629",
  "shell.regionDocument": "\u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  "shell.regionSearchComments": "\u0627\u0644\u0628\u062D\u062B \u0648\u0627\u0644\u062A\u0639\u0644\u064A\u0642\u0627\u062A",
  "shell.pageOfTotal": "\u0635\u0641\u062D\u0629 {page} \u0645\u0646 {pageCount}",
  "shell.zoomPercent": "\u062A\u0643\u0628\u064A\u0631 {percent}%",
  "shell.panelOpened": "\u062A\u0645 \u0641\u062A\u062D \u0644\u0648\u062D\u0629 {panel}",
  "shell.panelClosed": "\u062A\u0645 \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0644\u0648\u062D\u0629",
  "shell.shortcutHelp": "\u0627\u062E\u062A\u0635\u0627\u0631\u0627\u062A \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0641\u0627\u062A\u064A\u062D: F6 \u0644\u0644\u062A\u0646\u0642\u0644 \u0628\u064A\u0646 \u0627\u0644\u0623\u0642\u0633\u0627\u0645\u060C Ctrl+F \u0644\u0644\u0628\u062D\u062B\u060C Ctrl+P \u0644\u0644\u0637\u0628\u0627\u0639\u0629\u060C Ctrl+Plus \u0644\u0644\u062A\u0643\u0628\u064A\u0631\u060C Ctrl+Minus \u0644\u0644\u062A\u0635\u063A\u064A\u0631\u060C Ctrl+0 \u0644\u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0627\u0644\u062A\u0643\u0628\u064A\u0631\u060C Escape \u0644\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0644\u0648\u062D\u0627\u062A. \u0627\u0636\u063A\u0637 ? \u0644\u0639\u0631\u0636 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u062E\u062A\u0635\u0627\u0631\u0627\u062A.",
  "shell.shortcutHelpAnnounce": "\u0627\u062E\u062A\u0635\u0627\u0631\u0627\u062A \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0641\u0627\u062A\u064A\u062D: F6 \u0627\u0644\u062A\u0646\u0642\u0644 \u0628\u064A\u0646 \u0627\u0644\u0623\u0642\u0633\u0627\u0645\u060C Ctrl+F \u0627\u0644\u0628\u062D\u062B\u060C Ctrl+P \u0627\u0644\u0637\u0628\u0627\u0639\u0629\u060C Ctrl+Plus \u062A\u0643\u0628\u064A\u0631\u060C Ctrl+Minus \u062A\u0635\u063A\u064A\u0631\u060C Ctrl+0 \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0627\u0644\u062A\u0643\u0628\u064A\u0631\u060C Escape \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0644\u0648\u062D\u0629\u060C ? \u0639\u0631\u0636 \u0647\u0630\u0647 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629.",
  // Toolbar
  "toolbar.label": "\u0634\u0631\u064A\u0637 \u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  "toolbar.menu": "\u0627\u0644\u0642\u0627\u0626\u0645\u0629",
  "toolbar.search": "\u0628\u062D\u062B",
  "toolbar.comments": "\u062A\u0639\u0644\u064A\u0642\u0627\u062A",
  "toolbar.print": "\u0637\u0628\u0627\u0639\u0629",
  "toolbar.download": "\u062A\u0646\u0632\u064A\u0644",
  "toolbar.fullscreen": "\u0645\u0644\u0621 \u0627\u0644\u0634\u0627\u0634\u0629",
  "toolbar.exitFullscreen": "\u0627\u0644\u062E\u0631\u0648\u062C \u0645\u0646 \u0645\u0644\u0621 \u0627\u0644\u0634\u0627\u0634\u0629",
  "toolbar.darkMode": "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646",
  "toolbar.systemTheme": "\u0633\u0645\u0629 \u0627\u0644\u0646\u0638\u0627\u0645",
  "toolbar.lightMode": "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062A\u062D",
  "toolbar.previousPage": "\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
  "toolbar.nextPage": "\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629",
  "toolbar.pageNumber": "\u0631\u0642\u0645 \u0627\u0644\u0635\u0641\u062D\u0629",
  "toolbar.zoomIn": "\u062A\u0643\u0628\u064A\u0631",
  "toolbar.zoomOut": "\u062A\u0635\u063A\u064A\u0631",
  "toolbar.zoomLevel": "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062A\u0643\u0628\u064A\u0631",
  "toolbar.zoomOptions": "\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0643\u0628\u064A\u0631",
  "toolbar.zoomLevels": "\u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u062A\u0643\u0628\u064A\u0631",
  "toolbar.more": "\u0627\u0644\u0645\u0632\u064A\u062F",
  // Zoom modes
  "zoom.fitWidth": "\u0645\u0644\u0627\u0621\u0645\u0629 \u0627\u0644\u0639\u0631\u0636",
  "zoom.fitHeight": "\u0645\u0644\u0627\u0621\u0645\u0629 \u0627\u0644\u0627\u0631\u062A\u0641\u0627\u0639",
  "zoom.fitPage": "\u0645\u0644\u0627\u0621\u0645\u0629 \u0627\u0644\u0635\u0641\u062D\u0629",
  // Floating toolbar
  "floatingToolbar.label": "\u0627\u0644\u062A\u0646\u0642\u0644 \u0628\u064A\u0646 \u0627\u0644\u0635\u0641\u062D\u0627\u062A \u0648\u0627\u0644\u062A\u0643\u0628\u064A\u0631",
  // Search panel
  "search.placeholder": "\u0627\u0644\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u0633\u062A\u0646\u062F...",
  "search.label": "\u0646\u0635 \u0627\u0644\u0628\u062D\u062B",
  "search.matchCase": "\u0645\u0637\u0627\u0628\u0642\u0629 \u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u062D\u0631\u0641",
  "search.fuzzyMatch": "\u0645\u0637\u0627\u0628\u0642\u0629 \u063A\u0627\u0645\u0636\u0629",
  "search.previousMatch": "\u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 (Shift+Enter)",
  "search.nextMatch": "\u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 (Enter)",
  "search.loadingText": "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0646\u0635\u2026",
  "search.noResults": "\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C",
  "search.resultStatus": "{current} \u0645\u0646 {total}",
  "search.pageHeader": "\u0635\u0641\u062D\u0629 {page}",
  "search.resultsLabel": "\u0646\u062A\u0627\u0626\u062C \u0627\u0644\u0628\u062D\u062B",
  // Password dialog
  "password.title": "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0629",
  "password.message": "\u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0645\u062D\u0645\u064A. \u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0644\u0641\u062A\u062D\u0647.",
  "password.placeholder": "\u0623\u062F\u062E\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
  "password.label": "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
  "password.showPassword": "\u0625\u0638\u0647\u0627\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
  "password.hidePassword": "\u0625\u062E\u0641\u0627\u0621 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
  "password.unlock": "\u0641\u062A\u062D \u0627\u0644\u0642\u0641\u0644",
  // Print dialog
  "print.title": "\u0637\u0628\u0627\u0639\u0629",
  "print.pagesLabel": "\u0627\u0644\u0635\u0641\u062D\u0627\u062A",
  "print.allPages": "\u062C\u0645\u064A\u0639 \u0627\u0644\u0635\u0641\u062D\u0627\u062A",
  "print.currentPage": "\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 ({page})",
  "print.pagesRange": "\u0627\u0644\u0635\u0641\u062D\u0627\u062A",
  "print.pagesTo": "\u0625\u0644\u0649",
  "print.custom": "\u0645\u062E\u0635\u0635",
  "print.customPlaceholder": "\u0645\u062B\u0627\u0644: 1,3,5-8",
  "print.qualityLabel": "\u0627\u0644\u062C\u0648\u062F\u0629",
  "print.qualityDraft": "\u0645\u0633\u0648\u062F\u0629 (150 DPI)",
  "print.qualityStandard": "\u0642\u064A\u0627\u0633\u064A\u0629 (300 DPI)",
  "print.qualityHigh": "\u0639\u0627\u0644\u064A\u0629 (600 DPI)",
  "print.cancel": "\u0625\u0644\u063A\u0627\u0621",
  "print.print": "\u0637\u0628\u0627\u0639\u0629",
  "print.errorPageRange": "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0623\u0631\u0642\u0627\u0645 \u0635\u0641\u062D\u0627\u062A \u0628\u064A\u0646 1 \u0648{max}.",
  "print.errorStartEnd": "\u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0635\u0641\u062D\u0629 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0623\u0642\u0644 \u0645\u0646 \u0623\u0648 \u062A\u0633\u0627\u0648\u064A \u0635\u0641\u062D\u0629 \u0627\u0644\u0646\u0647\u0627\u064A\u0629.",
  "print.errorCustomRange": '\u0646\u0637\u0627\u0642 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D. \u0627\u0633\u062A\u062E\u062F\u0645 \u062A\u0646\u0633\u064A\u0642\u064B\u0627 \u0645\u062B\u0644 "1,3,5-8". \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0627\u0644\u0635\u0641\u062D\u0627\u062A \u0628\u064A\u0646 1 \u0648{max}.',
  // Loading overlay
  "loading.connecting": "\u062C\u0627\u0631\u064D \u0627\u0644\u0627\u062A\u0635\u0627\u0644...",
  "loading.loading": "\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u062D\u0645\u064A\u0644...",
  "loading.processing": "\u062C\u0627\u0631\u064D \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0645\u0633\u062A\u0646\u062F...",
  "loading.preparingPrint": "\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u0644\u0644\u0637\u0628\u0627\u0639\u0629...",
  "loading.renderingPage": "\u062C\u0627\u0631\u064D \u0639\u0631\u0636 \u0627\u0644\u0635\u0641\u062D\u0629 {current} \u0645\u0646 {total}...",
  "loading.progressSize": "{loaded} / {total} \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A ({percent}%)",
  "loading.progressLoaded": "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 {loaded} \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A...",
  // View mode menu
  "viewMode.label": "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0639\u0631\u0636",
  "viewMode.view": "\u0627\u0644\u0639\u0631\u0636",
  "viewMode.paged": "\u0645\u0642\u0633\u0645 \u0644\u0635\u0641\u062D\u0627\u062A",
  "viewMode.continuousView": "\u0645\u062A\u0648\u0627\u0635\u0644",
  "viewMode.scroll": "\u0627\u0644\u062A\u0645\u0631\u064A\u0631",
  "viewMode.layout": "\u0627\u0644\u062A\u062E\u0637\u064A\u0637",
  "viewMode.rotation": "\u0627\u0644\u062A\u062F\u0648\u064A\u0631",
  "viewMode.spacing": "\u0627\u0644\u062A\u0628\u0627\u0639\u062F",
  "viewMode.spread": "\u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u062F\u0648\u062C",
  "viewMode.continuous": "\u0645\u062A\u0648\u0627\u0635\u0644",
  "viewMode.single": "\u0645\u0641\u0631\u062F",
  "viewMode.double": "\u0645\u0632\u062F\u0648\u062C",
  "viewMode.coverRight": "\u063A\u0644\u0627\u0641 \u064A\u0645\u064A\u0646",
  "viewMode.coverLeft": "\u063A\u0644\u0627\u0641 \u064A\u0633\u0627\u0631",
  "viewMode.spacingAll": "\u0627\u0644\u0643\u0644",
  "viewMode.spacingNone": "\u0628\u062F\u0648\u0646",
  "viewMode.spacingSpread": "\u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u062F\u0648\u062C",
  "viewMode.spacingPage": "\u0627\u0644\u0635\u0641\u062D\u0629",
  // Annotation panel
  "annotations.comments": "\u0627\u0644\u062A\u0639\u0644\u064A\u0642\u0627\u062A",
  "annotations.noComments": "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0639\u0644\u064A\u0642\u0627\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  "annotations.loading": "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0639\u0644\u064A\u0642\u0627\u062A...",
  "annotations.replyCount": "{count} \u0631\u062F\u0648\u062F",
  "annotations.replyCountSingle": "\u0631\u062F \u0648\u0627\u062D\u062F",
  "annotations.showReplies": "\u0639\u0631\u0636 \u0627\u0644\u0631\u062F\u0648\u062F",
  "annotations.hideReplies": "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0631\u062F\u0648\u062F",
  "annotations.pageHeader": "\u0635\u0641\u062D\u0629 {page}",
  // Outline panel
  "outline.label": "\u0641\u0647\u0631\u0633 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  "outline.loading": "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0641\u0647\u0631\u0633...",
  "outline.empty": "\u0644\u0627 \u064A\u0648\u062C\u062F \u0641\u0647\u0631\u0633 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  // Bookmarks panel
  "bookmarks.empty": "\u0644\u0627 \u062A\u0648\u062C\u062F \u0625\u0634\u0627\u0631\u0627\u062A \u0645\u0631\u062C\u0639\u064A\u0629 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  // Layers panel
  "layers.loading": "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0637\u0628\u0642\u0627\u062A...",
  "layers.empty": "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0628\u0642\u0627\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  // Attachments panel
  "attachments.empty": "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0631\u0641\u0642\u0627\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  "layers.visibility": "\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0637\u0628\u0642\u0629 {name}",
  // Fonts panel
  "fonts.loading": "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062E\u0637\u0648\u0637...",
  "fonts.empty": "\u0644\u0627 \u062A\u062A\u0648\u0641\u0631 \u0628\u064A\u0627\u0646\u0627\u062A \u062E\u0637\u0648\u0637",
  // Thumbnail panel
  "thumbnails.label": "\u0635\u0648\u0631 \u0645\u0635\u063A\u0631\u0629 \u0644\u0644\u0635\u0641\u062D\u0627\u062A",
  "thumbnails.pageLabel": "\u0635\u0641\u062D\u0629 {page}",
  // Spread and viewport
  "spread.pageLabel": "\u0635\u0641\u062D\u0629 {page}",
  "spread.pageContent": "\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0635\u0641\u062D\u0629 {page}",
  "spread.rendering": "\u062C\u0627\u0631\u064D \u0627\u0644\u0639\u0631\u0636...",
  "viewport.documentContent": "\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0633\u062A\u0646\u062F",
  // Left panel tabs
  "leftPanel.tabs": "\u0639\u0644\u0627\u0645\u0627\u062A \u062A\u0628\u0648\u064A\u0628 \u0627\u0644\u0644\u0648\u062D\u0629",
  "leftPanel.thumbnails": "\u0635\u0648\u0631 \u0645\u0635\u063A\u0631\u0629",
  "leftPanel.outline": "\u0627\u0644\u0641\u0647\u0631\u0633",
  "leftPanel.bookmarks": "\u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0631\u062C\u0639\u064A\u0629",
  "leftPanel.layers": "\u0627\u0644\u0637\u0628\u0642\u0627\u062A",
  "leftPanel.attachments": "\u0627\u0644\u0645\u0631\u0641\u0642\u0627\u062A",
  "leftPanel.fonts": "\u0627\u0644\u062E\u0637\u0648\u0637",
  "leftPanel.resizeHandle": "\u062A\u063A\u064A\u064A\u0631 \u062D\u062C\u0645 \u0627\u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0629",
  // Right panel
  "rightPanel.searchPanel": "\u0644\u0648\u062D\u0629 \u0627\u0644\u0628\u062D\u062B",
  "rightPanel.commentsPanel": "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0642\u0627\u062A",
  "rightPanel.resizeHandle": "\u062A\u063A\u064A\u064A\u0631 \u062D\u062C\u0645 \u0627\u0644\u0644\u0648\u062D\u0629",
  // Tools
  "tools.pointer": "\u0645\u0624\u0634\u0631",
  "tools.hand": "\u064A\u062F",
  "tools.zoom": "\u062A\u0643\u0628\u064A\u0631",
  "tools.annotate": "\u062A\u0639\u0644\u064A\u0642 \u062A\u0648\u0636\u064A\u062D\u064A",
  "tools.markup": "\u062A\u0648\u0635\u064A\u0641",
  "tools.subtoolbar": "\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0623\u062F\u0627\u0629",
  // Shared sub-tools
  "tools.select": "\u062A\u062D\u062F\u064A\u062F",
  "tools.deleteAnnotation": "\u062D\u0630\u0641 \u0627\u0644\u062A\u0639\u0644\u064A\u0642 \u0627\u0644\u062A\u0648\u0636\u064A\u062D\u064A",
  // Annotate sub-tools
  "tools.freehand": "\u0631\u0633\u0645 \u062D\u0631",
  "tools.line": "\u062E\u0637",
  "tools.arrow": "\u0633\u0647\u0645",
  "tools.rectangle": "\u0645\u0633\u062A\u0637\u064A\u0644",
  "tools.ellipse": "\u0642\u0637\u0639 \u0646\u0627\u0642\u0635",
  "tools.polygon": "\u0645\u0636\u0644\u0639",
  "tools.polyline": "\u062E\u0637 \u0645\u062A\u0639\u062F\u062F",
  "tools.textbox": "\u0645\u0631\u0628\u0639 \u0646\u0635",
  // Markup sub-tools
  "tools.highlight": "\u062A\u0645\u064A\u064A\u0632",
  "tools.underline": "\u062A\u0633\u0637\u064A\u0631",
  "tools.strikethrough": "\u064A\u062A\u0648\u0633\u0637\u0647 \u062E\u0637",
  "tools.squiggly": "\u062E\u0637 \u0645\u062A\u0645\u0648\u062C",
  // Tool options
  "tools.strokeColor": "\u0644\u0648\u0646 \u0627\u0644\u062D\u062F",
  "tools.fillColor": "\u0644\u0648\u0646 \u0627\u0644\u062A\u0639\u0628\u0626\u0629",
  "tools.noFill": "\u0628\u062F\u0648\u0646 \u062A\u0639\u0628\u0626\u0629",
  "tools.strokeWidth": "\u0639\u0631\u0636 \u0627\u0644\u062D\u062F",
  "tools.opacity": "\u0627\u0644\u0634\u0641\u0627\u0641\u064A\u0629",
  "tools.fontSize": "\u062D\u062C\u0645 \u0627\u0644\u062E\u0637",
  "tools.lineStyle": "\u0646\u0645\u0637 \u0627\u0644\u062E\u0637",
  "tools.lineStyleSolid": "\u0645\u062A\u0635\u0644",
  "tools.lineStyleDashed": "\u0645\u062A\u0642\u0637\u0639",
  "tools.lineStyleDotted": "\u0645\u0646\u0642\u0637",
  "tools.arrowHeadStart": "\u0627\u0644\u0628\u062F\u0627\u064A\u0629",
  "tools.arrowHeadEnd": "\u0627\u0644\u0646\u0647\u0627\u064A\u0629",
  "tools.arrowHeadNone": "\u0628\u062F\u0648\u0646",
  "tools.arrowHeadOpen": "\u0645\u0641\u062A\u0648\u062D",
  "tools.arrowHeadClosed": "\u0645\u063A\u0644\u0642",
  "tools.undo": "\u062A\u0631\u0627\u062C\u0639",
  "tools.redo": "\u0625\u0639\u0627\u062F\u0629"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/ru.js
var ru = {
  // Shell / regions
  "shell.skipToDocument": "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0443",
  "shell.regionToolbar": "\u041F\u0430\u043D\u0435\u043B\u044C \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u043E\u0432",
  "shell.regionSidePanel": "\u0411\u043E\u043A\u043E\u0432\u0430\u044F \u043F\u0430\u043D\u0435\u043B\u044C",
  "shell.regionDocument": "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442",
  "shell.regionSearchComments": "\u041F\u043E\u0438\u0441\u043A \u0438 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",
  "shell.pageOfTotal": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 {page} \u0438\u0437 {pageCount}",
  "shell.zoomPercent": "\u041C\u0430\u0441\u0448\u0442\u0430\u0431 {percent}%",
  "shell.panelOpened": "\u041F\u0430\u043D\u0435\u043B\u044C \xAB{panel}\xBB \u043E\u0442\u043A\u0440\u044B\u0442\u0430",
  "shell.panelClosed": "\u041F\u0430\u043D\u0435\u043B\u044C \u0437\u0430\u043A\u0440\u044B\u0442\u0430",
  "shell.shortcutHelp": "\u0421\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u044F \u043A\u043B\u0430\u0432\u0438\u0448: F6 \u2014 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043C\u0435\u0436\u0434\u0443 \u043E\u0431\u043B\u0430\u0441\u0442\u044F\u043C\u0438, Ctrl+F \u2014 \u043F\u043E\u0438\u0441\u043A, Ctrl+P \u2014 \u043F\u0435\u0447\u0430\u0442\u044C, Ctrl+Plus \u2014 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C \u043C\u0430\u0441\u0448\u0442\u0430\u0431, Ctrl+Minus \u2014 \u0443\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C \u043C\u0430\u0441\u0448\u0442\u0430\u0431, Ctrl+0 \u2014 \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043C\u0430\u0441\u0448\u0442\u0430\u0431, Escape \u2014 \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u0438. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 ? \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u0441\u043F\u0438\u0441\u043A\u0430 \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0439.",
  "shell.shortcutHelpAnnounce": "\u0421\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u044F \u043A\u043B\u0430\u0432\u0438\u0448: F6 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043C\u0435\u0436\u0434\u0443 \u043E\u0431\u043B\u0430\u0441\u0442\u044F\u043C\u0438, Ctrl+F \u043F\u043E\u0438\u0441\u043A, Ctrl+P \u043F\u0435\u0447\u0430\u0442\u044C, Ctrl+Plus \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C, Ctrl+Minus \u0443\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C, Ctrl+0 \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043C\u0430\u0441\u0448\u0442\u0430\u0431, Escape \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u044C, ? \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u044D\u0442\u0443 \u0441\u043F\u0440\u0430\u0432\u043A\u0443.",
  // Toolbar
  "toolbar.label": "\u041F\u0430\u043D\u0435\u043B\u044C \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u043E\u0432 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430",
  "toolbar.menu": "\u041C\u0435\u043D\u044E",
  "toolbar.search": "\u041F\u043E\u0438\u0441\u043A",
  "toolbar.comments": "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",
  "toolbar.print": "\u041F\u0435\u0447\u0430\u0442\u044C",
  "toolbar.download": "\u0421\u043A\u0430\u0447\u0430\u0442\u044C",
  "toolbar.fullscreen": "\u0412\u043E \u0432\u0435\u0441\u044C \u044D\u043A\u0440\u0430\u043D",
  "toolbar.exitFullscreen": "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0433\u043E \u0440\u0435\u0436\u0438\u043C\u0430",
  "toolbar.darkMode": "\u0422\u0451\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430",
  "toolbar.systemTheme": "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430",
  "toolbar.lightMode": "\u0421\u0432\u0435\u0442\u043B\u0430\u044F \u0442\u0435\u043C\u0430",
  "toolbar.previousPage": "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
  "toolbar.nextPage": "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
  "toolbar.pageNumber": "\u041D\u043E\u043C\u0435\u0440 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
  "toolbar.zoomIn": "\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C",
  "toolbar.zoomOut": "\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C",
  "toolbar.zoomLevel": "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0430",
  "toolbar.zoomOptions": "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0430",
  "toolbar.zoomLevels": "\u0423\u0440\u043E\u0432\u043D\u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0430",
  "toolbar.more": "\u0415\u0449\u0451",
  // Zoom modes
  "zoom.fitWidth": "\u041F\u043E \u0448\u0438\u0440\u0438\u043D\u0435",
  "zoom.fitHeight": "\u041F\u043E \u0432\u044B\u0441\u043E\u0442\u0435",
  "zoom.fitPage": "\u041F\u043E \u0440\u0430\u0437\u043C\u0435\u0440\u0443 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
  // Floating toolbar
  "floatingToolbar.label": "\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u043F\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u043C \u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431",
  // Search panel
  "search.placeholder": "\u041F\u043E\u0438\u0441\u043A \u0432 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0435...",
  "search.label": "\u0422\u0435\u043A\u0441\u0442 \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
  "search.matchCase": "\u0421 \u0443\u0447\u0451\u0442\u043E\u043C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430",
  "search.fuzzyMatch": "\u041D\u0435\u0447\u0451\u0442\u043A\u043E\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435",
  "search.previousMatch": "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 (Shift+Enter)",
  "search.nextMatch": "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 (Enter)",
  "search.loadingText": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0442\u0435\u043A\u0441\u0442\u0430\u2026",
  "search.noResults": "\u041D\u0435\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432",
  "search.resultStatus": "{current} \u0438\u0437 {total}",
  "search.pageHeader": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 {page}",
  "search.resultsLabel": "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430",
  // Password dialog
  "password.title": "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u043F\u0430\u0440\u043E\u043B\u044C",
  "password.message": "\u042D\u0442\u043E\u0442 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0437\u0430\u0449\u0438\u0449\u0451\u043D \u043F\u0430\u0440\u043E\u043B\u0435\u043C. \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C \u0434\u043B\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F.",
  "password.placeholder": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C",
  "password.label": "\u041F\u0430\u0440\u043E\u043B\u044C",
  "password.showPassword": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C",
  "password.hidePassword": "\u0421\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C",
  "password.unlock": "\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
  // Print dialog
  "print.title": "\u041F\u0435\u0447\u0430\u0442\u044C",
  "print.pagesLabel": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
  "print.allPages": "\u0412\u0441\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
  "print.currentPage": "\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 ({page})",
  "print.pagesRange": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
  "print.pagesTo": "\u043F\u043E",
  "print.custom": "\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u043B\u044C\u043D\u044B\u0439",
  "print.customPlaceholder": "\u043D\u0430\u043F\u0440. 1,3,5-8",
  "print.qualityLabel": "\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E",
  "print.qualityDraft": "\u0427\u0435\u0440\u043D\u043E\u0432\u043E\u0435 (150 DPI)",
  "print.qualityStandard": "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u043E\u0435 (300 DPI)",
  "print.qualityHigh": "\u0412\u044B\u0441\u043E\u043A\u043E\u0435 (600 DPI)",
  "print.cancel": "\u041E\u0442\u043C\u0435\u043D\u0430",
  "print.print": "\u041F\u0435\u0447\u0430\u0442\u044C",
  "print.errorPageRange": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u043C\u0435\u0440\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446 \u043E\u0442 1 \u0434\u043E {max}.",
  "print.errorStartEnd": "\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043C\u0435\u043D\u044C\u0448\u0435 \u0438\u043B\u0438 \u0440\u0430\u0432\u043D\u0430 \u043A\u043E\u043D\u0435\u0447\u043D\u043E\u0439.",
  "print.errorCustomRange": '\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0444\u043E\u0440\u043C\u0430\u0442 \u0432\u0438\u0434\u0430 "1,3,5-8". \u041D\u043E\u043C\u0435\u0440\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446 \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u0442\u044C \u043E\u0442 1 \u0434\u043E {max}.',
  // Loading overlay
  "loading.connecting": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435...",
  "loading.loading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...",
  "loading.processing": "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430...",
  "loading.preparingPrint": "\u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u043A \u043F\u0435\u0447\u0430\u0442\u0438...",
  "loading.renderingPage": "\u041E\u0442\u0440\u0438\u0441\u043E\u0432\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B {current} \u0438\u0437 {total}...",
  "loading.progressSize": "{loaded} / {total} \u041C\u0411 ({percent}%)",
  "loading.progressLoaded": "\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E {loaded} \u041C\u0411...",
  // View mode menu
  "viewMode.label": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
  "viewMode.view": "\u0412\u0438\u0434",
  "viewMode.paged": "\u041F\u043E\u0441\u0442\u0440\u0430\u043D\u0438\u0447\u043D\u044B\u0439",
  "viewMode.continuousView": "\u041D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u0439",
  "viewMode.scroll": "\u041F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0430",
  "viewMode.layout": "\u041C\u0430\u043A\u0435\u0442",
  "viewMode.rotation": "\u041F\u043E\u0432\u043E\u0440\u043E\u0442",
  "viewMode.spacing": "\u041E\u0442\u0441\u0442\u0443\u043F\u044B",
  "viewMode.spread": "\u0420\u0430\u0437\u0432\u043E\u0440\u043E\u0442",
  "viewMode.continuous": "\u041D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u0439",
  "viewMode.single": "\u041E\u0434\u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
  "viewMode.double": "\u0414\u0432\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
  "viewMode.coverRight": "\u041E\u0431\u043B\u043E\u0436\u043A\u0430 \u0441\u043F\u0440\u0430\u0432\u0430",
  "viewMode.coverLeft": "\u041E\u0431\u043B\u043E\u0436\u043A\u0430 \u0441\u043B\u0435\u0432\u0430",
  "viewMode.spacingAll": "\u0412\u0441\u0435",
  "viewMode.spacingNone": "\u041D\u0435\u0442",
  "viewMode.spacingSpread": "\u0420\u0430\u0437\u0432\u043E\u0440\u043E\u0442",
  "viewMode.spacingPage": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
  // Annotation panel
  "annotations.comments": "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",
  "annotations.noComments": "\u0412 \u044D\u0442\u043E\u043C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0435 \u043D\u0435\u0442 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432",
  "annotations.loading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432...",
  "annotations.replyCount": "\u041E\u0442\u0432\u0435\u0442\u043E\u0432: {count}",
  "annotations.replyCountSingle": "1 \u043E\u0442\u0432\u0435\u0442",
  "annotations.showReplies": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442\u044B",
  "annotations.hideReplies": "\u0421\u043A\u0440\u044B\u0442\u044C \u043E\u0442\u0432\u0435\u0442\u044B",
  "annotations.pageHeader": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 {page}",
  // Outline panel
  "outline.label": "\u041E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430",
  "outline.loading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u044F...",
  "outline.empty": "\u0412 \u044D\u0442\u043E\u043C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0435 \u043D\u0435\u0442 \u043E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
  // Bookmarks panel
  "bookmarks.empty": "\u0412 \u044D\u0442\u043E\u043C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0435 \u043D\u0435\u0442 \u0437\u0430\u043A\u043B\u0430\u0434\u043E\u043A",
  // Layers panel
  "layers.loading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441\u043B\u043E\u0451\u0432...",
  "layers.empty": "\u0412 \u044D\u0442\u043E\u043C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0435 \u043D\u0435\u0442 \u0441\u043B\u043E\u0451\u0432",
  // Attachments panel
  "attachments.empty": "\u0412 \u044D\u0442\u043E\u043C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0435 \u043D\u0435\u0442 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0439",
  "layers.visibility": "\u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0441\u043B\u043E\u044F \xAB{name}\xBB",
  // Fonts panel
  "fonts.loading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0448\u0440\u0438\u0444\u0442\u043E\u0432...",
  "fonts.empty": "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0431 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0438 \u0448\u0440\u0438\u0444\u0442\u043E\u0432",
  // Thumbnail panel
  "thumbnails.label": "\u041C\u0438\u043D\u0438\u0430\u0442\u044E\u0440\u044B \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
  "thumbnails.pageLabel": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 {page}",
  // Spread and viewport
  "spread.pageLabel": "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 {page}",
  "spread.pageContent": "\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B {page}",
  "spread.rendering": "\u041E\u0442\u0440\u0438\u0441\u043E\u0432\u043A\u0430...",
  "viewport.documentContent": "\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430",
  // Left panel tabs
  "leftPanel.tabs": "\u0412\u043A\u043B\u0430\u0434\u043A\u0438 \u043F\u0430\u043D\u0435\u043B\u0438",
  "leftPanel.thumbnails": "\u041C\u0438\u043D\u0438\u0430\u0442\u044E\u0440\u044B",
  "leftPanel.outline": "\u041E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
  "leftPanel.bookmarks": "\u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0438",
  "leftPanel.layers": "\u0421\u043B\u043E\u0438",
  "leftPanel.attachments": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
  "leftPanel.fonts": "\u0428\u0440\u0438\u0444\u0442\u044B",
  "leftPanel.resizeHandle": "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0431\u043E\u043A\u043E\u0432\u043E\u0439 \u043F\u0430\u043D\u0435\u043B\u0438",
  // Right panel
  "rightPanel.searchPanel": "\u041F\u0430\u043D\u0435\u043B\u044C \u043F\u043E\u0438\u0441\u043A\u0430",
  "rightPanel.commentsPanel": "\u041F\u0430\u043D\u0435\u043B\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432",
  "rightPanel.resizeHandle": "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u043F\u0430\u043D\u0435\u043B\u0438",
  // Tools
  "tools.pointer": "\u0423\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C",
  "tools.hand": "\u0420\u0443\u043A\u0430",
  "tools.zoom": "\u041C\u0430\u0441\u0448\u0442\u0430\u0431",
  "tools.annotate": "\u0410\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u044F",
  "tools.markup": "\u0420\u0430\u0437\u043C\u0435\u0442\u043A\u0430",
  "tools.subtoolbar": "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0430",
  // Shared sub-tools
  "tools.select": "\u0412\u044B\u0431\u0440\u0430\u0442\u044C",
  "tools.deleteAnnotation": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u044E",
  // Annotate sub-tools
  "tools.freehand": "\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0435 \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435",
  "tools.line": "\u041B\u0438\u043D\u0438\u044F",
  "tools.arrow": "\u0421\u0442\u0440\u0435\u043B\u043A\u0430",
  "tools.rectangle": "\u041F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A",
  "tools.ellipse": "\u042D\u043B\u043B\u0438\u043F\u0441",
  "tools.polygon": "\u041C\u043D\u043E\u0433\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A",
  "tools.polyline": "\u041F\u043E\u043B\u0438\u043B\u0438\u043D\u0438\u044F",
  "tools.textbox": "\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0435",
  // Markup sub-tools
  "tools.highlight": "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435",
  "tools.underline": "\u041F\u043E\u0434\u0447\u0451\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u0435",
  "tools.strikethrough": "\u0417\u0430\u0447\u0451\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u0435",
  "tools.squiggly": "\u0412\u043E\u043B\u043D\u0438\u0441\u0442\u0430\u044F \u043B\u0438\u043D\u0438\u044F",
  // Tool options
  "tools.strokeColor": "\u0426\u0432\u0435\u0442 \u043E\u0431\u0432\u043E\u0434\u043A\u0438",
  "tools.fillColor": "\u0426\u0432\u0435\u0442 \u0437\u0430\u043B\u0438\u0432\u043A\u0438",
  "tools.noFill": "\u0411\u0435\u0437 \u0437\u0430\u043B\u0438\u0432\u043A\u0438",
  "tools.strokeWidth": "\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u043E\u0431\u0432\u043E\u0434\u043A\u0438",
  "tools.opacity": "\u041D\u0435\u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C",
  "tools.fontSize": "\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430",
  "tools.lineStyle": "\u0421\u0442\u0438\u043B\u044C \u043B\u0438\u043D\u0438\u0438",
  "tools.lineStyleSolid": "\u0421\u043F\u043B\u043E\u0448\u043D\u0430\u044F",
  "tools.lineStyleDashed": "\u041F\u0443\u043D\u043A\u0442\u0438\u0440\u043D\u0430\u044F",
  "tools.lineStyleDotted": "\u0422\u043E\u0447\u0435\u0447\u043D\u0430\u044F",
  "tools.arrowHeadStart": "\u041D\u0430\u0447\u0430\u043B\u043E",
  "tools.arrowHeadEnd": "\u041A\u043E\u043D\u0435\u0446",
  "tools.arrowHeadNone": "\u041D\u0435\u0442",
  "tools.arrowHeadOpen": "\u041E\u0442\u043A\u0440\u044B\u0442\u0430\u044F",
  "tools.arrowHeadClosed": "\u0417\u0430\u043A\u0440\u044B\u0442\u0430\u044F",
  "tools.undo": "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C",
  "tools.redo": "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C"
};

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/i18n/index.js
var locales = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ja,
  ko,
  es,
  fr,
  de,
  "pt-BR": ptBR,
  ar,
  ru
};
function interpolate(template, params) {
  if (!params)
    return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] !== void 0 ? String(params[key]) : `{${key}}`);
}
function resolveLocale(locale) {
  if (locales[locale])
    return locales[locale];
  const base = locale.split("-")[0];
  if (base === "zh")
    return zhCN;
  if (base === "pt")
    return ptBR;
  if (locales[base])
    return locales[base];
  return en;
}
function detectLocale() {
  if (typeof navigator !== "undefined") {
    return navigator.language ?? "en";
  }
  return "en";
}
function createI18n(locale, overrides) {
  const effectiveLocale = locale ?? detectLocale();
  const resolved = resolveLocale(effectiveLocale);
  const messages = overrides ? { ...resolved, ...overrides } : resolved;
  return {
    locale: effectiveLocale,
    t(key, params) {
      const template = messages[key] ?? key;
      return interpolate(template, params);
    }
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/tools/AnnotationUndoManager.js
var MAX_UNDO_DEPTH = 50;
var COALESCE_MS = 300;
function createAnnotationUndoManager(store) {
  const undoStack = [];
  const redoStack = [];
  const listeners = /* @__PURE__ */ new Set();
  let isApplying = false;
  let prevCanUndo = false;
  let prevCanRedo = false;
  function notifyIfChanged() {
    const cu = undoStack.length > 0;
    const cr = redoStack.length > 0;
    if (cu !== prevCanUndo || cr !== prevCanRedo) {
      prevCanUndo = cu;
      prevCanRedo = cr;
      for (const fn of listeners)
        fn();
    }
  }
  const unsub = store.subscribeEffect((prev, next) => {
    if (isApplying) {
      isApplying = false;
      return;
    }
    if (prev.doc !== next.doc || prev.pageAnnotations.size > 0 && next.pageAnnotations.size === 0) {
      if (undoStack.length > 0 || redoStack.length > 0) {
        undoStack.length = 0;
        redoStack.length = 0;
        notifyIfChanged();
      }
      return;
    }
    if (prev.pageAnnotations === next.pageAnnotations)
      return;
    const now = Date.now();
    for (const [pageIndex, nextList] of next.pageAnnotations) {
      const prevList = prev.pageAnnotations.get(pageIndex);
      if (prevList === nextList)
        continue;
      if (!next.annotationsDirtyPages.has(pageIndex))
        continue;
      const before = prevList ?? [];
      const after = nextList;
      const last = undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;
      if (last && last.pageIndex === pageIndex && now - last.timestamp < COALESCE_MS) {
        last.after = after;
        last.timestamp = now;
      } else {
        undoStack.push({ pageIndex, before, after, timestamp: now });
        if (undoStack.length > MAX_UNDO_DEPTH) {
          undoStack.shift();
        }
      }
      redoStack.length = 0;
    }
    notifyIfChanged();
  });
  function undo() {
    if (undoStack.length === 0)
      return;
    const entry = undoStack.pop();
    redoStack.push(entry);
    isApplying = true;
    store.dispatch({
      type: "RESTORE_PAGE_ANNOTATIONS",
      pageIndex: entry.pageIndex,
      annotations: entry.before
    });
    notifyIfChanged();
  }
  function redo() {
    if (redoStack.length === 0)
      return;
    const entry = redoStack.pop();
    undoStack.push(entry);
    isApplying = true;
    store.dispatch({
      type: "RESTORE_PAGE_ANNOTATIONS",
      pageIndex: entry.pageIndex,
      annotations: entry.after
    });
    notifyIfChanged();
  }
  function clear() {
    undoStack.length = 0;
    redoStack.length = 0;
    notifyIfChanged();
  }
  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  function destroy() {
    unsub();
    listeners.clear();
    undoStack.length = 0;
    redoStack.length = 0;
  }
  return {
    undo,
    redo,
    canUndo: () => undoStack.length > 0,
    canRedo: () => redoStack.length > 0,
    subscribe,
    clear,
    destroy
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/ui/viewer/shell.js
function mountViewerShell(root, engine, workerClient, overrides, showAttribution = true, showLoadingOverlay = true, locale, translations, customPageOverlay) {
  const i18n = createI18n(locale, translations);
  const layout = document.createElement("div");
  layout.className = "udoc-viewer-root";
  const style = document.createElement("style");
  style.textContent = inlineStyles;
  layout.appendChild(style);
  const toolbarSlot = document.createElement("div");
  toolbarSlot.className = "udoc-slot udoc-toolbar-slot";
  const subToolbarSlot = document.createElement("div");
  subToolbarSlot.className = "udoc-slot udoc-subtoolbar-slot";
  const bodySlot = document.createElement("div");
  bodySlot.className = "udoc-slot udoc-body-slot";
  const leftPanelSlot = document.createElement("div");
  leftPanelSlot.className = "udoc-slot udoc-left-panel-slot";
  const viewportSlot = document.createElement("div");
  viewportSlot.className = "udoc-slot udoc-viewport-slot";
  const rightPanelSlot = document.createElement("div");
  rightPanelSlot.className = "udoc-slot udoc-right-panel-slot";
  toolbarSlot.setAttribute("role", "region");
  toolbarSlot.setAttribute("aria-label", i18n.t("shell.regionToolbar"));
  toolbarSlot.setAttribute("tabindex", "-1");
  leftPanelSlot.setAttribute("role", "region");
  leftPanelSlot.setAttribute("aria-label", i18n.t("shell.regionSidePanel"));
  leftPanelSlot.setAttribute("tabindex", "-1");
  viewportSlot.setAttribute("role", "region");
  viewportSlot.setAttribute("aria-label", i18n.t("shell.regionDocument"));
  viewportSlot.setAttribute("tabindex", "-1");
  rightPanelSlot.setAttribute("role", "region");
  rightPanelSlot.setAttribute("aria-label", i18n.t("shell.regionSearchComments"));
  rightPanelSlot.setAttribute("tabindex", "-1");
  const skipLink = document.createElement("a");
  skipLink.href = "#";
  skipLink.className = "udoc-skip-link";
  skipLink.textContent = i18n.t("shell.skipToDocument");
  skipLink.addEventListener("click", (e) => {
    e.preventDefault();
    const focusTarget = viewportSlot.querySelector('[tabindex="0"]') ?? viewportSlot;
    focusTarget.focus();
  });
  const panelOverlay = document.createElement("div");
  panelOverlay.className = "udoc-panel-overlay";
  bodySlot.append(leftPanelSlot, viewportSlot, rightPanelSlot, panelOverlay);
  layout.append(skipLink, toolbarSlot, subToolbarSlot, bodySlot);
  root.appendChild(layout);
  const liveRegion = createLiveRegion();
  layout.appendChild(liveRegion.el);
  let pageAnnounceTimer = null;
  function announcePageDebounced(page, pageCount) {
    if (pageAnnounceTimer)
      clearTimeout(pageAnnounceTimer);
    pageAnnounceTimer = setTimeout(() => {
      liveRegion.announce(i18n.t("shell.pageOfTotal", { page, pageCount }));
      pageAnnounceTimer = null;
    }, 500);
  }
  const shortcutHelp = document.createElement("div");
  shortcutHelp.id = "udoc-shortcut-help";
  shortcutHelp.className = "udoc-sr-only";
  shortcutHelp.textContent = i18n.t("shell.shortcutHelp");
  layout.appendChild(shortcutHelp);
  layout.setAttribute("aria-describedby", "udoc-shortcut-help");
  const mergedInitialState = {
    ...initialState,
    pageAnnotations: /* @__PURE__ */ new Map(),
    annotationsLoading: /* @__PURE__ */ new Set(),
    pageText: /* @__PURE__ */ new Map(),
    textLoading: /* @__PURE__ */ new Set(),
    textFailed: /* @__PURE__ */ new Set(),
    disabledPanels: /* @__PURE__ */ new Set(),
    disabledTools: /* @__PURE__ */ new Set(["annotate", "markup"]),
    ...overrides
  };
  const store = createStore(reducer, mergedInitialState, { batched: true });
  const undoManager = createAnnotationUndoManager(store);
  const toolbar = createToolbar();
  toolbar.mount(toolbarSlot, store, i18n);
  const subToolbar = createSubToolbar();
  subToolbar.mount(subToolbarSlot, store, i18n, undoManager);
  const leftPanel = createLeftPanel();
  leftPanel.mount(leftPanelSlot, store, workerClient, i18n);
  const viewport = createViewport(showAttribution, customPageOverlay);
  viewport.mount(viewportSlot, store, workerClient, i18n, (payload) => callbacks.onViewportChange?.(payload), (payload) => callbacks.onAnnotationHover?.(payload), (payload) => callbacks.onAnnotationClick?.(payload));
  const sheetTabBar = createSheetTabBar();
  sheetTabBar.mount(viewportSlot, store);
  const rightPanel = createRightPanel();
  rightPanel.mount(rightPanelSlot, store, i18n);
  const effects = createEffects(store, engine);
  let callbacks = {};
  const loadingOverlay = showLoadingOverlay ? createLoadingOverlay(showAttribution) : null;
  loadingOverlay?.mount(layout, store, i18n);
  const passwordDialog = createPasswordDialog();
  passwordDialog.mount(viewportSlot, store, i18n, {
    onSubmit: (password) => {
      callbacks.onPasswordSubmit?.(password);
    }
  });
  const handleOverlayClick = () => {
    store.dispatch({ type: "CLOSE_PANEL" });
  };
  panelOverlay.addEventListener("click", handleOverlayClick);
  layout.setAttribute("tabindex", "-1");
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      const state = store.getState();
      if (state.activePanel !== "search") {
        store.dispatch({ type: "TOGGLE_PANEL", panel: "search" });
      }
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+") && !e.shiftKey) {
      e.preventDefault();
      store.dispatch({ type: "ZOOM_IN" });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "-" && !e.shiftKey) {
      e.preventDefault();
      store.dispatch({ type: "ZOOM_OUT" });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "0" && !e.shiftKey) {
      e.preventDefault();
      store.dispatch({ type: "SET_ZOOM", zoom: 1 });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      const state = store.getState();
      if (state.printButtonVisible && !state.showPrintDialog) {
        store.dispatch({ type: "SHOW_PRINT_DIALOG" });
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      if (undoManager.canUndo()) {
        e.preventDefault();
        undoManager.undo();
      }
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "z" && e.shiftKey || e.key === "y")) {
      if (undoManager.canRedo()) {
        e.preventDefault();
        undoManager.redo();
      }
    }
    if (e.key === "F6") {
      e.preventDefault();
      const regions = [toolbarSlot, leftPanelSlot, viewportSlot, rightPanelSlot].filter((r) => r.offsetParent !== null);
      if (regions.length === 0)
        return;
      const currentIndex = regions.findIndex((r) => r.contains(document.activeElement));
      const direction = e.shiftKey ? -1 : 1;
      const nextIndex = (currentIndex + direction + regions.length) % regions.length;
      const target = regions[nextIndex];
      const focusable = target.querySelector('button:not([disabled]), input:not([disabled]), [tabindex="0"]');
      (focusable ?? target).focus();
    }
    if (e.key === "Escape") {
      const state = store.getState();
      if (state.showPrintDialog) {
        e.preventDefault();
        store.dispatch({ type: "HIDE_PRINT_DIALOG" });
      } else if (state.activeTool.kind !== "pointer") {
        e.preventDefault();
        store.dispatch({ type: "SET_ACTIVE_TOOL", tool: { kind: "pointer" } });
      } else if (state.activePanel !== null) {
        e.preventDefault();
        store.dispatch({ type: "CLOSE_PANEL" });
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "a" && !e.shiftKey) {
      const tag = document.activeElement?.tagName;
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        const textLayers = viewportSlot.querySelectorAll(".udoc-spread__text-layer");
        const selection = document.getSelection();
        if (selection && textLayers.length > 0) {
          selection.removeAllRanges();
          const range = document.createRange();
          range.setStartBefore(textLayers[0]);
          range.setEndAfter(textLayers[textLayers.length - 1]);
          selection.addRange(range);
        }
      }
    }
    if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
      const tag = document.activeElement?.tagName;
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        liveRegion.announce(i18n.t("shell.shortcutHelpAnnounce"));
      }
    }
  };
  layout.addEventListener("keydown", handleKeyDown);
  function resolveIsDark(theme) {
    if (theme === "dark")
      return true;
    if (theme === "light")
      return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function applyThemeClass(isDark) {
    layout.classList.toggle("udoc-viewer-dark", isDark);
  }
  let systemDarkQuery = null;
  let systemDarkHandler = null;
  function setupSystemListener() {
    systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemDarkHandler = (e) => applyThemeClass(e.matches);
    systemDarkQuery.addEventListener("change", systemDarkHandler);
  }
  function cleanupSystemListener() {
    if (systemDarkQuery && systemDarkHandler) {
      systemDarkQuery.removeEventListener("change", systemDarkHandler);
      systemDarkQuery = null;
      systemDarkHandler = null;
    }
  }
  applyThemeClass(resolveIsDark(mergedInitialState.theme));
  if (mergedInitialState.theme === "system") {
    setupSystemListener();
  }
  const unsubPanelClass = store.subscribeRender((prev, next) => {
    if (prev.activePanel === null !== (next.activePanel === null)) {
      layout.classList.toggle("udoc-panel-open", next.activePanel !== null);
    }
    if (prev.toolbarVisible !== next.toolbarVisible) {
      toolbarSlot.style.display = next.toolbarVisible ? "" : "none";
    }
    if (prev.theme !== next.theme) {
      if (prev.theme === "system")
        cleanupSystemListener();
      if (next.theme === "system")
        setupSystemListener();
      applyThemeClass(resolveIsDark(next.theme));
    }
    if (prev.textSelectionDisabled !== next.textSelectionDisabled) {
      layout.classList.toggle("udoc-viewer--no-text-select", next.textSelectionDisabled);
    }
    if (next.panelTransitionsDisabled && !prev.panelTransitionsDisabled) {
      requestAnimationFrame(() => {
        store.dispatch({ type: "ENABLE_PANEL_TRANSITIONS" });
      });
    }
    if (prev.page !== next.page && next.pageCount > 0) {
      announcePageDebounced(next.page, next.pageCount);
    } else if (prev.zoom !== next.zoom) {
      liveRegion.announce(i18n.t("shell.zoomPercent", { percent: Math.round(next.zoom * 100) }));
    } else if (prev.activePanel !== next.activePanel) {
      if (next.activePanel !== null) {
        liveRegion.announce(i18n.t("shell.panelOpened", { panel: next.activePanel }));
      } else {
        liveRegion.announce(i18n.t("shell.panelClosed"));
      }
    }
  });
  if (!mergedInitialState.toolbarVisible) {
    toolbarSlot.style.display = "none";
  }
  if (mergedInitialState.textSelectionDisabled) {
    layout.classList.add("udoc-viewer--no-text-select");
  }
  store.dispatch({ type: "__INIT__" });
  const printDialog = createPrintDialog();
  printDialog.mount(layout, store, i18n, {
    onPrint: (result) => {
      store.dispatch({ type: "HIDE_PRINT_DIALOG" });
      callbacks.onPrint?.(result);
    },
    onCancel: () => {
      store.dispatch({ type: "HIDE_PRINT_DIALOG" });
    }
  });
  function setCallbacks(newCallbacks) {
    callbacks = { ...callbacks, ...newCallbacks };
    toolbar.setOnDownload(callbacks.onDownload ?? null);
    toolbar.setOnPrint(() => {
      store.dispatch({ type: "SHOW_PRINT_DIALOG" });
    });
  }
  function destroy() {
    cleanupSystemListener();
    if (pageAnnounceTimer)
      clearTimeout(pageAnnounceTimer);
    liveRegion.destroy();
    layout.removeEventListener("keydown", handleKeyDown);
    panelOverlay.removeEventListener("click", handleOverlayClick);
    unsubPanelClass();
    undoManager.destroy();
    effects.destroy();
    toolbar.destroy();
    subToolbar.destroy();
    leftPanel.destroy();
    viewport.destroy();
    sheetTabBar.destroy();
    rightPanel.destroy();
    loadingOverlay?.destroy();
    passwordDialog.destroy();
    printDialog.destroy();
    layout.remove();
  }
  return {
    store,
    dispatch: store.dispatch,
    getState: store.getState,
    setCallbacks,
    destroy
  };
}

// node_modules/@docmentis/udoc-viewer/dist/src/performance/PerformanceCounter.js
var PerformanceCounter = class {
  enabled = true;
  _entries = [];
  _pendingEvents = /* @__PURE__ */ new Map();
  _listeners = /* @__PURE__ */ new Set();
  _eventIdCounter = 0;
  _loadStartTime = null;
  get entries() {
    return this._entries;
  }
  /**
   * Set the load start time. Called at the beginning of load().
   */
  setLoadStartTime() {
    this._loadStartTime = performance.now();
  }
  markStart(type, context) {
    const eventId = `${type}_${++this._eventIdCounter}`;
    const now = performance.now();
    this._pendingEvents.set(eventId, {
      type,
      context,
      startTime: now
    });
    const entry = {
      phase: "start",
      type,
      timestamp: this._loadStartTime !== null ? now - this._loadStartTime : 0,
      context
    };
    this._entries.push(entry);
    this._notifyListeners(entry);
    return eventId;
  }
  markEnd(eventId, success = true, error) {
    const pending = this._pendingEvents.get(eventId);
    if (!pending)
      return;
    this._pendingEvents.delete(eventId);
    const now = performance.now();
    const duration = now - pending.startTime;
    const entry = {
      phase: "end",
      type: pending.type,
      timestamp: this._loadStartTime !== null ? now - this._loadStartTime : 0,
      context: pending.context,
      duration,
      success,
      error
    };
    this._entries.push(entry);
    this._notifyListeners(entry);
  }
  onLog(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }
  getSummary() {
    const breakdown = {};
    const durationsByType = /* @__PURE__ */ new Map();
    for (const entry of this._entries) {
      if (entry.phase === "end" && entry.duration !== void 0) {
        const durations = durationsByType.get(entry.type) ?? [];
        durations.push(entry.duration);
        durationsByType.set(entry.type, durations);
      }
    }
    for (const [type, durations] of durationsByType) {
      if (durations.length > 0) {
        const total = durations.reduce((a, b) => a + b, 0);
        breakdown[type] = {
          count: durations.length,
          totalDuration: total,
          avgDuration: total / durations.length,
          minDuration: Math.min(...durations),
          maxDuration: Math.max(...durations)
        };
      }
    }
    return { breakdown };
  }
  reset() {
    this._entries = [];
    this._pendingEvents.clear();
    this._eventIdCounter = 0;
    this._loadStartTime = null;
  }
  _notifyListeners(entry) {
    for (const listener of this._listeners) {
      try {
        listener(entry);
      } catch {
      }
    }
  }
};
var NoOpPerformanceCounter = class {
  enabled = false;
  entries = [];
  setLoadStartTime() {
  }
  markStart() {
    return "";
  }
  markEnd() {
  }
  onLog() {
    return () => {
    };
  }
  getSummary() {
    return { breakdown: {} };
  }
  reset() {
  }
};

// node_modules/@docmentis/udoc-viewer/dist/src/UDocViewer.js
function generateAnnotationId() {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID)
    return cryptoObj.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
var UDocViewer = class _UDocViewer {
  workerClient;
  container = null;
  uiShell = null;
  documentId = null;
  _pageCount = 0;
  _pageInfo = [];
  destroyed = false;
  eventHandlers = /* @__PURE__ */ new Map();
  _performanceCounter;
  viewOverrides;
  currentFormat = null;
  sourceFilename = null;
  storeUnsub = null;
  actionUnsub = null;
  fontUsageUnsub = null;
  sdkVersion;
  /**
   * @internal
   * Use `client.createViewer()` instead.
   */
  constructor(workerClient, options = {}, showAttribution = true, showLoadingOverlay = true, sdkVersion = "0.6.42") {
    this.workerClient = workerClient;
    this.sdkVersion = sdkVersion;
    this.viewOverrides = this.buildViewModeOverrides(options);
    if (options.enablePerformanceCounter) {
      const counter = new PerformanceCounter();
      this._performanceCounter = counter;
      if (options.onPerformanceLog) {
        counter.onLog(options.onPerformanceLog);
      }
    } else {
      this._performanceCounter = new NoOpPerformanceCounter();
    }
    this.fontUsageUnsub = this.workerClient.onFontUsageChanged(async (docId) => {
      if (this.documentId !== docId)
        return;
      try {
        const entries = await this.workerClient.getFontUsage(docId);
        if (this.destroyed || this.documentId !== docId)
          return;
        this.emit("font:usageChange", { entries });
      } catch {
      }
    });
    if (options.container) {
      this.container = this.resolveContainer(options.container);
      const overrides = this.buildStateOverrides(options);
      this.uiShell = mountViewerShell(this.container, this.createEngineAdapter(), this.workerClient, overrides, showAttribution, showLoadingOverlay, options.locale, options.translations, options.customPageOverlay);
      this.uiShell.setCallbacks({
        onPasswordSubmit: (password) => this.handlePasswordSubmit(password),
        onDownload: () => this.download(),
        onPrint: (options2) => this.print(options2),
        onViewportChange: (payload) => this.emit("viewport:change", payload),
        onAnnotationHover: (payload) => this.emit("annotation:hover", payload),
        onAnnotationClick: (payload) => this.emit("annotation:click", payload)
      });
      this.storeUnsub = this.uiShell.store.subscribeEffect((prev, next) => {
        if (prev.page !== next.page) {
          this.emit("page:change", { page: next.page, previousPage: prev.page });
        }
        if (prev.activePanel !== next.activePanel) {
          this.emit("panel:change", { panel: next.activePanel, previousPanel: prev.activePanel });
        }
        if (prev.toolbarVisible !== next.toolbarVisible) {
          this.emit("ui:visibilityChange", { component: "toolbar", visible: next.toolbarVisible });
        }
        if (prev.floatingToolbarVisible !== next.floatingToolbarVisible) {
          this.emit("ui:visibilityChange", {
            component: "floatingToolbar",
            visible: next.floatingToolbarVisible
          });
        }
        if (prev.leftPanelVisible !== next.leftPanelVisible) {
          this.emit("ui:visibilityChange", {
            component: "leftPanel",
            visible: next.leftPanelVisible
          });
        }
        if (prev.rightPanelVisible !== next.rightPanelVisible) {
          this.emit("ui:visibilityChange", {
            component: "rightPanel",
            visible: next.rightPanelVisible
          });
        }
        if (prev.fullscreenButtonVisible !== next.fullscreenButtonVisible) {
          this.emit("ui:visibilityChange", {
            component: "fullscreen",
            visible: next.fullscreenButtonVisible
          });
        }
        if (prev.downloadButtonVisible !== next.downloadButtonVisible) {
          this.emit("ui:visibilityChange", {
            component: "download",
            visible: next.downloadButtonVisible
          });
        }
        if (prev.printButtonVisible !== next.printButtonVisible) {
          this.emit("ui:visibilityChange", {
            component: "print",
            visible: next.printButtonVisible
          });
        }
        if (prev.searchMatches !== next.searchMatches || prev.searchActiveIndex !== next.searchActiveIndex) {
          this.emit("search:change", {
            matches: next.searchMatches,
            activeIndex: next.searchActiveIndex
          });
        }
        if (prev.disabledPanels !== next.disabledPanels) {
          const allPanels = [
            "thumbnail",
            "outline",
            "bookmarks",
            "layers",
            "attachments",
            "fonts",
            "search",
            "comments"
          ];
          for (const panel of allPanels) {
            const wasDisabled = prev.disabledPanels.has(panel);
            const isDisabled = next.disabledPanels.has(panel);
            if (wasDisabled !== isDisabled) {
              this.emit("ui:visibilityChange", { component: panel, visible: !isDisabled });
            }
          }
        }
      });
      this.actionUnsub = this.uiShell.store.subscribeAction((action, prev, next) => {
        switch (action.type) {
          case "ADD_ANNOTATION":
            this.emit("annotation:add", {
              pageIndex: action.pageIndex,
              annotation: action.annotation
            });
            break;
          case "ADD_ANNOTATIONS":
            for (const annotation of action.annotations) {
              this.emit("annotation:add", {
                pageIndex: action.pageIndex,
                annotation
              });
            }
            break;
          case "UPDATE_ANNOTATION":
            this.emit("annotation:update", {
              pageIndex: action.pageIndex,
              annotation: action.annotation
            });
            break;
          case "UPDATE_ANNOTATIONS":
            for (const { annotation } of action.updates) {
              this.emit("annotation:update", {
                pageIndex: action.pageIndex,
                annotation
              });
            }
            break;
          case "REMOVE_ANNOTATION": {
            const removed = prev.pageAnnotations.get(action.pageIndex)?.[action.annotationIndex];
            if (removed) {
              this.emit("annotation:remove", {
                pageIndex: action.pageIndex,
                annotation: removed
              });
            }
            break;
          }
          case "SELECT_ANNOTATION": {
            const ann = next.pageAnnotations.get(action.pageIndex)?.[action.annotationIndex];
            if (ann) {
              this.emit("annotation:select", {
                pageIndex: action.pageIndex,
                annotation: ann
              });
            }
            break;
          }
          case "DESELECT_ANNOTATION":
            this.emit("annotation:select", null);
            break;
        }
      });
    }
  }
  /**
   * Performance counter for tracking operation timings.
   * Only records data when `enablePerformanceCounter` is true.
   */
  get performanceCounter() {
    return this._performanceCounter;
  }
  buildStateOverrides(options) {
    const overrides = {};
    if (options.scrollMode !== void 0)
      overrides.scrollMode = options.scrollMode;
    if (options.layoutMode !== void 0)
      overrides.layoutMode = options.layoutMode;
    if (options.zoomMode !== void 0)
      overrides.zoomMode = options.zoomMode;
    if (options.zoom !== void 0)
      overrides.zoom = options.zoom;
    if (options.zoomSteps !== void 0)
      overrides.zoomSteps = options.zoomSteps;
    if (options.dpi !== void 0)
      overrides.dpi = options.dpi;
    if (options.pageSpacing !== void 0)
      overrides.pageSpacing = options.pageSpacing;
    if (options.spreadSpacing !== void 0)
      overrides.spreadSpacing = options.spreadSpacing;
    if (options.thumbnailWidth !== void 0)
      overrides.thumbnailWidth = options.thumbnailWidth;
    if (options.navigationScrollAlignment !== void 0)
      overrides.navigationScrollAlignment = options.navigationScrollAlignment;
    if (options.searchScrollAlignment !== void 0)
      overrides.searchScrollAlignment = options.searchScrollAlignment;
    if (options.activePanel !== void 0)
      overrides.activePanel = options.activePanel;
    if (options.hideToolbar)
      overrides.toolbarVisible = false;
    if (options.hideFloatingToolbar)
      overrides.floatingToolbarVisible = false;
    if (options.disableFullscreen)
      overrides.fullscreenButtonVisible = false;
    if (options.disableDownload)
      overrides.downloadButtonVisible = false;
    if (options.disablePrint)
      overrides.printButtonVisible = false;
    if (options.disableLeftPanel)
      overrides.leftPanelVisible = false;
    if (options.disableRightPanel)
      overrides.rightPanelVisible = false;
    if (options.theme !== void 0)
      overrides.theme = options.theme;
    if (options.disableThemeSwitching)
      overrides.themeSwitchingDisabled = true;
    if (options.disableTextSelection)
      overrides.textSelectionDisabled = true;
    if (options.pageRotation !== void 0)
      overrides.pageRotation = options.pageRotation;
    if (options.spacingMode !== void 0)
      overrides.spacingMode = options.spacingMode;
    if (options.minZoom !== void 0)
      overrides.minZoom = options.minZoom;
    if (options.maxZoom !== void 0)
      overrides.maxZoom = options.maxZoom;
    if (options.enableTransitions)
      overrides.transitionsEnabled = true;
    const disabled = [];
    if (options.disableThumbnails)
      disabled.push("thumbnail");
    if (options.disableOutline)
      disabled.push("outline");
    if (options.disableBookmarks)
      disabled.push("bookmarks");
    if (options.disableLayers)
      disabled.push("layers");
    if (options.disableAttachments)
      disabled.push("attachments");
    if (options.disableFonts)
      disabled.push("fonts");
    if (options.disableSearch)
      disabled.push("search");
    if (options.disableComments)
      disabled.push("comments");
    if (disabled.length > 0) {
      overrides.disabledPanels = new Set(disabled);
    }
    const disabledTools = [];
    if (options.disableViewTools) {
      disabledTools.push("pointer", "hand", "zoom");
    }
    if (options.disableAnnotateTools) {
      disabledTools.push("annotate");
    }
    if (options.__experimentalDisableMarkupTools !== false) {
      disabledTools.push("markup");
    }
    overrides.disabledTools = new Set(disabledTools);
    return overrides;
  }
  buildViewModeOverrides(options) {
    const overrides = {};
    if (options.scrollMode !== void 0)
      overrides.scrollMode = options.scrollMode;
    if (options.layoutMode !== void 0)
      overrides.layoutMode = options.layoutMode;
    if (options.zoomMode !== void 0)
      overrides.zoomMode = options.zoomMode;
    if (options.zoom !== void 0)
      overrides.zoom = options.zoom;
    if (options.pageSpacing !== void 0)
      overrides.pageSpacing = options.pageSpacing;
    if (options.spreadSpacing !== void 0)
      overrides.spreadSpacing = options.spreadSpacing;
    if (options.pageRotation !== void 0)
      overrides.pageRotation = options.pageRotation;
    if (options.spacingMode !== void 0)
      overrides.spacingMode = options.spacingMode;
    return overrides;
  }
  computeViewDefaults(format) {
    return { ...getFormatDefaults(format), ...this.viewOverrides };
  }
  // ===========================================================================
  // Document Loading
  // ===========================================================================
  /**
   * Load a document.
   *
   * @param source - URL string, File object, or raw bytes
   */
  async load(source) {
    this.ensureNotDestroyed();
    this._performanceCounter.reset();
    this._performanceCounter.setLoadStartTime();
    if (this.documentId) {
      this.close();
    }
    try {
      const downloadId = this._performanceCounter.markStart("download");
      const { bytes, filename } = await this.resolveSourceWithFilename(source);
      this.sourceFilename = filename ?? null;
      this._performanceCounter.markEnd(downloadId);
      this.uiShell?.dispatch({ type: "SET_PROCESSING", processing: true });
      const loadId = this._performanceCounter.markStart("load");
      this.documentId = await this.workerClient.loadDocument(bytes);
      this._performanceCounter.markEnd(loadId);
      const format = await this.workerClient.getDocumentFormat(this.documentId);
      this.currentFormat = format;
      if (this._performanceCounter.enabled) {
        this.workerClient.setPerformanceCounter(this.documentId, this._performanceCounter);
      }
      const passwordRequired = await this.workerClient.needsPassword(this.documentId);
      if (passwordRequired) {
        if (this.uiShell) {
          this.uiShell.dispatch({
            type: "SET_DOC",
            doc: { id: this.documentId },
            documentFormat: format,
            pageCount: 0,
            pageInfos: [],
            pageGroups: [],
            viewDefaults: this.computeViewDefaults(format)
          });
          this.uiShell.dispatch({ type: "SET_PROCESSING", processing: false });
          this.uiShell.dispatch({ type: "SET_NEEDS_PASSWORD", needsPassword: true });
        }
        return;
      }
      this._pageInfo = await this.workerClient.getAllPageInfo(this.documentId);
      this._pageCount = this._pageInfo.length;
      const pageGroups = await this.workerClient.getPageGroups(this.documentId);
      if (this.uiShell) {
        const initUiId = this._performanceCounter.markStart("initUiShell");
        this.uiShell.dispatch({
          type: "SET_DOC",
          doc: { id: this.documentId },
          documentFormat: format,
          pageCount: this._pageCount,
          pageInfos: this._pageInfo,
          pageGroups,
          viewDefaults: this.computeViewDefaults(format)
        });
        this._performanceCounter.markEnd(initUiId);
        this.uiShell.dispatch({ type: "SET_PROCESSING", processing: false });
      }
      this.emit("document:load", { pageCount: this._pageCount });
    } catch (error) {
      this.uiShell?.dispatch({ type: "SET_PROCESSING", processing: false });
      const phase = error instanceof TypeError ? "fetch" : "parse";
      this.emit("error", { error, phase });
      throw error;
    }
  }
  /**
   * Close the current document.
   * Viewer returns to empty state.
   */
  close() {
    if (this.documentId) {
      const docId = this.documentId;
      this.documentId = null;
      this._pageCount = 0;
      this._pageInfo = [];
      this.sourceFilename = null;
      this.workerClient.removePerformanceCounter(docId);
      this.workerClient.cancelRenders(docId);
      this.workerClient.clearRenderCache(docId);
      this.workerClient.unloadPdf(docId).catch(() => {
      });
      if (this.uiShell) {
        this.uiShell.dispatch({ type: "CLEAR_DOC" });
      }
      this.emit("document:close", {});
    }
  }
  /**
   * Whether a document is currently loaded.
   */
  get isLoaded() {
    return this.documentId !== null;
  }
  /**
   * Check if the loaded document requires a password to open.
   * @returns True if the document needs authentication before pages can be accessed.
   */
  async needsPassword() {
    this.ensureLoaded();
    return this.workerClient.needsPassword(this.documentId);
  }
  /**
   * Authenticate with a password to unlock an encrypted document.
   *
   * After successful authentication, page info is reloaded and the document
   * becomes fully accessible.
   *
   * @param password - The password to try
   * @returns True if authentication succeeded, false if the password was incorrect.
   */
  async authenticate(password) {
    this.ensureLoaded();
    if (this.uiShell) {
      this.uiShell.dispatch({ type: "AUTHENTICATE_START" });
    }
    try {
      const success = await this.workerClient.authenticate(this.documentId, password);
      if (success) {
        this.workerClient.cancelRenders(this.documentId);
        this.workerClient.invalidateRenderCache(this.documentId);
        this._pageInfo = await this.workerClient.getAllPageInfo(this.documentId);
        this._pageCount = this._pageInfo.length;
        const pageGroups = await this.workerClient.getPageGroups(this.documentId);
        if (this.uiShell) {
          this.uiShell.dispatch({ type: "AUTHENTICATE_SUCCESS" });
          this.uiShell.dispatch({
            type: "SET_DOC",
            doc: { id: this.documentId },
            documentFormat: this.currentFormat ?? "pdf",
            pageCount: this._pageCount,
            pageInfos: this._pageInfo,
            pageGroups,
            viewDefaults: this.currentFormat ? this.computeViewDefaults(this.currentFormat) : void 0
          });
        }
        this.emit("document:load", { pageCount: this._pageCount });
      } else {
        if (this.uiShell) {
          this.uiShell.dispatch({ type: "AUTHENTICATE_FAILURE", error: "Incorrect password" });
        }
      }
      return success;
    } catch (error) {
      if (this.uiShell) {
        this.uiShell.dispatch({
          type: "AUTHENTICATE_FAILURE",
          error: error instanceof Error ? error.message : "Authentication failed"
        });
      }
      throw error;
    }
  }
  /**
   * Handle password submission from the UI dialog.
   * @internal
   */
  async handlePasswordSubmit(password) {
    try {
      await this.authenticate(password);
    } catch {
    }
  }
  // ===========================================================================
  // Document Information
  // ===========================================================================
  /**
   * Total number of pages.
   * Returns 0 if no document is loaded.
   */
  get pageCount() {
    return this._pageCount;
  }
  /**
   * Document metadata (title, author, etc.).
   * Returns null if no document is loaded.
   */
  get metadata() {
    if (!this.documentId)
      return null;
    return {};
  }
  /**
   * Get document outline (table of contents / bookmarks).
   */
  async getOutline() {
    this.ensureLoaded();
    const raw = await this.workerClient.getOutline(this.documentId);
    return raw;
  }
  /**
   * Get font usage information for the loaded document.
   *
   * Returns how each font spec in the document was resolved,
   * including primary resolution and any glyph-fallback fonts.
   * This information is populated during rendering — call after
   * at least one page has been rendered for results.
   */
  async getFontUsage() {
    this.ensureLoaded();
    const raw = await this.workerClient.getFontUsage(this.documentId);
    return raw;
  }
  /**
   * Get page dimensions in points (1 point = 1/72 inch).
   * @param page - Page index (0-based)
   */
  async getPageInfo(page) {
    this.ensureLoaded();
    if (page < 0 || page >= this._pageCount) {
      throw new Error(`Page index ${page} out of bounds (0-${this._pageCount - 1})`);
    }
    if (this._pageInfo[page]) {
      return this._pageInfo[page];
    }
    const info = await this.workerClient.getPageInfo(this.documentId, page);
    this._pageInfo[page] = info;
    return info;
  }
  /**
   * Get annotations on a specific page.
   *
   * Returns the in-memory state if the page has been edited in this
   * session; otherwise reads from the worker.
   *
   * Returned `bounds` (and every other geometry field) are in the page's
   * unrotated MediaBox coordinate space — origin top-left, units in PDF
   * points, +y downward — regardless of the page's `/Rotate` value.
   * See {@link Rect} for the full coordinate convention.
   *
   * @param page - Page index (0-based)
   */
  async getPageAnnotations(page) {
    this.ensureLoaded();
    const fromState = this.uiShell?.store.getState().pageAnnotations.get(page);
    if (fromState)
      return fromState;
    const raw = await this.workerClient.getPageAnnotations(this.documentId, page);
    return raw;
  }
  /**
   * Add a new annotation to a page.
   *
   * If `annotation.name` is omitted, a UUID is generated and assigned. The
   * returned value is the annotation as inserted (with `name` populated),
   * which is the same identifier the engine will write to the PDF's NM
   * entry on save.
   *
   * Pass `ephemeral: true` to create a viewer-only annotation that renders
   * but is excluded from saved PDF bytes and from print output. The same
   * `updatePageAnnotation` / `removePageAnnotation` calls work for both kinds, and
   * `updatePageAnnotation` can flip the `ephemeral` flag to promote a preview
   * into a saved annotation (or demote a saved one to viewer-only).
   *
   * **Coordinate space:** `annotation.bounds` and all per-type geometry
   * (line endpoints, polygon vertices, ink strokes, quads, callout lines,
   * …) must be in the page's **unrotated MediaBox** coordinate space —
   * origin top-left, PDF points, +y downward — *not* the displayed/rotated
   * orientation. The viewer applies `/Rotate` (and the user's rotation
   * toggle) as a display transform on top of MediaBox-space bounds. See
   * {@link Rect} for the full convention. The {@link getPageAnnotations}
   * round-trip uses the same space, so a value read out and added back is
   * always in the right frame.
   *
   * Annotation editing currently requires UI mode (a `container` was passed
   * to `client.createViewer`) and is supported on PDF documents only.
   *
   * @param page - Page index (0-based)
   * @returns The inserted annotation (with `name` populated).
   */
  async addPageAnnotation(page, annotation) {
    this.ensureLoaded();
    this.ensureUiMode();
    await this.ensurePageAnnotationsLoaded(page);
    const withId = annotation.name ? annotation : { ...annotation, name: generateAnnotationId() };
    this.uiShell.dispatch({ type: "ADD_ANNOTATION", pageIndex: page, annotation: withId });
    return withId;
  }
  /**
   * Add multiple annotations to a page in a single batch.
   *
   * Equivalent to calling {@link addPageAnnotation} once per item, but
   * applied as a single store update — one render and one dirty-flag flip
   * per page instead of N. Use this when importing or restoring many
   * annotations on the same page.
   *
   * Each annotation gets a generated `name` (UUID) if one is not provided.
   * The returned array preserves input order with `name` populated.
   *
   * `annotation:add` still fires once per annotation, in input order, so
   * existing single-event listeners just work.
   *
   * Geometry coordinate space matches {@link addPageAnnotation} — unrotated
   * MediaBox, origin top-left, PDF points, +y downward. See {@link Rect}.
   *
   * @param page - Page index (0-based)
   * @param annotations - Annotations to insert (may mix ephemeral and saved)
   * @returns The inserted annotations (each with `name` populated).
   */
  async addPageAnnotations(page, annotations) {
    this.ensureLoaded();
    this.ensureUiMode();
    if (annotations.length === 0)
      return [];
    await this.ensurePageAnnotationsLoaded(page);
    const withIds = annotations.map((a) => a.name ? a : { ...a, name: generateAnnotationId() });
    this.uiShell.dispatch({ type: "ADD_ANNOTATIONS", pageIndex: page, annotations: withIds });
    return withIds;
  }
  /**
   * Update an existing annotation, identified by its `name` (NM).
   *
   * Looks up the annotation on the given page by `name` and replaces it
   * with the supplied value. The replacement keeps the same `name` even
   * if a different one is passed in `annotation.name`.
   *
   * Geometry on the replacement must be in unrotated MediaBox coordinates
   * — see {@link Rect}.
   *
   * @param page - Page index (0-based)
   * @param name - The annotation's `name` (NM).
   * @param annotation - The replacement annotation.
   * @returns The updated annotation.
   * @throws If no annotation with the given `name` is found on the page.
   */
  async updatePageAnnotation(page, name, annotation) {
    this.ensureLoaded();
    this.ensureUiMode();
    const index = await this.findAnnotationIndex(page, name);
    const updated = { ...annotation, name };
    this.uiShell.dispatch({
      type: "UPDATE_ANNOTATION",
      pageIndex: page,
      annotationIndex: index,
      annotation: updated
    });
    return updated;
  }
  /**
   * Update multiple annotations on a page in a single batch.
   *
   * Equivalent to calling {@link updatePageAnnotation} once per item, but
   * applied as a single store update — one render and one dirty-flag flip
   * per page instead of N. Each entry's existing `name` is preserved even
   * if a different one is set on its `annotation`.
   *
   * `annotation:update` still fires once per entry, in input order.
   *
   * Validation is atomic: if any `name` cannot be found on the page, the
   * call throws *before* any annotation is updated.
   *
   * @param page - Page index (0-based)
   * @param updates - Pairs of `{ name, annotation }` to replace.
   * @returns The updated annotations, in input order.
   * @throws If any `name` is not found on the page.
   */
  async updatePageAnnotations(page, updates) {
    this.ensureLoaded();
    this.ensureUiMode();
    if (updates.length === 0)
      return [];
    await this.ensurePageAnnotationsLoaded(page);
    const resolved = updates.map(({ name, annotation }) => ({
      annotationIndex: this.requireAnnotationIndex(page, name),
      annotation: { ...annotation, name }
    }));
    this.uiShell.dispatch({ type: "UPDATE_ANNOTATIONS", pageIndex: page, updates: resolved });
    return resolved.map((r) => r.annotation);
  }
  /**
   * Patch an existing annotation, identified by its `name` (NM).
   *
   * Unlike {@link updatePageAnnotation}, which replaces the entire
   * annotation, this only overwrites the fields present in `patch`.
   * Everything else (geometry, other style fields, contents, etc.) is
   * preserved. Use this when you want to tweak one or two properties —
   * for example, change a highlight's color — without round-tripping the
   * full annotation.
   *
   * Semantics:
   * - `type` and `name` in the patch are silently ignored.
   * - `metadata` is shallow-merged one level deep, so patching
   *   `{ metadata: { contents } }` keeps the existing `author`/`subject`.
   * - `undefined` values are skipped, not treated as "clear this field".
   *   Use `updatePageAnnotation` for full replacement when you need to
   *   clear fields by omission.
   *
   * @param page - Page index (0-based)
   * @param name - The annotation's `name` (NM).
   * @param patch - Fields to merge into the existing annotation.
   * @returns The patched annotation.
   * @throws If no annotation with the given `name` is found on the page.
   */
  async patchPageAnnotation(page, name, patch) {
    this.ensureLoaded();
    this.ensureUiMode();
    const index = await this.findAnnotationIndex(page, name);
    const existing = this.uiShell.store.getState().pageAnnotations.get(page)[index];
    const updated = applyAnnotationPatch(existing, patch);
    this.uiShell.dispatch({
      type: "UPDATE_ANNOTATION",
      pageIndex: page,
      annotationIndex: index,
      annotation: updated
    });
    return updated;
  }
  /**
   * Patch multiple annotations on a page in a single batch.
   *
   * Equivalent to calling {@link patchPageAnnotation} once per item, but
   * applied as a single store update — one render and one dirty-flag flip
   * per page instead of N. Patches are resolved against the *current*
   * annotation state (not against each other in sequence); patching the
   * same `name` twice in one call applies both, with the second winning.
   *
   * `annotation:update` still fires once per entry, in input order.
   *
   * Validation is atomic: if any `name` cannot be found on the page, the
   * call throws *before* any annotation is patched.
   *
   * @param page - Page index (0-based)
   * @param patches - Pairs of `{ name, patch }` to apply.
   * @returns The patched annotations, in input order.
   * @throws If any `name` is not found on the page.
   */
  async patchPageAnnotations(page, patches) {
    this.ensureLoaded();
    this.ensureUiMode();
    if (patches.length === 0)
      return [];
    await this.ensurePageAnnotationsLoaded(page);
    const list = this.uiShell.store.getState().pageAnnotations.get(page);
    const resolved = patches.map(({ name, patch }) => {
      const annotationIndex = this.requireAnnotationIndex(page, name);
      const merged = applyAnnotationPatch(list[annotationIndex], patch);
      const annotation = { ...merged, name };
      return { annotationIndex, annotation };
    });
    this.uiShell.dispatch({ type: "UPDATE_ANNOTATIONS", pageIndex: page, updates: resolved });
    return resolved.map((r) => r.annotation);
  }
  /**
   * Remove an annotation, identified by its `name` (NM).
   *
   * @param page - Page index (0-based)
   * @param name - The annotation's `name` (NM).
   * @throws If no annotation with the given `name` is found on the page.
   */
  async removePageAnnotation(page, name) {
    this.ensureLoaded();
    this.ensureUiMode();
    const index = await this.findAnnotationIndex(page, name);
    this.uiShell.dispatch({ type: "REMOVE_ANNOTATION", pageIndex: page, annotationIndex: index });
  }
  /**
   * Ensure pageAnnotations is populated for a page so that mutator actions
   * have a baseline list to operate on. The reducer's ADD path tolerates a
   * missing page, but UPDATE/REMOVE need the existing annotations loaded
   * so we don't silently lose what the worker has.
   */
  async ensurePageAnnotationsLoaded(page) {
    const state = this.uiShell.store.getState();
    if (state.pageAnnotations.has(page))
      return;
    const raw = await this.workerClient.getPageAnnotations(this.documentId, page);
    this.uiShell.dispatch({ type: "SET_PAGE_ANNOTATIONS", pageIndex: page, annotations: raw });
  }
  async findAnnotationIndex(page, name) {
    await this.ensurePageAnnotationsLoaded(page);
    return this.requireAnnotationIndex(page, name);
  }
  /**
   * Synchronous variant of `findAnnotationIndex` for callers that have
   * already awaited `ensurePageAnnotationsLoaded` — used by the batch
   * mutators so all per-item lookups happen against a stable, loaded list.
   */
  requireAnnotationIndex(page, name) {
    const list = this.uiShell.store.getState().pageAnnotations.get(page) ?? [];
    const index = list.findIndex((a) => a.name === name);
    if (index < 0) {
      throw new Error(`No annotation with name "${name}" on page ${page}`);
    }
    return index;
  }
  /**
   * Get the layout structure for a specific page.
   * Returns frames, parcels, lines, runs, glyphs, tables, and grids
   * without building the full display list.
   * All coordinates are in points (1/72 inch).
   * @param page - Page index (0-based)
   */
  async getLayoutPage(page) {
    this.ensureLoaded();
    if (page < 0 || page >= this._pageCount) {
      throw new Error(`Page index ${page} out of bounds (0-${this._pageCount - 1})`);
    }
    return await this.workerClient.getLayoutPage(this.documentId, page);
  }
  /**
   * Get the plain text of a page, matching exactly what the search engine sees.
   *
   * Text is extracted from the layout model: glyph runs are concatenated in
   * visual order, with spaces/tabs rendered as " ", paragraph ends and line
   * breaks as "\n", and inline drawings as U+FFFC (object replacement char).
   *
   * @param page - Page index (0-based)
   */
  async getPageText(page) {
    const layout = await this.getLayoutPage(page);
    return extractPageText(layout);
  }
  // ===========================================================================
  // Navigation
  // ===========================================================================
  /**
   * Get the current page number (1-based).
   */
  get currentPage() {
    if (this.uiShell) {
      return this.uiShell.getState().page;
    }
    return 1;
  }
  /**
   * Navigate to a specific page.
   * @param page - Page number (1-based)
   */
  goToPage(page) {
    this.ensureNotDestroyed();
    if (!this.uiShell) {
      throw new Error("Navigation requires UI mode (container must be provided)");
    }
    this.uiShell.dispatch({ type: "NAVIGATE_TO_PAGE", page });
  }
  /**
   * Navigate to a destination (page + position + zoom).
   * @param destination - Full destination object with page index and display mode
   * @param options - Optional navigation options
   * @param options.scrollAlignment - How to align the target in the viewport:
   *   "top" (default), "center", "bottom", or "nearest" (minimal scroll to fit in view)
   */
  goToDestination(destination, options) {
    this.ensureNotDestroyed();
    if (!this.uiShell) {
      throw new Error("Navigation requires UI mode (container must be provided)");
    }
    this.uiShell.dispatch({
      type: "NAVIGATE_TO_DESTINATION",
      destination,
      scrollAlignment: options?.scrollAlignment
    });
  }
  /**
   * Navigate to the next page.
   */
  nextPage() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    const state = this.uiShell.getState();
    if (state.page < state.pageCount) {
      this.uiShell.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page + 1 });
    }
  }
  /**
   * Navigate to the previous page.
   */
  previousPage() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    const state = this.uiShell.getState();
    if (state.page > 1) {
      this.uiShell.dispatch({ type: "NAVIGATE_TO_PAGE", page: state.page - 1 });
    }
  }
  // ===========================================================================
  // Zoom
  // ===========================================================================
  /**
   * Current zoom level (1 = 100%).
   */
  get zoom() {
    if (this.uiShell) {
      const state = this.uiShell.getState();
      return state.zoomMode === "custom" ? state.zoom : state.effectiveZoom ?? state.zoom;
    }
    return 1;
  }
  /**
   * Current zoom mode.
   */
  get zoomMode() {
    if (this.uiShell) {
      return this.uiShell.getState().zoomMode;
    }
    return "fit-spread-width";
  }
  /**
   * Zoom in to the next zoom step.
   */
  zoomIn() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "ZOOM_IN" });
  }
  /**
   * Zoom out to the previous zoom step.
   */
  zoomOut() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "ZOOM_OUT" });
  }
  /**
   * Set zoom to a specific level (1 = 100%). Switches to custom zoom mode.
   */
  setZoom(zoom) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_ZOOM", zoom });
  }
  /**
   * Set zoom mode.
   */
  setZoomMode(mode) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_ZOOM_MODE", mode });
  }
  // ===========================================================================
  // View Modes
  // ===========================================================================
  /** Current scroll mode. */
  get scrollMode() {
    return this.uiShell?.getState().scrollMode ?? "continuous";
  }
  /** Current layout mode. */
  get layoutMode() {
    return this.uiShell?.getState().layoutMode ?? "single-page";
  }
  /** Current page rotation in degrees. */
  get pageRotation() {
    return this.uiShell?.getState().pageRotation ?? 0;
  }
  /** Current spacing mode. */
  get spacingMode() {
    return this.uiShell?.getState().spacingMode ?? "all";
  }
  /** Whether the viewer is in fullscreen mode. */
  get isFullscreen() {
    return this.uiShell?.getState().isFullscreen ?? false;
  }
  /** Current view mode. */
  get viewMode() {
    return this.uiShell?.getState().viewMode ?? "paged";
  }
  /**
   * Set view mode (paged or continuous).
   */
  setViewMode(mode) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_VIEW_MODE", mode });
  }
  /**
   * Get the current view mode.
   */
  getViewMode() {
    return this.viewMode;
  }
  /**
   * Set scroll mode.
   */
  setScrollMode(mode) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_SCROLL_MODE", mode });
  }
  /** Default scroll alignment for navigation (outline, links, goToDestination). */
  get navigationScrollAlignment() {
    return this.uiShell?.getState().navigationScrollAlignment ?? "top";
  }
  /** Default scroll alignment for search result navigation. */
  get searchScrollAlignment() {
    return this.uiShell?.getState().searchScrollAlignment ?? "center";
  }
  /**
   * Set the default scroll alignment for navigation (outline, links, goToDestination).
   */
  setNavigationScrollAlignment(alignment) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_NAVIGATION_SCROLL_ALIGNMENT", alignment });
  }
  /**
   * Set the default scroll alignment for search result navigation.
   */
  setSearchScrollAlignment(alignment) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_SEARCH_SCROLL_ALIGNMENT", alignment });
  }
  /**
   * Set page layout mode.
   */
  setLayoutMode(mode) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_LAYOUT_MODE", mode });
  }
  /**
   * Set page rotation.
   */
  setPageRotation(rotation) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_PAGE_ROTATION", rotation });
  }
  /**
   * Set spacing mode.
   */
  setSpacingMode(mode) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_SPACING_MODE", mode });
  }
  /**
   * Enter or exit fullscreen mode.
   */
  setFullscreen(fullscreen) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_FULLSCREEN", isFullscreen: fullscreen });
    const root = this.container?.querySelector(".udoc-viewer-root");
    if (root) {
      if (fullscreen && !document.fullscreenElement) {
        root.requestFullscreen().catch(() => {
        });
      } else if (!fullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
        });
      }
    }
  }
  // ===========================================================================
  // UI Component Visibility
  // ===========================================================================
  /**
   * Show or hide the top toolbar.
   */
  setToolbarVisible(visible) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_TOOLBAR_VISIBLE", visible });
  }
  /**
   * Show or hide the floating toolbar (page navigation, zoom, view mode controls).
   */
  setFloatingToolbarVisible(visible) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_FLOATING_TOOLBAR_VISIBLE", visible });
  }
  /**
   * Currently active tool, as a tagged union. The `kind` is one of `"pointer"`,
   * `"hand"`, `"zoom"`, `"annotate"`, `"markup"`; for `"annotate"` and `"markup"`
   * a `sub` field carries the active sub-tool (`"freehand"`, `"highlight"`, etc.).
   */
  get activeTool() {
    return this.uiShell?.getState().activeTool ?? { kind: "pointer" };
  }
  /**
   * Switch the currently active tool. Tool-set kinds (`"annotate"`, `"markup"`)
   * require a `sub`, e.g. `{ kind: "annotate", sub: "freehand" }`. Calling
   * this with the same tool-set kind that's already active toggles back to
   * the pointer tool, matching the toolbar UI.
   */
  setActiveTool(tool) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_ACTIVE_TOOL", tool });
  }
  /**
   * Enable or disable the fullscreen button.
   */
  setFullscreenEnabled(enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_FULLSCREEN_BUTTON_VISIBLE", visible: enabled });
  }
  /**
   * Enable or disable the download button.
   */
  setDownloadEnabled(enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_DOWNLOAD_BUTTON_VISIBLE", visible: enabled });
  }
  /**
   * Enable or disable the print button.
   */
  setPrintEnabled(enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_PRINT_BUTTON_VISIBLE", visible: enabled });
  }
  /** Current theme mode. */
  get theme() {
    return this.uiShell?.getState().theme ?? "light";
  }
  /**
   * Set the viewer color theme.
   * @param theme - 'light', 'dark', or 'system'
   */
  setTheme(theme) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_THEME", theme });
  }
  /**
   * Enable or disable the theme toggle button in the toolbar.
   */
  setThemeSwitchingEnabled(enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_THEME_SWITCHING_DISABLED", disabled: !enabled });
  }
  /**
   * Enable or disable text selection in the viewer.
   */
  setTextSelectionEnabled(enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_TEXT_SELECTION_DISABLED", disabled: !enabled });
  }
  /**
   * Set the minimum zoom level.
   */
  setMinZoom(zoom) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_MIN_ZOOM", zoom });
  }
  /**
   * Set the maximum zoom level.
   */
  setMaxZoom(zoom) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_MAX_ZOOM", zoom });
  }
  /**
   * Enable or disable the entire left panel area.
   * When disabled, the left panel is hidden and all left panel tabs are inaccessible.
   */
  setLeftPanelEnabled(enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_LEFT_PANEL_VISIBLE", visible: enabled });
  }
  /**
   * Enable or disable the entire right panel area.
   * When disabled, the right panel is hidden and all right panel tabs are inaccessible.
   */
  setRightPanelEnabled(enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_RIGHT_PANEL_VISIBLE", visible: enabled });
  }
  /**
   * Enable or disable a specific panel tab.
   * Disabled panels are removed from the UI and cannot be opened.
   * If the panel is currently open and being disabled, it will be closed.
   */
  setPanelEnabled(panel, enabled) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_PANEL_DISABLED", panel, disabled: !enabled });
  }
  /**
   * Open a specific panel.
   * Has no effect if the panel is disabled via `setPanelEnabled()` or a `disable*` option.
   */
  openPanel(panel) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "TOGGLE_PANEL", panel });
    if (this.uiShell.getState().activePanel !== panel) {
      this.uiShell.dispatch({ type: "TOGGLE_PANEL", panel });
    }
  }
  /**
   * Close the currently open panel.
   */
  closePanel() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "CLOSE_PANEL" });
  }
  // ===========================================================================
  // Search
  // ===========================================================================
  /**
   * Search for text in the document.
   * Returns a promise that resolves with the final search matches once all page text
   * has been loaded and the search completes. Highlight overlays are rendered automatically.
   *
   * Results are also available via the `search:change` event (fires for intermediate
   * results as pages load) and the `searchMatches` getter.
   *
   * @param query - The text to search for
   * @param options - Search options
   * @param options.caseSensitive - Whether to match case (overrides current default)
   * @param options.fuzzy - Enable fuzzy matching. When true, all whitespace, control
   *   characters, pipes (`|`), and zero-width characters are stripped from both the
   *   query and the document text before comparison. This allows AI-generated citations
   *   to match even when spacing or separators differ from the original document
   *   (e.g. `"cell A | cell B"` will match `"cell A\ncell B"`).
   * @param options.pageRange - Inclusive 0-based page range `[start, end]` to restrict
   *   search to. Both text loading and match collection are limited to this range.
   *   Omit to search the entire document. Each `search()` call is self-contained —
   *   the range is reset to "all pages" unless explicitly provided.
   * @returns Promise resolving with the search matches
   */
  search(query, options) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    const stateBefore = this.uiShell.getState();
    if (options?.caseSensitive !== void 0) {
      this.uiShell.dispatch({ type: "SET_SEARCH_CASE_SENSITIVE", caseSensitive: options.caseSensitive });
    }
    if (options?.fuzzy !== void 0) {
      this.uiShell.dispatch({ type: "SET_SEARCH_FUZZY", fuzzy: options.fuzzy });
    }
    const range = options?.pageRange ? { start: options.pageRange[0], end: options.pageRange[1] } : null;
    this.uiShell.dispatch({ type: "SET_SEARCH_PAGE_RANGE", range });
    this.uiShell.dispatch({ type: "SET_SEARCH_QUERY", query });
    if (!query.trim()) {
      return Promise.resolve([]);
    }
    const stateAfter = this.uiShell.getState();
    if (stateBefore === stateAfter) {
      return Promise.resolve(stateAfter.searchMatches);
    }
    return new Promise((resolve) => {
      const unsub = this.uiShell.store.subscribeEffect((prev, next) => {
        if (next.searchQuery !== query) {
          unsub();
          resolve([]);
          return;
        }
        if (next.searchTextLoaded && prev.searchQuery === next.searchQuery && prev.searchMatches !== next.searchMatches) {
          unsub();
          resolve(next.searchMatches);
        }
      });
    });
  }
  /**
   * Navigate to the next search match.
   * @param options - Optional overrides for this navigation
   * @param options.scrollAlignment - Override scroll alignment for this call only
   */
  searchNext(options) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SEARCH_NEXT", scrollAlignment: options?.scrollAlignment });
  }
  /**
   * Navigate to the previous search match.
   * @param options - Optional overrides for this navigation
   * @param options.scrollAlignment - Override scroll alignment for this call only
   */
  searchPrev(options) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SEARCH_PREV", scrollAlignment: options?.scrollAlignment });
  }
  /**
   * Clear the current search query and results.
   */
  clearSearch() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "CLEAR_SEARCH" });
  }
  /**
   * Get the current search matches.
   */
  get searchMatches() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    return this.uiShell.getState().searchMatches;
  }
  /**
   * Get the index of the currently active search match (-1 if none).
   */
  get searchActiveIndex() {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    return this.uiShell.getState().searchActiveIndex;
  }
  /**
   * Set the active search match by index. Navigates the viewport to the match.
   *
   * @param index - 0-based index into `searchMatches`
   * @param options - Optional overrides for this navigation
   * @param options.scrollAlignment - Override scroll alignment for this call only
   */
  setSearchActiveIndex(index, options) {
    this.ensureNotDestroyed();
    this.ensureUiMode();
    this.uiShell.dispatch({ type: "SET_SEARCH_ACTIVE_INDEX", index, scrollAlignment: options?.scrollAlignment });
  }
  // ===========================================================================
  // Page Rendering
  // ===========================================================================
  /**
   * Render a page to an image.
   *
   * @param page - Page index (0-based)
   * @param options - Render options (scale, format, etc.)
   */
  async renderPage(page, options = {}) {
    return this.renderWithType(page, "page", options);
  }
  /**
   * Render a thumbnail of a page.
   *
   * Similar to renderPage but uses lower priority in the render queue,
   * making it suitable for generating thumbnails without blocking main page renders.
   *
   * @param page - Page index (0-based)
   * @param options - Render options (scale, format, etc.)
   */
  async renderThumbnail(page, options = {}) {
    return this.renderWithType(page, "thumbnail", options);
  }
  /**
   * Render a rectangular sub-region of a page.
   *
   * The rect is expressed in **page points** (1 point = 1/72 inch), with the
   * origin at the top-left of the page — the same coordinate space as
   * `getPageInfo(page).width` / `.height`.
   *
   * Output pixel size is `rect.width * scale` × `rect.height * scale`.
   *
   * Internally this renders the full page at the requested scale (sharing the
   * render cache with `renderPage`) and crops the result, so the underlying
   * full-page render is bounded by the engine's max-render limits.
   *
   * @param page - Page index (0-based)
   * @param rect - Region to render, in page points (top-left origin)
   * @param options - Render options. `scale` controls resolution; `format`,
   *   `imageType`, `quality`, `force`, and `boost` behave as in `renderPage`.
   */
  async renderRegion(page, rect, options = {}) {
    this.ensureLoaded();
    if (!(rect.width > 0) || !(rect.height > 0)) {
      throw new Error("renderRegion: rect width and height must be positive");
    }
    const scale = options.scale ?? 1;
    const format = options.format ?? "image-data";
    const force = options.force ?? false;
    const boost = options.boost ?? false;
    const renderRequest = {
      docId: this.documentId,
      page: page + 1,
      type: "page",
      scale
    };
    let result;
    if (force) {
      result = await this.workerClient.forceRender(renderRequest);
    } else {
      if (boost) {
        this.workerClient.boostPageRenderPriority(this.documentId, page + 1);
      }
      result = await this.workerClient.requestRender(renderRequest);
    }
    const fullBitmap = result.bitmap;
    let sx = Math.round(rect.x * scale);
    let sy = Math.round(rect.y * scale);
    let sw = Math.round(rect.width * scale);
    let sh = Math.round(rect.height * scale);
    if (sx < 0) {
      sw += sx;
      sx = 0;
    }
    if (sy < 0) {
      sh += sy;
      sy = 0;
    }
    sw = Math.min(sw, fullBitmap.width - sx);
    sh = Math.min(sh, fullBitmap.height - sy);
    if (sw <= 0 || sh <= 0) {
      throw new Error("renderRegion: rect is outside the page bounds");
    }
    const regionBitmap = await createImageBitmap(fullBitmap, sx, sy, sw, sh);
    return this.convertBitmapToFormat(regionBitmap, format, options);
  }
  /**
   * Internal method to render a page with a specific render type.
   */
  async renderWithType(page, type, options = {}) {
    this.ensureLoaded();
    const scale = options.scale ?? 1;
    const format = options.format ?? "image-data";
    const force = options.force ?? false;
    const boost = options.boost ?? false;
    const renderRequest = {
      docId: this.documentId,
      page: page + 1,
      // Uses 1-based page numbers
      type,
      scale
    };
    let result;
    if (force) {
      result = await this.workerClient.forceRender(renderRequest);
    } else {
      if (boost) {
        if (type === "page") {
          this.workerClient.boostPageRenderPriority(this.documentId, page + 1);
        } else {
          this.workerClient.boostThumbnailRenderPriority(this.documentId, page + 1);
        }
      }
      result = await this.workerClient.requestRender(renderRequest);
    }
    return this.convertBitmapToFormat(result.bitmap, format, options);
  }
  /**
   * Convert an ImageBitmap to the requested output format.
   */
  async convertBitmapToFormat(bitmap, format, options) {
    if (format === "image-bitmap") {
      return bitmap;
    }
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    if (format === "image-data") {
      return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    }
    const imageType = options.imageType ?? "image/png";
    const quality = options.quality ?? 0.92;
    if (format === "blob") {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob)
            resolve(blob);
          else
            reject(new Error("Failed to create blob"));
        }, imageType, quality);
      });
    }
    return canvas.toDataURL(imageType, quality);
  }
  // ===========================================================================
  // Export
  // ===========================================================================
  /**
   * Export document as bytes.
   * If annotations have been edited, saves them into the PDF before returning.
   */
  async toBytes() {
    this.ensureLoaded();
    const state = this.uiShell?.store.getState();
    if (state && state.annotationsDirtyPages.size > 0 && this.currentFormat === "pdf") {
      const annotationsByPage = {};
      for (const [pageIndex, annotations] of state.pageAnnotations) {
        const persistable = annotations.filter((a) => !a.ephemeral);
        annotationsByPage[String(pageIndex)] = persistable;
      }
      return this.workerClient.pdfSaveAnnotations(this.documentId, annotationsByPage);
    }
    return this.workerClient.getBytes(this.documentId);
  }
  /**
   * Download document to user's device.
   * @param filename - Filename for download (defaults to original source filename)
   */
  async download(filename) {
    const bytes = await this.toBytes();
    const mimeType = this.getMimeType();
    const blob = new Blob([bytes.buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? this.getDefaultFilename();
    a.click();
    URL.revokeObjectURL(url);
  }
  /**
   * Print the document.
   * Shows the print dialog when called without options (from public API).
   * When called with options (from the dialog), renders selected pages and opens the browser print dialog.
   */
  async print(options) {
    this.ensureLoaded();
    if (!options) {
      this.uiShell?.dispatch({ type: "SHOW_PRINT_DIALOG" });
      return;
    }
    const pageIndices = this.resolvePageIndices(options.pageRange);
    const isAllPages = pageIndices.length === this._pageCount;
    if (this.currentFormat === "pdf" && isAllPages && options.quality === "standard") {
      await this.printPdfNative();
    } else {
      await this.printRendered(pageIndices, options.quality);
    }
  }
  /**
   * Resolve a PrintPageRange into an array of 0-based page indices.
   * @internal
   */
  resolvePageIndices(range) {
    switch (range.kind) {
      case "all":
        return Array.from({ length: this._pageCount }, (_, i) => i);
      case "current":
        return [this.currentPage - 1];
      case "fromTo": {
        const indices = [];
        for (let i = range.from - 1; i < range.to; i++)
          indices.push(i);
        return indices;
      }
      case "custom":
        return range.pages.map((p) => p - 1);
    }
  }
  /**
   * Print PDF by loading original bytes into an iframe — vector quality, no rendering needed.
   * @internal
   */
  async printPdfNative() {
    const bytes = await this.toBytes();
    const blob = new Blob([bytes.buffer], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    const title = this.getDefaultFilename().replace(/\.[^.]+$/, "");
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.width = "0";
    iframe.style.height = "0";
    document.body.appendChild(iframe);
    iframe.src = blobUrl;
    await new Promise((resolve) => {
      iframe.onload = () => resolve();
    });
    const originalTitle = document.title;
    document.title = title;
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.title = originalTitle;
      URL.revokeObjectURL(blobUrl);
      iframe.remove();
    }, 1e3);
  }
  /** Map quality preset to DPI scale factor. */
  static qualityToDpiScale(quality) {
    switch (quality) {
      case "draft":
        return 150 / 72;
      case "standard":
        return 300 / 72;
      case "high":
        return 600 / 72;
    }
  }
  /**
   * Print by rendering selected pages to images.
   * @internal
   */
  async printRendered(pageIndices, quality) {
    const totalPages = pageIndices.length;
    this.uiShell?.dispatch({ type: "SET_PRINT_PROGRESS", currentPage: 0, totalPages });
    const blobUrls = [];
    try {
      const scale = _UDocViewer.qualityToDpiScale(quality);
      for (let idx = 0; idx < totalPages; idx++) {
        const pageIndex = pageIndices[idx];
        this.uiShell?.dispatch({ type: "SET_PRINT_PROGRESS", currentPage: idx + 1, totalPages });
        const blob = await this.renderPage(pageIndex, {
          scale,
          format: "blob",
          force: true
        });
        blobUrls.push(URL.createObjectURL(blob));
      }
      const firstInfo = this._pageInfo[pageIndices[0]];
      const pageWidthIn = (firstInfo.width / 72).toFixed(4);
      const pageHeightIn = (firstInfo.height / 72).toFixed(4);
      let pagesHtml = "";
      for (let idx = 0; idx < totalPages; idx++) {
        const pageIndex = pageIndices[idx];
        const info = this._pageInfo[pageIndex];
        const widthIn = (info.width / 72).toFixed(4);
        const heightIn = (info.height / 72).toFixed(4);
        const state = this.uiShell?.store.getState();
        const pageAnnotations = state?.pageAnnotations.get(pageIndex)?.filter((a) => !a.ephemeral);
        let annotationLayer = "";
        if (pageAnnotations && pageAnnotations.length > 0) {
          const tempLayer = document.createElement("div");
          renderAnnotationsToLayer(tempLayer, pageAnnotations, 1);
          const ptToCss = 96 / 72;
          annotationLayer = `<div style="position:absolute;top:0;left:0;width:${info.width}px;height:${info.height}px;transform-origin:top left;transform:scale(${ptToCss});pointer-events:none;">${tempLayer.innerHTML}</div>`;
        }
        pagesHtml += `<div class="page" style="position:relative;width:${widthIn}in;height:${heightIn}in;"><img src="${blobUrls[idx]}" style="width:100%;height:100%;">` + annotationLayer + `</div>`;
      }
      const title = this.getDefaultFilename().replace(/\.[^.]+$/, "");
      const html = `<!DOCTYPE html>
<html><head><title>${title}</title><style>
@page { size: ${pageWidthIn}in ${pageHeightIn}in; margin: 0; }
* { margin: 0; padding: 0; }
.page { page-break-after: always; overflow: hidden; }
.page:last-child { page-break-after: auto; }
img { display: block; }
</style></head><body>${pagesHtml}</body></html>`;
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.width = "0";
      iframe.style.height = "0";
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (!iframeDoc) {
        iframe.remove();
        throw new Error("Failed to create print iframe");
      }
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      const images = iframeDoc.querySelectorAll("img");
      await Promise.all(Array.from(images).map((img) => new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      })));
      this.uiShell?.dispatch({ type: "CLEAR_PRINT_PROGRESS" });
      const originalTitle = document.title;
      document.title = title;
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.title = originalTitle;
        for (const url of blobUrls)
          URL.revokeObjectURL(url);
        iframe.remove();
      }, 1e3);
    } catch (error) {
      this.uiShell?.dispatch({ type: "CLEAR_PRINT_PROGRESS" });
      for (const url of blobUrls)
        URL.revokeObjectURL(url);
      throw error;
    }
  }
  /** Returns the MIME type for the current document format. */
  getMimeType() {
    switch (this.currentFormat) {
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "image":
        return "application/octet-stream";
      case "pdf":
      default:
        return "application/pdf";
    }
  }
  /** Returns a default filename based on the source or format. */
  getDefaultFilename() {
    if (this.sourceFilename) {
      try {
        const url = new URL(this.sourceFilename);
        const path = url.pathname;
        const name = path.substring(path.lastIndexOf("/") + 1);
        if (name)
          return decodeURIComponent(name);
      } catch {
        const lastSlash = this.sourceFilename.lastIndexOf("/");
        return lastSlash >= 0 ? this.sourceFilename.substring(lastSlash + 1) : this.sourceFilename;
      }
    }
    switch (this.currentFormat) {
      case "docx":
        return "document.docx";
      case "pptx":
        return "document.pptx";
      case "xlsx":
        return "document.xlsx";
      case "image":
        return "image.png";
      case "pdf":
      default:
        return "document.pdf";
    }
  }
  // ===========================================================================
  // Events
  // ===========================================================================
  /**
   * Subscribe to an event.
   * @returns Unsubscribe function
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, /* @__PURE__ */ new Set());
    }
    this.eventHandlers.get(event).add(handler);
    return () => this.off(event, handler);
  }
  /**
   * Unsubscribe from an event.
   */
  off(event, handler) {
    this.eventHandlers.get(event)?.delete(handler);
  }
  // ===========================================================================
  // Lifecycle
  // ===========================================================================
  /**
   * Destroy the viewer and release resources.
   */
  destroy() {
    if (this.destroyed)
      return;
    this.destroyed = true;
    if (this.storeUnsub) {
      this.storeUnsub();
      this.storeUnsub = null;
    }
    if (this.actionUnsub) {
      this.actionUnsub();
      this.actionUnsub = null;
    }
    if (this.fontUsageUnsub) {
      this.fontUsageUnsub();
      this.fontUsageUnsub = null;
    }
    if (this.uiShell) {
      this.uiShell.destroy();
      this.uiShell = null;
    }
    this.close();
    this.eventHandlers.clear();
  }
  // ===========================================================================
  // Internal Helpers
  // ===========================================================================
  /**
   * Get the document ID (for internal use).
   * @internal
   */
  getDocumentId() {
    return this.documentId;
  }
  /**
   * Initialize the viewer with an already-loaded document ID.
   * Used by UDocClient.compose() to create viewers for composed documents.
   * @internal
   */
  async initializeFromDocId(docId) {
    this.ensureNotDestroyed();
    if (this.documentId) {
      this.close();
    }
    this.documentId = docId;
    this._pageInfo = await this.workerClient.getAllPageInfo(docId);
    this._pageCount = this._pageInfo.length;
    const format = await this.workerClient.getDocumentFormat(docId);
    this.currentFormat = format;
    const pageGroups = await this.workerClient.getPageGroups(docId);
    if (this.uiShell) {
      this.uiShell.dispatch({
        type: "SET_DOC",
        doc: { id: docId },
        documentFormat: format,
        pageCount: this._pageCount,
        pageInfos: this._pageInfo,
        pageGroups
      });
    }
    this.emit("document:load", { pageCount: this._pageCount });
  }
  resolveContainer(container) {
    if (typeof container === "string") {
      const element = document.querySelector(container);
      if (!element) {
        throw new Error(`Container not found: ${container}`);
      }
      return element;
    }
    return container;
  }
  async resolveSourceWithFilename(source) {
    if (source instanceof Uint8Array) {
      return { bytes: source };
    }
    if (source instanceof File) {
      const buffer = await source.arrayBuffer();
      return { bytes: new Uint8Array(buffer), filename: source.name };
    }
    const bytes = await this.fetchWithProgress(source);
    return { bytes, filename: source };
  }
  async fetchWithProgress(url) {
    if (this.uiShell) {
      this.uiShell.dispatch({
        type: "SET_DOWNLOAD_PROGRESS",
        loaded: 0,
        total: 0
      });
    }
    this.emit("download:progress", { loaded: 0, total: 0, percent: null });
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }
    const contentLength = response.headers.get("Content-Length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    if (!response.body) {
      const buffer = await response.arrayBuffer();
      if (this.uiShell) {
        this.uiShell.dispatch({ type: "CLEAR_DOWNLOAD_PROGRESS" });
      }
      return new Uint8Array(buffer);
    }
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;
    const reportProgress = (currentLoaded) => {
      const progress = {
        loaded: currentLoaded,
        total,
        percent: total > 0 ? Math.round(currentLoaded / total * 100) : null
      };
      this.emit("download:progress", progress);
      if (this.uiShell) {
        this.uiShell.dispatch({
          type: "SET_DOWNLOAD_PROGRESS",
          loaded: currentLoaded,
          total
        });
      }
    };
    reportProgress(0);
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        break;
      chunks.push(value);
      loaded += value.length;
      reportProgress(loaded);
    }
    if (this.uiShell) {
      this.uiShell.dispatch({ type: "CLEAR_DOWNLOAD_PROGRESS" });
    }
    const result = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }
  emit(event, payload) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      }
    }
  }
  createEngineAdapter() {
    return {
      getPageInfo: async (_doc, page) => {
        const pageIndex = Math.max(0, page - 1);
        return this._pageInfo[pageIndex] ?? { width: 0, height: 0 };
      },
      getOutline: async (doc) => {
        const raw = await this.workerClient.getOutline(doc.id);
        return raw;
      },
      getPageAnnotations: async (doc, pageIndex) => {
        const raw = await this.workerClient.getPageAnnotations(doc.id, pageIndex);
        return raw;
      },
      getLayoutPage: async (doc, pageIndex) => {
        return await this.workerClient.getLayoutPage(doc.id, pageIndex);
      },
      getVisibilityGroups: async (doc) => {
        const raw = await this.workerClient.getVisibilityGroups(doc.id);
        return raw;
      },
      setVisibilityGroupVisible: async (doc, groupId, visible) => {
        return await this.workerClient.setVisibilityGroupVisible(doc.id, groupId, visible);
      }
    };
  }
  ensureNotDestroyed() {
    if (this.destroyed) {
      throw new Error("UDocViewer has been destroyed");
    }
  }
  ensureLoaded() {
    this.ensureNotDestroyed();
    if (!this.documentId) {
      throw new Error("No document loaded");
    }
  }
  ensureUiMode() {
    if (!this.uiShell) {
      throw new Error("This method requires UI mode (container must be provided)");
    }
  }
};

// node_modules/@docmentis/udoc-viewer/dist/src/UDocClient.js
var UDocClient = class _UDocClient {
  /**
   * SDK version string (replaced at build time).
   */
  static version = "0.6.42";
  workerClient;
  options;
  viewers = /* @__PURE__ */ new Set();
  destroyed = false;
  licenseInfo = {
    valid: true,
    tier: "free",
    features: [],
    limits: {}
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
    const workerClient = options.baseUrl ? WorkerClient.createWithUrl(new URL("worker.js", options.baseUrl)) : WorkerClient.create();
    const cdnUrl = `https://cdn.jsdelivr.net/npm/@docmentis/udoc-viewer@${_UDocClient.version}/dist/src/wasm/udoc_bg.wasm`;
    const wasmUrls = [];
    if (options.baseUrl) {
      wasmUrls.push(new URL("udoc_bg.wasm", options.baseUrl).href);
    } else {
      try {
        const meta = await Promise.resolve().then(() => (init_meta_url(), meta_url_exports));
        wasmUrls.push(meta.wasmUrl);
      } catch {
      }
      wasmUrls.push(cdnUrl);
    }
    const domain = typeof window !== "undefined" ? window.location.hostname : "localhost";
    let lastError;
    for (const wasmUrl2 of wasmUrls) {
      try {
        await workerClient.init(wasmUrl2, options.__experimentalGpu, domain, _UDocClient.version);
        lastError = null;
        break;
      } catch (e) {
        lastError = e;
      }
    }
    if (lastError)
      throw lastError;
    const client = new _UDocClient(workerClient, options);
    if (options.fonts?.length) {
      await workerClient.registerFonts(options.fonts);
    }
    if (options.googleFonts !== false) {
      await workerClient.enableGoogleFonts();
    }
    if (options.license) {
      const result = await workerClient.setLicense(options.license, domain);
      client.licenseInfo = licenseResultToInfo(result);
      if (!result.valid) {
        console.warn(`[udoc-viewer] License validation failed: ${result.error}`);
      }
    }
    let telemetryDisabled = false;
    if (options.disableTelemetry) {
      telemetryDisabled = await workerClient.disableTelemetry();
      if (!telemetryDisabled) {
        console.warn("[udoc-viewer] disableTelemetry requires a license with the 'no_telemetry' feature.");
      } else {
        removeDistinctId();
      }
    }
    if (!telemetryDisabled) {
      const distinctId = getOrCreateDistinctId();
      await workerClient.setupTelemetry(distinctId);
    }
    if (!options.disableUpdateCheck) {
      checkForUpdates(_UDocClient.version);
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
    const viewer = new UDocViewer(this.workerClient, options, showAttribution, showLoadingOverlay, _UDocClient.version);
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
    const sourceMap = /* @__PURE__ */ new Map();
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
    const sourceIndexMap = /* @__PURE__ */ new Map();
    let index = 0;
    for (const source of sourceMap.keys()) {
      sourceIndexMap.set(source, index++);
    }
    const lowLevelCompositions = compositions.map((composition) => composition.map((pick) => ({
      doc: sourceIndexMap.get(pick.doc),
      pages: this.normalizePages(pick.pages),
      rotation: pick.rotation
    })));
    const newDocIds = await this.workerClient.pdfCompose(lowLevelCompositions, docIds);
    for (const [source, docId] of sourceMap) {
      if (!(source instanceof UDocViewer)) {
        await this.workerClient.unloadPdf(docId);
      }
    }
    const viewers = [];
    for (const docId of newDocIds) {
      const viewer = new UDocViewer(this.workerClient, {}, true, true, _UDocClient.version);
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
      const viewers = [];
      for (const newDocId of result.documentIds) {
        const viewer = new UDocViewer(this.workerClient, {}, true, true, _UDocClient.version);
        await viewer.initializeFromDocId(newDocId);
        this.viewers.add(viewer);
        viewers.push(viewer);
      }
      return {
        viewers,
        sections: result.sections
      };
    } finally {
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
    } finally {
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
    } finally {
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
    } finally {
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
    } finally {
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
      const timeoutId = setTimeout(() => controller.abort(), 6e4);
      try {
        const response = await fetch(source, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${source}: ${response.statusText}`);
        }
        bytes = new Uint8Array(await response.arrayBuffer());
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new Error(`Fetch timed out for ${source}`, { cause: error });
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    } else if (source instanceof File) {
      bytes = new Uint8Array(await source.arrayBuffer());
    } else {
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
    for (const viewer of this.viewers) {
      viewer.destroy();
    }
    this.viewers.clear();
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
};
var DISTINCT_ID_KEY = "udoc_viewer_distinct_id";
function getOrCreateDistinctId() {
  try {
    const stored = localStorage.getItem(DISTINCT_ID_KEY);
    if (stored)
      return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(DISTINCT_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
function removeDistinctId() {
  try {
    localStorage.removeItem(DISTINCT_ID_KEY);
  } catch {
  }
}
function checkForUpdates(currentVersion) {
  fetch("https://registry.npmjs.org/@docmentis/udoc-viewer/latest").then((res) => res.ok ? res.json() : null).then((data) => {
    if (!data?.version)
      return;
    if (data.version !== currentVersion) {
      console.warn(`[udoc-viewer] A newer version is available: ${data.version} (current: ${currentVersion}). Update with: npm install @docmentis/udoc-viewer@latest
To disable this check, set { disableUpdateCheck: true } in UDocClient.create() options.`);
    }
  }).catch(() => {
  });
}
function licenseResultToInfo(result) {
  const hasLicensedFeatures = result.features.length > 0 || Object.keys(result.limits).length > 0;
  return {
    valid: result.valid,
    tier: result.valid && hasLicensedFeatures ? "licensed" : "free",
    features: result.features,
    limits: result.limits,
    organization: result.organization,
    expiresAt: result.expiresAt ? new Date(result.expiresAt * 1e3) : void 0,
    error: result.error
  };
}
export {
  UDocClient,
  UDocViewer,
  createI18n
};
