/// <reference types="react" />
import { AbstractComponent, IProps } from "@blueprintjs/core";
import * as React from "react";
import { IColumnProps } from "./column";
import { IFocusedCellCoordinates } from "./common/cell";
import { IColumnInteractionBarContextTypes } from "./common/context";
import { Grid, ICellMapper, IColumnIndices, IRowIndices } from "./common/grid";
import { Rect } from "./common/rect";
import { RenderMode } from "./common/renderMode";
import { IColumnWidths } from "./headers/columnHeader";
import { IRowHeaderRenderer, IRowHeights } from "./headers/rowHeader";
import { IContextMenuRenderer } from "./interactions/menus";
import { IIndexedResizeCallback } from "./interactions/resizable";
import { ISelectedRegionTransform } from "./interactions/selectable";
import { Locator } from "./locator";
import { IRegion, IStyledRegionGroup, RegionCardinality, TableLoadingOption } from "./regions";
export interface IResizeRowsByApproximateHeightOptions {
    /**
     * Approximate width (in pixels) of an average character of text.
     */
    getApproximateCharWidth?: number | ICellMapper<number>;
    /**
     * Approximate height (in pixels) of an average line of text.
     */
    getApproximateLineHeight?: number | ICellMapper<number>;
    /**
     * Sum of horizontal paddings (in pixels) from the left __and__ right sides
     * of the cell.
     */
    getCellHorizontalPadding?: number | ICellMapper<number>;
    /**
     * Number of extra lines to add in case the calculation is imperfect.
     */
    getNumBufferLines?: number | ICellMapper<number>;
}
export interface ITableProps extends IProps, IRowHeights, IColumnWidths {
    /**
     * The children of a `Table` component, which must be React elements
     * that use `IColumnProps`.
     */
    children?: React.ReactElement<IColumnProps> | Array<React.ReactElement<IColumnProps>>;
    /**
     * A sparse number array with a length equal to the number of columns. Any
     * non-null value will be used to set the width of the column at the same
     * index. Note that if you want to update these values when the user
     * drag-resizes a column, you may define a callback for `onColumnWidthChanged`.
     */
    columnWidths?: Array<number | null | undefined>;
    /**
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with an array of
     * `IRegion`s. If the mouse click was on a selection, the array will
     * contain all selected regions. Otherwise it will have one `IRegion` that
     * represents the clicked cell.
     */
    bodyContextMenuRenderer?: IContextMenuRenderer;
    /**
     * If `true`, adds an interaction bar on top of all column header cells, and
     * moves interaction triggers into it.
     * @default false
     */
    enableColumnInteractionBar?: boolean;
    /**
     * If `false`, disables reordering of columns.
     * @default false
     */
    enableColumnReordering?: boolean;
    /**
     * If `false`, disables resizing of columns.
     * @default true
     */
    enableColumnResizing?: boolean;
    /**
     * If `true`, there will be a single "focused" cell at all times,
     * which can be used to interact with the table as though it is a
     * spreadsheet. When false, no such cell will exist.
     * @default false
     */
    enableFocusedCell?: boolean;
    /**
     * If `true`, empty space in the table container will be filled with empty
     * cells instead of a blank background.
     * @default false
     */
    enableGhostCells?: boolean;
    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using `ctrl` or `meta` key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     * @default true
     */
    enableMultipleSelection?: boolean;
    /**
     * If `false`, hides the row headers and settings menu.
     * @default true
     */
    enableRowHeader?: boolean;
    /**
     * If `false`, disables reordering of rows.
     * @default false
     */
    enableRowReordering?: boolean;
    /**
     * If `false`, disables resizing of rows.
     * @default false
     */
    enableRowResizing?: boolean;
    /**
     * If defined, will set the focused cell state. This changes
     * the focused cell to controlled mode, meaning you are in charge of
     * setting the focus in response to events in the `onFocusedCell` callback.
     */
    focusedCell?: IFocusedCellCoordinates;
    /**
     * If defined, this callback will be invoked for each cell when the user
     * attempts to copy a selection via `mod+c`. The returned data will be copied
     * to the clipboard and need not match the display value of the `<Cell>`.
     * The data will be invisibly added as `textContent` into the DOM before
     * copying. If not defined, keyboard copying via `mod+c` will be disabled.
     */
    getCellClipboardData?: (row: number, col: number) => any;
    /**
     * A list of `TableLoadingOption`. Set this prop to specify whether to
     * render the loading state for the column header, row header, and body
     * sections of the table.
     */
    loadingOptions?: TableLoadingOption[];
    /**
     * The number of columns to freeze to the left side of the table, counting
     * from the leftmost column.
     * @default 0
     */
    numFrozenColumns?: number;
    /**
     * The number of rows to freeze to the top of the table, counting from the
     * topmost row.
     * @default 0
     */
    numFrozenRows?: number;
    /**
     * The number of rows in the table.
     */
    numRows?: number;
    /**
     * If reordering is enabled, this callback will be invoked when the user finishes
     * drag-reordering one or more columns.
     */
    onColumnsReordered?: (oldIndex: number, newIndex: number, length: number) => void;
    /**
     * If resizing is enabled, this callback will be invoked when the user
     * finishes drag-resizing a column.
     */
    onColumnWidthChanged?: IIndexedResizeCallback;
    /**
     * An optional callback invoked when all cells in view have completely rendered.
     * Will be invoked on initial mount and whenever cells update (e.g., on scroll).
     */
    onCompleteRender?: () => void;
    /**
     * If you want to do something after the copy or if you want to notify the
     * user if a copy fails, you may provide this optional callback.
     *
     * Due to browser limitations, the copy can fail. This usually occurs if
     * the selection is too large, like 20,000+ cells. The copy will also fail
     * if the browser does not support the copy method (see
     * `Clipboard.isCopySupported`).
     */
    onCopy?: (success: boolean) => void;
    /**
     * A callback called when the focus is changed in the table.
     */
    onFocusedCell?: (focusedCell: IFocusedCellCoordinates) => void;
    /**
     * If resizing is enabled, this callback will be invoked when the user
     * finishes drag-resizing a row.
     */
    onRowHeightChanged?: IIndexedResizeCallback;
    /**
     * If reordering is enabled, this callback will be invoked when the user finishes
     * drag-reordering one or more rows.
     */
    onRowsReordered?: (oldIndex: number, newIndex: number, length: number) => void;
    /**
     * A callback called when the selection is changed in the table.
     */
    onSelection?: (selectedRegions: IRegion[]) => void;
    /**
     * A callback called when the visible cell indices change in the table.
     */
    onVisibleCellsChange?: (rowIndices: IRowIndices, columnIndices: IColumnIndices) => void;
    /**
     * Dictates how cells should be rendered. Supported modes are:
     * - `RenderMode.BATCH`: renders cells in batches to improve performance
     * - `RenderMode.BATCH_ON_UPDATE`: renders cells synchronously on mount and
     *   in batches on update
     * - `RenderMode.NONE`: renders cells synchronously all at once
     * @default RenderMode.BATCH_ON_UPDATE
     */
    renderMode?: RenderMode;
    /**
     * Render each row's header cell.
     */
    rowHeaderCellRenderer?: IRowHeaderRenderer;
    /**
     * A sparse number array with a length equal to the number of rows. Any
     * non-null value will be used to set the height of the row at the same
     * index. Note that if you want to update these values when the user
     * drag-resizes a row, you may define a callback for `onRowHeightChanged`.
     */
    rowHeights?: Array<number | null | undefined>;
    /**
     * If defined, will set the selected regions in the cells. If defined, this
     * changes table selection to controlled mode, meaning you in charge of
     * setting the selections in response to events in the `onSelection`
     * callback.
     *
     * Note that the `selectionModes` prop controls which types of events are
     * triggered to the `onSelection` callback, but does not restrict what
     * selection you can pass to the `selectedRegions` prop. Therefore you can,
     * for example, convert cell clicks into row selections.
     */
    selectedRegions?: IRegion[];
    /**
     * An optional transform function that will be applied to the located
     * `Region`.
     *
     * This allows you to, for example, convert cell `Region`s into row
     * `Region`s while maintaining the existing multi-select and meta-click
     * functionality.
     */
    selectedRegionTransform?: ISelectedRegionTransform;
    /**
     * A `SelectionModes` enum value indicating the selection mode. You may
     * equivalently provide an array of `RegionCardinality` enum values for
     * precise configuration.
     *
     * The `SelectionModes` enum values are:
     * - `ALL`
     * - `NONE`
     * - `COLUMNS_AND_CELLS`
     * - `COLUMNS_ONLY`
     * - `ROWS_AND_CELLS`
     * - `ROWS_ONLY`
     *
     * The `RegionCardinality` enum values are:
     * - `FULL_COLUMNS`
     * - `FULL_ROWS`
     * - `FULL_TABLE`
     * - `CELLS`
     *
     * @default SelectionModes.ALL
     */
    selectionModes?: RegionCardinality[];
    /**
     * Styled region groups are rendered as overlays above the table and are
     * marked with their own `className` for custom styling.
     */
    styledRegionGroups?: IStyledRegionGroup[];
}
export interface ITableState {
    /**
     * An array of column widths. These are initialized from the column props
     * and updated when the user drags column header resize handles.
     */
    columnWidths?: number[];
    /**
     * The coordinates of the currently focused table cell
     */
    focusedCell?: IFocusedCellCoordinates;
    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a row is being resized.
     */
    horizontalGuides?: number[];
    /**
     * If `true`, will disable updates that will cause re-renders of children
     * components. This is used, for example, to disable layout updates while
     * the user is dragging a resize handle.
     */
    isLayoutLocked?: boolean;
    /**
     * Whether the user is currently dragging to reorder one or more elements.
     * Can be referenced to toggle the reordering-cursor overlay, which
     * displays a `grabbing` CSS cursor wherever the mouse moves in the table
     * for the duration of the dragging interaction.
     */
    isReordering?: boolean;
    /**
     * The number of frozen columns, clamped to [0, num <Column>s].
     */
    numFrozenColumnsClamped?: number;
    /**
     * The number of frozen rows, clamped to [0, numRows].
     */
    numFrozenRowsClamped?: number;
    /**
     * An array of row heights. These are initialized updated when the user
     * drags row header resize handles.
     */
    rowHeights?: number[];
    /**
     * An array of Regions representing the selections of the table.
     */
    selectedRegions?: IRegion[];
    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a column is being resized.
     */
    verticalGuides?: number[];
    /**
     * The `Rect` bounds of the viewport used to perform virtual viewport
     * performance enhancements.
     */
    viewportRect?: Rect;
}
export declare class Table extends AbstractComponent<ITableProps, ITableState> {
    static defaultProps: ITableProps;
    static childContextTypes: React.ValidationMap<IColumnInteractionBarContextTypes>;
    private static resizeRowsByApproximateHeightDefaults;
    private static SHALLOW_COMPARE_PROP_KEYS_BLACKLIST;
    private static SHALLOW_COMPARE_STATE_KEYS_BLACKLIST;
    private static createColumnIdIndex(children);
    grid: Grid;
    locator: Locator;
    private childrenArray;
    private columnIdToIndex;
    private resizeSensorDetach;
    private refHandlers;
    private cellContainerElement;
    private columnHeaderElement;
    private mainQuadrantElement;
    private quadrantStackInstance;
    private rootTableElement;
    private rowHeaderElement;
    private scrollContainerElement;
    private didUpdateColumnOrRowSizes;
    private didCompletelyMount;
    constructor(props: ITableProps, context?: any);
    /**
     * __Experimental!__ Resizes all rows in the table to the approximate
     * maximum height of wrapped cell content in each row. Works best when each
     * cell contains plain text of a consistent font style (though font style
     * may vary between cells). Since this function uses approximate
     * measurements, results may not be perfect.
     *
     * Approximation parameters can be configured for the entire table or on a
     * per-cell basis. Default values are fine-tuned to work well with default
     * Table font styles.
     */
    resizeRowsByApproximateHeight(getCellText: ICellMapper<string>, options?: IResizeRowsByApproximateHeightOptions): void;
    /**
     * Resize all rows in the table to the height of the tallest visible cell in the specified columns.
     * If no indices are provided, default to using the tallest visible cell from all columns in view.
     */
    resizeRowsByTallestCell(columnIndices?: number | number[]): void;
    /**
     * Scrolls the table to the target region in a fashion appropriate to the target region's
     * cardinality:
     *
     * - CELLS: Scroll the top-left cell in the target region to the top-left corner of the viewport.
     * - FULL_ROWS: Scroll the top-most row in the target region to the top of the viewport.
     * - FULL_COLUMNS: Scroll the left-most column in the target region to the left side of the viewport.
     * - FULL_TABLE: Scroll the top-left cell in the table to the top-left corner of the viewport.
     *
     * If there are active frozen rows and/or columns, the target region will be positioned in the
     * top-left corner of the non-frozen area (unless the target region itself is in the frozen
     * area).
     *
     * If the target region is close to the bottom-right corner of the table, this function will
     * simply scroll the target region as close to the top-left as possible until the bottom-right
     * corner is reached.
     */
    scrollToRegion(region: IRegion): void;
    getChildContext(): IColumnInteractionBarContextTypes;
    shouldComponentUpdate(nextProps: ITableProps, nextState: ITableState): boolean;
    componentWillReceiveProps(nextProps: ITableProps): void;
    render(): JSX.Element;
    renderHotkeys(): JSX.Element;
    /**
     * When the component mounts, the HTML Element refs will be available, so
     * we constructor the Locator, which queries the elements' bounding
     * ClientRects.
     */
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    protected validateProps(props: ITableProps & {
        children: React.ReactNode;
    }): void;
    private maybeRenderCopyHotkey();
    private maybeRenderSelectionResizeHotkeys();
    private maybeRenderFocusHotkeys();
    private maybeRenderSelectAllHotkey();
    private handleSelectionResizeUp;
    private handleSelectionResizeDown;
    private handleSelectionResizeLeft;
    private handleSelectionResizeRight;
    private handleSelectionResize;
    /**
     * Replaces the selected region at the specified array index, with the
     * region provided.
     */
    private updateSelectedRegionAtIndex(region, index);
    private moveFocusCell(primaryAxis, secondaryAxis, isUpOrLeft, newFocusedCell, focusCellRegion);
    private handleCopy;
    private shouldDisableVerticalScroll();
    private shouldDisableHorizontalScroll();
    private renderMenu;
    private handleMenuMouseDown;
    private maybeScrollTableIntoView();
    private selectAll;
    private handleSelectAllHotkey;
    private getColumnProps(columnIndex);
    private columnHeaderCellRenderer;
    private renderColumnHeader;
    private renderRowHeader;
    private bodyCellRenderer;
    private renderBody;
    private isGuidesShowing();
    private isSelectionModeEnabled(selectionMode, selectionModes?);
    private getEnabledSelectionHandler(selectionMode);
    private invalidateGrid();
    private validateGrid();
    /**
     * Renders a `RegionLayer`, applying styles to the regions using the
     * supplied `IRegionStyler`. `RegionLayer` is a `PureRender` component, so
     * the `IRegionStyler` should be a new instance on every render if we
     * intend to redraw the region layer.
     */
    private maybeRenderRegions(getRegionStyle, quadrantType?);
    private handleCompleteRender;
    private handleFocusMoveLeft;
    private handleFocusMoveLeftInternal;
    private handleFocusMoveRight;
    private handleFocusMoveRightInternal;
    private handleFocusMoveUp;
    private handleFocusMoveUpInternal;
    private handleFocusMoveDown;
    private handleFocusMoveDownInternal;
    private styleBodyRegion;
    private styleMenuRegion;
    private styleColumnHeaderRegion;
    private styleRowHeaderRegion;
    private handleColumnWidthChanged;
    private handleRowHeightChanged;
    private handleRootScroll;
    private handleBodyScroll;
    private clearSelection;
    private handleFocusMove;
    private handleFocusMoveInternal;
    private scrollBodyToFocusedCell;
    private syncViewportPosition(nextScrollLeft, nextScrollTop);
    private handleFocus;
    private handleSelection;
    private handleColumnsReordering;
    private handleColumnsReordered;
    private handleRowsReordering;
    private handleRowsReordered;
    private handleLayoutLock;
    private hasLoadingOption;
    private updateLocator();
    private updateViewportRect;
    private invokeOnVisibleCellsChangeCallback(viewportRect);
    private getMaxFrozenColumnIndex;
    private getMaxFrozenRowIndex;
    /**
     * Normalizes RenderMode.BATCH_ON_UPDATE into RenderMode.{BATCH,NONE}. We do
     * this because there are actually multiple updates required before the
     * <Table> is considered fully "mounted," and adding that knowledge to child
     * components would lead to tight coupling. Thus, keep it simple for them.
     */
    private getNormalizedRenderMode();
    private handleColumnResizeGuide;
    private handleRowResizeGuide;
    /**
     * Returns an object with option keys mapped to their resolved values
     * (falling back to default values as necessary).
     */
    private resolveResizeRowsByApproximateHeightOptions(options, rowIndex, columnIndex);
}
