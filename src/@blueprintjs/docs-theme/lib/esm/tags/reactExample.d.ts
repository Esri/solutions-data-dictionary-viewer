/// <reference types="react" />
import { ITag } from "documentalist/dist/client";
import * as React from "react";
import { IExampleProps } from "../components/example";
export interface IExample {
    sourceUrl: string;
    render: (props: IExampleProps) => JSX.Element | undefined;
}
export interface IExampleMap {
    [componentName: string]: IExample;
}
export declare class ReactExampleTagRenderer {
    private examples;
    constructor(examples: IExampleMap);
    /**
     * Given the name of an example component, like `"AlertExample"`, attempts to resolve
     * it to an actual example component exported by one of the packages. Also returns
     * the URL of the source code on GitHub.
     */
    render: React.SFC<ITag>;
}
