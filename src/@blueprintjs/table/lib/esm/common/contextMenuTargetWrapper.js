/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { ContextMenuTarget } from "@blueprintjs/core";
import * as React from "react";
/**
 * Since the ContextMenuTarget uses the `onContextMenu` prop instead
 * `element.addEventListener`, the prop can be lost. This wrapper helps us
 * maintain context menu fuctionality when doing fancy React.cloneElement
 * chains.
 */
var ContextMenuTargetWrapper = /** @class */ (function (_super) {
    tslib_1.__extends(ContextMenuTargetWrapper, _super);
    function ContextMenuTargetWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContextMenuTargetWrapper.prototype.render = function () {
        var _a = this.props, className = _a.className, children = _a.children, style = _a.style;
        return (React.createElement("div", { className: className, style: style }, children));
    };
    ContextMenuTargetWrapper.prototype.renderContextMenu = function (e) {
        return this.props.renderContextMenu(e);
    };
    ContextMenuTargetWrapper = tslib_1.__decorate([
        ContextMenuTarget
    ], ContextMenuTargetWrapper);
    return ContextMenuTargetWrapper;
}(React.PureComponent));
export { ContextMenuTargetWrapper };
//# sourceMappingURL=contextMenuTargetWrapper.js.map