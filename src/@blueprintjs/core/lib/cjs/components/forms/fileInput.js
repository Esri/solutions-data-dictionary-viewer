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
var common_1 = require("../../common");
var Classes = tslib_1.__importStar(require("../../common/classes"));
var props_1 = require("../../common/props");
// TODO: write tests (ignoring for now to get a build passing quickly)
/* istanbul ignore next */
var FileInput = /** @class */ (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleInputChange = function (e) {
            common_1.Utils.safeInvoke(_this.props.onInputChange, e);
            common_1.Utils.safeInvoke(_this.props.inputProps.onChange, e);
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        var _a = this.props, className = _a.className, fill = _a.fill, disabled = _a.disabled, inputProps = _a.inputProps, onInputChange = _a.onInputChange, large = _a.large, text = _a.text, htmlProps = tslib_1.__rest(_a, ["className", "fill", "disabled", "inputProps", "onInputChange", "large", "text"]);
        var rootClasses = classnames_1.default(Classes.FILE_INPUT, (_b = {},
            _b[Classes.DISABLED] = disabled,
            _b[Classes.FILL] = fill,
            _b[Classes.LARGE] = large,
            _b), className);
        return (React.createElement("label", tslib_1.__assign({}, htmlProps, { className: rootClasses }),
            React.createElement("input", tslib_1.__assign({}, inputProps, { onChange: this.handleInputChange, type: "file", disabled: disabled })),
            React.createElement("span", { className: Classes.FILE_UPLOAD_INPUT }, text)));
        var _b;
    };
    FileInput.displayName = props_1.DISPLAYNAME_PREFIX + ".FileInput";
    FileInput.defaultProps = {
        inputProps: {},
        text: "Choose file...",
    };
    return FileInput;
}(React.PureComponent));
exports.FileInput = FileInput;
//# sourceMappingURL=fileInput.js.map