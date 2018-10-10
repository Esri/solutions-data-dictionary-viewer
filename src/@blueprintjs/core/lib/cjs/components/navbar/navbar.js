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
var navbarDivider_1 = require("./navbarDivider");
var navbarGroup_1 = require("./navbarGroup");
var navbarHeading_1 = require("./navbarHeading");
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var Navbar = /** @class */ (function (_super) {
    tslib_1.__extends(Navbar, _super);
    function Navbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Navbar.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, fixedToTop = _a.fixedToTop, htmlProps = tslib_1.__rest(_a, ["children", "className", "fixedToTop"]);
        var classes = classnames_1.default(Classes.NAVBAR, (_b = {}, _b[Classes.FIXED_TOP] = fixedToTop, _b), className);
        return (React.createElement("div", tslib_1.__assign({ className: classes }, htmlProps), children));
        var _b;
    };
    Navbar.displayName = props_1.DISPLAYNAME_PREFIX + ".Navbar";
    Navbar.Divider = navbarDivider_1.NavbarDivider;
    Navbar.Group = navbarGroup_1.NavbarGroup;
    Navbar.Heading = navbarHeading_1.NavbarHeading;
    return Navbar;
}(React.PureComponent));
exports.Navbar = Navbar;
//# sourceMappingURL=navbar.js.map