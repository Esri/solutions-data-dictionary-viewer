import { Placement } from "popper.js";
import { Position } from "../../common/position";
/**
 * Convert a position to a placement.
 * @param position the position to convert
 */
export declare function positionToPlacement(position: Position | "auto" | "auto-start" | "auto-end"): Placement;
