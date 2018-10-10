/// <reference types="react" />
import { ITag } from "documentalist/dist/client";
export interface ITagRendererMap {
    [tagName: string]: React.ComponentType<ITag> | undefined;
}
export * from "./css";
export * from "./defaults";
export * from "./heading";
export * from "./reactDocs";
export * from "./reactExample";
export * from "./see";
export * from "./typescript";
