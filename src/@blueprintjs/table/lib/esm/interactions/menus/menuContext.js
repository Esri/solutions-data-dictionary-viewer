/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { Regions } from "../../regions";
var MenuContext = /** @class */ (function () {
    function MenuContext(target, selectedRegions, numRows, numCols) {
        this.target = target;
        this.selectedRegions = selectedRegions;
        this.numRows = numRows;
        this.numCols = numCols;
        this.regions = Regions.overlapsRegion(selectedRegions, target) ? selectedRegions : [target];
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
        return Regions.enumerateUniqueCells(this.regions, this.numRows, this.numCols);
    };
    return MenuContext;
}());
export { MenuContext };
//# sourceMappingURL=menuContext.js.map