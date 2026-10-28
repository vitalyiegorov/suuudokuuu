import type { CellInterface } from '@suuudokuuu/generator';

export interface GameCellAccessibilityLabelParamsInterface {
    readonly candidates: number[];
    readonly cell: CellInterface;
    readonly eliminatedCandidates: number[];
    readonly isEmpty: boolean;
    readonly isWrong: boolean;
}
