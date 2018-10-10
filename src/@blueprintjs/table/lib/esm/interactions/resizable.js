/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import * as React from "react";
import { Utils } from "../common/index";
import { Orientation, ResizeHandle } from "./resizeHandle";
var Resizable = /** @class */ (function (_super) {
    tslib_1.__extends(Resizable, _super);
    function Resizable(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onResizeMove = function (_offset, delta) {
            _this.offsetSize(delta);
            if (_this.props.onSizeChanged != null) {
                _this.props.onSizeChanged(_this.state.size);
            }
        };
        _this.onResizeEnd = function (_offset) {
            // reset "unclamped" size on end
            _this.setState({ unclampedSize: _this.state.size });
            if (_this.props.onResizeEnd != null) {
                _this.props.onResizeEnd(_this.state.size);
            }
        };
        var size = props.size;
        _this.state = {
            size: size,
            unclampedSize: size,
        };
        return _this;
    }
    Resizable.prototype.componentWillReceiveProps = function (nextProps) {
        var size = nextProps.size;
        this.setState({
            size: size,
            unclampedSize: size,
        });
    };
    Resizable.prototype.render = function () {
        var child = React.Children.only(this.props.children);
        var style = tslib_1.__assign({}, child.props.style, this.getStyle());
        if (this.props.isResizable === false) {
            return React.cloneElement(child, { style: style });
        }
        var resizeHandle = this.renderResizeHandle();
        return React.cloneElement(child, { style: style, resizeHandle: resizeHandle });
    };
    Resizable.prototype.renderResizeHandle = function () {
        var _a = this.props, onLayoutLock = _a.onLayoutLock, onDoubleClick = _a.onDoubleClick, orientation = _a.orientation;
        return (React.createElement(ResizeHandle, { key: "resize-handle", onDoubleClick: onDoubleClick, onLayoutLock: onLayoutLock, onResizeEnd: this.onResizeEnd, onResizeMove: this.onResizeMove, orientation: orientation }));
    };
    /**
     * Returns the CSS style to apply to the child element given the state's
     * size value.
     */
    Resizable.prototype.getStyle = function () {
        if (this.props.orientation === Orientation.VERTICAL) {
            return {
                flexBasis: this.state.size + "px",
                minWidth: "0px",
                width: this.state.size + "px",
            };
        }
        else {
            return {
                flexBasis: this.state.size + "px",
                height: this.state.size + "px",
                minHeight: "0px",
            };
        }
    };
    Resizable.prototype.offsetSize = function (offset) {
        var unclampedSize = this.state.unclampedSize + offset;
        this.setState({
            size: Utils.clamp(unclampedSize, this.props.minSize, this.props.maxSize),
            unclampedSize: unclampedSize,
        });
    };
    Resizable.defaultProps = {
        isResizable: true,
        minSize: 0,
    };
    return Resizable;
}(React.PureComponent));
export { Resizable };
//# sourceMappingURL=resizable.js.map