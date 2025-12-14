import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class HiddenSingleTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenSingle, 3, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue) {
            return false;
        }

        if (candidates.length === 0) {
            return false;
        }

        for (const value of candidates) {
            if (this.isHiddenSingleInRow(cell, value) || this.isHiddenSingleInCol(cell, value) || this.isHiddenSingleInGroup(cell, value)) {
                return true;
            }
        }

        return false;
    }

    private isHiddenSingleInRow(targetCell: CellInterface, value: number): boolean {
        const rowCells = this.getRowCells(targetCell.y).filter(
            cellItem => cellItem.value === this.config.blankCellValue && (cellItem.x !== targetCell.x || cellItem.y !== targetCell.y)
        );

        return rowCells.every(cellItem => !this.isValueValidInCell(cellItem, value));
    }

    private isHiddenSingleInCol(targetCell: CellInterface, value: number): boolean {
        const colCells = this.getColCells(targetCell.x).filter(
            cellItem => cellItem.value === this.config.blankCellValue && (cellItem.x !== targetCell.x || cellItem.y !== targetCell.y)
        );

        return colCells.every(cellItem => !this.isValueValidInCell(cellItem, value));
    }

    private isHiddenSingleInGroup(targetCell: CellInterface, value: number): boolean {
        const groupCells = this.getGroupCells(targetCell).filter(
            cellItem => cellItem.value === this.config.blankCellValue && (cellItem.x !== targetCell.x || cellItem.y !== targetCell.y)
        );

        return groupCells.every(cellItem => !this.isValueValidInCell(cellItem, value));
    }
}
