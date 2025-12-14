import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class GuessTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.Guess, 100, sudoku);
    }

    canApply(_field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue) {
            return false;
        }

        return candidates.length > 0;
    }
}
