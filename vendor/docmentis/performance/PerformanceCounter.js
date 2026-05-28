/**
 * Performance counter for tracking viewer operations.
 *
 * Logs both START and END events to show the sequence and overlap of operations.
 */
/**
 * Performance counter implementation.
 */
export class PerformanceCounter {
    enabled = true;
    _entries = [];
    _pendingEvents = new Map();
    _listeners = new Set();
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
            startTime: now,
        });
        const entry = {
            phase: "start",
            type,
            timestamp: this._loadStartTime !== null ? now - this._loadStartTime : 0,
            context,
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
            error,
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
        // Collect durations by type from end events
        const durationsByType = new Map();
        for (const entry of this._entries) {
            if (entry.phase === "end" && entry.duration !== undefined) {
                const durations = durationsByType.get(entry.type) ?? [];
                durations.push(entry.duration);
                durationsByType.set(entry.type, durations);
            }
        }
        // Calculate stats for each type
        for (const [type, durations] of durationsByType) {
            if (durations.length > 0) {
                const total = durations.reduce((a, b) => a + b, 0);
                breakdown[type] = {
                    count: durations.length,
                    totalDuration: total,
                    avgDuration: total / durations.length,
                    minDuration: Math.min(...durations),
                    maxDuration: Math.max(...durations),
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
            }
            catch {
                // Ignore listener errors
            }
        }
    }
}
/**
 * No-op implementation for when performance tracking is disabled.
 * All methods are no-ops with minimal overhead.
 */
export class NoOpPerformanceCounter {
    enabled = false;
    entries = [];
    setLoadStartTime() { }
    markStart() {
        return "";
    }
    markEnd() { }
    onLog() {
        return () => { };
    }
    getSummary() {
        return { breakdown: {} };
    }
    reset() { }
}
//# sourceMappingURL=PerformanceCounter.js.map