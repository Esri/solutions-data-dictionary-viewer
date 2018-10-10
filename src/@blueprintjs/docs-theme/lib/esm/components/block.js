/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Classes, Code, H3 } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
export function renderBlock(
/** the block to render */
block, 
/** known tag renderers */
tagRenderers, 
/** class names to apply to element wrapping string content. */
textClassName) {
    if (block === undefined) {
        return null;
    }
    var textClasses = classNames(Classes.RUNNING_TEXT, textClassName);
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
            return (React.createElement(H3, { key: "__error-" + i },
                React.createElement(Code, null, ex.message)));
        }
    });
    return React.createElement("div", { className: "docs-section" }, contents);
}
//# sourceMappingURL=block.js.map