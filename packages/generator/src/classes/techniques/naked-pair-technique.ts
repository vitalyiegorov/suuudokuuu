import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const nakedPairDifficulty = 4;

export class NakedPairTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.NakedPair;
    readonly difficulty = nakedPairDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (candidates.length !== 2 || !candidates.includes(value)) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasPairInUnit(field, rowCells, candidates, cell) ||
            this.hasPairInUnit(field, colCells, candidates, cell) ||
            this.hasPairInUnit(field, groupCells, candidates, cell)
        );
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            if (candidates.length === 2) {
                for (const value of candidates) {
                    if (this.canApply(field, cell, value, candidates)) {
                        results.push({ technique: this.type, cell, value });
                    }
                }
            }
        }

        return results;
    }

    private hasPairInUnit(
        field: FieldInterface,
        unitCells: CellInterface[],
        candidates: number[],
        currentCell: CellInterface
    ): boolean {
        let pairCount = 0;

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(field, unitCell);

                if (
                    unitCandidates.length === 2 &&
                    unitCandidates.every((candidate) => candidates.includes(candidate))
                ) {
                    pairCount += 1;
                }
            }
        }

        return pairCount === 1;
    }
}
