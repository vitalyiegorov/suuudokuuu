import type { CellInterface } from '@suuudokuuu/generator';

export interface StepScriptTargetInterface {
    placeValue(cell: CellInterface, value: number): void;
    removeCandidate(cell: CellInterface, value: number): void;
}
