"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomEvent = void 0;
const isCustomEventSupported = typeof window !== "undefined" && !!window.CustomEvent;
exports.createCustomEvent = (type, options) => {
    if (isCustomEventSupported)
        return new CustomEvent(type, options);
    const event = document.createEvent("CustomEvent");
    event.initCustomEvent(type, 
    /* bubbles */ false, (options === null || options === void 0 ? void 0 : options.cancelable) || false, (options === null || options === void 0 ? void 0 : options.detail) || undefined);
    return event;
};
//# sourceMappingURL=utils.js.map