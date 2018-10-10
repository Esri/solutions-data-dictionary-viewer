"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// HACKHACK: workaround for https://github.com/palantir/tslint/issues/1768
// tslint:disable adjacent-overload-signatures
/**
 * A simple object for storing the client bounds of HTMLElements. Since
 * ClientRects are immutable, this object enables editing and some simple
 * manipulation methods.
 */
var Rect = /** @class */ (function () {
    function Rect(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    /**
     * Returns the smallest Rect that entirely contains the supplied rects
     */
    Rect.union = function (anyRect0, anyRect1) {
        var rect0 = Rect.wrap(anyRect0);
        var rect1 = Rect.wrap(anyRect1);
        var top = Math.min(rect0.top, rect1.top);
        var left = Math.min(rect0.left, rect1.left);
        var bottom = Math.max(rect0.top + rect0.height, rect1.top + rect1.height);
        var right = Math.max(rect0.left + rect0.width, rect1.left + rect1.width);
        var height = bottom - top;
        var width = right - left;
        return new Rect(left, top, width, height);
    };
    /**
     * Returns a new Rect that subtracts the origin of the second argument
     * from the first.
     */
    Rect.subtractOrigin = function (anyRect0, anyRect1) {
        var rect0 = Rect.wrap(anyRect0);
        var rect1 = Rect.wrap(anyRect1);
        return new Rect(rect0.left - rect1.left, rect0.top - rect1.top, rect0.width, rect0.height);
    };
    /**
     * Returns the CSS properties representing the absolute positioning of
     * this Rect.
     */
    Rect.style = function (rect) {
        return {
            height: rect.height + "px",
            left: rect.left + "px",
            position: "absolute",
            top: rect.top + "px",
            width: rect.width + "px",
        };
    };
    /**
     * Given a ClientRect or Rect object, returns a Rect object.
     */
    Rect.wrap = function (rect) {
        if (rect instanceof Rect) {
            return rect;
        }
        else {
            return new Rect(rect.left, rect.top, rect.width, rect.height);
        }
    };
    Rect.prototype.subtractOrigin = function (anyRect) {
        return Rect.subtractOrigin(this, anyRect);
    };
    Rect.prototype.union = function (anyRect) {
        return Rect.union(this, anyRect);
    };
    Rect.prototype.style = function () {
        return Rect.style(this);
    };
    Rect.prototype.sizeStyle = function () {
        return {
            height: this.height + "px",
            width: this.width + "px",
        };
    };
    Rect.prototype.containsX = function (clientX) {
        return clientX >= this.left && clientX <= this.left + this.width;
    };
    Rect.prototype.containsY = function (clientY) {
        return clientY >= this.top && clientY <= this.top + this.height;
    };
    Rect.prototype.equals = function (rect) {
        return (rect != null &&
            this.left === rect.left &&
            this.top === rect.top &&
            this.width === rect.width &&
            this.height === rect.height);
    };
    Rect.ORIGIN = new Rect(0, 0, 0, 0);
    return Rect;
}());
exports.Rect = Rect;
//# sourceMappingURL=rect.js.map