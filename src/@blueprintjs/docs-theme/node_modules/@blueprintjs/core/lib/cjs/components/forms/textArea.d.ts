/// <reference types="react" />
import * as React from "react";
import { IIntentProps, IProps } from "../../common/props";
export interface ITextAreaProps extends IIntentProps, IProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /**
     * Whether the text area should take up the full width of its container.
     */
    fill?: boolean;
    /**
     * Whether the text area should appear with large styling.
     */
    large?: boolean;
    /**
     * Whether the text area should appear with small styling.
     */
    small?: boolean;
    /**
     * Ref handler that receives HTML `<textarea>` element backing this component.
     */
    inputRef?: (ref: HTMLTextAreaElement | null) => any;
}
export declare class TextArea extends React.PureComponent<ITextAreaProps, {}> {
    static displayName: string;
    render(): JSX.Element;
}
