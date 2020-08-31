"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextareaEditor = void 0;
const undate_1 = require("undate");
const textarea_caret_1 = __importDefault(require("textarea-caret"));
const index_js_1 = require("../../textcomplete-core/dist_/index.js");
const index_js_2 = require("../../textcomplete-utils/dist_/index.js");
class TextareaEditor extends index_js_1.Editor {
    constructor(el) {
        super();
        this.el = el;
        this.onInput = () => {
            this.emitChangeEvent();
        };
        this.onKeydown = (e) => {
            const code = this.getCode(e);
            let event;
            if (code === "UP" || code === "DOWN") {
                event = this.emitMoveEvent(code);
            }
            else if (code === "ENTER") {
                event = this.emitEnterEvent();
            }
            else if (code === "ESC") {
                event = this.emitEscEvent();
            }
            if (event && event.defaultPrevented) {
                e.preventDefault();
            }
        };
        this.startListening();
    }
    destroy() {
        super.destroy();
        this.stopListening();
        return this;
    }
    /**
     * @implements {@link Editor#applySearchResult}
     */
    applySearchResult(searchResult) {
        const beforeCursor = this.getBeforeCursor();
        if (beforeCursor != null) {
            const replace = searchResult.replace(beforeCursor, this.getAfterCursor());
            this.el.focus(); // Clicking a dropdown item removes focus from the element.
            if (Array.isArray(replace)) {
                undate_1.update(this.el, replace[0], replace[1]);
                if (this.el) {
                    this.el.dispatchEvent(index_js_1.createCustomEvent("input"));
                }
            }
        }
    }
    /**
     * @implements {@link Editor#getCursorOffset}
     */
    getCursorOffset() {
        const elOffset = index_js_2.calculateElementOffset(this.el);
        const elScroll = this.getElScroll();
        const cursorPosition = this.getCursorPosition();
        const lineHeight = index_js_2.getLineHeightPx(this.el);
        const top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight;
        const left = elOffset.left - elScroll.left + cursorPosition.left;
        const clientTop = this.el.getBoundingClientRect().top;
        if (this.el.dir !== "rtl") {
            return { top, left, lineHeight, clientTop };
        }
        else {
            const right = document.documentElement
                ? document.documentElement.clientWidth - left
                : 0;
            return { top, right, lineHeight, clientTop };
        }
    }
    /**
     * @implements {@link Editor#getBeforeCursor}
     */
    getBeforeCursor() {
        return this.el.selectionStart !== this.el.selectionEnd
            ? null
            : this.el.value.substring(0, this.el.selectionEnd);
    }
    getAfterCursor() {
        return this.el.value.substring(this.el.selectionEnd);
    }
    getElScroll() {
        return { top: this.el.scrollTop, left: this.el.scrollLeft };
    }
    /**
     * The input cursor's relative coordinates from the textarea's left
     * top corner.
     */
    getCursorPosition() {
        return textarea_caret_1.default(this.el, this.el.selectionEnd);
    }
    startListening() {
        this.el.addEventListener("input", this.onInput);
        this.el.addEventListener("keydown", this.onKeydown);
    }
    stopListening() {
        this.el.removeEventListener("input", this.onInput);
        this.el.removeEventListener("keydown", this.onKeydown);
    }
}
exports.TextareaEditor = TextareaEditor;
//# sourceMappingURL=TextareaEditor.js.map