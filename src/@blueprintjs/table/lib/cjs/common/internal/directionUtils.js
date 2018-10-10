"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var direction_1 = require("../direction");
function directionToDelta(direction) {
    switch (direction) {
        case direction_1.Direction.UP:
            return { rows: -1, cols: 0 };
        case direction_1.Direction.DOWN:
            return { rows: +1, cols: 0 };
        case direction_1.Direction.LEFT:
            return { rows: 0, cols: -1 };
        case direction_1.Direction.RIGHT:
            return { rows: 0, cols: +1 };
        default:
            return undefined;
    }
}
exports.directionToDelta = directionToDelta;
//# sourceMappingURL=directionUtils.js.map