/// <reference types="react" />
import * as React from "react";
import { IProps } from "../../common/props";
import { IPanel } from "./panelProps";
export interface IPanelStackProps extends IProps {
    /**
     * The initial panel to show on mount. This panel cannot be removed from the
     * stack and will appear when the stack is empty.
     */
    initialPanel: IPanel;
    /**
     * Callback invoked when the user presses the back button or a panel invokes
     * the `closePanel()` injected prop method.
     */
    onClose?: (removedPanel: IPanel) => void;
    /**
     * Callback invoked when a panel invokes the `openPanel(panel)` injected
     * prop method.
     */
    onOpen?: (addedPanel: IPanel) => void;
}
export interface IPanelStackState {
    /** Whether the stack is currently animating the push or pop of a panel. */
    direction: "push" | "pop";
    /** The current stack of panels. The first panel in the stack will be displayed. */
    stack: IPanel[];
}
export declare class PanelStack extends React.PureComponent<IPanelStackProps, IPanelStackState> {
    state: IPanelStackState;
    render(): JSX.Element;
    private renderCurrentPanel();
    private handlePanelClose;
    private handlePanelOpen;
}
