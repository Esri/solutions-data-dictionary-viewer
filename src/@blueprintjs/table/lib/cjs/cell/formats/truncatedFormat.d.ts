/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import * as React from "react";
export declare enum TruncatedPopoverMode {
    ALWAYS = "always",
    NEVER = "never",
    WHEN_TRUNCATED = "when-truncated",
    WHEN_TRUNCATED_APPROX = "when-truncated-approx",
}
export interface ITrucatedFormateMeasureByApproximateOptions {
    /**
     * Approximate character width (in pixels), used to determine whether to display the popover in approx truncation mode.
     * The default value should work for normal table styles,
     * but should be changed as necessary if the fonts or styles are changed significantly.
     * @default 8
     */
    approximateCharWidth: number;
    /**
     * Approximate line height (in pixels), used to determine whether to display the popover in approx truncation mode.
     * The default value should work for normal table styles, but should be changed if the fonts or styles are changed significantly.
     * @default 18
     */
    approximateLineHeight: number;
    /**
     * Total horizonal cell padding (both sides), used to determine whether to display the popover in approx truncation mode.
     * The default value should work for normal table styles,
     * but should be changed as necessary if the fonts or styles are changed significantly.
     * @default 20
     */
    cellHorizontalPadding: number;
    /**
     * Number of buffer lines desired, used to determine whether to display the popover in approx truncation mode.
     * Buffer lines are extra lines at the bottom of the cell that space is made for, to make sure that the cell text will fit
     * after the math calculates how many lines the text is expected to take.
     * The default value should work for normal table styles,
     * but should be changed as necessary if the fonts or styles are changed significantly.
     * @default 0
     */
    numBufferLines: number;
}
export interface ITruncatedFormatProps extends IProps {
    children?: string;
    /**
     * Should the component keep track of the truncation state of the string content. If true, the
     * value of `truncateLength` is ignored. When combined with a `showPopover` value of
     * `WHEN_TRUNCATED`, popovers will only render when necessary.
     * @default false;
     */
    detectTruncation?: boolean;
    /**
     * Values to use for character width, line height, cell padding, and buffer lines desired, when using approximate truncation.
     * These values are used to guess at the size of the text and determine if the popover should be drawn. They should work well
     * enough for default table styles, but may need to be overridden for more accuracy if the default styles or font size, etc
     * are changed.
     */
    measureByApproxOptions?: ITrucatedFormateMeasureByApproximateOptions;
    /**
     * Height of the parent cell. Used by shouldComponentUpdate only
     */
    parentCellHeight?: number;
    /**
     * Width of the parent cell. Used by shouldComponentUpdate only
     */
    parentCellWidth?: number;
    /**
     * Sets the popover content style to `white-space: pre` if `true` or
     * `white-space: normal` if `false`.
     * @default false
     */
    preformatted?: boolean;
    /**
     * Configures when the popover is shown with the `TruncatedPopoverMode` enum.
     *
     * The enum values are:
     * - `ALWAYS`: show the popover.
     * - `NEVER`: don't show the popover.
     * - `WHEN_TRUNCATED`: show the popover only when the text is truncated (default).
     * - `WHEN_TRUNCATED_APPROX`: show the popover only when the text is trunctated, but use
     *   a formula to calculate this based on text length, which is faster but less accurate.
     * @default WHEN_TRUNCATED
     */
    showPopover?: TruncatedPopoverMode;
    /**
     * Number of characters that are displayed before being truncated and appended with the
     * `truncationSuffix` prop. A value of 0 will disable truncation. This prop is ignored if
     * `detectTruncation` is `true`.
     * @default 2000
     */
    truncateLength?: number;
    /**
     * The string that is appended to the display string if it is truncated.
     * @default "..."
     */
    truncationSuffix?: string;
}
export interface ITruncatedFormatState {
    isTruncated?: boolean;
    isPopoverOpen?: boolean;
}
export declare class TruncatedFormat extends React.PureComponent<ITruncatedFormatProps, ITruncatedFormatState> {
    static defaultProps: ITruncatedFormatProps;
    state: ITruncatedFormatState;
    private contentDiv;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    private renderPopover();
    private handleContentDivRef;
    private handlePopoverOpen;
    private handlePopoverClose;
    private shouldShowPopover(content);
    private setTruncationState();
}
