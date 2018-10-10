/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { CONDENSED, HTML_TABLE, HTML_TABLE_BORDERED, HTML_TABLE_STRIPED, INTERACTIVE, SMALL, } from "../../common/classes";
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var HTMLTable = /** @class */ (function (_super) {
    tslib_1.__extends(HTMLTable, _super);
    function HTMLTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLTable.prototype.render = function () {
        var _a = this.props, bordered = _a.bordered, className = _a.className, condensed = _a.condensed, elementRef = _a.elementRef, interactive = _a.interactive, small = _a.small, striped = _a.striped, htmlProps = tslib_1.__rest(_a, ["bordered", "className", "condensed", "elementRef", "interactive", "small", "striped"]);
        var classes = classNames(HTML_TABLE, (_b = {},
            _b[CONDENSED] = condensed,
            _b[HTML_TABLE_BORDERED] = bordered,
            _b[HTML_TABLE_STRIPED] = striped,
            _b[INTERACTIVE] = interactive,
            _b[SMALL] = small,
            _b), className);
        // tslint:disable-next-line:blueprint-html-components
        return React.createElement("table", tslib_1.__assign({}, htmlProps, { ref: elementRef, className: classes }));
        var _b;
    };
    return HTMLTable;
}(React.PureComponent));
export { HTMLTable };
//# sourceMappingURL=htmlTable.js.map