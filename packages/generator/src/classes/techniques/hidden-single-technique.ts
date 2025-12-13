import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { BaseTechnique } from './base-technique';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-strategy.interface';

export class HiddenSingleTechnique extends BaseTechnique {
    readonly type = SolutionTechniqueEnum.HiddenSingle;
    readonly difficulty = 3;

    canApply(field: FieldInterface, cell: CellInterface, value: number, _candidates: number[]): boolean {
        const rowCells = this.getRowCells(field, cell.y).filter(
            (cellItem) => cellItem.value === 0 && (cellItem.x !== cell.x || cellItem.y !== cell.y)
        );
        const canPlaceInRow = rowCells.every((cellItem) => !this.isValueValid(field, cellItem, value));

        if (canPlaceInRow) {
            return true;
        }

        const colCells = this.getColCells(field, cell.x).filter(
            (cellItem) => cellItem.value === 0 && (cellItem.x !== cell.x || cellItem.y !== cell.y)
        );
        const canPlaceInCol = colCells.every((cellItem) => !this.isValueValid(field, cellItem, value));

        if (canPlaceInCol) {
            return true;
        }

        const groupCells = this.getGroupCells(field, cell).filter(
            (cellItem) => cellItem.value === 0 && (cellItem.x !== cell.x || cellItem.y !== cell.y)
        );
        const canPlaceInGroup = groupCells.every((cellItem) => !this.isValueValid(field, cellItem, value));

        return canPlaceInGroup;
    }

    findAll(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const emptyCells = this.getEmptyCells(field);

        for (const cell of emptyCells) {
            const candidates = this.getCellCandidates(field, cell);

            for (const value of candidates) {
                if (this.canApply(field, cell, value, candidates)) {
                    results.push({ technique: this.type, cell, value });
                    break;
                }
            }
        }

        return results;
    }
}
