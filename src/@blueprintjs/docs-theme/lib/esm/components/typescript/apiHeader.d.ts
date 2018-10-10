/// <reference types="react" />
import { ITsDocBase } from "documentalist/dist/client";
import * as React from "react";
import { IDocumentationContext } from "../../common/context";
export declare class ApiHeader extends React.PureComponent<ITsDocBase> {
    static contextTypes: React.ValidationMap<IDocumentationContext>;
    static displayName: string;
    context: IDocumentationContext;
    render(): JSX.Element;
    private renderInheritance();
}
