/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { Classes, Icon } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
export var Heading = function (_a) {
    var level = _a.level, route = _a.route, value = _a.value;
    // use createElement so we can dynamically choose tag based on depth
    return React.createElement("h" + level, { className: classNames(Classes.HEADING, "docs-title") }, React.createElement("a", { className: "docs-anchor", "data-route": route, key: "anchor" }), React.createElement("a", { className: "docs-anchor-link", href: "#" + route, key: "link" },
        React.createElement(Icon, { icon: "link" })), value);
};
Heading.displayName = "Docs2.Heading";
//# sourceMappingURL=heading.js.map