/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import * as React from "react";
import { IDocumentationContext } from "../../common/context";
export interface IApiLinkProps extends IProps {
    children?: never;
    name: string;
}
/**
 * Renders a link to open a symbol in the API Browser.
 */
export declare class ApiLink extends React.PureComponent<IApiLinkProps> {
    static contextTypes: React.ValidationMap<IDocumentationContext>;
    context: IDocumentationContext;
    render(): JSX.Element;
    private handleClick;
}
