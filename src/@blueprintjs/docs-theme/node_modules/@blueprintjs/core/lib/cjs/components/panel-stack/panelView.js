"use strict";
/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var common_1 = require("../../common");
var buttons_1 = require("../button/buttons");
var text_1 = require("../text/text");
var PanelView = /** @class */ (function (_super) {
    tslib_1.__extends(PanelView, _super);
    function PanelView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClose = function () { return _this.props.onClose(_this.props.panel); };
        return _this;
    }
    PanelView.prototype.render = function () {
        var _a = this.props, panel = _a.panel, onOpen = _a.onOpen;
        // two <span> tags in header ensure title is centered as long as
        // possible, due to `flex: 1` magic.
        return (React.createElement("div", { className: common_1.Classes.PANEL_STACK_VIEW },
            React.createElement("div", { className: common_1.Classes.PANEL_STACK_HEADER },
                React.createElement("span", null, this.maybeRenderBack()),
                React.createElement(text_1.Text, { className: common_1.Classes.HEADING, ellipsize: true }, panel.title),
                React.createElement("span", null)),
            React.createElement(panel.component, tslib_1.__assign({ openPanel: onOpen, closePanel: this.handleClose }, panel.props))));
    };
    PanelView.prototype.maybeRenderBack = function () {
        if (this.props.previousPanel === undefined) {
            return null;
        }
        return (React.createElement(buttons_1.Button, { className: common_1.Classes.PANEL_STACK_HEADER_BACK, icon: "chevron-left", minimal: true, onClick: this.handleClose, small: true, text: this.props.previousPanel.title }));
    };
    return PanelView;
}(React.PureComponent));
exports.PanelView = PanelView;
//# sourceMappingURL=panelView.js.map