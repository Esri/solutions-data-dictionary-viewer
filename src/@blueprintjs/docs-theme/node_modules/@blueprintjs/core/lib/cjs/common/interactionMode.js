"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TAB_KEY_CODE = 9;
/* istanbul ignore next */
/**
 * A nifty little class that maintains event handlers to add a class to the container element
 * when entering "mouse mode" (on a `mousedown` event) and remove it when entering "keyboard mode"
 * (on a `tab` key `keydown` event).
 */
var InteractionModeEngine = /** @class */ (function () {
    // tslint:disable-next-line:no-constructor-vars
    function InteractionModeEngine(container, className) {
        var _this = this;
        this.container = container;
        this.className = className;
        this.isRunning = false;
        this.handleKeyDown = function (e) {
            if (e.which === TAB_KEY_CODE) {
                _this.reset();
                _this.container.addEventListener("mousedown", _this.handleMouseDown);
            }
        };
        this.handleMouseDown = function () {
            _this.reset();
            _this.container.classList.add(_this.className);
            _this.container.addEventListener("keydown", _this.handleKeyDown);
        };
    }
    /** Returns whether the engine is currently running. */
    InteractionModeEngine.prototype.isActive = function () {
        return this.isRunning;
    };
    /** Enable behavior which applies the given className when in mouse mode. */
    InteractionModeEngine.prototype.start = function () {
        this.container.addEventListener("mousedown", this.handleMouseDown);
        this.isRunning = true;
    };
    /** Disable interaction mode behavior and remove className from container. */
    InteractionModeEngine.prototype.stop = function () {
        this.reset();
        this.isRunning = false;
    };
    InteractionModeEngine.prototype.reset = function () {
        this.container.classList.remove(this.className);
        this.container.removeEventListener("keydown", this.handleKeyDown);
        this.container.removeEventListener("mousedown", this.handleMouseDown);
    };
    return InteractionModeEngine;
}());
exports.InteractionModeEngine = InteractionModeEngine;
//# sourceMappingURL=interactionMode.js.map