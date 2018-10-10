/// <reference types="react" />
import * as React from "react";
export declare const WARNING_BASE_EXAMPLE_DEPRECATED = "[Blueprint] BaseExample is deprecated and will be removed in the next beta. Compose new Example component instead of extending BaseExample.";
export interface IBaseExampleProps {
    id: string;
    themeName: string;
}
/**
 * Starter class for all React example components.
 * Examples and options are rendered into separate containers.
 * @deprecated
 */
export declare class BaseExample<S> extends React.Component<IBaseExampleProps, S> {
    /** Define this prop to add a className to the example container */
    protected className: string;
    private hasDelayedBeforeInitialRender;
    private hasCompletedInitialRender;
    shouldComponentUpdate(nextProps: IBaseExampleProps, nextState: S & object): boolean;
    componentWillMount(): void;
    componentDidMount(): void;
    componentDidUpdate(_nextProps: IBaseExampleProps, _nextState: S): void;
    render(): JSX.Element;
    /**
     * Render the example element. Return any valid React node.
     */
    protected renderExample(): React.ReactNode | undefined;
    /**
     * Render the options controls. Return a single element for simple mode, or an array of arrays
     * of elements to generate columns: each array will be its own column. When using array mode,
     * the inner elements will each need the `key` prop.
     */
    protected renderOptions(): JSX.Element | JSX.Element[][];
    private actuallyRenderOptions();
}
/** Event handler that exposes the target element's value as a boolean. */
export declare function handleBooleanChange(handler: (checked: boolean) => void): (event: React.FormEvent<HTMLElement>) => void;
/** Event handler that exposes the target element's value as a string. */
export declare function handleStringChange(handler: (value: string) => void): (event: React.FormEvent<HTMLElement>) => void;
/** Event handler that exposes the target element's value as a number. */
export declare function handleNumberChange(handler: (value: number) => void): (event: React.FormEvent<HTMLElement>) => void;
