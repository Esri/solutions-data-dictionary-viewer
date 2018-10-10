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
var TextArea = /** @class */ (function (_super) {
    tslib_1.__extends(TextArea, _super);
    function TextArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextArea.prototype.render = function () {
        var _a = this.props, className = _a.className, fill = _a.fill, inputRef = _a.inputRef, intent = _a.intent, large = _a.large, small = _a.small, htmlProps = tslib_1.__rest(_a, ["className", "fill", "inputRef", "intent", "large", "small"]);
        var rootClasses = classnames_1.default(Classes.INPUT, Classes.intentClass(intent), (_b = {},
            _b[Classes.FILL] = fill,
            _b[Classes.LARGE] = large,
            _b[Classes.SMALL] = small,
            _b), className);
        return React.createElement("textarea", tslib_1.__assign({}, htmlProps, { className: rootClasses, ref: inputRef }));
        var _b;
    };
    TextArea.displayName = props_1.DISPLAYNAME_PREFIX + ".TextArea";
    return TextArea;
}(React.PureComponent));
exports.TextArea = TextArea;
//# sourceMappingURL=textArea.js.map