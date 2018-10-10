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
        core_1.ContextMenuTarget
    ], ContextMenuTargetWrapper);
    return ContextMenuTargetWrapper;
}(React.PureComponent));
exports.ContextMenuTargetWrapper = ContextMenuTargetWrapper;
//# sourceMappingURL=contextMenuTargetWrapper.js.map