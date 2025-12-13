import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

export class GuessTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.Guess;
    readonly difficulty = 100;

    canApply(_field: FieldInterface, _cell: CellInterface, _value: number, _candidates: number[]): boolean {
        return true;
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            for (const value of candidates) {
                results.push({ technique: this.type, cell, value });
            }
        }

        return results;
    }
}
