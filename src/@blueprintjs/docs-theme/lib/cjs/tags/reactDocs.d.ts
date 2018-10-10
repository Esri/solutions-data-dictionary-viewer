/// <reference types="react" />
import { ITag } from "documentalist/dist/client";
import * as React from "react";
export interface IDocsMap {
    [name: string]: React.ComponentClass<{}>;
}
export declare class ReactDocsTagRenderer {
    private docs;
    constructor(docs: IDocsMap);
    /**
     * Given the name of a component, like `"ColorSchemes"`, attempts to resolve
     * it to an actual component class in the given map, or in the default map which contains
     * valid docs components from this package. Provide a custom map to inject your own components.
     */
    render: React.SFC<ITag>;
}
