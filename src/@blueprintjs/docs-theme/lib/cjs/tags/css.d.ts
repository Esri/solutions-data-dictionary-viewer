/// <reference types="react" />
import { ITag } from "documentalist/dist/client";
import * as React from "react";
import { IDocumentationContext } from "../common/context";
export interface ICssExampleState {
    modifiers: Set<string>;
}
export declare class CssExample extends React.PureComponent<ITag> {
    static contextTypes: React.ValidationMap<IDocumentationContext>;
    static displayName: string;
    context: IDocumentationContext;
    state: ICssExampleState;
    render(): JSX.Element;
    private getModifierToggleHandler(modifier);
    private renderExample(markup);
    private getModifiers(prefix);
}
