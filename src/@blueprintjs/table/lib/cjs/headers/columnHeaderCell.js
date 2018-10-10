"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var Classes = tslib_1.__importStar(require("../common/classes"));
var context_1 = require("../common/context");
var loadableContent_1 = require("../common/loadableContent");
var headerCell_1 = require("./headerCell");
function HorizontalCellDivider() {
    return React.createElement("div", { className: Classes.TABLE_HORIZONTAL_CELL_DIVIDER });
}
exports.HorizontalCellDivider = HorizontalCellDivider;
var ColumnHeaderCell = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnHeaderCell, _super);
    function ColumnHeaderCell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isActive: false,
        };
        _this.handlePopoverOpened = function () { return _this.setState({ isActive: true }); };
        _this.handlePopoverClosing = function () { return _this.setState({ isActive: false }); };
        return _this;
    }
    /**
     * This method determines if a `MouseEvent` was triggered on a target that
     * should be used as the header click/drag target. This enables users of
     * this component to render fully interactive components in their header
     * cells without worry of selection or resize operations from capturing
     * their mouse events.
     */
    ColumnHeaderCell.isHeaderMouseTarget = function (target) {
        return (target.classList.contains(Classes.TABLE_HEADER) ||
            target.classList.contains(Classes.TABLE_COLUMN_NAME) ||
            target.classList.contains(Classes.TABLE_INTERACTION_BAR) ||
            target.classList.contains(Classes.TABLE_HEADER_CONTENT));
    };
    ColumnHeaderCell.prototype.render = function () {
        var _a = this.props, 
        // from IColumnHeaderCellProps
        enableColumnReordering = _a.enableColumnReordering, isColumnSelected = _a.isColumnSelected, menuIcon = _a.menuIcon, 
        // from IColumnNameProps
        name = _a.name, nameRenderer = _a.nameRenderer, 
        // from IHeaderProps
        spreadableProps = tslib_1.__rest(_a, ["enableColumnReordering", "isColumnSelected", "menuIcon", "name", "nameRenderer"]);
        var classes = classnames_1.default(spreadableProps.className, Classes.TABLE_COLUMN_HEADER_CELL, (_b = {},
            _b[Classes.TABLE_HAS_INTERACTION_BAR] = this.context.enableColumnInteractionBar,
            _b[Classes.TABLE_HAS_REORDER_HANDLE] = this.props.reorderHandle != null,
            _b));
        return (React.createElement(headerCell_1.HeaderCell, tslib_1.__assign({ isReorderable: this.props.enableColumnReordering, isSelected: this.props.isColumnSelected }, spreadableProps, { className: classes }),
            this.renderName(),
            this.maybeRenderContent(),
            this.props.loading ? undefined : this.props.resizeHandle));
        var _b;
    };
    ColumnHeaderCell.prototype.renderName = function () {
        var _a = this.props, index = _a.index, loading = _a.loading, name = _a.name, nameRenderer = _a.nameRenderer, reorderHandle = _a.reorderHandle;
        var dropdownMenu = this.maybeRenderDropdownMenu();
        var defaultName = React.createElement("div", { className: Classes.TABLE_TRUNCATED_TEXT }, name);
        var nameComponent = (React.createElement(loadableContent_1.LoadableContent, { loading: loading, variableLength: true }, nameRenderer == null ? defaultName : nameRenderer(name, index)));
        if (this.context.enableColumnInteractionBar) {
            return (React.createElement("div", { className: Classes.TABLE_COLUMN_NAME, title: name },
                React.createElement("div", { className: Classes.TABLE_INTERACTION_BAR },
                    reorderHandle,
                    dropdownMenu),
                React.createElement(HorizontalCellDivider, null),
                React.createElement("div", { className: Classes.TABLE_COLUMN_NAME_TEXT }, nameComponent)));
        }
        else {
            return (React.createElement("div", { className: Classes.TABLE_COLUMN_NAME, title: name },
                reorderHandle,
                dropdownMenu,
                React.createElement("div", { className: Classes.TABLE_COLUMN_NAME_TEXT }, nameComponent)));
        }
    };
    ColumnHeaderCell.prototype.maybeRenderContent = function () {
        if (this.props.children === null) {
            return undefined;
        }
        return React.createElement("div", { className: Classes.TABLE_HEADER_CONTENT }, this.props.children);
    };
    ColumnHeaderCell.prototype.maybeRenderDropdownMenu = function () {
        var _a = this.props, index = _a.index, menuIcon = _a.menuIcon, menuRenderer = _a.menuRenderer;
        if (!core_1.Utils.isFunction(menuRenderer)) {
            return undefined;
        }
        var classes = classnames_1.default(Classes.TABLE_TH_MENU_CONTAINER, (_b = {},
            _b[Classes.TABLE_TH_MENU_OPEN] = this.state.isActive,
            _b));
        return (React.createElement("div", { className: classes },
            React.createElement("div", { className: Classes.TABLE_TH_MENU_CONTAINER_BACKGROUND }),
            React.createElement(core_1.Popover, { content: menuRenderer(index), position: core_1.Position.BOTTOM, className: Classes.TABLE_TH_MENU, modifiers: { preventOverflow: { boundariesElement: "window" } }, onOpened: this.handlePopoverOpened, onClosing: this.handlePopoverClosing },
                React.createElement(core_1.Icon, { icon: menuIcon }))));
        var _b;
    };
    ColumnHeaderCell.defaultProps = {
        isActive: false,
        menuIcon: "chevron-down",
    };
    ColumnHeaderCell.contextTypes = context_1.columnInteractionBarContextTypes;
    return ColumnHeaderCell;
}(core_1.AbstractPureComponent));
exports.ColumnHeaderCell = ColumnHeaderCell;
//# sourceMappingURL=columnHeaderCell.js.map