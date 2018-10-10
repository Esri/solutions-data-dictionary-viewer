"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DragEvents = /** @class */ (function () {
    function DragEvents() {
        var _this = this;
        this.handleMouseDown = function (event) {
            _this.initCoordinateData(event);
            if (_this.handler != null && _this.handler.onActivate != null) {
                var exitCode = _this.handler.onActivate(event);
                if (exitCode === false) {
                    return;
                }
            }
            _this.isActivated = true;
            _this.maybeAlterEventChain(event);
            // It is possible that the mouseup would not be called after the initial
            // mousedown (for example if the mouse is moved out of the window). So,
            // we preemptively detach to avoid duplicate listeners.
            _this.detachDocumentEventListeners();
            _this.attachDocumentEventListeners();
        };
        this.handleMouseMove = function (event) {
            _this.maybeAlterEventChain(event);
            if (_this.isActivated) {
                _this.isDragging = true;
            }
            if (_this.isDragging) {
                var coords = _this.updateCoordinateData(event);
                if (_this.handler != null && _this.handler.onDragMove != null) {
                    _this.handler.onDragMove(event, coords);
                }
            }
        };
        this.handleMouseUp = function (event) {
            _this.maybeAlterEventChain(event);
            if (_this.handler != null) {
                if (_this.isDragging) {
                    var coords = _this.updateCoordinateData(event);
                    if (_this.handler.onDragMove != null) {
                        _this.handler.onDragMove(event, coords);
                    }
                    if (_this.handler.onDragEnd != null) {
                        _this.handler.onDragEnd(event, coords);
                    }
                }
                else if (_this.isActivated) {
                    if (_this.handler.onDoubleClick != null) {
                        if (_this.doubleClickTimeoutToken == null) {
                            // if this the first click of a possible double-click,
                            // we delay the firing of the click event by the
                            // timeout.
                            _this.doubleClickTimeoutToken = window.setTimeout(function () {
                                delete _this.doubleClickTimeoutToken;
                                if (_this.handler.onClick != null) {
                                    _this.handler.onClick(event);
                                }
                            }, DragEvents.DOUBLE_CLICK_TIMEOUT_MSEC);
                        }
                        else {
                            // otherwise, this is the second click in the double-
                            // click so we cancel the single-click timeout and
                            // fire the double-click event.
                            window.clearTimeout(_this.doubleClickTimeoutToken);
                            delete _this.doubleClickTimeoutToken;
                            _this.handler.onDoubleClick(event);
                        }
                    }
                    else if (_this.handler.onClick != null) {
                        _this.handler.onClick(event);
                    }
                }
            }
            _this.isActivated = false;
            _this.isDragging = false;
            _this.detachDocumentEventListeners();
        };
    }
    /**
     * Returns true if the event includes a modifier key that often adds the result of the drag
     * event to any existing state. For example, holding CTRL before dragging may select another
     * region in addition to an existing one, while the absence of a modifier key may clear the
     * existing selection first.
     * @param event the mouse event for the drag interaction
     */
    DragEvents.isAdditive = function (event) {
        return event.ctrlKey || event.metaKey;
    };
    DragEvents.prototype.attach = function (element, handler) {
        this.detach();
        this.handler = handler;
        this.element = element;
        if (this.isValidDragHandler(handler)) {
            this.element.addEventListener("mousedown", this.handleMouseDown);
        }
        return this;
    };
    DragEvents.prototype.detach = function () {
        if (this.element != null) {
            this.element.removeEventListener("mousedown", this.handleMouseDown);
            this.detachDocumentEventListeners();
        }
    };
    DragEvents.prototype.isValidDragHandler = function (handler) {
        return (handler != null &&
            (handler.onActivate != null ||
                handler.onDragMove != null ||
                handler.onDragEnd != null ||
                handler.onClick != null ||
                handler.onDoubleClick != null));
    };
    DragEvents.prototype.attachDocumentEventListeners = function () {
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    };
    DragEvents.prototype.detachDocumentEventListeners = function () {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    };
    DragEvents.prototype.initCoordinateData = function (event) {
        this.activationCoordinates = [event.clientX, event.clientY];
        this.lastCoordinates = this.activationCoordinates;
    };
    DragEvents.prototype.updateCoordinateData = function (event) {
        var currentCoordinates = [event.clientX, event.clientY];
        var deltaCoordinates = [
            currentCoordinates[0] - this.lastCoordinates[0],
            currentCoordinates[1] - this.lastCoordinates[1],
        ];
        var offsetCoordinates = [
            currentCoordinates[0] - this.activationCoordinates[0],
            currentCoordinates[1] - this.activationCoordinates[1],
        ];
        var data = {
            activation: this.activationCoordinates,
            current: currentCoordinates,
            delta: deltaCoordinates,
            last: this.lastCoordinates,
            offset: offsetCoordinates,
        };
        this.lastCoordinates = [event.clientX, event.clientY];
        return data;
    };
    DragEvents.prototype.maybeAlterEventChain = function (event) {
        if (this.handler.preventDefault) {
            event.preventDefault();
        }
        if (this.handler.stopPropagation) {
            event.stopPropagation();
        }
    };
    DragEvents.DOUBLE_CLICK_TIMEOUT_MSEC = 500;
    return DragEvents;
}());
exports.DragEvents = DragEvents;
//# sourceMappingURL=dragEvents.js.map