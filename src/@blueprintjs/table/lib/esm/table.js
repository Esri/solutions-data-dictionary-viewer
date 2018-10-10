/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { AbstractComponent, Hotkey, Hotkeys, HotkeysTarget, Utils as CoreUtils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { Column } from "./column";
import * as Classes from "./common/classes";
import { Clipboard } from "./common/clipboard";
import { columnInteractionBarContextTypes } from "./common/context";
import { Direction } from "./common/direction";
import * as Errors from "./common/errors";
import { Grid } from "./common/grid";
import * as FocusedCellUtils from "./common/internal/focusedCellUtils";
import * as ScrollUtils from "./common/internal/scrollUtils";
import * as SelectionUtils from "./common/internal/selectionUtils";
import { Rect } from "./common/rect";
import { RenderMode } from "./common/renderMode";
import { Utils } from "./common/utils";
import { ColumnHeader } from "./headers/columnHeader";
import { ColumnHeaderCell } from "./headers/columnHeaderCell";
import { renderDefaultRowHeader, RowHeader } from "./headers/rowHeader";
import { ResizeSensor } from "./interactions/resizeSensor";
import { GuideLayer } from "./layers/guides";
import { RegionLayer } from "./layers/regions";
import { Locator } from "./locator";
import { QuadrantType } from "./quadrants/tableQuadrant";
import { TableQuadrantStack } from "./quadrants/tableQuadrantStack";
import { ColumnLoadingOption, RegionCardinality, Regions, SelectionModes, TableLoadingOption, } from "./regions";
import { TableBody } from "./tableBody";
var Table = /** @class */ (function (_super) {
    tslib_1.__extends(Table, _super);
    function Table(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.refHandlers = {
            cellContainer: function (ref) { return (_this.cellContainerElement = ref); },
            columnHeader: function (ref) { return (_this.columnHeaderElement = ref); },
            mainQuadrant: function (ref) { return (_this.mainQuadrantElement = ref); },
            quadrantStack: function (ref) { return (_this.quadrantStackInstance = ref); },
            rootTable: function (ref) { return (_this.rootTableElement = ref); },
            rowHeader: function (ref) { return (_this.rowHeaderElement = ref); },
            scrollContainer: function (ref) { return (_this.scrollContainerElement = ref); },
        };
        // when true, we'll need to imperatively synchronize quadrant views after
        // the update. this variable lets us avoid expensively diff'ing columnWidths
        // and rowHeights in <TableQuadrantStack> on each update.
        _this.didUpdateColumnOrRowSizes = false;
        // this value is set to `true` when all cells finish mounting for the first
        // time. it serves as a signal that we can switch to batch rendering.
        _this.didCompletelyMount = false;
        // Selection resize
        // ----------------
        _this.handleSelectionResizeUp = function (e) { return _this.handleSelectionResize(e, Direction.UP); };
        _this.handleSelectionResizeDown = function (e) { return _this.handleSelectionResize(e, Direction.DOWN); };
        _this.handleSelectionResizeLeft = function (e) { return _this.handleSelectionResize(e, Direction.LEFT); };
        _this.handleSelectionResizeRight = function (e) { return _this.handleSelectionResize(e, Direction.RIGHT); };
        _this.handleSelectionResize = function (e, direction) {
            e.preventDefault();
            e.stopPropagation();
            var _a = _this.state, focusedCell = _a.focusedCell, selectedRegions = _a.selectedRegions;
            if (selectedRegions.length === 0) {
                return;
            }
            var index = FocusedCellUtils.getFocusedOrLastSelectedIndex(selectedRegions, focusedCell);
            var region = selectedRegions[index];
            var nextRegion = SelectionUtils.resizeRegion(region, direction, focusedCell);
            _this.updateSelectedRegionAtIndex(nextRegion, index);
        };
        _this.handleCopy = function (e) {
            var _a = _this.props, getCellClipboardData = _a.getCellClipboardData, onCopy = _a.onCopy;
            var selectedRegions = _this.state.selectedRegions;
            if (getCellClipboardData == null) {
                return;
            }
            // prevent "real" copy from being called
            e.preventDefault();
            e.stopPropagation();
            var cells = Regions.enumerateUniqueCells(selectedRegions, _this.grid.numRows, _this.grid.numCols);
            var sparse = Regions.sparseMapCells(cells, getCellClipboardData);
            if (sparse != null) {
                var success = Clipboard.copyCells(sparse);
                CoreUtils.safeInvoke(onCopy, success);
            }
        };
        _this.renderMenu = function (refHandler) {
            var classes = classNames(Classes.TABLE_MENU, (_a = {},
                _a[Classes.TABLE_SELECTION_ENABLED] = _this.isSelectionModeEnabled(RegionCardinality.FULL_TABLE),
                _a));
            return (React.createElement("div", { className: classes, ref: refHandler, onMouseDown: _this.handleMenuMouseDown }, _this.maybeRenderRegions(_this.styleMenuRegion)));
            var _a;
        };
        _this.handleMenuMouseDown = function (e) {
            // the shift+click interaction expands the region from the focused cell.
            // thus, if shift is pressed we shouldn't move the focused cell.
            _this.selectAll(!e.shiftKey);
        };
        _this.selectAll = function (shouldUpdateFocusedCell) {
            var selectionHandler = _this.getEnabledSelectionHandler(RegionCardinality.FULL_TABLE);
            // clicking on upper left hand corner sets selection to "all"
            // regardless of current selection state (clicking twice does not deselect table)
            selectionHandler([Regions.table()]);
            if (shouldUpdateFocusedCell) {
                var newFocusedCellCoordinates = Regions.getFocusCellCoordinatesFromRegion(Regions.table());
                _this.handleFocus(FocusedCellUtils.toFullCoordinates(newFocusedCellCoordinates));
            }
        };
        _this.handleSelectAllHotkey = function (e) {
            // prevent "real" select all from happening as well
            e.preventDefault();
            e.stopPropagation();
            // selecting-all via the keyboard should not move the focused cell.
            _this.selectAll(false);
        };
        _this.columnHeaderCellRenderer = function (columnIndex) {
            var props = _this.getColumnProps(columnIndex);
            var id = props.id, loadingOptions = props.loadingOptions, cellRenderer = props.cellRenderer, columnHeaderCellRenderer = props.columnHeaderCellRenderer, spreadableProps = tslib_1.__rest(props, ["id", "loadingOptions", "cellRenderer", "columnHeaderCellRenderer"]);
            var columnLoading = _this.hasLoadingOption(loadingOptions, ColumnLoadingOption.HEADER);
            if (columnHeaderCellRenderer != null) {
                var columnHeaderCell = columnHeaderCellRenderer(columnIndex);
                var columnHeaderCellLoading = columnHeaderCell.props.loading;
                var columnHeaderCellProps = {
                    loading: columnHeaderCellLoading != null ? columnHeaderCellLoading : columnLoading,
                };
                return React.cloneElement(columnHeaderCell, columnHeaderCellProps);
            }
            var baseProps = tslib_1.__assign({ index: columnIndex, loading: columnLoading }, spreadableProps);
            if (props.name != null) {
                return React.createElement(ColumnHeaderCell, tslib_1.__assign({}, baseProps));
            }
            else {
                return React.createElement(ColumnHeaderCell, tslib_1.__assign({}, baseProps, { name: Utils.toBase26Alpha(columnIndex) }));
            }
        };
        _this.renderColumnHeader = function (refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly) {
            if (showFrozenColumnsOnly === void 0) { showFrozenColumnsOnly = false; }
            var _a = _this.state, focusedCell = _a.focusedCell, selectedRegions = _a.selectedRegions, viewportRect = _a.viewportRect;
            var _b = _this.props, enableMultipleSelection = _b.enableMultipleSelection, enableGhostCells = _b.enableGhostCells, enableColumnReordering = _b.enableColumnReordering, enableColumnResizing = _b.enableColumnResizing, loadingOptions = _b.loadingOptions, maxColumnWidth = _b.maxColumnWidth, minColumnWidth = _b.minColumnWidth, selectedRegionTransform = _b.selectedRegionTransform;
            var classes = classNames(Classes.TABLE_COLUMN_HEADERS, (_c = {},
                _c[Classes.TABLE_SELECTION_ENABLED] = _this.isSelectionModeEnabled(RegionCardinality.FULL_COLUMNS),
                _c));
            var columnIndices = _this.grid.getColumnIndicesInRect(viewportRect, enableGhostCells);
            var columnIndexStart = showFrozenColumnsOnly ? 0 : columnIndices.columnIndexStart;
            var columnIndexEnd = showFrozenColumnsOnly ? _this.getMaxFrozenColumnIndex() : columnIndices.columnIndexEnd;
            return (React.createElement("div", { className: classes },
                React.createElement(ColumnHeader, { enableMultipleSelection: enableMultipleSelection, cellRenderer: _this.columnHeaderCellRenderer, focusedCell: focusedCell, grid: _this.grid, isReorderable: enableColumnReordering, isResizable: enableColumnResizing, loading: _this.hasLoadingOption(loadingOptions, TableLoadingOption.COLUMN_HEADERS), locator: _this.locator, maxColumnWidth: maxColumnWidth, measurableElementRef: refHandler, minColumnWidth: minColumnWidth, onColumnWidthChanged: _this.handleColumnWidthChanged, onFocusedCell: _this.handleFocus, onLayoutLock: _this.handleLayoutLock, onReordered: _this.handleColumnsReordered, onReordering: reorderingHandler, onResizeGuide: resizeHandler, onSelection: _this.getEnabledSelectionHandler(RegionCardinality.FULL_COLUMNS), selectedRegions: selectedRegions, selectedRegionTransform: selectedRegionTransform, columnIndexStart: columnIndexStart, columnIndexEnd: columnIndexEnd }, _this.props.children),
                _this.maybeRenderRegions(_this.styleColumnHeaderRegion)));
            var _c;
        };
        _this.renderRowHeader = function (refHandler, resizeHandler, reorderingHandler, showFrozenRowsOnly) {
            if (showFrozenRowsOnly === void 0) { showFrozenRowsOnly = false; }
            var _a = _this.state, focusedCell = _a.focusedCell, selectedRegions = _a.selectedRegions, viewportRect = _a.viewportRect;
            var _b = _this.props, enableMultipleSelection = _b.enableMultipleSelection, enableGhostCells = _b.enableGhostCells, enableRowReordering = _b.enableRowReordering, enableRowResizing = _b.enableRowResizing, loadingOptions = _b.loadingOptions, maxRowHeight = _b.maxRowHeight, minRowHeight = _b.minRowHeight, rowHeaderCellRenderer = _b.rowHeaderCellRenderer, selectedRegionTransform = _b.selectedRegionTransform;
            var classes = classNames(Classes.TABLE_ROW_HEADERS, (_c = {},
                _c[Classes.TABLE_SELECTION_ENABLED] = _this.isSelectionModeEnabled(RegionCardinality.FULL_ROWS),
                _c));
            var rowIndices = _this.grid.getRowIndicesInRect(viewportRect, enableGhostCells);
            var rowIndexStart = showFrozenRowsOnly ? 0 : rowIndices.rowIndexStart;
            var rowIndexEnd = showFrozenRowsOnly ? _this.getMaxFrozenRowIndex() : rowIndices.rowIndexEnd;
            return (React.createElement("div", { className: classes, ref: refHandler },
                React.createElement(RowHeader, { enableMultipleSelection: enableMultipleSelection, focusedCell: focusedCell, grid: _this.grid, locator: _this.locator, isReorderable: enableRowReordering, isResizable: enableRowResizing, loading: _this.hasLoadingOption(loadingOptions, TableLoadingOption.ROW_HEADERS), maxRowHeight: maxRowHeight, minRowHeight: minRowHeight, onFocusedCell: _this.handleFocus, onLayoutLock: _this.handleLayoutLock, onResizeGuide: resizeHandler, onReordered: _this.handleRowsReordered, onReordering: reorderingHandler, onRowHeightChanged: _this.handleRowHeightChanged, onSelection: _this.getEnabledSelectionHandler(RegionCardinality.FULL_ROWS), rowHeaderCellRenderer: rowHeaderCellRenderer, selectedRegions: selectedRegions, selectedRegionTransform: selectedRegionTransform, rowIndexStart: rowIndexStart, rowIndexEnd: rowIndexEnd }),
                _this.maybeRenderRegions(_this.styleRowHeaderRegion)));
            var _c;
        };
        _this.bodyCellRenderer = function (rowIndex, columnIndex) {
            var _a = _this.getColumnProps(columnIndex), id = _a.id, loadingOptions = _a.loadingOptions, cellRenderer = _a.cellRenderer, columnHeaderCellRenderer = _a.columnHeaderCellRenderer, name = _a.name, nameRenderer = _a.nameRenderer, restColumnProps = tslib_1.__rest(_a, ["id", "loadingOptions", "cellRenderer", "columnHeaderCellRenderer", "name", "nameRenderer"]);
            var cell = cellRenderer(rowIndex, columnIndex);
            var _b = cell.props.loading, loading = _b === void 0 ? _this.hasLoadingOption(loadingOptions, ColumnLoadingOption.CELLS) : _b;
            var cellProps = tslib_1.__assign({}, restColumnProps, { loading: loading });
            return React.cloneElement(cell, cellProps);
        };
        _this.renderBody = function (quadrantType, showFrozenRowsOnly, showFrozenColumnsOnly) {
            if (showFrozenRowsOnly === void 0) { showFrozenRowsOnly = false; }
            if (showFrozenColumnsOnly === void 0) { showFrozenColumnsOnly = false; }
            var _a = _this.state, focusedCell = _a.focusedCell, numFrozenColumns = _a.numFrozenColumnsClamped, numFrozenRows = _a.numFrozenRowsClamped, selectedRegions = _a.selectedRegions, viewportRect = _a.viewportRect;
            var _b = _this.props, enableMultipleSelection = _b.enableMultipleSelection, enableGhostCells = _b.enableGhostCells, loadingOptions = _b.loadingOptions, bodyContextMenuRenderer = _b.bodyContextMenuRenderer, selectedRegionTransform = _b.selectedRegionTransform;
            var rowIndices = _this.grid.getRowIndicesInRect(viewportRect, enableGhostCells);
            var columnIndices = _this.grid.getColumnIndicesInRect(viewportRect, enableGhostCells);
            // start beyond the frozen area if rendering unrelated quadrants, so we
            // don't render duplicate cells underneath the frozen ones.
            var columnIndexStart = showFrozenColumnsOnly ? 0 : columnIndices.columnIndexStart + numFrozenColumns;
            var rowIndexStart = showFrozenRowsOnly ? 0 : rowIndices.rowIndexStart + numFrozenRows;
            // if rendering frozen rows/columns, subtract one to convert to
            // 0-indexing. if the 1-indexed value is 0, this sets the end index
            // to -1, which avoids rendering absent frozen rows/columns at all.
            var columnIndexEnd = showFrozenColumnsOnly ? numFrozenColumns - 1 : columnIndices.columnIndexEnd;
            var rowIndexEnd = showFrozenRowsOnly ? numFrozenRows - 1 : rowIndices.rowIndexEnd;
            // the main quadrant contains all cells in the table, so listen only to that quadrant
            var onCompleteRender = quadrantType === QuadrantType.MAIN ? _this.handleCompleteRender : undefined;
            return (React.createElement("div", null,
                React.createElement(TableBody, { enableMultipleSelection: enableMultipleSelection, cellRenderer: _this.bodyCellRenderer, focusedCell: focusedCell, grid: _this.grid, loading: _this.hasLoadingOption(loadingOptions, TableLoadingOption.CELLS), locator: _this.locator, onCompleteRender: onCompleteRender, onFocusedCell: _this.handleFocus, onSelection: _this.getEnabledSelectionHandler(RegionCardinality.CELLS), bodyContextMenuRenderer: bodyContextMenuRenderer, renderMode: _this.getNormalizedRenderMode(), selectedRegions: selectedRegions, selectedRegionTransform: selectedRegionTransform, viewportRect: viewportRect, columnIndexStart: columnIndexStart, columnIndexEnd: columnIndexEnd, rowIndexStart: rowIndexStart, rowIndexEnd: rowIndexEnd, numFrozenColumns: showFrozenColumnsOnly ? numFrozenColumns : undefined, numFrozenRows: showFrozenRowsOnly ? numFrozenRows : undefined }),
                _this.maybeRenderRegions(_this.styleBodyRegion, quadrantType)));
        };
        _this.handleCompleteRender = function () {
            // the first onCompleteRender is triggered before the viewportRect is
            // defined and the second after the viewportRect has been set. the cells
            // will only actually render once the viewportRect is defined though, so
            // we defer invoking onCompleteRender until that check passes.
            if (_this.state.viewportRect != null) {
                CoreUtils.safeInvoke(_this.props.onCompleteRender);
                _this.didCompletelyMount = true;
            }
        };
        _this.handleFocusMoveLeft = function (e) { return _this.handleFocusMove(e, "left"); };
        _this.handleFocusMoveLeftInternal = function (e) { return _this.handleFocusMoveInternal(e, "left"); };
        _this.handleFocusMoveRight = function (e) { return _this.handleFocusMove(e, "right"); };
        _this.handleFocusMoveRightInternal = function (e) { return _this.handleFocusMoveInternal(e, "right"); };
        _this.handleFocusMoveUp = function (e) { return _this.handleFocusMove(e, "up"); };
        _this.handleFocusMoveUpInternal = function (e) { return _this.handleFocusMoveInternal(e, "up"); };
        _this.handleFocusMoveDown = function (e) { return _this.handleFocusMove(e, "down"); };
        _this.handleFocusMoveDownInternal = function (e) { return _this.handleFocusMoveInternal(e, "down"); };
        _this.styleBodyRegion = function (region, quadrantType) {
            var numFrozenColumns = _this.props.numFrozenColumns;
            var cardinality = Regions.getRegionCardinality(region);
            var style = _this.grid.getRegionStyle(region);
            // ensure we're not showing borders at the boundary of the frozen-columns area
            var canHideRightBorder = (quadrantType === QuadrantType.TOP_LEFT || quadrantType === QuadrantType.LEFT) &&
                numFrozenColumns != null &&
                numFrozenColumns > 0;
            var fixedHeight = _this.grid.getHeight();
            var fixedWidth = _this.grid.getWidth();
            // include a correction in some cases to hide borders along quadrant boundaries
            var alignmentCorrection = 1;
            var alignmentCorrectionString = "-" + alignmentCorrection + "px";
            switch (cardinality) {
                case RegionCardinality.CELLS:
                    return style;
                case RegionCardinality.FULL_COLUMNS:
                    style.top = alignmentCorrectionString;
                    style.height = fixedHeight + alignmentCorrection;
                    return style;
                case RegionCardinality.FULL_ROWS:
                    style.left = alignmentCorrectionString;
                    style.width = fixedWidth + alignmentCorrection;
                    if (canHideRightBorder) {
                        style.right = alignmentCorrectionString;
                    }
                    return style;
                case RegionCardinality.FULL_TABLE:
                    style.left = alignmentCorrectionString;
                    style.top = alignmentCorrectionString;
                    style.width = fixedWidth + alignmentCorrection;
                    style.height = fixedHeight + alignmentCorrection;
                    if (canHideRightBorder) {
                        style.right = alignmentCorrectionString;
                    }
                    return style;
                default:
                    return { display: "none" };
            }
        };
        _this.styleMenuRegion = function (region) {
            var viewportRect = _this.state.viewportRect;
            if (viewportRect == null) {
                return {};
            }
            var cardinality = Regions.getRegionCardinality(region);
            var style = _this.grid.getRegionStyle(region);
            switch (cardinality) {
                case RegionCardinality.FULL_TABLE:
                    style.right = "0px";
                    style.bottom = "0px";
                    style.top = "0px";
                    style.left = "0px";
                    style.borderBottom = "none";
                    style.borderRight = "none";
                    return style;
                default:
                    return { display: "none" };
            }
        };
        _this.styleColumnHeaderRegion = function (region) {
            var viewportRect = _this.state.viewportRect;
            if (viewportRect == null) {
                return {};
            }
            var cardinality = Regions.getRegionCardinality(region);
            var style = _this.grid.getRegionStyle(region);
            switch (cardinality) {
                case RegionCardinality.FULL_TABLE:
                    style.left = "-1px";
                    style.borderLeft = "none";
                    style.bottom = "-1px";
                    return style;
                case RegionCardinality.FULL_COLUMNS:
                    style.bottom = "-1px";
                    return style;
                default:
                    return { display: "none" };
            }
        };
        _this.styleRowHeaderRegion = function (region) {
            var viewportRect = _this.state.viewportRect;
            if (viewportRect == null) {
                return {};
            }
            var cardinality = Regions.getRegionCardinality(region);
            var style = _this.grid.getRegionStyle(region);
            switch (cardinality) {
                case RegionCardinality.FULL_TABLE:
                    style.top = "-1px";
                    style.borderTop = "none";
                    style.right = "-1px";
                    return style;
                case RegionCardinality.FULL_ROWS:
                    style.right = "-1px";
                    return style;
                default:
                    return { display: "none" };
            }
        };
        _this.handleColumnWidthChanged = function (columnIndex, width) {
            var selectedRegions = _this.state.selectedRegions;
            var columnWidths = _this.state.columnWidths.slice();
            if (Regions.hasFullTable(selectedRegions)) {
                for (var col = 0; col < columnWidths.length; col++) {
                    columnWidths[col] = width;
                }
            }
            if (Regions.hasFullColumn(selectedRegions, columnIndex)) {
                Regions.eachUniqueFullColumn(selectedRegions, function (col) {
                    columnWidths[col] = width;
                });
            }
            else {
                columnWidths[columnIndex] = width;
            }
            _this.invalidateGrid();
            _this.didUpdateColumnOrRowSizes = true;
            _this.setState({ columnWidths: columnWidths });
            var onColumnWidthChanged = _this.props.onColumnWidthChanged;
            if (onColumnWidthChanged != null) {
                onColumnWidthChanged(columnIndex, width);
            }
        };
        _this.handleRowHeightChanged = function (rowIndex, height) {
            var selectedRegions = _this.state.selectedRegions;
            var rowHeights = _this.state.rowHeights.slice();
            if (Regions.hasFullTable(selectedRegions)) {
                for (var row = 0; row < rowHeights.length; row++) {
                    rowHeights[row] = height;
                }
            }
            if (Regions.hasFullRow(selectedRegions, rowIndex)) {
                Regions.eachUniqueFullRow(selectedRegions, function (row) {
                    rowHeights[row] = height;
                });
            }
            else {
                rowHeights[rowIndex] = height;
            }
            _this.invalidateGrid();
            _this.didUpdateColumnOrRowSizes = true;
            _this.setState({ rowHeights: rowHeights });
            var onRowHeightChanged = _this.props.onRowHeightChanged;
            if (onRowHeightChanged != null) {
                onRowHeightChanged(rowIndex, height);
            }
        };
        _this.handleRootScroll = function (_event) {
            // Bug #211 - Native browser text selection events can cause the root
            // element to scroll even though it has a overflow:hidden style. The
            // only viable solution to this is to unscroll the element after the
            // browser scrolls it.
            if (_this.rootTableElement != null) {
                _this.rootTableElement.scrollLeft = 0;
                _this.rootTableElement.scrollTop = 0;
            }
        };
        _this.handleBodyScroll = function (event) {
            // Prevent the event from propagating to avoid a resize event on the
            // resize sensor.
            event.stopPropagation();
            if (_this.locator != null && !_this.state.isLayoutLocked) {
                var viewportRect = _this.locator.getViewportRect();
                _this.updateViewportRect(viewportRect);
            }
        };
        _this.clearSelection = function (_selectedRegions) {
            _this.handleSelection([]);
        };
        // no good way to call arrow-key keyboard events from tests
        /* istanbul ignore next */
        _this.handleFocusMove = function (e, direction) {
            e.preventDefault();
            e.stopPropagation();
            var focusedCell = _this.state.focusedCell;
            if (focusedCell == null) {
                // halt early if we have a selectedRegionTransform or something else in play that nixes
                // the focused cell.
                return;
            }
            var newFocusedCell = { col: focusedCell.col, row: focusedCell.row, focusSelectionIndex: 0 };
            switch (direction) {
                case "up":
                    newFocusedCell.row -= 1;
                    break;
                case "down":
                    newFocusedCell.row += 1;
                    break;
                case "left":
                    newFocusedCell.col -= 1;
                    break;
                case "right":
                    newFocusedCell.col += 1;
                    break;
                default:
                    break;
            }
            if (newFocusedCell.row < 0 ||
                newFocusedCell.row >= _this.grid.numRows ||
                newFocusedCell.col < 0 ||
                newFocusedCell.col >= _this.grid.numCols) {
                return;
            }
            // change selection to match new focus cell location
            var newSelectionRegions = [Regions.cell(newFocusedCell.row, newFocusedCell.col)];
            _this.handleSelection(newSelectionRegions);
            _this.handleFocus(newFocusedCell);
            // keep the focused cell in view
            _this.scrollBodyToFocusedCell(newFocusedCell);
        };
        // no good way to call arrow-key keyboard events from tests
        /* istanbul ignore next */
        _this.handleFocusMoveInternal = function (e, direction) {
            e.preventDefault();
            e.stopPropagation();
            var _a = _this.state, focusedCell = _a.focusedCell, selectedRegions = _a.selectedRegions;
            if (focusedCell == null) {
                // halt early if we have a selectedRegionTransform or something else in play that nixes
                // the focused cell.
                return;
            }
            var newFocusedCell = {
                col: focusedCell.col,
                focusSelectionIndex: focusedCell.focusSelectionIndex,
                row: focusedCell.row,
            };
            // if we're not in any particular focus cell region, and one exists, go to the first cell of the first one
            if (focusedCell.focusSelectionIndex == null && selectedRegions.length > 0) {
                var focusCellRegion = Regions.getCellRegionFromRegion(selectedRegions[0], _this.grid.numRows, _this.grid.numCols);
                newFocusedCell = {
                    col: focusCellRegion.cols[0],
                    focusSelectionIndex: 0,
                    row: focusCellRegion.rows[0],
                };
            }
            else {
                if (selectedRegions.length === 0) {
                    _this.handleFocusMove(e, direction);
                    return;
                }
                var focusCellRegion = Regions.getCellRegionFromRegion(selectedRegions[focusedCell.focusSelectionIndex], _this.grid.numRows, _this.grid.numCols);
                if (focusCellRegion.cols[0] === focusCellRegion.cols[1] &&
                    focusCellRegion.rows[0] === focusCellRegion.rows[1] &&
                    selectedRegions.length === 1) {
                    _this.handleFocusMove(e, direction);
                    return;
                }
                switch (direction) {
                    case "up":
                        newFocusedCell = _this.moveFocusCell("row", "col", true, newFocusedCell, focusCellRegion);
                        break;
                    case "left":
                        newFocusedCell = _this.moveFocusCell("col", "row", true, newFocusedCell, focusCellRegion);
                        break;
                    case "down":
                        newFocusedCell = _this.moveFocusCell("row", "col", false, newFocusedCell, focusCellRegion);
                        break;
                    case "right":
                        newFocusedCell = _this.moveFocusCell("col", "row", false, newFocusedCell, focusCellRegion);
                        break;
                    default:
                        break;
                }
            }
            if (newFocusedCell.row < 0 ||
                newFocusedCell.row >= _this.grid.numRows ||
                newFocusedCell.col < 0 ||
                newFocusedCell.col >= _this.grid.numCols) {
                return;
            }
            _this.handleFocus(newFocusedCell);
            // keep the focused cell in view
            _this.scrollBodyToFocusedCell(newFocusedCell);
        };
        _this.scrollBodyToFocusedCell = function (focusedCell) {
            var row = focusedCell.row, col = focusedCell.col;
            var viewportRect = _this.state.viewportRect;
            // sort keys in normal CSS position order (per the trusty TRBL/"trouble" acronym)
            // tslint:disable:object-literal-sort-keys
            var viewportBounds = {
                top: viewportRect.top,
                right: viewportRect.left + viewportRect.width,
                bottom: viewportRect.top + viewportRect.height,
                left: viewportRect.left,
            };
            var focusedCellBounds = {
                top: _this.grid.getCumulativeHeightBefore(row),
                right: _this.grid.getCumulativeWidthAt(col),
                bottom: _this.grid.getCumulativeHeightAt(row),
                left: _this.grid.getCumulativeWidthBefore(col),
            };
            // tslint:enable:object-literal-sort-keys
            var focusedCellWidth = focusedCellBounds.right - focusedCellBounds.left;
            var focusedCellHeight = focusedCellBounds.bottom - focusedCellBounds.top;
            var isFocusedCellWiderThanViewport = focusedCellWidth > viewportRect.width;
            var isFocusedCellTallerThanViewport = focusedCellHeight > viewportRect.height;
            var nextScrollTop = viewportRect.top;
            var nextScrollLeft = viewportRect.left;
            // keep the top end of an overly tall focused cell in view when moving left and right
            // (without this OR check, the body seesaws to fit the top end, then the bottom end, etc.)
            if (focusedCellBounds.top < viewportBounds.top || isFocusedCellTallerThanViewport) {
                // scroll up (minus one pixel to avoid clipping the focused-cell border)
                nextScrollTop = Math.max(0, focusedCellBounds.top - 1);
            }
            else if (focusedCellBounds.bottom > viewportBounds.bottom) {
                // scroll down
                var scrollDelta = focusedCellBounds.bottom - viewportBounds.bottom;
                nextScrollTop = viewportBounds.top + scrollDelta;
            }
            // keep the left end of an overly wide focused cell in view when moving up and down
            if (focusedCellBounds.left < viewportBounds.left || isFocusedCellWiderThanViewport) {
                // scroll left (again minus one additional pixel)
                nextScrollLeft = Math.max(0, focusedCellBounds.left - 1);
            }
            else if (focusedCellBounds.right > viewportBounds.right) {
                // scroll right
                var scrollDelta = focusedCellBounds.right - viewportBounds.right;
                nextScrollLeft = viewportBounds.left + scrollDelta;
            }
            _this.syncViewportPosition(nextScrollLeft, nextScrollTop);
        };
        _this.handleFocus = function (focusedCell) {
            if (!_this.props.enableFocusedCell) {
                // don't set focus state if focus is not allowed
                return;
            }
            // only set focused cell state if not specified in props
            if (_this.props.focusedCell == null) {
                _this.setState({ focusedCell: focusedCell });
            }
            CoreUtils.safeInvoke(_this.props.onFocusedCell, focusedCell);
        };
        _this.handleSelection = function (selectedRegions) {
            // only set selectedRegions state if not specified in props
            if (_this.props.selectedRegions == null) {
                _this.setState({ selectedRegions: selectedRegions });
            }
            var onSelection = _this.props.onSelection;
            if (onSelection != null) {
                onSelection(selectedRegions);
            }
        };
        _this.handleColumnsReordering = function (verticalGuides) {
            _this.setState({ isReordering: true, verticalGuides: verticalGuides });
        };
        _this.handleColumnsReordered = function (oldIndex, newIndex, length) {
            _this.setState({ isReordering: false, verticalGuides: undefined });
            CoreUtils.safeInvoke(_this.props.onColumnsReordered, oldIndex, newIndex, length);
        };
        _this.handleRowsReordering = function (horizontalGuides) {
            _this.setState({ isReordering: true, horizontalGuides: horizontalGuides });
        };
        _this.handleRowsReordered = function (oldIndex, newIndex, length) {
            _this.setState({ isReordering: false, horizontalGuides: undefined });
            CoreUtils.safeInvoke(_this.props.onRowsReordered, oldIndex, newIndex, length);
        };
        _this.handleLayoutLock = function (isLayoutLocked) {
            if (isLayoutLocked === void 0) { isLayoutLocked = false; }
            _this.setState({ isLayoutLocked: isLayoutLocked });
        };
        _this.hasLoadingOption = function (loadingOptions, loadingOption) {
            if (loadingOptions == null) {
                return undefined;
            }
            return loadingOptions.indexOf(loadingOption) >= 0;
        };
        _this.updateViewportRect = function (nextViewportRect) {
            var viewportRect = _this.state.viewportRect;
            _this.setState({ viewportRect: nextViewportRect });
            var didViewportChange = (viewportRect != null && !viewportRect.equals(nextViewportRect)) ||
                (viewportRect == null && nextViewportRect != null);
            if (didViewportChange) {
                _this.invokeOnVisibleCellsChangeCallback(nextViewportRect);
            }
        };
        _this.getMaxFrozenColumnIndex = function () {
            var numFrozenColumns = _this.state.numFrozenColumnsClamped;
            return numFrozenColumns != null ? numFrozenColumns - 1 : undefined;
        };
        _this.getMaxFrozenRowIndex = function () {
            var numFrozenRows = _this.state.numFrozenRowsClamped;
            return numFrozenRows != null ? numFrozenRows - 1 : undefined;
        };
        _this.handleColumnResizeGuide = function (verticalGuides) {
            _this.setState({ verticalGuides: verticalGuides });
        };
        _this.handleRowResizeGuide = function (horizontalGuides) {
            _this.setState({ horizontalGuides: horizontalGuides });
        };
        var _a = _this.props, children = _a.children, columnWidths = _a.columnWidths, defaultRowHeight = _a.defaultRowHeight, defaultColumnWidth = _a.defaultColumnWidth, numRows = _a.numRows, rowHeights = _a.rowHeights;
        _this.childrenArray = React.Children.toArray(children);
        _this.columnIdToIndex = Table_1.createColumnIdIndex(_this.childrenArray);
        // Create height/width arrays using the lengths from props and
        // children, the default values from props, and finally any sparse
        // arrays passed into props.
        var newColumnWidths = _this.childrenArray.map(function () { return defaultColumnWidth; });
        newColumnWidths = Utils.assignSparseValues(newColumnWidths, columnWidths);
        var newRowHeights = Utils.times(numRows, function () { return defaultRowHeight; });
        newRowHeights = Utils.assignSparseValues(newRowHeights, rowHeights);
        var selectedRegions = props.selectedRegions == null ? [] : props.selectedRegions;
        var focusedCell = FocusedCellUtils.getInitialFocusedCell(props.enableFocusedCell, props.focusedCell, undefined, selectedRegions);
        _this.state = {
            columnWidths: newColumnWidths,
            focusedCell: focusedCell,
            isLayoutLocked: false,
            isReordering: false,
            numFrozenColumnsClamped: clampNumFrozenColumns(props),
            numFrozenRowsClamped: clampNumFrozenRows(props),
            rowHeights: newRowHeights,
            selectedRegions: selectedRegions,
        };
        return _this;
    }
    Table_1 = Table;
    Table.createColumnIdIndex = function (children) {
        var columnIdToIndex = {};
        for (var i = 0; i < children.length; i++) {
            var key = children[i].props.id;
            if (key != null) {
                columnIdToIndex[String(key)] = i;
            }
        }
        return columnIdToIndex;
    };
    // Instance methods
    // ================
    /**
     * __Experimental!__ Resizes all rows in the table to the approximate
     * maximum height of wrapped cell content in each row. Works best when each
     * cell contains plain text of a consistent font style (though font style
     * may vary between cells). Since this function uses approximate
     * measurements, results may not be perfect.
     *
     * Approximation parameters can be configured for the entire table or on a
     * per-cell basis. Default values are fine-tuned to work well with default
     * Table font styles.
     */
    Table.prototype.resizeRowsByApproximateHeight = function (getCellText, options) {
        var numRows = this.props.numRows;
        var columnWidths = this.state.columnWidths;
        var numColumns = columnWidths.length;
        var rowHeights = [];
        for (var rowIndex = 0; rowIndex < numRows; rowIndex++) {
            var maxCellHeightInRow = 0;
            // iterate through each cell in the row
            for (var columnIndex = 0; columnIndex < numColumns; columnIndex++) {
                // resolve all parameters to raw values
                var _a = this.resolveResizeRowsByApproximateHeightOptions(options, rowIndex, columnIndex), approxCharWidth = _a.getApproximateCharWidth, approxLineHeight = _a.getApproximateLineHeight, horizontalPadding = _a.getCellHorizontalPadding, numBufferLines = _a.getNumBufferLines;
                var cellText = getCellText(rowIndex, columnIndex);
                var approxCellHeight = Utils.getApproxCellHeight(cellText, columnWidths[columnIndex], approxCharWidth, approxLineHeight, horizontalPadding, numBufferLines);
                if (approxCellHeight > maxCellHeightInRow) {
                    maxCellHeightInRow = approxCellHeight;
                }
            }
            rowHeights.push(maxCellHeightInRow);
        }
        this.invalidateGrid();
        this.didUpdateColumnOrRowSizes = true;
        this.setState({ rowHeights: rowHeights });
    };
    /**
     * Resize all rows in the table to the height of the tallest visible cell in the specified columns.
     * If no indices are provided, default to using the tallest visible cell from all columns in view.
     */
    Table.prototype.resizeRowsByTallestCell = function (columnIndices) {
        var _this = this;
        var tallest = 0;
        if (columnIndices == null) {
            // Consider all columns currently in viewport
            var viewportColumnIndices = this.grid.getColumnIndicesInRect(this.state.viewportRect);
            for (var col = viewportColumnIndices.columnIndexStart; col <= viewportColumnIndices.columnIndexEnd; col++) {
                tallest = Math.max(tallest, this.locator.getTallestVisibleCellInColumn(col));
            }
        }
        else {
            var columnIndicesArray = Array.isArray(columnIndices) ? columnIndices : [columnIndices];
            var tallestByColumns = columnIndicesArray.map(function (col) { return _this.locator.getTallestVisibleCellInColumn(col); });
            tallest = Math.max.apply(Math, tallestByColumns);
        }
        var rowHeights = Array(this.state.rowHeights.length).fill(tallest);
        this.invalidateGrid();
        this.didUpdateColumnOrRowSizes = true;
        this.setState({ rowHeights: rowHeights });
    };
    /**
     * Scrolls the table to the target region in a fashion appropriate to the target region's
     * cardinality:
     *
     * - CELLS: Scroll the top-left cell in the target region to the top-left corner of the viewport.
     * - FULL_ROWS: Scroll the top-most row in the target region to the top of the viewport.
     * - FULL_COLUMNS: Scroll the left-most column in the target region to the left side of the viewport.
     * - FULL_TABLE: Scroll the top-left cell in the table to the top-left corner of the viewport.
     *
     * If there are active frozen rows and/or columns, the target region will be positioned in the
     * top-left corner of the non-frozen area (unless the target region itself is in the frozen
     * area).
     *
     * If the target region is close to the bottom-right corner of the table, this function will
     * simply scroll the target region as close to the top-left as possible until the bottom-right
     * corner is reached.
     */
    Table.prototype.scrollToRegion = function (region) {
        var _a = this.state, numFrozenColumns = _a.numFrozenColumnsClamped, numFrozenRows = _a.numFrozenRowsClamped;
        var _b = this.state.viewportRect, currScrollLeft = _b.left, currScrollTop = _b.top;
        var _c = ScrollUtils.getScrollPositionForRegion(region, currScrollLeft, currScrollTop, this.grid.getCumulativeWidthBefore, this.grid.getCumulativeHeightBefore, numFrozenRows, numFrozenColumns), scrollLeft = _c.scrollLeft, scrollTop = _c.scrollTop;
        var correctedScrollLeft = this.shouldDisableHorizontalScroll() ? 0 : scrollLeft;
        var correctedScrollTop = this.shouldDisableVerticalScroll() ? 0 : scrollTop;
        // defer to the quadrant stack to keep all quadrant positions in sync
        this.quadrantStackInstance.scrollToPosition(correctedScrollLeft, correctedScrollTop);
    };
    // React lifecycle
    // ===============
    Table.prototype.getChildContext = function () {
        return {
            enableColumnInteractionBar: this.props.enableColumnInteractionBar,
        };
    };
    Table.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var propKeysBlacklist = { exclude: Table_1.SHALLOW_COMPARE_PROP_KEYS_BLACKLIST };
        var stateKeysBlacklist = { exclude: Table_1.SHALLOW_COMPARE_STATE_KEYS_BLACKLIST };
        return (!CoreUtils.shallowCompareKeys(this.props, nextProps, propKeysBlacklist) ||
            !CoreUtils.shallowCompareKeys(this.state, nextState, stateKeysBlacklist) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, Table_1.SHALLOW_COMPARE_PROP_KEYS_BLACKLIST) ||
            !CoreUtils.deepCompareKeys(this.state, nextState, Table_1.SHALLOW_COMPARE_STATE_KEYS_BLACKLIST));
    };
    Table.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        // calls validateProps
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        var children = nextProps.children, columnWidths = nextProps.columnWidths, defaultColumnWidth = nextProps.defaultColumnWidth, defaultRowHeight = nextProps.defaultRowHeight, enableFocusedCell = nextProps.enableFocusedCell, focusedCell = nextProps.focusedCell, numRows = nextProps.numRows, rowHeights = nextProps.rowHeights, selectedRegions = nextProps.selectedRegions, selectionModes = nextProps.selectionModes;
        var newChildArray = React.Children.toArray(children);
        var numCols = newChildArray.length;
        // Try to maintain widths of columns by looking up the width of the
        // column that had the same `ID` prop. If none is found, use the
        // previous width at the same index.
        var previousColumnWidths = newChildArray.map(function (child, index) {
            var mappedIndex = _this.columnIdToIndex[child.props.id];
            return _this.state.columnWidths[mappedIndex != null ? mappedIndex : index];
        });
        // Make sure the width/height arrays have the correct length, but keep
        // as many existing widths/heights when possible. Also, apply the
        // sparse width/heights from props.
        var newColumnWidths = this.state.columnWidths;
        newColumnWidths = Utils.arrayOfLength(newColumnWidths, numCols, defaultColumnWidth);
        newColumnWidths = Utils.assignSparseValues(newColumnWidths, previousColumnWidths);
        newColumnWidths = Utils.assignSparseValues(newColumnWidths, columnWidths);
        var newRowHeights = this.state.rowHeights;
        newRowHeights = Utils.arrayOfLength(newRowHeights, numRows, defaultRowHeight);
        newRowHeights = Utils.assignSparseValues(newRowHeights, rowHeights);
        if (!CoreUtils.arraysEqual(newColumnWidths, this.state.columnWidths) ||
            !CoreUtils.arraysEqual(newRowHeights, this.state.rowHeights)) {
            // grid invalidation is required after changing this flag,
            // which happens at the end of this method.
            this.didUpdateColumnOrRowSizes = true;
        }
        var newSelectedRegions = selectedRegions;
        if (selectedRegions == null) {
            // if we're in uncontrolled mode, filter out all selected regions that don't
            // fit in the current new table dimensions
            newSelectedRegions = this.state.selectedRegions.filter(function (region) {
                var regionCardinality = Regions.getRegionCardinality(region);
                return (_this.isSelectionModeEnabled(regionCardinality, selectionModes) &&
                    Regions.isRegionValidForTable(region, numRows, numCols));
            });
        }
        var newFocusedCell = FocusedCellUtils.getInitialFocusedCell(enableFocusedCell, focusedCell, this.state.focusedCell, newSelectedRegions);
        this.childrenArray = newChildArray;
        this.columnIdToIndex = Table_1.createColumnIdIndex(this.childrenArray);
        this.invalidateGrid();
        this.setState({
            columnWidths: newColumnWidths,
            focusedCell: newFocusedCell,
            numFrozenColumnsClamped: clampNumFrozenColumns(nextProps),
            numFrozenRowsClamped: clampNumFrozenRows(nextProps),
            rowHeights: newRowHeights,
            selectedRegions: newSelectedRegions,
        });
    };
    Table.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, enableRowHeader = _a.enableRowHeader, loadingOptions = _a.loadingOptions, numRows = _a.numRows, enableColumnInteractionBar = _a.enableColumnInteractionBar;
        var _b = this.state, horizontalGuides = _b.horizontalGuides, numFrozenColumnsClamped = _b.numFrozenColumnsClamped, numFrozenRowsClamped = _b.numFrozenRowsClamped, verticalGuides = _b.verticalGuides;
        this.validateGrid();
        var classes = classNames(Classes.TABLE_CONTAINER, (_c = {},
            _c[Classes.TABLE_REORDERING] = this.state.isReordering,
            _c[Classes.TABLE_NO_VERTICAL_SCROLL] = this.shouldDisableVerticalScroll(),
            _c[Classes.TABLE_NO_HORIZONTAL_SCROLL] = this.shouldDisableHorizontalScroll(),
            _c[Classes.TABLE_SELECTION_ENABLED] = this.isSelectionModeEnabled(RegionCardinality.CELLS),
            _c[Classes.TABLE_NO_ROWS] = numRows === 0,
            _c), className);
        return (React.createElement("div", { className: classes, ref: this.refHandlers.rootTable, onScroll: this.handleRootScroll },
            React.createElement(TableQuadrantStack, { bodyRef: this.refHandlers.cellContainer, bodyRenderer: this.renderBody, columnHeaderCellRenderer: this.renderColumnHeader, columnHeaderRef: this.refHandlers.columnHeader, enableColumnInteractionBar: enableColumnInteractionBar, enableRowHeader: enableRowHeader, grid: this.grid, handleColumnResizeGuide: this.handleColumnResizeGuide, handleColumnsReordering: this.handleColumnsReordering, handleRowResizeGuide: this.handleRowResizeGuide, handleRowsReordering: this.handleRowsReordering, isHorizontalScrollDisabled: this.shouldDisableHorizontalScroll(), isVerticalScrollDisabled: this.shouldDisableVerticalScroll(), loadingOptions: loadingOptions, numColumns: React.Children.count(children), numFrozenColumns: numFrozenColumnsClamped, numFrozenRows: numFrozenRowsClamped, numRows: numRows, onScroll: this.handleBodyScroll, quadrantRef: this.refHandlers.mainQuadrant, ref: this.refHandlers.quadrantStack, menuRenderer: this.renderMenu, rowHeaderCellRenderer: this.renderRowHeader, rowHeaderRef: this.refHandlers.rowHeader, scrollContainerRef: this.refHandlers.scrollContainer }),
            React.createElement("div", { className: classNames(Classes.TABLE_OVERLAY_LAYER, Classes.TABLE_OVERLAY_REORDERING_CURSOR) }),
            React.createElement(GuideLayer, { className: Classes.TABLE_RESIZE_GUIDES, verticalGuides: verticalGuides, horizontalGuides: horizontalGuides })));
        var _c;
    };
    Table.prototype.renderHotkeys = function () {
        var hotkeys = [
            this.maybeRenderCopyHotkey(),
            this.maybeRenderSelectAllHotkey(),
            this.maybeRenderFocusHotkeys(),
            this.maybeRenderSelectionResizeHotkeys(),
        ];
        return React.createElement(Hotkeys, null, hotkeys.filter(function (element) { return element !== undefined; }));
    };
    /**
     * When the component mounts, the HTML Element refs will be available, so
     * we constructor the Locator, which queries the elements' bounding
     * ClientRects.
     */
    Table.prototype.componentDidMount = function () {
        var _this = this;
        this.validateGrid();
        this.locator = new Locator(this.rootTableElement, this.scrollContainerElement, this.cellContainerElement);
        this.updateLocator();
        this.updateViewportRect(this.locator.getViewportRect());
        this.resizeSensorDetach = ResizeSensor.attach(this.rootTableElement, function () {
            if (!_this.state.isLayoutLocked) {
                _this.updateViewportRect(_this.locator.getViewportRect());
            }
        });
    };
    Table.prototype.componentWillUnmount = function () {
        if (this.resizeSensorDetach != null) {
            this.resizeSensorDetach();
            delete this.resizeSensorDetach;
        }
        this.didCompletelyMount = false;
    };
    Table.prototype.componentDidUpdate = function () {
        if (this.locator != null) {
            this.validateGrid();
            this.updateLocator();
        }
        if (this.didUpdateColumnOrRowSizes) {
            this.quadrantStackInstance.synchronizeQuadrantViews();
            this.didUpdateColumnOrRowSizes = false;
        }
        this.maybeScrollTableIntoView();
    };
    Table.prototype.validateProps = function (props) {
        var children = props.children, columnWidths = props.columnWidths, numFrozenColumns = props.numFrozenColumns, numFrozenRows = props.numFrozenRows, numRows = props.numRows, rowHeights = props.rowHeights;
        var numColumns = React.Children.count(children);
        // do cheap error-checking first.
        if (numRows != null && numRows < 0) {
            throw new Error(Errors.TABLE_NUM_ROWS_NEGATIVE);
        }
        if (numFrozenRows != null && numFrozenRows < 0) {
            throw new Error(Errors.TABLE_NUM_FROZEN_ROWS_NEGATIVE);
        }
        if (numFrozenColumns != null && numFrozenColumns < 0) {
            throw new Error(Errors.TABLE_NUM_FROZEN_COLUMNS_NEGATIVE);
        }
        if (numRows != null && rowHeights != null && rowHeights.length !== numRows) {
            throw new Error(Errors.TABLE_NUM_ROWS_ROW_HEIGHTS_MISMATCH);
        }
        if (numColumns != null && columnWidths != null && columnWidths.length !== numColumns) {
            throw new Error(Errors.TABLE_NUM_COLUMNS_COLUMN_WIDTHS_MISMATCH);
        }
        React.Children.forEach(children, function (child) {
            if (!CoreUtils.isElementOfType(child, Column)) {
                throw new Error(Errors.TABLE_NON_COLUMN_CHILDREN_WARNING);
            }
        });
        // these are recoverable scenarios, so just print a warning.
        if (numFrozenRows != null && numRows != null && numFrozenRows > numRows) {
            console.warn(Errors.TABLE_NUM_FROZEN_ROWS_BOUND_WARNING);
        }
        if (numFrozenColumns != null && numFrozenColumns > numColumns) {
            console.warn(Errors.TABLE_NUM_FROZEN_COLUMNS_BOUND_WARNING);
        }
    };
    // Hotkeys
    // =======
    Table.prototype.maybeRenderCopyHotkey = function () {
        var getCellClipboardData = this.props.getCellClipboardData;
        if (getCellClipboardData != null) {
            return (React.createElement(Hotkey, { key: "copy-hotkey", label: "Copy selected table cells", group: "Table", combo: "mod+c", onKeyDown: this.handleCopy }));
        }
        else {
            return undefined;
        }
    };
    Table.prototype.maybeRenderSelectionResizeHotkeys = function () {
        var _a = this.props, enableMultipleSelection = _a.enableMultipleSelection, selectionModes = _a.selectionModes;
        var isSomeSelectionModeEnabled = selectionModes.length > 0;
        if (enableMultipleSelection && isSomeSelectionModeEnabled) {
            return [
                React.createElement(Hotkey, { key: "resize-selection-up", label: "Resize selection upward", group: "Table", combo: "shift+up", onKeyDown: this.handleSelectionResizeUp }),
                React.createElement(Hotkey, { key: "resize-selection-down", label: "Resize selection downward", group: "Table", combo: "shift+down", onKeyDown: this.handleSelectionResizeDown }),
                React.createElement(Hotkey, { key: "resize-selection-left", label: "Resize selection leftward", group: "Table", combo: "shift+left", onKeyDown: this.handleSelectionResizeLeft }),
                React.createElement(Hotkey, { key: "resize-selection-right", label: "Resize selection rightward", group: "Table", combo: "shift+right", onKeyDown: this.handleSelectionResizeRight }),
            ];
        }
        else {
            return undefined;
        }
    };
    Table.prototype.maybeRenderFocusHotkeys = function () {
        var enableFocusedCell = this.props.enableFocusedCell;
        if (enableFocusedCell != null) {
            return [
                React.createElement(Hotkey, { key: "move left", label: "Move focus cell left", group: "Table", combo: "left", onKeyDown: this.handleFocusMoveLeft }),
                React.createElement(Hotkey, { key: "move right", label: "Move focus cell right", group: "Table", combo: "right", onKeyDown: this.handleFocusMoveRight }),
                React.createElement(Hotkey, { key: "move up", label: "Move focus cell up", group: "Table", combo: "up", onKeyDown: this.handleFocusMoveUp }),
                React.createElement(Hotkey, { key: "move down", label: "Move focus cell down", group: "Table", combo: "down", onKeyDown: this.handleFocusMoveDown }),
                React.createElement(Hotkey, { key: "move tab", label: "Move focus cell tab", group: "Table", combo: "tab", onKeyDown: this.handleFocusMoveRightInternal, allowInInput: true }),
                React.createElement(Hotkey, { key: "move shift-tab", label: "Move focus cell shift tab", group: "Table", combo: "shift+tab", onKeyDown: this.handleFocusMoveLeftInternal, allowInInput: true }),
                React.createElement(Hotkey, { key: "move enter", label: "Move focus cell enter", group: "Table", combo: "enter", onKeyDown: this.handleFocusMoveDownInternal, allowInInput: true }),
                React.createElement(Hotkey, { key: "move shift-enter", label: "Move focus cell shift enter", group: "Table", combo: "shift+enter", onKeyDown: this.handleFocusMoveUpInternal, allowInInput: true }),
            ];
        }
        else {
            return [];
        }
    };
    Table.prototype.maybeRenderSelectAllHotkey = function () {
        if (this.isSelectionModeEnabled(RegionCardinality.FULL_TABLE)) {
            return (React.createElement(Hotkey, { key: "select-all-hotkey", label: "Select all", group: "Table", combo: "mod+a", onKeyDown: this.handleSelectAllHotkey }));
        }
        else {
            return undefined;
        }
    };
    /**
     * Replaces the selected region at the specified array index, with the
     * region provided.
     */
    Table.prototype.updateSelectedRegionAtIndex = function (region, index) {
        var _a = this.props, children = _a.children, numRows = _a.numRows;
        var selectedRegions = this.state.selectedRegions;
        var numColumns = React.Children.count(children);
        var maxRowIndex = Math.max(0, numRows - 1);
        var maxColumnIndex = Math.max(0, numColumns - 1);
        var clampedNextRegion = Regions.clampRegion(region, maxRowIndex, maxColumnIndex);
        var nextSelectedRegions = Regions.update(selectedRegions, clampedNextRegion, index);
        this.handleSelection(nextSelectedRegions);
    };
    // Quadrant refs
    // =============
    Table.prototype.moveFocusCell = function (primaryAxis, secondaryAxis, isUpOrLeft, newFocusedCell, focusCellRegion) {
        var selectedRegions = this.state.selectedRegions;
        var primaryAxisPlural = primaryAxis === "row" ? "rows" : "cols";
        var secondaryAxisPlural = secondaryAxis === "row" ? "rows" : "cols";
        var movementDirection = isUpOrLeft ? -1 : +1;
        var regionIntervalIndex = isUpOrLeft ? 1 : 0;
        // try moving the cell in the direction along the primary axis
        newFocusedCell[primaryAxis] += movementDirection;
        var isPrimaryIndexOutOfBounds = isUpOrLeft
            ? newFocusedCell[primaryAxis] < focusCellRegion[primaryAxisPlural][0]
            : newFocusedCell[primaryAxis] > focusCellRegion[primaryAxisPlural][1];
        if (isPrimaryIndexOutOfBounds) {
            // if we moved outside the bounds of selection region,
            // move to the start (or end) of the primary axis, and move one along the secondary
            newFocusedCell[primaryAxis] = focusCellRegion[primaryAxisPlural][regionIntervalIndex];
            newFocusedCell[secondaryAxis] += movementDirection;
            var isSecondaryIndexOutOfBounds = isUpOrLeft
                ? newFocusedCell[secondaryAxis] < focusCellRegion[secondaryAxisPlural][0]
                : newFocusedCell[secondaryAxis] > focusCellRegion[secondaryAxisPlural][1];
            if (isSecondaryIndexOutOfBounds) {
                // if moving along the secondary also moves us outside
                // go to the start (or end) of the next (or previous region)
                // (note that if there's only one region you'll be moving to the opposite corner, which is fine)
                var newFocusCellSelectionIndex = newFocusedCell.focusSelectionIndex + movementDirection;
                // newFocusCellSelectionIndex should be one more (or less), unless we need to wrap around
                if (isUpOrLeft ? newFocusCellSelectionIndex < 0 : newFocusCellSelectionIndex >= selectedRegions.length) {
                    newFocusCellSelectionIndex = isUpOrLeft ? selectedRegions.length - 1 : 0;
                }
                var newFocusCellRegion = Regions.getCellRegionFromRegion(selectedRegions[newFocusCellSelectionIndex], this.grid.numRows, this.grid.numCols);
                newFocusedCell = {
                    col: newFocusCellRegion.cols[regionIntervalIndex],
                    focusSelectionIndex: newFocusCellSelectionIndex,
                    row: newFocusCellRegion.rows[regionIntervalIndex],
                };
            }
        }
        return newFocusedCell;
    };
    Table.prototype.shouldDisableVerticalScroll = function () {
        var enableGhostCells = this.props.enableGhostCells;
        var viewportRect = this.state.viewportRect;
        var rowIndices = this.grid.getRowIndicesInRect(viewportRect, enableGhostCells);
        var isViewportUnscrolledVertically = viewportRect != null && viewportRect.top === 0;
        var areRowHeadersLoading = this.hasLoadingOption(this.props.loadingOptions, TableLoadingOption.ROW_HEADERS);
        var areGhostRowsVisible = enableGhostCells && this.grid.isGhostIndex(rowIndices.rowIndexEnd, 0);
        return areGhostRowsVisible && (isViewportUnscrolledVertically || areRowHeadersLoading);
    };
    Table.prototype.shouldDisableHorizontalScroll = function () {
        var enableGhostCells = this.props.enableGhostCells;
        var viewportRect = this.state.viewportRect;
        var columnIndices = this.grid.getColumnIndicesInRect(viewportRect, enableGhostCells);
        var isViewportUnscrolledHorizontally = viewportRect != null && viewportRect.left === 0;
        var areGhostColumnsVisible = enableGhostCells && this.grid.isGhostColumn(columnIndices.columnIndexEnd);
        var areColumnHeadersLoading = this.hasLoadingOption(this.props.loadingOptions, TableLoadingOption.COLUMN_HEADERS);
        return areGhostColumnsVisible && (isViewportUnscrolledHorizontally || areColumnHeadersLoading);
    };
    Table.prototype.maybeScrollTableIntoView = function () {
        var viewportRect = this.state.viewportRect;
        var tableBottom = this.grid.getCumulativeHeightAt(this.grid.numRows - 1);
        var tableRight = this.grid.getCumulativeWidthAt(this.grid.numCols - 1);
        var nextScrollTop = tableBottom < viewportRect.top + viewportRect.height
            ? // scroll the last row into view
                Math.max(0, tableBottom - viewportRect.height)
            : viewportRect.top;
        var nextScrollLeft = tableRight < viewportRect.left + viewportRect.width
            ? // scroll the last column into view
                Math.max(0, tableRight - viewportRect.width)
            : viewportRect.left;
        this.syncViewportPosition(nextScrollLeft, nextScrollTop);
    };
    Table.prototype.getColumnProps = function (columnIndex) {
        var column = this.childrenArray[columnIndex];
        return column.props;
    };
    Table.prototype.isGuidesShowing = function () {
        return this.state.verticalGuides != null || this.state.horizontalGuides != null;
    };
    Table.prototype.isSelectionModeEnabled = function (selectionMode, selectionModes) {
        if (selectionModes === void 0) { selectionModes = this.props.selectionModes; }
        var _a = this.props, children = _a.children, numRows = _a.numRows;
        var numColumns = React.Children.count(children);
        return selectionModes.indexOf(selectionMode) >= 0 && numRows > 0 && numColumns > 0;
    };
    Table.prototype.getEnabledSelectionHandler = function (selectionMode) {
        if (!this.isSelectionModeEnabled(selectionMode)) {
            // If the selection mode isn't enabled, return a callback that
            // will clear the selection. For example, if row selection is
            // disabled, clicking on the row header will clear the table's
            // selection. If all selection modes are enabled, clicking on the
            // same region twice will clear the selection.
            return this.clearSelection;
        }
        else {
            return this.handleSelection;
        }
    };
    Table.prototype.invalidateGrid = function () {
        this.grid = null;
    };
    Table.prototype.validateGrid = function () {
        if (this.grid == null) {
            var _a = this.props, defaultRowHeight = _a.defaultRowHeight, defaultColumnWidth = _a.defaultColumnWidth;
            var _b = this.state, rowHeights = _b.rowHeights, columnWidths = _b.columnWidths;
            this.grid = new Grid(rowHeights, columnWidths, Grid.DEFAULT_BLEED, defaultRowHeight, defaultColumnWidth);
            this.invokeOnVisibleCellsChangeCallback(this.state.viewportRect);
        }
    };
    /**
     * Renders a `RegionLayer`, applying styles to the regions using the
     * supplied `IRegionStyler`. `RegionLayer` is a `PureRender` component, so
     * the `IRegionStyler` should be a new instance on every render if we
     * intend to redraw the region layer.
     */
    Table.prototype.maybeRenderRegions = function (getRegionStyle, quadrantType) {
        if (this.isGuidesShowing() && !this.state.isReordering) {
            // we want to show guides *and* the selection styles when reordering rows or columns
            return undefined;
        }
        var regionGroups = Regions.joinStyledRegionGroups(this.state.selectedRegions, this.props.styledRegionGroups, this.state.focusedCell);
        return regionGroups.map(function (regionGroup, index) {
            var regionStyles = regionGroup.regions.map(function (region) { return getRegionStyle(region, quadrantType); });
            return (React.createElement(RegionLayer, { className: classNames(regionGroup.className), key: index, regions: regionGroup.regions, regionStyles: regionStyles }));
        });
    };
    Table.prototype.syncViewportPosition = function (nextScrollLeft, nextScrollTop) {
        var viewportRect = this.state.viewportRect;
        var didScrollTopChange = nextScrollTop !== viewportRect.top;
        var didScrollLeftChange = nextScrollLeft !== viewportRect.left;
        if (didScrollTopChange || didScrollLeftChange) {
            // we need to modify the scroll container explicitly for the viewport to shift. in so
            // doing, we add the size of the header elements, which are not technically part of the
            // "grid" concept (the grid only consists of body cells at present).
            if (didScrollTopChange) {
                var topCorrection = this.shouldDisableVerticalScroll() ? 0 : this.columnHeaderElement.clientHeight;
                this.scrollContainerElement.scrollTop = nextScrollTop + topCorrection;
            }
            if (didScrollLeftChange) {
                var leftCorrection = this.shouldDisableHorizontalScroll() || this.rowHeaderElement == null
                    ? 0
                    : this.rowHeaderElement.clientWidth;
                this.scrollContainerElement.scrollLeft = nextScrollLeft + leftCorrection;
            }
            var nextViewportRect = new Rect(nextScrollLeft, nextScrollTop, viewportRect.width, viewportRect.height);
            this.updateViewportRect(nextViewportRect);
        }
    };
    Table.prototype.updateLocator = function () {
        this.locator
            .setGrid(this.grid)
            .setNumFrozenRows(this.state.numFrozenRowsClamped)
            .setNumFrozenColumns(this.state.numFrozenColumnsClamped);
    };
    Table.prototype.invokeOnVisibleCellsChangeCallback = function (viewportRect) {
        var columnIndices = this.grid.getColumnIndicesInRect(viewportRect);
        var rowIndices = this.grid.getRowIndicesInRect(viewportRect);
        CoreUtils.safeInvoke(this.props.onVisibleCellsChange, rowIndices, columnIndices);
    };
    /**
     * Normalizes RenderMode.BATCH_ON_UPDATE into RenderMode.{BATCH,NONE}. We do
     * this because there are actually multiple updates required before the
     * <Table> is considered fully "mounted," and adding that knowledge to child
     * components would lead to tight coupling. Thus, keep it simple for them.
     */
    Table.prototype.getNormalizedRenderMode = function () {
        var renderMode = this.props.renderMode;
        var shouldBatchRender = renderMode === RenderMode.BATCH || (renderMode === RenderMode.BATCH_ON_UPDATE && this.didCompletelyMount);
        return shouldBatchRender ? RenderMode.BATCH : RenderMode.NONE;
    };
    /**
     * Returns an object with option keys mapped to their resolved values
     * (falling back to default values as necessary).
     */
    Table.prototype.resolveResizeRowsByApproximateHeightOptions = function (options, rowIndex, columnIndex) {
        var optionKeys = Object.keys(Table_1.resizeRowsByApproximateHeightDefaults);
        var optionReducer = function (agg, key) {
            agg[key] =
                options != null && options[key] != null
                    ? CoreUtils.safeInvokeOrValue(options[key], rowIndex, columnIndex)
                    : Table_1.resizeRowsByApproximateHeightDefaults[key];
            return agg;
        };
        var resolvedOptions = optionKeys.reduce(optionReducer, {});
        return resolvedOptions;
    };
    Table.defaultProps = {
        defaultColumnWidth: 150,
        defaultRowHeight: 20,
        enableFocusedCell: false,
        enableGhostCells: false,
        enableMultipleSelection: true,
        enableRowHeader: true,
        loadingOptions: [],
        minColumnWidth: 50,
        minRowHeight: 20,
        numFrozenColumns: 0,
        numFrozenRows: 0,
        numRows: 0,
        renderMode: RenderMode.BATCH_ON_UPDATE,
        rowHeaderCellRenderer: renderDefaultRowHeader,
        selectionModes: SelectionModes.ALL,
    };
    Table.childContextTypes = columnInteractionBarContextTypes;
    // these default values for `resizeRowsByApproximateHeight` have been
    // fine-tuned to work well with default Table font styles.
    Table.resizeRowsByApproximateHeightDefaults = {
        getApproximateCharWidth: 8,
        getApproximateLineHeight: 18,
        getCellHorizontalPadding: 2 * Locator.CELL_HORIZONTAL_PADDING,
        getNumBufferLines: 1,
    };
    Table.SHALLOW_COMPARE_PROP_KEYS_BLACKLIST = [
        "selectedRegions",
    ];
    Table.SHALLOW_COMPARE_STATE_KEYS_BLACKLIST = [
        "selectedRegions",
        "viewportRect",
    ];
    Table = Table_1 = tslib_1.__decorate([
        HotkeysTarget
    ], Table);
    return Table;
    var Table_1;
}(AbstractComponent));
export { Table };
function clampNumFrozenColumns(props) {
    var numFrozenColumns = props.numFrozenColumns;
    var numColumns = React.Children.count(props.children);
    return clampPotentiallyNullValue(numFrozenColumns, numColumns);
}
function clampNumFrozenRows(props) {
    var numFrozenRows = props.numFrozenRows, numRows = props.numRows;
    return clampPotentiallyNullValue(numFrozenRows, numRows);
}
// add explicit `| null | undefined`, because the params make more sense in this
// order, and you can't have an optional param precede a required param.
function clampPotentiallyNullValue(value, max) {
    return value == null ? 0 : Utils.clamp(value, 0, max);
}
//# sourceMappingURL=table.js.map