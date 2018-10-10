"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var classes_1 = require("../../common/classes");
var props_1 = require("../../common/props");
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var Divider = /** @class */ (function (_super) {
    tslib_1.__extends(Divider, _super);
    function Divider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Divider.prototype.render = function () {
        var _a = this.props, className = _a.className, _b = _a.tagName, TagName = _b === void 0 ? "div" : _b, htmlProps = tslib_1.__rest(_a, ["className", "tagName"]);
        var classes = classnames_1.default(classes_1.DIVIDER, className);
        return React.createElement(TagName, tslib_1.__assign({}, htmlProps, { className: classes }));
    };
    Divider.displayName = props_1.DISPLAYNAME_PREFIX + ".Divider";
    return Divider;
}(React.PureComponent));
exports.Divider = Divider;
//# sourceMappingURL=divider.js.map