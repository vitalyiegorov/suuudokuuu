import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

export class NakedSingleTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.NakedSingle;
    readonly difficulty = 2;

    canApply(_field: FieldInterface, _cell: CellInterface, value: number, candidates: number[]): boolean {
        return candidates.length === 1 && candidates[0] === value;
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            if (candidates.length === 1) {
                results.push({ technique: this.type, cell, value: candidates[0] });
            }
        }

        return results;
    }
}
