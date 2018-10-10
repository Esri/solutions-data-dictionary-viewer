/// <reference types="react" />
import { IHeadingNode, IPageNode } from "documentalist/dist/client";
import * as React from "react";
export interface INavigatorProps {
    /** Whether navigator is open. */
    isOpen: boolean;
    /** All potentially navigable items. */
    items: Array<IPageNode | IHeadingNode>;
    /** Callback to determine if a given item should be excluded. */
    itemExclude?: (node: IPageNode | IHeadingNode) => boolean;
    /**
     * Callback invoked when the navigator is closed. Navigation is performed by
     * updating browser `location` directly.
     */
    onClose: () => void;
}
export interface INavigationSection {
    filterKey: string;
    path: string[];
    route: string;
    title: string;
}
export declare class Navigator extends React.PureComponent<INavigatorProps> {
    private sections;
    componentDidMount(): void;
    render(): JSX.Element;
    private filterMatches;
    private renderItem;
    private handleItemSelect;
}
