import type { CellInterface } from '@suuudokuuu/generator';

export interface ChainSearchNodeInterface {
    readonly cell: CellInterface;
    readonly parentIndex: number;
    readonly pathLength: number;
}
