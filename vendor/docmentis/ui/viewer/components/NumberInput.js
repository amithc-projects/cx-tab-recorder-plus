/**
 * Reusable number input with dropdown panel containing a slider and text input.
 * Used for stroke width, opacity, font size, etc.
 */
export function createNumberInput(config) {
    let currentValue = config.value;
    // --- Trigger button ---
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
    // --- Floating panel ---
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
    function clamp(v) {
        return Math.min(config.max, Math.max(config.min, v));
    }
    function roundToStep(v) {
        return Math.round(v / config.step) * config.step;
    }
    function setValue(v, fromSlider = false) {
        currentValue = roundToStep(clamp(v));
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
        }
        else {
            // Reset to current value on invalid input
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
        currentValue = roundToStep(clamp(value));
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
//# sourceMappingURL=NumberInput.js.map