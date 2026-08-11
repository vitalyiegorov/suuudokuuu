import type { PuzzleBoardCellInterface } from './puzzle-board-cell.interface';

export interface PuzzleBoardRowInterface {
    index: number;
    cells: PuzzleBoardCellInterface[];
}
