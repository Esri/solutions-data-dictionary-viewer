"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var regions_1 = require("../../regions");
var MenuContext = /** @class */ (function () {
    function MenuContext(target, selectedRegions, numRows, numCols) {
        this.target = target;
        this.selectedRegions = selectedRegions;
        this.numRows = numRows;
        this.numCols = numCols;
        this.regions = regions_1.Regions.overlapsRegion(selectedRegions, target) ? selectedRegions : [target];
    }
    MenuContext.prototype.getTarget = function () {
        return this.target;
    };
    MenuContext.prototype.getSelectedRegions = function () {
        return this.selectedRegions;
    };
    MenuContext.prototype.getRegions = function () {
        return this.regions;
    };
    MenuContext.prototype.getUniqueCells = function () {
        return regions_1.Regions.enumerateUniqueCells(this.regions, this.numRows, this.numCols);
    };
    return MenuContext;
}());
exports.MenuContext = MenuContext;
//# sourceMappingURL=menuContext.js.map