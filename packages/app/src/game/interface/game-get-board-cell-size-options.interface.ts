export interface GameGetBoardCellSizeOptionsInterface {
    readonly availableWidth: number;
    readonly availableHeight: number;
    readonly sizeClass: 'compact' | 'wide';
    readonly panelWidth: number;
    readonly gutter: number;
}
