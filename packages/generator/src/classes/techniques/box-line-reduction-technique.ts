import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const boxLineReductionDifficulty = 11;

export class BoxLineReductionTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.BoxLineReduction;
    readonly difficulty = boxLineReductionDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        return this.hasBoxLineReductionForValue(field, cell, value);
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            for (const value of candidates) {
                if (this.canApply(field, cell, value, candidates)) {
                    results.push({ technique: this.type, cell, value });
                }
            }
        }

        return results;
    }

    private hasBoxLineReductionForValue(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        const groupCellsWithValue = groupCells.filter((groupCell) => {
            if (groupCell.value === 0) {
                const candidates = this.getCellCandidates(field, groupCell);

                return candidates.includes(value);
            }

            return false;
        });

        if (groupCellsWithValue.length < 2 || groupCellsWithValue.length > 3) {
            return false;
        }

        const allInSameRow = groupCellsWithValue.every((c) => c.y === groupCellsWithValue[0].y);
        const allInSameCol = groupCellsWithValue.every((c) => c.x === groupCellsWithValue[0].x);

        if (allInSameRow) {
            const rowCellsWithValue = rowCells.filter((rowCell) => {
                if (rowCell.value === 0 && !groupCells.some((gc) => gc.x === rowCell.x && gc.y === rowCell.y)) {
                    const candidates = this.getCellCandidates(field, rowCell);

                    return candidates.includes(value);
                }

                return false;
            });

            return rowCellsWithValue.length > 0;
        }

        if (allInSameCol) {
            const colCellsWithValue = colCells.filter((colCell) => {
                if (colCell.value === 0 && !groupCells.some((gc) => gc.x === colCell.x && gc.y === colCell.y)) {
                    const candidates = this.getCellCandidates(field, colCell);

                    return candidates.includes(value);
                }

                return false;
            });

            return colCellsWithValue.length > 0;
        }

        return false;
    }
}
