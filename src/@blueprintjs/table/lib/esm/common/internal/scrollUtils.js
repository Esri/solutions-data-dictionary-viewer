/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { RegionCardinality, Regions } from "../../regions";
/**
 * Returns the scroll{Left,Top} offsets of the provided region based on its
 * cardinality.
 */
export function getScrollPositionForRegion(region, currScrollLeft, currScrollTop, getLeftOffset, getTopOffset, numFrozenRows, numFrozenColumns) {
    if (numFrozenRows === void 0) { numFrozenRows = 0; }
    if (numFrozenColumns === void 0) { numFrozenColumns = 0; }
    var cardinality = Regions.getRegionCardinality(region);
    var scrollTop = currScrollTop;
    var scrollLeft = currScrollLeft;
    // if these were max-frozen-index values, we would have added 1 before passing to the get*Offset
    // functions, but the counts are already 1-indexed, so we can just pass those.
    var frozenColumnsCumulativeWidth = getLeftOffset(numFrozenColumns);
    var frozenRowsCumulativeHeight = getTopOffset(numFrozenRows);
    switch (cardinality) {
        case RegionCardinality.CELLS: {
            // scroll to the top-left corner of the block of cells
            var topOffset = getTopOffset(region.rows[0]);
            var leftOffset = getLeftOffset(region.cols[0]);
            scrollTop = getClampedScrollPosition(topOffset, frozenRowsCumulativeHeight);
            scrollLeft = getClampedScrollPosition(leftOffset, frozenColumnsCumulativeWidth);
            break;
        }
        case RegionCardinality.FULL_ROWS: {
            // scroll to the top of the row block
            var topOffset = getTopOffset(region.rows[0]);
            scrollTop = getClampedScrollPosition(topOffset, frozenRowsCumulativeHeight);
            break;
        }
        case RegionCardinality.FULL_COLUMNS: {
            // scroll to the left side of the column block
            var leftOffset = getLeftOffset(region.cols[0]);
            scrollLeft = getClampedScrollPosition(leftOffset, frozenColumnsCumulativeWidth);
            break;
        }
        default: {
            // if it's a FULL_TABLE region, scroll back to the top-left cell of the table
            scrollTop = 0;
            scrollLeft = 0;
            break;
        }
    }
    return { scrollLeft: scrollLeft, scrollTop: scrollTop };
}
/**
 * Returns the thickness of the target scroll bar in pixels.
 * If the target scroll bar is not present, 0 is returned.
 */
export function measureScrollBarThickness(element, direction) {
    // offset size includes the scroll bar. client size does not.
    // the difference gives the thickness of the scroll bar.
    return direction === "horizontal"
        ? element.offsetHeight - element.clientHeight
        : element.offsetWidth - element.clientWidth;
}
/**
 * Adjust the scroll position to align content just beyond the frozen region, if necessary.
 */
function getClampedScrollPosition(scrollOffset, frozenRegionCumulativeSize) {
    // if the new scroll offset falls within the frozen region, clamp it to 0
    return Math.max(scrollOffset - frozenRegionCumulativeSize, 0);
}
//# sourceMappingURL=scrollUtils.js.map