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
var context_1 = require("../common/context");
var enumTable_1 = require("../components/typescript/enumTable");
var interfaceTable_1 = require("../components/typescript/interfaceTable");
var typeAliasTable_1 = require("../components/typescript/typeAliasTable");
exports.TypescriptExample = function (_a, _b) {
    var className = _a.className, value = _a.value;
    var getDocsData = _b.getDocsData;
    var typescript = getDocsData().typescript;
    if (typescript == null || typescript[value] == null) {
        return null;
    }
    var member = typescript[value];
    if (member === undefined) {
        throw new Error("Unknown @interface " + name);
    }
    else if (client_1.isTsClass(member) || client_1.isTsInterface(member)) {
        return React.createElement(interfaceTable_1.InterfaceTable, { className: className, data: member, title: "Props" });
    }
    else if (client_1.isTsEnum(member)) {
        return React.createElement(enumTable_1.EnumTable, { className: className, data: member });
    }
    else if (client_1.isTsTypeAlias(member)) {
        return React.createElement(typeAliasTable_1.TypeAliasTable, { className: className, data: member });
    }
    else {
        throw new Error("\"@interface " + name + "\": unknown member kind \"" + member.kind + "\"");
    }
};
exports.TypescriptExample.contextTypes = context_1.DocumentationContextTypes;
exports.TypescriptExample.displayName = "Docs2.TypescriptExample";
//# sourceMappingURL=typescript.js.map