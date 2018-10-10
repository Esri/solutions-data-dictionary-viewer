/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/
import { Classes, Icon, KeyCombo } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
export var NavButton = function (props) { return (React.createElement("div", { className: classNames("docs-nav-button", Classes.TEXT_MUTED), onClick: props.onClick },
    React.createElement(Icon, { icon: props.icon }),
    React.createElement("span", { className: Classes.FILL }, props.text),
    React.createElement("div", { style: { opacity: 0.5 } },
        React.createElement(KeyCombo, { combo: props.hotkey, minimal: true })))); };
//# sourceMappingURL=navButton.js.map