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
var alignment_1 = require("../../common/alignment");
var Classes = tslib_1.__importStar(require("../../common/classes"));
var props_1 = require("../../common/props");
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var NavbarGroup = /** @class */ (function (_super) {
    tslib_1.__extends(NavbarGroup, _super);
    function NavbarGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavbarGroup.prototype.render = function () {
        var _a = this.props, align = _a.align, children = _a.children, className = _a.className, htmlProps = tslib_1.__rest(_a, ["align", "children", "className"]);
        var classes = classnames_1.default(Classes.NAVBAR_GROUP, Classes.alignmentClass(align), className);
        return (React.createElement("div", tslib_1.__assign({ className: classes }, htmlProps), children));
    };
    NavbarGroup.displayName = props_1.DISPLAYNAME_PREFIX + ".NavbarGroup";
    NavbarGroup.defaultProps = {
        align: alignment_1.Alignment.LEFT,
    };
    return NavbarGroup;
}(React.PureComponent));
exports.NavbarGroup = NavbarGroup;
//# sourceMappingURL=navbarGroup.js.map