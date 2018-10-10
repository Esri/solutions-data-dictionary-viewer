/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import * as React from "react";
import { emptyCellRenderer } from "./cell/cell";
var Column = /** @class */ (function (_super) {
    tslib_1.__extends(Column, _super);
    function Column() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Column.defaultProps = {
        cellRenderer: emptyCellRenderer,
    };
    return Column;
}(React.PureComponent));
export { Column };
//# sourceMappingURL=column.js.map