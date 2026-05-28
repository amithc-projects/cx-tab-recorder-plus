export { en } from "./en.js";
import { en } from "./en.js";
import { zhCN } from "./zh-CN.js";
import { zhTW } from "./zh-TW.js";
import { ja } from "./ja.js";
import { ko } from "./ko.js";
import { es } from "./es.js";
import { fr } from "./fr.js";
import { de } from "./de.js";
import { ptBR } from "./pt-BR.js";
import { ar } from "./ar.js";
import { ru } from "./ru.js";
/** Built-in locale packs, keyed by locale identifier. */
const locales = {
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
    ru,
};
function interpolate(template, params) {
    if (!params)
        return template;
    return template.replace(/\{(\w+)\}/g, (_, key) => params[key] !== undefined ? String(params[key]) : `{${key}}`);
}
/**
 * Resolve a locale identifier to a built-in translation pack.
 *
 * Tries exact match first (e.g. "zh-CN"), then base language (e.g. "zh"),
 * then falls back to English.
 */
function resolveLocale(locale) {
    // Exact match
    if (locales[locale])
        return locales[locale];
    // Base language fallback (e.g. "zh-Hans" → "zh-CN", "pt" → "pt-BR")
    const base = locale.split("-")[0];
    if (base === "zh")
        return zhCN;
    if (base === "pt")
        return ptBR;
    if (locales[base])
        return locales[base];
    // Default to English
    return en;
}
/**
 * Detect the browser's preferred locale.
 * Returns the first `navigator.languages` entry, or "en" in non-browser environments.
 */
function detectLocale() {
    if (typeof navigator !== "undefined") {
        return navigator.language ?? "en";
    }
    return "en";
}
/**
 * Create an i18n instance.
 *
 * Resolves the locale to a built-in translation pack (en, zh-CN, ja, ko, es,
 * fr, de, pt-BR, ar, ru, zh-TW). Optional overrides are merged on top.
 *
 * When `locale` is omitted, the browser's preferred language is used automatically.
 *
 * @param locale - Locale identifier (e.g. "en", "zh-CN"). Defaults to browser language.
 * @param overrides - Partial translation overrides. Merged on top of the resolved locale.
 */
export function createI18n(locale, overrides) {
    const effectiveLocale = locale ?? detectLocale();
    const resolved = resolveLocale(effectiveLocale);
    const messages = overrides
        ? { ...resolved, ...overrides }
        : resolved;
    return {
        locale: effectiveLocale,
        t(key, params) {
            const template = messages[key] ?? key;
            return interpolate(template, params);
        },
    };
}
//# sourceMappingURL=index.js.map