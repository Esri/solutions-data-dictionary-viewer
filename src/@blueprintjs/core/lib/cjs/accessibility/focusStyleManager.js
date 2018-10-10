"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var classes_1 = require("../common/classes");
var interactionMode_1 = require("../common/interactionMode");
/* istanbul ignore next */
var fakeFocusEngine = {
    isActive: function () { return true; },
    start: function () { return true; },
    stop: function () { return true; },
};
var focusEngine = typeof document !== "undefined"
    ? new interactionMode_1.InteractionModeEngine(document.documentElement, classes_1.FOCUS_DISABLED)
    : fakeFocusEngine;
exports.FocusStyleManager = {
    alwaysShowFocus: function () { return focusEngine.stop(); },
    isActive: function () { return focusEngine.isActive(); },
    onlyShowFocusOnTabs: function () { return focusEngine.start(); },
};
//# sourceMappingURL=focusStyleManager.js.map