"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var React = tslib_1.__importStar(require("react"));
exports.DeprecatedTag = function (_a) {
    var isDeprecated = _a.isDeprecated;
    if (isDeprecated === true || typeof isDeprecated === "string") {
        return (React.createElement(core_1.Tag, { intent: core_1.Intent.DANGER, minimal: true }, typeof isDeprecated === "string" ? (React.createElement("span", { dangerouslySetInnerHTML: markdownCode("Deprecated: " + isDeprecated) })) : ("Deprecated")));
    }
    return null;
};
exports.DeprecatedTag.displayName = "Docs2.DeprecatedTag";
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