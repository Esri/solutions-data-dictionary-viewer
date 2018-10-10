/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Classes, Intent } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
/**
 * Render `Banner` before `Documentation` for a full-width colored banner link across the top of the page.
 * Use this to alert users to make changes or new pages.
 */
var Banner = /** @class */ (function (_super) {
    tslib_1.__extends(Banner, _super);
    function Banner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Banner.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, href = _a.href, _b = _a.intent, intent = _b === void 0 ? Intent.PRIMARY : _b;
        var classes = classNames("docs-banner", Classes.intentClass(intent), className);
        return (React.createElement("a", { className: classes, href: href, target: "_blank" }, children));
    };
    return Banner;
}(React.PureComponent));
export { Banner };
//# sourceMappingURL=banner.js.map