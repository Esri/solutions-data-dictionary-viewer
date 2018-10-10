/// <reference types="react" />
import * as React from "react";
import { HTMLInputProps, IInputGroupProps, IPopoverProps } from "@blueprintjs/core";
import { IListItemsProps } from "../../common";
export interface ISuggestProps<T> extends IListItemsProps<T> {
    /**
     * Whether the popover should close after selecting an item.
     * @default true
     */
    closeOnSelect?: boolean;
    /**
     * Props to spread to `InputGroup`. All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Suggest`'s own behavior.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;
    /** Custom renderer to transform an item into a string for the input value. */
    inputValueRenderer: (item: T) => string;
    /**
     * The uncontrolled default selected item.
     * This prop is ignored if `selectedItem` is used to control the state.
     */
    defaultSelectedItem?: T;
    /**
     * The currently selected item, or `null` to indicate that no item is selected.
     * If omitted, this prop will be uncontrolled (managed by the component's state).
     * Use `onItemSelect` to listen for updates.
     */
    selectedItem?: T | null;
    /**
     * Whether the popover opens on key down or when the input is focused.
     * @default false
     */
    openOnKeyDown?: boolean;
    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
}
export interface ISuggestState<T> {
    isOpen: boolean;
    selectedItem: T | null;
}
export declare class Suggest<T> extends React.PureComponent<ISuggestProps<T>, ISuggestState<T>> {
    static displayName: string;
    static defaultProps: {
        closeOnSelect: boolean;
        openOnKeyDown: boolean;
    };
    static ofType<T>(): new (props: ISuggestProps<T>) => Suggest<T>;
    private TypedQueryList;
    private input?;
    private queryList?;
    private refHandlers;
    constructor(props: ISuggestProps<T>, context?: any);
    render(): JSX.Element;
    componentWillReceiveProps(nextProps: ISuggestProps<T>): void;
    componentDidUpdate(_prevProps: ISuggestProps<T>, prevState: ISuggestState<T>): void;
    private renderQueryList;
    private selectText;
    private handleInputFocus;
    private handleItemSelect;
    private getInitialSelectedItem();
    private handlePopoverInteraction;
    private handlePopoverOpened;
    private getTargetKeyDownHandler;
    private getTargetKeyUpHandler;
}
