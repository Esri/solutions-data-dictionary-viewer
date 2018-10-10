/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Classes, Intent, Tag } from "@blueprintjs/core";
import classNames from "classnames";
import { isTag, isTsProperty, } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes } from "../../common/context";
import { ModifierTable } from "../modifierTable";
import { ApiHeader } from "./apiHeader";
import { DeprecatedTag } from "./deprecatedTag";
// tslint:disable:blueprint-html-components - rendered inside RUNNING_TEXT
var InterfaceTable = /** @class */ (function (_super) {
    tslib_1.__extends(InterfaceTable, _super);
    function InterfaceTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderPropRow = function (entry) {
            var _a = _this.context, renderBlock = _a.renderBlock, renderType = _a.renderType;
            var _b = entry.flags, isDeprecated = _b.isDeprecated, isExternal = _b.isExternal, isOptional = _b.isOptional, name = entry.name;
            var documentation = (isTsProperty(entry) ? entry : entry.signatures[0]).documentation;
            // ignore props marked with `@internal` tag (this tag is in contents instead of in flags)
            if (documentation != null &&
                documentation.contents != null &&
                documentation.contents.some(function (val) { return isTag(val) && val.tag === "internal"; })) {
                return null;
            }
            var classes = classNames("docs-prop-name", {
                "docs-prop-is-deprecated": isDeprecated === true || typeof isDeprecated === "string",
                "docs-prop-is-internal": !isExternal,
                "docs-prop-is-required": !isOptional,
            });
            var typeInfo = isTsProperty(entry) ? (React.createElement(React.Fragment, null,
                React.createElement("strong", null, renderType(entry.type)),
                React.createElement("em", { className: classNames("docs-prop-default", Classes.TEXT_MUTED) }, entry.defaultValue))) : (React.createElement(React.Fragment, null,
                React.createElement("strong", null, renderType(entry.signatures[0].type))));
            return (React.createElement("tr", { key: name },
                React.createElement("td", { className: classes },
                    React.createElement("code", null, name)),
                React.createElement("td", { className: "docs-prop-details" },
                    React.createElement("code", { className: "docs-prop-type" }, typeInfo),
                    React.createElement("div", { className: "docs-prop-description" }, renderBlock(documentation)),
                    React.createElement("div", { className: "docs-prop-tags" }, _this.renderTags(entry)))));
        };
        return _this;
    }
    InterfaceTable.prototype.render = function () {
        var _a = this.props, data = _a.data, title = _a.title;
        var renderBlock = this.context.renderBlock;
        var propRows = data.properties.concat(data.methods).sort(function (a, b) { return a.name.localeCompare(b.name); })
            .map(this.renderPropRow);
        return (React.createElement("div", { className: classNames("docs-modifiers", this.props.className) },
            React.createElement(ApiHeader, tslib_1.__assign({}, data)),
            renderBlock(data.documentation),
            React.createElement(ModifierTable, { emptyMessage: "This interface is empty.", title: title },
                propRows,
                this.renderIndexSignature(data.indexSignature))));
    };
    InterfaceTable.prototype.renderIndexSignature = function (entry) {
        if (entry == null) {
            return null;
        }
        var _a = this.context, renderBlock = _a.renderBlock, renderType = _a.renderType;
        // HACKHACK: Documentalist's indexSignature support isn't _great_, but it's certainly _good enough_
        // entry.type looks like "{ [name: string]: (date: Date) => boolean }"
        var _b = entry.type.slice(2, -2).split("]: "), signature = _b[0], returnType = _b[1];
        return (React.createElement("tr", { key: name },
            React.createElement("td", { className: "docs-prop-name" },
                React.createElement("code", null,
                    renderType(signature),
                    "]")),
            React.createElement("td", { className: "docs-prop-details" },
                React.createElement("code", { className: "docs-prop-type" }, renderType(returnType)),
                React.createElement("div", { className: "docs-prop-description" }, renderBlock(entry.documentation)))));
    };
    InterfaceTable.prototype.renderTags = function (entry) {
        var renderType = this.context.renderType;
        var _a = entry.flags, isDeprecated = _a.isDeprecated, isOptional = _a.isOptional, inheritedFrom = entry.inheritedFrom;
        return (React.createElement(React.Fragment, null,
            !isOptional && React.createElement(Tag, { children: "Required", intent: Intent.SUCCESS, minimal: true }),
            React.createElement(DeprecatedTag, { isDeprecated: isDeprecated }),
            inheritedFrom && (React.createElement(Tag, { minimal: true },
                "Inherited from ",
                React.createElement("code", null, renderType(inheritedFrom))))));
    };
    InterfaceTable.contextTypes = DocumentationContextTypes;
    InterfaceTable.displayName = "Docs2.InterfaceTable";
    return InterfaceTable;
}(React.PureComponent));
export { InterfaceTable };
//# sourceMappingURL=interfaceTable.js.map