/// <reference types="react" />
import * as React from "react";
import { IActionProps, ILinkProps } from "../../common/props";
export interface IBreadcrumbProps extends IActionProps, ILinkProps {
}
export declare const Breadcrumb: React.SFC<IBreadcrumbProps>;
