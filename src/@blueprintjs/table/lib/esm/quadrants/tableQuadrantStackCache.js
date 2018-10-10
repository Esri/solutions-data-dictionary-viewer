/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
var TableQuadrantStackCache = /** @class */ (function () {
    function TableQuadrantStackCache() {
        this.reset();
    }
    TableQuadrantStackCache.prototype.reset = function () {
        this.cachedRowHeaderWidth = 0;
        this.cachedColumnHeaderHeight = 0;
        this.cachedScrollLeft = 0;
        this.cachedScrollTop = 0;
    };
    // Getters
    // =======
    TableQuadrantStackCache.prototype.getScrollOffset = function (scrollKey) {
        return scrollKey === "scrollLeft" ? this.cachedScrollLeft : this.cachedScrollTop;
    };
    TableQuadrantStackCache.prototype.getRowHeaderWidth = function () {
        return this.cachedRowHeaderWidth;
    };
    TableQuadrantStackCache.prototype.getColumnHeaderHeight = function () {
        return this.cachedColumnHeaderHeight;
    };
    TableQuadrantStackCache.prototype.getScrollContainerClientWidth = function () {
        return this.cachedScrollContainerClientWidth;
    };
    TableQuadrantStackCache.prototype.getScrollContainerClientHeight = function () {
        return this.cachedScrollContainerClientHeight;
    };
    // Setters
    // =======
    TableQuadrantStackCache.prototype.setColumnHeaderHeight = function (height) {
        this.cachedColumnHeaderHeight = height;
    };
    TableQuadrantStackCache.prototype.setRowHeaderWidth = function (width) {
        this.cachedRowHeaderWidth = width;
    };
    TableQuadrantStackCache.prototype.setScrollOffset = function (scrollKey, offset) {
        if (scrollKey === "scrollLeft") {
            this.cachedScrollLeft = offset;
        }
        else {
            this.cachedScrollTop = offset;
        }
    };
    TableQuadrantStackCache.prototype.setScrollContainerClientWidth = function (clientWidth) {
        this.cachedScrollContainerClientWidth = clientWidth;
    };
    TableQuadrantStackCache.prototype.setScrollContainerClientHeight = function (clientHeight) {
        this.cachedScrollContainerClientHeight = clientHeight;
    };
    return TableQuadrantStackCache;
}());
export { TableQuadrantStackCache };
//# sourceMappingURL=tableQuadrantStackCache.js.map