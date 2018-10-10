/// <reference types="react" />
import { IHeadingNode, IPageNode } from "documentalist/dist/client";
import * as React from "react";
/**
 * Removes leading indents from a template string without removing all leading whitespace.
 * Trims resulting string to remove blank first/last lines caused by ` location.
 */
export declare function dedent(strings: TemplateStringsArray, ...values: Array<{
    toString(): string;
}>): string;
export declare function smartSearch(query: string, ...content: string[]): boolean;
export interface IKeyEventMap {
    /** event handler invoked on all events */
    all?: React.KeyboardEventHandler<HTMLElement>;
    /** map keycodes to specific event handlers */
    [keyCode: number]: React.KeyboardEventHandler<HTMLElement>;
}
export declare function createKeyEventHandler(actions: IKeyEventMap, preventDefault?: boolean): (e: React.KeyboardEvent<HTMLElement>) => void;
/**
 * Performs an in-order traversal of the layout tree, invoking the callback for each node.
 * Callback receives an array of ancestors with direct parent first in the list.
 */
export declare function eachLayoutNode(layout: Array<IHeadingNode | IPageNode>, callback: (node: IHeadingNode | IPageNode, parents: IPageNode[]) => void, parents?: IPageNode[]): void;
