"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var common_1 = require("../../common");
var QueryList = /** @class */ (function (_super) {
    tslib_1.__extends(QueryList, _super);
    function QueryList(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.refHandlers = {
            itemsParent: function (ref) { return (_this.itemsParentRef = ref); },
        };
        /**
         * Flag indicating that we should check whether selected item is in viewport
         * after rendering, typically because of keyboard change. Set to `true` when
         * manipulating state in a way that may cause active item to scroll away.
         */
        _this.shouldCheckActiveItemInViewport = false;
        /** default `itemListRenderer` implementation */
        _this.renderItemList = function (listProps) {
            var _a = _this.props, initialContent = _a.initialContent, noResults = _a.noResults;
            var menuContent = common_1.renderFilteredItems(listProps, noResults, initialContent);
            return React.createElement(core_1.Menu, { ulRef: listProps.itemsParentRef }, menuContent);
        };
        /** wrapper around `itemRenderer` to inject props */
        _this.renderItem = function (item, index) {
            var _a = _this.state, activeItem = _a.activeItem, query = _a.query;
            var matchesPredicate = _this.state.filteredItems.indexOf(item) >= 0;
            var modifiers = {
                active: activeItem === item,
                disabled: isItemDisabled(item, index, _this.props.itemDisabled),
                matchesPredicate: matchesPredicate,
            };
            return _this.props.itemRenderer(item, {
                handleClick: function (e) { return _this.handleItemSelect(item, e); },
                index: index,
                modifiers: modifiers,
                query: query,
            });
        };
        _this.handleItemSelect = function (item, event) {
            _this.setActiveItem(item);
            core_1.Utils.safeInvoke(_this.props.onItemSelect, item, event);
            if (_this.props.resetOnSelect) {
                _this.setQuery("", true);
            }
        };
        _this.handleKeyDown = function (event) {
            var keyCode = event.keyCode;
            if (keyCode === core_1.Keys.ARROW_UP || keyCode === core_1.Keys.ARROW_DOWN) {
                event.preventDefault();
                var nextActiveItem = _this.getNextActiveItem(keyCode === core_1.Keys.ARROW_UP ? -1 : 1);
                if (nextActiveItem != null) {
                    _this.setActiveItem(nextActiveItem);
                }
            }
            core_1.Utils.safeInvoke(_this.props.onKeyDown, event);
        };
        _this.handleKeyUp = function (event) {
            var onKeyUp = _this.props.onKeyUp;
            var activeItem = _this.state.activeItem;
            // using keyup for enter to play nice with Button's keyboard clicking.
            // if we were to process enter on keydown, then Button would click itself on keyup
            // and the popvoer would re-open out of our control :(.
            if (event.keyCode === core_1.Keys.ENTER && activeItem != null) {
                event.preventDefault();
                _this.handleItemSelect(activeItem, event);
            }
            core_1.Utils.safeInvoke(onKeyUp, event);
        };
        _this.handleQueryChange = function (event) {
            var query = event == null ? "" : event.target.value;
            _this.setQuery(query);
            core_1.Utils.safeInvoke(_this.props.onQueryChange, query, event);
        };
        var _a = _this.props.query, query = _a === void 0 ? "" : _a;
        var filteredItems = getFilteredItems(query, _this.props);
        _this.state = { activeItem: getFirstEnabledItem(filteredItems, _this.props.itemDisabled), filteredItems: filteredItems, query: query };
        return _this;
    }
    QueryList.ofType = function () {
        return QueryList;
    };
    QueryList.prototype.render = function () {
        var _a = this.props, className = _a.className, items = _a.items, renderer = _a.renderer, _b = _a.itemListRenderer, itemListRenderer = _b === void 0 ? this.renderItemList : _b;
        return renderer(tslib_1.__assign({}, this.state, { className: className, handleItemSelect: this.handleItemSelect, handleKeyDown: this.handleKeyDown, handleKeyUp: this.handleKeyUp, handleQueryChange: this.handleQueryChange, itemList: itemListRenderer(tslib_1.__assign({}, this.state, { items: items, itemsParentRef: this.refHandlers.itemsParent, renderItem: this.renderItem })) }));
    };
    QueryList.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.activeItem !== undefined) {
            this.shouldCheckActiveItemInViewport = true;
            this.setState({ activeItem: nextProps.activeItem });
        }
        if (nextProps.query != null) {
            this.setQuery(nextProps.query);
        }
    };
    QueryList.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (!core_1.Utils.shallowCompareKeys(this.props, prevProps, {
            include: ["items", "itemListPredicate", "itemPredicate"],
        })) {
            this.setQuery(this.state.query);
        }
        if (this.shouldCheckActiveItemInViewport) {
            // update scroll position immediately before repaint so DOM is accurate
            // (latest filteredItems) and to avoid flicker.
            requestAnimationFrame(function () { return _this.scrollActiveItemIntoView(); });
            // reset the flag
            this.shouldCheckActiveItemInViewport = false;
        }
    };
    QueryList.prototype.scrollActiveItemIntoView = function () {
        var activeElement = this.getActiveElement();
        if (this.itemsParentRef != null && activeElement != null) {
            var activeTop = activeElement.offsetTop, activeHeight = activeElement.offsetHeight;
            var _a = this.itemsParentRef, parentOffsetTop = _a.offsetTop, parentScrollTop = _a.scrollTop, parentHeight = _a.clientHeight;
            // compute padding on parent element to ensure we always leave space
            var _b = this.getItemsParentPadding(), paddingTop = _b.paddingTop, paddingBottom = _b.paddingBottom;
            // compute the two edges of the active item for comparison, including parent padding
            var activeBottomEdge = activeTop + activeHeight + paddingBottom - parentOffsetTop;
            var activeTopEdge = activeTop - paddingTop - parentOffsetTop;
            if (activeBottomEdge >= parentScrollTop + parentHeight) {
                // offscreen bottom: align bottom of item with bottom of viewport
                this.itemsParentRef.scrollTop = activeBottomEdge + activeHeight - parentHeight;
            }
            else if (activeTopEdge <= parentScrollTop) {
                // offscreen top: align top of item with top of viewport
                this.itemsParentRef.scrollTop = activeTopEdge - activeHeight;
            }
        }
    };
    QueryList.prototype.setQuery = function (query, resetActiveItem) {
        if (resetActiveItem === void 0) { resetActiveItem = this.props.resetOnQuery; }
        this.shouldCheckActiveItemInViewport = true;
        if (query !== this.state.query) {
            core_1.Utils.safeInvoke(this.props.onQueryChange, query);
        }
        var filteredItems = getFilteredItems(query, this.props);
        this.setState({ filteredItems: filteredItems, query: query });
        // always reset active item if it's now filtered or disabled
        var activeIndex = this.getActiveIndex(filteredItems);
        if (resetActiveItem ||
            activeIndex < 0 ||
            isItemDisabled(this.state.activeItem, activeIndex, this.props.itemDisabled)) {
            this.setActiveItem(getFirstEnabledItem(filteredItems, this.props.itemDisabled));
        }
    };
    QueryList.prototype.getActiveElement = function () {
        if (this.itemsParentRef != null) {
            return this.itemsParentRef.children.item(this.getActiveIndex());
        }
        return undefined;
    };
    QueryList.prototype.getActiveIndex = function (items) {
        if (items === void 0) { items = this.state.filteredItems; }
        var activeItem = this.state.activeItem;
        // NOTE: this operation is O(n) so it should be avoided in render(). safe for events though.
        return activeItem == null ? -1 : items.indexOf(activeItem);
    };
    QueryList.prototype.getItemsParentPadding = function () {
        // assert ref exists because it was checked before calling
        var _a = getComputedStyle(this.itemsParentRef), paddingTop = _a.paddingTop, paddingBottom = _a.paddingBottom;
        return {
            paddingBottom: pxToNumber(paddingBottom),
            paddingTop: pxToNumber(paddingTop),
        };
    };
    /**
     * Get the next enabled item, moving in the given direction from the start
     * index. An `undefined` return value means no suitable item was found.
     * @param direction amount to move in each iteration, typically +/-1
     */
    QueryList.prototype.getNextActiveItem = function (direction, startIndex) {
        if (startIndex === void 0) { startIndex = this.getActiveIndex(); }
        return getFirstEnabledItem(this.state.filteredItems, this.props.itemDisabled, direction, startIndex);
    };
    QueryList.prototype.setActiveItem = function (activeItem) {
        if (this.props.activeItem === undefined) {
            // indicate that the active item may need to be scrolled into view after update.
            this.shouldCheckActiveItemInViewport = true;
            this.setState({ activeItem: activeItem });
        }
        core_1.Utils.safeInvoke(this.props.onActiveItemChange, activeItem);
    };
    QueryList.displayName = core_1.DISPLAYNAME_PREFIX + ".QueryList";
    QueryList.defaultProps = {
        resetOnQuery: true,
    };
    return QueryList;
}(React.Component));
exports.QueryList = QueryList;
function pxToNumber(value) {
    return value == null ? 0 : parseInt(value.slice(0, -2), 10);
}
function getFilteredItems(query, _a) {
    var items = _a.items, itemPredicate = _a.itemPredicate, itemListPredicate = _a.itemListPredicate;
    if (core_1.Utils.isFunction(itemListPredicate)) {
        // note that implementations can reorder the items here
        return itemListPredicate(query, items);
    }
    else if (core_1.Utils.isFunction(itemPredicate)) {
        return items.filter(function (item, index) { return itemPredicate(query, item, index); });
    }
    return items;
}
/** Wrap number around min/max values: if it exceeds one bound, return the other. */
function wrapNumber(value, min, max) {
    if (value < min) {
        return max;
    }
    else if (value > max) {
        return min;
    }
    return value;
}
function isItemDisabled(item, index, itemDisabled) {
    if (itemDisabled == null || item == null) {
        return false;
    }
    else if (core_1.Utils.isFunction(itemDisabled)) {
        return itemDisabled(item, index);
    }
    return !!item[itemDisabled];
}
/**
 * Get the next enabled item, moving in the given direction from the start
 * index. An `undefined` return value means no suitable item was found.
 * @param items the list of items
 * @param isItemDisabled callback to determine if a given item is disabled
 * @param direction amount to move in each iteration, typically +/-1
 * @param startIndex which index to begin moving from
 */
function getFirstEnabledItem(items, itemDisabled, direction, startIndex) {
    if (direction === void 0) { direction = 1; }
    if (startIndex === void 0) { startIndex = items.length - 1; }
    if (items.length === 0) {
        return null;
    }
    // remember where we started to prevent an infinite loop
    var index = startIndex;
    var maxIndex = items.length - 1;
    do {
        // find first non-disabled item
        index = wrapNumber(index + direction, 0, maxIndex);
        if (!isItemDisabled(items[index], index, itemDisabled)) {
            return items[index];
        }
    } while (index !== startIndex);
    return null;
}
exports.getFirstEnabledItem = getFirstEnabledItem;
//# sourceMappingURL=queryList.js.map