/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as React from "react";
import { DocumentationContextTypes } from "../common/context";
export var SeeTag = function (_a, _b) {
    var value = _a.value;
    var renderType = _b.renderType;
    return (React.createElement("p", null,
        "See: ",
        renderType(value)));
};
SeeTag.contextTypes = DocumentationContextTypes;
SeeTag.displayName = "Docs.SeeTag";
//# sourceMappingURL=see.js.map