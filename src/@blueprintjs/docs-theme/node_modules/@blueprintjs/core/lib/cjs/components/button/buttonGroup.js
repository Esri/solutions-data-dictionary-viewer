"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var Classes = tslib_1.__importStar(require("../../common/classes"));
var props_1 = require("../../common/props");
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var ButtonGroup = /** @class */ (function (_super) {
    tslib_1.__extends(ButtonGroup, _super);
    function ButtonGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonGroup.prototype.render = function () {
        var _a = this.props, alignText = _a.alignText, className = _a.className, fill = _a.fill, minimal = _a.minimal, large = _a.large, vertical = _a.vertical, htmlProps = tslib_1.__rest(_a, ["alignText", "className", "fill", "minimal", "large", "vertical"]);
        var buttonGroupClasses = classnames_1.default(Classes.BUTTON_GROUP, (_b = {},
            _b[Classes.FILL] = fill,
            _b[Classes.LARGE] = large,
            _b[Classes.MINIMAL] = minimal,
            _b[Classes.VERTICAL] = vertical,
            _b), Classes.alignmentClass(alignText), className);
        return (React.createElement("div", tslib_1.__assign({}, htmlProps, { className: buttonGroupClasses }), this.props.children));
        var _b;
    };
    ButtonGroup.displayName = props_1.DISPLAYNAME_PREFIX + ".ButtonGroup";
    return ButtonGroup;
}(React.PureComponent));
exports.ButtonGroup = ButtonGroup;
//# sourceMappingURL=buttonGroup.js.map