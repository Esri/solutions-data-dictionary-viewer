"use strict";
/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Helper function for formatting ratios as CSS percentage values. */
function formatPercentage(ratio) {
    return (ratio * 100).toFixed(2) + "%";
}
exports.formatPercentage = formatPercentage;
/**
 * Mutates the values array by filling all the values between start and end index (inclusive) with the fill value.
 */
function fillValues(values, startIndex, endIndex, fillValue) {
    var inc = startIndex < endIndex ? 1 : -1;
    for (var index = startIndex; index !== endIndex + inc; index += inc) {
        values[index] = fillValue;
    }
}
exports.fillValues = fillValues;
/**
 * Returns the minimum element of an array as determined by comparing the results of calling the arg function on each
 * element of the array. The function will only be called once per element.
 */
function argMin(values, argFn) {
    if (values.length === 0) {
        return undefined;
    }
    var minValue = values[0];
    var minArg = argFn(minValue);
    for (var index = 1; index < values.length; index++) {
        var value = values[index];
        var arg = argFn(value);
        if (arg < minArg) {
            minValue = value;
            minArg = arg;
        }
    }
    return minValue;
}
exports.argMin = argMin;
//# sourceMappingURL=sliderUtils.js.map