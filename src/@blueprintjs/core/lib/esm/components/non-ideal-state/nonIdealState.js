/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ensureElement } from "../../common/utils";
import { H4 } from "../html/html";
import { Icon } from "../icon/icon";
var NonIdealState = /** @class */ (function (_super) {
    tslib_1.__extends(NonIdealState, _super);
    function NonIdealState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NonIdealState.prototype.render = function () {
        var _a = this.props, action = _a.action, children = _a.children, className = _a.className, description = _a.description, title = _a.title;
        return (React.createElement("div", { className: classNames(Classes.NON_IDEAL_STATE, className) },
            this.maybeRenderVisual(),
            title && React.createElement(H4, null, title),
            description && ensureElement(description, "div"),
            action,
            children));
    };
    NonIdealState.prototype.maybeRenderVisual = function () {
        var icon = this.props.icon;
        if (icon == null) {
            return null;
        }
        else {
            return (React.createElement("div", { className: Classes.NON_IDEAL_STATE_VISUAL },
                React.createElement(Icon, { icon: icon, iconSize: Icon.SIZE_LARGE * 3 })));
        }
    };
    NonIdealState.displayName = DISPLAYNAME_PREFIX + ".NonIdealState";
    return NonIdealState;
}(React.PureComponent));
export { NonIdealState };
//# sourceMappingURL=nonIdealState.js.map