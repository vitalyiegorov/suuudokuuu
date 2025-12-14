import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class FullHouseTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.FullHouse, 1, sudoku);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue) {
            return false;
        }

        if (candidates.length !== 1) {
            return false;
        }

        return (
            this.countEmptyCellsInRow(field, cell.y) === 1 ||
            this.countEmptyCellsInCol(field, cell.x) === 1 ||
            this.countEmptyCellsInGroup(field, cell) === 1
        );
    }
}
