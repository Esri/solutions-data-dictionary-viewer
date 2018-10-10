"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Classes = tslib_1.__importStar(require("./common/classes"));
var utils_1 = require("./common/utils");
/**
 * `Region`s contain sets of cells. Additionally, a distinction is drawn, for
 * example, between all cells within a column and the whole column itself.
 * The `RegionCardinality` enum represents these distinct types of `Region`s.
 */
var RegionCardinality;
(function (RegionCardinality) {
    /**
     * A region that contains a finite rectangular group of table cells
     */
    RegionCardinality["CELLS"] = "cells";
    /**
     * A region that represents all cells within 1 or more rows.
     */
    RegionCardinality["FULL_ROWS"] = "full-rows";
    /**
     * A region that represents all cells within 1 or more columns.
     */
    RegionCardinality["FULL_COLUMNS"] = "full-columns";
    /**
     * A region that represents all cells in the table.
     */
    RegionCardinality["FULL_TABLE"] = "full-table";
})(RegionCardinality = exports.RegionCardinality || (exports.RegionCardinality = {}));
/**
 * A convenience object for subsets of `RegionCardinality` that are commonly
 * used as the `selectionMode` prop of the `<Table>`.
 */
exports.SelectionModes = {
    ALL: [
        RegionCardinality.FULL_TABLE,
        RegionCardinality.FULL_COLUMNS,
        RegionCardinality.FULL_ROWS,
        RegionCardinality.CELLS,
    ],
    COLUMNS_AND_CELLS: [RegionCardinality.FULL_COLUMNS, RegionCardinality.CELLS],
    COLUMNS_ONLY: [RegionCardinality.FULL_COLUMNS],
    NONE: [],
    ROWS_AND_CELLS: [RegionCardinality.FULL_ROWS, RegionCardinality.CELLS],
    ROWS_ONLY: [RegionCardinality.FULL_ROWS],
};
var ColumnLoadingOption;
(function (ColumnLoadingOption) {
    ColumnLoadingOption["CELLS"] = "cells";
    ColumnLoadingOption["HEADER"] = "column-header";
})(ColumnLoadingOption = exports.ColumnLoadingOption || (exports.ColumnLoadingOption = {}));
var RowLoadingOption;
(function (RowLoadingOption) {
    RowLoadingOption["CELLS"] = "cells";
    RowLoadingOption["HEADER"] = "row-header";
})(RowLoadingOption = exports.RowLoadingOption || (exports.RowLoadingOption = {}));
var TableLoadingOption;
(function (TableLoadingOption) {
    TableLoadingOption["CELLS"] = "cells";
    TableLoadingOption["COLUMN_HEADERS"] = "column-header";
    TableLoadingOption["ROW_HEADERS"] = "row-header";
})(TableLoadingOption = exports.TableLoadingOption || (exports.TableLoadingOption = {}));
var Regions = /** @class */ (function () {
    function Regions() {
    }
    /**
     * Determines the cardinality of a region. We use null values to indicate
     * an unbounded interval. Therefore, an example of a region containing the
     * second and third columns would be:
     *
     * ```js
     * { rows: null, cols: [1, 2] }
     * ```
     *
     * In this case, this method would return `RegionCardinality.FULL_COLUMNS`.
     *
     * If both rows and columns are unbounded, then the region covers the
     * entire table. Therefore, a region like this:
     *
     * ```js
     * { rows: null, cols: null }
     * ```
     *
     * will return `RegionCardinality.FULL_TABLE`.
     *
     * An example of a region containing a single cell in the table would be:
     *
     * ```js
     * { rows: [5, 5], cols: [2, 2] }
     * ```
     *
     * In this case, this method would return `RegionCardinality.CELLS`.
     */
    Regions.getRegionCardinality = function (region) {
        if (region.cols != null && region.rows != null) {
            return RegionCardinality.CELLS;
        }
        else if (region.cols != null) {
            return RegionCardinality.FULL_COLUMNS;
        }
        else if (region.rows != null) {
            return RegionCardinality.FULL_ROWS;
        }
        else {
            return RegionCardinality.FULL_TABLE;
        }
    };
    Regions.getFocusCellCoordinatesFromRegion = function (region) {
        var regionCardinality = Regions.getRegionCardinality(region);
        switch (regionCardinality) {
            case RegionCardinality.FULL_TABLE:
                return { col: 0, row: 0 };
            case RegionCardinality.FULL_COLUMNS:
                return { col: region.cols[0], row: 0 };
            case RegionCardinality.FULL_ROWS:
                return { col: 0, row: region.rows[0] };
            case RegionCardinality.CELLS:
                return { col: region.cols[0], row: region.rows[0] };
            default:
                return null;
        }
    };
    /**
     * Returns a deep copy of the provided region.
     */
    Regions.copy = function (region) {
        var cardinality = Regions.getRegionCardinality(region);
        // we need to be careful not to explicitly spell out `rows: undefined`
        // (e.g.) if the "rows" key is completely absent, otherwise
        // deep-equality checks will fail.
        if (cardinality === RegionCardinality.CELLS) {
            return Regions.cell(region.rows[0], region.cols[0], region.rows[1], region.cols[1]);
        }
        else if (cardinality === RegionCardinality.FULL_COLUMNS) {
            return Regions.column(region.cols[0], region.cols[1]);
        }
        else if (cardinality === RegionCardinality.FULL_ROWS) {
            return Regions.row(region.rows[0], region.rows[1]);
        }
        else {
            return Regions.table();
        }
    };
    /**
     * Returns a region containing one or more cells.
     */
    Regions.cell = function (row, col, row2, col2) {
        return {
            cols: this.normalizeInterval(col, col2),
            rows: this.normalizeInterval(row, row2),
        };
    };
    /**
     * Returns a region containing one or more full rows.
     */
    Regions.row = function (row, row2) {
        return { rows: this.normalizeInterval(row, row2) };
    };
    /**
     * Returns a region containing one or more full columns.
     */
    Regions.column = function (col, col2) {
        return { cols: this.normalizeInterval(col, col2) };
    };
    /**
     * Returns a region containing the entire table.
     */
    Regions.table = function () {
        return {};
    };
    /**
     * Adds the region to the end of a cloned copy of the supplied region
     * array.
     */
    Regions.add = function (regions, region) {
        var copy = regions.slice();
        copy.push(region);
        return copy;
    };
    /**
     * Replaces the region at the end of a cloned copy of the supplied region
     * array, or at the specific index if one is provided.
     */
    Regions.update = function (regions, region, index) {
        var copy = regions.slice();
        if (index != null) {
            copy.splice(index, 1, region);
        }
        else {
            copy.pop();
            copy.push(region);
        }
        return copy;
    };
    /**
     * Clamps the region's start and end indices between 0 and the provided
     * maximum values.
     */
    Regions.clampRegion = function (region, maxRowIndex, maxColumnIndex) {
        var nextRegion = Regions.copy(region);
        if (region.rows != null) {
            nextRegion.rows[0] = utils_1.Utils.clamp(region.rows[0], 0, maxRowIndex);
            nextRegion.rows[1] = utils_1.Utils.clamp(region.rows[1], 0, maxRowIndex);
        }
        if (region.cols != null) {
            nextRegion.cols[0] = utils_1.Utils.clamp(region.cols[0], 0, maxColumnIndex);
            nextRegion.cols[1] = utils_1.Utils.clamp(region.cols[1], 0, maxColumnIndex);
        }
        return nextRegion;
    };
    /**
     * Returns true iff the specified region is equal to the last region in
     * the region list. This allows us to avoid immediate additive re-selection.
     */
    Regions.lastRegionIsEqual = function (regions, region) {
        if (regions == null || regions.length === 0) {
            return false;
        }
        var lastRegion = regions[regions.length - 1];
        return Regions.regionsEqual(lastRegion, region);
    };
    /**
     * Returns the index of the region that is equal to the supplied
     * parameter. Returns -1 if no such region is found.
     */
    Regions.findMatchingRegion = function (regions, region) {
        if (regions == null) {
            return -1;
        }
        for (var i = 0; i < regions.length; i++) {
            if (Regions.regionsEqual(regions[i], region)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Returns the index of the region that wholly contains the supplied
     * parameter. Returns -1 if no such region is found.
     */
    Regions.findContainingRegion = function (regions, region) {
        if (regions == null) {
            return -1;
        }
        for (var i = 0; i < regions.length; i++) {
            if (Regions.regionContains(regions[i], region)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Returns true if the regions contain a region that has FULL_COLUMNS
     * cardinality and contains the specified column index.
     */
    Regions.hasFullColumn = function (regions, col) {
        if (regions == null) {
            return false;
        }
        for (var _i = 0, regions_1 = regions; _i < regions_1.length; _i++) {
            var region = regions_1[_i];
            var cardinality = Regions.getRegionCardinality(region);
            if (cardinality === RegionCardinality.FULL_TABLE) {
                return true;
            }
            if (cardinality === RegionCardinality.FULL_COLUMNS && Regions.intervalContainsIndex(region.cols, col)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns true if the regions contain a region that has FULL_ROWS
     * cardinality and contains the specified row index.
     */
    Regions.hasFullRow = function (regions, row) {
        if (regions == null) {
            return false;
        }
        for (var _i = 0, regions_2 = regions; _i < regions_2.length; _i++) {
            var region = regions_2[_i];
            var cardinality = Regions.getRegionCardinality(region);
            if (cardinality === RegionCardinality.FULL_TABLE) {
                return true;
            }
            if (cardinality === RegionCardinality.FULL_ROWS && Regions.intervalContainsIndex(region.rows, row)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns true if the regions contain a region that has FULL_TABLE cardinality
     */
    Regions.hasFullTable = function (regions) {
        if (regions == null) {
            return false;
        }
        for (var _i = 0, regions_3 = regions; _i < regions_3.length; _i++) {
            var region = regions_3[_i];
            var cardinality = Regions.getRegionCardinality(region);
            if (cardinality === RegionCardinality.FULL_TABLE) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns true if the regions fully contain the query region.
     */
    Regions.containsRegion = function (regions, query) {
        return Regions.overlapsRegion(regions, query, false);
    };
    /**
     * Returns true if the regions at least partially overlap the query region.
     */
    Regions.overlapsRegion = function (regions, query, allowPartialOverlap) {
        if (allowPartialOverlap === void 0) { allowPartialOverlap = false; }
        var intervalCompareFn = allowPartialOverlap ? Regions.intervalOverlaps : Regions.intervalContains;
        if (regions == null || query == null) {
            return false;
        }
        for (var _i = 0, regions_4 = regions; _i < regions_4.length; _i++) {
            var region = regions_4[_i];
            var cardinality = Regions.getRegionCardinality(region);
            switch (cardinality) {
                case RegionCardinality.FULL_TABLE:
                    return true;
                case RegionCardinality.FULL_COLUMNS:
                    if (intervalCompareFn(region.cols, query.cols)) {
                        return true;
                    }
                    continue;
                case RegionCardinality.FULL_ROWS:
                    if (intervalCompareFn(region.rows, query.rows)) {
                        return true;
                    }
                    continue;
                case RegionCardinality.CELLS:
                    if (intervalCompareFn(region.cols, query.cols) && intervalCompareFn(region.rows, query.rows)) {
                        return true;
                    }
                    continue;
                default:
                    break;
            }
        }
        return false;
    };
    Regions.eachUniqueFullColumn = function (regions, iteratee) {
        if (regions == null || regions.length === 0 || iteratee == null) {
            return;
        }
        var seen = {};
        regions.forEach(function (region) {
            if (Regions.getRegionCardinality(region) === RegionCardinality.FULL_COLUMNS) {
                var _a = region.cols, start = _a[0], end = _a[1];
                for (var col = start; col <= end; col++) {
                    if (!seen[col]) {
                        seen[col] = true;
                        iteratee(col);
                    }
                }
            }
        });
    };
    Regions.eachUniqueFullRow = function (regions, iteratee) {
        if (regions == null || regions.length === 0 || iteratee == null) {
            return;
        }
        var seen = {};
        regions.forEach(function (region) {
            if (Regions.getRegionCardinality(region) === RegionCardinality.FULL_ROWS) {
                var _a = region.rows, start = _a[0], end = _a[1];
                for (var row = start; row <= end; row++) {
                    if (!seen[row]) {
                        seen[row] = true;
                        iteratee(row);
                    }
                }
            }
        });
    };
    /**
     * Using the supplied array of non-contiguous `IRegion`s, this method
     * returns an ordered array of every unique cell that exists in those
     * regions.
     */
    Regions.enumerateUniqueCells = function (regions, numRows, numCols) {
        if (regions == null || regions.length === 0) {
            return [];
        }
        var seen = {};
        var list = [];
        for (var _i = 0, regions_5 = regions; _i < regions_5.length; _i++) {
            var region = regions_5[_i];
            Regions.eachCellInRegion(region, numRows, numCols, function (row, col) {
                // add to list if not seen
                var key = row + "-" + col;
                if (seen[key] !== true) {
                    seen[key] = true;
                    list.push([row, col]);
                }
            });
        }
        // sort list by rows then columns
        list.sort(Regions.rowFirstComparator);
        return list;
    };
    /**
     * Using the supplied region, returns an "equivalent" region of
     * type CELLS that define the bounds of the given region
     */
    Regions.getCellRegionFromRegion = function (region, numRows, numCols) {
        var regionCardinality = Regions.getRegionCardinality(region);
        switch (regionCardinality) {
            case RegionCardinality.FULL_TABLE:
                return Regions.cell(0, 0, numRows - 1, numCols - 1);
            case RegionCardinality.FULL_COLUMNS:
                return Regions.cell(0, region.cols[0], numRows - 1, region.cols[1]);
            case RegionCardinality.FULL_ROWS:
                return Regions.cell(region.rows[0], 0, region.rows[1], numCols - 1);
            case RegionCardinality.CELLS:
                return Regions.cell(region.rows[0], region.cols[0], region.rows[1], region.cols[1]);
            default:
                return null;
        }
    };
    /**
     * Maps a dense array of cell coordinates to a sparse 2-dimensional array
     * of cell values.
     *
     * We create a new 2-dimensional array representing the smallest single
     * contiguous `IRegion` that contains all cells in the supplied array. We
     * invoke the mapper callback only on the cells in the supplied coordinate
     * array and store the result. Returns the resulting 2-dimensional array.
     */
    Regions.sparseMapCells = function (cells, mapper) {
        var bounds = Regions.getBoundingRegion(cells);
        if (bounds == null) {
            return null;
        }
        var numRows = bounds.rows[1] + 1 - bounds.rows[0];
        var numCols = bounds.cols[1] + 1 - bounds.cols[0];
        var result = utils_1.Utils.times(numRows, function () { return new Array(numCols); });
        cells.forEach(function (_a) {
            var row = _a[0], col = _a[1];
            result[row - bounds.rows[0]][col - bounds.cols[0]] = mapper(row, col);
        });
        return result;
    };
    /**
     * Returns the smallest single contiguous `IRegion` that contains all cells in the
     * supplied array.
     */
    Regions.getBoundingRegion = function (cells) {
        var minRow;
        var maxRow;
        var minCol;
        var maxCol;
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var _a = cells_1[_i], row = _a[0], col = _a[1];
            minRow = minRow == null || row < minRow ? row : minRow;
            maxRow = maxRow == null || row > maxRow ? row : maxRow;
            minCol = minCol == null || col < minCol ? col : minCol;
            maxCol = maxCol == null || col > maxCol ? col : maxCol;
        }
        if (minRow == null) {
            return null;
        }
        return {
            cols: [minCol, maxCol],
            rows: [minRow, maxRow],
        };
    };
    Regions.isValid = function (region) {
        if (region == null) {
            return false;
        }
        if (region.rows != null && (region.rows[0] < 0 || region.rows[1] < 0)) {
            return false;
        }
        if (region.cols != null && (region.cols[0] < 0 || region.cols[1] < 0)) {
            return false;
        }
        return true;
    };
    Regions.isRegionValidForTable = function (region, numRows, numCols) {
        if (numRows === 0 || numCols === 0) {
            return false;
        }
        else if (region.rows != null && !intervalInRangeInclusive(region.rows, 0, numRows - 1)) {
            return false;
        }
        else if (region.cols != null && !intervalInRangeInclusive(region.cols, 0, numCols - 1)) {
            return false;
        }
        return true;
    };
    Regions.joinStyledRegionGroups = function (selectedRegions, otherRegions, focusedCell) {
        var regionGroups = [];
        if (otherRegions != null) {
            regionGroups = regionGroups.concat(otherRegions);
        }
        if (selectedRegions != null && selectedRegions.length > 0) {
            regionGroups.push({
                className: Classes.TABLE_SELECTION_REGION,
                regions: selectedRegions,
            });
        }
        if (focusedCell != null) {
            regionGroups.push({
                className: Classes.TABLE_FOCUS_REGION,
                regions: [Regions.cell(focusedCell.row, focusedCell.col)],
            });
        }
        return regionGroups;
    };
    Regions.regionsEqual = function (regionA, regionB) {
        return Regions.intervalsEqual(regionA.rows, regionB.rows) && Regions.intervalsEqual(regionA.cols, regionB.cols);
    };
    /**
     * Expands an old region to the minimal bounding region that also contains
     * the new region. If the regions have different cardinalities, then the new
     * region is returned. Useful for expanding a selected region on
     * shift+click, for instance.
     */
    Regions.expandRegion = function (oldRegion, newRegion) {
        var oldRegionCardinality = Regions.getRegionCardinality(oldRegion);
        var newRegionCardinality = Regions.getRegionCardinality(newRegion);
        if (newRegionCardinality !== oldRegionCardinality) {
            return newRegion;
        }
        switch (newRegionCardinality) {
            case RegionCardinality.FULL_ROWS: {
                var rowStart = Math.min(oldRegion.rows[0], newRegion.rows[0]);
                var rowEnd = Math.max(oldRegion.rows[1], newRegion.rows[1]);
                return Regions.row(rowStart, rowEnd);
            }
            case RegionCardinality.FULL_COLUMNS: {
                var colStart = Math.min(oldRegion.cols[0], newRegion.cols[0]);
                var colEnd = Math.max(oldRegion.cols[1], newRegion.cols[1]);
                return Regions.column(colStart, colEnd);
            }
            case RegionCardinality.CELLS: {
                var rowStart = Math.min(oldRegion.rows[0], newRegion.rows[0]);
                var colStart = Math.min(oldRegion.cols[0], newRegion.cols[0]);
                var rowEnd = Math.max(oldRegion.rows[1], newRegion.rows[1]);
                var colEnd = Math.max(oldRegion.cols[1], newRegion.cols[1]);
                return Regions.cell(rowStart, colStart, rowEnd, colEnd);
            }
            default:
                return Regions.table();
        }
    };
    /**
     * Iterates over the cells within an `IRegion`, invoking the callback with
     * each cell's coordinates.
     */
    Regions.eachCellInRegion = function (region, numRows, numCols, iteratee) {
        var cardinality = Regions.getRegionCardinality(region);
        switch (cardinality) {
            case RegionCardinality.FULL_TABLE:
                for (var row = 0; row < numRows; row++) {
                    for (var col = 0; col < numCols; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            case RegionCardinality.FULL_COLUMNS:
                for (var row = 0; row < numRows; row++) {
                    for (var col = region.cols[0]; col <= region.cols[1]; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            case RegionCardinality.FULL_ROWS:
                for (var row = region.rows[0]; row <= region.rows[1]; row++) {
                    for (var col = 0; col < numCols; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            case RegionCardinality.CELLS:
                for (var row = region.rows[0]; row <= region.rows[1]; row++) {
                    for (var col = region.cols[0]; col <= region.cols[1]; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            default:
                break;
        }
    };
    Regions.regionContains = function (regionA, regionB) {
        // containsRegion expects an array of regions as the first param
        return Regions.overlapsRegion([regionA], regionB, false);
    };
    Regions.intervalsEqual = function (ivalA, ivalB) {
        if (ivalA == null) {
            return ivalB == null;
        }
        else if (ivalB == null) {
            return false;
        }
        else {
            return ivalA[0] === ivalB[0] && ivalA[1] === ivalB[1];
        }
    };
    Regions.intervalContainsIndex = function (interval, index) {
        if (interval == null) {
            return false;
        }
        return interval[0] <= index && interval[1] >= index;
    };
    Regions.intervalContains = function (ivalA, ivalB) {
        if (ivalA == null || ivalB == null) {
            return false;
        }
        return ivalA[0] <= ivalB[0] && ivalB[1] <= ivalA[1];
    };
    Regions.intervalOverlaps = function (ivalA, ivalB) {
        if (ivalA == null || ivalB == null) {
            return false;
        }
        if (ivalA[1] < ivalB[0] || ivalA[0] > ivalB[1]) {
            return false;
        }
        return true;
    };
    Regions.rowFirstComparator = function (a, b) {
        var rowDiff = a[0] - b[0];
        return rowDiff === 0 ? a[1] - b[1] : rowDiff;
    };
    Regions.numericalComparator = function (a, b) {
        return a - b;
    };
    Regions.normalizeInterval = function (coord, coord2) {
        if (coord2 == null) {
            coord2 = coord;
        }
        var interval = [coord, coord2];
        interval.sort(Regions.numericalComparator);
        return interval;
    };
    return Regions;
}());
exports.Regions = Regions;
function intervalInRangeInclusive(interval, minInclusive, maxInclusive) {
    return (inRangeInclusive(interval[0], minInclusive, maxInclusive) &&
        inRangeInclusive(interval[1], minInclusive, maxInclusive));
}
function inRangeInclusive(value, minInclusive, maxInclusive) {
    return value >= minInclusive && value <= maxInclusive;
}
//# sourceMappingURL=regions.js.map