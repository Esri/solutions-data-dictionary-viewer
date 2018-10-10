/// <reference types="react" />
import * as React from "react";
import { ICellProps } from "./cell";
export interface IEditableCellProps extends ICellProps {
    /**
     * Whether the given cell is the current active/focused cell.
     */
    isFocused?: boolean;
    /**
     * The value displayed in the text box. Be sure to update this value when
     * rendering this component after a confirmed change.
     */
    value?: string;
    /**
     * A listener that is triggered if the user cancels the edit. This is
     * important to listen to if you are doing anything with `onChange` events,
     * since you'll likely want to revert whatever changes you made. The
     * callback will also receive the row index and column index if they were
     * originally provided via props.
     */
    onCancel?: (value: string, rowIndex?: number, columnIndex?: number) => void;
    /**
     * A listener that is triggered as soon as the editable name is modified.
     * This can be due, for example, to keyboard input or the clipboard. The
     * callback will also receive the row index and column index if they were
     * originally provided via props.
     */
    onChange?: (value: string, rowIndex?: number, columnIndex?: number) => void;
    /**
     * A listener that is triggered once the editing is confirmed. This is
     * usually due to the <code>return</code> (or <code>enter</code>) key press.
     * The callback will also receive the row index and column index if they
     * were originally provided via props.
     */
    onConfirm?: (value: string, rowIndex?: number, columnIndex?: number) => void;
}
export interface IEditableCellState {
    isEditing?: boolean;
    savedValue?: string;
    dirtyValue?: string;
}
export declare class EditableCell extends React.Component<IEditableCellProps, IEditableCellState> {
    static defaultProps: {
        truncated: boolean;
        wrapText: boolean;
    };
    private cellRef;
    private refHandlers;
    constructor(props: IEditableCellProps, context?: any);
    componentDidMount(): void;
    componentDidUpdate(): void;
    shouldComponentUpdate(nextProps: IEditableCellProps, nextState: IEditableCellState): boolean;
    componentWillReceiveProps(nextProps: IEditableCellProps): void;
    render(): JSX.Element;
    renderHotkeys(): JSX.Element;
    private checkShouldFocus();
    private handleKeyPress;
    private handleEdit;
    private handleCancel;
    private handleChange;
    private handleConfirm;
    private invokeCallback(callback, value);
    private handleCellActivate;
    private handleCellDoubleClick;
}
