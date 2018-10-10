export interface ICellCoordinates {
    col: number;
    row: number;
}
export interface IFocusedCellCoordinates extends ICellCoordinates {
    focusSelectionIndex: number;
}
