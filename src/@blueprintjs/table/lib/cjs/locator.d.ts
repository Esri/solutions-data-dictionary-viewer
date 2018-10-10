import { Grid } from "./common/grid";
import { Rect } from "./common/rect";
export interface ILocator {
    /**
     * Returns the width that a column must be to contain all the content of
     * its cells without truncating or wrapping.
     */
    getWidestVisibleCellInColumn: (columnIndex: number) => number;
    /**
     * Returns the height of the tallest cell in a given column -- specifically,
     * tallest as in how tall the cell would have to be to display all the content in it
     */
    getTallestVisibleCellInColumn: (columnIndex: number) => number;
    /**
     * Locates a column's index given the client X coordinate. Returns -1 if
     * the coordinate is not over a column.
     * If `useMidpoint` is `true`, returns the index of the column whose left
     * edge is closest, splitting on the midpoint of each column.
     */
    convertPointToColumn: (clientX: number, useMidpoint?: boolean) => number;
    /**
     * Locates a row's index given the client Y coordinate. Returns -1 if
     * the coordinate is not over a row.
     * If `useMidpoint` is `true`, returns the index of the row whose top
     * edge is closest, splitting on the midpoint of each row.
     */
    convertPointToRow: (clientY: number, useMidpoint?: boolean) => number;
    /**
     * Locates a cell's row and column index given the client X
     * coordinate. Returns -1 if the coordinate is not over a table cell.
     */
    convertPointToCell: (clientX: number, clientY: number) => {
        col: number;
        row: number;
    };
}
export declare class Locator implements ILocator {
    private tableElement;
    private scrollContainerElement;
    private cellContainerElement;
    static CELL_HORIZONTAL_PADDING: number;
    private grid;
    private numFrozenRows;
    private numFrozenColumns;
    constructor(tableElement: HTMLElement, scrollContainerElement: HTMLElement, cellContainerElement: HTMLElement);
    setGrid(grid: Grid): this;
    setNumFrozenRows(numFrozenRows: number): this;
    setNumFrozenColumns(numFrozenColumns: number): this;
    getViewportRect(): Rect;
    getWidestVisibleCellInColumn(columnIndex: number): number;
    getTallestVisibleCellInColumn(columnIndex: number): number;
    convertPointToColumn(clientX: number, useMidpoint?: boolean): number;
    convertPointToRow(clientY: number, useMidpoint?: boolean): number;
    convertPointToCell(clientX: number, clientY: number): {
        col: number;
        row: number;
    };
    private getColumnCellSelector(columnIndex);
    private getTableRect();
    private convertCellIndexToClientX;
    private convertCellMidpointToClientX;
    private convertCellIndexToClientY;
    private convertCellMidpointToClientY;
    private toGridX;
    private toGridY;
}
