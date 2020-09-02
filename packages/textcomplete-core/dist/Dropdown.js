"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dropdown = exports.DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME = exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME = exports.DEFAULT_DROPDOWN_CLASS_NAME = exports.DEFAULT_DROPDOWN_PLACEMENT = exports.DEFAULT_DROPDOWN_MAX_COUNT = void 0;
const eventemitter3_1 = require("eventemitter3");
const utils_1 = require("./utils");
// Default constants for Dropdown
exports.DEFAULT_DROPDOWN_MAX_COUNT = 10;
exports.DEFAULT_DROPDOWN_PLACEMENT = "auto";
exports.DEFAULT_DROPDOWN_CLASS_NAME = "dropdown-menu textcomplete-dropdown";
// Default constants for DropdownItem
exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME = "textcomplete-item";
exports.DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME = `${exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME} active`;
class Dropdown extends eventemitter3_1.EventEmitter {
    constructor(el, option) {
        super();
        this.el = el;
        this.option = option;
        this.shown = false;
        this.items = [];
        this.activeIndex = null;
    }
    static create(option) {
        const ul = document.createElement("ul");
        ul.className = option.className || exports.DEFAULT_DROPDOWN_CLASS_NAME;
        Object.assign(ul.style, {
            display: "none",
            position: "absolute",
            zIndex: "1000",
        }, option.style);
        const parent = option.parent || document.body;
        parent === null || parent === void 0 ? void 0 : parent.appendChild(ul);
        return new Dropdown(ul, option);
    }
    /**
     * Render the given search results. Previous results are cleared.
     *
     * @emits render
     * @emits rendered
     */
    render(searchResults, cursorOffset) {
        const event = utils_1.createCustomEvent("render", { cancelable: true });
        this.emit("render", event);
        if (event.defaultPrevented)
            return this;
        this.clear();
        if (searchResults.length === 0)
            return this.hide();
        this.items = searchResults
            .slice(0, this.option.maxCount || exports.DEFAULT_DROPDOWN_MAX_COUNT)
            .map((r, index) => { var _a; return new DropdownItem(this, index, r, ((_a = this.option) === null || _a === void 0 ? void 0 : _a.item) || {}, this.activate.bind(this, index)); });
        this.setStrategyId(searchResults[0])
            .renderEdge(searchResults, "header")
            .renderItems()
            .renderEdge(searchResults, "footer")
            .show()
            .setOffset(cursorOffset)
            .activate(0);
        this.emit("rendered", utils_1.createCustomEvent("rendered"));
        return this;
    }
    destroy() {
        var _a;
        this.clear();
        (_a = this.el.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.el);
        return this;
    }
    /**
     * Select the given item
     *
     * @emits select
     * @emits selected
     */
    select(item) {
        const detail = { searchResult: item.searchResult };
        const event = utils_1.createCustomEvent("select", { cancelable: true, detail });
        this.emit("select", event);
        if (event.defaultPrevented)
            return this;
        this.hide();
        this.emit("selected", utils_1.createCustomEvent("selected", { detail }));
        return this;
    }
    /**
     * Show the dropdown element
     *
     * @emits show
     * @emits shown
     */
    show() {
        if (!this.shown) {
            const event = utils_1.createCustomEvent("show", { cancelable: true });
            this.emit("show", event);
            if (event.defaultPrevented)
                return this;
            this.el.style.display = "block";
            this.shown = true;
            this.emit("shown", utils_1.createCustomEvent("shown"));
        }
        return this;
    }
    /**
     * Hide the dropdown element
     *
     * @emits hide
     * @emits hidden
     */
    hide() {
        if (this.shown) {
            const event = utils_1.createCustomEvent("hide", { cancelable: true });
            this.emit("hide", event);
            if (event.defaultPrevented)
                return this;
            this.el.style.display = "none";
            this.shown = false;
            this.clear();
            this.emit("hidden", utils_1.createCustomEvent("hidden"));
        }
        return this;
    }
    /** Clear search results */
    clear() {
        this.items.forEach((i) => i.destroy());
        this.items = [];
        this.el.innerHTML = "";
        this.activeIndex = null;
        return this;
    }
    up(e) {
        return this.shown ? this.moveActiveItem("prev", e) : this;
    }
    down(e) {
        return this.shown ? this.moveActiveItem("next", e) : this;
    }
    moveActiveItem(direction, e) {
        if (this.activeIndex != null) {
            const activeIndex = direction === "next"
                ? this.getNextActiveIndex()
                : this.getPrevActiveIndex();
            if (activeIndex != null) {
                this.activate(activeIndex);
                e.preventDefault();
            }
        }
        return this;
    }
    activate(index) {
        if (this.activeIndex !== index) {
            // if (this.activeIndex != null) {
            //   this.items[this.activeIndex].deactivate()
            // }
            this.deactivateAll();
            this.activeIndex = index;
            this.items[index].activate();
        }
        return this;
    }
    deactivateAll() {
        this.items.forEach((i) => i.deactivate());
        return this;
    }
    isShown() {
        return this.shown;
    }
    getActiveItem() {
        return this.activeIndex != null ? this.items[this.activeIndex] : null;
    }
    setOffset(cursorOffset) {
        const doc = document.documentElement;
        if (doc) {
            const elementWidth = this.el.offsetWidth;
            if (cursorOffset.left) {
                const browserWidth = this.option.dynamicWidth ? doc.scrollWidth : doc.clientWidth;
                if (cursorOffset.left + elementWidth > browserWidth) {
                    cursorOffset.left = browserWidth - elementWidth;
                }
                this.el.style.left = `${cursorOffset.left}px`;
            }
            else if (cursorOffset.right) {
                if (cursorOffset.right - elementWidth < 0) {
                    cursorOffset.right = 0;
                }
                this.el.style.right = `${cursorOffset.right}px`;
            }
            let forceTop = false;
            const placement = this.option.placement || exports.DEFAULT_DROPDOWN_PLACEMENT;
            if (placement === "auto") {
                const dropdownHeight = this.items.length * cursorOffset.lineHeight;
                forceTop =
                    cursorOffset.clientTop != null &&
                        cursorOffset.clientTop + dropdownHeight > doc.clientHeight;
            }
            if (placement === "top" || forceTop) {
                this.el.style.bottom = `${doc.clientHeight - cursorOffset.top + cursorOffset.lineHeight}px`;
                this.el.style.top = "auto";
            }
            else {
                this.el.style.top = `${cursorOffset.top}px`;
                this.el.style.bottom = "auto";
            }
        }
        return this;
    }
    getNextActiveIndex() {
        if (this.activeIndex == null)
            throw new Error();
        return this.activeIndex < this.items.length - 1
            ? this.activeIndex + 1
            : this.option.rotate
                ? 0
                : null;
    }
    getPrevActiveIndex() {
        if (this.activeIndex == null)
            throw new Error();
        return this.activeIndex !== 0
            ? this.activeIndex - 1
            : this.option.rotate
                ? this.items.length - 1
                : null;
    }
    renderItems() {
        const fragment = document.createDocumentFragment();
        for (const item of this.items) {
            fragment.appendChild(item.el);
        }
        this.el.appendChild(fragment);
        return this;
    }
    setStrategyId(searchResult) {
        const id = searchResult.getStrategyId();
        if (id)
            this.el.dataset.strategy = id;
        return this;
    }
    renderEdge(searchResults, type) {
        const option = this.option[type];
        const li = document.createElement("li");
        li.className = `textcomplete-${type}`;
        li.innerHTML =
            typeof option === "function"
                ? option(searchResults.map((s) => s.data))
                : option || "";
        this.el.appendChild(li);
        return this;
    }
}
exports.Dropdown = Dropdown;
class DropdownItem {
    constructor(dropdown, index, searchResult, props, activationHandler) {
        this.dropdown = dropdown;
        this.index = index;
        this.searchResult = searchResult;
        this.props = props;
        this.activationHandler = activationHandler;
        this.active = false;
        this.onClick = (e) => {
            e.preventDefault();
            this.dropdown.select(this);
        };
        this.className = this.props.className || exports.DEFAULT_DROPDOWN_ITEM_CLASS_NAME;
        this.activeClassName =
            this.props.activeClassName || exports.DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME;
        const li = document.createElement("li");
        li.className = this.active ? this.activeClassName : this.className;
        const span = document.createElement("span");
        span.tabIndex = -1;
        span.innerHTML = this.searchResult.render();
        li.appendChild(span);
        li.addEventListener("mousedown", this.onClick);
        li.addEventListener("touchstart", this.onClick);
        li.addEventListener("mouseenter", activationHandler);
        this.el = li;
    }
    destroy() {
        var _a;
        const li = this.el;
        (_a = li.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(li);
        li.removeEventListener("mousedown", this.onClick, false);
        li.removeEventListener("touchstart", this.onClick, false);
        return this;
    }
    activate() {
        if (!this.active) {
            this.active = true;
            this.el.className = this.activeClassName;
            this.dropdown.el.scrollTop = this.el.offsetTop;
        }
        return this;
    }
    deactivate() {
        if (this.active) {
            this.active = false;
            this.el.className = this.className;
        }
        return this;
    }
}
//# sourceMappingURL=Dropdown.js.map