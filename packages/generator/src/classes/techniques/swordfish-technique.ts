import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const swordfishDifficulty = 13;

export class SwordfishTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.Swordfish;
    readonly difficulty = swordfishDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        return this.hasSwordfishForValue(field, cell, value);
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

    private hasSwordfishForValue(field: FieldInterface, _cell: CellInterface, value: number): boolean {
        const rowsWithValue = this.findRowsWithCandidates(field, value, 2, 3);
        const colsWithValue = this.findColsWithCandidates(field, value, 2, 3);

        return rowsWithValue.length >= 3 || colsWithValue.length >= 3;
    }

    private findRowsWithCandidates(
        field: FieldInterface,
        value: number,
        minCount: number,
        maxCount: number
    ): number[][] {
        const rows: number[][] = [];

        for (let rowIdx = 0; rowIdx < this.config.fieldSize; rowIdx += 1) {
            const positions: number[] = [];

            for (let colIdx = 0; colIdx < this.config.fieldSize; colIdx += 1) {
                if (field[rowIdx][colIdx].value === 0) {
                    const candidates = this.getCellCandidates(field, field[rowIdx][colIdx]);

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

    private findColsWithCandidates(
        field: FieldInterface,
        value: number,
        minCount: number,
        maxCount: number
    ): number[][] {
        const cols: number[][] = [];

        for (let colIdx = 0; colIdx < this.config.fieldSize; colIdx += 1) {
            const positions: number[] = [];

            for (let rowIdx = 0; rowIdx < this.config.fieldSize; rowIdx += 1) {
                if (field[rowIdx][colIdx].value === 0) {
                    const candidates = this.getCellCandidates(field, field[rowIdx][colIdx]);

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
