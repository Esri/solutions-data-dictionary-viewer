/// <reference types="react" />
import * as React from "react";
export declare type AnyRect = Rect | ClientRect;
/**
 * A simple object for storing the client bounds of HTMLElements. Since
 * ClientRects are immutable, this object enables editing and some simple
 * manipulation methods.
 */
export declare class Rect {
    left: number;
    top: number;
    width: number;
    height: number;
    static ORIGIN: Rect;
    /**
     * Returns the smallest Rect that entirely contains the supplied rects
     */
    static union(anyRect0: AnyRect, anyRect1: AnyRect): Rect;
    /**
     * Returns a new Rect that subtracts the origin of the second argument
     * from the first.
     */
    static subtractOrigin(anyRect0: AnyRect, anyRect1: AnyRect): Rect;
    /**
     * Returns the CSS properties representing the absolute positioning of
     * this Rect.
     */
    static style(rect: AnyRect): React.CSSProperties;
    /**
     * Given a ClientRect or Rect object, returns a Rect object.
     */
    static wrap(rect: AnyRect): Rect;
    constructor(left: number, top: number, width: number, height: number);
    subtractOrigin(anyRect: AnyRect): Rect;
    union(anyRect: AnyRect): Rect;
    style(): React.CSSProperties;
    sizeStyle(): React.CSSProperties;
    containsX(clientX: number): boolean;
    containsY(clientY: number): boolean;
    equals(rect: Rect): boolean;
}
