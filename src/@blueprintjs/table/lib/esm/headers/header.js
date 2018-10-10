/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Icon, Utils as CoreUtils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
import { DragEvents } from "../interactions/dragEvents";
import { DragReorderable } from "../interactions/reorderable";
import { Resizable } from "../interactions/resizable";
import { DragSelectable } from "../interactions/selectable";
import { RegionCardinality, Regions } from "../regions";
var SHALLOW_COMPARE_PROP_KEYS_BLACKLIST = ["focusedCell", "selectedRegions"];
var Header = /** @class */ (function (_super) {
    tslib_1.__extends(Header, _super);
    function Header(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.convertEventToIndex = function (event) {
            var coord = _this.props.getMouseCoordinate(event);
            return _this.props.convertPointToIndex(coord);
        };
        _this.locateClick = function (event) {
            _this.activationIndex = _this.convertEventToIndex(event);
            return _this.props.toRegion(_this.activationIndex);
        };
        _this.locateDragForSelection = function (_event, coords, returnEndOnly) {
            if (returnEndOnly === void 0) { returnEndOnly = false; }
            var coord = _this.props.getDragCoordinate(coords.current);
            var indexStart = _this.activationIndex;
            var indexEnd = _this.props.convertPointToIndex(coord);
            return returnEndOnly ? _this.props.toRegion(indexEnd) : _this.props.toRegion(indexStart, indexEnd);
        };
        _this.locateDragForReordering = function (_event, coords) {
            var coord = _this.props.getDragCoordinate(coords.current);
            var guideIndex = _this.props.convertPointToIndex(coord, true);
            return guideIndex < 0 ? undefined : guideIndex;
        };
        _this.renderCells = function () {
            var _a = _this.props, indexStart = _a.indexStart, indexEnd = _a.indexEnd;
            var cells = [];
            for (var index = indexStart; index <= indexEnd; index++) {
                cells.push(_this.renderNewCell(index));
            }
            return cells;
        };
        _this.renderNewCell = function (index) {
            var extremaClasses = _this.props.getCellExtremaClasses(index, _this.props.indexEnd);
            var renderer = _this.props.isGhostIndex(index) ? _this.props.ghostCellRenderer : _this.renderCell;
            return renderer(index, extremaClasses);
        };
        _this.renderCell = function (index, extremaClasses) {
            var _a = _this.props, getIndexClass = _a.getIndexClass, selectedRegions = _a.selectedRegions;
            var cell = _this.props.headerCellRenderer(index);
            var isLoading = cell.props.loading != null ? cell.props.loading : _this.props.loading;
            var isSelected = _this.props.isCellSelected(index);
            var isEntireCellTargetReorderable = _this.isEntireCellTargetReorderable(index);
            var className = classNames(extremaClasses, (_b = {},
                _b[Classes.TABLE_HEADER_REORDERABLE] = isEntireCellTargetReorderable,
                _b), _this.props.getCellIndexClass(index), cell.props.className);
            var cellProps = (_c = {
                    className: className,
                    index: index
                },
                _c[_this.props.headerCellIsSelectedPropName] = isSelected,
                _c[_this.props.headerCellIsReorderablePropName] = isEntireCellTargetReorderable,
                _c.loading = isLoading,
                _c.reorderHandle = _this.maybeRenderReorderHandle(index),
                _c);
            var modifiedHandleSizeChanged = function (size) { return _this.props.handleSizeChanged(index, size); };
            var modifiedHandleResizeEnd = function (size) { return _this.props.handleResizeEnd(index, size); };
            var modifiedHandleResizeHandleDoubleClick = function () {
                return CoreUtils.safeInvoke(_this.props.handleResizeDoubleClick, index);
            };
            var baseChildren = (React.createElement(DragSelectable, { enableMultipleSelection: _this.props.enableMultipleSelection, disabled: _this.isDragSelectableDisabled, focusedCell: _this.props.focusedCell, ignoredSelectors: ["." + Classes.TABLE_REORDER_HANDLE_TARGET], key: getIndexClass(index), locateClick: _this.locateClick, locateDrag: _this.locateDragForSelection, onFocusedCell: _this.props.onFocusedCell, onSelection: _this.handleDragSelectableSelection, onSelectionEnd: _this.handleDragSelectableSelectionEnd, selectedRegions: selectedRegions, selectedRegionTransform: _this.props.selectedRegionTransform },
                React.createElement(Resizable, { isResizable: _this.props.isResizable, maxSize: _this.props.maxSize, minSize: _this.props.minSize, onDoubleClick: modifiedHandleResizeHandleDoubleClick, onLayoutLock: _this.props.onLayoutLock, onResizeEnd: modifiedHandleResizeEnd, onSizeChanged: modifiedHandleSizeChanged, orientation: _this.props.resizeOrientation, size: _this.props.getCellSize(index) }, React.cloneElement(cell, cellProps))));
            return _this.isReorderHandleEnabled()
                ? baseChildren // reordering will be handled by interacting with the reorder handle
                : _this.wrapInDragReorderable(index, baseChildren, _this.isDragReorderableDisabled);
            var _b, _c;
        };
        _this.handleDragSelectableSelection = function (selectedRegions) {
            _this.props.onSelection(selectedRegions);
            _this.setState({ hasValidSelection: false });
        };
        _this.handleDragSelectableSelectionEnd = function () {
            _this.activationIndex = null; // not strictly required, but good practice
            _this.setState({ hasValidSelection: true });
        };
        _this.isDragSelectableDisabled = function (event) {
            if (DragEvents.isAdditive(event)) {
                // if the meta/ctrl key was pressed, we want to forcefully ignore
                // reordering interactions and prioritize drag-selection
                // interactions (e.g. to make it possible to deselect a row).
                return false;
            }
            var cellIndex = _this.convertEventToIndex(event);
            return _this.isEntireCellTargetReorderable(cellIndex);
        };
        _this.isDragReorderableDisabled = function (event) {
            var isSelectionEnabled = !_this.isDragSelectableDisabled(event);
            if (isSelectionEnabled) {
                // if drag-selection is enabled, we don't want drag-reordering
                // interactions to compete. otherwise, a mouse-drag might both expand a
                // selection and reorder the same selection simultaneously - confusing!
                return true;
            }
            var cellIndex = _this.convertEventToIndex(event);
            return !_this.isEntireCellTargetReorderable(cellIndex);
        };
        _this.isEntireCellTargetReorderable = function (index) {
            var selectedRegions = _this.props.selectedRegions;
            // although reordering may be generally enabled for this row/column (via props.isReorderable), the
            // row/column shouldn't actually become reorderable from a user perspective until a few other
            // conditions are true:
            return (_this.props.isReorderable &&
                // the row/column should be the only selection (or it should be part of the only selection),
                // because reordering multiple disjoint row/column selections is a UX morass with no clear best
                // behavior.
                _this.props.isCellSelected(index) &&
                _this.state.hasValidSelection &&
                Regions.getRegionCardinality(selectedRegions[0]) === _this.props.fullRegionCardinality &&
                // selected regions can be updated during mousedown+drag and before mouseup; thus, we
                // add a final check to make sure we don't enable reordering until the selection
                // interaction is complete. this prevents one click+drag interaction from triggering
                // both selection and reordering behavior.
                selectedRegions.length === 1 &&
                // columns are reordered via a reorder handle, so drag-selection needn't be disabled
                !_this.isReorderHandleEnabled());
        };
        _this.state = { hasValidSelection: _this.isSelectedRegionsControlledAndNonEmpty(props) };
        return _this;
    }
    Header.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState({ hasValidSelection: this.isSelectedRegionsControlledAndNonEmpty(nextProps) });
    };
    Header.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return (!CoreUtils.shallowCompareKeys(this.state, nextState) ||
            !CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: SHALLOW_COMPARE_PROP_KEYS_BLACKLIST }) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, SHALLOW_COMPARE_PROP_KEYS_BLACKLIST));
    };
    Header.prototype.render = function () {
        return this.props.wrapCells(this.renderCells());
    };
    Header.prototype.isSelectedRegionsControlledAndNonEmpty = function (props) {
        if (props === void 0) { props = this.props; }
        return props.selectedRegions != null && props.selectedRegions.length > 0;
    };
    Header.prototype.isReorderHandleEnabled = function () {
        // the reorder handle can only appear in the column interaction bar
        return this.isColumnHeader() && this.props.isReorderable;
    };
    Header.prototype.maybeRenderReorderHandle = function (index) {
        return !this.isReorderHandleEnabled()
            ? undefined
            : this.wrapInDragReorderable(index, React.createElement("div", { className: Classes.TABLE_REORDER_HANDLE_TARGET },
                React.createElement("div", { className: Classes.TABLE_REORDER_HANDLE },
                    React.createElement(Icon, { icon: "drag-handle-vertical" }))), false);
    };
    Header.prototype.isColumnHeader = function () {
        return this.props.fullRegionCardinality === RegionCardinality.FULL_COLUMNS;
    };
    Header.prototype.wrapInDragReorderable = function (index, children, disabled) {
        return (React.createElement(DragReorderable, { disabled: disabled, key: this.props.getIndexClass(index), locateClick: this.locateClick, locateDrag: this.locateDragForReordering, onReordered: this.props.onReordered, onReordering: this.props.onReordering, onSelection: this.props.onSelection, onFocusedCell: this.props.onFocusedCell, selectedRegions: this.props.selectedRegions, toRegion: this.props.toRegion }, children));
    };
    return Header;
}(React.Component));
export { Header };
//# sourceMappingURL=header.js.map