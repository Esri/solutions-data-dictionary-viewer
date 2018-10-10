"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Classes = tslib_1.__importStar(require("./common/classes"));
var rect_1 = require("./common/rect");
var utils_1 = require("./common/utils");
var Locator = /** @class */ (function () {
    function Locator(
    /* The root table element within which a click is deemed valid and relevant. */
    tableElement, 
    /* The scrollable element that wraps the cell container. */
    scrollContainerElement, 
    /* The element containing all body cells in the grid (excluding headers). */
    cellContainerElement) {
        var _this = this;
        this.tableElement = tableElement;
        this.scrollContainerElement = scrollContainerElement;
        this.cellContainerElement = cellContainerElement;
        this.convertCellIndexToClientX = function (index) {
            return _this.grid.getCumulativeWidthAt(index);
        };
        this.convertCellMidpointToClientX = function (index) {
            var cellLeft = _this.grid.getCumulativeWidthBefore(index);
            var cellRight = _this.grid.getCumulativeWidthAt(index);
            return (cellLeft + cellRight) / 2;
        };
        this.convertCellIndexToClientY = function (index) {
            return _this.grid.getCumulativeHeightAt(index);
        };
        this.convertCellMidpointToClientY = function (index) {
            var cellTop = _this.grid.getCumulativeHeightBefore(index);
            var cellBottom = _this.grid.getCumulativeHeightAt(index);
            return (cellTop + cellBottom) / 2;
        };
        this.toGridX = function (clientX) {
            var gridOffsetFromPageLeft = _this.cellContainerElement.getBoundingClientRect().left;
            var scrollOffsetFromGridLeft = _this.scrollContainerElement.scrollLeft;
            var cursorOffsetFromGridLeft = clientX - (gridOffsetFromPageLeft + scrollOffsetFromGridLeft);
            var isCursorWithinFrozenColumns = _this.numFrozenColumns != null &&
                _this.numFrozenColumns > 0 &&
                cursorOffsetFromGridLeft <= _this.grid.getCumulativeWidthBefore(_this.numFrozenColumns);
            // the frozen-column region doesn't scroll, so ignore the scroll distance in that case
            return isCursorWithinFrozenColumns
                ? cursorOffsetFromGridLeft
                : cursorOffsetFromGridLeft + scrollOffsetFromGridLeft;
        };
        this.toGridY = function (clientY) {
            var gridOffsetFromPageTop = _this.cellContainerElement.getBoundingClientRect().top;
            var scrollOffsetFromGridTop = _this.scrollContainerElement.scrollTop;
            var cursorOffsetFromGridTop = clientY - (gridOffsetFromPageTop + scrollOffsetFromGridTop);
            var isCursorWithinFrozenRows = _this.numFrozenRows != null &&
                _this.numFrozenRows > 0 &&
                cursorOffsetFromGridTop <= _this.grid.getCumulativeHeightBefore(_this.numFrozenRows);
            return isCursorWithinFrozenRows ? cursorOffsetFromGridTop : cursorOffsetFromGridTop + scrollOffsetFromGridTop;
        };
        this.numFrozenRows = 0;
        this.numFrozenColumns = 0;
    }
    // Setters
    // =======
    Locator.prototype.setGrid = function (grid) {
        this.grid = grid;
        return this;
    };
    Locator.prototype.setNumFrozenRows = function (numFrozenRows) {
        this.numFrozenRows = numFrozenRows;
        return this;
    };
    Locator.prototype.setNumFrozenColumns = function (numFrozenColumns) {
        this.numFrozenColumns = numFrozenColumns;
        return this;
    };
    // Getters
    // =======
    Locator.prototype.getViewportRect = function () {
        return new rect_1.Rect(this.scrollContainerElement.scrollLeft, this.scrollContainerElement.scrollTop, this.scrollContainerElement.clientWidth, this.scrollContainerElement.clientHeight);
    };
    Locator.prototype.getWidestVisibleCellInColumn = function (columnIndex) {
        var columnCellSelector = this.getColumnCellSelector(columnIndex);
        var columnHeaderAndBodyCells = this.tableElement.querySelectorAll(columnCellSelector);
        var maxWidth = 0;
        for (var i = 0; i < columnHeaderAndBodyCells.length; i++) {
            var contentWidth = utils_1.Utils.measureElementTextContent(columnHeaderAndBodyCells.item(i)).width;
            var cellWidth = Math.ceil(contentWidth) + Locator.CELL_HORIZONTAL_PADDING * 2;
            if (cellWidth > maxWidth) {
                maxWidth = cellWidth;
            }
        }
        return maxWidth;
    };
    Locator.prototype.getTallestVisibleCellInColumn = function (columnIndex) {
        // consider only body cells, hence the extra Classes.TABLE_CELL specificity
        var columnCellSelector = this.getColumnCellSelector(columnIndex);
        var columnBodyCells = this.tableElement.querySelectorAll(columnCellSelector + "." + Classes.TABLE_CELL);
        var maxHeight = 0;
        for (var i = 0; i < columnBodyCells.length; i++) {
            var cell = columnBodyCells.item(i);
            var cellValue = cell.querySelector("." + Classes.TABLE_TRUNCATED_VALUE);
            var cellTruncatedFormatText = cell.querySelector("." + Classes.TABLE_TRUNCATED_FORMAT_TEXT);
            var cellTruncatedText = cell.querySelector("." + Classes.TABLE_TRUNCATED_TEXT);
            var height = 0;
            if (cellValue != null) {
                height = cellValue.scrollHeight;
            }
            else if (cellTruncatedFormatText != null) {
                height = cellTruncatedFormatText.scrollHeight;
            }
            else if (cellTruncatedText != null) {
                height = cellTruncatedText.scrollHeight;
            }
            else {
                // it's not anything we recognize, just use the current height of the cell
                height = cell.scrollHeight;
            }
            if (height > maxHeight) {
                maxHeight = height;
            }
        }
        return maxHeight;
    };
    // Converters
    // ==========
    Locator.prototype.convertPointToColumn = function (clientX, useMidpoint) {
        var tableRect = this.getTableRect();
        if (!tableRect.containsX(clientX)) {
            return -1;
        }
        var gridX = this.toGridX(clientX);
        var limit = useMidpoint ? this.grid.numCols : this.grid.numCols - 1;
        var lookupFn = useMidpoint ? this.convertCellMidpointToClientX : this.convertCellIndexToClientX;
        return utils_1.Utils.binarySearch(gridX, limit, lookupFn);
    };
    Locator.prototype.convertPointToRow = function (clientY, useMidpoint) {
        var tableRect = this.getTableRect();
        if (!tableRect.containsY(clientY)) {
            return -1;
        }
        var gridY = this.toGridY(clientY);
        var limit = useMidpoint ? this.grid.numRows : this.grid.numRows - 1;
        var lookupFn = useMidpoint ? this.convertCellMidpointToClientY : this.convertCellIndexToClientY;
        return utils_1.Utils.binarySearch(gridY, limit, lookupFn);
    };
    Locator.prototype.convertPointToCell = function (clientX, clientY) {
        var gridX = this.toGridX(clientX);
        var gridY = this.toGridY(clientY);
        var col = utils_1.Utils.binarySearch(gridX, this.grid.numCols - 1, this.convertCellIndexToClientX);
        var row = utils_1.Utils.binarySearch(gridY, this.grid.numRows - 1, this.convertCellIndexToClientY);
        return { col: col, row: row };
    };
    // Private helpers
    // ===============
    Locator.prototype.getColumnCellSelector = function (columnIndex) {
        // measure frozen columns in the LEFT quadrant; otherwise, they might
        // have been scrolled out of view, leading to wonky measurements (#1561)
        var isFrozenColumnIndex = columnIndex < this.numFrozenColumns;
        var quadrantClass = isFrozenColumnIndex ? Classes.TABLE_QUADRANT_LEFT : Classes.TABLE_QUADRANT_MAIN;
        var cellClass = Classes.columnCellIndexClass(columnIndex);
        return "." + quadrantClass + " ." + cellClass;
    };
    Locator.prototype.getTableRect = function () {
        return rect_1.Rect.wrap(this.tableElement.getBoundingClientRect());
    };
    Locator.CELL_HORIZONTAL_PADDING = 10;
    return Locator;
}());
exports.Locator = Locator;
//# sourceMappingURL=locator.js.map