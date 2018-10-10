"use strict";
/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
exports.NavButton = function (props) { return (React.createElement("div", { className: classnames_1.default("docs-nav-button", core_1.Classes.TEXT_MUTED), onClick: props.onClick },
    React.createElement(core_1.Icon, { icon: props.icon }),
    React.createElement("span", { className: core_1.Classes.FILL }, props.text),
    React.createElement("div", { style: { opacity: 0.5 } },
        React.createElement(core_1.KeyCombo, { combo: props.hotkey, minimal: true })))); };
//# sourceMappingURL=navButton.js.map