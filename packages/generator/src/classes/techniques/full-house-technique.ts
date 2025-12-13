import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

export class FullHouseTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.FullHouse;
    readonly difficulty = 1;

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (candidates.length !== 1 || candidates[0] !== value) {
            return false;
        }

        const rowEmptyCells = this.getRowCells(field, cell.y).filter((cellItem) => cellItem.value === 0);

        if (rowEmptyCells.length === 1) {
            return true;
        }

        const colEmptyCells = this.getColCells(field, cell.x).filter((cellItem) => cellItem.value === 0);

        if (colEmptyCells.length === 1) {
            return true;
        }

        const groupEmptyCells = this.getGroupCells(field, cell).filter((cellItem) => cellItem.value === 0);

        return groupEmptyCells.length === 1;
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            if (candidates.length === 1) {
                const [singleValue] = candidates;

                if (this.canApply(field, cell, singleValue, candidates)) {
                    results.push({ technique: this.type, cell, value: singleValue });
                }
            }
        }

        return results;
    }
}
