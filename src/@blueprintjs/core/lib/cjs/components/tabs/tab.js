"use strict";
/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var Classes = tslib_1.__importStar(require("../../common/classes"));
var props_1 = require("../../common/props");
var Tab = /** @class */ (function (_super) {
    tslib_1.__extends(Tab, _super);
    function Tab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // this component is never rendered directly; see Tabs#renderTabPanel()
    /* istanbul ignore next */
    Tab.prototype.render = function () {
        var _a = this.props, className = _a.className, panel = _a.panel;
        return (React.createElement("div", { className: classnames_1.default(Classes.TAB_PANEL, className), role: "tablist" }, panel));
    };
    Tab.defaultProps = {
        disabled: false,
        id: undefined,
    };
    Tab.displayName = props_1.DISPLAYNAME_PREFIX + ".Tab";
    return Tab;
}(React.PureComponent));
exports.Tab = Tab;
//# sourceMappingURL=tab.js.map