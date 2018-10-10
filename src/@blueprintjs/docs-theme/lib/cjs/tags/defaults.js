"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tags = tslib_1.__importStar(require("./"));
function createDefaultRenderers() {
    return {
        css: tags.CssExample,
        heading: tags.Heading,
        interface: tags.TypescriptExample,
        page: function () { return null; },
        see: tags.SeeTag,
    };
}
exports.createDefaultRenderers = createDefaultRenderers;
//# sourceMappingURL=defaults.js.map