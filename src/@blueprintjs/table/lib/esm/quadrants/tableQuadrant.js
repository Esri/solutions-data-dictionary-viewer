/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { AbstractComponent, Utils as CoreUtils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
import * as Errors from "../common/errors";
export var QuadrantType;
(function (QuadrantType) {
    /**
     * The main quadrant beneath any frozen rows or columns.
     */
    QuadrantType["MAIN"] = "main";
    /**
     * The top quadrant, containing column headers and frozen rows.
     */
    QuadrantType["TOP"] = "top";
    /**
     * The left quadrant, containing row headers and frozen columns.
     */
    QuadrantType["LEFT"] = "left";
    /**
     * The top-left quadrant, containing the headers and cells common to both
     * the frozen columns and frozen rows.
     */
    QuadrantType["TOP_LEFT"] = "top-left";
})(QuadrantType || (QuadrantType = {}));
var TableQuadrant = /** @class */ (function (_super) {
    tslib_1.__extends(TableQuadrant, _super);
    function TableQuadrant() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableQuadrant.prototype.render = function () {
        var _a = this.props, grid = _a.grid, enableRowHeader = _a.enableRowHeader, quadrantType = _a.quadrantType, bodyRenderer = _a.bodyRenderer;
        var showFrozenRowsOnly = quadrantType === QuadrantType.TOP || quadrantType === QuadrantType.TOP_LEFT;
        var showFrozenColumnsOnly = quadrantType === QuadrantType.LEFT || quadrantType === QuadrantType.TOP_LEFT;
        var className = classNames(Classes.TABLE_QUADRANT, this.getQuadrantCssClass(), this.props.className);
        var maybeMenu = enableRowHeader && CoreUtils.safeInvoke(this.props.menuRenderer);
        var maybeRowHeader = enableRowHeader && CoreUtils.safeInvoke(this.props.rowHeaderCellRenderer, showFrozenRowsOnly);
        var maybeColumnHeader = CoreUtils.safeInvoke(this.props.columnHeaderCellRenderer, showFrozenColumnsOnly);
        var body = quadrantType != null
            ? bodyRenderer(quadrantType, showFrozenRowsOnly, showFrozenColumnsOnly)
            : bodyRenderer();
        // need to set bottom container size to prevent overlay clipping on scroll
        var bottomContainerStyle = {
            height: grid.getHeight(),
            width: grid.getWidth(),
        };
        return (React.createElement("div", { className: className, style: this.props.style, ref: this.props.quadrantRef },
            React.createElement("div", { className: Classes.TABLE_QUADRANT_SCROLL_CONTAINER, ref: this.props.scrollContainerRef, onScroll: this.props.onScroll, onWheel: this.props.onWheel },
                React.createElement("div", { className: Classes.TABLE_TOP_CONTAINER },
                    maybeMenu,
                    maybeColumnHeader),
                React.createElement("div", { className: Classes.TABLE_BOTTOM_CONTAINER, style: bottomContainerStyle },
                    maybeRowHeader,
                    React.createElement("div", { className: Classes.TABLE_QUADRANT_BODY_CONTAINER, ref: this.props.bodyRef }, body)))));
    };
    TableQuadrant.prototype.validateProps = function (nextProps) {
        var quadrantType = nextProps.quadrantType;
        if (nextProps.onScroll != null && quadrantType != null && quadrantType !== QuadrantType.MAIN) {
            console.warn(Errors.QUADRANT_ON_SCROLL_UNNECESSARILY_DEFINED);
        }
    };
    TableQuadrant.prototype.getQuadrantCssClass = function () {
        switch (this.props.quadrantType) {
            case QuadrantType.MAIN:
                return Classes.TABLE_QUADRANT_MAIN;
            case QuadrantType.TOP:
                return Classes.TABLE_QUADRANT_TOP;
            case QuadrantType.LEFT:
                return Classes.TABLE_QUADRANT_LEFT;
            case QuadrantType.TOP_LEFT:
                return Classes.TABLE_QUADRANT_TOP_LEFT;
            default:
                return undefined;
        }
    };
    // we want the user to explicitly pass a quadrantType. define defaultProps as a Partial to avoid
    // declaring that and other required props here.
    TableQuadrant.defaultProps = {
        enableRowHeader: true,
    };
    return TableQuadrant;
}(AbstractComponent));
export { TableQuadrant };
//# sourceMappingURL=tableQuadrant.js.map