import { IDragHandler } from "./draggable";
export declare class DragEvents {
    static DOUBLE_CLICK_TIMEOUT_MSEC: number;
    /**
     * Returns true if the event includes a modifier key that often adds the result of the drag
     * event to any existing state. For example, holding CTRL before dragging may select another
     * region in addition to an existing one, while the absence of a modifier key may clear the
     * existing selection first.
     * @param event the mouse event for the drag interaction
     */
    static isAdditive(event: MouseEvent): boolean;
    private handler;
    private element;
    private activationCoordinates;
    private doubleClickTimeoutToken;
    private isActivated;
    private isDragging;
    private lastCoordinates;
    attach(element: HTMLElement, handler: IDragHandler): this;
    detach(): void;
    private isValidDragHandler(handler);
    private attachDocumentEventListeners();
    private detachDocumentEventListeners();
    private initCoordinateData(event);
    private updateCoordinateData(event);
    private maybeAlterEventChain(event);
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
}
