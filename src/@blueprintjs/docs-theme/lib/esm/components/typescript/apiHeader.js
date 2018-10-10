/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { isTsClass, isTsInterface } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes } from "../../common/context";
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
        if (isTsClass(this.props) || isTsInterface(this.props)) {
            var extendsTypes = maybeJoinArray("extends", this.props.extends);
            var implementsTypes = maybeJoinArray("implements", this.props.implements);
            return this.context.renderType(extendsTypes + " " + implementsTypes);
        }
        return "";
    };
    ApiHeader.contextTypes = DocumentationContextTypes;
    ApiHeader.displayName = "Docs2.ApiHeader";
    return ApiHeader;
}(React.PureComponent));
export { ApiHeader };
function maybeJoinArray(title, array) {
    if (array == null || array.length === 0) {
        return "";
    }
    return title + " " + array.join(", ");
}
//# sourceMappingURL=apiHeader.js.map