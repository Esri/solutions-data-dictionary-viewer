"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var React = tslib_1.__importStar(require("react"));
var ReactDOM = tslib_1.__importStar(require("react-dom"));
var dragEvents_1 = require("./dragEvents");
var REATTACH_PROPS_KEYS = ["stopPropagation", "preventDefault"];
/**
 * This component provides a simple interface for combined drag and/or click
 * events.
 *
 * Since the mouse interactions for drag and click are overloaded, here are
 * the events that will fire in these cases:
 *
 * A Click Interaction
 * 1. The user presses down on the render element, triggering the onActivate
 *    callback.
 * 2. The user releases the mouse button without moving it, triggering the
 *    onClick callback.
 *
 * A Drag Interaction
 * 1. The user presses down on the render element, triggering the onActivate
 *    callback.
 * 2. The user moves the mouse, triggering the onDragMove callback.
 * 3. The user moves the mouse, triggering the onDragMove callback.
 * 4. The user moves the mouse, triggering the onDragMove callback.
 * 5. The user releases the mouse button, triggering a final onDragMove
 *    callback as well as an onDragEnd callback.
 *
 * If `false` is returned from the onActivate callback, no further events
 * will be fired until the next activation.
 */
var Draggable = /** @class */ (function (_super) {
    tslib_1.__extends(Draggable, _super);
    function Draggable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Draggable.prototype.render = function () {
        return React.Children.only(this.props.children);
    };
    Draggable.prototype.componentDidUpdate = function (prevProps) {
        var propsWhitelist = { include: REATTACH_PROPS_KEYS };
        if (this.events && !core_1.Utils.shallowCompareKeys(prevProps, this.props, propsWhitelist)) {
            this.events.attach(ReactDOM.findDOMNode(this), this.props);
        }
    };
    Draggable.prototype.componentDidMount = function () {
        this.events = new dragEvents_1.DragEvents();
        this.events.attach(ReactDOM.findDOMNode(this), this.props);
    };
    Draggable.prototype.componentWillUnmount = function () {
        this.events.detach();
        delete this.events;
    };
    Draggable.defaultProps = {
        preventDefault: true,
        stopPropagation: false,
    };
    return Draggable;
}(React.PureComponent));
exports.Draggable = Draggable;
//# sourceMappingURL=draggable.js.map