/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { clamp } from "../../common/utils";
var ProgressBar = /** @class */ (function (_super) {
    tslib_1.__extends(ProgressBar, _super);
    function ProgressBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressBar.prototype.render = function () {
        var _a = this.props, _b = _a.animate, animate = _b === void 0 ? true : _b, className = _a.className, intent = _a.intent, _c = _a.stripes, stripes = _c === void 0 ? true : _c, value = _a.value;
        var classes = classNames(Classes.PROGRESS_BAR, Classes.intentClass(intent), (_d = {}, _d[Classes.PROGRESS_NO_ANIMATION] = !animate, _d[Classes.PROGRESS_NO_STRIPES] = !stripes, _d), className);
        // don't set width if value is null (rely on default CSS value)
        var width = value == null ? null : 100 * clamp(value, 0, 1) + "%";
        return (React.createElement("div", { className: classes },
            React.createElement("div", { className: Classes.PROGRESS_METER, style: { width: width } })));
        var _d;
    };
    ProgressBar.displayName = DISPLAYNAME_PREFIX + ".ProgressBar";
    return ProgressBar;
}(React.PureComponent));
export { ProgressBar };
//# sourceMappingURL=progressBar.js.map