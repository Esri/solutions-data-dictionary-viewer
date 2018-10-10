/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { RegionCardinality, Regions } from "../../regions";
import * as Errors from "../errors";
/**
 * Returns the `focusedSelectionIndex` if both the focused cell and that
 * property are defined, or the last index of `selectedRegions` otherwise. If
 * `selectedRegions` is empty, the function always returns `undefined`.
 */
export function getFocusedOrLastSelectedIndex(selectedRegions, focusedCell) {
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
/**
 * Returns the proper focused cell for the given set of initial conditions.
 */
export function getInitialFocusedCell(enableFocusedCell, focusedCellFromProps, focusedCellFromState, selectedRegions) {
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
        return tslib_1.__assign({}, Regions.getFocusCellCoordinatesFromRegion(selectedRegions[lastIndex]), { focusSelectionIndex: lastIndex });
    }
    else {
        // focus the top-left cell of the table
        return { col: 0, row: 0, focusSelectionIndex: 0 };
    }
}
/**
 * Returns `true` if the focused cell is located along the top boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionTop(region, focusedCell) {
    return region.rows != null && focusedCell.row === region.rows[0];
}
/**
 * Returns `true` if the focused cell is located along the bottom boundary of
 * the provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionBottom(region, focusedCell) {
    return region.rows != null && focusedCell.row === region.rows[1];
}
/**
 * Returns `true` if the focused cell is located along the left boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionLeft(region, focusedCell) {
    return region.cols != null && focusedCell.col === region.cols[0];
}
/**
 * Returns `true` if the focused cell is located along the right boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionRight(region, focusedCell) {
    return region.cols != null && focusedCell.col === region.cols[1];
}
/**
 * Returns a new cell-coordinates object that includes a focusSelectionIndex property.
 * The returned object will have the proper IFocusedCellCoordinates type.
 */
export function toFullCoordinates(cellCoords, focusSelectionIndex) {
    if (focusSelectionIndex === void 0) { focusSelectionIndex = 0; }
    return tslib_1.__assign({}, cellCoords, { focusSelectionIndex: focusSelectionIndex });
}
/**
 * Expands an existing region to new region based on the current focused cell.
 * The focused cell is an invariant and should not move as a result of this
 * operation. This function is used, for instance, to expand a selected region
 * on shift+click.
 */
export function expandFocusedRegion(focusedCell, newRegion) {
    switch (Regions.getRegionCardinality(newRegion)) {
        case RegionCardinality.FULL_COLUMNS: {
            var _a = getExpandedRegionIndices(focusedCell, newRegion, "col", "cols"), indexStart = _a[0], indexEnd = _a[1];
            return Regions.column(indexStart, indexEnd);
        }
        case RegionCardinality.FULL_ROWS: {
            var _b = getExpandedRegionIndices(focusedCell, newRegion, "row", "rows"), indexStart = _b[0], indexEnd = _b[1];
            return Regions.row(indexStart, indexEnd);
        }
        case RegionCardinality.CELLS:
            var _c = getExpandedRegionIndices(focusedCell, newRegion, "row", "rows"), rowIndexStart = _c[0], rowIndexEnd = _c[1];
            var _d = getExpandedRegionIndices(focusedCell, newRegion, "col", "cols"), colIndexStart = _d[0], colIndexEnd = _d[1];
            return Regions.cell(rowIndexStart, colIndexStart, rowIndexEnd, colIndexEnd);
        default:
            // i.e. `case RegionCardinality.FULL_TABLE:`
            return Regions.table();
    }
}
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