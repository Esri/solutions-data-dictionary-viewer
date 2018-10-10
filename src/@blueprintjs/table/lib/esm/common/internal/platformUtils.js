/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
/**
 * Returns `true` if `navigator.platform` matches a known Mac platform, or
 * `false` otherwise.
 */
export function isMac(platformOverride) {
    var platformActual = typeof navigator !== "undefined" ? navigator.platform : undefined;
    var platform = platformOverride != null ? platformOverride : platformActual;
    return platform == null ? false : /Mac|iPod|iPhone|iPad/.test(platform);
}
/**
 * Returns `true` if (1) the platform is Mac and the keypress includes the `cmd`
 * key, or (2) the platform is non-Mac and the keypress includes the `ctrl` key.
 */
export var isModKeyPressed = function (event, platformOverride) {
    var isMacPlatform = isMac(platformOverride);
    return (isMacPlatform && event.metaKey) || (!isMacPlatform && event.ctrlKey);
};
//# sourceMappingURL=platformUtils.js.map