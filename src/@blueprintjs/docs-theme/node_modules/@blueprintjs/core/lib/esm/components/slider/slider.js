/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import * as React from "react";
import { AbstractPureComponent } from "../../common/abstractPureComponent";
import { Intent } from "../../common/intent";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { MultiSlider } from "./multiSlider";
var Slider = /** @class */ (function (_super) {
    tslib_1.__extends(Slider, _super);
    function Slider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slider.prototype.render = function () {
        var _a = this.props, initialValue = _a.initialValue, value = _a.value, onChange = _a.onChange, onRelease = _a.onRelease, props = tslib_1.__rest(_a, ["initialValue", "value", "onChange", "onRelease"]);
        return (React.createElement(MultiSlider, tslib_1.__assign({}, props),
            React.createElement(MultiSlider.Handle, { value: value, intentAfter: value < initialValue ? Intent.PRIMARY : undefined, intentBefore: value >= initialValue ? Intent.PRIMARY : undefined, onChange: onChange, onRelease: onRelease }),
            React.createElement(MultiSlider.Handle, { value: initialValue, interactionKind: "none" })));
    };
    Slider.defaultProps = tslib_1.__assign({}, MultiSlider.defaultSliderProps, { initialValue: 0, value: 0 });
    Slider.displayName = DISPLAYNAME_PREFIX + ".Slider";
    return Slider;
}(AbstractPureComponent));
export { Slider };
//# sourceMappingURL=slider.js.map