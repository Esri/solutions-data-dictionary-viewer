"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var context_1 = require("../common/context");
exports.SeeTag = function (_a, _b) {
    var value = _a.value;
    var renderType = _b.renderType;
    return (React.createElement("p", null,
        "See: ",
        renderType(value)));
};
exports.SeeTag.contextTypes = context_1.DocumentationContextTypes;
exports.SeeTag.displayName = "Docs.SeeTag";
//# sourceMappingURL=see.js.map