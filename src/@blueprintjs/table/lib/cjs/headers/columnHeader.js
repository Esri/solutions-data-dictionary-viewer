"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var Classes = tslib_1.__importStar(require("../common/classes"));
var index_1 = require("../common/index");
var resizeHandle_1 = require("../interactions/resizeHandle");
var regions_1 = require("../regions");
var columnHeaderCell_1 = require("./columnHeaderCell");
var header_1 = require("./header");
var ColumnHeader = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnHeader, _super);
    function ColumnHeader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wrapCells = function (cells) {
            var _a = _this.props, columnIndexStart = _a.columnIndexStart, grid = _a.grid;
            var tableWidth = grid.getRect().width;
            var scrollLeftCorrection = _this.props.grid.getCumulativeWidthBefore(columnIndexStart);
            var style = {
                // only header cells in view will render, but we need to reposition them to stay in view
                // as we scroll horizontally.
                transform: "translateX(" + (scrollLeftCorrection || 0) + "px)",
                // reduce the width to clamp the sliding window as we approach the final headers; otherwise,
                // we'll have tons of useless whitespace at the end.
                width: tableWidth - scrollLeftCorrection,
            };
            var classes = classnames_1.default(Classes.TABLE_THEAD, Classes.TABLE_COLUMN_HEADER_TR);
            // add a wrapper set to the full-table width to ensure container styles stretch from the first
            // cell all the way to the last
            return (React.createElement("div", { style: { width: tableWidth } },
                React.createElement("div", { style: style, className: classes, ref: _this.props.measurableElementRef }, cells)));
        };
        _this.convertPointToColumn = function (clientXOrY, useMidpoint) {
            var locator = _this.props.locator;
            return locator != null ? locator.convertPointToColumn(clientXOrY, useMidpoint) : null;
        };
        _this.getCellExtremaClasses = function (index, indexEnd) {
            return _this.props.grid.getExtremaClasses(0, index, 1, indexEnd);
        };
        _this.getColumnWidth = function (index) {
            return _this.props.grid.getColumnRect(index).width;
        };
        _this.getDragCoordinate = function (clientCoords) {
            return clientCoords[0]; // x-coordinate
        };
        _this.getMouseCoordinate = function (event) {
            return event.clientX;
        };
        _this.handleResizeEnd = function (index, size) {
            _this.props.onResizeGuide(null);
            _this.props.onColumnWidthChanged(index, size);
        };
        _this.handleResizeDoubleClick = function (index) {
            var _a = _this.props, minColumnWidth = _a.minColumnWidth, maxColumnWidth = _a.maxColumnWidth;
            var width = _this.props.locator.getWidestVisibleCellInColumn(index);
            var clampedWidth = index_1.Utils.clamp(width, minColumnWidth, maxColumnWidth);
            _this.props.onResizeGuide(null);
            _this.props.onColumnWidthChanged(index, clampedWidth);
        };
        _this.handleSizeChanged = function (index, size) {
            var rect = _this.props.grid.getColumnRect(index);
            _this.props.onResizeGuide([rect.left + size]);
        };
        _this.isCellSelected = function (index) {
            return regions_1.Regions.hasFullColumn(_this.props.selectedRegions, index);
        };
        _this.isGhostIndex = function (index) {
            return _this.props.grid.isGhostIndex(-1, index);
        };
        _this.renderGhostCell = function (index, extremaClasses) {
            var _a = _this.props, grid = _a.grid, loading = _a.loading;
            var rect = grid.getGhostCellRect(0, index);
            var style = {
                flexBasis: rect.width + "px",
                width: rect.width + "px",
            };
            return (React.createElement(columnHeaderCell_1.ColumnHeaderCell, { className: classnames_1.default(extremaClasses), index: index, key: Classes.columnIndexClass(index), loading: loading, style: style }));
        };
        _this.toRegion = function (index1, index2) {
            return regions_1.Regions.column(index1, index2);
        };
        return _this;
    }
    ColumnHeader.prototype.render = function () {
        var _a = this.props, 
        // from IColumnHeaderProps
        renderHeaderCell = _a.cellRenderer, onColumnWidthChanged = _a.onColumnWidthChanged, 
        // from IColumnWidths
        minSize = _a.minColumnWidth, maxSize = _a.maxColumnWidth, defaultColumnWidth = _a.defaultColumnWidth, 
        // from IColumnIndices
        indexStart = _a.columnIndexStart, indexEnd = _a.columnIndexEnd, 
        // from IHeaderProps
        spreadableProps = tslib_1.__rest(_a, ["cellRenderer", "onColumnWidthChanged", "minColumnWidth", "maxColumnWidth", "defaultColumnWidth", "columnIndexStart", "columnIndexEnd"]);
        return (React.createElement(header_1.Header, tslib_1.__assign({ convertPointToIndex: this.convertPointToColumn, fullRegionCardinality: regions_1.RegionCardinality.FULL_COLUMNS, getCellExtremaClasses: this.getCellExtremaClasses, getCellIndexClass: Classes.columnCellIndexClass, getCellSize: this.getColumnWidth, getDragCoordinate: this.getDragCoordinate, getIndexClass: Classes.columnIndexClass, getMouseCoordinate: this.getMouseCoordinate, ghostCellRenderer: this.renderGhostCell, handleResizeDoubleClick: this.handleResizeDoubleClick, handleResizeEnd: this.handleResizeEnd, handleSizeChanged: this.handleSizeChanged, headerCellIsReorderablePropName: "enableColumnReordering", headerCellIsSelectedPropName: "isColumnSelected", headerCellRenderer: renderHeaderCell, indexEnd: indexEnd, indexStart: indexStart, isCellSelected: this.isCellSelected, isGhostIndex: this.isGhostIndex, maxSize: maxSize, minSize: minSize, resizeOrientation: resizeHandle_1.Orientation.VERTICAL, selectedRegions: [], toRegion: this.toRegion, wrapCells: this.wrapCells }, spreadableProps)));
    };
    ColumnHeader.defaultProps = {
        isReorderable: false,
        isResizable: true,
        loading: false,
    };
    return ColumnHeader;
}(React.Component));
exports.ColumnHeader = ColumnHeader;
//# sourceMappingURL=columnHeader.js.map