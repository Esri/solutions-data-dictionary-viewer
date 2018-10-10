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
var position_1 = require("../../common/position");
var props_1 = require("../../common/props");
var icon_1 = require("../icon/icon");
var popover_1 = require("../popover/popover");
var text_1 = require("../text/text");
var menu_1 = require("./menu");
var MenuItem = /** @class */ (function (_super) {
    tslib_1.__extends(MenuItem, _super);
    function MenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItem.prototype.render = function () {
        var _a = this.props, active = _a.active, className = _a.className, children = _a.children, disabled = _a.disabled, icon = _a.icon, intent = _a.intent, labelElement = _a.labelElement, multiline = _a.multiline, popoverProps = _a.popoverProps, shouldDismissPopover = _a.shouldDismissPopover, text = _a.text, htmlProps = tslib_1.__rest(_a, ["active", "className", "children", "disabled", "icon", "intent", "labelElement", "multiline", "popoverProps", "shouldDismissPopover", "text"]);
        var hasSubmenu = children != null;
        var intentClass = Classes.intentClass(intent);
        var anchorClasses = classnames_1.default(Classes.MENU_ITEM, intentClass, (_b = {},
            _b[Classes.ACTIVE] = active,
            _b[Classes.INTENT_PRIMARY] = active && intentClass == null,
            _b[Classes.DISABLED] = disabled,
            // prevent popover from closing when clicking on submenu trigger or disabled item
            _b[Classes.POPOVER_DISMISS] = shouldDismissPopover && !disabled && !hasSubmenu,
            _b), className);
        var target = (React.createElement("a", tslib_1.__assign({}, htmlProps, (disabled ? DISABLED_PROPS : {}), { className: anchorClasses }),
            React.createElement(icon_1.Icon, { icon: icon }),
            React.createElement(text_1.Text, { className: Classes.FILL, ellipsize: !multiline }, text),
            this.maybeRenderLabel(labelElement),
            hasSubmenu && React.createElement(icon_1.Icon, { icon: "caret-right" })));
        var liClasses = classnames_1.default((_c = {}, _c[Classes.MENU_SUBMENU] = hasSubmenu, _c));
        return React.createElement("li", { className: liClasses }, this.maybeRenderPopover(target, children));
        var _b, _c;
    };
    MenuItem.prototype.maybeRenderLabel = function (labelElement) {
        var label = this.props.label;
        if (label == null && labelElement == null) {
            return null;
        }
        return (React.createElement("span", { className: Classes.MENU_ITEM_LABEL },
            label,
            labelElement));
    };
    MenuItem.prototype.maybeRenderPopover = function (target, children) {
        if (children == null) {
            return target;
        }
        var _a = this.props, disabled = _a.disabled, popoverProps = _a.popoverProps;
        return (React.createElement(popover_1.Popover, tslib_1.__assign({ autoFocus: false, captureDismiss: false, disabled: disabled, enforceFocus: false, hoverCloseDelay: 0, interactionKind: popover_1.PopoverInteractionKind.HOVER, modifiers: SUBMENU_POPOVER_MODIFIERS, position: position_1.Position.RIGHT_TOP, usePortal: false }, popoverProps, { content: React.createElement(menu_1.Menu, null, children), minimal: true, popoverClassName: classnames_1.default(Classes.MENU_SUBMENU, popoverProps.popoverClassName), target: target })));
    };
    MenuItem.defaultProps = {
        disabled: false,
        multiline: false,
        popoverProps: {},
        shouldDismissPopover: true,
        text: "",
    };
    MenuItem.displayName = props_1.DISPLAYNAME_PREFIX + ".MenuItem";
    return MenuItem;
}(React.PureComponent));
exports.MenuItem = MenuItem;
var SUBMENU_POPOVER_MODIFIERS = {
    // 20px padding - scrollbar width + a bit
    flip: { boundariesElement: "viewport", padding: 20 },
    // shift popover up 5px so MenuItems align
    offset: { offset: -5 },
    preventOverflow: { boundariesElement: "viewport", padding: 20 },
};
// props to ignore when disabled
var DISABLED_PROPS = {
    href: undefined,
    onClick: undefined,
    onMouseDown: undefined,
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    tabIndex: -1,
};
//# sourceMappingURL=menuItem.js.map