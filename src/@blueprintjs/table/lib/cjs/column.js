"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var cell_1 = require("./cell/cell");
var Column = /** @class */ (function (_super) {
    tslib_1.__extends(Column, _super);
    function Column() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Column.defaultProps = {
        cellRenderer: cell_1.emptyCellRenderer,
    };
    return Column;
}(React.PureComponent));
exports.Column = Column;
//# sourceMappingURL=column.js.map