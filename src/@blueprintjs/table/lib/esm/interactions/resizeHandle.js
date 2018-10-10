/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
import { Draggable } from "./draggable";
export var Orientation;
(function (Orientation) {
    Orientation[Orientation["HORIZONTAL"] = 1] = "HORIZONTAL";
    Orientation[Orientation["VERTICAL"] = 0] = "VERTICAL";
})(Orientation || (Orientation = {}));
var ResizeHandle = /** @class */ (function (_super) {
    tslib_1.__extends(ResizeHandle, _super);
    function ResizeHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isDragging: false,
        };
        _this.handleActivate = function (event) {
            _this.setState({ isDragging: true });
            _this.props.onLayoutLock(true);
            event.stopPropagation();
            event.stopImmediatePropagation();
            return true;
        };
        _this.handleDragMove = function (_event, coords) {
            var orientationIndex = _this.props.orientation;
            if (_this.props.onResizeMove != null) {
                _this.props.onResizeMove(coords.offset[orientationIndex], coords.delta[orientationIndex]);
            }
        };
        _this.handleDragEnd = function (_event, coords) {
            var orientationIndex = _this.props.orientation;
            _this.setState({ isDragging: false });
            _this.props.onLayoutLock(false);
            if (_this.props.onResizeMove != null) {
                _this.props.onResizeMove(coords.offset[orientationIndex], coords.delta[orientationIndex]);
            }
            if (_this.props.onResizeEnd != null) {
                _this.props.onResizeEnd(coords.offset[orientationIndex]);
            }
        };
        _this.handleClick = function (_event) {
            _this.setState({ isDragging: false });
            _this.props.onLayoutLock(false);
        };
        _this.handleDoubleClick = function (_event) {
            _this.setState({ isDragging: false });
            _this.props.onLayoutLock(false);
            if (_this.props.onDoubleClick != null) {
                _this.props.onDoubleClick();
            }
        };
        return _this;
    }
    ResizeHandle.prototype.render = function () {
        var _a = this.props, onResizeMove = _a.onResizeMove, onResizeEnd = _a.onResizeEnd, onDoubleClick = _a.onDoubleClick, orientation = _a.orientation;
        if (onResizeMove == null && onResizeEnd == null && onDoubleClick == null) {
            return undefined;
        }
        var targetClasses = classNames(Classes.TABLE_RESIZE_HANDLE_TARGET, (_b = {},
            _b[Classes.TABLE_DRAGGING] = this.state.isDragging,
            _b[Classes.TABLE_RESIZE_HORIZONTAL] = orientation === Orientation.HORIZONTAL,
            _b[Classes.TABLE_RESIZE_VERTICAL] = orientation === Orientation.VERTICAL,
            _b), this.props.className);
        var handleClasses = classNames(Classes.TABLE_RESIZE_HANDLE, (_c = {},
            _c[Classes.TABLE_DRAGGING] = this.state.isDragging,
            _c));
        return (React.createElement(Draggable, { onActivate: this.handleActivate, onClick: this.handleClick, onDoubleClick: this.handleDoubleClick, onDragEnd: this.handleDragEnd, onDragMove: this.handleDragMove },
            React.createElement("div", { className: targetClasses },
                React.createElement("div", { className: handleClasses }))));
        var _b, _c;
    };
    return ResizeHandle;
}(React.PureComponent));
export { ResizeHandle };
//# sourceMappingURL=resizeHandle.js.map