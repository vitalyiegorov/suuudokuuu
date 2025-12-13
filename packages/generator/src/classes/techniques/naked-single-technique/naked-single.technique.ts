import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class NakedSingleTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.NakedSingle, 2, config);
    }

    canApply(field: FieldInterface, cell: CellInterface): boolean {
        if (cell.value !== this.config.blankCellValue) {
            return false;
        }

        const candidates = this.getCellCandidates(field, cell);

        return candidates.length === 1;
    }
}
