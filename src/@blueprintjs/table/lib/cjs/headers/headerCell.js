"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var Classes = tslib_1.__importStar(require("../common/classes"));
var HeaderCell = /** @class */ (function (_super) {
    tslib_1.__extends(HeaderCell, _super);
    function HeaderCell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isActive: false,
        };
        return _this;
    }
    HeaderCell.prototype.shouldComponentUpdate = function (nextProps) {
        return (!core_1.Utils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] }) ||
            !core_1.Utils.deepCompareKeys(this.props, nextProps, ["style"]));
    };
    HeaderCell.prototype.renderContextMenu = function (_event) {
        var menuRenderer = this.props.menuRenderer;
        if (core_1.Utils.isFunction(menuRenderer)) {
            // the preferred way (a consistent function instance that won't cause as many re-renders)
            return menuRenderer(this.props.index);
        }
        else {
            return undefined;
        }
    };
    HeaderCell.prototype.render = function () {
        var classes = classnames_1.default(Classes.TABLE_HEADER, (_a = {},
            _a[Classes.TABLE_HEADER_ACTIVE] = this.props.isActive || this.state.isActive,
            _a[Classes.TABLE_HEADER_SELECTED] = this.props.isSelected,
            _a[core_1.Classes.LOADING] = this.props.loading,
            _a), this.props.className);
        return (React.createElement("div", { className: classes, style: this.props.style }, this.props.children));
        var _a;
    };
    HeaderCell = tslib_1.__decorate([
        core_1.ContextMenuTarget
    ], HeaderCell);
    return HeaderCell;
}(React.Component));
exports.HeaderCell = HeaderCell;
//# sourceMappingURL=headerCell.js.map