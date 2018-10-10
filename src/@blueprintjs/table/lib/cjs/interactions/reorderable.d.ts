/// <reference types="react" />
import * as React from "react";
import { IFocusedCellCoordinates } from "../common/cell";
import { IRegion } from "../regions";
import { ICoordinateData } from "./draggable";
export interface IReorderableProps {
    /**
     * A callback that is called while the user is dragging to reorder.
     *
     * @param oldIndex the original index of the element or set of elements
     * @param newIndex the new index of the element or set of elements
     * @param length the number of contiguous elements that were moved
     */
    onReordering: (oldIndex: number, newIndex: number, length: number) => void;
    /**
     * A callback that is called when the user is done dragging to reorder.
     *
     * @param oldIndex the original index of the element or set of elements
     * @param newIndex the new index of the element or set of elements
     * @param length the number of contiguous elements that were moved
     */
    onReordered: (oldIndex: number, newIndex: number, length: number) => void;
    /**
     * When the user reorders something, this callback is called with a new
     * array of `Region`s. This array should be considered the new selection
     * state for the entire table.
     */
    onSelection: (regions: IRegion[]) => void;
    /**
     * When the user reorders something, this callback is called with the new
     * focus cell for the newly selected set of regions.
     */
    onFocusedCell: (focusedCell: IFocusedCellCoordinates) => void;
    /**
     * An array containing the table's selection Regions.
     * @default []
     */
    selectedRegions?: IRegion[];
}
export interface IDragReorderable extends IReorderableProps {
    /**
     * Whether the reordering behavior is disabled.
     * @default false
     */
    disabled?: boolean | ((event: MouseEvent) => boolean);
    /**
     * A callback that determines a `Region` for the single `MouseEvent`. If
     * no valid region can be found, `null` may be returned.
     */
    locateClick: (event: MouseEvent) => IRegion;
    /**
     * A callback that determines the index at which to show the preview guide.
     * This is equivalent to the absolute index in the old ordering where the
     * reordered element will move.
     */
    locateDrag: (event: MouseEvent, coords: ICoordinateData) => number;
    /**
     * A callback that converts the provided index into a region. The returned
     * region will be used to update the current selection after drag-reordering.
     */
    toRegion: (index1: number, index2?: number) => IRegion;
}
export declare class DragReorderable extends React.PureComponent<IDragReorderable, {}> {
    static defaultProps: Partial<IDragReorderable>;
    private selectedRegionStartIndex;
    private selectedRegionLength;
    render(): JSX.Element;
    private getDraggableProps();
    private handleActivate;
    private handleDragMove;
    private handleDragEnd;
    private shouldIgnoreMouseDown(event);
    private maybeSelectRegion(region);
}
