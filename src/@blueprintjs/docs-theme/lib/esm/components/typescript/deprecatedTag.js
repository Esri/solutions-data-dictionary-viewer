/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { Intent, Tag } from "@blueprintjs/core";
import * as React from "react";
export var DeprecatedTag = function (_a) {
    var isDeprecated = _a.isDeprecated;
    if (isDeprecated === true || typeof isDeprecated === "string") {
        return (React.createElement(Tag, { intent: Intent.DANGER, minimal: true }, typeof isDeprecated === "string" ? (React.createElement("span", { dangerouslySetInnerHTML: markdownCode("Deprecated: " + isDeprecated) })) : ("Deprecated")));
    }
    return null;
};
DeprecatedTag.displayName = "Docs2.DeprecatedTag";
/**
 * Minimal markdown renderer that supports only backtick `code` elements and triple-backtick `pre` elements.
 * Does not provide any syntax highlighting.
 */
function markdownCode(text) {
    return {
        __html: text
            .replace("<", "&lt;")
            .replace(/```([^`]+)```/g, function (_, code) { return "<pre>" + code + "</pre>"; })
            .replace(/`([^`]+)`/g, function (_, code) { return "<code>" + code + "</code>"; }),
    };
}
//# sourceMappingURL=deprecatedTag.js.map