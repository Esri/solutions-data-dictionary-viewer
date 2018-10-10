/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import { ITsTypeAlias } from "documentalist/dist/client";
import * as React from "react";
import { IDocumentationContext } from "../../common/context";
export interface ITypeAliasTableProps extends IProps {
    data: ITsTypeAlias;
}
export declare class TypeAliasTable extends React.PureComponent<ITypeAliasTableProps> {
    static contextTypes: React.ValidationMap<IDocumentationContext>;
    static displayName: string;
    context: IDocumentationContext;
    render(): JSX.Element;
}
