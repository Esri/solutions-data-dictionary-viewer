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
var Classes = tslib_1.__importStar(require("../../common/classes"));
var props_1 = require("../../common/props");
var popover_1 = require("../popover/popover");
var Tooltip = /** @class */ (function (_super) {
    tslib_1.__extends(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, children = _a.children, intent = _a.intent, popoverClassName = _a.popoverClassName, restProps = tslib_1.__rest(_a, ["children", "intent", "popoverClassName"]);
        var classes = classnames_1.default(Classes.TOOLTIP, Classes.intentClass(intent), popoverClassName);
        return (React.createElement(popover_1.Popover, tslib_1.__assign({}, restProps, { autoFocus: false, canEscapeKeyClose: false, enforceFocus: false, interactionKind: popover_1.PopoverInteractionKind.HOVER_TARGET_ONLY, lazy: true, popoverClassName: classes }), children));
    };
    Tooltip.displayName = props_1.DISPLAYNAME_PREFIX + ".Tooltip";
    Tooltip.defaultProps = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        transitionDuration: 100,
    };
    return Tooltip;
}(React.PureComponent));
exports.Tooltip = Tooltip;
//# sourceMappingURL=tooltip.js.map