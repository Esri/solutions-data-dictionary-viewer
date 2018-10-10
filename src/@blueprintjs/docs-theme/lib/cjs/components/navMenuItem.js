"use strict";
/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
exports.NavMenuItem = function (props) {
    var className = props.className, isActive = props.isActive, isExpanded = props.isExpanded, section = props.section, htmlProps = tslib_1.__rest(props, ["className", "isActive", "isExpanded", "section"]);
    return (React.createElement("a", tslib_1.__assign({ className: classnames_1.default(core_1.Classes.MENU_ITEM, className) }, htmlProps),
        React.createElement("span", { className: core_1.Classes.FILL }, section.title)));
};
exports.NavMenuItem.displayName = "Docs2.NavMenuItem";
//# sourceMappingURL=navMenuItem.js.map