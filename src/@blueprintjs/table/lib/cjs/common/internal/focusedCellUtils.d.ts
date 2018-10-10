import { IRegion } from "../../regions";
import { ICellCoordinates, IFocusedCellCoordinates } from "../cell";
/**
 * Returns the `focusedSelectionIndex` if both the focused cell and that
 * property are defined, or the last index of `selectedRegions` otherwise. If
 * `selectedRegions` is empty, the function always returns `undefined`.
 */
export declare function getFocusedOrLastSelectedIndex(selectedRegions: IRegion[], focusedCell?: IFocusedCellCoordinates): number;
/**
 * Returns the proper focused cell for the given set of initial conditions.
 */
export declare function getInitialFocusedCell(enableFocusedCell: boolean, focusedCellFromProps: IFocusedCellCoordinates, focusedCellFromState: IFocusedCellCoordinates, selectedRegions: IRegion[]): IFocusedCellCoordinates;
/**
 * Returns `true` if the focused cell is located along the top boundary of the
 * provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionTop(region: IRegion, focusedCell: IFocusedCellCoordinates): boolean;
/**
 * Returns `true` if the focused cell is located along the bottom boundary of
 * the provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionBottom(region: IRegion, focusedCell: IFocusedCellCoordinates): boolean;
/**
 * Returns `true` if the focused cell is located along the left boundary of the
 * provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionLeft(region: IRegion, focusedCell: IFocusedCellCoordinates): boolean;
/**
 * Returns `true` if the focused cell is located along the right boundary of the
 * provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionRight(region: IRegion, focusedCell: IFocusedCellCoordinates): boolean;
/**
 * Returns a new cell-coordinates object that includes a focusSelectionIndex property.
 * The returned object will have the proper IFocusedCellCoordinates type.
 */
export declare function toFullCoordinates(cellCoords: ICellCoordinates, focusSelectionIndex?: number): IFocusedCellCoordinates;
/**
 * Expands an existing region to new region based on the current focused cell.
 * The focused cell is an invariant and should not move as a result of this
 * operation. This function is used, for instance, to expand a selected region
 * on shift+click.
 */
export declare function expandFocusedRegion(focusedCell: IFocusedCellCoordinates, newRegion: IRegion): IRegion;
