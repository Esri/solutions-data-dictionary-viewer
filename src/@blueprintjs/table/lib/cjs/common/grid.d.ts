/// <reference types="react" />
import { CSSProperties } from "react";
import { IRegion } from "../regions";
import { Rect } from "./rect";
export declare type ICellMapper<T> = (rowIndex: number, columnIndex: number) => T;
export declare type IRowMapper<T> = (rowIndex: number) => T;
export declare type IColumnMapper<T> = (columnIndex: number) => T;
export interface IRowIndices {
    rowIndexStart: number;
    rowIndexEnd: number;
}
export interface IColumnIndices {
    columnIndexStart: number;
    columnIndexEnd: number;
}
/**
 * This class manages the sizes of grid cells using arrays of individual row/column sizes.
 */
export declare class Grid {
    static DEFAULT_BLEED: number;
    static DEFAULT_MAX_COLUMNS: number;
    static DEFAULT_MAX_ROWS: number;
    static DEFAULT_GHOST_HEIGHT: number;
    static DEFAULT_GHOST_WIDTH: number;
    numCols: number;
    numRows: number;
    private bleed;
    private columnWidths;
    private rowHeights;
    private cumulativeColumnWidths;
    private cumulativeRowHeights;
    private ghostHeight;
    private ghostWidth;
    /**
     * This constructor accumulates the heights and widths in `O(n)`, saving
     * time in later calculations.
     *
     * @param bleed - The number of rows/cols that we expand beyond the
     *     viewport (on all sides). This helps avoid displaying an empty
     *     viewport when the user scrolls quickly.
     */
    constructor(rowHeights: number[], columnWidths: number[], bleed?: number, ghostHeight?: number, ghostWidth?: number);
    /**
     * Returns the `Rect` bounds of a cell in scrollpane client space.
     *
     * Scrollpane client coordinate space uses the origin of the scrollpane
     * client (the inside part that you're moving around).
     *
     * For example, let's say you're scrolling around a block of 1000 x 1000
     * cells. Regardless where you've scrolled, the first cell is always at
     * 0,0 in scrollpane client space. the cell to the right of it is always
     * at, e.g., 100,0.
     */
    getCellRect(rowIndex: number, columnIndex: number): Rect;
    /**
     * Returns the `Rect` bounds of a cell in scrollpane client space.
     *
     * If the cell is beyond the bounds of the user-defined table cells, it is
     * considered a "ghost" cell. If a width/height is not defined for that
     * row/column, we use the default width/height.
     */
    getGhostCellRect(rowIndex: number, columnIndex: number): Rect;
    /**
     * Returns the `Rect` with the base coordinate and height of the specified row.
     */
    getRowRect(rowIndex: number): Rect;
    /**
     * Returns the `Rect` with the base coordinate and width of the specified column.
     */
    getColumnRect(columnIndex: number): Rect;
    /**
     * Returns the total width of the entire grid
     */
    getWidth(): number;
    /**
     * Returns the total width of the entire grid
     */
    getHeight(): number;
    /**
     * Returns the `Rect` bounds of entire grid
     */
    getRect(): Rect;
    /**
     * Maps each cell that intersects with the given `Rect` argument. The
     * indices of iteration are extended in both directions by the integer
     * `bleed` class property, then are clamped between 0 and the number of
     * rows/columns.
     *
     * Uses a binary search for each of the 4 edges of the bounds, resulting
     * in a runtime of `O(log(rows) + log(cols))` plus the `O(irows * icols)`
     * iteration of intersecting cells.
     */
    mapCellsInRect<T>(rect: Rect, callback: ICellMapper<T>): T[];
    /**
     * Maps each row that intersects with the given `Rect` argument.
     *
     * See Grid.mapCellsInRect for more details.
     */
    mapRowsInRect<T>(rect: Rect, callback: IRowMapper<T>): T[];
    /**
     * Maps each column that intersects with the given `Rect` argument.
     *
     * See Grid.mapCellsInRect for more details.
     */
    mapColumnsInRect<T>(rect: Rect, callback: IColumnMapper<T>): T[];
    /**
     * Returns the start and end indices of rows that intersect with the given
     * `Rect` argument.
     */
    getRowIndicesInRect(rect: Rect, includeGhostCells?: boolean, limit?: number): IRowIndices;
    /**
     * Returns the start and end indices of columns that intersect with the
     * given `Rect` argument.
     */
    getColumnIndicesInRect(rect: Rect, includeGhostCells?: boolean, limit?: number): IColumnIndices;
    isGhostIndex(rowIndex: number, columnIndex: number): boolean;
    isGhostColumn(columnIndex: number): boolean;
    getExtremaClasses(rowIndex: number, columnIndex: number, rowEnd: number, columnEnd: number): string[];
    getRegionStyle(region: IRegion): CSSProperties;
    getCumulativeWidthBefore: (index: number) => number;
    getCumulativeWidthAt: (index: number) => number;
    getCumulativeHeightBefore: (index: number) => number;
    getCumulativeHeightAt: (index: number) => number;
    private getIndicesInInterval(min, max, count, useEndBleed, lookup);
}
