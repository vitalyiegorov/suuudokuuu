import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class FullHouseTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.FullHouse, 1, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        if (cell.value !== this.config.blankCellValue) {
            return null;
        }

        const candidates = this.getCellCandidates(cell);

        if (candidates.length !== 1) {
            return null;
        }

        const isFullHouse =
            this.countEmptyCellsInRow(cell.y) === 1 || this.countEmptyCellsInCol(cell.x) === 1 || this.countEmptyCellsInGroup(cell) === 1;

        return isFullHouse ? candidates[0] : null;
    }
}
