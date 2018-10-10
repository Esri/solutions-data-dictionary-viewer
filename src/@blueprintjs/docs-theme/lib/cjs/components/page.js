"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var block_1 = require("./block");
exports.Page = function (_a) {
    var page = _a.page, renderActions = _a.renderActions, tagRenderers = _a.tagRenderers;
    // apply running text styles to blocks in pages (but not on blocks in examples)
    var pageContents = block_1.renderBlock(page, tagRenderers, core_1.Classes.TEXT_LARGE);
    return (React.createElement("div", { className: "docs-page", "data-page-id": page.route },
        renderActions && React.createElement("div", { className: "docs-page-actions" }, renderActions(page)),
        pageContents));
};
//# sourceMappingURL=page.js.map