/// <reference types="react" />
import { IProps } from "@blueprintjs/core";
import * as React from "react";
export interface IExampleProps<T = {}> extends IProps {
    /**
     * Identifier of this example.
     * This will appear as the `data-example-id` attribute on the DOM element.
     */
    id: string;
    /**
     * Container for arbitary data passed to each example from the parent
     * application. This prop is ignored by the `<Example>` component; it is
     * available for your example implementations to access by providing a `<T>`
     * type to this interface. Pass actual `data` when defining your example map
     * for the `ReactExampleTagRenderer`.
     *
     * A container like this is necessary because unknown props on the
     * `<Example>` component are passed to its underlying DOM element, so adding
     * your own props will result in React "unknown prop" warnings.
     */
    data?: T;
}
/**
 * Props supported by the `Example` component.
 * Additional props will be spread to the root `<div>` element.
 */
export interface IDocsExampleProps extends IExampleProps {
    /**
     * Options for the example, which will typically appear in a narrow column
     * to the right of the example.
     */
    options: React.ReactNode;
    /**
     * Whether options should appear in a full-width row below the example
     * container. By default, options appear in a single column to the right of
     * the example. If this prop is enabled, then the options container becomes
     * a flex row; group options into columns by wrapping them in a `<div>`.
     * @default false
     */
    showOptionsBelowExample?: boolean;
    /**
     * HTML markup for the example, which will be directly injected into the
     * example container using `dangerouslySetInnerHTML`.
     *
     * This prop is mutually exclusive with and takes priority over `children`.
     */
    html?: string;
}
/**
 * Container for an example and its options.
 *
 * ```tsx
 * import { Example, IExampleProps } from "@blueprintjs/docs-theme";
 * // use IExampleProps as your props type,
 * // then spread it to <Example> below
 * export class MyExample extends React.PureComponent<IExampleProps, [your state]> {
 *     public render() {
 *         const options = (
 *             <>
 *                  --- render options here ---
 *             </>
 *         );
 *         return (
 *             <Example options={options} {...this.props}>
 *                 --- render examples here ---
 *             </Example>
 *         );
 *     }
 * ```
 */
export declare class Example extends React.PureComponent<IDocsExampleProps> {
    private hasDelayedBeforeInitialRender;
    render(): JSX.Element;
    componentDidMount(): void;
}
