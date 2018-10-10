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
function renderBlock(
/** the block to render */
block, 
/** known tag renderers */
tagRenderers, 
/** class names to apply to element wrapping string content. */
textClassName) {
    if (block === undefined) {
        return null;
    }
    var textClasses = classnames_1.default(core_1.Classes.RUNNING_TEXT, textClassName);
    var contents = block.contents.map(function (node, i) {
        if (typeof node === "string") {
            return React.createElement("div", { className: textClasses, key: i, dangerouslySetInnerHTML: { __html: node } });
        }
        try {
            var renderer = tagRenderers[node.tag];
            if (renderer === undefined) {
                throw new Error("Unknown @tag: " + node.tag);
            }
            return React.createElement(renderer, tslib_1.__assign({}, node, { key: i }));
        }
        catch (ex) {
            console.error(ex.message);
            return (React.createElement(core_1.H3, { key: "__error-" + i },
                React.createElement(core_1.Code, null, ex.message)));
        }
    });
    return React.createElement("div", { className: "docs-section" }, contents);
}
exports.renderBlock = renderBlock;
//# sourceMappingURL=block.js.map