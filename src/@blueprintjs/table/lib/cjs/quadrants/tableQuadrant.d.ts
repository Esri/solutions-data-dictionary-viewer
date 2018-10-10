/// <reference types="react" />
import { AbstractComponent, IProps } from "@blueprintjs/core";
import * as React from "react";
import { Grid } from "../common/grid";
export declare enum QuadrantType {
    /**
     * The main quadrant beneath any frozen rows or columns.
     */
    MAIN = "main",
    /**
     * The top quadrant, containing column headers and frozen rows.
     */
    TOP = "top",
    /**
     * The left quadrant, containing row headers and frozen columns.
     */
    LEFT = "left",
    /**
     * The top-left quadrant, containing the headers and cells common to both
     * the frozen columns and frozen rows.
     */
    TOP_LEFT = "top-left",
}
export interface ITableQuadrantProps extends IProps {
    /**
     * A callback that receives a `ref` to the quadrant's body-wrapping element. Will need to be
     * provided only for the MAIN quadrant, because that quadrant contains the main table body.
     */
    bodyRef?: (ref: HTMLElement | null) => any;
    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;
    /**
     * If `false`, hides the row headers and settings menu.
     * @default true
     */
    enableRowHeader?: boolean;
    /**
     * An optional callback invoked when the quadrant is scrolled via the scrollbar OR the trackpad/mouse wheel.
     * This callback really only makes sense for the MAIN quadrant, because that's the only quadrant whose
     * scrollbar is visible. Other quadrants should simply provide an `onWheel` callback.
     */
    onScroll?: React.EventHandler<React.UIEvent<HTMLDivElement>>;
    /**
     * An optional callback invoked when the quadrant is scrolled via the trackpad/mouse wheel. This
     * callback should be provided for all quadrant types except MAIN, which should provide the more
     * generic `onScroll` callback.
     */
    onWheel?: React.EventHandler<React.WheelEvent<HTMLDivElement>>;
    /**
     * A callback that receives a `ref` to the quadrant's outermost element.
     */
    quadrantRef?: (ref: HTMLElement | null) => any;
    /**
     * The quadrant type. Informs the values of the parameters that will be passed to the
     * `render...` callbacks, assuming an expected stacking order of the four quadrants.
     */
    quadrantType?: QuadrantType;
    /**
     * A callback that renders the table menu (the rectangle in the top-left corner).
     */
    menuRenderer?: () => JSX.Element;
    /**
     * A callback that renders either all of or just the frozen section of the column header.
     */
    columnHeaderCellRenderer?: (showFrozenColumnsOnly?: boolean) => JSX.Element;
    /**
     * A callback that renders either all of or just the frozen section of the row header.
     */
    rowHeaderCellRenderer?: (showFrozenRowsOnly?: boolean) => JSX.Element;
    /**
     * A callback that renders either all of or just frozen sections of the table body.
     */
    bodyRenderer: (quadrantType?: QuadrantType, showFrozenRowsOnly?: boolean, showFrozenColumnsOnly?: boolean) => JSX.Element;
    /**
     * A callback that receives a `ref` to the quadrant's scroll-container element.
     */
    scrollContainerRef?: (ref: HTMLElement | null) => any;
    /**
     * CSS styles to apply to the quadrant's outermost element.
     */
    style?: React.CSSProperties;
}
export declare class TableQuadrant extends AbstractComponent<ITableQuadrantProps, {}> {
    static defaultProps: Partial<ITableQuadrantProps> & object;
    render(): JSX.Element;
    protected validateProps(nextProps: ITableQuadrantProps): void;
    private getQuadrantCssClass();
}
