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
var client_1 = require("documentalist/dist/client");
var React = tslib_1.__importStar(require("react"));
var context_1 = require("../../common/context");
var modifierTable_1 = require("../modifierTable");
var apiHeader_1 = require("./apiHeader");
var deprecatedTag_1 = require("./deprecatedTag");
// tslint:disable:blueprint-html-components - rendered inside RUNNING_TEXT
var InterfaceTable = /** @class */ (function (_super) {
    tslib_1.__extends(InterfaceTable, _super);
    function InterfaceTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderPropRow = function (entry) {
            var _a = _this.context, renderBlock = _a.renderBlock, renderType = _a.renderType;
            var _b = entry.flags, isDeprecated = _b.isDeprecated, isExternal = _b.isExternal, isOptional = _b.isOptional, name = entry.name;
            var documentation = (client_1.isTsProperty(entry) ? entry : entry.signatures[0]).documentation;
            // ignore props marked with `@internal` tag (this tag is in contents instead of in flags)
            if (documentation != null &&
                documentation.contents != null &&
                documentation.contents.some(function (val) { return client_1.isTag(val) && val.tag === "internal"; })) {
                return null;
            }
            var classes = classnames_1.default("docs-prop-name", {
                "docs-prop-is-deprecated": isDeprecated === true || typeof isDeprecated === "string",
                "docs-prop-is-internal": !isExternal,
                "docs-prop-is-required": !isOptional,
            });
            var typeInfo = client_1.isTsProperty(entry) ? (React.createElement(React.Fragment, null,
                React.createElement("strong", null, renderType(entry.type)),
                React.createElement("em", { className: classnames_1.default("docs-prop-default", core_1.Classes.TEXT_MUTED) }, entry.defaultValue))) : (React.createElement(React.Fragment, null,
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
        return (React.createElement("div", { className: classnames_1.default("docs-modifiers", this.props.className) },
            React.createElement(apiHeader_1.ApiHeader, tslib_1.__assign({}, data)),
            renderBlock(data.documentation),
            React.createElement(modifierTable_1.ModifierTable, { emptyMessage: "This interface is empty.", title: title },
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
            !isOptional && React.createElement(core_1.Tag, { children: "Required", intent: core_1.Intent.SUCCESS, minimal: true }),
            React.createElement(deprecatedTag_1.DeprecatedTag, { isDeprecated: isDeprecated }),
            inheritedFrom && (React.createElement(core_1.Tag, { minimal: true },
                "Inherited from ",
                React.createElement("code", null, renderType(inheritedFrom))))));
    };
    InterfaceTable.contextTypes = context_1.DocumentationContextTypes;
    InterfaceTable.displayName = "Docs2.InterfaceTable";
    return InterfaceTable;
}(React.PureComponent));
exports.InterfaceTable = InterfaceTable;
//# sourceMappingURL=interfaceTable.js.map