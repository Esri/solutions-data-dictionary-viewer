/// <reference types="react" />
import * as React from "react";
import { IFocusedCellCoordinates } from "../common/cell";
import { IRegion } from "../regions";
import { ICoordinateData } from "./draggable";
export declare type ISelectedRegionTransform = (region: IRegion, event: MouseEvent, coords?: ICoordinateData) => IRegion;
export interface ISelectableProps {
    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using `ctrl` or `meta` key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     * @default false
     */
    enableMultipleSelection?: boolean;
    /**
     * The currently focused cell.
     */
    focusedCell?: IFocusedCellCoordinates;
    /**
     * When the user focuses something, this callback is called with new
     * focused cell coordinates. This should be considered the new focused cell
     * state for the entire table.
     */
    onFocusedCell: (focusedCell: IFocusedCellCoordinates) => void;
    /**
     * When the user selects something, this callback is called with a new
     * array of `Region`s. This array should be considered the new selection
     * state for the entire table.
     */
    onSelection: (regions: IRegion[]) => void;
    /**
     * An additional convenience callback invoked when the user releases the
     * mouse from either a click or a drag, indicating that the selection
     * interaction has ended.
     */
    onSelectionEnd?: (regions: IRegion[]) => void;
    /**
     * An array containing the table's selection Regions.
     * @default []
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
}
export interface IDragSelectableProps extends ISelectableProps {
    /**
     * A list of CSS selectors that should _not_ trigger selection when a `mousedown` occurs inside of them.
     */
    ignoredSelectors?: string[];
    /**
     * Whether the selection behavior is disabled.
     * @default false
     */
    disabled?: boolean | ((event: MouseEvent) => boolean);
    /**
     * A callback that determines a `Region` for the single `MouseEvent`. If
     * no valid region can be found, `null` may be returned.
     */
    locateClick: (event: MouseEvent) => IRegion;
    /**
     * A callback that determines a `Region` for the `MouseEvent` and
     * coordinate data representing a drag. If no valid region can be found,
     * `null` may be returned.
     */
    locateDrag: (event: MouseEvent, coords: ICoordinateData, returnEndOnly?: boolean) => IRegion;
}
export declare class DragSelectable extends React.PureComponent<IDragSelectableProps, {}> {
    static defaultProps: Partial<IDragSelectableProps>;
    private didExpandSelectionOnActivate;
    private lastEmittedSelectedRegions;
    render(): JSX.Element;
    private getDraggableProps();
    private handleActivate;
    private handleDragMove;
    private handleDragEnd;
    private handleClick;
    private shouldExpandSelection;
    private shouldAddDisjointSelection;
    private shouldIgnoreMouseDown(event);
    private handleClearSelectionAtIndex;
    private handleClearAllSelectionsNotAtIndex;
    private handleExpandSelection;
    private handleAddDisjointSelection;
    private handleReplaceSelection;
    private maybeInvokeSelectionCallback(nextSelectedRegions);
    private invokeOnFocusCallbackForRegion;
    private finishInteraction;
    /**
     * Expands the last-selected region to the new region, and replaces the
     * last-selected region with the expanded region. If a focused cell is provided,
     * the focused cell will serve as an anchor for the expansion.
     */
    private expandSelectedRegions(regions, region, focusedCell?);
}
