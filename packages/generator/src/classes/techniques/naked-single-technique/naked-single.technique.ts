import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class NakedSingleTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.NakedSingle, 3, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        const candidates = this.sudoku.getCellCandidates(cell);

        return candidates.length === 1 ? candidates[0] : null;
    }
}
