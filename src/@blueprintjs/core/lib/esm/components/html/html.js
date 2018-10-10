/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { BLOCKQUOTE, CODE, CODE_BLOCK, HEADING, LABEL, LIST } from "../../common/classes";
function htmlElement(tagName, tagClassName) {
    return function (props) {
        var className = props.className, elementRef = props.elementRef, htmlProps = tslib_1.__rest(props, ["className", "elementRef"]);
        return React.createElement(tagName, tslib_1.__assign({}, htmlProps, { className: classNames(tagClassName, className), ref: elementRef }));
    };
}
// the following components are linted by blueprint-html-components because
// they should rarely be used without the Blueprint classes/styles:
export var H1 = htmlElement("h1", HEADING);
export var H2 = htmlElement("h2", HEADING);
export var H3 = htmlElement("h3", HEADING);
export var H4 = htmlElement("h4", HEADING);
export var H5 = htmlElement("h5", HEADING);
export var H6 = htmlElement("h6", HEADING);
export var Blockquote = htmlElement("blockquote", BLOCKQUOTE);
export var Code = htmlElement("code", CODE);
export var Pre = htmlElement("pre", CODE_BLOCK);
export var Label = htmlElement("label", LABEL);
// these two are not linted by blueprint-html-components because there are valid
// uses of these elements without Blueprint styles:
export var OL = htmlElement("ol", LIST);
export var UL = htmlElement("ul", LIST);
//# sourceMappingURL=html.js.map