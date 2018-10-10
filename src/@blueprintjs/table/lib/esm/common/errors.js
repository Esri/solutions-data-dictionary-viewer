/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
var ns = "[Blueprint Table]";
// const deprec = `${ns} DEPRECATION:`;
export var QUADRANT_ON_SCROLL_UNNECESSARILY_DEFINED = ns + " <TableQuadrant> onScroll need not be defined for any quadrant aside from the MAIN quadrant.";
export var TABLE_EXPAND_FOCUSED_REGION_MULTI_COLUMN_REGION = ns + " <Table> Cannot expand a FULL_COLUMNS selection using a multi-column region.";
export var TABLE_EXPAND_FOCUSED_REGION_MULTI_ROW_REGION = ns + " <Table> Cannot expand a FULL_COLUMNS selection using a multi-row region.";
export var TABLE_NON_COLUMN_CHILDREN_WARNING = ns + " <Table> Children of Table must be Columns\"";
export var TABLE_NUM_FROZEN_COLUMNS_BOUND_WARNING = ns +
    " <Table> numFrozenColumns must be in less than or equal to the number of columns. Clamping the value for you.";
export var TABLE_NUM_FROZEN_COLUMNS_NEGATIVE = ns + " <Table> requires numFrozenColumns to be greater than or equal to 0.";
export var TABLE_NUM_FROZEN_ROWS_BOUND_WARNING = ns + " <Table> numFrozenRows must be less than or equal to numRows. Clamping the value for you.";
export var TABLE_NUM_FROZEN_ROWS_NEGATIVE = ns + " <Table> requires numFrozenRows to be greater than or equal to 0.";
export var TABLE_NUM_ROWS_ROW_HEIGHTS_MISMATCH = ns + " <Table> requires rowHeights.length to equal numRows when both props are provided.";
export var TABLE_NUM_ROWS_NEGATIVE = ns + " <Table> requires numRows to be greater than or equal to 0.";
export var TABLE_NUM_COLUMNS_COLUMN_WIDTHS_MISMATCH = ns + " <Table> requires columnWidths.length to equal the number of <Column>s if provided.";
//# sourceMappingURL=errors.js.map