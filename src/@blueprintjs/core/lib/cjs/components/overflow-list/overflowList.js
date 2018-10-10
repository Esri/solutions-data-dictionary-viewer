"use strict";
/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var boundary_1 = require("../../common/boundary");
var Classes = tslib_1.__importStar(require("../../common/classes"));
var errors_1 = require("../../common/errors");
var props_1 = require("../../common/props");
var resizeSensor_1 = require("../resize-sensor/resizeSensor");
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
            console.warn(errors_1.OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED);
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
        return (React.createElement(resizeSensor_1.ResizeSensor, { onResize: this.resize, observeParents: observeParents },
            React.createElement("div", { className: classnames_1.default(Classes.OVERFLOW_LIST, className), style: style },
                collapseFrom === boundary_1.Boundary.START ? overflow : null,
                this.state.visible.map(visibleItemRenderer),
                collapseFrom === boundary_1.Boundary.END ? overflow : null,
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
                var collapseFromStart = _this.props.collapseFrom === boundary_1.Boundary.START;
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
    OverflowList.displayName = props_1.DISPLAYNAME_PREFIX + ".OverflowList";
    OverflowList.defaultProps = {
        collapseFrom: boundary_1.Boundary.START,
        minVisibleItems: 0,
    };
    return OverflowList;
}(React.PureComponent));
exports.OverflowList = OverflowList;
//# sourceMappingURL=overflowList.js.map