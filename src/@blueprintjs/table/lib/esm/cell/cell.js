/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
import { Classes as CoreClasses, Utils as CoreUtils } from "@blueprintjs/core";
import { LoadableContent } from "../common/loadableContent";
import { JSONFormat } from "./formats/jsonFormat";
import { TruncatedFormat } from "./formats/truncatedFormat";
export var emptyCellRenderer = function () { return React.createElement(Cell, null); };
var Cell = /** @class */ (function (_super) {
    tslib_1.__extends(Cell, _super);
    function Cell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cell.prototype.shouldComponentUpdate = function (nextProps) {
        // deeply compare "style," because a new but identical object might have been provided.
        return (!CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] }) ||
            !CoreUtils.deepCompareKeys(this.props.style, nextProps.style));
    };
    Cell.prototype.render = function () {
        var _a = this.props, cellRef = _a.cellRef, tabIndex = _a.tabIndex, onKeyDown = _a.onKeyDown, onKeyUp = _a.onKeyUp, onKeyPress = _a.onKeyPress, style = _a.style, intent = _a.intent, interactive = _a.interactive, loading = _a.loading, tooltip = _a.tooltip, truncated = _a.truncated, className = _a.className, wrapText = _a.wrapText;
        var classes = classNames(Classes.TABLE_CELL, CoreClasses.intentClass(intent), (_b = {},
            _b[Classes.TABLE_CELL_INTERACTIVE] = interactive,
            _b[CoreClasses.LOADING] = loading,
            _b[Classes.TABLE_TRUNCATED_CELL] = truncated,
            _b), className);
        var textClasses = classNames((_c = {},
            _c[Classes.TABLE_TRUNCATED_TEXT] = truncated,
            _c[Classes.TABLE_NO_WRAP_TEXT] = !wrapText,
            _c));
        // add width and height to the children, for use in shouldComponentUpdate in truncatedFormat
        // note: these aren't actually used by truncated format, just in shouldComponentUpdate
        var modifiedChildren = React.Children.map(this.props.children, function (child) {
            if ((style != null && React.isValidElement(child)) ||
                (CoreUtils.isElementOfType(child, TruncatedFormat) || CoreUtils.isElementOfType(child, JSONFormat))) {
                return React.cloneElement(child, {
                    parentCellHeight: parseInt(style.height, 10),
                    parentCellWidth: parseInt(style.width, 10),
                });
            }
            return child;
        });
        var content = React.createElement("div", { className: textClasses }, modifiedChildren);
        return (React.createElement("div", tslib_1.__assign({ className: classes, title: tooltip, ref: cellRef }, { style: style, tabIndex: tabIndex, onKeyDown: onKeyDown, onKeyUp: onKeyUp, onKeyPress: onKeyPress }),
            React.createElement(LoadableContent, { loading: loading, variableLength: true }, content)));
        var _b, _c;
    };
    Cell.defaultProps = {
        truncated: true,
        wrapText: false,
    };
    return Cell;
}(React.Component));
export { Cell };
//# sourceMappingURL=cell.js.map