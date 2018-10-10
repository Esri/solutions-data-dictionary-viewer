/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { ButtonGroup } from "../button/buttonGroup";
import { AnchorButton, Button } from "../button/buttons";
import { Icon } from "../icon/icon";
var Toast = /** @class */ (function (_super) {
    tslib_1.__extends(Toast, _super);
    function Toast() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleActionClick = function (e) {
            safeInvoke(_this.props.action.onClick, e);
            _this.triggerDismiss(false);
        };
        _this.handleCloseClick = function () { return _this.triggerDismiss(false); };
        _this.startTimeout = function () {
            if (_this.props.timeout > 0) {
                _this.setTimeout(function () { return _this.triggerDismiss(true); }, _this.props.timeout);
            }
        };
        return _this;
    }
    Toast.prototype.render = function () {
        var _a = this.props, className = _a.className, icon = _a.icon, intent = _a.intent, message = _a.message;
        return (React.createElement("div", { className: classNames(Classes.TOAST, Classes.intentClass(intent), className), onBlur: this.startTimeout, onFocus: this.clearTimeouts, onMouseEnter: this.clearTimeouts, onMouseLeave: this.startTimeout, tabIndex: 0 },
            React.createElement(Icon, { icon: icon }),
            React.createElement("span", { className: Classes.TOAST_MESSAGE }, message),
            React.createElement(ButtonGroup, { minimal: true },
                this.maybeRenderActionButton(),
                React.createElement(Button, { icon: "cross", onClick: this.handleCloseClick }))));
    };
    Toast.prototype.componentDidMount = function () {
        this.startTimeout();
    };
    Toast.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.timeout <= 0 && this.props.timeout > 0) {
            this.startTimeout();
        }
        else if (prevProps.timeout > 0 && this.props.timeout <= 0) {
            this.clearTimeouts();
        }
    };
    Toast.prototype.componentWillUnmount = function () {
        this.clearTimeouts();
    };
    Toast.prototype.maybeRenderActionButton = function () {
        var action = this.props.action;
        if (action == null) {
            return undefined;
        }
        else {
            return React.createElement(AnchorButton, tslib_1.__assign({}, action, { intent: undefined, onClick: this.handleActionClick }));
        }
    };
    Toast.prototype.triggerDismiss = function (didTimeoutExpire) {
        safeInvoke(this.props.onDismiss, didTimeoutExpire);
        this.clearTimeouts();
    };
    Toast.defaultProps = {
        className: "",
        message: "",
        timeout: 5000,
    };
    Toast.displayName = DISPLAYNAME_PREFIX + ".Toast";
    return Toast;
}(AbstractPureComponent));
export { Toast };
//# sourceMappingURL=toast.js.map