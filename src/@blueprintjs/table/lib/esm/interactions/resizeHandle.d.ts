/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import * as React from "react";
export declare enum Orientation {
    HORIZONTAL = 1,
    VERTICAL = 0,
}
export interface ILockableLayout {
    onLayoutLock: (isLayoutLocked?: boolean) => void;
}
export interface IResizeHandleProps extends IProps, ILockableLayout {
    /**
     * A callback that is called while the user is dragging the resize
     * handle.
     *
     * @param offset is the difference between the initial and current coordinates
     * @param delta is the difference between this and the previous offset
     */
    onResizeMove?: (offset: number, delta: number) => void;
    /**
     * A callback that is called when the user is done dragging the resize
     * handle.
     *
     * @param offset is the difference between the initial and final coordinates
     */
    onResizeEnd?: (offset: number) => void;
    /**
     * A callback that is called when the user double clicks the resize handle
     */
    onDoubleClick?: () => void;
    /**
     * An enum value to indicate the orientation of the resize handle.
     */
    orientation: Orientation;
}
export interface IResizeHandleState {
    /**
     * A boolean that is true while the user is dragging the resize handle
     */
    isDragging: boolean;
}
export declare class ResizeHandle extends React.PureComponent<IResizeHandleProps, IResizeHandleState> {
    state: IResizeHandleState;
    render(): JSX.Element;
    private handleActivate;
    private handleDragMove;
    private handleDragEnd;
    private handleClick;
    private handleDoubleClick;
}
