/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { Classes, HTMLTable } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
export var ModifierTable = function (_a) {
    var children = _a.children, emptyMessage = _a.emptyMessage, title = _a.title;
    return (React.createElement("div", { className: classNames("docs-modifiers-table", Classes.RUNNING_TEXT) },
        React.createElement(HTMLTable, null,
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, title),
                    React.createElement("th", null, "Description"))),
            React.createElement("tbody", null, isEmpty(children) ? renderEmptyState(emptyMessage) : children))));
};
function isEmpty(children) {
    var array = React.Children.toArray(children);
    return array.length === 0 || array.filter(function (item) { return !!item; }).length === 0;
}
function renderEmptyState(message) {
    if (message === void 0) { message = "Nothing here."; }
    return (React.createElement("tr", null,
        React.createElement("td", { colSpan: 2 },
            React.createElement("em", { className: Classes.TEXT_MUTED }, message))));
}
//# sourceMappingURL=modifierTable.js.map