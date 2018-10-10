/// <reference types="react" />
import * as React from "react";
import { IPopoverProps, ITagInputProps } from "@blueprintjs/core";
import { IListItemsProps } from "../../common";
export interface IMultiSelectProps<T> extends IListItemsProps<T> {
    /** Controlled selected values. */
    selectedItems?: T[];
    /**
     * Whether the popover opens on key down or when `TagInput` is focused.
     * @default false
     */
    openOnKeyDown?: boolean;
    /**
     * Input placeholder text. Shorthand for `tagInputProps.placeholder`.
     * @default "Search..."
     */
    placeholder?: string;
    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
    /** Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input. */
    tagInputProps?: Partial<ITagInputProps> & object;
    /** Custom renderer to transform an item into tag content. */
    tagRenderer: (item: T) => React.ReactNode;
}
export interface IMultiSelectState {
    isOpen: boolean;
}
export declare class MultiSelect<T> extends React.PureComponent<IMultiSelectProps<T>, IMultiSelectState> {
    static displayName: string;
    static defaultProps: {
        placeholder: string;
    };
    static ofType<T>(): new (props: IMultiSelectProps<T>) => MultiSelect<T>;
    state: IMultiSelectState;
    private TypedQueryList;
    private input?;
    private queryList?;
    private refHandlers;
    render(): JSX.Element;
    private renderQueryList;
    private handleItemSelect;
    private handleQueryChange;
    private handlePopoverInteraction;
    private handlePopoverOpened;
    private getTargetKeyDownHandler;
}
