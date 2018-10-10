/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT, CONTEXTMENU_WARN_DECORATOR_NO_METHOD, } from "../../common/errors";
import { getDisplayName, isFunction, safeInvoke } from "../../common/utils";
import { isDarkTheme } from "../../common/utils/isDarkTheme";
import * as ContextMenu from "./contextMenu";
export function ContextMenuTarget(WrappedComponent) {
    if (!isFunction(WrappedComponent.prototype.renderContextMenu)) {
        console.warn(CONTEXTMENU_WARN_DECORATOR_NO_METHOD);
    }
    return _a = /** @class */ (function (_super) {
            tslib_1.__extends(ContextMenuTargetClass, _super);
            function ContextMenuTargetClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ContextMenuTargetClass.prototype.render = function () {
                var _this = this;
                var element = _super.prototype.render.call(this);
                if (element == null) {
                    // always return `element` in case caller is distinguishing between `null` and `undefined`
                    return element;
                }
                if (!React.isValidElement(element)) {
                    console.warn(CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT);
                    return element;
                }
                var oldOnContextMenu = element.props.onContextMenu;
                var onContextMenu = function (e) {
                    // support nested menus (inner menu target would have called preventDefault())
                    if (e.defaultPrevented) {
                        return;
                    }
                    if (isFunction(_this.renderContextMenu)) {
                        var menu = _this.renderContextMenu(e);
                        if (menu != null) {
                            var darkTheme = isDarkTheme(ReactDOM.findDOMNode(_this));
                            e.preventDefault();
                            ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, _this.onContextMenuClose, darkTheme);
                        }
                    }
                    safeInvoke(oldOnContextMenu, e);
                };
                return React.cloneElement(element, { onContextMenu: onContextMenu });
            };
            return ContextMenuTargetClass;
        }(WrappedComponent)),
        _a.displayName = "ContextMenuTarget(" + getDisplayName(WrappedComponent) + ")",
        _a;
    var _a;
}
//# sourceMappingURL=contextMenuTarget.js.map