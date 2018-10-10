/// <reference types="react" />
import * as React from "react";
import { HTMLInputProps, IInputGroupProps, IPopoverProps } from "@blueprintjs/core";
import { IListItemsProps } from "../../common";
export interface ISelectProps<T> extends IListItemsProps<T> {
    /**
     * Whether the dropdown list can be filtered.
     * Disabling this option will remove the `InputGroup` and ignore `inputProps`.
     * @default true
     */
    filterable?: boolean;
    /**
     * Whether the component is non-interactive.
     * Note that you'll also need to disable the component's children, if appropriate.
     * @default false
     */
    disabled?: boolean;
    /**
     * Props to spread to the query `InputGroup`. Use `query` and
     * `onQueryChange` instead of `inputProps.value` and `inputProps.onChange`
     * to control this input. Use `inputRef` instead of `ref`.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;
    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
    /**
     * Whether the active item should be reset to the first matching item _when
     * the popover closes_. The query will also be reset to the empty string.
     * @default false
     */
    resetOnClose?: boolean;
}
export interface ISelectState {
    isOpen: boolean;
}
export declare class Select<T> extends React.PureComponent<ISelectProps<T>, ISelectState> {
    static displayName: string;
    static ofType<T>(): new (props: ISelectProps<T>) => Select<T>;
    private TypedQueryList;
    private input?;
    private list?;
    private previousFocusedElement;
    private refHandlers;
    constructor(props: ISelectProps<T>, context?: any);
    render(): JSX.Element;
    componentDidUpdate(_prevProps: ISelectProps<T>, prevState: ISelectState): void;
    private renderQueryList;
    private maybeRenderClearButton(query);
    private handleTargetKeyDown;
    private handleItemSelect;
    private handlePopoverInteraction;
    private handlePopoverOpening;
    private handlePopoverOpened;
    private handlePopoverClosing;
    private resetQuery;
}
