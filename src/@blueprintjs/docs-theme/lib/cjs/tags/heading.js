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
exports.Heading = function (_a) {
    var level = _a.level, route = _a.route, value = _a.value;
    // use createElement so we can dynamically choose tag based on depth
    return React.createElement("h" + level, { className: classnames_1.default(core_1.Classes.HEADING, "docs-title") }, React.createElement("a", { className: "docs-anchor", "data-route": route, key: "anchor" }), React.createElement("a", { className: "docs-anchor-link", href: "#" + route, key: "link" },
        React.createElement(core_1.Icon, { icon: "link" })), value);
};
exports.Heading.displayName = "Docs2.Heading";
//# sourceMappingURL=heading.js.map