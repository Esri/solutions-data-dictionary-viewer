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
var context_1 = require("../../common/context");
var apiHeader_1 = require("./apiHeader");
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
        return (React.createElement("div", { className: classnames_1.default("docs-modifiers", this.props.className) },
            React.createElement(apiHeader_1.ApiHeader, tslib_1.__assign({}, data)),
            renderBlock(data.documentation),
            React.createElement("div", { className: "docs-type-alias docs-code" }, aliases)));
    };
    TypeAliasTable.contextTypes = context_1.DocumentationContextTypes;
    TypeAliasTable.displayName = "Docs2.TypeAliasTable";
    return TypeAliasTable;
}(React.PureComponent));
exports.TypeAliasTable = TypeAliasTable;
//# sourceMappingURL=typeAliasTable.js.map