/// <reference types="react" />
import * as React from "react";
import { IProps } from "@blueprintjs/core";
import { IListItemsProps } from "../../common";
export interface IQueryListProps<T> extends IListItemsProps<T> {
    /**
     * Callback invoked when user presses a key, after processing `QueryList`'s own key events
     * (up/down to navigate active item). This callback is passed to `renderer` and (along with
     * `onKeyUp`) can be attached to arbitrary content elements to support keyboard selection.
     */
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
    /**
     * Callback invoked when user releases a key, after processing `QueryList`'s own key events
     * (enter to select active item). This callback is passed to `renderer` and (along with
     * `onKeyDown`) can be attached to arbitrary content elements to support keyboard selection.
     */
    onKeyUp?: React.KeyboardEventHandler<HTMLElement>;
    /**
     * Customize rendering of the component.
     * Receives an object with props that should be applied to elements as necessary.
     */
    renderer: (listProps: IQueryListRendererProps<T>) => JSX.Element;
}
/**
 * An object describing how to render a `QueryList`.
 * A `QueryList` `renderer` receives this object as its sole argument.
 */
export interface IQueryListRendererProps<T> extends IQueryListState<T>, IProps {
    /**
     * Selection handler that should be invoked when a new item has been chosen,
     * perhaps because the user clicked it.
     */
    handleItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;
    /**
     * Keyboard handler for up/down arrow keys to shift the active item.
     * Attach this handler to any element that should support this interaction.
     */
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>;
    /**
     * Keyboard handler for enter key to select the active item.
     * Attach this handler to any element that should support this interaction.
     */
    handleKeyUp: React.KeyboardEventHandler<HTMLElement>;
    /**
     * Change handler for query string. Attach this to an input element to allow
     * `QueryList` to control the query.
     */
    handleQueryChange: React.ChangeEventHandler<HTMLInputElement>;
    /** Rendered elements returned from `itemListRenderer` prop. */
    itemList: React.ReactNode;
}
export interface IQueryListState<T> {
    /** The currently focused item (for keyboard interactions). */
    activeItem: T | null;
    /** The original `items` array filtered by `itemListPredicate` or `itemPredicate`. */
    filteredItems: T[];
    /** The current query string. */
    query: string;
}
export declare class QueryList<T> extends React.Component<IQueryListProps<T>, IQueryListState<T>> {
    static displayName: string;
    static defaultProps: {
        resetOnQuery: boolean;
    };
    static ofType<T>(): new (props: IQueryListProps<T>) => QueryList<T>;
    private itemsParentRef?;
    private refHandlers;
    /**
     * Flag indicating that we should check whether selected item is in viewport
     * after rendering, typically because of keyboard change. Set to `true` when
     * manipulating state in a way that may cause active item to scroll away.
     */
    private shouldCheckActiveItemInViewport;
    constructor(props: IQueryListProps<T>, context?: any);
    render(): JSX.Element;
    componentWillReceiveProps(nextProps: IQueryListProps<T>): void;
    componentDidUpdate(prevProps: IQueryListProps<T>): void;
    scrollActiveItemIntoView(): void;
    setQuery(query: string, resetActiveItem?: boolean | undefined): void;
    /** default `itemListRenderer` implementation */
    private renderItemList;
    /** wrapper around `itemRenderer` to inject props */
    private renderItem;
    private getActiveElement();
    private getActiveIndex(items?);
    private getItemsParentPadding();
    private handleItemSelect;
    private handleKeyDown;
    private handleKeyUp;
    private handleQueryChange;
    /**
     * Get the next enabled item, moving in the given direction from the start
     * index. An `undefined` return value means no suitable item was found.
     * @param direction amount to move in each iteration, typically +/-1
     */
    private getNextActiveItem(direction, startIndex?);
    private setActiveItem(activeItem);
}
/**
 * Get the next enabled item, moving in the given direction from the start
 * index. An `undefined` return value means no suitable item was found.
 * @param items the list of items
 * @param isItemDisabled callback to determine if a given item is disabled
 * @param direction amount to move in each iteration, typically +/-1
 * @param startIndex which index to begin moving from
 */
export declare function getFirstEnabledItem<T>(items: T[], itemDisabled?: keyof T | ((item: T, index: number) => boolean), direction?: number, startIndex?: number): T | null;
