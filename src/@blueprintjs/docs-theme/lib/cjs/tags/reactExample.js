"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var React = tslib_1.__importStar(require("react"));
var ReactExampleTagRenderer = /** @class */ (function () {
    function ReactExampleTagRenderer(examples) {
        var _this = this;
        this.examples = examples;
        /**
         * Given the name of an example component, like `"AlertExample"`, attempts to resolve
         * it to an actual example component exported by one of the packages. Also returns
         * the URL of the source code on GitHub.
         */
        this.render = function (_a) {
            var exampleName = _a.value;
            if (exampleName == null) {
                return null;
            }
            var example = _this.examples[exampleName];
            if (example == null) {
                throw new Error("Unknown @example component: " + exampleName);
            }
            return (React.createElement(React.Fragment, null,
                example.render({ id: exampleName }),
                React.createElement(core_1.AnchorButton, { className: "docs-example-view-source", fill: true, href: example.sourceUrl, icon: "code", intent: core_1.Intent.PRIMARY, minimal: true, target: "_blank", text: "View source on GitHub" })));
        };
    }
    return ReactExampleTagRenderer;
}());
exports.ReactExampleTagRenderer = ReactExampleTagRenderer;
//# sourceMappingURL=reactExample.js.map