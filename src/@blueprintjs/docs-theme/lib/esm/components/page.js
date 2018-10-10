/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as React from "react";
import { Classes } from "@blueprintjs/core";
import { renderBlock } from "./block";
export var Page = function (_a) {
    var page = _a.page, renderActions = _a.renderActions, tagRenderers = _a.tagRenderers;
    // apply running text styles to blocks in pages (but not on blocks in examples)
    var pageContents = renderBlock(page, tagRenderers, Classes.TEXT_LARGE);
    return (React.createElement("div", { className: "docs-page", "data-page-id": page.route },
        renderActions && React.createElement("div", { className: "docs-page-actions" }, renderActions(page)),
        pageContents));
};
//# sourceMappingURL=page.js.map