/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { isPageNode } from "documentalist/dist/client";
import { NavMenuItem } from "./navMenuItem";
export var NavMenu = function (props) {
    var _a = props.renderNavMenuItem, renderNavMenuItem = _a === void 0 ? NavMenuItem : _a;
    var menu = props.items.map(function (section) {
        var isActive = props.activeSectionId === section.route;
        var isExpanded = isActive || isParentOfRoute(section.route, props.activeSectionId);
        // active section gets selected styles, expanded section shows its children
        var itemClasses = classNames("depth-" + (section.level - props.level - 1), (_a = {
                "docs-nav-expanded": isExpanded
            },
            _a[Classes.ACTIVE] = isActive,
            _a));
        var item = renderNavMenuItem({
            className: itemClasses,
            href: "#" + section.route,
            isActive: isActive,
            isExpanded: isExpanded,
            onClick: function () { return props.onItemClick(section.route); },
            section: section,
        });
        return (React.createElement("li", { key: section.route },
            item,
            isPageNode(section) ? React.createElement(NavMenu, tslib_1.__assign({}, props, { level: section.level, items: section.children })) : null));
        var _a;
    });
    var classes = classNames("docs-nav-menu", Classes.LIST_UNSTYLED, props.className);
    return React.createElement("ul", { className: classes }, menu);
};
NavMenu.displayName = "Docs2.NavMenu";
function isParentOfRoute(parent, route) {
    return route.indexOf(parent + "/") === 0 || route.indexOf(parent + ".") === 0;
}
//# sourceMappingURL=navMenu.js.map