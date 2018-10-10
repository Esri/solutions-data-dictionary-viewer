/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { Utils } from "@blueprintjs/core";
import { requestIdleCallback } from "./requestIdleCallback";
/**
 * This class helps batch updates to large lists.
 *
 * For example, if your React component has many children, updating them all at
 * once may cause jank when reconciling the DOM. This class helps you update
 * only a few children per frame.
 *
 * A typical usage would be:
 *
 * ```tsx
 * public renderChildren = (allChildrenKeys: string[]) => {
 *
 *     batcher.startNewBatch();
 *
 *     allChildrenKeys.forEach((prop1: string, index: number) => {
 *         batcher.addArgsToBatch(prop1, "prop2", index);
 *     });
 *
 *     batcher.removeOldAddNew((prop1: string, prop2: string, other: number) => {
 *         return <Child prop1={prop1} prop2={prop2} other={other} />;
 *     });
 *
 *     if (!batcher.isDone()) {
 *         batcher.idleCallback(this.forceUpdate());
 *     }
 *
 *     const currentChildren = batcher.getList();
 *     return currentChildren;
 * }
 *
 * ```
 */
var Batcher = /** @class */ (function () {
    function Batcher() {
        var _this = this;
        this.currentObjects = {};
        this.oldObjects = {};
        this.batchArgs = {};
        this.done = true;
        this.handleIdleCallback = function () {
            var callback = _this.callback;
            delete _this.callback;
            Utils.safeInvoke(callback);
        };
        this.mapCurrentObjectKey = function (key) {
            return _this.currentObjects[key];
        };
    }
    /**
     * Resets the "batch" and "current" sets. This essentially clears the cache
     * and prevents accidental re-use of "current" objects.
     */
    Batcher.prototype.reset = function () {
        this.batchArgs = {};
        this.oldObjects = this.currentObjects;
        this.currentObjects = {};
    };
    /**
     * Starts a new "batch" argument set
     */
    Batcher.prototype.startNewBatch = function () {
        this.batchArgs = {};
    };
    /**
     * Stores the variadic arguments to be later batched together.
     *
     * The arguments must be simple stringifyable objects.
     */
    Batcher.prototype.addArgsToBatch = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.batchArgs[this.getKey(args)] = args;
    };
    /**
     * Compares the set of "batch" arguments to the "current" set. Creates any
     * new objects using the callback as a factory. Removes old objects.
     *
     * Arguments that are in the "current" set but were not part of the last
     * "batch" set are considered candidates for removal. Similarly, Arguments
     * that are part of the "batch" set but not the "current" set are candidates
     * for addition.
     *
     * The number of objects added and removed may be limited with the
     * `...Limit` parameters.
     *
     * Finally, the batcher determines if the batching is complete if the
     * "current" arguments match the "batch" arguments.
     */
    Batcher.prototype.removeOldAddNew = function (callback, addNewLimit, removeOldLimit, updateLimit) {
        var _this = this;
        if (addNewLimit === void 0) { addNewLimit = Batcher.DEFAULT_ADD_LIMIT; }
        if (removeOldLimit === void 0) { removeOldLimit = Batcher.DEFAULT_REMOVE_LIMIT; }
        if (updateLimit === void 0) { updateLimit = Batcher.DEFAULT_UPDATE_LIMIT; }
        // remove old
        var keysToRemove = this.setKeysDifference(this.currentObjects, this.batchArgs, removeOldLimit);
        keysToRemove.forEach(function (key) { return delete _this.currentObjects[key]; });
        // remove ALL old objects not in batch
        var keysToRemoveOld = this.setKeysDifference(this.oldObjects, this.batchArgs, -1);
        keysToRemoveOld.forEach(function (key) { return delete _this.oldObjects[key]; });
        // copy ALL old objects into current objects if not defined
        var keysToShallowCopy = Object.keys(this.oldObjects);
        keysToShallowCopy.forEach(function (key) {
            if (_this.currentObjects[key] == null) {
                _this.currentObjects[key] = _this.oldObjects[key];
            }
        });
        // update old objects with factory
        var keysToUpdate = this.setKeysIntersection(this.oldObjects, this.currentObjects, updateLimit);
        keysToUpdate.forEach(function (key) {
            delete _this.oldObjects[key];
            _this.currentObjects[key] = callback.apply(undefined, _this.batchArgs[key]);
        });
        // add new objects with factory
        var keysToAdd = this.setKeysDifference(this.batchArgs, this.currentObjects, addNewLimit);
        keysToAdd.forEach(function (key) { return (_this.currentObjects[key] = callback.apply(undefined, _this.batchArgs[key])); });
        // set `done` to true of sets match exactly after add/remove and there
        // are no "old objects" remaining
        this.done =
            this.setHasSameKeys(this.batchArgs, this.currentObjects) && Object.keys(this.oldObjects).length === 0;
    };
    /**
     * Returns true of the "current" set matches the "batch" set.
     */
    Batcher.prototype.isDone = function () {
        return this.done;
    };
    /**
     * Returns all the objects in the "current" set.
     */
    Batcher.prototype.getList = function () {
        return Object.keys(this.currentObjects).map(this.mapCurrentObjectKey);
    };
    /**
     * Registers a callback to be invoked on the next idle frame. If a callback
     * has already been registered, we do not register a new one.
     */
    Batcher.prototype.idleCallback = function (callback) {
        if (!this.callback) {
            this.callback = callback;
            requestIdleCallback(this.handleIdleCallback);
        }
    };
    Batcher.prototype.cancelOutstandingCallback = function () {
        delete this.callback;
    };
    /**
     * Forcibly overwrites the current list of batched objects. Not recommended
     * for normal usage.
     */
    Batcher.prototype.setList = function (objectsArgs, objects) {
        var _this = this;
        this.reset();
        objectsArgs.forEach(function (args, i) {
            _this.addArgsToBatch.apply(_this, args);
            _this.currentObjects[_this.getKey(args)] = objects[i];
        });
        this.done = true;
    };
    Batcher.prototype.getKey = function (args) {
        return args.join(Batcher.ARG_DELIMITER);
    };
    Batcher.prototype.setKeysDifference = function (a, b, limit) {
        return this.setKeysOperation(a, b, "difference", limit);
    };
    Batcher.prototype.setKeysIntersection = function (a, b, limit) {
        return this.setKeysOperation(a, b, "intersect", limit);
    };
    /**
     * Compares the keys of A from B -- and performs an "intersection" or
     * "difference" operation on the keys.
     *
     * Note that the order of operands A and B matters for the "difference"
     * operation.
     *
     * Returns an array of at most `limit` keys.
     */
    Batcher.prototype.setKeysOperation = function (a, b, operation, limit) {
        var result = [];
        var aKeys = Object.keys(a);
        for (var i = 0; i < aKeys.length && (limit < 0 || result.length < limit); i++) {
            var key = aKeys[i];
            if ((operation === "difference" && a[key] && !b[key]) || (operation === "intersect" && a[key] && b[key])) {
                result.push(key);
            }
        }
        return result;
    };
    /**
     * Returns true of objects `a` and `b` have exactly the same keys.
     */
    Batcher.prototype.setHasSameKeys = function (a, b) {
        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        for (var _i = 0, aKeys_1 = aKeys; _i < aKeys_1.length; _i++) {
            var aKey = aKeys_1[_i];
            if (b[aKey] === undefined) {
                return false;
            }
        }
        return true;
    };
    Batcher.DEFAULT_ADD_LIMIT = 20;
    Batcher.DEFAULT_UPDATE_LIMIT = 20;
    Batcher.DEFAULT_REMOVE_LIMIT = 20;
    Batcher.ARG_DELIMITER = "|";
    return Batcher;
}());
export { Batcher };
//# sourceMappingURL=batcher.js.map