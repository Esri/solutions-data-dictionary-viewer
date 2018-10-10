"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var Classes = tslib_1.__importStar(require("../common/classes"));
var loadableContent_1 = require("../common/loadableContent");
var headerCell_1 = require("./headerCell");
var RowHeaderCell = /** @class */ (function (_super) {
    tslib_1.__extends(RowHeaderCell, _super);
    function RowHeaderCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RowHeaderCell.prototype.render = function () {
        var _a = this.props, 
        // from IRowHeaderCellProps
        enableRowReordering = _a.enableRowReordering, isRowSelected = _a.isRowSelected, 
        // from IHeaderProps
        spreadableProps = tslib_1.__rest(_a, ["enableRowReordering", "isRowSelected"]);
        return (React.createElement(headerCell_1.HeaderCell, tslib_1.__assign({ isReorderable: this.props.enableRowReordering, isSelected: this.props.isRowSelected }, spreadableProps),
            React.createElement("div", { className: Classes.TABLE_ROW_NAME },
                React.createElement(loadableContent_1.LoadableContent, { loading: spreadableProps.loading },
                    React.createElement("div", { className: Classes.TABLE_ROW_NAME_TEXT }, spreadableProps.name))),
            this.props.children,
            spreadableProps.loading ? undefined : spreadableProps.resizeHandle));
    };
    return RowHeaderCell;
}(core_1.AbstractPureComponent));
exports.RowHeaderCell = RowHeaderCell;
//# sourceMappingURL=rowHeaderCell.js.map