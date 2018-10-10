/// <reference types="react" />
import { IHeadingNode, IPageNode } from "documentalist/dist/client";
import * as React from "react";
export interface INavMenuItemProps {
    /** This element never receives `children`. */
    children?: never;
    /** CSS classes to apply to the root element, for proper appearance in the tree. */
    className: string;
    /** Link URL. */
    href: string;
    /** Whether this item is the active section (currently being viewed) */
    isActive: boolean;
    /** Whether this section is expanded (it or a child is being viewed) */
    isExpanded: boolean;
    /** Click handler for item, to navigate to URL. */
    onClick: () => void;
    /** The section for this menu item, either a page or a heading node. */
    section: IPageNode | IHeadingNode;
}
export declare const NavMenuItem: React.SFC<INavMenuItemProps>;
