import { Sudoku } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '@suuudokuuu/generator';

export class NakedSingleTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.NakedSingle, 3, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        const candidates = this.sudoku.getCellCandidates(cell);

        return candidates.length === 1 ? candidates[0] : null;
    }
}
