/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
// HACKHACK: these components should go in separate files
// tslint:disable max-classes-per-file
import * as React from "react";
import { DISPLAYNAME_PREFIX, removeNonHTMLProps } from "../../common/props";
import { AbstractButton } from "./abstractButton";
var Button = /** @class */ (function (_super) {
    tslib_1.__extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.render = function () {
        return (React.createElement("button", tslib_1.__assign({ type: "button" }, removeNonHTMLProps(this.props), this.getCommonButtonProps()), this.renderChildren()));
    };
    Button.displayName = DISPLAYNAME_PREFIX + ".Button";
    return Button;
}(AbstractButton));
export { Button };
var AnchorButton = /** @class */ (function (_super) {
    tslib_1.__extends(AnchorButton, _super);
    function AnchorButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnchorButton.prototype.render = function () {
        var _a = this.props, href = _a.href, _b = _a.tabIndex, tabIndex = _b === void 0 ? 0 : _b;
        var commonProps = this.getCommonButtonProps();
        return (React.createElement("a", tslib_1.__assign({ role: "button" }, removeNonHTMLProps(this.props), commonProps, { href: commonProps.disabled ? undefined : href, tabIndex: commonProps.disabled ? -1 : tabIndex }), this.renderChildren()));
    };
    AnchorButton.displayName = DISPLAYNAME_PREFIX + ".AnchorButton";
    return AnchorButton;
}(AbstractButton));
export { AnchorButton };
//# sourceMappingURL=buttons.js.map