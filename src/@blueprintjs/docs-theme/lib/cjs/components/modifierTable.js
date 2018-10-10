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
exports.ModifierTable = function (_a) {
    var children = _a.children, emptyMessage = _a.emptyMessage, title = _a.title;
    return (React.createElement("div", { className: classnames_1.default("docs-modifiers-table", core_1.Classes.RUNNING_TEXT) },
        React.createElement(core_1.HTMLTable, null,
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
            React.createElement("em", { className: core_1.Classes.TEXT_MUTED }, message))));
}
//# sourceMappingURL=modifierTable.js.map