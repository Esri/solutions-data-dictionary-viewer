export declare type ScrollKey = "scrollLeft" | "scrollTop";
export declare class TableQuadrantStackCache {
    private cachedRowHeaderWidth;
    private cachedColumnHeaderHeight;
    private cachedScrollLeft;
    private cachedScrollTop;
    private cachedScrollContainerClientWidth;
    private cachedScrollContainerClientHeight;
    constructor();
    reset(): void;
    getScrollOffset(scrollKey: ScrollKey): number;
    getRowHeaderWidth(): number;
    getColumnHeaderHeight(): number;
    getScrollContainerClientWidth(): number;
    getScrollContainerClientHeight(): number;
    setColumnHeaderHeight(height: number): void;
    setRowHeaderWidth(width: number): void;
    setScrollOffset(scrollKey: ScrollKey, offset: number): void;
    setScrollContainerClientWidth(clientWidth: number | undefined): void;
    setScrollContainerClientHeight(clientHeight: number | undefined): void;
}
