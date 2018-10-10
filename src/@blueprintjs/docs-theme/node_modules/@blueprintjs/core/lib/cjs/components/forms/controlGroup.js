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
var Classes = tslib_1.__importStar(require("../../common/classes"));
var props_1 = require("../../common/props");
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var ControlGroup = /** @class */ (function (_super) {
    tslib_1.__extends(ControlGroup, _super);
    function ControlGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControlGroup.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, fill = _a.fill, vertical = _a.vertical, htmlProps = tslib_1.__rest(_a, ["children", "className", "fill", "vertical"]);
        var rootClasses = classnames_1.default(Classes.CONTROL_GROUP, (_b = {},
            _b[Classes.FILL] = fill,
            _b[Classes.VERTICAL] = vertical,
            _b), className);
        return (React.createElement("div", tslib_1.__assign({}, htmlProps, { className: rootClasses }), children));
        var _b;
    };
    ControlGroup.displayName = props_1.DISPLAYNAME_PREFIX + ".ControlGroup";
    return ControlGroup;
}(React.PureComponent));
exports.ControlGroup = ControlGroup;
//# sourceMappingURL=controlGroup.js.map