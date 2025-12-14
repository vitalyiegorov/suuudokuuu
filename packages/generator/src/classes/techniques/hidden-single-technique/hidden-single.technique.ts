import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class HiddenSingleTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenSingle, 3, sudoku);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue) {
            return false;
        }

        if (candidates.length === 0) {
            return false;
        }

        for (const value of candidates) {
            if (this.isHiddenSingleInRow(field, cell, value) ||
                this.isHiddenSingleInCol(field, cell, value) ||
                this.isHiddenSingleInGroup(field, cell, value)) {
                return true;
            }
        }

        return false;
    }

    private isHiddenSingleInRow(field: FieldInterface, targetCell: CellInterface, value: number): boolean {
        const rowCells = this.getRowCells(field, targetCell.y).filter(
            cellItem => cellItem.value === this.config.blankCellValue && (cellItem.x !== targetCell.x || cellItem.y !== targetCell.y)
        );

        return rowCells.every(cellItem => !this.isValueValidInCell(field, cellItem, value));
    }

    private isHiddenSingleInCol(field: FieldInterface, targetCell: CellInterface, value: number): boolean {
        const colCells = this.getColCells(field, targetCell.x).filter(
            cellItem => cellItem.value === this.config.blankCellValue && (cellItem.x !== targetCell.x || cellItem.y !== targetCell.y)
        );

        return colCells.every(cellItem => !this.isValueValidInCell(field, cellItem, value));
    }

    private isHiddenSingleInGroup(field: FieldInterface, targetCell: CellInterface, value: number): boolean {
        const groupCells = this.getGroupCells(field, targetCell).filter(
            cellItem => cellItem.value === this.config.blankCellValue && (cellItem.x !== targetCell.x || cellItem.y !== targetCell.y)
        );

        return groupCells.every(cellItem => !this.isValueValidInCell(field, cellItem, value));
    }
}
