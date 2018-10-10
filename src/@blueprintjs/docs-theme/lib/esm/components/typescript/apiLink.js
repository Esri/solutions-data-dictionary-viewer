/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import * as React from "react";
import { DocumentationContextTypes } from "../../common/context";
/**
 * Renders a link to open a symbol in the API Browser.
 */
var ApiLink = /** @class */ (function (_super) {
    tslib_1.__extends(ApiLink, _super);
    function ApiLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (evt) {
            evt.preventDefault();
            _this.context.showApiDocs(_this.props.name);
        };
        return _this;
    }
    ApiLink.prototype.render = function () {
        var _a = this.props, className = _a.className, name = _a.name;
        return (React.createElement("a", { className: className, href: "#api/" + name, onClick: this.handleClick }, name));
    };
    ApiLink.contextTypes = DocumentationContextTypes;
    return ApiLink;
}(React.PureComponent));
export { ApiLink };
//# sourceMappingURL=apiLink.js.map