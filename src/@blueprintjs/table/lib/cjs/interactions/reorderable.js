"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var React = tslib_1.__importStar(require("react"));
var utils_1 = require("../common/utils");
var regions_1 = require("../regions");
var draggable_1 = require("./draggable");
var DragReorderable = /** @class */ (function (_super) {
    tslib_1.__extends(DragReorderable, _super);
    function DragReorderable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleActivate = function (event) {
            if (_this.shouldIgnoreMouseDown(event)) {
                return false;
            }
            var region = _this.props.locateClick(event);
            if (!regions_1.Regions.isValid(region)) {
                return false;
            }
            var cardinality = regions_1.Regions.getRegionCardinality(region);
            var isColumnHeader = cardinality === regions_1.RegionCardinality.FULL_COLUMNS;
            var isRowHeader = cardinality === regions_1.RegionCardinality.FULL_ROWS;
            if (!isColumnHeader && !isRowHeader) {
                return false;
            }
            var selectedRegions = _this.props.selectedRegions;
            var selectedRegionIndex = regions_1.Regions.findContainingRegion(selectedRegions, region);
            if (selectedRegionIndex >= 0) {
                var selectedRegion = selectedRegions[selectedRegionIndex];
                if (regions_1.Regions.getRegionCardinality(selectedRegion) !== cardinality) {
                    // ignore FULL_TABLE selections
                    return false;
                }
                // cache for easy access later in the lifecycle
                var selectedInterval = isRowHeader ? selectedRegion.rows : selectedRegion.cols;
                _this.selectedRegionStartIndex = selectedInterval[0];
                // add 1 because the selected interval is inclusive, which simple subtraction doesn't
                // account for (e.g. in a FULL_COLUMNS range from 3 to 6, 6 - 3 = 3, but the selection
                // actually includes four columns: 3, 4, 5, and 6)
                _this.selectedRegionLength = selectedInterval[1] - selectedInterval[0] + 1;
            }
            else {
                // select the new region to avoid complex and unintuitive UX w/r/t the existing selection
                _this.maybeSelectRegion(region);
                var regionRange = isRowHeader ? region.rows : region.cols;
                _this.selectedRegionStartIndex = regionRange[0];
                _this.selectedRegionLength = regionRange[1] - regionRange[0] + 1;
            }
            return true;
        };
        _this.handleDragMove = function (event, coords) {
            var oldIndex = _this.selectedRegionStartIndex;
            var guideIndex = _this.props.locateDrag(event, coords);
            var length = _this.selectedRegionLength;
            var reorderedIndex = utils_1.Utils.guideIndexToReorderedIndex(oldIndex, guideIndex, length);
            _this.props.onReordering(oldIndex, reorderedIndex, length);
        };
        _this.handleDragEnd = function (event, coords) {
            var oldIndex = _this.selectedRegionStartIndex;
            var guideIndex = _this.props.locateDrag(event, coords);
            var length = _this.selectedRegionLength;
            var reorderedIndex = utils_1.Utils.guideIndexToReorderedIndex(oldIndex, guideIndex, length);
            _this.props.onReordered(oldIndex, reorderedIndex, length);
            // the newly reordered region becomes the only selection
            var newRegion = _this.props.toRegion(reorderedIndex, reorderedIndex + length - 1);
            _this.maybeSelectRegion(newRegion);
            // resetting is not strictly required, but it's cleaner
            _this.selectedRegionStartIndex = undefined;
            _this.selectedRegionLength = undefined;
        };
        return _this;
    }
    DragReorderable.prototype.render = function () {
        var draggableProps = this.getDraggableProps();
        return (React.createElement(draggable_1.Draggable, tslib_1.__assign({}, draggableProps, { preventDefault: false }), this.props.children));
    };
    DragReorderable.prototype.getDraggableProps = function () {
        return this.props.onReordered == null
            ? {}
            : {
                onActivate: this.handleActivate,
                onDragEnd: this.handleDragEnd,
                onDragMove: this.handleDragMove,
            };
    };
    DragReorderable.prototype.shouldIgnoreMouseDown = function (event) {
        var disabled = this.props.disabled;
        var isDisabled = core_1.Utils.isFunction(disabled) ? core_1.Utils.safeInvoke(disabled, event) : disabled;
        return !utils_1.Utils.isLeftClick(event) || isDisabled;
    };
    DragReorderable.prototype.maybeSelectRegion = function (region) {
        var nextSelectedRegions = [region];
        if (!core_1.Utils.deepCompareKeys(nextSelectedRegions, this.props.selectedRegions)) {
            this.props.onSelection(nextSelectedRegions);
            // move the focused cell into the newly selected region
            this.props.onFocusedCell(tslib_1.__assign({}, regions_1.Regions.getFocusCellCoordinatesFromRegion(region), { focusSelectionIndex: 0 }));
        }
    };
    DragReorderable.defaultProps = {
        selectedRegions: [],
    };
    return DragReorderable;
}(React.PureComponent));
exports.DragReorderable = DragReorderable;
//# sourceMappingURL=reorderable.js.map