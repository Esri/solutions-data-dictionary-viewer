"use strict";
/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var classes_1 = require("../../common/classes");
var icon_1 = require("../icon/icon");
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var HTMLSelect = /** @class */ (function (_super) {
    tslib_1.__extends(HTMLSelect, _super);
    function HTMLSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLSelect.prototype.render = function () {
        var _a = this.props, className = _a.className, disabled = _a.disabled, elementRef = _a.elementRef, fill = _a.fill, iconProps = _a.iconProps, large = _a.large, minimal = _a.minimal, _b = _a.options, options = _b === void 0 ? [] : _b, htmlProps = tslib_1.__rest(_a, ["className", "disabled", "elementRef", "fill", "iconProps", "large", "minimal", "options"]);
        var classes = classnames_1.default(classes_1.HTML_SELECT, (_c = {},
            _c[classes_1.DISABLED] = disabled,
            _c[classes_1.FILL] = fill,
            _c[classes_1.LARGE] = large,
            _c[classes_1.MINIMAL] = minimal,
            _c), className);
        var optionChildren = options.map(function (option) {
            var props = typeof option === "object" ? option : { value: option };
            return React.createElement("option", tslib_1.__assign({}, props, { key: props.value, children: props.label || props.value }));
        });
        return (React.createElement("div", { className: classes },
            React.createElement("select", tslib_1.__assign({ disabled: disabled, ref: elementRef }, htmlProps, { multiple: false }),
                optionChildren,
                htmlProps.children),
            React.createElement(icon_1.Icon, tslib_1.__assign({ icon: "double-caret-vertical" }, iconProps))));
        var _c;
    };
    return HTMLSelect;
}(React.PureComponent));
exports.HTMLSelect = HTMLSelect;
//# sourceMappingURL=htmlSelect.js.map