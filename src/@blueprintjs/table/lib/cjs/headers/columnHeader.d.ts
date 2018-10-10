/// <reference types="react" />
import * as React from "react";
import { IColumnIndices } from "../common/grid";
import { IIndexedResizeCallback } from "../interactions/resizable";
import { IColumnHeaderCellProps } from "./columnHeaderCell";
import { IHeaderProps } from "./header";
export declare type IColumnHeaderRenderer = (columnIndex: number) => React.ReactElement<IColumnHeaderCellProps>;
export interface IColumnWidths {
    minColumnWidth?: number;
    maxColumnWidth?: number;
    defaultColumnWidth?: number;
}
export interface IColumnHeaderProps extends IHeaderProps, IColumnWidths, IColumnIndices {
    /**
     * A IColumnHeaderRenderer that, for each `<Column>`, will delegate to:
     * 1. The `columnHeaderCellRenderer` method from the `<Column>`
     * 2. A `<ColumnHeaderCell>` using the `name` prop from the `<Column>`
     * 3. A `<ColumnHeaderCell>` with a `name` generated from `Utils.toBase26Alpha`
     */
    cellRenderer: IColumnHeaderRenderer;
    /**
     * Ref handler that receives the HTML element that should be measured to
     * indicate the fluid height of the column header.
     */
    measurableElementRef?: (ref: HTMLElement | null) => void;
    /**
     * A callback invoked when user is done resizing the column
     */
    onColumnWidthChanged: IIndexedResizeCallback;
}
export declare class ColumnHeader extends React.Component<IColumnHeaderProps, {}> {
    static defaultProps: {
        isReorderable: boolean;
        isResizable: boolean;
        loading: boolean;
    };
    render(): JSX.Element;
    private wrapCells;
    private convertPointToColumn;
    private getCellExtremaClasses;
    private getColumnWidth;
    private getDragCoordinate;
    private getMouseCoordinate;
    private handleResizeEnd;
    private handleResizeDoubleClick;
    private handleSizeChanged;
    private isCellSelected;
    private isGhostIndex;
    private renderGhostCell;
    private toRegion;
}
