/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Utils as CoreUtils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
var GuideLayer = /** @class */ (function (_super) {
    tslib_1.__extends(GuideLayer, _super);
    function GuideLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderVerticalGuide = function (offset, index) {
            var style = {
                left: offset + "px",
            };
            var className = classNames(Classes.TABLE_OVERLAY, Classes.TABLE_VERTICAL_GUIDE, (_a = {},
                _a[Classes.TABLE_VERTICAL_GUIDE + "-flush-left"] = offset === 0,
                _a));
            return React.createElement("div", { className: className, key: index, style: style });
            var _a;
        };
        _this.renderHorizontalGuide = function (offset, index) {
            var style = {
                top: offset + "px",
            };
            var className = classNames(Classes.TABLE_OVERLAY, Classes.TABLE_HORIZONTAL_GUIDE, (_a = {},
                _a[Classes.TABLE_HORIZONTAL_GUIDE + "-flush-top"] = offset === 0,
                _a));
            return React.createElement("div", { className: className, key: index, style: style });
            var _a;
        };
        return _this;
    }
    GuideLayer.prototype.shouldComponentUpdate = function (nextProps) {
        if (this.props.className !== nextProps.className) {
            return true;
        }
        // shallow-comparing guide arrays leads to tons of unnecessary re-renders, so we check the
        // array contents explicitly.
        return (!CoreUtils.arraysEqual(this.props.verticalGuides, nextProps.verticalGuides) ||
            !CoreUtils.arraysEqual(this.props.horizontalGuides, nextProps.horizontalGuides));
    };
    GuideLayer.prototype.render = function () {
        var _a = this.props, verticalGuides = _a.verticalGuides, horizontalGuides = _a.horizontalGuides, className = _a.className;
        var verticals = verticalGuides == null ? undefined : verticalGuides.map(this.renderVerticalGuide);
        var horizontals = horizontalGuides == null ? undefined : horizontalGuides.map(this.renderHorizontalGuide);
        return (React.createElement("div", { className: classNames(className, Classes.TABLE_OVERLAY_LAYER) },
            verticals,
            horizontals));
    };
    return GuideLayer;
}(React.Component));
export { GuideLayer };
//# sourceMappingURL=guides.js.map