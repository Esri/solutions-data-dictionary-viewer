/// <reference types="react" />
import * as React from "react";
import { IRowIndices } from "../common/grid";
import { IIndexedResizeCallback } from "../interactions/resizable";
import { IHeaderProps } from "./header";
import { IRowHeaderCellProps } from "./rowHeaderCell";
export declare type IRowHeaderRenderer = (rowIndex: number) => React.ReactElement<IRowHeaderCellProps>;
export interface IRowHeights {
    minRowHeight?: number;
    maxRowHeight?: number;
    defaultRowHeight?: number;
}
export interface IRowHeaderProps extends IHeaderProps, IRowHeights, IRowIndices {
    /**
     * A callback invoked when user is done resizing the column
     */
    onRowHeightChanged: IIndexedResizeCallback;
    /**
     * Renders the cell for each row header
     */
    rowHeaderCellRenderer?: IRowHeaderRenderer;
}
export declare class RowHeader extends React.Component<IRowHeaderProps, {}> {
    static defaultProps: {
        rowHeaderCellRenderer: typeof renderDefaultRowHeader;
    };
    render(): JSX.Element;
    private wrapCells;
    private convertPointToRow;
    private getCellExtremaClasses;
    private getRowHeight;
    private getDragCoordinate;
    private getMouseCoordinate;
    private handleResizeEnd;
    private handleSizeChanged;
    private isCellSelected;
    private isGhostIndex;
    private renderGhostCell;
    private toRegion;
}
/**
 * A default implementation of `IRowHeaderRenderer` that displays 1-indexed
 * numbers for each row.
 */
export declare function renderDefaultRowHeader(rowIndex: number): JSX.Element;
