/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import { ITsEnum } from "documentalist/dist/client";
import * as React from "react";
import { IDocumentationContext } from "../../common/context";
export declare type Renderer<T> = (props: T) => React.ReactNode;
export interface IEnumTableProps extends IProps {
    data: ITsEnum;
}
export declare class EnumTable extends React.PureComponent<IEnumTableProps> {
    static contextTypes: React.ValidationMap<IDocumentationContext>;
    static displayName: string;
    context: IDocumentationContext;
    render(): JSX.Element;
    private renderPropRow;
    private renderTags(entry);
}
