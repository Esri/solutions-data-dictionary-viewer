"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns `true` if `navigator.platform` matches a known Mac platform, or
 * `false` otherwise.
 */
function isMac(platformOverride) {
    var platformActual = typeof navigator !== "undefined" ? navigator.platform : undefined;
    var platform = platformOverride != null ? platformOverride : platformActual;
    return platform == null ? false : /Mac|iPod|iPhone|iPad/.test(platform);
}
exports.isMac = isMac;
/**
 * Returns `true` if (1) the platform is Mac and the keypress includes the `cmd`
 * key, or (2) the platform is non-Mac and the keypress includes the `ctrl` key.
 */
exports.isModKeyPressed = function (event, platformOverride) {
    var isMacPlatform = isMac(platformOverride);
    return (isMacPlatform && event.metaKey) || (!isMacPlatform && event.ctrlKey);
};
//# sourceMappingURL=platformUtils.js.map