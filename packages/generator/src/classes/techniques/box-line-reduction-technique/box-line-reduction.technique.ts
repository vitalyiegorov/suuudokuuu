import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class BoxLineReductionTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.BoxLineReduction, 11, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        for (const value of candidates) {
            if (this.hasBoxLineReductionForValue(cell, value)) {
                return true;
            }
        }

        return false;
    }

    private hasBoxLineReductionForValue(cell: CellInterface, value: number): boolean {
        const rowCells = this.getRowCells(cell.y);
        const colCells = this.getColCells(cell.x);
        const groupCells = this.getGroupCells(cell);

        const groupCellsWithValue = groupCells.filter(groupCell => {
            if (groupCell.value === 0) {
                const candidates = this.getCellCandidates(groupCell);

                return candidates.includes(value);
            }

            return false;
        });

        if (groupCellsWithValue.length < 2 || groupCellsWithValue.length > 3) {
            return false;
        }

        const allInSameRow = groupCellsWithValue.every(c => c.y === groupCellsWithValue[0].y);
        const allInSameCol = groupCellsWithValue.every(c => c.x === groupCellsWithValue[0].x);

        if (allInSameRow) {
            const rowCellsWithValue = rowCells.filter(rowCell => {
                if (rowCell.value === 0 && !groupCells.some(gc => gc.x === rowCell.x && gc.y === rowCell.y)) {
                    const candidates = this.getCellCandidates(rowCell);

                    return candidates.includes(value);
                }

                return false;
            });

            return rowCellsWithValue.length > 0;
        }

        if (allInSameCol) {
            const colCellsWithValue = colCells.filter(colCell => {
                if (colCell.value === 0 && !groupCells.some(gc => gc.x === colCell.x && gc.y === colCell.y)) {
                    const candidates = this.getCellCandidates(colCell);

                    return candidates.includes(value);
                }

                return false;
            });

            return colCellsWithValue.length > 0;
        }

        return false;
    }
}
