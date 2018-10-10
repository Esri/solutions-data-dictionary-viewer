/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import * as React from "react";
export interface IContextMenuTargetWrapper extends IProps {
    renderContextMenu: (e: React.MouseEvent<HTMLElement>) => JSX.Element;
    style: React.CSSProperties;
}
/**
 * Since the ContextMenuTarget uses the `onContextMenu` prop instead
 * `element.addEventListener`, the prop can be lost. This wrapper helps us
 * maintain context menu fuctionality when doing fancy React.cloneElement
 * chains.
 */
export declare class ContextMenuTargetWrapper extends React.PureComponent<IContextMenuTargetWrapper, {}> {
    render(): JSX.Element;
    renderContextMenu(e: React.MouseEvent<HTMLElement>): JSX.Element;
}
