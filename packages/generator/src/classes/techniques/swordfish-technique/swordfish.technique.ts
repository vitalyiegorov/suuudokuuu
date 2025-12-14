import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class SwordfishTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.Swordfish, 13, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        for (const value of candidates) {
            if (this.hasSwordfishForValue(value)) {
                return true;
            }
        }

        return false;
    }

    private hasSwordfishForValue(value: number): boolean {
        const rowsWithValue = this.findRowsWithCandidates(value, 2, 3);
        const colsWithValue = this.findColsWithCandidates(value, 2, 3);

        return rowsWithValue.length >= 3 || colsWithValue.length >= 3;
    }

    private findRowsWithCandidates(value: number, minCount: number, maxCount: number): number[][] {
        const rows: number[][] = [];

        for (let rowIdx = 0; rowIdx < this.config.fieldSize; rowIdx += 1) {
            const positions: number[] = [];

            for (let colIdx = 0; colIdx < this.config.fieldSize; colIdx += 1) {
                if (this.field[rowIdx][colIdx].value === 0) {
                    const candidates = this.getCellCandidates(this.field[rowIdx][colIdx]);

                    if (candidates.includes(value)) {
                        positions.push(colIdx);
                    }
                }
            }

            if (positions.length >= minCount && positions.length <= maxCount) {
                rows.push(positions);
            }
        }

        return rows;
    }

    private findColsWithCandidates(value: number, minCount: number, maxCount: number): number[][] {
        const cols: number[][] = [];

        for (let colIdx = 0; colIdx < this.config.fieldSize; colIdx += 1) {
            const positions: number[] = [];

            for (let rowIdx = 0; rowIdx < this.config.fieldSize; rowIdx += 1) {
                if (this.field[rowIdx][colIdx].value === 0) {
                    const candidates = this.getCellCandidates(this.field[rowIdx][colIdx]);

                    if (candidates.includes(value)) {
                        positions.push(rowIdx);
                    }
                }
            }

            if (positions.length >= minCount && positions.length <= maxCount) {
                cols.push(positions);
            }
        }

        return cols;
    }
}
