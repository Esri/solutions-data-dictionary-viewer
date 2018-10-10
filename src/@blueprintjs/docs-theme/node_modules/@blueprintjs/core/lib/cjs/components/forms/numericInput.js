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
var common_1 = require("../../common");
var Errors = tslib_1.__importStar(require("../../common/errors"));
var buttonGroup_1 = require("../button/buttonGroup");
var buttons_1 = require("../button/buttons");
var inputGroup_1 = require("./inputGroup");
var IncrementDirection;
(function (IncrementDirection) {
    IncrementDirection[IncrementDirection["DOWN"] = -1] = "DOWN";
    IncrementDirection[IncrementDirection["UP"] = 1] = "UP";
})(IncrementDirection || (IncrementDirection = {}));
var NumericInput = /** @class */ (function (_super) {
    tslib_1.__extends(NumericInput, _super);
    function NumericInput(props, context) {
        var _this = _super.call(this, props, context) || this;
        // updating these flags need not trigger re-renders, so don't include them in this.state.
        _this.didPasteEventJustOccur = false;
        _this.shouldSelectAfterUpdate = false;
        _this.delta = 0;
        _this.intervalId = null;
        _this.inputRef = function (input) {
            _this.inputElement = input;
            common_1.Utils.safeInvoke(_this.props.inputRef, input);
        };
        // Callbacks - Buttons
        // ===================
        _this.handleDecrementButtonClick = function (e) {
            _this.handleButtonClick(e, IncrementDirection.DOWN);
        };
        _this.handleDecrementButtonMouseDown = function (e) {
            _this.handleButtonClick(e, IncrementDirection.DOWN);
            _this.startContinuousChange();
        };
        _this.handleDecrementButtonKeyDown = function (e) {
            _this.updateDelta(IncrementDirection.DOWN, e);
        };
        _this.handleDecrementButtonKeyUp = function (e) {
            _this.handleButtonKeyUp(e, IncrementDirection.DOWN, _this.handleDecrementButtonClick);
        };
        _this.handleIncrementButtonClick = function (e) {
            _this.handleButtonClick(e, IncrementDirection.UP);
        };
        _this.handleIncrementButtonMouseDown = function (e) {
            _this.handleButtonClick(e, IncrementDirection.UP);
            _this.startContinuousChange();
        };
        _this.handleIncrementButtonKeyDown = function (e) {
            _this.updateDelta(IncrementDirection.UP, e);
        };
        _this.handleIncrementButtonKeyUp = function (e) {
            _this.handleButtonKeyUp(e, IncrementDirection.UP, _this.handleIncrementButtonClick);
        };
        _this.handleButtonClick = function (e, direction) {
            var delta = _this.updateDelta(direction, e);
            var nextValue = _this.incrementValue(delta);
            _this.invokeValueCallback(nextValue, _this.props.onButtonClick);
        };
        _this.handleButtonFocus = function () {
            _this.setState({ isButtonGroupFocused: true });
        };
        _this.handleButtonBlur = function () {
            _this.setState({ isButtonGroupFocused: false });
        };
        _this.handleButtonKeyUp = function (e, direction, onClick) {
            _this.updateDelta(direction, e);
            // respond explicitly on key *up*, because onKeyDown triggers multiple
            // times and doesn't always receive modifier-key flags, leading to an
            // unintuitive/out-of-control incrementing experience.
            if (e.keyCode === common_1.Keys.SPACE || e.keyCode === common_1.Keys.ENTER) {
                // prevent the page from scrolling (this is the default browser
                // behavior for shift + space or alt + space).
                e.preventDefault();
                // trigger a click event to update the input value appropriately,
                // based on the active modifier keys.
                var fakeClickEvent = {
                    altKey: e.altKey,
                    currentTarget: e.currentTarget,
                    shiftKey: e.shiftKey,
                    target: e.target,
                };
                onClick(fakeClickEvent);
            }
        };
        _this.stopContinuousChange = function () {
            _this.delta = 0;
            _this.clearTimeouts();
            clearInterval(_this.intervalId);
            document.removeEventListener("mouseup", _this.stopContinuousChange);
        };
        _this.handleContinuousChange = function () {
            var nextValue = _this.incrementValue(_this.delta);
            _this.invokeValueCallback(nextValue, _this.props.onButtonClick);
        };
        // Callbacks - Input
        // =================
        _this.handleInputFocus = function (e) {
            _this.shouldSelectAfterUpdate = _this.props.selectAllOnFocus;
            _this.setState({ isInputGroupFocused: true });
            common_1.Utils.safeInvoke(_this.props.onFocus, e);
        };
        _this.handleInputBlur = function (e) {
            // explicitly set `shouldSelectAfterUpdate` to `false` to prevent focus
            // hoarding on IE11 (#704)
            _this.shouldSelectAfterUpdate = false;
            var baseStateChange = { isInputGroupFocused: false };
            if (_this.props.clampValueOnBlur) {
                var value = e.target.value;
                var sanitizedValue = _this.getSanitizedValue(value);
                _this.setState(tslib_1.__assign({}, baseStateChange, { value: sanitizedValue }));
                if (value !== sanitizedValue) {
                    _this.invokeValueCallback(sanitizedValue, _this.props.onValueChange);
                }
            }
            else {
                _this.setState(baseStateChange);
            }
            common_1.Utils.safeInvoke(_this.props.onBlur, e);
        };
        _this.handleInputKeyDown = function (e) {
            if (_this.props.disabled || _this.props.readOnly) {
                return;
            }
            var keyCode = e.keyCode;
            var direction;
            if (keyCode === common_1.Keys.ARROW_UP) {
                direction = IncrementDirection.UP;
            }
            else if (keyCode === common_1.Keys.ARROW_DOWN) {
                direction = IncrementDirection.DOWN;
            }
            if (direction != null) {
                // when the input field has focus, some key combinations will modify
                // the field's selection range. we'll actually want to select all
                // text in the field after we modify the value on the following
                // lines. preventing the default selection behavior lets us do that
                // without interference.
                e.preventDefault();
                var delta = _this.updateDelta(direction, e);
                _this.incrementValue(delta);
            }
            common_1.Utils.safeInvoke(_this.props.onKeyDown, e);
        };
        _this.handleInputKeyPress = function (e) {
            // we prohibit keystrokes in onKeyPress instead of onKeyDown, because
            // e.key is not trustworthy in onKeyDown in all browsers.
            if (_this.props.allowNumericCharactersOnly && _this.isKeyboardEventDisabledForBasicNumericEntry(e)) {
                e.preventDefault();
            }
            common_1.Utils.safeInvoke(_this.props.onKeyPress, e);
        };
        _this.handleInputPaste = function (e) {
            _this.didPasteEventJustOccur = true;
            common_1.Utils.safeInvoke(_this.props.onPaste, e);
        };
        _this.handleInputChange = function (e) {
            var value = e.target.value;
            var nextValue;
            if (_this.props.allowNumericCharactersOnly && _this.didPasteEventJustOccur) {
                _this.didPasteEventJustOccur = false;
                var valueChars = value.split("");
                var sanitizedValueChars = valueChars.filter(_this.isFloatingPointNumericCharacter);
                var sanitizedValue = sanitizedValueChars.join("");
                nextValue = sanitizedValue;
            }
            else {
                nextValue = value;
            }
            _this.shouldSelectAfterUpdate = false;
            _this.setState({ value: nextValue });
            _this.invokeValueCallback(nextValue, _this.props.onValueChange);
        };
        _this.state = {
            stepMaxPrecision: _this.getStepMaxPrecision(props),
            value: _this.getValueOrEmptyValue(props.value),
        };
        return _this;
    }
    NumericInput.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        var value = this.getValueOrEmptyValue(nextProps.value);
        var didMinChange = nextProps.min !== this.props.min;
        var didMaxChange = nextProps.max !== this.props.max;
        var didBoundsChange = didMinChange || didMaxChange;
        var sanitizedValue = value !== NumericInput.VALUE_EMPTY
            ? this.getSanitizedValue(value, /* delta */ 0, nextProps.min, nextProps.max)
            : NumericInput.VALUE_EMPTY;
        var stepMaxPrecision = this.getStepMaxPrecision(nextProps);
        // if a new min and max were provided that cause the existing value to fall
        // outside of the new bounds, then clamp the value to the new valid range.
        if (didBoundsChange && sanitizedValue !== this.state.value) {
            this.setState({ stepMaxPrecision: stepMaxPrecision, value: sanitizedValue });
            this.invokeValueCallback(sanitizedValue, this.props.onValueChange);
        }
        else {
            this.setState({ stepMaxPrecision: stepMaxPrecision, value: value });
        }
    };
    NumericInput.prototype.render = function () {
        var _a = this.props, buttonPosition = _a.buttonPosition, className = _a.className, fill = _a.fill, large = _a.large;
        var inputGroupHtmlProps = common_1.removeNonHTMLProps(this.props, [
            "allowNumericCharactersOnly",
            "buttonPosition",
            "clampValueOnBlur",
            "className",
            "large",
            "majorStepSize",
            "minorStepSize",
            "onButtonClick",
            "onValueChange",
            "selectAllOnFocus",
            "selectAllOnIncrement",
            "stepSize",
        ], true);
        var inputGroup = (React.createElement(inputGroup_1.InputGroup, tslib_1.__assign({ autoComplete: "off" }, inputGroupHtmlProps, { intent: this.props.intent, inputRef: this.inputRef, key: "input-group", large: large, leftIcon: this.props.leftIcon, onFocus: this.handleInputFocus, onBlur: this.handleInputBlur, onChange: this.handleInputChange, onKeyDown: this.handleInputKeyDown, onKeyPress: this.handleInputKeyPress, onPaste: this.handleInputPaste, value: this.state.value })));
        // the strict null check here is intentional; an undefined value should
        // fall back to the default button position on the right side.
        if (buttonPosition === "none" || buttonPosition === null) {
            // If there are no buttons, then the control group will render the
            // text field with squared border-radii on the left side, causing it
            // to look weird. This problem goes away if we simply don't nest within
            // a control group.
            return React.createElement("div", { className: className }, inputGroup);
        }
        else {
            var incrementButton = this.renderButton(NumericInput.INCREMENT_KEY, NumericInput.INCREMENT_ICON_NAME, this.handleIncrementButtonMouseDown, this.handleIncrementButtonKeyDown, this.handleIncrementButtonKeyUp);
            var decrementButton = this.renderButton(NumericInput.DECREMENT_KEY, NumericInput.DECREMENT_ICON_NAME, this.handleDecrementButtonMouseDown, this.handleDecrementButtonKeyDown, this.handleDecrementButtonKeyUp);
            var buttonGroup = (React.createElement(buttonGroup_1.ButtonGroup, { className: common_1.Classes.FIXED, key: "button-group", vertical: true },
                incrementButton,
                decrementButton));
            var inputElems = buttonPosition === common_1.Position.LEFT ? [buttonGroup, inputGroup] : [inputGroup, buttonGroup];
            var classes = classnames_1.default(common_1.Classes.NUMERIC_INPUT, common_1.Classes.CONTROL_GROUP, (_b = {},
                _b[common_1.Classes.FILL] = fill,
                _b[common_1.Classes.LARGE] = large,
                _b), className);
            return React.createElement("div", { className: classes }, inputElems);
        }
        var _b;
    };
    NumericInput.prototype.componentDidUpdate = function () {
        if (this.shouldSelectAfterUpdate) {
            this.inputElement.setSelectionRange(0, this.state.value.length);
        }
    };
    NumericInput.prototype.validateProps = function (nextProps) {
        var majorStepSize = nextProps.majorStepSize, max = nextProps.max, min = nextProps.min, minorStepSize = nextProps.minorStepSize, stepSize = nextProps.stepSize;
        if (min != null && max != null && min >= max) {
            throw new Error(Errors.NUMERIC_INPUT_MIN_MAX);
        }
        if (stepSize == null) {
            throw new Error(Errors.NUMERIC_INPUT_STEP_SIZE_NULL);
        }
        if (stepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE);
        }
        if (majorStepSize && majorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize > stepSize) {
            throw new Error(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND);
        }
        if (majorStepSize && majorStepSize < stepSize) {
            throw new Error(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND);
        }
    };
    // Render Helpers
    // ==============
    NumericInput.prototype.renderButton = function (key, iconName, onMouseDown, onKeyDown, onKeyUp) {
        return (React.createElement(buttons_1.Button, { disabled: this.props.disabled || this.props.readOnly, icon: iconName, intent: this.props.intent, key: key, onBlur: this.handleButtonBlur, onMouseDown: onMouseDown, onFocus: this.handleButtonFocus, onKeyDown: onKeyDown, onKeyUp: onKeyUp }));
    };
    NumericInput.prototype.startContinuousChange = function () {
        var _this = this;
        // The button's onMouseUp event handler doesn't fire if the user
        // releases outside of the button, so we need to watch all the way
        // from the top.
        document.addEventListener("mouseup", this.stopContinuousChange);
        // Initial delay is slightly longer to prevent the user from
        // accidentally triggering the continuous increment/decrement.
        this.setTimeout(function () {
            _this.intervalId = window.setInterval(_this.handleContinuousChange, NumericInput.CONTINUOUS_CHANGE_INTERVAL);
        }, NumericInput.CONTINUOUS_CHANGE_DELAY);
    };
    NumericInput.prototype.invokeValueCallback = function (value, callback) {
        common_1.Utils.safeInvoke(callback, +value, value);
    };
    // Value Helpers
    // =============
    NumericInput.prototype.incrementValue = function (delta) {
        // pretend we're incrementing from 0 if currValue is empty
        var currValue = this.state.value || NumericInput.VALUE_ZERO;
        var nextValue = this.getSanitizedValue(currValue, delta);
        this.shouldSelectAfterUpdate = this.props.selectAllOnIncrement;
        this.setState({ value: nextValue });
        this.invokeValueCallback(nextValue, this.props.onValueChange);
        return nextValue;
    };
    NumericInput.prototype.getIncrementDelta = function (direction, isShiftKeyPressed, isAltKeyPressed) {
        var _a = this.props, majorStepSize = _a.majorStepSize, minorStepSize = _a.minorStepSize, stepSize = _a.stepSize;
        if (isShiftKeyPressed && majorStepSize != null) {
            return direction * majorStepSize;
        }
        else if (isAltKeyPressed && minorStepSize != null) {
            return direction * minorStepSize;
        }
        else {
            return direction * stepSize;
        }
    };
    NumericInput.prototype.getSanitizedValue = function (value, delta, min, max) {
        if (delta === void 0) { delta = 0; }
        if (min === void 0) { min = this.props.min; }
        if (max === void 0) { max = this.props.max; }
        if (!this.isValueNumeric(value)) {
            return NumericInput.VALUE_EMPTY;
        }
        var nextValue = this.toMaxPrecision(parseFloat(value) + delta);
        // defaultProps won't work if the user passes in null, so just default
        // to +/- infinity here instead, as a catch-all.
        var adjustedMin = min != null ? min : -Infinity;
        var adjustedMax = max != null ? max : Infinity;
        nextValue = common_1.Utils.clamp(nextValue, adjustedMin, adjustedMax);
        return nextValue.toString();
    };
    NumericInput.prototype.getValueOrEmptyValue = function (value) {
        return value != null ? value.toString() : NumericInput.VALUE_EMPTY;
    };
    NumericInput.prototype.isValueNumeric = function (value) {
        // checking if a string is numeric in Typescript is a big pain, because
        // we can't simply toss a string parameter to isFinite. below is the
        // essential approach that jQuery uses, which involves subtracting a
        // parsed numeric value from the string representation of the value. we
        // need to cast the value to the `any` type to allow this operation
        // between dissimilar types.
        return value != null && value - parseFloat(value) + 1 >= 0;
    };
    NumericInput.prototype.isKeyboardEventDisabledForBasicNumericEntry = function (e) {
        // unit tests may not include e.key. don't bother disabling those events.
        if (e.key == null) {
            return false;
        }
        // allow modified key strokes that may involve letters and other
        // non-numeric/invalid characters (Cmd + A, Cmd + C, Cmd + V, Cmd + X).
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return false;
        }
        // keys that print a single character when pressed have a `key` name of
        // length 1. every other key has a longer `key` name (e.g. "Backspace",
        // "ArrowUp", "Shift"). since none of those keys can print a character
        // to the field--and since they may have important native behaviors
        // beyond printing a character--we don't want to disable their effects.
        var isSingleCharKey = e.key.length === 1;
        if (!isSingleCharKey) {
            return false;
        }
        // now we can simply check that the single character that wants to be printed
        // is a floating-point number character that we're allowed to print.
        return !this.isFloatingPointNumericCharacter(e.key);
    };
    NumericInput.prototype.isFloatingPointNumericCharacter = function (character) {
        return NumericInput.FLOATING_POINT_NUMBER_CHARACTER_REGEX.test(character);
    };
    NumericInput.prototype.getStepMaxPrecision = function (props) {
        if (props.minorStepSize != null) {
            return common_1.Utils.countDecimalPlaces(props.minorStepSize);
        }
        else {
            return common_1.Utils.countDecimalPlaces(props.stepSize);
        }
    };
    NumericInput.prototype.toMaxPrecision = function (value) {
        // round the value to have the specified maximum precision (toFixed is the wrong choice,
        // because it would show trailing zeros in the decimal part out to the specified precision)
        // source: http://stackoverflow.com/a/18358056/5199574
        var scaleFactor = Math.pow(10, this.state.stepMaxPrecision);
        return Math.round(value * scaleFactor) / scaleFactor;
    };
    NumericInput.prototype.updateDelta = function (direction, e) {
        this.delta = this.getIncrementDelta(direction, e.shiftKey, e.altKey);
        return this.delta;
    };
    NumericInput.displayName = common_1.DISPLAYNAME_PREFIX + ".NumericInput";
    NumericInput.VALUE_EMPTY = "";
    NumericInput.VALUE_ZERO = "0";
    NumericInput.defaultProps = {
        allowNumericCharactersOnly: true,
        buttonPosition: common_1.Position.RIGHT,
        clampValueOnBlur: false,
        large: false,
        majorStepSize: 10,
        minorStepSize: 0.1,
        selectAllOnFocus: false,
        selectAllOnIncrement: false,
        stepSize: 1,
        value: NumericInput.VALUE_EMPTY,
    };
    NumericInput.DECREMENT_KEY = "decrement";
    NumericInput.INCREMENT_KEY = "increment";
    NumericInput.DECREMENT_ICON_NAME = "chevron-down";
    NumericInput.INCREMENT_ICON_NAME = "chevron-up";
    /**
     * A regex that matches a string of length 1 (i.e. a standalone character)
     * if and only if it is a floating-point number character as defined by W3C:
     * https://www.w3.org/TR/2012/WD-html-markup-20120329/datatypes.html#common.data.float
     *
     * Floating-point number characters are the only characters that can be
     * printed within a default input[type="number"]. This component should
     * behave the same way when this.props.allowNumericCharactersOnly = true.
     * See here for the input[type="number"].value spec:
     * https://www.w3.org/TR/2012/WD-html-markup-20120329/input.number.html#input.number.attrs.value
     */
    NumericInput.FLOATING_POINT_NUMBER_CHARACTER_REGEX = /^[Ee0-9\+\-\.]$/;
    NumericInput.CONTINUOUS_CHANGE_DELAY = 300;
    NumericInput.CONTINUOUS_CHANGE_INTERVAL = 100;
    return NumericInput;
}(common_1.AbstractPureComponent));
exports.NumericInput = NumericInput;
//# sourceMappingURL=numericInput.js.map