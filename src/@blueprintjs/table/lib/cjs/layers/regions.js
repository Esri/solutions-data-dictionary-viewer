"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var Classes = tslib_1.__importStar(require("../common/classes"));
var regions_1 = require("../regions");
// don't include "regions" or "regionStyles" in here, because they can't be shallowly compared
var UPDATE_PROPS_KEYS = ["className"];
var RegionLayer = /** @class */ (function (_super) {
    tslib_1.__extends(RegionLayer, _super);
    function RegionLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderRegion = function (_region, index) {
            var _a = _this.props, className = _a.className, regionStyles = _a.regionStyles;
            return (React.createElement("div", { className: classnames_1.default(Classes.TABLE_OVERLAY, Classes.TABLE_REGION, className), key: index, style: regionStyles[index] }));
        };
        return _this;
    }
    RegionLayer.prototype.shouldComponentUpdate = function (nextProps) {
        // shallowly comparable props like "className" tend not to change in the default table
        // implementation, so do that check last with hope that we return earlier and avoid it
        // altogether.
        return (!core_1.Utils.arraysEqual(this.props.regions, nextProps.regions, regions_1.Regions.regionsEqual) ||
            !core_1.Utils.arraysEqual(this.props.regionStyles, nextProps.regionStyles, core_1.Utils.shallowCompareKeys) ||
            !core_1.Utils.shallowCompareKeys(this.props, nextProps, { include: UPDATE_PROPS_KEYS }));
    };
    RegionLayer.prototype.render = function () {
        return React.createElement("div", { className: Classes.TABLE_OVERLAY_LAYER }, this.renderRegionChildren());
    };
    RegionLayer.prototype.renderRegionChildren = function () {
        var regions = this.props.regions;
        if (regions == null) {
            return undefined;
        }
        return regions.map(this.renderRegion);
    };
    return RegionLayer;
}(React.Component));
exports.RegionLayer = RegionLayer;
//# sourceMappingURL=regions.js.map