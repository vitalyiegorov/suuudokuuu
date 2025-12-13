import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const pointingPairDifficulty = 10;

export class PointingPairTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.PointingPair;
    readonly difficulty = pointingPairDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        return this.hasPointingPairForValue(field, cell, value);
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
