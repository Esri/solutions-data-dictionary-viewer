/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Icon, Popover, Position } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { Utils } from "../../common/utils";
import { Locator } from "../../locator";
// amount in pixels that the content div width changes when truncated vs when
// not truncated. Note: could be modified by styles
// Note 2: this doesn't come from the width of the popover element, but the "right" style
// on the div, which comes from styles
var CONTENT_DIV_WIDTH_DELTA = 25;
export var TruncatedPopoverMode;
(function (TruncatedPopoverMode) {
    TruncatedPopoverMode["ALWAYS"] = "always";
    TruncatedPopoverMode["NEVER"] = "never";
    TruncatedPopoverMode["WHEN_TRUNCATED"] = "when-truncated";
    TruncatedPopoverMode["WHEN_TRUNCATED_APPROX"] = "when-truncated-approx";
})(TruncatedPopoverMode || (TruncatedPopoverMode = {}));
var TruncatedFormat = /** @class */ (function (_super) {
    tslib_1.__extends(TruncatedFormat, _super);
    function TruncatedFormat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isPopoverOpen: false,
            isTruncated: false,
        };
        _this.handleContentDivRef = function (ref) { return (_this.contentDiv = ref); };
        _this.handlePopoverOpen = function () {
            _this.setState({ isPopoverOpen: true });
        };
        _this.handlePopoverClose = function () {
            _this.setState({ isPopoverOpen: false });
        };
        return _this;
    }
    TruncatedFormat.prototype.componentDidMount = function () {
        this.setTruncationState();
    };
    TruncatedFormat.prototype.componentDidUpdate = function () {
        this.setTruncationState();
    };
    TruncatedFormat.prototype.render = function () {
        var _a = this.props, children = _a.children, detectTruncation = _a.detectTruncation, truncateLength = _a.truncateLength, truncationSuffix = _a.truncationSuffix;
        var content = "" + children;
        var cellContent = content;
        if (!detectTruncation && truncateLength > 0 && cellContent.length > truncateLength) {
            cellContent = cellContent.substring(0, truncateLength) + truncationSuffix;
        }
        if (this.shouldShowPopover(content)) {
            var className = classNames(this.props.className, Classes.TABLE_TRUNCATED_FORMAT);
            return (React.createElement("div", { className: className },
                React.createElement("div", { className: Classes.TABLE_TRUNCATED_VALUE, ref: this.handleContentDivRef }, cellContent),
                this.renderPopover()));
        }
        else {
            var className = classNames(this.props.className, Classes.TABLE_TRUNCATED_FORMAT_TEXT);
            return (React.createElement("div", { className: className, ref: this.handleContentDivRef }, cellContent));
        }
    };
    TruncatedFormat.prototype.renderPopover = function () {
        var _a = this.props, children = _a.children, preformatted = _a.preformatted;
        // `<Popover>` will always check the content's position on update
        // regardless if it is open or not. This negatively affects perf due to
        // layout thrashing. So instead we manage the popover state ourselves
        // and mimic its popover target
        if (this.state.isPopoverOpen) {
            var popoverClasses = classNames(Classes.TABLE_TRUNCATED_POPOVER, preformatted ? Classes.TABLE_POPOVER_WHITESPACE_PRE : Classes.TABLE_POPOVER_WHITESPACE_NORMAL);
            var popoverContent = React.createElement("div", { className: popoverClasses }, children);
            return (React.createElement(Popover, { className: Classes.TABLE_TRUNCATED_POPOVER_TARGET, modifiers: { preventOverflow: { boundariesElement: "window" } }, content: popoverContent, position: Position.BOTTOM, isOpen: true, onClose: this.handlePopoverClose },
                React.createElement(Icon, { icon: "more" })));
        }
        else {
            // NOTE: This structure matches what `<Popover>` does internally. If
            // `<Popover>` changes, this must be updated.
            return (React.createElement("span", { className: Classes.TABLE_TRUNCATED_POPOVER_TARGET, onClick: this.handlePopoverOpen },
                React.createElement(Icon, { icon: "more" })));
        }
    };
    TruncatedFormat.prototype.shouldShowPopover = function (content) {
        var _a = this.props, detectTruncation = _a.detectTruncation, measureByApproxOptions = _a.measureByApproxOptions, showPopover = _a.showPopover, truncateLength = _a.truncateLength;
        switch (showPopover) {
            case TruncatedPopoverMode.ALWAYS:
                return true;
            case TruncatedPopoverMode.NEVER:
                return false;
            case TruncatedPopoverMode.WHEN_TRUNCATED:
                return detectTruncation
                    ? this.state.isTruncated
                    : truncateLength > 0 && content.length > truncateLength;
            case TruncatedPopoverMode.WHEN_TRUNCATED_APPROX:
                if (!detectTruncation) {
                    return truncateLength > 0 && content.length > truncateLength;
                }
                if (this.props.parentCellHeight == null || this.props.parentCellWidth == null) {
                    return false;
                }
                var approximateCharWidth = measureByApproxOptions.approximateCharWidth, approximateLineHeight = measureByApproxOptions.approximateLineHeight, cellHorizontalPadding = measureByApproxOptions.cellHorizontalPadding, numBufferLines = measureByApproxOptions.numBufferLines;
                var cellWidth = this.props.parentCellWidth;
                var approxCellHeight = Utils.getApproxCellHeight(content, cellWidth, approximateCharWidth, approximateLineHeight, cellHorizontalPadding, numBufferLines);
                var shouldTruncate = approxCellHeight > this.props.parentCellHeight;
                return shouldTruncate;
            default:
                return false;
        }
    };
    TruncatedFormat.prototype.setTruncationState = function () {
        if (!this.props.detectTruncation || this.props.showPopover !== TruncatedPopoverMode.WHEN_TRUNCATED) {
            return;
        }
        if (this.contentDiv === undefined) {
            this.setState({ isTruncated: false });
            return;
        }
        var isTruncated = this.state.isTruncated;
        // take all measurements at once to avoid excessive DOM reflows.
        var _a = this.contentDiv, containerHeight = _a.clientHeight, containerWidth = _a.clientWidth, actualContentHeight = _a.scrollHeight, contentWidth = _a.scrollWidth;
        // if the content is truncated, then a popover handle will be present as a
        // sibling of the content. we don't want to consider that handle when
        // calculating the width of the actual content, so subtract it.
        var actualContentWidth = isTruncated ? contentWidth - CONTENT_DIV_WIDTH_DELTA : contentWidth;
        // we of course truncate the content if it doesn't fit in the container. but we
        // also aggressively truncate if they're the same size with truncation enabled;
        // this addresses browser-crashing stack-overflow bugs at various zoom levels.
        // (see: https://github.com/palantir/blueprint/pull/1519)
        var shouldTruncate = (isTruncated && actualContentWidth === containerWidth) ||
            actualContentWidth > containerWidth ||
            actualContentHeight > containerHeight;
        this.setState({ isTruncated: shouldTruncate });
    };
    TruncatedFormat.defaultProps = {
        detectTruncation: false,
        measureByApproxOptions: {
            approximateCharWidth: 8,
            approximateLineHeight: 18,
            cellHorizontalPadding: 2 * Locator.CELL_HORIZONTAL_PADDING,
            numBufferLines: 0,
        },
        preformatted: false,
        showPopover: TruncatedPopoverMode.WHEN_TRUNCATED,
        truncateLength: 2000,
        truncationSuffix: "...",
    };
    return TruncatedFormat;
}(React.PureComponent));
export { TruncatedFormat };
//# sourceMappingURL=truncatedFormat.js.map