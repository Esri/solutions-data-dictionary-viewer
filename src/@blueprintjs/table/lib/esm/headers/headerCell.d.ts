/// <reference types="react" />
import * as React from "react";
import { IProps } from "@blueprintjs/core";
import { ResizeHandle } from "../interactions/resizeHandle";
export interface IHeaderCellProps extends IProps {
    /**
     * The index of the cell in the header. If provided, this will be passed as an argument to any
     * callbacks when they are invoked.
     */
    index?: number;
    /**
     * If `true`, will apply the active class to the header to indicate it is
     * part of an external operation.
     */
    isActive?: boolean;
    /**
     * If `true`, the row/column `name` will be replaced with a fixed-height skeleton, and the
     * `resizeHandle` will not be rendered. If passing in additional children to this component, you
     * will also want to conditionally apply `Classes.SKELETON` where appropriate.
     * @default false
     */
    loading?: boolean;
    /**
     * The name displayed in the header of the row/column.
     */
    name?: string;
    /**
     * A callback that returns an element, like a `<Menu>`, which is displayed by right-clicking
     * anywhere in the header. The callback will receive the cell index if it was provided via
     * props.
     */
    menuRenderer?: (index?: number) => JSX.Element;
    /**
     * A `ReorderHandle` React component that allows users to drag-reorder the column header.
     */
    reorderHandle?: JSX.Element;
    /**
     * A `ResizeHandle` React component that allows users to drag-resize the header.
     */
    resizeHandle?: ResizeHandle;
    /**
     * CSS styles for the top level element.
     */
    style?: React.CSSProperties;
}
export interface IInternalHeaderCellProps extends IHeaderCellProps {
    /**
     * Specifies if the cell is selected.
     */
    isSelected?: boolean;
}
export interface IHeaderCellState {
    isActive: boolean;
}
export declare class HeaderCell extends React.Component<IInternalHeaderCellProps, IHeaderCellState> {
    state: IHeaderCellState;
    shouldComponentUpdate(nextProps: IHeaderCellProps): boolean;
    renderContextMenu(_event: React.MouseEvent<HTMLElement>): JSX.Element;
    render(): JSX.Element;
}
