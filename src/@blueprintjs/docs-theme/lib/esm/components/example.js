/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
/**
 * Container for an example and its options.
 *
 * ```tsx
 * import { Example, IExampleProps } from "@blueprintjs/docs-theme";
 * // use IExampleProps as your props type,
 * // then spread it to <Example> below
 * export class MyExample extends React.PureComponent<IExampleProps, [your state]> {
 *     public render() {
 *         const options = (
 *             <>
 *                  --- render options here ---
 *             </>
 *         );
 *         return (
 *             <Example options={options} {...this.props}>
 *                 --- render examples here ---
 *             </Example>
 *         );
 *     }
 * ```
 */
var Example = /** @class */ (function (_super) {
    tslib_1.__extends(Example, _super);
    function Example() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasDelayedBeforeInitialRender = false;
        return _this;
    }
    Example.prototype.render = function () {
        // HACKHACK: This is the other required piece. Don't let any React nodes
        // into the DOM until the requestAnimationFrame delay has elapsed. This
        // prevents shouldComponentUpdate snafus at lower levels.
        if (!this.hasDelayedBeforeInitialRender) {
            return null;
        }
        // spread any additional props through to the root element, to support decorators that expect DOM props
        var _a = this.props, children = _a.children, className = _a.className, data = _a.data, html = _a.html, id = _a.id, options = _a.options, showOptionsBelowExample = _a.showOptionsBelowExample, htmlProps = tslib_1.__rest(_a, ["children", "className", "data", "html", "id", "options", "showOptionsBelowExample"]);
        var classes = classNames("docs-example-frame", showOptionsBelowExample ? "docs-example-frame-column" : "docs-example-frame-row", className);
        var example = html == null ? (React.createElement("div", { className: "docs-example" }, children)) : (React.createElement("div", { className: "docs-example", dangerouslySetInnerHTML: { __html: html } }));
        return (React.createElement("div", tslib_1.__assign({ className: classes, "data-example-id": id }, htmlProps),
            example,
            options && React.createElement("div", { className: "docs-example-options" }, options)));
    };
    Example.prototype.componentDidMount = function () {
        var _this = this;
        // HACKHACK: The docs app suffers from a Flash of Unstyled Content that
        // causes some 'width: 100%' examples to mis-measure the horizontal
        // space available to them. Until that bug is squashed, we must delay
        // initial render till the DOM loads with a requestAnimationFrame.
        requestAnimationFrame(function () {
            _this.hasDelayedBeforeInitialRender = true;
            _this.forceUpdate();
        });
    };
    return Example;
}(React.PureComponent));
export { Example };
//# sourceMappingURL=example.js.map