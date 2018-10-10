/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/
import * as tslib_1 from "tslib";
import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
export var NavMenuItem = function (props) {
    var className = props.className, isActive = props.isActive, isExpanded = props.isExpanded, section = props.section, htmlProps = tslib_1.__rest(props, ["className", "isActive", "isExpanded", "section"]);
    return (React.createElement("a", tslib_1.__assign({ className: classNames(Classes.MENU_ITEM, className) }, htmlProps),
        React.createElement("span", { className: Classes.FILL }, section.title)));
};
NavMenuItem.displayName = "Docs2.NavMenuItem";
//# sourceMappingURL=navMenuItem.js.map