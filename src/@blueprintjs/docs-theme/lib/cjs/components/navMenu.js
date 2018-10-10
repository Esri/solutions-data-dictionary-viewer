"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var client_1 = require("documentalist/dist/client");
var navMenuItem_1 = require("./navMenuItem");
exports.NavMenu = function (props) {
    var _a = props.renderNavMenuItem, renderNavMenuItem = _a === void 0 ? navMenuItem_1.NavMenuItem : _a;
    var menu = props.items.map(function (section) {
        var isActive = props.activeSectionId === section.route;
        var isExpanded = isActive || isParentOfRoute(section.route, props.activeSectionId);
        // active section gets selected styles, expanded section shows its children
        var itemClasses = classnames_1.default("depth-" + (section.level - props.level - 1), (_a = {
                "docs-nav-expanded": isExpanded
            },
            _a[core_1.Classes.ACTIVE] = isActive,
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
            client_1.isPageNode(section) ? React.createElement(exports.NavMenu, tslib_1.__assign({}, props, { level: section.level, items: section.children })) : null));
        var _a;
    });
    var classes = classnames_1.default("docs-nav-menu", core_1.Classes.LIST_UNSTYLED, props.className);
    return React.createElement("ul", { className: classes }, menu);
};
exports.NavMenu.displayName = "Docs2.NavMenu";
function isParentOfRoute(parent, route) {
    return route.indexOf(parent + "/") === 0 || route.indexOf(parent + ".") === 0;
}
//# sourceMappingURL=navMenu.js.map