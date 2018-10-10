/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { RegionCardinality, Regions } from "../regions";
import * as Classes from "./classes";
import { Rect } from "./rect";
import { Utils } from "./utils";
/**
 * This class manages the sizes of grid cells using arrays of individual row/column sizes.
 */
var Grid = /** @class */ (function () {
    /**
     * This constructor accumulates the heights and widths in `O(n)`, saving
     * time in later calculations.
     *
     * @param bleed - The number of rows/cols that we expand beyond the
     *     viewport (on all sides). This helps avoid displaying an empty
     *     viewport when the user scrolls quickly.
     */
    function Grid(rowHeights, columnWidths, bleed, ghostHeight, ghostWidth) {
        if (bleed === void 0) { bleed = Grid.DEFAULT_BLEED; }
        if (ghostHeight === void 0) { ghostHeight = Grid.DEFAULT_GHOST_HEIGHT; }
        if (ghostWidth === void 0) { ghostWidth = Grid.DEFAULT_GHOST_WIDTH; }
        var _this = this;
        this.getCumulativeWidthBefore = function (index) {
            return index === 0 ? 0 : _this.getCumulativeWidthAt(index - 1);
        };
        this.getCumulativeWidthAt = function (index) {
            if (_this.numCols === 0) {
                return _this.ghostWidth * index;
            }
            else if (index >= _this.numCols) {
                return _this.cumulativeColumnWidths[_this.numCols - 1] + _this.ghostWidth * (index - _this.numCols + 1);
            }
            else {
                return _this.cumulativeColumnWidths[index];
            }
        };
        this.getCumulativeHeightBefore = function (index) {
            return index === 0 ? 0 : _this.getCumulativeHeightAt(index - 1);
        };
        this.getCumulativeHeightAt = function (index) {
            if (_this.numRows === 0) {
                return _this.ghostHeight * index;
            }
            else if (index >= _this.numRows) {
                return _this.cumulativeRowHeights[_this.numRows - 1] + _this.ghostHeight * (index - _this.numRows + 1);
            }
            else {
                return _this.cumulativeRowHeights[index];
            }
        };
        this.columnWidths = columnWidths;
        this.rowHeights = rowHeights;
        this.cumulativeColumnWidths = Utils.accumulate(columnWidths);
        this.cumulativeRowHeights = Utils.accumulate(rowHeights);
        this.numCols = columnWidths.length;
        this.numRows = rowHeights.length;
        this.bleed = bleed;
        this.ghostHeight = ghostHeight;
        this.ghostWidth = ghostWidth;
    }
    /**
     * Returns the `Rect` bounds of a cell in scrollpane client space.
     *
     * Scrollpane client coordinate space uses the origin of the scrollpane
     * client (the inside part that you're moving around).
     *
     * For example, let's say you're scrolling around a block of 1000 x 1000
     * cells. Regardless where you've scrolled, the first cell is always at
     * 0,0 in scrollpane client space. the cell to the right of it is always
     * at, e.g., 100,0.
     */
    Grid.prototype.getCellRect = function (rowIndex, columnIndex) {
        var height = this.rowHeights[rowIndex];
        var top = this.cumulativeRowHeights[rowIndex] - height;
        var width = this.columnWidths[columnIndex];
        var left = this.cumulativeColumnWidths[columnIndex] - width;
        return new Rect(left, top, width, height);
    };
    /**
     * Returns the `Rect` bounds of a cell in scrollpane client space.
     *
     * If the cell is beyond the bounds of the user-defined table cells, it is
     * considered a "ghost" cell. If a width/height is not defined for that
     * row/column, we use the default width/height.
     */
    Grid.prototype.getGhostCellRect = function (rowIndex, columnIndex) {
        var left = 0;
        var top = 0;
        var width = 0;
        var height = 0;
        if (rowIndex >= this.rowHeights.length) {
            height = this.ghostHeight;
            top = this.getHeight() + this.ghostHeight * (rowIndex - this.numRows);
        }
        else {
            height = this.rowHeights[rowIndex];
            top = this.cumulativeRowHeights[rowIndex] - height;
        }
        if (columnIndex >= this.columnWidths.length) {
            width = this.ghostWidth;
            left = this.getWidth() + this.ghostWidth * (columnIndex - this.numCols);
        }
        else {
            width = this.columnWidths[columnIndex];
            left = this.cumulativeColumnWidths[columnIndex] - width;
        }
        return new Rect(left, top, width, height);
    };
    /**
     * Returns the `Rect` with the base coordinate and height of the specified row.
     */
    Grid.prototype.getRowRect = function (rowIndex) {
        var height = this.rowHeights[rowIndex];
        var top = this.cumulativeRowHeights[rowIndex] - height;
        return new Rect(0, top, this.getWidth(), height);
    };
    /**
     * Returns the `Rect` with the base coordinate and width of the specified column.
     */
    Grid.prototype.getColumnRect = function (columnIndex) {
        var width = this.columnWidths[columnIndex];
        var left = this.cumulativeColumnWidths[columnIndex] - width;
        return new Rect(left, 0, width, this.getHeight());
    };
    /**
     * Returns the total width of the entire grid
     */
    Grid.prototype.getWidth = function () {
        return this.numCols === 0 ? 0 : this.cumulativeColumnWidths[this.numCols - 1];
    };
    /**
     * Returns the total width of the entire grid
     */
    Grid.prototype.getHeight = function () {
        return this.numRows === 0 ? 0 : this.cumulativeRowHeights[this.numRows - 1];
    };
    /**
     * Returns the `Rect` bounds of entire grid
     */
    Grid.prototype.getRect = function () {
        return new Rect(0, 0, this.getWidth(), this.getHeight());
    };
    /**
     * Maps each cell that intersects with the given `Rect` argument. The
     * indices of iteration are extended in both directions by the integer
     * `bleed` class property, then are clamped between 0 and the number of
     * rows/columns.
     *
     * Uses a binary search for each of the 4 edges of the bounds, resulting
     * in a runtime of `O(log(rows) + log(cols))` plus the `O(irows * icols)`
     * iteration of intersecting cells.
     */
    Grid.prototype.mapCellsInRect = function (rect, callback) {
        var results = [];
        if (rect == null) {
            return results;
        }
        var _a = this.getRowIndicesInRect(rect), rowIndexStart = _a.rowIndexStart, rowIndexEnd = _a.rowIndexEnd;
        var _b = this.getColumnIndicesInRect(rect), columnIndexStart = _b.columnIndexStart, columnIndexEnd = _b.columnIndexEnd;
        for (var rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (var columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                results.push(callback(rowIndex, columnIndex));
            }
        }
        return results;
    };
    /**
     * Maps each row that intersects with the given `Rect` argument.
     *
     * See Grid.mapCellsInRect for more details.
     */
    Grid.prototype.mapRowsInRect = function (rect, callback) {
        var results = [];
        if (rect == null) {
            return results;
        }
        var _a = this.getRowIndicesInRect(rect), rowIndexStart = _a.rowIndexStart, rowIndexEnd = _a.rowIndexEnd;
        for (var rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            results.push(callback(rowIndex));
        }
        return results;
    };
    /**
     * Maps each column that intersects with the given `Rect` argument.
     *
     * See Grid.mapCellsInRect for more details.
     */
    Grid.prototype.mapColumnsInRect = function (rect, callback) {
        var results = [];
        if (rect == null) {
            return results;
        }
        var _a = this.getColumnIndicesInRect(rect), columnIndexStart = _a.columnIndexStart, columnIndexEnd = _a.columnIndexEnd;
        for (var columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
            results.push(callback(columnIndex));
        }
        return results;
    };
    /**
     * Returns the start and end indices of rows that intersect with the given
     * `Rect` argument.
     */
    Grid.prototype.getRowIndicesInRect = function (rect, includeGhostCells, limit) {
        if (includeGhostCells === void 0) { includeGhostCells = false; }
        if (limit === void 0) { limit = Grid.DEFAULT_MAX_ROWS; }
        if (rect == null) {
            return { rowIndexEnd: 0, rowIndexStart: 0 };
        }
        var searchEnd = includeGhostCells ? Math.max(this.numRows, Grid.DEFAULT_MAX_ROWS) : this.numRows;
        var _a = this.getIndicesInInterval(rect.top, rect.top + rect.height, searchEnd, !includeGhostCells, this.getCumulativeHeightAt), start = _a.start, end = _a.end;
        var rowIndexEnd = limit > 0 && end - start > limit ? start + limit : end;
        return {
            rowIndexEnd: rowIndexEnd,
            rowIndexStart: start,
        };
    };
    /**
     * Returns the start and end indices of columns that intersect with the
     * given `Rect` argument.
     */
    Grid.prototype.getColumnIndicesInRect = function (rect, includeGhostCells, limit) {
        if (includeGhostCells === void 0) { includeGhostCells = false; }
        if (limit === void 0) { limit = Grid.DEFAULT_MAX_COLUMNS; }
        if (rect == null) {
            return { columnIndexEnd: 0, columnIndexStart: 0 };
        }
        var searchEnd = includeGhostCells ? Math.max(this.numCols, Grid.DEFAULT_MAX_COLUMNS) : this.numCols;
        var _a = this.getIndicesInInterval(rect.left, rect.left + rect.width, searchEnd, !includeGhostCells, this.getCumulativeWidthAt), start = _a.start, end = _a.end;
        var columnIndexEnd = limit > 0 && end - start > limit ? start + limit : end;
        return {
            columnIndexEnd: columnIndexEnd,
            columnIndexStart: start,
        };
    };
    Grid.prototype.isGhostIndex = function (rowIndex, columnIndex) {
        return rowIndex >= this.numRows || columnIndex >= this.numCols;
    };
    Grid.prototype.isGhostColumn = function (columnIndex) {
        return columnIndex >= this.numCols;
    };
    Grid.prototype.getExtremaClasses = function (rowIndex, columnIndex, rowEnd, columnEnd) {
        if (rowIndex === rowEnd && columnIndex === columnEnd) {
            return [Classes.TABLE_LAST_IN_COLUMN, Classes.TABLE_LAST_IN_ROW];
        }
        if (rowIndex === rowEnd) {
            return [Classes.TABLE_LAST_IN_COLUMN];
        }
        if (columnIndex === columnEnd) {
            return [Classes.TABLE_LAST_IN_ROW];
        }
        return [];
    };
    Grid.prototype.getRegionStyle = function (region) {
        var cardinality = Regions.getRegionCardinality(region);
        switch (cardinality) {
            case RegionCardinality.CELLS: {
                var _a = region.rows, rowStart = _a[0], rowEnd = _a[1];
                var _b = region.cols, colStart = _b[0], colEnd = _b[1];
                // if the region is outside the bounds of the table, don't display it
                if (this.isGhostIndex(rowStart, colStart) || this.isGhostIndex(rowEnd, colEnd)) {
                    return { display: "none" };
                }
                var cellRect0 = this.getCellRect(rowStart, colStart);
                var cellRect1 = this.getCellRect(rowEnd, colEnd);
                var offsetLeft = colStart === 0 ? 0 : 1;
                var offsetTop = rowStart === 0 ? 0 : 1;
                var rect = cellRect0.union(cellRect1);
                rect.height += offsetTop;
                rect.left -= offsetLeft;
                rect.width += offsetLeft;
                rect.top -= offsetTop;
                return tslib_1.__assign({}, rect.style(), { display: "block" });
            }
            case RegionCardinality.FULL_COLUMNS: {
                var _c = region.cols, colStart = _c[0], colEnd = _c[1];
                // if the region is outside the bounds of the table, don't display it
                if (this.isGhostIndex(0, colStart) || this.isGhostIndex(0, colEnd)) {
                    return { display: "none" };
                }
                var cellRect0 = this.getCellRect(0, colStart);
                var cellRect1 = this.getCellRect(0, colEnd);
                var rect = cellRect0.union(cellRect1);
                var offsetLeft = colStart === 0 ? 0 : 1;
                return {
                    bottom: 0,
                    display: "block",
                    left: rect.left - offsetLeft,
                    top: 0,
                    width: rect.width + offsetLeft,
                };
            }
            case RegionCardinality.FULL_ROWS: {
                var _d = region.rows, rowStart = _d[0], rowEnd = _d[1];
                // if the region is outside the bounds of the table, don't display it
                if (this.isGhostIndex(rowStart, 0) || this.isGhostIndex(rowEnd, 0)) {
                    return { display: "none" };
                }
                var cellRect0 = this.getCellRect(rowStart, 0);
                var cellRect1 = this.getCellRect(rowEnd, 0);
                var rect = cellRect0.union(cellRect1);
                var offsetTop = rowStart === 0 ? 0 : 1;
                return {
                    display: "block",
                    height: rect.height + offsetTop,
                    left: 0,
                    right: 0,
                    top: rect.top - offsetTop,
                };
            }
            case RegionCardinality.FULL_TABLE:
                return {
                    bottom: 0,
                    display: "block",
                    left: 0,
                    right: 0,
                    top: 0,
                };
            default:
                return { display: "none" };
        }
    };
    Grid.prototype.getIndicesInInterval = function (min, max, count, useEndBleed, lookup) {
        var start = Utils.binarySearch(min, count - 1, lookup);
        var end = Utils.binarySearch(max, count - 1, lookup);
        // correct exact pixel alignment
        if (start >= 0 && min === lookup(start)) {
            start += 1;
        }
        // apply bounded bleeds
        start = Math.max(0, start - this.bleed);
        if (useEndBleed) {
            end = Math.min(count - 1, end + this.bleed);
        }
        else {
            end = Math.min(count - 1, end);
        }
        return { start: start, end: end };
    };
    Grid.DEFAULT_BLEED = 3;
    Grid.DEFAULT_MAX_COLUMNS = 50;
    Grid.DEFAULT_MAX_ROWS = 200;
    Grid.DEFAULT_GHOST_HEIGHT = 20;
    Grid.DEFAULT_GHOST_WIDTH = 150;
    return Grid;
}());
export { Grid };
//# sourceMappingURL=grid.js.map