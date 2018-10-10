"use strict";
/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var abstractPureComponent_1 = require("../../common/abstractPureComponent");
var Classes = tslib_1.__importStar(require("../../common/classes"));
var errors_1 = require("../../common/errors");
var props_1 = require("../../common/props");
var utils_1 = require("../../common/utils");
// see http://stackoverflow.com/a/18473154/3124288 for calculating arc path
var SPINNER_TRACK = "M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89";
// unitless total length of SVG path, to which stroke-dash* properties are relative.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pathLength
// this value is the result of `<path d={SPINNER_TRACK} />.getTotalLength()` and works in all browsers:
var PATH_LENGTH = 280;
var MIN_SIZE = 10;
var STROKE_WIDTH = 4;
var MIN_STROKE_WIDTH = 16;
var Spinner = /** @class */ (function (_super) {
    tslib_1.__extends(Spinner, _super);
    function Spinner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Spinner.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.value !== this.props.value) {
            // IE/Edge: re-render after changing value to force SVG update
            this.forceUpdate();
        }
    };
    Spinner.prototype.render = function () {
        var _a = this.props, className = _a.className, intent = _a.intent, value = _a.value, _b = _a.tagName, TagName = _b === void 0 ? "div" : _b;
        var size = this.getSize();
        var classes = classnames_1.default(Classes.SPINNER, Classes.intentClass(intent), (_c = {}, _c[Classes.SPINNER_NO_SPIN] = value != null, _c), className);
        // attempt to keep spinner stroke width constant at all sizes
        var strokeWidth = Math.min(MIN_STROKE_WIDTH, STROKE_WIDTH * Spinner.SIZE_LARGE / size);
        var strokeOffset = PATH_LENGTH - PATH_LENGTH * (value == null ? 0.25 : utils_1.clamp(value, 0, 1));
        // multiple DOM elements around SVG are necessary to properly isolate animation:
        // - SVG elements in IE do not support anim/trans so they must be set on a parent HTML element.
        // - SPINNER_ANIMATION isolates svg from parent display and is always centered inside root element.
        return (React.createElement(TagName, { className: classes },
            React.createElement("span", { className: Classes.SPINNER_ANIMATION },
                React.createElement("svg", { height: size, width: size, viewBox: "0 0 100 100", strokeWidth: strokeWidth },
                    React.createElement("path", { className: Classes.SPINNER_TRACK, d: SPINNER_TRACK }),
                    React.createElement("path", { className: Classes.SPINNER_HEAD, d: SPINNER_TRACK, pathLength: PATH_LENGTH, strokeDasharray: PATH_LENGTH + " " + PATH_LENGTH, strokeDashoffset: strokeOffset })))));
        var _c;
    };
    Spinner.prototype.validateProps = function (_a) {
        var _b = _a.className, className = _b === void 0 ? "" : _b, size = _a.size;
        if (size != null && (className.indexOf(Classes.SMALL) >= 0 || className.indexOf(Classes.LARGE) >= 0)) {
            console.warn(errors_1.SPINNER_WARN_CLASSES_SIZE);
        }
    };
    Spinner.prototype.getSize = function () {
        var _a = this.props, _b = _a.className, className = _b === void 0 ? "" : _b, size = _a.size;
        if (size == null) {
            // allow Classes constants to determine default size.
            if (className.indexOf(Classes.SMALL) >= 0) {
                return Spinner.SIZE_SMALL;
            }
            else if (className.indexOf(Classes.LARGE) >= 0) {
                return Spinner.SIZE_LARGE;
            }
            return Spinner.SIZE_STANDARD;
        }
        return Math.max(MIN_SIZE, size);
    };
    Spinner.displayName = props_1.DISPLAYNAME_PREFIX + ".Spinner";
    Spinner.SIZE_SMALL = 24;
    Spinner.SIZE_STANDARD = 50;
    Spinner.SIZE_LARGE = 100;
    return Spinner;
}(abstractPureComponent_1.AbstractPureComponent));
exports.Spinner = Spinner;
//# sourceMappingURL=spinner.js.map