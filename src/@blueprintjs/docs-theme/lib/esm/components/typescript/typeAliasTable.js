/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { DocumentationContextTypes } from "../../common/context";
import { ApiHeader } from "./apiHeader";
var TypeAliasTable = /** @class */ (function (_super) {
    tslib_1.__extends(TypeAliasTable, _super);
    function TypeAliasTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeAliasTable.prototype.render = function () {
        var data = this.props.data;
        var _a = this.context, renderBlock = _a.renderBlock, renderType = _a.renderType;
        var aliases = data.type.split(" | ").map(function (type, i) { return (React.createElement("div", null,
            i === 0 ? "=" : "|",
            " ",
            renderType(type))); });
        return (React.createElement("div", { className: classNames("docs-modifiers", this.props.className) },
            React.createElement(ApiHeader, tslib_1.__assign({}, data)),
            renderBlock(data.documentation),
            React.createElement("div", { className: "docs-type-alias docs-code" }, aliases)));
    };
    TypeAliasTable.contextTypes = DocumentationContextTypes;
    TypeAliasTable.displayName = "Docs2.TypeAliasTable";
    return TypeAliasTable;
}(React.PureComponent));
export { TypeAliasTable };
//# sourceMappingURL=typeAliasTable.js.map