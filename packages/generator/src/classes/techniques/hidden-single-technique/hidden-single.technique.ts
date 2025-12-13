import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class HiddenSingleTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.HiddenSingle, 3, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, value: number, _candidates: number[]): boolean {
        const rowCells = this.getRowCells(field, cell.y).filter(
            cellItem => cellItem.value === 0 && (cellItem.x !== cell.x || cellItem.y !== cell.y)
        );
        const canPlaceInRow = rowCells.every(cellItem => !this.isValueValid(field, cellItem, value));

        if (canPlaceInRow) {
            return true;
        }

        const colCells = this.getColCells(field, cell.x).filter(
            cellItem => cellItem.value === 0 && (cellItem.x !== cell.x || cellItem.y !== cell.y)
        );
        const canPlaceInCol = colCells.every(cellItem => !this.isValueValid(field, cellItem, value));

        if (canPlaceInCol) {
            return true;
        }

        const groupCells = this.getGroupCells(field, cell).filter(
            cellItem => cellItem.value === 0 && (cellItem.x !== cell.x || cellItem.y !== cell.y)
        );
        const canPlaceInGroup = groupCells.every(cellItem => !this.isValueValid(field, cellItem, value));

        return canPlaceInGroup;
    }
}
