"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var regions_1 = require("../../regions");
var Errors = tslib_1.__importStar(require("../errors"));
/**
 * Returns the `focusedSelectionIndex` if both the focused cell and that
 * property are defined, or the last index of `selectedRegions` otherwise. If
 * `selectedRegions` is empty, the function always returns `undefined`.
 */
function getFocusedOrLastSelectedIndex(selectedRegions, focusedCell) {
    if (selectedRegions.length === 0) {
        return undefined;
    }
    else if (focusedCell != null) {
        return focusedCell.focusSelectionIndex;
    }
    else {
        return selectedRegions.length - 1;
    }
}
exports.getFocusedOrLastSelectedIndex = getFocusedOrLastSelectedIndex;
/**
 * Returns the proper focused cell for the given set of initial conditions.
 */
function getInitialFocusedCell(enableFocusedCell, focusedCellFromProps, focusedCellFromState, selectedRegions) {
    if (!enableFocusedCell) {
        return undefined;
    }
    else if (focusedCellFromProps != null) {
        // controlled mode
        return focusedCellFromProps;
    }
    else if (focusedCellFromState != null) {
        // use the current focused cell from state
        return focusedCellFromState;
    }
    else if (selectedRegions.length > 0) {
        // focus the top-left cell of the last selection
        var lastIndex = selectedRegions.length - 1;
        return tslib_1.__assign({}, regions_1.Regions.getFocusCellCoordinatesFromRegion(selectedRegions[lastIndex]), { focusSelectionIndex: lastIndex });
    }
    else {
        // focus the top-left cell of the table
        return { col: 0, row: 0, focusSelectionIndex: 0 };
    }
}
exports.getInitialFocusedCell = getInitialFocusedCell;
/**
 * Returns `true` if the focused cell is located along the top boundary of the
 * provided region, or `false` otherwise.
 */
function isFocusedCellAtRegionTop(region, focusedCell) {
    return region.rows != null && focusedCell.row === region.rows[0];
}
exports.isFocusedCellAtRegionTop = isFocusedCellAtRegionTop;
/**
 * Returns `true` if the focused cell is located along the bottom boundary of
 * the provided region, or `false` otherwise.
 */
function isFocusedCellAtRegionBottom(region, focusedCell) {
    return region.rows != null && focusedCell.row === region.rows[1];
}
exports.isFocusedCellAtRegionBottom = isFocusedCellAtRegionBottom;
/**
 * Returns `true` if the focused cell is located along the left boundary of the
 * provided region, or `false` otherwise.
 */
function isFocusedCellAtRegionLeft(region, focusedCell) {
    return region.cols != null && focusedCell.col === region.cols[0];
}
exports.isFocusedCellAtRegionLeft = isFocusedCellAtRegionLeft;
/**
 * Returns `true` if the focused cell is located along the right boundary of the
 * provided region, or `false` otherwise.
 */
function isFocusedCellAtRegionRight(region, focusedCell) {
    return region.cols != null && focusedCell.col === region.cols[1];
}
exports.isFocusedCellAtRegionRight = isFocusedCellAtRegionRight;
/**
 * Returns a new cell-coordinates object that includes a focusSelectionIndex property.
 * The returned object will have the proper IFocusedCellCoordinates type.
 */
function toFullCoordinates(cellCoords, focusSelectionIndex) {
    if (focusSelectionIndex === void 0) { focusSelectionIndex = 0; }
    return tslib_1.__assign({}, cellCoords, { focusSelectionIndex: focusSelectionIndex });
}
exports.toFullCoordinates = toFullCoordinates;
/**
 * Expands an existing region to new region based on the current focused cell.
 * The focused cell is an invariant and should not move as a result of this
 * operation. This function is used, for instance, to expand a selected region
 * on shift+click.
 */
function expandFocusedRegion(focusedCell, newRegion) {
    switch (regions_1.Regions.getRegionCardinality(newRegion)) {
        case regions_1.RegionCardinality.FULL_COLUMNS: {
            var _a = getExpandedRegionIndices(focusedCell, newRegion, "col", "cols"), indexStart = _a[0], indexEnd = _a[1];
            return regions_1.Regions.column(indexStart, indexEnd);
        }
        case regions_1.RegionCardinality.FULL_ROWS: {
            var _b = getExpandedRegionIndices(focusedCell, newRegion, "row", "rows"), indexStart = _b[0], indexEnd = _b[1];
            return regions_1.Regions.row(indexStart, indexEnd);
        }
        case regions_1.RegionCardinality.CELLS:
            var _c = getExpandedRegionIndices(focusedCell, newRegion, "row", "rows"), rowIndexStart = _c[0], rowIndexEnd = _c[1];
            var _d = getExpandedRegionIndices(focusedCell, newRegion, "col", "cols"), colIndexStart = _d[0], colIndexEnd = _d[1];
            return regions_1.Regions.cell(rowIndexStart, colIndexStart, rowIndexEnd, colIndexEnd);
        default:
            // i.e. `case RegionCardinality.FULL_TABLE:`
            return regions_1.Regions.table();
    }
}
exports.expandFocusedRegion = expandFocusedRegion;
function getExpandedRegionIndices(focusedCell, newRegion, focusedCellDimension, regionDimension) {
    var sourceIndex = focusedCell[focusedCellDimension];
    var _a = newRegion[regionDimension], destinationIndex = _a[0], destinationIndexEnd = _a[1];
    if (destinationIndex !== destinationIndexEnd) {
        if (regionDimension === "rows") {
            throw new Error(Errors.TABLE_EXPAND_FOCUSED_REGION_MULTI_ROW_REGION);
        }
        else if (regionDimension === "cols") {
            throw new Error(Errors.TABLE_EXPAND_FOCUSED_REGION_MULTI_COLUMN_REGION);
        }
    }
    return sourceIndex <= destinationIndex ? [sourceIndex, destinationIndex] : [destinationIndex, sourceIndex];
}
//# sourceMappingURL=focusedCellUtils.js.map