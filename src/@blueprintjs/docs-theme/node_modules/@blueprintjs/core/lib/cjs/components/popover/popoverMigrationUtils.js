"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var position_1 = require("../../common/position");
/**
 * Convert a position to a placement.
 * @param position the position to convert
 */
function positionToPlacement(position) {
    /* istanbul ignore next */
    switch (position) {
        case position_1.Position.TOP_LEFT:
            return "top-start";
        case position_1.Position.TOP:
            return "top";
        case position_1.Position.TOP_RIGHT:
            return "top-end";
        case position_1.Position.RIGHT_TOP:
            return "right-start";
        case position_1.Position.RIGHT:
            return "right";
        case position_1.Position.RIGHT_BOTTOM:
            return "right-end";
        case position_1.Position.BOTTOM_RIGHT:
            return "bottom-end";
        case position_1.Position.BOTTOM:
            return "bottom";
        case position_1.Position.BOTTOM_LEFT:
            return "bottom-start";
        case position_1.Position.LEFT_BOTTOM:
            return "left-end";
        case position_1.Position.LEFT:
            return "left";
        case position_1.Position.LEFT_TOP:
            return "left-start";
        case "auto":
        case "auto-start":
        case "auto-end":
            // Return the string unchanged.
            return position;
        default:
            return assertNever(position);
    }
}
exports.positionToPlacement = positionToPlacement;
/* istanbul ignore next */
function assertNever(x) {
    throw new Error("Unexpected position: " + x);
}
//# sourceMappingURL=popoverMigrationUtils.js.map