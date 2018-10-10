export interface IKeyWhitelist<T> {
    include: Array<keyof T>;
}
export interface IKeyBlacklist<T> {
    exclude: Array<keyof T>;
}
export declare const Utils: {
    times<T>(n: number, callback: (i: number) => T): T[];
    accumulate(numbers: number[]): number[];
    toBase26Alpha(num: number): string;
    toBase26CellName(rowIndex: number, columnIndex: number): string;
    binarySearch(value: number, high: number, lookup: (index: number) => number): number;
    arrayOfLength<T>(array: T[], length: number, fillValue: T): T[];
    assignSparseValues<T>(defaults: T[], sparseOverrides: T[]): T[];
    measureElementTextContent(element: Element): TextMetrics;
    clamp(value: number, min?: number, max?: number): number;
    guideIndexToReorderedIndex(oldIndex: number, newIndex: number, length: number): number;
    reorderedIndexToGuideIndex(oldIndex: number, newIndex: number, length: number): number;
    reorderArray<T>(array: T[], from: number, to: number, length?: number): T[];
    isLeftClick(event: MouseEvent): boolean;
    getApproxCellHeight(cellText: string, columnWidth: number, approxCharWidth: number, approxLineHeight: number, horizontalPadding: number, numBufferLines: number): number;
};
