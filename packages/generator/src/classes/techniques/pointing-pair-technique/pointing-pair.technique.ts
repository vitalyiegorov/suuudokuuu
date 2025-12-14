import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class PointingPairTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.PointingPair, 10, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        for (const value of candidates) {
            if (this.hasPointingPairForValue(cell, value)) {
                return true;
            }
        }

        return false;
    }

    private hasPointingPairForValue(cell: CellInterface, value: number): boolean {
        const groupCells = this.getGroupCells(cell);
        const cellsWithValue: CellInterface[] = [];

        for (const groupCell of groupCells) {
            if (groupCell.value === 0) {
                const candidates = this.getCellCandidates(groupCell);

                if (candidates.includes(value)) {
                    cellsWithValue.push(groupCell);
                }
            }
        }

        if (cellsWithValue.length !== 2) {
            return false;
        }

        const sameRow = cellsWithValue[0].y === cellsWithValue[1].y;
        const sameCol = cellsWithValue[0].x === cellsWithValue[1].x;

        return sameRow || sameCol;
    }
}
