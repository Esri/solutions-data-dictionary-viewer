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
import { Popover, PopoverInteractionKind } from "../popover/popover";
var Tooltip = /** @class */ (function (_super) {
    tslib_1.__extends(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, children = _a.children, intent = _a.intent, popoverClassName = _a.popoverClassName, restProps = tslib_1.__rest(_a, ["children", "intent", "popoverClassName"]);
        var classes = classNames(Classes.TOOLTIP, Classes.intentClass(intent), popoverClassName);
        return (React.createElement(Popover, tslib_1.__assign({}, restProps, { autoFocus: false, canEscapeKeyClose: false, enforceFocus: false, interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY, lazy: true, popoverClassName: classes }), children));
    };
    Tooltip.displayName = DISPLAYNAME_PREFIX + ".Tooltip";
    Tooltip.defaultProps = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        transitionDuration: 100,
    };
    return Tooltip;
}(React.PureComponent));
export { Tooltip };
//# sourceMappingURL=tooltip.js.map