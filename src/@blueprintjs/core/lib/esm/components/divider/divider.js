/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { DIVIDER } from "../../common/classes";
import { DISPLAYNAME_PREFIX } from "../../common/props";
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var Divider = /** @class */ (function (_super) {
    tslib_1.__extends(Divider, _super);
    function Divider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Divider.prototype.render = function () {
        var _a = this.props, className = _a.className, _b = _a.tagName, TagName = _b === void 0 ? "div" : _b, htmlProps = tslib_1.__rest(_a, ["className", "tagName"]);
        var classes = classNames(DIVIDER, className);
        return React.createElement(TagName, tslib_1.__assign({}, htmlProps, { className: classes }));
    };
    Divider.displayName = DISPLAYNAME_PREFIX + ".Divider";
    return Divider;
}(React.PureComponent));
export { Divider };
//# sourceMappingURL=divider.js.map