import { IRegion } from "../../regions";
/**
 * Returns the scroll{Left,Top} offsets of the provided region based on its
 * cardinality.
 */
export declare function getScrollPositionForRegion(region: IRegion, currScrollLeft: number, currScrollTop: number, getLeftOffset: (columnIndex: number) => number, getTopOffset: (rowIndex: number) => number, numFrozenRows?: number, numFrozenColumns?: number): {
    scrollLeft: number;
    scrollTop: number;
};
/**
 * Returns the thickness of the target scroll bar in pixels.
 * If the target scroll bar is not present, 0 is returned.
 */
export declare function measureScrollBarThickness(element: HTMLElement, direction: "horizontal" | "vertical"): number;
