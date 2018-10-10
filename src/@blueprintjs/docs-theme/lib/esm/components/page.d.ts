/// <reference types="react" />
import * as React from "react";
import { IPageData } from "documentalist/dist/client";
import { ITagRendererMap } from "../tags";
export interface IPageProps {
    page: IPageData;
    renderActions: (page: IPageData) => React.ReactNode;
    tagRenderers: ITagRendererMap;
}
export declare const Page: React.SFC<IPageProps>;
