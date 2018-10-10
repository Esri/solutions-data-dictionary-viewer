"use strict";
/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var classes_1 = require("../../common/classes");
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var HTMLTable = /** @class */ (function (_super) {
    tslib_1.__extends(HTMLTable, _super);
    function HTMLTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLTable.prototype.render = function () {
        var _a = this.props, bordered = _a.bordered, className = _a.className, condensed = _a.condensed, elementRef = _a.elementRef, interactive = _a.interactive, small = _a.small, striped = _a.striped, htmlProps = tslib_1.__rest(_a, ["bordered", "className", "condensed", "elementRef", "interactive", "small", "striped"]);
        var classes = classnames_1.default(classes_1.HTML_TABLE, (_b = {},
            _b[classes_1.CONDENSED] = condensed,
            _b[classes_1.HTML_TABLE_BORDERED] = bordered,
            _b[classes_1.HTML_TABLE_STRIPED] = striped,
            _b[classes_1.INTERACTIVE] = interactive,
            _b[classes_1.SMALL] = small,
            _b), className);
        // tslint:disable-next-line:blueprint-html-components
        return React.createElement("table", tslib_1.__assign({}, htmlProps, { ref: elementRef, className: classes }));
        var _b;
    };
    return HTMLTable;
}(React.PureComponent));
exports.HTMLTable = HTMLTable;
//# sourceMappingURL=htmlTable.js.map