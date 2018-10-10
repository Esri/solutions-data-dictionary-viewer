/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX } from "../../common/props";
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var NavbarDivider = /** @class */ (function (_super) {
    tslib_1.__extends(NavbarDivider, _super);
    function NavbarDivider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavbarDivider.prototype.render = function () {
        var _a = this.props, className = _a.className, htmlProps = tslib_1.__rest(_a, ["className"]);
        return React.createElement("div", tslib_1.__assign({ className: classNames(Classes.NAVBAR_DIVIDER, className) }, htmlProps));
    };
    NavbarDivider.displayName = DISPLAYNAME_PREFIX + ".NavbarDivider";
    return NavbarDivider;
}(React.PureComponent));
export { NavbarDivider };
//# sourceMappingURL=navbarDivider.js.map