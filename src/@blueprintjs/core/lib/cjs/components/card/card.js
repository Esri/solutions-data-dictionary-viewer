"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var Classes = tslib_1.__importStar(require("../../common/classes"));
var elevation_1 = require("../../common/elevation");
var props_1 = require("../../common/props");
var Card = /** @class */ (function (_super) {
    tslib_1.__extends(Card, _super);
    function Card() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Card.prototype.render = function () {
        var _a = this.props, className = _a.className, elevation = _a.elevation, interactive = _a.interactive, htmlProps = tslib_1.__rest(_a, ["className", "elevation", "interactive"]);
        var classes = classnames_1.default(Classes.CARD, (_b = {}, _b[Classes.INTERACTIVE] = interactive, _b), Classes.elevationClass(elevation), className);
        return React.createElement("div", tslib_1.__assign({ className: classes }, htmlProps));
        var _b;
    };
    Card.displayName = props_1.DISPLAYNAME_PREFIX + ".Card";
    Card.defaultProps = {
        elevation: elevation_1.Elevation.ZERO,
        interactive: false,
    };
    return Card;
}(React.PureComponent));
exports.Card = Card;
//# sourceMappingURL=card.js.map