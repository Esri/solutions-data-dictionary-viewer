/// <reference types="react" />
import { AbstractPureComponent, IProps } from "@blueprintjs/core";
import { IHeaderCellProps } from "./headerCell";
export interface IRowHeaderCellProps extends IHeaderCellProps, IProps {
    /**
     * Specifies if the row is reorderable.
     */
    enableRowReordering?: boolean;
    /**
     * Specifies whether the full row is part of a selection.
     */
    isRowSelected?: boolean;
}
export declare class RowHeaderCell extends AbstractPureComponent<IRowHeaderCellProps, {}> {
    render(): JSX.Element;
}
