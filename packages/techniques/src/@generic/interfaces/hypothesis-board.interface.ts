import type { CellInterface } from '@suuudokuuu/generator';

export interface HypothesisBoardInterface {
    readonly cells: CellInterface[];
    readonly cellValues: number[];
    readonly candidateMasks: Uint16Array;
    readonly peerIndexes: number[][];
    readonly unitCellIndexes: number[][];
    readonly valueCount: number;
}
