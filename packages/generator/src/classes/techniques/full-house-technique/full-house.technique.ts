import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class FullHouseTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.FullHouse, 1, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue) {
            return false;
        }

        if (candidates.length !== 1) {
            return false;
        }

        return (
            this.countEmptyCellsInRow(cell.y) === 1 || this.countEmptyCellsInCol(cell.x) === 1 || this.countEmptyCellsInGroup(cell) === 1
        );
    }
}
