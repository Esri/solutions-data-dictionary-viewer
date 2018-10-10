/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
var CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT = "bp-table-text-no-measure";
/**
 * Since Firefox doesn't provide a computed "font" property, we manually
 * construct it using the ordered properties that can be specifed in CSS.
 */
var CSS_FONT_PROPERTIES = ["font-style", "font-variant", "font-weight", "font-size", "font-family"];
export var Utils = {
    /**
     * Invokes the callback `n` times, collecting the results in an array, which
     * is the return value. Similar to _.times
     */
    times: function (n, callback) {
        if (n < 0) {
            throw new Error("[Blueprint] times() cannot be called with negative numbers.");
        }
        var result = Array(n);
        for (var index = 0; index < n; index++) {
            result[index] = callback(index);
        }
        return result;
    },
    /**
     * Takes an array of numbers, returns an array of numbers of the same length in which each
     * value is the sum of current and previous values in the input array.
     *
     * Example input:  [10, 20, 50]
     *         output: [10, 30, 80]
     */
    accumulate: function (numbers) {
        var result = [];
        var sum = 0;
        for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
            var num = numbers_1[_i];
            sum += num;
            result.push(sum);
        }
        return result;
    },
    /**
     * Returns traditional spreadsheet-style column names
     * e.g. (A, B, ..., Z, AA, AB, ..., ZZ, AAA, AAB, ...).
     *
     * Note that this isn't technically mathematically equivalent to base 26 since
     * there is no zero element.
     */
    toBase26Alpha: function (num) {
        var str = "";
        while (true) {
            var letter = num % 26;
            str = String.fromCharCode(65 + letter) + str;
            num = num - letter;
            if (num <= 0) {
                return str;
            }
            num = num / 26 - 1;
        }
    },
    /**
     * Returns traditional spreadsheet-style cell names
     * e.g. (A1, B2, ..., Z44, AA1) with rows 1-indexed.
     */
    toBase26CellName: function (rowIndex, columnIndex) {
        return "" + Utils.toBase26Alpha(columnIndex) + (rowIndex + 1);
    },
    /**
     * Performs the binary search algorithm to find the index of the `value`
     * parameter in a sorted list of numbers. If `value` is not in the list, the
     * index where `value` can be inserted to maintain the sort is returned.
     *
     * Unlike a typical binary search implementation, we use a `lookup`
     * callback to access the sorted list of numbers instead of an array. This
     * avoids additional storage overhead.
     *
     * We use this to, for example, find the index of a row/col given its client
     * coordinate.
     *
     * Adapted from lodash https://github.com/lodash/lodash/blob/4.11.2/lodash.js#L3579
     *
     * @param value - the query value
     * @param high - the length of the sorted list of numbers
     * @param lookup - returns the number from the list at the supplied index
     */
    binarySearch: function (value, high, lookup) {
        var low = 0;
        while (low < high) {
            var mid = Math.floor((low + high) / 2.0);
            var computed = lookup(mid);
            if (computed < value) {
                low = mid + 1;
            }
            else {
                high = mid;
            }
        }
        return high;
    },
    /**
     * Returns a copy of the array that will have a length of the supplied parameter.
     * If the array is too long, it will be truncated. If it is too short, it will be
     * filled with the suppleid `fillValue` argument.
     *
     * @param array - the `Array` to copy and adjust
     * @param length - the target length of the array
     * @param fillValue - the value to add to the array if it is too short
     */
    arrayOfLength: function (array, length, fillValue) {
        if (array.length > length) {
            return array.slice(0, length);
        }
        array = array.slice();
        while (array.length < length) {
            array.push(fillValue);
        }
        return array;
    },
    /**
     * Takes in one full array of values and one sparse array of the same
     * length and type. Returns a copy of the `defaults` array, where each
     * value is replaced with the corresponding non-null value at the same
     * index in `sparseOverrides`.
     *
     * @param defaults - the full array of default values
     * @param sparseOverrides - the sparse array of override values
     */
    assignSparseValues: function (defaults, sparseOverrides) {
        if (sparseOverrides == null || defaults.length !== sparseOverrides.length) {
            return defaults;
        }
        defaults = defaults.slice();
        for (var i = 0; i < defaults.length; i++) {
            var override = sparseOverrides[i];
            if (override != null) {
                defaults[i] = override;
            }
        }
        return defaults;
    },
    /**
     * Measures the bounds of supplied element's textContent.
     * We use the computed font from the supplied element and a non-DOM canvas
     * context to measure the text.
     */
    measureElementTextContent: function (element) {
        var context = document.createElement("canvas").getContext("2d");
        var style = getComputedStyle(element, null);
        context.font = CSS_FONT_PROPERTIES.map(function (prop) { return style.getPropertyValue(prop); }).join(" ");
        return measureTextContentWithExclusions(context, element);
    },
    /**
     * Given a number, returns a value that is clamped within a
     * minimum/maximum bounded range. The minimum and maximum are optional. If
     * either is missing, that extrema limit is not applied.
     *
     * Assumes max >= min.
     */
    clamp: function (value, min, max) {
        if (min != null && value < min) {
            value = min;
        }
        if (max != null && value > max) {
            value = max;
        }
        return value;
    },
    /**
     * When reordering a contiguous block of rows or columns to a new index, we show a preview guide
     * at the absolute index in the original ordering but emit the new index in the reordered list.
     * This function converts an absolute "guide" index to a relative "reordered" index.
     *
     * Example: Say we want to move the first three columns two spots to the right. While we drag, a
     * vertical guide is shown to preview where we'll be dropping the columns. (In the following
     * ASCII art, `*` denotes a selected column, `·` denotes a cell border, and `|` denotes a
     * vertical guide).
     *
     *     Before mousedown:
     *     · 0 · 1 · 2 · 3 · 4 · 5 ·
     *       *   *   *
     *
     *     During mousemove two spots to the right:
     *     · 0 · 1 · 2 · 3 · 4 | 5 ·
     *       *   *   *
     *
     *     After mouseup:
     *     · 3 · 4 · 0 · 1 · 2 · 5 ·
     *               *   *   *
     *
     * Note that moving the three columns beyond index 4 effectively moves them two spots rightward.
     *
     * In this case, the inputs to this function would be:
     *     - oldIndex: 0 (the left-most index of the selected column range in the original ordering)
     *     - newIndex: 5 (the index on whose left boundary the guide appears in the original ordering)
     *     - length: 3 (the number of columns to move)
     *
     * The return value will then be 2, the left-most index of the columns in the new ordering.
     */
    guideIndexToReorderedIndex: function (oldIndex, newIndex, length) {
        if (newIndex < oldIndex) {
            return newIndex;
        }
        else if (oldIndex <= newIndex && newIndex < oldIndex + length) {
            return oldIndex;
        }
        else {
            return Math.max(0, newIndex - length);
        }
    },
    /**
     * When reordering a contiguous block of rows or columns to a new index, we show a preview guide
     * at the absolute index in the original ordering but emit the new index in the reordered list.
     * This function converts a relative "reordered"" index to an absolute "guide" index.
     *
     * For the scenario in the example above, the inputs to this function would be:
     *     - oldIndex: 0 (the left-most index of the selected column range in the original ordering)
     *     - newIndex: 2 (the left-most index of the selected column range in the new ordering)
     *     - length: 3 (the number of columns to move)
     *
     * The return value will then be 5, the index on whose left boundary the guide should appear in
     * the original ordering.
     */
    reorderedIndexToGuideIndex: function (oldIndex, newIndex, length) {
        return newIndex <= oldIndex ? newIndex : newIndex + length;
    },
    /**
     * Returns a copy of the provided array with the `length` contiguous elements starting at the
     * `from` index reordered to start at the `to` index.
     *
     * For example, given the array [A,B,C,D,E,F], reordering the 3 contiguous elements starting at
     * index 1 (B, C, and D) to start at index 2 would yield [A,E,B,C,D,F].
     */
    reorderArray: function (array, from, to, length) {
        if (length === void 0) { length = 1; }
        if (length === 0 || length === array.length || from === to) {
            // return an unchanged copy
            return array.slice();
        }
        if (length < 0 || length > array.length || from + length > array.length) {
            return undefined;
        }
        var before = array.slice(0, from);
        var within = array.slice(from, from + length);
        var after = array.slice(from + length);
        var result = [];
        var i = 0;
        var b = 0;
        var w = 0;
        var a = 0;
        while (i < to) {
            if (b < before.length) {
                result.push(before[b]);
                b += 1;
            }
            else {
                result.push(after[a]);
                a += 1;
            }
            i += 1;
        }
        while (w < length) {
            result.push(within[w]);
            w += 1;
            i += 1;
        }
        while (i < array.length) {
            if (b < before.length) {
                result.push(before[b]);
                b += 1;
            }
            else {
                result.push(after[a]);
                a += 1;
            }
            i += 1;
        }
        return result;
    },
    /**
     * Returns true if the mouse event was triggered by the left mouse button.
     */
    isLeftClick: function (event) {
        return event.button === 0;
    },
    getApproxCellHeight: function (cellText, columnWidth, approxCharWidth, approxLineHeight, horizontalPadding, numBufferLines) {
        var numCharsInCell = cellText == null ? 0 : cellText.length;
        var actualCellWidth = columnWidth;
        var availableCellWidth = actualCellWidth - horizontalPadding;
        var approxCharsPerLine = availableCellWidth / approxCharWidth;
        var approxNumLinesDesired = Math.ceil(numCharsInCell / approxCharsPerLine) + numBufferLines;
        var approxCellHeight = approxNumLinesDesired * approxLineHeight;
        return approxCellHeight;
    },
};
/**
 * Wrapper around Canvas measureText which applies some extra logic to optionally
 * exclude an element's text from the computation.
 */
function measureTextContentWithExclusions(context, element) {
    // We only expect one or zero excluded elements in this subtree
    // We don't have a need for more than one, so we avoid that complexity altogether.
    var elementToExclude = element.querySelector("." + CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT);
    var removedElementParent;
    var removedElementNextSibling;
    if (elementToExclude != null) {
        removedElementParent = elementToExclude.parentElement;
        removedElementNextSibling = elementToExclude.nextSibling;
        removedElementParent.removeChild(elementToExclude);
    }
    var metrics = context.measureText(element.textContent);
    if (elementToExclude != null) {
        removedElementParent.insertBefore(elementToExclude, removedElementNextSibling);
    }
    return metrics;
}
//# sourceMappingURL=utils.js.map