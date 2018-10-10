/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tags from "./";
export function createDefaultRenderers() {
    return {
        css: tags.CssExample,
        heading: tags.Heading,
        interface: tags.TypescriptExample,
        page: function () { return null; },
        see: tags.SeeTag,
    };
}
//# sourceMappingURL=defaults.js.map