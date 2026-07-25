import type { LayoutChangeEvent } from 'react-native';

export interface BoardCellSizeInterface {
    readonly cellSize: number;
    readonly onBoardAreaLayout: (event: LayoutChangeEvent) => void;
}
