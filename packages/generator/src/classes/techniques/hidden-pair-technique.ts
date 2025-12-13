import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

const hiddenPairDifficulty = 5;

export class HiddenPairTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.HiddenPair;
    readonly difficulty = hiddenPairDifficulty;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasHiddenPairInUnit(field, rowCells, value, cell) ||
            this.hasHiddenPairInUnit(field, colCells, value, cell) ||
            this.hasHiddenPairInUnit(field, groupCells, value, cell)
        );
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

    private hasHiddenPairInUnit(
        field: FieldInterface,
        unitCells: CellInterface[],
        value: number,
        _currentCell: CellInterface
    ): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(field, unitCell);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 2) {
            return false;
        }

        const cell1Candidates = this.getCellCandidates(field, valueCandidateCells[0]);
        const cell2Candidates = this.getCellCandidates(field, valueCandidateCells[1]);

        const sharedValues = cell1Candidates.filter((candidate) => cell2Candidates.includes(candidate));

        return sharedValues.length === 2 && sharedValues.includes(value);
    }
}
