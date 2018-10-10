/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import { ITsClass, ITsInterface } from "documentalist/dist/client";
import * as React from "react";
import { IDocumentationContext } from "../../common/context";
export declare type Renderer<T> = (props: T) => React.ReactNode;
export interface IInterfaceTableProps extends IProps {
    data: ITsClass | ITsInterface;
    title: string;
}
export declare class InterfaceTable extends React.PureComponent<IInterfaceTableProps> {
    static contextTypes: React.ValidationMap<IDocumentationContext>;
    static displayName: string;
    context: IDocumentationContext;
    render(): JSX.Element;
    private renderPropRow;
    private renderIndexSignature(entry?);
    private renderTags(entry);
}
