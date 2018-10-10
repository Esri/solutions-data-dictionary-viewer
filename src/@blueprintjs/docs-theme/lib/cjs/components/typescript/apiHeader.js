"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var client_1 = require("documentalist/dist/client");
var React = tslib_1.__importStar(require("react"));
var context_1 = require("../../common/context");
var ApiHeader = /** @class */ (function (_super) {
    tslib_1.__extends(ApiHeader, _super);
    function ApiHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApiHeader.prototype.render = function () {
        return (React.createElement("div", { className: "docs-interface-header" },
            React.createElement("div", { className: "docs-interface-name" },
                React.createElement("small", null, this.props.kind),
                " ",
                this.props.name,
                " ",
                React.createElement("small", null, this.renderInheritance())),
            React.createElement("small", { className: "docs-package-name" },
                React.createElement("a", { href: this.props.sourceUrl, target: "_blank" }, this.context.renderViewSourceLinkText(this.props))),
            this.props.children));
    };
    ApiHeader.prototype.renderInheritance = function () {
        if (client_1.isTsClass(this.props) || client_1.isTsInterface(this.props)) {
            var extendsTypes = maybeJoinArray("extends", this.props.extends);
            var implementsTypes = maybeJoinArray("implements", this.props.implements);
            return this.context.renderType(extendsTypes + " " + implementsTypes);
        }
        return "";
    };
    ApiHeader.contextTypes = context_1.DocumentationContextTypes;
    ApiHeader.displayName = "Docs2.ApiHeader";
    return ApiHeader;
}(React.PureComponent));
exports.ApiHeader = ApiHeader;
function maybeJoinArray(title, array) {
    if (array == null || array.length === 0) {
        return "";
    }
    return title + " " + array.join(", ");
}
//# sourceMappingURL=apiHeader.js.map