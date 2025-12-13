import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class FullHouseTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.FullHouse, 1, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (candidates.length !== 1 || candidates[0] !== value) {
            return false;
        }

        const rowEmptyCells = this.getRowCells(field, cell.y).filter(cellItem => cellItem.value === 0);

        if (rowEmptyCells.length === 1) {
            return true;
        }

        const colEmptyCells = this.getColCells(field, cell.x).filter(cellItem => cellItem.value === 0);

        if (colEmptyCells.length === 1) {
            return true;
        }

        const groupEmptyCells = this.getGroupCells(field, cell).filter(cellItem => cellItem.value === 0);

        return groupEmptyCells.length === 1;
    }
}
