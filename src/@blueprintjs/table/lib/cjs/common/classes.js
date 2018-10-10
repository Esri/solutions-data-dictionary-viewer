"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@blueprintjs/core");
var NS = core_1.Classes.getClassNamespace();
exports.TABLE_BODY = NS + "-table-body";
exports.TABLE_BODY_CELLS = NS + "-table-body-cells";
exports.TABLE_BODY_SCROLL_CLIENT = NS + "-table-body-scroll-client";
exports.TABLE_BODY_VIRTUAL_CLIENT = NS + "-table-body-virtual-client";
exports.TABLE_BOTTOM_CONTAINER = NS + "-table-bottom-container";
exports.TABLE_CELL = NS + "-table-cell";
exports.TABLE_CELL_CLIENT = NS + "-table-cell-client";
exports.TABLE_CELL_GHOST = NS + "-table-cell-ghost";
exports.TABLE_CELL_INTERACTIVE = NS + "-table-cell-interactive";
exports.TABLE_CELL_LEDGER_EVEN = NS + "-table-cell-ledger-even";
exports.TABLE_CELL_LEDGER_ODD = NS + "-table-cell-ledger-odd";
exports.TABLE_COLUMN_HEADER_TR = NS + "-table-column-header-tr";
exports.TABLE_COLUMN_HEADERS = NS + "-table-column-headers";
exports.TABLE_COLUMN_HEADER_CELL = NS + "-table-column-header-cell";
exports.TABLE_COLUMN_NAME = NS + "-table-column-name";
exports.TABLE_COLUMN_NAME_TEXT = NS + "-table-column-name-text";
exports.TABLE_CONTAINER = NS + "-table-container";
exports.TABLE_DRAGGING = NS + "-table-dragging";
exports.TABLE_EDITABLE_NAME = NS + "-table-editable-name";
exports.TABLE_EDITABLE_TEXT = NS + "-table-editable-text";
exports.TABLE_FOCUS_REGION = NS + "-table-focus-region";
exports.TABLE_HAS_INTERACTION_BAR = NS + "-table-has-interaction-bar";
exports.TABLE_HAS_REORDER_HANDLE = NS + "-table-has-reorder-handle";
exports.TABLE_HEADER = NS + "-table-header";
exports.TABLE_HEADER_ACTIVE = NS + "-table-header-active";
exports.TABLE_HEADER_CONTENT = NS + "-table-header-content";
exports.TABLE_HEADER_REORDERABLE = NS + "-table-header-reorderable";
exports.TABLE_HEADER_SELECTED = NS + "-table-header-selected";
exports.TABLE_HORIZONTAL_CELL_DIVIDER = NS + "-table-horizontal-cell-divider";
exports.TABLE_HORIZONTAL_GUIDE = NS + "-table-horizontal-guide";
exports.TABLE_INTERACTION_BAR = NS + "-table-interaction-bar";
exports.TABLE_LAST_IN_COLUMN = NS + "-table-last-in-column";
exports.TABLE_LAST_IN_ROW = NS + "-table-last-in-row";
exports.TABLE_MENU = NS + "-table-menu";
exports.TABLE_NO_HORIZONTAL_SCROLL = NS + "-table-no-horizontal-scroll";
exports.TABLE_NO_LAYOUT = NS + "-table-no-layout";
exports.TABLE_NO_ROWS = NS + "-table-no-rows";
exports.TABLE_NO_VERTICAL_SCROLL = NS + "-table-no-vertical-scroll";
exports.TABLE_NO_WRAP_TEXT = NS + "-table-no-wrap-text";
exports.TABLE_NULL = NS + "-table-null";
exports.TABLE_OVERLAY = NS + "-table-overlay";
exports.TABLE_OVERLAY_LAYER = NS + "-table-overlay-layer";
exports.TABLE_OVERLAY_REORDERING_CURSOR = NS + "-table-reordering-cursor-overlay";
exports.TABLE_POPOVER_WHITESPACE_NORMAL = NS + "-table-popover-whitespace-normal";
exports.TABLE_POPOVER_WHITESPACE_PRE = NS + "-table-popover-whitespace-pre";
exports.TABLE_QUADRANT = NS + "-table-quadrant";
exports.TABLE_QUADRANT_BODY_CONTAINER = NS + "-table-quadrant-body-container";
exports.TABLE_QUADRANT_LEFT = NS + "-table-quadrant-left";
exports.TABLE_QUADRANT_MAIN = NS + "-table-quadrant-main";
exports.TABLE_QUADRANT_SCROLL_CONTAINER = NS + "-table-quadrant-scroll-container";
exports.TABLE_QUADRANT_STACK = NS + "-table-quadrant-stack";
exports.TABLE_QUADRANT_TOP = NS + "-table-quadrant-top";
exports.TABLE_QUADRANT_TOP_LEFT = NS + "-table-quadrant-top-left";
exports.TABLE_REGION = NS + "-table-region";
exports.TABLE_REORDER_HANDLE = NS + "-table-reorder-handle";
exports.TABLE_REORDER_HANDLE_TARGET = NS + "-table-reorder-handle-target";
exports.TABLE_REORDERING = NS + "-table-reordering";
exports.TABLE_RESIZE_GUIDES = NS + "-table-resize-guides";
exports.TABLE_RESIZE_HANDLE = NS + "-table-resize-handle";
exports.TABLE_RESIZE_HANDLE_TARGET = NS + "-table-resize-handle-target";
exports.TABLE_RESIZE_HORIZONTAL = NS + "-table-resize-horizontal";
exports.TABLE_RESIZE_SENSOR = NS + "-table-resize-sensor";
exports.TABLE_RESIZE_SENSOR_EXPAND = NS + "-table-resize-sensor-expand";
exports.TABLE_RESIZE_SENSOR_SHRINK = NS + "-table-resize-sensor-shrink";
exports.TABLE_RESIZE_VERTICAL = NS + "-table-resize-vertical";
exports.TABLE_ROUNDED_LAYOUT = NS + "-table-rounded-layout";
exports.TABLE_ROW_HEADERS = NS + "-table-row-headers";
exports.TABLE_ROW_HEADERS_CELLS_CONTAINER = NS + "-table-row-headers-cells-container";
exports.TABLE_ROW_NAME = NS + "-table-row-name";
exports.TABLE_ROW_NAME_TEXT = NS + "-table-row-name-text";
exports.TABLE_SELECTION_ENABLED = NS + "-table-selection-enabled";
exports.TABLE_SELECTION_REGION = NS + "-table-selection-region";
exports.TABLE_TH_MENU = NS + "-table-th-menu";
exports.TABLE_TH_MENU_CONTAINER = NS + "-table-th-menu-container";
exports.TABLE_TH_MENU_CONTAINER_BACKGROUND = NS + "-table-th-menu-container-background";
exports.TABLE_TH_MENU_OPEN = NS + "-table-th-menu-open";
exports.TABLE_THEAD = NS + "-table-thead";
exports.TABLE_TOP_CONTAINER = NS + "-table-top-container";
exports.TABLE_TRUNCATED_CELL = NS + "-table-truncated-cell";
exports.TABLE_TRUNCATED_FORMAT = NS + "-table-truncated-format";
exports.TABLE_TRUNCATED_FORMAT_TEXT = NS + "-table-truncated-format-text";
exports.TABLE_TRUNCATED_POPOVER = NS + "-table-truncated-popover";
exports.TABLE_TRUNCATED_POPOVER_TARGET = NS + "-table-truncated-popover-target";
exports.TABLE_TRUNCATED_TEXT = NS + "-table-truncated-text";
exports.TABLE_TRUNCATED_VALUE = NS + "-table-truncated-value";
exports.TABLE_VERTICAL_GUIDE = NS + "-table-vertical-guide";
/** Common code for row and column index class generator functions, since they're essentially the same. */
function dimensionIndexClass(classPrefix, index) {
    if (index == null) {
        return undefined;
    }
    if (typeof index === "number") {
        return "" + classPrefix + index;
    }
    return index.indexOf(classPrefix) === 0 ? index : "" + classPrefix + index;
}
/** Return CSS class for table colummn index, whether or not 'pt-table-col-' prefix is included. */
function columnIndexClass(columnIndex) {
    return dimensionIndexClass(NS + "-table-col-", columnIndex);
}
exports.columnIndexClass = columnIndexClass;
/** Return CSS class for table row index, whether or not 'pt-table-row-' prefix is included. */
function rowIndexClass(rowIndex) {
    return dimensionIndexClass(NS + "-table-row-", rowIndex);
}
exports.rowIndexClass = rowIndexClass;
/** Return CSS class for table colummn cell index, whether or not 'pt-table-cell-col-' prefix is included. */
function columnCellIndexClass(columnIndex) {
    return dimensionIndexClass(NS + "-table-cell-col-", columnIndex);
}
exports.columnCellIndexClass = columnCellIndexClass;
/** Return CSS class for table row cell index, whether or not 'pt-table-cell-row-' prefix is included. */
function rowCellIndexClass(rowIndex) {
    return dimensionIndexClass(NS + "-table-cell-row-", rowIndex);
}
exports.rowCellIndexClass = rowCellIndexClass;
//# sourceMappingURL=classes.js.map