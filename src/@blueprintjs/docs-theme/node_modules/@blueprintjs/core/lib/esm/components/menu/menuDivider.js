/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { H6 } from "../html/html";
var MenuDivider = /** @class */ (function (_super) {
    tslib_1.__extends(MenuDivider, _super);
    function MenuDivider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuDivider.prototype.render = function () {
        var _a = this.props, className = _a.className, title = _a.title;
        if (title == null) {
            // simple divider
            return React.createElement("li", { className: classNames(Classes.MENU_DIVIDER, className) });
        }
        else {
            // section header with title
            return (React.createElement("li", { className: classNames(Classes.MENU_HEADER, className) },
                React.createElement(H6, null, title)));
        }
    };
    MenuDivider.displayName = DISPLAYNAME_PREFIX + ".MenuDivider";
    return MenuDivider;
}(React.Component));
export { MenuDivider };
//# sourceMappingURL=menuDivider.js.map