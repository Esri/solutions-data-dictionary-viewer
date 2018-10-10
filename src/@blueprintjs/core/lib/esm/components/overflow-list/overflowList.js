/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { Boundary } from "../../common/boundary";
import * as Classes from "../../common/classes";
import { OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED } from "../../common/errors";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ResizeSensor } from "../resize-sensor/resizeSensor";
var OverflowList = /** @class */ (function (_super) {
    tslib_1.__extends(OverflowList, _super);
    function OverflowList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            overflow: [],
            visible: _this.props.items,
        };
        /** A cache containing the widths of all elements being observed to detect growing/shrinking */
        _this.previousWidths = new Map();
        _this.spacer = null;
        _this.resize = function (entries) {
            // if any parent is growing, assume we have more room than before
            var growing = entries.some(function (entry) {
                var previousWidth = _this.previousWidths.get(entry.target) || 0;
                return entry.contentRect.width > previousWidth;
            });
            _this.repartition(growing);
            entries.forEach(function (entry) { return _this.previousWidths.set(entry.target, entry.contentRect.width); });
        };
        return _this;
    }
    OverflowList.ofType = function () {
        return OverflowList;
    };
    OverflowList.prototype.componentDidMount = function () {
        this.repartition(false);
    };
    OverflowList.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props, collapseFrom = _a.collapseFrom, items = _a.items, minVisibleItems = _a.minVisibleItems, observeParents = _a.observeParents, overflowRenderer = _a.overflowRenderer, visibleItemRenderer = _a.visibleItemRenderer;
        if (observeParents !== nextProps.observeParents) {
            console.warn(OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED);
        }
        if (collapseFrom !== nextProps.collapseFrom ||
            items !== nextProps.items ||
            minVisibleItems !== nextProps.minVisibleItems ||
            overflowRenderer !== nextProps.overflowRenderer ||
            visibleItemRenderer !== nextProps.visibleItemRenderer) {
            // reset visible state if the above props change.
            this.setState({
                overflow: [],
                visible: nextProps.items,
            });
        }
    };
    OverflowList.prototype.componentDidUpdate = function () {
        this.repartition(false);
    };
    OverflowList.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, collapseFrom = _a.collapseFrom, observeParents = _a.observeParents, style = _a.style, visibleItemRenderer = _a.visibleItemRenderer;
        var overflow = this.maybeRenderOverflow();
        return (React.createElement(ResizeSensor, { onResize: this.resize, observeParents: observeParents },
            React.createElement("div", { className: classNames(Classes.OVERFLOW_LIST, className), style: style },
                collapseFrom === Boundary.START ? overflow : null,
                this.state.visible.map(visibleItemRenderer),
                collapseFrom === Boundary.END ? overflow : null,
                React.createElement("div", { className: Classes.OVERFLOW_LIST_SPACER, ref: function (ref) { return (_this.spacer = ref); } }))));
    };
    OverflowList.prototype.maybeRenderOverflow = function () {
        var overflow = this.state.overflow;
        if (overflow.length === 0) {
            return null;
        }
        return this.props.overflowRenderer(overflow);
    };
    OverflowList.prototype.repartition = function (growing) {
        var _this = this;
        if (this.spacer == null) {
            return;
        }
        if (growing) {
            this.setState({
                overflow: [],
                visible: this.props.items,
            });
        }
        else if (this.spacer.getBoundingClientRect().width < 0.9) {
            // spacer has flex-shrink and width 1px so if it's much smaller then we know to shrink
            this.setState(function (state) {
                if (state.visible.length <= _this.props.minVisibleItems) {
                    return null;
                }
                var collapseFromStart = _this.props.collapseFrom === Boundary.START;
                var visible = state.visible.slice();
                var next = collapseFromStart ? visible.shift() : visible.pop();
                if (next === undefined) {
                    return null;
                }
                var overflow = collapseFromStart ? state.overflow.concat([next]) : [next].concat(state.overflow);
                return {
                    overflow: overflow,
                    visible: visible,
                };
            });
        }
    };
    OverflowList.displayName = DISPLAYNAME_PREFIX + ".OverflowList";
    OverflowList.defaultProps = {
        collapseFrom: Boundary.START,
        minVisibleItems: 0,
    };
    return OverflowList;
}(React.PureComponent));
export { OverflowList };
//# sourceMappingURL=overflowList.js.map