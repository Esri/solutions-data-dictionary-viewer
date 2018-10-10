/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import * as React from "react";
import { AbstractPureComponent } from "@blueprintjs/core";
import * as Classes from "../common/classes";
import { LoadableContent } from "../common/loadableContent";
import { HeaderCell } from "./headerCell";
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
        return (React.createElement(HeaderCell, tslib_1.__assign({ isReorderable: this.props.enableRowReordering, isSelected: this.props.isRowSelected }, spreadableProps),
            React.createElement("div", { className: Classes.TABLE_ROW_NAME },
                React.createElement(LoadableContent, { loading: spreadableProps.loading },
                    React.createElement("div", { className: Classes.TABLE_ROW_NAME_TEXT }, spreadableProps.name))),
            this.props.children,
            spreadableProps.loading ? undefined : spreadableProps.resizeHandle));
    };
    return RowHeaderCell;
}(AbstractPureComponent));
export { RowHeaderCell };
//# sourceMappingURL=rowHeaderCell.js.map