import type { CellInterface } from '@suuudokuuu/generator';

export interface UnitValueEntryInterface {
    readonly cells: readonly CellInterface[];
    readonly positions: readonly number[];
}
