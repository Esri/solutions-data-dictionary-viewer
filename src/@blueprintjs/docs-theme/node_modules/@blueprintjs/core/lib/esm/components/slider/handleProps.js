/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
export var HandleType = {
    /** A full handle appears as a small square. */
    FULL: "full",
    /** A start handle appears as the left or top half of a square. */
    START: "start",
    /** An end handle appears as the right or bottom half of a square. */
    END: "end",
};
export var HandleInteractionKind = {
    /** Locked handles prevent other handles from being dragged past then. */
    LOCK: "lock",
    /** Push handles move overlapping handles with them as they are dragged. */
    PUSH: "push",
    /**
     * Handles marked "none" are not interactive and do not appear in the UI.
     * They serve only to break the track into subsections that can be colored separately.
     */
    NONE: "none",
};
//# sourceMappingURL=handleProps.js.map