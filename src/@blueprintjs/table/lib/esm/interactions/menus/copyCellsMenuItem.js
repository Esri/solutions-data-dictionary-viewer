/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { MenuItem, Utils } from "@blueprintjs/core";
import * as React from "react";
import { Clipboard } from "../../common/clipboard";
import { Regions } from "../../regions";
var CopyCellsMenuItem = /** @class */ (function (_super) {
    tslib_1.__extends(CopyCellsMenuItem, _super);
    function CopyCellsMenuItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function () {
            var _a = _this.props, context = _a.context, getCellData = _a.getCellData, onCopy = _a.onCopy;
            var cells = context.getUniqueCells();
            var sparse = Regions.sparseMapCells(cells, getCellData);
            var success = Clipboard.copyCells(sparse);
            Utils.safeInvoke(onCopy, success);
        };
        return _this;
    }
    CopyCellsMenuItem.prototype.render = function () {
        var _a = this.props, context = _a.context, getCellData = _a.getCellData, onCopy = _a.onCopy, menuItemProps = tslib_1.__rest(_a, ["context", "getCellData", "onCopy"]);
        return React.createElement(MenuItem, tslib_1.__assign({}, menuItemProps, { onClick: this.handleClick }));
    };
    return CopyCellsMenuItem;
}(React.PureComponent));
export { CopyCellsMenuItem };
//# sourceMappingURL=copyCellsMenuItem.js.map