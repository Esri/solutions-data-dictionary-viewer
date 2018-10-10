/// <reference types="react" />
import { IconName } from "@blueprintjs/icons";
import { AbstractPureComponent, HTMLInputProps, IIntentProps, IProps, Position } from "../../common";
export interface INumericInputProps extends IIntentProps, IProps {
    /**
     * Whether to allow only floating-point number characters in the field,
     * mimicking the native `input[type="number"]`.
     * @default true
     */
    allowNumericCharactersOnly?: boolean;
    /**
     * The position of the buttons with respect to the input field.
     * @default Position.RIGHT
     */
    buttonPosition?: typeof Position.LEFT | typeof Position.RIGHT | "none";
    /**
     * Whether the value should be clamped to `[min, max]` on blur.
     * The value will be clamped to each bound only if the bound is defined.
     * Note that native `input[type="number"]` controls do *NOT* clamp on blur.
     * @default false
     */
    clampValueOnBlur?: boolean;
    /**
     * Whether the input is non-interactive.
     * @default false
     */
    disabled?: boolean;
    /** Whether the numeric input should take up the full width of its container. */
    fill?: boolean;
    /**
     * Ref handler that receives HTML `<input>` element backing this component.
     */
    inputRef?: (ref: HTMLInputElement | null) => any;
    /**
     * If set to `true`, the input will display with larger styling.
     * This is equivalent to setting `Classes.LARGE` via className on the
     * parent control group and on the child input group.
     * @default false
     */
    large?: boolean;
    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side of input.
     */
    leftIcon?: IconName | JSX.Element;
    /** The placeholder text in the absence of any value. */
    placeholder?: string;
    /**
     * The increment between successive values when <kbd>shift</kbd> is held.
     * Pass explicit `null` value to disable this interaction.
     * @default 10
     */
    majorStepSize?: number | null;
    /** The maximum value of the input. */
    max?: number;
    /** The minimum value of the input. */
    min?: number;
    /**
     * The increment between successive values when <kbd>alt</kbd> is held.
     * Pass explicit `null` value to disable this interaction.
     * @default 0.1
     */
    minorStepSize?: number | null;
    /**
     * Whether the entire text field should be selected on focus.
     * @default false
     */
    selectAllOnFocus?: boolean;
    /**
     * Whether the entire text field should be selected on increment.
     * @default false
     */
    selectAllOnIncrement?: boolean;
    /**
     * The increment between successive values when no modifier keys are held.
     * @default 1
     */
    stepSize?: number;
    /** The value to display in the input field. */
    value?: number | string;
    /** The callback invoked when the value changes due to a button click. */
    onButtonClick?(valueAsNumber: number, valueAsString: string): void;
    /** The callback invoked when the value changes due to typing, arrow keys, or button clicks. */
    onValueChange?(valueAsNumber: number, valueAsString: string): void;
}
export interface INumericInputState {
    isInputGroupFocused?: boolean;
    isButtonGroupFocused?: boolean;
    shouldSelectAfterUpdate?: boolean;
    stepMaxPrecision?: number;
    value?: string;
}
export declare class NumericInput extends AbstractPureComponent<HTMLInputProps & INumericInputProps, INumericInputState> {
    static displayName: string;
    static VALUE_EMPTY: string;
    static VALUE_ZERO: string;
    static defaultProps: INumericInputProps;
    private static DECREMENT_KEY;
    private static INCREMENT_KEY;
    private static DECREMENT_ICON_NAME;
    private static INCREMENT_ICON_NAME;
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
    private static FLOATING_POINT_NUMBER_CHARACTER_REGEX;
    private static CONTINUOUS_CHANGE_DELAY;
    private static CONTINUOUS_CHANGE_INTERVAL;
    private inputElement;
    private didPasteEventJustOccur;
    private shouldSelectAfterUpdate;
    private delta;
    private intervalId;
    constructor(props?: HTMLInputProps & INumericInputProps, context?: any);
    componentWillReceiveProps(nextProps: HTMLInputProps & INumericInputProps): void;
    render(): JSX.Element;
    componentDidUpdate(): void;
    protected validateProps(nextProps: HTMLInputProps & INumericInputProps): void;
    private renderButton(key, iconName, onMouseDown, onKeyDown, onKeyUp);
    private inputRef;
    private handleDecrementButtonClick;
    private handleDecrementButtonMouseDown;
    private handleDecrementButtonKeyDown;
    private handleDecrementButtonKeyUp;
    private handleIncrementButtonClick;
    private handleIncrementButtonMouseDown;
    private handleIncrementButtonKeyDown;
    private handleIncrementButtonKeyUp;
    private handleButtonClick;
    private handleButtonFocus;
    private handleButtonBlur;
    private handleButtonKeyUp;
    private startContinuousChange();
    private stopContinuousChange;
    private handleContinuousChange;
    private handleInputFocus;
    private handleInputBlur;
    private handleInputKeyDown;
    private handleInputKeyPress;
    private handleInputPaste;
    private handleInputChange;
    private invokeValueCallback(value, callback);
    private incrementValue(delta);
    private getIncrementDelta(direction, isShiftKeyPressed, isAltKeyPressed);
    private getSanitizedValue(value, delta?, min?, max?);
    private getValueOrEmptyValue(value);
    private isValueNumeric(value);
    private isKeyboardEventDisabledForBasicNumericEntry(e);
    private isFloatingPointNumericCharacter(character);
    private getStepMaxPrecision(props);
    private toMaxPrecision(value);
    private updateDelta(direction, e);
}
