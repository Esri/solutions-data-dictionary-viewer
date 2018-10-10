/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as React from "react";
var ReactDocsTagRenderer = /** @class */ (function () {
    function ReactDocsTagRenderer(docs) {
        var _this = this;
        this.docs = docs;
        /**
         * Given the name of a component, like `"ColorSchemes"`, attempts to resolve
         * it to an actual component class in the given map, or in the default map which contains
         * valid docs components from this package. Provide a custom map to inject your own components.
         */
        this.render = function (_a) {
            var componentName = _a.value;
            if (componentName == null) {
                return null;
            }
            var docsComponent = _this.docs[componentName];
            if (docsComponent == null) {
                throw new Error("Unknown @reactDocs component: " + componentName);
            }
            return React.createElement(docsComponent);
        };
    }
    return ReactDocsTagRenderer;
}());
export { ReactDocsTagRenderer };
//# sourceMappingURL=reactDocs.js.map