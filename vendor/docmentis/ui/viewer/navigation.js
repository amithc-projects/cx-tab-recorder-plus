// -----------------------------------------------------------------------------
// Destination display types (matching WASM JsDestinationDisplay)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Conversion utilities
// -----------------------------------------------------------------------------
/**
 * Convert a WASM destination to an internal navigation target.
 *
 * @param dest - The destination from WASM
 * @param pageCount - Total number of pages (for clamping)
 * @returns NavigationTarget for internal use
 */
export function destinationToNavigationTarget(dest, pageCount) {
    // Convert 0-based pageIndex to 1-based page
    const page = Math.max(1, Math.min(dest.pageIndex + 1, Math.max(1, pageCount)));
    const target = { page };
    switch (dest.display.type) {
        case "xyz":
            if (dest.display.top !== undefined || dest.display.left !== undefined) {
                target.scrollTo = {
                    x: dest.display.left,
                    y: dest.display.top,
                };
            }
            if (dest.display.zoom !== undefined && dest.display.zoom > 0) {
                target.zoom = dest.display.zoom;
            }
            break;
        case "fitH":
            if (dest.display.top !== undefined) {
                target.scrollTo = { y: dest.display.top };
            }
            break;
        case "fitV":
            if (dest.display.left !== undefined) {
                target.scrollTo = { x: dest.display.left };
            }
            break;
        case "fitBH":
            if (dest.display.top !== undefined) {
                target.scrollTo = { y: dest.display.top };
            }
            break;
        case "fitBV":
            if (dest.display.left !== undefined) {
                target.scrollTo = { x: dest.display.left };
            }
            break;
        // "fit", "fitB", "fitR" - just navigate to page, no specific scroll position
        case "fit":
        case "fitB":
        case "fitR":
            // No scroll position needed
            break;
    }
    return target;
}
//# sourceMappingURL=navigation.js.map