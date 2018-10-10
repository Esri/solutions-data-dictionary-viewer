"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
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
        var _a = this.props, children = _a.children, className = _a.className, href = _a.href, _b = _a.intent, intent = _b === void 0 ? core_1.Intent.PRIMARY : _b;
        var classes = classnames_1.default("docs-banner", core_1.Classes.intentClass(intent), className);
        return (React.createElement("a", { className: classes, href: href, target: "_blank" }, children));
    };
    return Banner;
}(React.PureComponent));
exports.Banner = Banner;
//# sourceMappingURL=banner.js.map