import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class PointingPairTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.PointingPair, 10, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        for (const value of candidates) {
            if (this.hasPointingPairForValue(field, cell, value)) {
                return true;
            }
        }

        return false;
    }

    private hasPointingPairForValue(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const groupCells = this.getGroupCells(field, cell);
        const cellsWithValue: CellInterface[] = [];

        for (const groupCell of groupCells) {
            if (groupCell.value === 0) {
                const candidates = this.getCellCandidates(field, groupCell);

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
