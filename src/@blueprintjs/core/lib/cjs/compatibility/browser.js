"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
var browser = {
    isEdge: /Edge/.test(userAgent),
    isInternetExplorer: /Trident|rv:11/.test(userAgent),
    isWebkit: /AppleWebKit/.test(userAgent),
};
exports.Browser = {
    isEdge: function () { return browser.isEdge; },
    isInternetExplorer: function () { return browser.isInternetExplorer; },
    isWebkit: function () { return browser.isWebkit; },
};
//# sourceMappingURL=browser.js.map