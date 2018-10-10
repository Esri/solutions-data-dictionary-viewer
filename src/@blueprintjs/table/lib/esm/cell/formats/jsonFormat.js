/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { TruncatedFormat, TruncatedPopoverMode } from "./truncatedFormat";
var JSONFormat = /** @class */ (function (_super) {
    tslib_1.__extends(JSONFormat, _super);
    function JSONFormat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONFormat.prototype.render = function () {
        var _a = this.props, children = _a.children, omitQuotesOnStrings = _a.omitQuotesOnStrings, stringify = _a.stringify;
        var showPopover = this.props.showPopover;
        // always hide popover if value is nully
        var isNully = children == null;
        if (isNully) {
            showPopover = TruncatedPopoverMode.NEVER;
        }
        var className = classNames(this.props.className, (_b = {},
            _b[Classes.TABLE_NULL] = isNully,
            _b));
        var displayValue = "";
        if (omitQuotesOnStrings && typeof children === "string") {
            displayValue = children;
        }
        else {
            displayValue = stringify(children);
        }
        return (React.createElement(TruncatedFormat, tslib_1.__assign({}, this.props, { className: className, showPopover: showPopover }), displayValue));
        var _b;
    };
    JSONFormat.defaultProps = {
        omitQuotesOnStrings: true,
        stringify: function (obj) { return JSON.stringify(obj, null, 2); },
    };
    return JSONFormat;
}(React.Component));
export { JSONFormat };
//# sourceMappingURL=jsonFormat.js.map