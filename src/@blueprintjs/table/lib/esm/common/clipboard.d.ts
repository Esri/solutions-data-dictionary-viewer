export declare const Clipboard: {
    applySelectableStyles(elem: HTMLElement): HTMLElement;
    copyCells(cells: string[][]): boolean;
    copyString(value: string): boolean;
    copyElement(elem: HTMLElement, plaintext?: string): boolean;
    isCopySupported(): boolean;
};
