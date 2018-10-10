/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import * as React from "react";
import { QuadrantType } from "../quadrants/tableQuadrant";
import { IRegion } from "../regions";
export declare type IRegionStyler = (region: IRegion, quadrantType?: QuadrantType) => React.CSSProperties;
export interface IRegionLayerProps extends IProps {
    /**
     * The array of regions to render.
     */
    regions?: IRegion[];
    /**
     * The array of CSS styles to apply to each region. The ith style object in this array will be
     * applied to the ith region in `regions`.
     */
    regionStyles?: React.CSSProperties[];
}
export declare class RegionLayer extends React.Component<IRegionLayerProps, {}> {
    shouldComponentUpdate(nextProps: IRegionLayerProps): boolean;
    render(): JSX.Element;
    private renderRegionChildren();
    private renderRegion;
}
