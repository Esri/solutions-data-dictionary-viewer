/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { IconSvgPaths16, IconSvgPaths20 } from "@blueprintjs/icons";
import { Classes, DISPLAYNAME_PREFIX } from "../../common";
var Icon = /** @class */ (function (_super) {
    tslib_1.__extends(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Icon.prototype.render = function () {
        var icon = this.props.icon;
        if (icon == null) {
            return null;
        }
        else if (typeof icon !== "string") {
            return icon;
        }
        var _a = this.props, className = _a.className, color = _a.color, _b = _a.iconSize, iconSize = _b === void 0 ? Icon.SIZE_STANDARD : _b, intent = _a.intent, _c = _a.title, title = _c === void 0 ? icon : _c, _d = _a.tagName, TagName = _d === void 0 ? "span" : _d, htmlprops = tslib_1.__rest(_a, ["className", "color", "iconSize", "intent", "title", "tagName"]);
        // choose which pixel grid is most appropriate for given icon size
        var pixelGridSize = iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
        // render path elements, or nothing if icon name is unknown.
        var paths = this.renderSvgPaths(pixelGridSize, icon);
        var classes = classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className);
        var viewBox = "0 0 " + pixelGridSize + " " + pixelGridSize;
        return (React.createElement(TagName, tslib_1.__assign({ className: classes }, htmlprops),
            React.createElement("svg", { fill: color, "data-icon": icon, width: iconSize, height: iconSize, viewBox: viewBox },
                title && React.createElement("desc", null, title),
                paths)));
    };
    /** Render `<path>` elements for the given icon name. Returns `null` if name is unknown. */
    Icon.prototype.renderSvgPaths = function (pathsSize, iconName) {
        var svgPathsRecord = pathsSize === Icon.SIZE_STANDARD ? IconSvgPaths16 : IconSvgPaths20;
        var pathStrings = svgPathsRecord[iconName];
        if (pathStrings == null) {
            return null;
        }
        return pathStrings.map(function (d, i) { return React.createElement("path", { key: i, d: d, fillRule: "evenodd" }); });
    };
    Icon.displayName = DISPLAYNAME_PREFIX + ".Icon";
    Icon.SIZE_STANDARD = 16;
    Icon.SIZE_LARGE = 20;
    return Icon;
}(React.PureComponent));
export { Icon };
//# sourceMappingURL=icon.js.map