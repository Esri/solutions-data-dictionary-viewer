"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../");
function isDarkTheme(element) {
    return element instanceof Element && element.closest("." + _1.Classes.DARK) != null;
}
exports.isDarkTheme = isDarkTheme;
//# sourceMappingURL=isDarkTheme.js.map