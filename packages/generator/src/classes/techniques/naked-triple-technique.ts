import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const nakedTripleDifficulty = 6;

export class NakedTripleTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.NakedTriple;
    readonly difficulty = nakedTripleDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (candidates.length < 2 || candidates.length > 3 || !candidates.includes(value)) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasTripleInUnit(field, rowCells, candidates, cell) ||
            this.hasTripleInUnit(field, colCells, candidates, cell) ||
            this.hasTripleInUnit(field, groupCells, candidates, cell)
        );
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            if (candidates.length >= 2 && candidates.length <= 3) {
                for (const value of candidates) {
                    if (this.canApply(field, cell, value, candidates)) {
                        results.push({ technique: this.type, cell, value });
                    }
                }
            }
        }

        return results;
    }

    private hasTripleInUnit(
        field: FieldInterface,
        unitCells: CellInterface[],
        candidates: number[],
        currentCell: CellInterface
    ): boolean {
        const potentialTripleCells: CellInterface[] = [];
        const allCandidates = new Set(candidates);

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(field, unitCell);

                if (
                    unitCandidates.length >= 2 &&
                    unitCandidates.length <= 3 &&
                    unitCandidates.every((candidate) => allCandidates.has(candidate))
                ) {
                    potentialTripleCells.push(unitCell);
                    unitCandidates.forEach((candidate) => allCandidates.add(candidate));
                }
            }
        }

        return potentialTripleCells.length >= 2 && allCandidates.size === 3;
    }
}
