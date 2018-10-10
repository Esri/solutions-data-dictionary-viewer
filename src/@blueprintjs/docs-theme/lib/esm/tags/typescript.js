/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { isTsClass, isTsEnum, isTsInterface, isTsTypeAlias, } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes } from "../common/context";
import { EnumTable } from "../components/typescript/enumTable";
import { InterfaceTable } from "../components/typescript/interfaceTable";
import { TypeAliasTable } from "../components/typescript/typeAliasTable";
export var TypescriptExample = function (_a, _b) {
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
    else if (isTsClass(member) || isTsInterface(member)) {
        return React.createElement(InterfaceTable, { className: className, data: member, title: "Props" });
    }
    else if (isTsEnum(member)) {
        return React.createElement(EnumTable, { className: className, data: member });
    }
    else if (isTsTypeAlias(member)) {
        return React.createElement(TypeAliasTable, { className: className, data: member });
    }
    else {
        throw new Error("\"@interface " + name + "\": unknown member kind \"" + member.kind + "\"");
    }
};
TypescriptExample.contextTypes = DocumentationContextTypes;
TypescriptExample.displayName = "Docs2.TypescriptExample";
//# sourceMappingURL=typescript.js.map