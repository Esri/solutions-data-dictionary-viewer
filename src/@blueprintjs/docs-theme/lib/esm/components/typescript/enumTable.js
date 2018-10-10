/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { DocumentationContextTypes } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";
var EnumTable = /** @class */ (function (_super) {
    tslib_1.__extends(EnumTable, _super);
    function EnumTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderPropRow = function (entry) {
            var renderBlock = _this.context.renderBlock;
            var _a = entry.flags, isDeprecated = _a.isDeprecated, isExternal = _a.isExternal, name = entry.name;
            var classes = classNames("docs-prop-name", {
                "docs-prop-is-deprecated": !!isDeprecated,
                "docs-prop-is-internal": !isExternal,
            });
            // tslint:disable:blueprint-html-components - this is inside RUNNING_TEXT
            return (React.createElement("tr", { key: name },
                React.createElement("td", { className: classes },
                    React.createElement("code", null, name)),
                React.createElement("td", { className: "docs-prop-details" },
                    React.createElement("code", { className: "docs-prop-type" },
                        React.createElement("strong", null, entry.defaultValue)),
                    React.createElement("div", { className: "docs-prop-description" }, renderBlock(entry.documentation)),
                    React.createElement("div", { className: "docs-prop-tags" }, _this.renderTags(entry)))));
            // tslint:enable:blueprint-html-components
        };
        return _this;
    }
    EnumTable.prototype.render = function () {
        var data = this.props.data;
        var renderBlock = this.context.renderBlock;
        return (React.createElement("div", { className: classNames("docs-modifiers", this.props.className) },
            React.createElement(ApiHeader, tslib_1.__assign({}, data)),
            renderBlock(data.documentation),
            React.createElement(ModifierTable, { emptyMessage: "This enum is empty.", title: "Members" }, data.members.map(this.renderPropRow))));
    };
    EnumTable.prototype.renderTags = function (entry) {
        var isDeprecated = entry.flags.isDeprecated;
        return React.createElement(DeprecatedTag, { isDeprecated: isDeprecated });
    };
    EnumTable.contextTypes = DocumentationContextTypes;
    EnumTable.displayName = "Docs2.EnumTable";
    return EnumTable;
}(React.PureComponent));
export { EnumTable };
//# sourceMappingURL=enumTable.js.map