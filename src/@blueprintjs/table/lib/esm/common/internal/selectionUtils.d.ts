import { IRegion } from "../../regions";
import { IFocusedCellCoordinates } from "../cell";
import { Direction } from "../direction";
/**
 * Resizes the provided region by 1 row/column in the specified direction,
 * returning a new region instance. The region may either expand *or* contract
 * depending on the presence and location of the focused cell.
 *
 * If no focused cell is provided, the region will always be *expanded* in the
 * specified direction.
 *
 * If a focused cell *is* provided, the behavior will change depending on where
 * the focused cell is within the region:
 *
 *   1. If along a top/bottom boundary while resizing UP/DOWN, the resize will
 *      expand from or shrink to the focused cell (same if along a left/right
 *      boundary while moving LEFT/RIGHT).
 *   2. If *not* along a top/bottom boundary while resizing UP/DOWN (or if *not*
 *      along a left/right boundary while moving LEFT/RIGHT), the region will
 *      simply expand in the specified direction.
 *
 * Other notes:
 * - A CELLS region can be resized vertically or horizontally.
 * - A FULL_ROWS region can be resized only vertically.
 * - A FULL_COLUMNS region can be resized only horizontally.
 * - A FULL_TABLE region cannot be resized.
 *
 * This function does not clamp the indices of the returned region; that is the
 * responsibility of the caller.
 */
export declare function resizeRegion(region: IRegion, direction: Direction, focusedCell?: IFocusedCellCoordinates): IRegion;
