import type { CellInterface } from '@suuudokuuu/generator';

export interface HypothesisBoardInterface {
    readonly cells: readonly CellInterface[];
    readonly cellValues: readonly number[];
    readonly candidateMasks: Uint16Array;
    readonly peerIndexes: readonly (readonly number[])[];
    readonly unitCellIndexes: readonly (readonly number[])[];
    readonly cellUnitIndexes: readonly (readonly number[])[];
    readonly valueCount: number;
}
