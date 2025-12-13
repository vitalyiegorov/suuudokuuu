import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const nakedQuadDifficulty = 8;

export class NakedQuadTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.NakedQuad;
    readonly difficulty = nakedQuadDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (candidates.length < 2 || candidates.length > 4 || !candidates.includes(value)) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasQuadInUnit(field, rowCells, candidates, cell) ||
            this.hasQuadInUnit(field, colCells, candidates, cell) ||
            this.hasQuadInUnit(field, groupCells, candidates, cell)
        );
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            if (candidates.length >= 2 && candidates.length <= 4) {
                for (const value of candidates) {
                    if (this.canApply(field, cell, value, candidates)) {
                        results.push({ technique: this.type, cell, value });
                    }
                }
            }
        }

        return results;
    }

    private hasQuadInUnit(
        field: FieldInterface,
        unitCells: CellInterface[],
        candidates: number[],
        currentCell: CellInterface
    ): boolean {
        const potentialQuadCells: CellInterface[] = [];
        const allCandidates = new Set(candidates);

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(field, unitCell);

                if (
                    unitCandidates.length >= 2 &&
                    unitCandidates.length <= 4 &&
                    unitCandidates.every((candidate) => allCandidates.has(candidate))
                ) {
                    potentialQuadCells.push(unitCell);
                    unitCandidates.forEach((candidate) => allCandidates.add(candidate));
                }
            }
        }

        return potentialQuadCells.length >= 3 && allCandidates.size === 4;
    }
}
