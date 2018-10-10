/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import * as React from "react";
import { IHeadingNode, IPageNode } from "documentalist/dist/client";
import { INavMenuItemProps } from "./navMenuItem";
export interface INavMenuProps extends IProps {
    activePageId: string;
    activeSectionId: string;
    level: number;
    onItemClick: (reference: string) => void;
    items: Array<IPageNode | IHeadingNode>;
    renderNavMenuItem?: (props: INavMenuItemProps) => JSX.Element;
}
export declare const NavMenu: React.SFC<INavMenuProps>;
