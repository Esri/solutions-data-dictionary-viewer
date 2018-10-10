/// <reference types="react" />
import { IIntentProps, IProps } from "@blueprintjs/core";
import * as React from "react";
export interface IEditableNameProps extends IIntentProps, IProps {
    /**
     * The name displayed in the text box. Be sure to update this value when
     * rendering this component after a confirmed change.
     */
    name?: string;
    /**
     * A listener that is triggered if the user cancels the edit. This is
     * important to listen to if you are doing anything with `onChange` events,
     * since you'll likely want to revert whatever changes you made.
     */
    onCancel?: (value: string) => void;
    /**
     * A listener that is triggered as soon as the editable name is modified.
     * This can be due, for example, to keyboard input or the clipboard.
     */
    onChange?: (value: string) => void;
    /**
     * A listener that is triggered once the editing is confirmed. This is
     * usually due to the `return` (or `enter`) key press.
     */
    onConfirm?: (value: string) => void;
    /**
     * The index of the name in the header. If provided, this will be passed as an argument to any
     * callbacks when they are invoked.
     */
    index?: number;
}
export interface IEditableNameState {
    isEditing?: boolean;
    savedName?: string;
    dirtyName?: string;
}
export declare class EditableName extends React.PureComponent<IEditableNameProps, IEditableNameState> {
    constructor(props: IEditableNameProps, context?: any);
    componentWillReceiveProps(nextProps: IEditableNameProps): void;
    render(): JSX.Element;
    private handleEdit;
    private handleCancel;
    private handleChange;
    private handleConfirm;
    private invokeCallback(callback, value);
}
