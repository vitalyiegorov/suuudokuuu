import type { CellInterface } from '@suuudokuuu/generator';

export interface CandidateNodeInterface {
    readonly cell: CellInterface;
    readonly index: number;
    readonly key: string;
    readonly value: number;
}
