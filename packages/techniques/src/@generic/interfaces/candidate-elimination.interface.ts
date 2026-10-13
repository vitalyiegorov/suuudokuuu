import type { CellInterface } from '@suuudokuuu/generator';

export interface CandidateEliminationInterface {
    readonly cell: CellInterface;
    readonly value: number;
}
