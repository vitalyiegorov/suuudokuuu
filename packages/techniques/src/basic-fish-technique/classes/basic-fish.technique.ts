import { isDefined, isEmptyArray } from '@rnw-community/shared';

import { AbstractFishTechnique } from '../../@generic/classes/abstract-fish-technique';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { UnitValueIndex } from '../../@generic/classes/unit-value-index/unit-value-index';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { UnitValueEntryInterface } from '../../@generic/interfaces/unit-value-entry.interface';
import type { FishBaseType } from '../../@generic/types/fish-base.type';
import type { CellInterface } from '@suuudokuuu/generator';

export class BasicFishTechnique extends AbstractFishTechnique implements TechniqueStrategyInterface {
    protected override isCandidateUnit(entry: UnitValueEntryInterface): boolean {
        return entry.cells.length >= 2 && entry.cells.length <= this.size;
    }

    protected findInUnits(index: UnitValueIndex, base: FishBaseType, targetCell?: CellInterface): TechniqueResultInterface[] {
        const coverIndexes = this.getDistinctCoverIndexes(index, base);

        if (coverIndexes.length !== this.size) {
            return [];
        }

        const eliminations = this.getCoverEliminations({
            index,
            coverIndexes,
            coverType: base.coverType,
            baseType: base.baseType,
            baseIndexes: this.getBaseIndexes(index, base),
            value: base.value
        }).filter(elimination => !isDefined(targetCell) || isSameCell(elimination.cell, targetCell));

        if (isEmptyArray(eliminations)) {
            return [];
        }

        return createEliminationResults(this.technique, eliminations, this.getBaseCells(index, base));
    }
}
