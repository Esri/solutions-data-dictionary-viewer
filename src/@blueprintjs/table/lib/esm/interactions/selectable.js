/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Utils as CoreUtils } from "@blueprintjs/core";
import * as React from "react";
import * as FocusedCellUtils from "../common/internal/focusedCellUtils";
import * as PlatformUtils from "../common/internal/platformUtils";
import { Utils } from "../common/utils";
import { Regions } from "../regions";
import { DragEvents } from "./dragEvents";
import { Draggable } from "./draggable";
var DragSelectable = /** @class */ (function (_super) {
    tslib_1.__extends(DragSelectable, _super);
    function DragSelectable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.didExpandSelectionOnActivate = false;
        _this.handleActivate = function (event) {
            var _a = _this.props, locateClick = _a.locateClick, selectedRegions = _a.selectedRegions, selectedRegionTransform = _a.selectedRegionTransform;
            if (_this.shouldIgnoreMouseDown(event)) {
                return false;
            }
            var region = locateClick(event);
            if (!Regions.isValid(region)) {
                return false;
            }
            if (selectedRegionTransform != null) {
                region = selectedRegionTransform(region, event);
            }
            var foundIndex = Regions.findMatchingRegion(selectedRegions, region);
            var matchesExistingSelection = foundIndex !== -1;
            if (matchesExistingSelection && DragEvents.isAdditive(event)) {
                _this.handleClearSelectionAtIndex(foundIndex);
                // if we just deselected a selected region, a subsequent drag-move
                // could reselect it again and *also* clear other selections. that's
                // quite unintuitive, so ignore subsequent drag-move's.
                return false;
            }
            // we want to listen to subsequent drag-move's in all following cases,
            // so this mousedown can be the start of a new selection if desired.
            if (matchesExistingSelection) {
                _this.handleClearAllSelectionsNotAtIndex(foundIndex);
            }
            else if (_this.shouldExpandSelection(event)) {
                _this.handleExpandSelection(region);
            }
            else if (_this.shouldAddDisjointSelection(event)) {
                _this.handleAddDisjointSelection(region);
            }
            else {
                _this.handleReplaceSelection(region);
            }
            return true;
        };
        _this.handleDragMove = function (event, coords) {
            var _a = _this.props, enableMultipleSelection = _a.enableMultipleSelection, focusedCell = _a.focusedCell, locateClick = _a.locateClick, locateDrag = _a.locateDrag, selectedRegions = _a.selectedRegions, selectedRegionTransform = _a.selectedRegionTransform;
            var region = enableMultipleSelection
                ? locateDrag(event, coords, /* returnEndOnly? */ _this.didExpandSelectionOnActivate)
                : locateClick(event);
            if (!Regions.isValid(region)) {
                return;
            }
            else if (selectedRegionTransform != null) {
                region = selectedRegionTransform(region, event, coords);
            }
            var nextSelectedRegions = _this.didExpandSelectionOnActivate
                ? _this.expandSelectedRegions(selectedRegions, region, focusedCell)
                : Regions.update(selectedRegions, region);
            _this.maybeInvokeSelectionCallback(nextSelectedRegions);
            if (!enableMultipleSelection) {
                // move the focused cell with the selected region
                var lastIndex = nextSelectedRegions.length - 1;
                var mostRecentRegion = nextSelectedRegions[lastIndex];
                _this.invokeOnFocusCallbackForRegion(mostRecentRegion, lastIndex);
            }
        };
        _this.handleDragEnd = function () {
            _this.finishInteraction();
        };
        _this.handleClick = function () {
            _this.finishInteraction();
        };
        // Boolean checks
        // ==============
        _this.shouldExpandSelection = function (event) {
            var enableMultipleSelection = _this.props.enableMultipleSelection;
            return enableMultipleSelection && event.shiftKey;
        };
        _this.shouldAddDisjointSelection = function (event) {
            var enableMultipleSelection = _this.props.enableMultipleSelection;
            return enableMultipleSelection && DragEvents.isAdditive(event);
        };
        // Update logic
        // ============
        _this.handleClearSelectionAtIndex = function (selectedRegionIndex) {
            var selectedRegions = _this.props.selectedRegions;
            // remove just the clicked region, leaving other selected regions in place
            var nextSelectedRegions = selectedRegions.slice();
            nextSelectedRegions.splice(selectedRegionIndex, 1);
            _this.maybeInvokeSelectionCallback(nextSelectedRegions);
            // if there are still any selections, move the focused cell to the
            // most recent selection. otherwise, don't update it.
            if (nextSelectedRegions.length > 0) {
                var lastIndex = nextSelectedRegions.length - 1;
                _this.invokeOnFocusCallbackForRegion(nextSelectedRegions[lastIndex], lastIndex);
            }
        };
        _this.handleClearAllSelectionsNotAtIndex = function (selectedRegionIndex) {
            var selectedRegions = _this.props.selectedRegions;
            var nextSelectedRegion = selectedRegions[selectedRegionIndex];
            _this.maybeInvokeSelectionCallback([nextSelectedRegion]);
            _this.invokeOnFocusCallbackForRegion(nextSelectedRegion, 0);
        };
        _this.handleExpandSelection = function (region) {
            var _a = _this.props, focusedCell = _a.focusedCell, selectedRegions = _a.selectedRegions;
            _this.didExpandSelectionOnActivate = true;
            // there should be only one selected region after expanding. do not
            // update the focused cell.
            var nextSelectedRegions = _this.expandSelectedRegions(selectedRegions, region, focusedCell);
            _this.maybeInvokeSelectionCallback(nextSelectedRegions);
            // move the focused cell into the new region if there were no selections before
            if (selectedRegions == null || selectedRegions.length === 0) {
                _this.invokeOnFocusCallbackForRegion(region);
            }
        };
        _this.handleAddDisjointSelection = function (region) {
            var selectedRegions = _this.props.selectedRegions;
            // add the new region to the existing selections
            var nextSelectedRegions = Regions.add(selectedRegions, region);
            _this.maybeInvokeSelectionCallback(nextSelectedRegions);
            // put the focused cell in the new region
            _this.invokeOnFocusCallbackForRegion(region, nextSelectedRegions.length - 1);
        };
        _this.handleReplaceSelection = function (region) {
            // clear all selections and retain only the new one
            var nextSelectedRegions = [region];
            _this.maybeInvokeSelectionCallback(nextSelectedRegions);
            // move the focused cell into the new selection
            _this.invokeOnFocusCallbackForRegion(region);
        };
        _this.invokeOnFocusCallbackForRegion = function (focusRegion, focusSelectionIndex) {
            if (focusSelectionIndex === void 0) { focusSelectionIndex = 0; }
            var onFocusedCell = _this.props.onFocusedCell;
            var focusedCellCoords = Regions.getFocusCellCoordinatesFromRegion(focusRegion);
            onFocusedCell(FocusedCellUtils.toFullCoordinates(focusedCellCoords, focusSelectionIndex));
        };
        // Other
        // =====
        _this.finishInteraction = function () {
            CoreUtils.safeInvoke(_this.props.onSelectionEnd, _this.props.selectedRegions);
            _this.didExpandSelectionOnActivate = false;
            _this.lastEmittedSelectedRegions = null;
        };
        return _this;
    }
    DragSelectable.prototype.render = function () {
        var draggableProps = this.getDraggableProps();
        return (React.createElement(Draggable, tslib_1.__assign({}, draggableProps, { preventDefault: false }), this.props.children));
    };
    DragSelectable.prototype.getDraggableProps = function () {
        return this.props.onSelection == null
            ? {}
            : {
                onActivate: this.handleActivate,
                onClick: this.handleClick,
                onDragEnd: this.handleDragEnd,
                onDragMove: this.handleDragMove,
            };
    };
    DragSelectable.prototype.shouldIgnoreMouseDown = function (event) {
        var _a = this.props, disabled = _a.disabled, _b = _a.ignoredSelectors, ignoredSelectors = _b === void 0 ? [] : _b;
        var element = event.target;
        var isLeftClick = Utils.isLeftClick(event);
        var isContextMenuTrigger = isLeftClick && event.ctrlKey && PlatformUtils.isMac();
        var isDisabled = CoreUtils.safeInvokeOrValue(disabled, event);
        return (!isLeftClick ||
            isContextMenuTrigger ||
            isDisabled ||
            ignoredSelectors.some(function (selector) { return element.closest(selector) != null; }));
    };
    // Callbacks
    // =========
    DragSelectable.prototype.maybeInvokeSelectionCallback = function (nextSelectedRegions) {
        var onSelection = this.props.onSelection;
        // invoke only if the selection changed. this is useful only on
        // mousemove; there's special handling for mousedown interactions that
        // target an already-selected region.
        if (this.lastEmittedSelectedRegions == null ||
            !CoreUtils.deepCompareKeys(this.lastEmittedSelectedRegions, nextSelectedRegions)) {
            onSelection(nextSelectedRegions);
            this.lastEmittedSelectedRegions = nextSelectedRegions;
        }
    };
    /**
     * Expands the last-selected region to the new region, and replaces the
     * last-selected region with the expanded region. If a focused cell is provided,
     * the focused cell will serve as an anchor for the expansion.
     */
    DragSelectable.prototype.expandSelectedRegions = function (regions, region, focusedCell) {
        if (regions.length === 0) {
            return [region];
        }
        else if (focusedCell != null) {
            var expandedRegion = FocusedCellUtils.expandFocusedRegion(focusedCell, region);
            return Regions.update(regions, expandedRegion);
        }
        else {
            var expandedRegion = Regions.expandRegion(regions[regions.length - 1], region);
            return Regions.update(regions, expandedRegion);
        }
    };
    DragSelectable.defaultProps = {
        disabled: false,
        enableMultipleSelection: false,
        selectedRegions: [],
    };
    return DragSelectable;
}(React.PureComponent));
export { DragSelectable };
//# sourceMappingURL=selectable.js.map