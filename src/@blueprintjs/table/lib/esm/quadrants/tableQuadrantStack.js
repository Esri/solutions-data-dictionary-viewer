/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { AbstractComponent, Utils as CoreUtils } from "@blueprintjs/core";
import * as React from "react";
import * as Classes from "../common/classes";
import * as ScrollUtils from "../common/internal/scrollUtils";
import { Utils } from "../common/utils";
import { QuadrantType, TableQuadrant } from "./tableQuadrant";
import { TableQuadrantStackCache } from "./tableQuadrantStackCache";
// when there are no column headers, the header and menu element will
// confusingly collapse to zero height unless we establish this default.
var DEFAULT_COLUMN_HEADER_HEIGHT = 30;
// the debounce delay for updating the view on scroll. elements will be resized
// and rejiggered once scroll has ceased for at least this long, but not before.
var DEFAULT_VIEW_SYNC_DELAY = 500;
// if there are no frozen rows or columns, we still want the quadrant to be 1px
// bigger to reveal the header border. this border leaks into the cell grid to
// ensure that selection overlay borders (e.g.) will be perfectly flush with it.
var QUADRANT_MIN_SIZE = 1;
// a list of props that trigger layout changes. when these props change,
// quadrant views need to be explicitly resynchronized.
var SYNC_TRIGGER_PROP_KEYS = [
    "enableRowHeader",
    "loadingOptions",
    "numFrozenColumns",
    "numFrozenRows",
    "numColumns",
    "numRows",
    "enableColumnInteractionBar",
];
var TableQuadrantStack = /** @class */ (function (_super) {
    tslib_1.__extends(TableQuadrantStack, _super);
    // Public
    // ======
    function TableQuadrantStack(props, context) {
        var _this = _super.call(this, props, context) || this;
        // Instance variables
        // ==================
        _this.quadrantRefs = (_a = {},
            _a[QuadrantType.MAIN] = {},
            _a[QuadrantType.TOP] = {},
            _a[QuadrantType.LEFT] = {},
            _a[QuadrantType.TOP_LEFT] = {},
            _a);
        _this.quadrantRefHandlers = (_b = {},
            _b[QuadrantType.MAIN] = _this.generateQuadrantRefHandlers(QuadrantType.MAIN),
            _b[QuadrantType.TOP] = _this.generateQuadrantRefHandlers(QuadrantType.TOP),
            _b[QuadrantType.LEFT] = _this.generateQuadrantRefHandlers(QuadrantType.LEFT),
            _b[QuadrantType.TOP_LEFT] = _this.generateQuadrantRefHandlers(QuadrantType.TOP_LEFT),
            _b);
        // this flag helps us avoid redundant work in the MAIN quadrant's onScroll callback, if the
        // callback was triggered from a manual scrollTop/scrollLeft update within an onWheel.
        _this.wasMainQuadrantScrollTriggeredByWheelEvent = false;
        // Quadrant-specific renderers
        // ===========================
        // Menu
        _this.renderMainQuadrantMenu = function () {
            return CoreUtils.safeInvoke(_this.props.menuRenderer, _this.quadrantRefHandlers[QuadrantType.MAIN].menu);
        };
        _this.renderTopQuadrantMenu = function () {
            return CoreUtils.safeInvoke(_this.props.menuRenderer, _this.quadrantRefHandlers[QuadrantType.TOP].menu);
        };
        _this.renderLeftQuadrantMenu = function () {
            return CoreUtils.safeInvoke(_this.props.menuRenderer, _this.quadrantRefHandlers[QuadrantType.LEFT].menu);
        };
        _this.renderTopLeftQuadrantMenu = function () {
            return CoreUtils.safeInvoke(_this.props.menuRenderer, _this.quadrantRefHandlers[QuadrantType.TOP_LEFT].menu);
        };
        // Column header
        _this.renderMainQuadrantColumnHeader = function (showFrozenColumnsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.MAIN].columnHeader;
            var resizeHandler = _this.handleColumnResizeGuideMain;
            var reorderingHandler = _this.handleColumnsReordering;
            return CoreUtils.safeInvoke(_this.props.columnHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
        };
        _this.renderTopQuadrantColumnHeader = function (showFrozenColumnsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.TOP].columnHeader;
            var resizeHandler = _this.handleColumnResizeGuideTop;
            var reorderingHandler = _this.handleColumnsReordering;
            return CoreUtils.safeInvoke(_this.props.columnHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
        };
        _this.renderLeftQuadrantColumnHeader = function (showFrozenColumnsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.LEFT].columnHeader;
            var resizeHandler = _this.handleColumnResizeGuideLeft;
            var reorderingHandler = _this.handleColumnsReordering;
            return CoreUtils.safeInvoke(_this.props.columnHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
        };
        _this.renderTopLeftQuadrantColumnHeader = function (showFrozenColumnsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.TOP_LEFT].columnHeader;
            var resizeHandler = _this.handleColumnResizeGuideTopLeft;
            var reorderingHandler = _this.handleColumnsReordering;
            return CoreUtils.safeInvoke(_this.props.columnHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
        };
        // Row header
        _this.renderMainQuadrantRowHeader = function (showFrozenRowsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.MAIN].rowHeader;
            var resizeHandler = _this.handleRowResizeGuideMain;
            var reorderingHandler = _this.handleRowsReordering;
            return CoreUtils.safeInvoke(_this.props.rowHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenRowsOnly);
        };
        _this.renderTopQuadrantRowHeader = function (showFrozenRowsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.TOP].rowHeader;
            var resizeHandler = _this.handleRowResizeGuideTop;
            var reorderingHandler = _this.handleRowsReordering;
            return CoreUtils.safeInvoke(_this.props.rowHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenRowsOnly);
        };
        _this.renderLeftQuadrantRowHeader = function (showFrozenRowsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.LEFT].rowHeader;
            var resizeHandler = _this.handleRowResizeGuideLeft;
            var reorderingHandler = _this.handleRowsReordering;
            return CoreUtils.safeInvoke(_this.props.rowHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenRowsOnly);
        };
        _this.renderTopLeftQuadrantRowHeader = function (showFrozenRowsOnly) {
            var refHandler = _this.quadrantRefHandlers[QuadrantType.TOP_LEFT].rowHeader;
            var resizeHandler = _this.handleRowResizeGuideTopLeft;
            var reorderingHandler = _this.handleRowsReordering;
            return CoreUtils.safeInvoke(_this.props.rowHeaderCellRenderer, refHandler, resizeHandler, reorderingHandler, showFrozenRowsOnly);
        };
        // Event handlers
        // ==============
        // Scrolling
        // ---------
        _this.handleMainQuadrantScroll = function (event) {
            if (_this.wasMainQuadrantScrollTriggeredByWheelEvent) {
                _this.wasMainQuadrantScrollTriggeredByWheelEvent = false;
                return;
            }
            // invoke onScroll - which may read current scroll position - before
            // forcing a reflow with upcoming .scroll{Top,Left} setters.
            CoreUtils.safeInvoke(_this.props.onScroll, event);
            // batch DOM reads here. note that onScroll events don't include deltas
            // like onWheel events do, so we have to read from the DOM directly.
            var mainScrollContainer = _this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
            var nextScrollLeft = mainScrollContainer.scrollLeft;
            var nextScrollTop = mainScrollContainer.scrollTop;
            // with the "scroll" event, scroll offsets are updated prior to the
            // event's firing, so no explicit update needed.
            _this.handleScrollOffsetChange("scrollLeft", nextScrollLeft);
            _this.handleScrollOffsetChange("scrollTop", nextScrollTop);
            // sync less important view stuff when scrolling/wheeling stops.
            _this.syncQuadrantViewsDebounced();
        };
        _this.handleWheel = function (event) {
            // again, let the listener read the current scroll position before we
            // force a reflow by resizing or repositioning stuff.
            CoreUtils.safeInvoke(_this.props.onScroll, event);
            // this helper performs DOM reads, so do them together before the writes below.
            var nextScrollLeft = _this.getNextScrollOffset("horizontal", event.deltaX);
            var nextScrollTop = _this.getNextScrollOffset("vertical", event.deltaY);
            // update this flag before updating the main quadrant scroll offsets,
            // since we need this set before onScroll fires.
            if (nextScrollLeft != null || nextScrollTop != null) {
                _this.wasMainQuadrantScrollTriggeredByWheelEvent = true;
            }
            // manually update the affected quadrant's scroll position to make sure
            // it stays perfectly in sync with dependent quadrants in each frame.
            // note: these DOM writes are batched together after the reads above.
            _this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollLeft = nextScrollLeft;
            _this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollTop = nextScrollTop;
            _this.handleScrollOffsetChange("scrollLeft", nextScrollLeft);
            _this.handleScrollOffsetChange("scrollTop", nextScrollTop);
            // sync less important view stuff when scrolling/wheeling stops.
            _this.syncQuadrantViewsDebounced();
        };
        _this.getNextScrollOffset = function (direction, delta) {
            var _a = _this.props, grid = _a.grid, isHorizontalScrollDisabled = _a.isHorizontalScrollDisabled, isVerticalScrollDisabled = _a.isVerticalScrollDisabled;
            var isHorizontal = direction === "horizontal";
            var scrollKey = isHorizontal ? "scrollLeft" : "scrollTop";
            var isScrollDisabled = isHorizontal ? isHorizontalScrollDisabled : isVerticalScrollDisabled;
            if (isScrollDisabled) {
                return undefined;
            }
            // measure client size on the first event of the current wheel gesture,
            // then grab cached values on successive events to eliminate DOM reads.
            // requires clearing the cached values in the debounced view-update at
            // the end of the wheel event.
            // ASSUMPTION: the client size won't change during the wheel event.
            var clientSize = isHorizontal
                ? _this.cache.getScrollContainerClientWidth()
                : _this.cache.getScrollContainerClientHeight();
            if (clientSize == null) {
                // should trigger only on the first scroll of the wheel gesture.
                // will save client width and height sizes in the cache.
                clientSize = _this.updateScrollContainerClientSize(isHorizontal);
            }
            // by now, the client width and height will have been saved in cache, so
            // they can't be nully anymore. also, events can only happen after
            // mount, so we're guaranteed to have measured the header sizes in
            // syncQuadrantViews() by now too, as it's invoked on mount.
            var containerSize = isHorizontal
                ? _this.cache.getScrollContainerClientWidth() - _this.cache.getRowHeaderWidth()
                : _this.cache.getScrollContainerClientHeight() - _this.cache.getColumnHeaderHeight();
            var gridSize = isHorizontal ? grid.getWidth() : grid.getHeight();
            var maxScrollOffset = Math.max(0, gridSize - containerSize);
            var currScrollOffset = _this.cache.getScrollOffset(scrollKey);
            var nextScrollOffset = CoreUtils.clamp(currScrollOffset + delta, 0, maxScrollOffset);
            return nextScrollOffset;
        };
        // Resizing
        // --------
        // Columns
        _this.handleColumnResizeGuideMain = function (verticalGuides) {
            _this.invokeColumnResizeHandler(verticalGuides, QuadrantType.MAIN);
        };
        _this.handleColumnResizeGuideTop = function (verticalGuides) {
            _this.invokeColumnResizeHandler(verticalGuides, QuadrantType.TOP);
        };
        _this.handleColumnResizeGuideLeft = function (verticalGuides) {
            _this.invokeColumnResizeHandler(verticalGuides, QuadrantType.LEFT);
        };
        _this.handleColumnResizeGuideTopLeft = function (verticalGuides) {
            _this.invokeColumnResizeHandler(verticalGuides, QuadrantType.TOP_LEFT);
        };
        _this.invokeColumnResizeHandler = function (verticalGuides, quadrantType) {
            var adjustedGuides = _this.adjustVerticalGuides(verticalGuides, quadrantType);
            CoreUtils.safeInvoke(_this.props.handleColumnResizeGuide, adjustedGuides);
        };
        // Rows
        _this.handleRowResizeGuideMain = function (horizontalGuides) {
            _this.invokeRowResizeHandler(horizontalGuides, QuadrantType.MAIN);
        };
        _this.handleRowResizeGuideTop = function (horizontalGuides) {
            _this.invokeRowResizeHandler(horizontalGuides, QuadrantType.TOP);
        };
        _this.handleRowResizeGuideLeft = function (horizontalGuides) {
            _this.invokeRowResizeHandler(horizontalGuides, QuadrantType.LEFT);
        };
        _this.handleRowResizeGuideTopLeft = function (horizontalGuides) {
            _this.invokeRowResizeHandler(horizontalGuides, QuadrantType.TOP_LEFT);
        };
        _this.invokeRowResizeHandler = function (horizontalGuides, quadrantType) {
            var adjustedGuides = _this.adjustHorizontalGuides(horizontalGuides, quadrantType);
            CoreUtils.safeInvoke(_this.props.handleRowResizeGuide, adjustedGuides);
        };
        // Reordering
        // ----------
        // Columns
        _this.handleColumnsReordering = function (oldIndex, newIndex, length) {
            var guideIndex = Utils.reorderedIndexToGuideIndex(oldIndex, newIndex, length);
            var leftOffset = _this.props.grid.getCumulativeWidthBefore(guideIndex);
            var quadrantType = guideIndex <= _this.props.numFrozenColumns ? QuadrantType.TOP_LEFT : QuadrantType.TOP;
            var verticalGuides = _this.adjustVerticalGuides([leftOffset], quadrantType);
            CoreUtils.safeInvoke(_this.props.handleColumnsReordering, verticalGuides);
        };
        // Rows
        _this.handleRowsReordering = function (oldIndex, newIndex, length) {
            var guideIndex = Utils.reorderedIndexToGuideIndex(oldIndex, newIndex, length);
            var topOffset = _this.props.grid.getCumulativeHeightBefore(guideIndex);
            var quadrantType = guideIndex <= _this.props.numFrozenRows ? QuadrantType.TOP_LEFT : QuadrantType.LEFT;
            var horizontalGuides = _this.adjustHorizontalGuides([topOffset], quadrantType);
            CoreUtils.safeInvoke(_this.props.handleRowsReordering, horizontalGuides);
        };
        // Size syncing
        // ============
        _this.syncQuadrantViewsDebounced = function () {
            var viewSyncDelay = _this.props.viewSyncDelay;
            if (viewSyncDelay < 0) {
                // update synchronously
                _this.syncQuadrantViews();
            }
            else {
                // update asynchronously after a debounced delay
                clearInterval(_this.debouncedViewSyncInterval);
                _this.debouncedViewSyncInterval = window.setTimeout(_this.syncQuadrantViews, viewSyncDelay);
            }
        };
        _this.syncQuadrantViews = function () {
            var mainRefs = _this.quadrantRefs[QuadrantType.MAIN];
            var mainScrollContainer = mainRefs.scrollContainer;
            //
            // Reads (batched to avoid DOM thrashing)
            //
            var rowHeaderWidth = _this.measureDesiredRowHeaderWidth();
            var columnHeaderHeight = _this.measureDesiredColumnHeaderHeight();
            var leftQuadrantGridWidth = _this.getSecondaryQuadrantGridSize("width");
            var topQuadrantGridHeight = _this.getSecondaryQuadrantGridSize("height");
            var leftQuadrantWidth = rowHeaderWidth + leftQuadrantGridWidth;
            var topQuadrantHeight = columnHeaderHeight + topQuadrantGridHeight;
            var rightScrollBarWidth = ScrollUtils.measureScrollBarThickness(mainScrollContainer, "vertical");
            var bottomScrollBarHeight = ScrollUtils.measureScrollBarThickness(mainScrollContainer, "horizontal");
            // ensure neither of these measurements confusingly clamps to zero height.
            var adjustedColumnHeaderHeight = _this.maybeIncreaseToDefaultColumnHeaderHeight(columnHeaderHeight);
            var adjustedTopQuadrantHeight = _this.maybeIncreaseToDefaultColumnHeaderHeight(topQuadrantHeight);
            // Update cache: let's read now whatever values we might need later.
            // prevents unnecessary reflows in the future.
            _this.cache.setRowHeaderWidth(rowHeaderWidth);
            _this.cache.setColumnHeaderHeight(columnHeaderHeight);
            // ...however, we also clear the cached client size, so we can read it
            // again when a new scroll begins. not safe to assume this won't change.
            // TODO: maybe use the ResizeSensor?
            _this.cache.setScrollContainerClientWidth(undefined);
            _this.cache.setScrollContainerClientHeight(undefined);
            //
            // Writes (batched to avoid DOM thrashing)
            //
            // Quadrant-size sync'ing: make the quadrants precisely as big as they
            // need to be to fit their variable-sized headers and/or frozen areas.
            _this.maybesSetQuadrantRowHeaderSizes(rowHeaderWidth);
            _this.maybeSetQuadrantMenuElementSizes(rowHeaderWidth, adjustedColumnHeaderHeight);
            _this.maybeSetQuadrantSizes(leftQuadrantWidth, adjustedTopQuadrantHeight);
            // Scrollbar clearance: tweak the quadrant bottom/right offsets to
            // reveal the MAIN-quadrant scrollbars if they're visible.
            _this.maybeSetQuadrantPositionOffset(QuadrantType.TOP, "right", rightScrollBarWidth);
            _this.maybeSetQuadrantPositionOffset(QuadrantType.LEFT, "bottom", bottomScrollBarHeight);
            // Scroll syncing: sync the scroll offsets of quadrants that may or may
            // not have been around prior to this update.
            _this.maybeSetQuadrantScrollOffset(QuadrantType.LEFT, "scrollTop");
            _this.maybeSetQuadrantScrollOffset(QuadrantType.TOP, "scrollLeft");
        };
        _this.maybeSetQuadrantSizes = function (width, height) {
            _this.maybesSetQuadrantSize(QuadrantType.LEFT, "width", width);
            _this.maybesSetQuadrantSize(QuadrantType.TOP, "height", height);
            _this.maybesSetQuadrantSize(QuadrantType.TOP_LEFT, "width", width);
            _this.maybesSetQuadrantSize(QuadrantType.TOP_LEFT, "height", height);
        };
        _this.maybesSetQuadrantSize = function (quadrantType, dimension, value) {
            var quadrant = _this.quadrantRefs[quadrantType].quadrant;
            if (quadrant != null) {
                quadrant.style[dimension] = value + "px";
            }
        };
        _this.maybeSetQuadrantPositionOffset = function (quadrantType, side, value) {
            var quadrant = _this.quadrantRefs[quadrantType].quadrant;
            if (quadrant != null) {
                quadrant.style[side] = value + "px";
            }
        };
        _this.maybesSetQuadrantRowHeaderSizes = function (width) {
            _this.maybeSetQuadrantRowHeaderSize(QuadrantType.MAIN, width);
            _this.maybeSetQuadrantRowHeaderSize(QuadrantType.TOP, width);
            _this.maybeSetQuadrantRowHeaderSize(QuadrantType.LEFT, width);
            _this.maybeSetQuadrantRowHeaderSize(QuadrantType.TOP_LEFT, width);
        };
        _this.maybeSetQuadrantRowHeaderSize = function (quadrantType, width) {
            var rowHeader = _this.quadrantRefs[quadrantType].rowHeader;
            if (rowHeader != null) {
                rowHeader.style.width = width + "px";
            }
        };
        _this.maybeSetQuadrantMenuElementSizes = function (width, height) {
            _this.maybeSetQuadrantMenuElementSize(QuadrantType.MAIN, width, height);
            _this.maybeSetQuadrantMenuElementSize(QuadrantType.TOP, width, height);
            _this.maybeSetQuadrantMenuElementSize(QuadrantType.LEFT, width, height);
            _this.maybeSetQuadrantMenuElementSize(QuadrantType.TOP_LEFT, width, height);
        };
        _this.maybeSetQuadrantMenuElementSize = function (quadrantType, width, height) {
            var menu = _this.quadrantRefs[quadrantType].menu;
            if (menu != null) {
                menu.style.width = width + "px";
                menu.style.height = height + "px";
            }
        };
        _this.maybeSetQuadrantScrollOffset = function (quadrantType, scrollKey, newOffset) {
            var scrollContainer = _this.quadrantRefs[quadrantType].scrollContainer;
            var scrollOffset = newOffset != null ? newOffset : _this.cache.getScrollOffset(scrollKey);
            if (scrollContainer != null) {
                scrollContainer[scrollKey] = scrollOffset;
            }
        };
        _this.handleScrollOffsetChange = function (scrollKey, offset) {
            _this.cache.setScrollOffset(scrollKey, offset);
            var dependentQuadrantType = scrollKey === "scrollLeft" ? QuadrantType.TOP : QuadrantType.LEFT;
            _this.maybeSetQuadrantScrollOffset(dependentQuadrantType, scrollKey);
        };
        // callbacks trigger too frequently unless we throttle scroll and wheel
        // events. declare these functions on the component instance since
        // they're stateful.
        _this.throttledHandleMainQuadrantScroll = CoreUtils.throttleReactEventCallback(_this.handleMainQuadrantScroll);
        _this.throttledHandleWheel = CoreUtils.throttleReactEventCallback(_this.handleWheel);
        _this.cache = new TableQuadrantStackCache();
        return _this;
        var _a, _b;
    }
    /**
     * Scroll the main quadrant to the specified scroll offset, keeping all other quadrants in sync.
     */
    TableQuadrantStack.prototype.scrollToPosition = function (scrollLeft, scrollTop) {
        var scrollContainer = this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
        this.wasMainQuadrantScrollTriggeredByWheelEvent = false;
        // this will trigger the main quadrant's scroll callback below
        scrollContainer.scrollLeft = scrollLeft;
        scrollContainer.scrollTop = scrollTop;
        this.syncQuadrantViews();
    };
    /**
     * Synchronizes quadrant sizes and scroll offsets based on the current
     * column, row, and header sizes. Useful for correcting quadrant sizes after
     * explicitly resizing columns and rows, for instance.
     *
     * Invoking this method imperatively is cheaper than providing columnWidths
     * or rowHeights array props to TableQuadrantStack and forcing it to run
     * expensive array diffs upon every update.
     */
    TableQuadrantStack.prototype.synchronizeQuadrantViews = function () {
        this.syncQuadrantViews();
    };
    TableQuadrantStack.prototype.componentDidMount = function () {
        this.emitRefs();
        this.syncQuadrantViews();
    };
    TableQuadrantStack.prototype.componentDidUpdate = function (prevProps) {
        // sync'ing quadrant views triggers expensive reflows, so we only call
        // it when layout-affecting props change.
        if (!CoreUtils.shallowCompareKeys(this.props, prevProps, { include: SYNC_TRIGGER_PROP_KEYS })) {
            this.emitRefs();
            this.syncQuadrantViews();
        }
    };
    TableQuadrantStack.prototype.render = function () {
        var _a = this.props, grid = _a.grid, enableRowHeader = _a.enableRowHeader, bodyRenderer = _a.bodyRenderer, throttleScrolling = _a.throttleScrolling;
        // use the more generic "scroll" event for the main quadrant to capture
        // *both* scrollbar interactions and trackpad/mousewheel gestures.
        var onMainQuadrantScroll = throttleScrolling
            ? this.throttledHandleMainQuadrantScroll
            : this.handleMainQuadrantScroll;
        var onWheel = throttleScrolling ? this.throttledHandleWheel : this.handleWheel;
        var baseProps = {
            bodyRenderer: bodyRenderer,
            enableRowHeader: enableRowHeader,
            grid: grid,
            onWheel: onWheel,
        };
        var shouldRenderLeftQuadrants = this.shouldRenderLeftQuadrants();
        var maybeLeftQuadrant = shouldRenderLeftQuadrants ? (React.createElement(TableQuadrant, tslib_1.__assign({}, baseProps, { quadrantRef: this.quadrantRefHandlers[QuadrantType.LEFT].quadrant, quadrantType: QuadrantType.LEFT, columnHeaderCellRenderer: this.renderLeftQuadrantColumnHeader, menuRenderer: this.renderLeftQuadrantMenu, rowHeaderCellRenderer: this.renderLeftQuadrantRowHeader, scrollContainerRef: this.quadrantRefHandlers[QuadrantType.LEFT].scrollContainer }))) : (undefined);
        var maybeTopLeftQuadrant = shouldRenderLeftQuadrants ? (React.createElement(TableQuadrant, tslib_1.__assign({}, baseProps, { quadrantRef: this.quadrantRefHandlers[QuadrantType.TOP_LEFT].quadrant, quadrantType: QuadrantType.TOP_LEFT, columnHeaderCellRenderer: this.renderTopLeftQuadrantColumnHeader, menuRenderer: this.renderTopLeftQuadrantMenu, rowHeaderCellRenderer: this.renderTopLeftQuadrantRowHeader, scrollContainerRef: this.quadrantRefHandlers[QuadrantType.TOP_LEFT].scrollContainer }))) : (undefined);
        return (React.createElement("div", { className: Classes.TABLE_QUADRANT_STACK },
            React.createElement(TableQuadrant, tslib_1.__assign({}, baseProps, { bodyRef: this.props.bodyRef, onScroll: onMainQuadrantScroll, quadrantRef: this.quadrantRefHandlers[QuadrantType.MAIN].quadrant, quadrantType: QuadrantType.MAIN, columnHeaderCellRenderer: this.renderMainQuadrantColumnHeader, menuRenderer: this.renderMainQuadrantMenu, rowHeaderCellRenderer: this.renderMainQuadrantRowHeader, scrollContainerRef: this.quadrantRefHandlers[QuadrantType.MAIN].scrollContainer })),
            React.createElement(TableQuadrant, tslib_1.__assign({}, baseProps, { quadrantRef: this.quadrantRefHandlers[QuadrantType.TOP].quadrant, quadrantType: QuadrantType.TOP, columnHeaderCellRenderer: this.renderTopQuadrantColumnHeader, menuRenderer: this.renderTopQuadrantMenu, rowHeaderCellRenderer: this.renderTopQuadrantRowHeader, scrollContainerRef: this.quadrantRefHandlers[QuadrantType.TOP].scrollContainer })),
            maybeLeftQuadrant,
            maybeTopLeftQuadrant));
    };
    // Ref handlers
    // ============
    TableQuadrantStack.prototype.generateQuadrantRefHandlers = function (quadrantType) {
        var _this = this;
        var reducer = function (agg, key) {
            agg[key] = function (ref) { return (_this.quadrantRefs[quadrantType][key] = ref); };
            return agg;
        };
        return ["columnHeader", "menu", "quadrant", "rowHeader", "scrollContainer"].reduce(reducer, {});
    };
    // Emitters
    // ========
    TableQuadrantStack.prototype.emitRefs = function () {
        CoreUtils.safeInvoke(this.props.quadrantRef, this.quadrantRefs[QuadrantType.MAIN].quadrant);
        CoreUtils.safeInvoke(this.props.rowHeaderRef, this.quadrantRefs[QuadrantType.MAIN].rowHeader);
        CoreUtils.safeInvoke(this.props.columnHeaderRef, this.quadrantRefs[QuadrantType.MAIN].columnHeader);
        CoreUtils.safeInvoke(this.props.scrollContainerRef, this.quadrantRefs[QuadrantType.MAIN].scrollContainer);
    };
    // this function is named 'update' instead of 'set', because a 'set'
    // function typically takes the new value as a parameter. we avoid that to
    // keep the isHorizontal logic tree contained within this function.
    TableQuadrantStack.prototype.updateScrollContainerClientSize = function (isHorizontal) {
        var mainScrollContainer = this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
        if (isHorizontal) {
            this.cache.setScrollContainerClientWidth(mainScrollContainer.clientWidth);
            return this.cache.getScrollContainerClientWidth();
        }
        else {
            this.cache.setScrollContainerClientHeight(mainScrollContainer.clientHeight);
            return this.cache.getScrollContainerClientHeight();
        }
    };
    TableQuadrantStack.prototype.maybeIncreaseToDefaultColumnHeaderHeight = function (height) {
        return height <= QUADRANT_MIN_SIZE ? DEFAULT_COLUMN_HEADER_HEIGHT : height;
    };
    // Helpers
    // =======
    /**
     * Returns the width or height of *only the grid* in the secondary quadrants
     * (TOP, LEFT, TOP_LEFT), based on the number of frozen rows and columns.
     */
    TableQuadrantStack.prototype.getSecondaryQuadrantGridSize = function (dimension) {
        var _a = this.props, grid = _a.grid, numFrozenColumns = _a.numFrozenColumns, numFrozenRows = _a.numFrozenRows;
        var numFrozen = dimension === "width" ? numFrozenColumns : numFrozenRows;
        var getterFn = dimension === "width" ? grid.getCumulativeWidthAt : grid.getCumulativeHeightAt;
        // both getter functions do O(1) lookups.
        return numFrozen > 0 ? getterFn(numFrozen - 1) : QUADRANT_MIN_SIZE;
    };
    /**
     * Measures the desired width of the row header based on its tallest
     * contents.
     */
    TableQuadrantStack.prototype.measureDesiredRowHeaderWidth = function () {
        // the MAIN row header serves as the source of truth
        var mainRowHeader = this.quadrantRefs[QuadrantType.MAIN].rowHeader;
        if (mainRowHeader == null) {
            return 0;
        }
        else {
            // (alas, we must force a reflow to measure the row header's "desired" width)
            mainRowHeader.style.width = "auto";
            var desiredRowHeaderWidth = mainRowHeader.clientWidth;
            return desiredRowHeaderWidth;
        }
    };
    /**
     * Measures the desired height of the column header based on its tallest
     * contents.
     */
    TableQuadrantStack.prototype.measureDesiredColumnHeaderHeight = function () {
        // unlike the row headers, the column headers are in a display-flex
        // layout and are not actually bound by any fixed `height` that we set,
        // so they'll grow freely to their necessary size. makes measuring easy!
        var mainColumnHeader = this.quadrantRefs[QuadrantType.MAIN].columnHeader;
        return mainColumnHeader == null ? 0 : mainColumnHeader.clientHeight;
    };
    TableQuadrantStack.prototype.shouldRenderLeftQuadrants = function (props) {
        if (props === void 0) { props = this.props; }
        var enableRowHeader = props.enableRowHeader, numFrozenColumns = props.numFrozenColumns;
        return enableRowHeader || (numFrozenColumns != null && numFrozenColumns > 0);
    };
    // Resizing
    TableQuadrantStack.prototype.adjustVerticalGuides = function (verticalGuides, quadrantType) {
        var isFrozenQuadrant = quadrantType === QuadrantType.LEFT || quadrantType === QuadrantType.TOP_LEFT;
        var scrollAmount = isFrozenQuadrant ? 0 : this.cache.getScrollOffset("scrollLeft");
        var rowHeaderWidth = this.cache.getRowHeaderWidth();
        var adjustedVerticalGuides = verticalGuides != null
            ? verticalGuides.map(function (verticalGuide) { return verticalGuide - scrollAmount + rowHeaderWidth; })
            : verticalGuides;
        return adjustedVerticalGuides;
    };
    TableQuadrantStack.prototype.adjustHorizontalGuides = function (horizontalGuides, quadrantType) {
        var isFrozenQuadrant = quadrantType === QuadrantType.TOP || quadrantType === QuadrantType.TOP_LEFT;
        var scrollAmount = isFrozenQuadrant ? 0 : this.cache.getScrollOffset("scrollTop");
        var columnHeaderHeight = this.cache.getColumnHeaderHeight();
        var adjustedHorizontalGuides = horizontalGuides != null
            ? horizontalGuides.map(function (horizontalGuide) { return horizontalGuide - scrollAmount + columnHeaderHeight; })
            : horizontalGuides;
        return adjustedHorizontalGuides;
    };
    // we want the user to explicitly pass a quadrantType. define defaultProps as a Partial to avoid
    // declaring that and other required props here.
    TableQuadrantStack.defaultProps = {
        enableColumnInteractionBar: undefined,
        enableRowHeader: true,
        isHorizontalScrollDisabled: false,
        isVerticalScrollDisabled: false,
        throttleScrolling: true,
        viewSyncDelay: DEFAULT_VIEW_SYNC_DELAY,
    };
    return TableQuadrantStack;
}(AbstractComponent));
export { TableQuadrantStack };
//# sourceMappingURL=tableQuadrantStack.js.map