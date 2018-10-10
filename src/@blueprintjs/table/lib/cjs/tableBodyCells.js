"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var cell_1 = require("./cell/cell");
var batcher_1 = require("./common/batcher");
var Classes = tslib_1.__importStar(require("./common/classes"));
var rect_1 = require("./common/rect");
var renderMode_1 = require("./common/renderMode");
var SHALLOW_COMPARE_BLACKLIST = ["viewportRect"];
/**
 * We don't want to reset the batcher when this set of keys changes. Any other
 * changes should reset the batcher's internal cache.
 */
var BATCHER_RESET_PROP_KEYS_BLACKLIST = [
    "columnIndexEnd",
    "columnIndexStart",
    "rowIndexEnd",
    "rowIndexStart",
];
var TableBodyCells = /** @class */ (function (_super) {
    tslib_1.__extends(TableBodyCells, _super);
    function TableBodyCells() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.batcher = new batcher_1.Batcher();
        // Cell renderers
        // ==============
        _this.renderNewCell = function (rowIndex, columnIndex) {
            var _a = _this.props, columnIndexEnd = _a.columnIndexEnd, grid = _a.grid, rowIndexEnd = _a.rowIndexEnd;
            var extremaClasses = grid.getExtremaClasses(rowIndex, columnIndex, rowIndexEnd, columnIndexEnd);
            var isGhost = grid.isGhostIndex(rowIndex, columnIndex);
            return _this.renderCell(rowIndex, columnIndex, extremaClasses, isGhost);
        };
        _this.renderCell = function (rowIndex, columnIndex, extremaClasses, isGhost) {
            var _a = _this.props, cellRenderer = _a.cellRenderer, focusedCell = _a.focusedCell, loading = _a.loading, grid = _a.grid;
            var baseCell = isGhost ? cell_1.emptyCellRenderer() : cellRenderer(rowIndex, columnIndex);
            var className = classnames_1.default(cellClassNames(rowIndex, columnIndex), extremaClasses, (_b = {},
                _b[Classes.TABLE_CELL_GHOST] = isGhost,
                _b[Classes.TABLE_CELL_LEDGER_ODD] = rowIndex % 2 === 1,
                _b[Classes.TABLE_CELL_LEDGER_EVEN] = rowIndex % 2 === 0,
                _b), baseCell.props.className);
            var key = TableBodyCells.cellReactKey(rowIndex, columnIndex);
            var rect = isGhost ? grid.getGhostCellRect(rowIndex, columnIndex) : grid.getCellRect(rowIndex, columnIndex);
            var cellLoading = baseCell.props.loading != null ? baseCell.props.loading : loading;
            var style = tslib_1.__assign({}, baseCell.props.style, rect_1.Rect.style(rect));
            var isFocused = focusedCell != null && focusedCell.row === rowIndex && focusedCell.col === columnIndex;
            return React.cloneElement(baseCell, { className: className, key: key, isFocused: isFocused, loading: cellLoading, style: style });
            var _b;
        };
        // Other
        // =====
        _this.didViewportRectChange = function (nextViewportRect, currViewportRect) {
            if (nextViewportRect == null && currViewportRect == null) {
                return false;
            }
            else if (nextViewportRect == null || currViewportRect == null) {
                return true;
            }
            else {
                return !nextViewportRect.equals(currViewportRect);
            }
        };
        return _this;
    }
    TableBodyCells.cellReactKey = function (rowIndex, columnIndex) {
        return "cell-" + rowIndex + "-" + columnIndex;
    };
    TableBodyCells.prototype.componentDidMount = function () {
        this.maybeInvokeOnCompleteRender();
    };
    TableBodyCells.prototype.shouldComponentUpdate = function (nextProps) {
        return (!core_1.Utils.shallowCompareKeys(nextProps, this.props, { exclude: SHALLOW_COMPARE_BLACKLIST }) ||
            // "viewportRect" is not a plain object, so we can't just deep
            // compare; we need custom logic.
            this.didViewportRectChange(nextProps.viewportRect, this.props.viewportRect));
    };
    TableBodyCells.prototype.componentWillUpdate = function (nextProps) {
        var resetKeysBlacklist = { exclude: BATCHER_RESET_PROP_KEYS_BLACKLIST };
        var shouldResetBatcher = !core_1.Utils.shallowCompareKeys(this.props, nextProps, resetKeysBlacklist);
        if (shouldResetBatcher) {
            this.batcher.reset();
        }
    };
    TableBodyCells.prototype.componentDidUpdate = function () {
        this.maybeInvokeOnCompleteRender();
    };
    TableBodyCells.prototype.componentWillUnmount = function () {
        this.batcher.cancelOutstandingCallback();
    };
    TableBodyCells.prototype.render = function () {
        var renderMode = this.props.renderMode;
        var cells = renderMode === renderMode_1.RenderMode.BATCH ? this.renderBatchedCells() : this.renderAllCells();
        return React.createElement("div", { className: Classes.TABLE_BODY_CELLS }, cells);
    };
    // Render modes
    // ============
    TableBodyCells.prototype.renderBatchedCells = function () {
        var _this = this;
        var _a = this.props, columnIndexEnd = _a.columnIndexEnd, columnIndexStart = _a.columnIndexStart, rowIndexEnd = _a.rowIndexEnd, rowIndexStart = _a.rowIndexStart;
        // render cells in batches
        this.batcher.startNewBatch();
        for (var rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (var columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                this.batcher.addArgsToBatch(rowIndex, columnIndex);
            }
        }
        this.batcher.removeOldAddNew(this.renderNewCell);
        if (!this.batcher.isDone()) {
            this.batcher.idleCallback(function () { return _this.forceUpdate(); });
        }
        var cells = this.batcher.getList();
        return cells;
    };
    TableBodyCells.prototype.renderAllCells = function () {
        var _a = this.props, columnIndexEnd = _a.columnIndexEnd, columnIndexStart = _a.columnIndexStart, rowIndexEnd = _a.rowIndexEnd, rowIndexStart = _a.rowIndexStart;
        var cells = [];
        var cellsArgs = [];
        for (var rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (var columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                cells.push(this.renderNewCell(rowIndex, columnIndex));
                cellsArgs.push([rowIndex, columnIndex]);
            }
        }
        // pretend we did an entire rendering pass using the batcher. that way,
        // if we switch from `RenderMode.NONE` to `RenderMode.BATCH`, we don't
        // have to re-paint every cell still in view.
        this.batcher.setList(cellsArgs, cells);
        return cells;
    };
    // Callbacks
    // =========
    TableBodyCells.prototype.maybeInvokeOnCompleteRender = function () {
        var _a = this.props, onCompleteRender = _a.onCompleteRender, renderMode = _a.renderMode;
        if (renderMode === renderMode_1.RenderMode.NONE || (renderMode === renderMode_1.RenderMode.BATCH && this.batcher.isDone())) {
            core_1.Utils.safeInvoke(onCompleteRender);
        }
    };
    TableBodyCells.defaultProps = {
        renderMode: renderMode_1.RenderMode.BATCH,
    };
    return TableBodyCells;
}(React.Component));
exports.TableBodyCells = TableBodyCells;
/**
 * Returns the array of class names that must be applied to each table
 * cell so that we can locate any cell based on its coordinate.
 */
function cellClassNames(rowIndex, columnIndex) {
    return [Classes.rowCellIndexClass(rowIndex), Classes.columnCellIndexClass(columnIndex)];
}
exports.cellClassNames = cellClassNames;
//# sourceMappingURL=tableBodyCells.js.map