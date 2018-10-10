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
var FormGroup = /** @class */ (function (_super) {
    tslib_1.__extends(FormGroup, _super);
    function FormGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormGroup.prototype.render = function () {
        var _a = this.props, children = _a.children, helperText = _a.helperText, label = _a.label, labelFor = _a.labelFor, labelInfo = _a.labelInfo;
        return (React.createElement("div", { className: this.getClassName() },
            label && (React.createElement("label", { className: Classes.LABEL, htmlFor: labelFor },
                label,
                " ",
                React.createElement("span", { className: Classes.TEXT_MUTED }, labelInfo))),
            React.createElement("div", { className: Classes.FORM_CONTENT },
                children,
                helperText && React.createElement("div", { className: Classes.FORM_HELPER_TEXT }, helperText))));
    };
    FormGroup.prototype.getClassName = function () {
        var _a = this.props, className = _a.className, disabled = _a.disabled, inline = _a.inline, intent = _a.intent;
        return classnames_1.default(Classes.FORM_GROUP, Classes.intentClass(intent), (_b = {},
            _b[Classes.DISABLED] = disabled,
            _b[Classes.INLINE] = inline,
            _b), className);
        var _b;
    };
    FormGroup.displayName = props_1.DISPLAYNAME_PREFIX + ".FormGroup";
    return FormGroup;
}(React.PureComponent));
exports.FormGroup = FormGroup;
//# sourceMappingURL=formGroup.js.map