/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Checkbox, Classes, Code } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { DocumentationContextTypes } from "../common/context";
import { Example } from "../components/example";
var CssExample = /** @class */ (function (_super) {
    tslib_1.__extends(CssExample, _super);
    function CssExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { modifiers: new Set() };
        return _this;
    }
    CssExample.prototype.render = function () {
        var _this = this;
        var value = this.props.value;
        var css = this.context.getDocsData().css;
        if (css == null || css[value] == null) {
            return null;
        }
        var _a = css[value], markup = _a.markup, markupHtml = _a.markupHtml, modifiers = _a.modifiers, reference = _a.reference;
        var options = modifiers.map(function (modifier) { return (React.createElement(Checkbox, { key: modifier.name, checked: _this.state.modifiers.has(modifier.name), onChange: _this.getModifierToggleHandler(modifier.name) },
            React.createElement(Code, { "data-modifier": modifier.name }, modifier.name),
            React.createElement("div", { className: "docs-prop-description", dangerouslySetInnerHTML: { __html: modifier.documentation } }))); });
        return (React.createElement(React.Fragment, null,
            React.createElement(Example, { id: reference, options: options.length > 0 ? options : false, html: this.renderExample(markup) }),
            React.createElement("div", { className: classNames("docs-example-markup", Classes.RUNNING_TEXT), dangerouslySetInnerHTML: { __html: markupHtml } })));
    };
    CssExample.prototype.getModifierToggleHandler = function (modifier) {
        var _this = this;
        return function () {
            var modifiers = new Set(_this.state.modifiers);
            if (modifiers.has(modifier)) {
                modifiers.delete(modifier);
            }
            else {
                modifiers.add(modifier);
            }
            _this.setState({ modifiers: modifiers });
        };
    };
    CssExample.prototype.renderExample = function (markup) {
        var classes = this.getModifiers(".");
        var attrs = this.getModifiers(":");
        return markup.replace(MODIFIER_ATTR_REGEXP, attrs).replace(MODIFIER_CLASS_REGEXP, classes);
    };
    CssExample.prototype.getModifiers = function (prefix) {
        return Array.from(this.state.modifiers.keys())
            .filter(function (mod) { return mod.charAt(0) === prefix; })
            .map(function (mod) { return mod.slice(1); })
            .join(" ");
    };
    CssExample.contextTypes = DocumentationContextTypes;
    CssExample.displayName = "Docs2.CssExample";
    return CssExample;
}(React.PureComponent));
export { CssExample };
var MODIFIER_ATTR_REGEXP = /\{\{:modifier}}/g;
var MODIFIER_CLASS_REGEXP = /\{\{\.modifier}}/g;
//# sourceMappingURL=css.js.map