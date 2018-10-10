/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
/**
 * Event name for `postMessage`
 */
var MESSAGE_EVENT_DATA = "blueprint-table-post-message";
/**
 * Object that holds state for managing idle callbacks
 */
var IDLE_STATE = {
    callbacks: [],
    triggered: false,
};
var handleIdle = function (event) {
    if (event.source !== window || event.data !== MESSAGE_EVENT_DATA) {
        return;
    }
    IDLE_STATE.triggered = false;
    var callback = null;
    if (IDLE_STATE.callbacks.length > 0) {
        callback = IDLE_STATE.callbacks.shift();
    }
    if (IDLE_STATE.callbacks.length > 0) {
        triggerIdleFrame();
    }
    // finally, invoke the callback. exceptions will be propagated
    if (callback) {
        callback();
    }
};
// check for window since we might be in a headless server environment
if (typeof window !== "undefined") {
    if (window.addEventListener != null) {
        window.addEventListener("message", handleIdle, false);
    }
}
var triggerIdleFrame = function () {
    if (IDLE_STATE.triggered) {
        return;
    }
    IDLE_STATE.triggered = true;
    /**
     * This is the magic that will wait for the browser to be "idle" before
     * invoking the callback.
     *
     * First, we use nested calls to `requestAnimationFrame` which will cause
     * the inner callback to be invoked on the NEXT FRAME.
     *
     * Then, we call to `postMessage` to invoke the `handleIdle` method only
     * once the current stack frame is empty.
     *
     * With this approach, the idle callback will be invoked at most once per
     * frame and only after the stack frame is empty.
     */
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            postMessage(MESSAGE_EVENT_DATA, "*");
        });
    });
};
/**
 * Invokes the provided callback on the next available frame after the stack
 * frame is empty.
 *
 * At most one callback per frame is invoked, and the callback may be delayed
 * multiple frames until the page is idle.
 *
 * TODO: return a token from this method that allows you to cancel the callback
 * (otherwise the callback list may increase without bound).
 */
export var requestIdleCallback = function (callback) {
    IDLE_STATE.callbacks.push(callback);
    triggerIdleFrame();
};
//# sourceMappingURL=requestIdleCallback.js.map