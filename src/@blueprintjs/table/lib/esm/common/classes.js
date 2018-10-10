/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { Classes } from "@blueprintjs/core";
var NS = Classes.getClassNamespace();
export var TABLE_BODY = NS + "-table-body";
export var TABLE_BODY_CELLS = NS + "-table-body-cells";
export var TABLE_BODY_SCROLL_CLIENT = NS + "-table-body-scroll-client";
export var TABLE_BODY_VIRTUAL_CLIENT = NS + "-table-body-virtual-client";
export var TABLE_BOTTOM_CONTAINER = NS + "-table-bottom-container";
export var TABLE_CELL = NS + "-table-cell";
export var TABLE_CELL_CLIENT = NS + "-table-cell-client";
export var TABLE_CELL_GHOST = NS + "-table-cell-ghost";
export var TABLE_CELL_INTERACTIVE = NS + "-table-cell-interactive";
export var TABLE_CELL_LEDGER_EVEN = NS + "-table-cell-ledger-even";
export var TABLE_CELL_LEDGER_ODD = NS + "-table-cell-ledger-odd";
export var TABLE_COLUMN_HEADER_TR = NS + "-table-column-header-tr";
export var TABLE_COLUMN_HEADERS = NS + "-table-column-headers";
export var TABLE_COLUMN_HEADER_CELL = NS + "-table-column-header-cell";
export var TABLE_COLUMN_NAME = NS + "-table-column-name";
export var TABLE_COLUMN_NAME_TEXT = NS + "-table-column-name-text";
export var TABLE_CONTAINER = NS + "-table-container";
export var TABLE_DRAGGING = NS + "-table-dragging";
export var TABLE_EDITABLE_NAME = NS + "-table-editable-name";
export var TABLE_EDITABLE_TEXT = NS + "-table-editable-text";
export var TABLE_FOCUS_REGION = NS + "-table-focus-region";
export var TABLE_HAS_INTERACTION_BAR = NS + "-table-has-interaction-bar";
export var TABLE_HAS_REORDER_HANDLE = NS + "-table-has-reorder-handle";
export var TABLE_HEADER = NS + "-table-header";
export var TABLE_HEADER_ACTIVE = NS + "-table-header-active";
export var TABLE_HEADER_CONTENT = NS + "-table-header-content";
export var TABLE_HEADER_REORDERABLE = NS + "-table-header-reorderable";
export var TABLE_HEADER_SELECTED = NS + "-table-header-selected";
export var TABLE_HORIZONTAL_CELL_DIVIDER = NS + "-table-horizontal-cell-divider";
export var TABLE_HORIZONTAL_GUIDE = NS + "-table-horizontal-guide";
export var TABLE_INTERACTION_BAR = NS + "-table-interaction-bar";
export var TABLE_LAST_IN_COLUMN = NS + "-table-last-in-column";
export var TABLE_LAST_IN_ROW = NS + "-table-last-in-row";
export var TABLE_MENU = NS + "-table-menu";
export var TABLE_NO_HORIZONTAL_SCROLL = NS + "-table-no-horizontal-scroll";
export var TABLE_NO_LAYOUT = NS + "-table-no-layout";
export var TABLE_NO_ROWS = NS + "-table-no-rows";
export var TABLE_NO_VERTICAL_SCROLL = NS + "-table-no-vertical-scroll";
export var TABLE_NO_WRAP_TEXT = NS + "-table-no-wrap-text";
export var TABLE_NULL = NS + "-table-null";
export var TABLE_OVERLAY = NS + "-table-overlay";
export var TABLE_OVERLAY_LAYER = NS + "-table-overlay-layer";
export var TABLE_OVERLAY_REORDERING_CURSOR = NS + "-table-reordering-cursor-overlay";
export var TABLE_POPOVER_WHITESPACE_NORMAL = NS + "-table-popover-whitespace-normal";
export var TABLE_POPOVER_WHITESPACE_PRE = NS + "-table-popover-whitespace-pre";
export var TABLE_QUADRANT = NS + "-table-quadrant";
export var TABLE_QUADRANT_BODY_CONTAINER = NS + "-table-quadrant-body-container";
export var TABLE_QUADRANT_LEFT = NS + "-table-quadrant-left";
export var TABLE_QUADRANT_MAIN = NS + "-table-quadrant-main";
export var TABLE_QUADRANT_SCROLL_CONTAINER = NS + "-table-quadrant-scroll-container";
export var TABLE_QUADRANT_STACK = NS + "-table-quadrant-stack";
export var TABLE_QUADRANT_TOP = NS + "-table-quadrant-top";
export var TABLE_QUADRANT_TOP_LEFT = NS + "-table-quadrant-top-left";
export var TABLE_REGION = NS + "-table-region";
export var TABLE_REORDER_HANDLE = NS + "-table-reorder-handle";
export var TABLE_REORDER_HANDLE_TARGET = NS + "-table-reorder-handle-target";
export var TABLE_REORDERING = NS + "-table-reordering";
export var TABLE_RESIZE_GUIDES = NS + "-table-resize-guides";
export var TABLE_RESIZE_HANDLE = NS + "-table-resize-handle";
export var TABLE_RESIZE_HANDLE_TARGET = NS + "-table-resize-handle-target";
export var TABLE_RESIZE_HORIZONTAL = NS + "-table-resize-horizontal";
export var TABLE_RESIZE_SENSOR = NS + "-table-resize-sensor";
export var TABLE_RESIZE_SENSOR_EXPAND = NS + "-table-resize-sensor-expand";
export var TABLE_RESIZE_SENSOR_SHRINK = NS + "-table-resize-sensor-shrink";
export var TABLE_RESIZE_VERTICAL = NS + "-table-resize-vertical";
export var TABLE_ROUNDED_LAYOUT = NS + "-table-rounded-layout";
export var TABLE_ROW_HEADERS = NS + "-table-row-headers";
export var TABLE_ROW_HEADERS_CELLS_CONTAINER = NS + "-table-row-headers-cells-container";
export var TABLE_ROW_NAME = NS + "-table-row-name";
export var TABLE_ROW_NAME_TEXT = NS + "-table-row-name-text";
export var TABLE_SELECTION_ENABLED = NS + "-table-selection-enabled";
export var TABLE_SELECTION_REGION = NS + "-table-selection-region";
export var TABLE_TH_MENU = NS + "-table-th-menu";
export var TABLE_TH_MENU_CONTAINER = NS + "-table-th-menu-container";
export var TABLE_TH_MENU_CONTAINER_BACKGROUND = NS + "-table-th-menu-container-background";
export var TABLE_TH_MENU_OPEN = NS + "-table-th-menu-open";
export var TABLE_THEAD = NS + "-table-thead";
export var TABLE_TOP_CONTAINER = NS + "-table-top-container";
export var TABLE_TRUNCATED_CELL = NS + "-table-truncated-cell";
export var TABLE_TRUNCATED_FORMAT = NS + "-table-truncated-format";
export var TABLE_TRUNCATED_FORMAT_TEXT = NS + "-table-truncated-format-text";
export var TABLE_TRUNCATED_POPOVER = NS + "-table-truncated-popover";
export var TABLE_TRUNCATED_POPOVER_TARGET = NS + "-table-truncated-popover-target";
export var TABLE_TRUNCATED_TEXT = NS + "-table-truncated-text";
export var TABLE_TRUNCATED_VALUE = NS + "-table-truncated-value";
export var TABLE_VERTICAL_GUIDE = NS + "-table-vertical-guide";
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
export function columnIndexClass(columnIndex) {
    return dimensionIndexClass(NS + "-table-col-", columnIndex);
}
/** Return CSS class for table row index, whether or not 'pt-table-row-' prefix is included. */
export function rowIndexClass(rowIndex) {
    return dimensionIndexClass(NS + "-table-row-", rowIndex);
}
/** Return CSS class for table colummn cell index, whether or not 'pt-table-cell-col-' prefix is included. */
export function columnCellIndexClass(columnIndex) {
    return dimensionIndexClass(NS + "-table-cell-col-", columnIndex);
}
/** Return CSS class for table row cell index, whether or not 'pt-table-cell-row-' prefix is included. */
export function rowCellIndexClass(rowIndex) {
    return dimensionIndexClass(NS + "-table-cell-row-", rowIndex);
}
//# sourceMappingURL=classes.js.map