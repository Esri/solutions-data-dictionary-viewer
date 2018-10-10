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
var TabTitle = /** @class */ (function (_super) {
    tslib_1.__extends(TabTitle, _super);
    function TabTitle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (e) { return _this.props.onClick(_this.props.id, e); };
        return _this;
    }
    TabTitle.prototype.render = function () {
        var _a = this.props, disabled = _a.disabled, id = _a.id, parentId = _a.parentId, selected = _a.selected;
        return (React.createElement("div", { "aria-controls": generateTabPanelId(parentId, id), "aria-disabled": disabled, "aria-expanded": selected, "aria-selected": selected, className: classnames_1.default(Classes.TAB, this.props.className), "data-tab-id": id, id: generateTabTitleId(parentId, id), onClick: disabled ? undefined : this.handleClick, role: "tab", tabIndex: disabled ? undefined : 0 },
            this.props.title,
            this.props.children));
    };
    TabTitle.displayName = props_1.DISPLAYNAME_PREFIX + ".TabTitle";
    return TabTitle;
}(React.PureComponent));
exports.TabTitle = TabTitle;
function generateTabPanelId(parentId, tabId) {
    return Classes.TAB_PANEL + "_" + parentId + "_" + tabId;
}
exports.generateTabPanelId = generateTabPanelId;
function generateTabTitleId(parentId, tabId) {
    return Classes.TAB + "-title_" + parentId + "_" + tabId;
}
exports.generateTabTitleId = generateTabTitleId;
//# sourceMappingURL=tabTitle.js.map