/// <reference types="react" />
import * as React from "react";
export interface ILoadableContentProps {
    /**
     * If true, render a skeleton. Otherwise render the single, non-string child passed to this
     * component.
     */
    loading: boolean;
    /**
     * If true, show a skeleton of random width (25-75% cell width) when rendering the loading state.
     * @default false
     */
    variableLength?: boolean;
}
export declare class LoadableContent extends React.PureComponent<ILoadableContentProps, {}> {
    private style;
    constructor(props: ILoadableContentProps);
    componentWillReceiveProps(nextProps: ILoadableContentProps): void;
    render(): React.ReactElement<any>;
    private calculateStyle(variableLength);
}
