/// <reference types="react" />
import * as React from "react";
import { ITruncatedFormatProps } from "./truncatedFormat";
export interface IJSONFormatProps extends ITruncatedFormatProps {
    children?: any;
    /**
     * By default, we omit stringifying native JavaScript strings since
     * `JSON.stringify` awkwardly adds double-quotes to the display value.
     * This behavior can be turned off by setting this boolean to `false`.
     * @default true
     */
    omitQuotesOnStrings?: boolean;
    /**
     * Optionally specify the stringify method. Default is `JSON.stringify`
     * with 2-space indentation.
     */
    stringify?: (obj: any) => string;
}
export declare class JSONFormat extends React.Component<IJSONFormatProps, {}> {
    static defaultProps: IJSONFormatProps;
    render(): JSX.Element;
}
