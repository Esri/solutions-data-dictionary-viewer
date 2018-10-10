/// <reference types="react" />
import * as React from "react";
import { AbstractPureComponent, IconName, IProps } from "@blueprintjs/core";
import { IColumnInteractionBarContextTypes } from "../common/context";
import { IHeaderCellProps } from "./headerCell";
export interface IColumnNameProps {
    /**
     * The name displayed in the header of the column.
     */
    name?: string;
    /**
     * A callback to override the default name rendering behavior. The default
     * behavior is to simply use the `ColumnHeaderCell`s name prop.
     *
     * This render callback can be used, for example, to provide a
     * `EditableName` component for editing column names.
     *
     * If you define this callback, we recommend you also set
     * `<Table enableColumnInteractionBar={true}>` to avoid issues with menus or selection.
     *
     * The callback will also receive the column index if an `index` was originally
     * provided via props.
     */
    nameRenderer?: (name: string, index?: number) => React.ReactElement<IProps>;
}
export interface IColumnHeaderCellProps extends IHeaderCellProps, IColumnNameProps {
    /**
     * Specifies if the column is reorderable.
     */
    enableColumnReordering?: boolean;
    /**
     * Specifies if the full column is part of a selection.
     */
    isColumnSelected?: boolean;
    /**
     * The icon name or element for the header's menu button.
     * @default "chevron-down"
     */
    menuIcon?: IconName | JSX.Element;
}
export interface IColumnHeaderCellState {
    isActive?: boolean;
}
export declare function HorizontalCellDivider(): JSX.Element;
export declare class ColumnHeaderCell extends AbstractPureComponent<IColumnHeaderCellProps, IColumnHeaderCellState> {
    static defaultProps: IColumnHeaderCellProps;
    static contextTypes: React.ValidationMap<IColumnInteractionBarContextTypes>;
    /**
     * This method determines if a `MouseEvent` was triggered on a target that
     * should be used as the header click/drag target. This enables users of
     * this component to render fully interactive components in their header
     * cells without worry of selection or resize operations from capturing
     * their mouse events.
     */
    static isHeaderMouseTarget(target: HTMLElement): boolean;
    context: IColumnInteractionBarContextTypes;
    state: {
        isActive: boolean;
    };
    render(): JSX.Element;
    private renderName();
    private maybeRenderContent();
    private maybeRenderDropdownMenu();
    private handlePopoverOpened;
    private handlePopoverClosing;
}
