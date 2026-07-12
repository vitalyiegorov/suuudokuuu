import { isDefined } from '@rnw-community/shared';

import { AbstractFishTechnique } from '../../@generic/classes/abstract-fish-technique';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getUniqueValues } from '../../@generic/utils/get-unique-values.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../@generic/interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { FinnedFishBaseType } from '../../@generic/types/finned-fish-base.type';
import type { LineType } from '../../@generic/types/line.type';
import type { CellInterface } from '@suuudokuuu/generator';

export class BasicFishTechnique extends AbstractFishTechnique implements TechniqueStrategyInterface {
    protected override getCandidateUnits(
        context: CandidateContext,
        baseUnits: CandidateUnitInterface[],
        value: number,
        coverType: LineType
    ): CandidateUnitInterface[] {
        return baseUnits.filter(unit => {
            const coverIndexes = this.getCoverIndexes(context, unit, value, coverType);

            return coverIndexes.length >= 2 && coverIndexes.length <= this.size;
        });
    }

    protected findInUnits(
        context: CandidateContext,
        value: number,
        base: FinnedFishBaseType,
        targetCell?: CellInterface
    ): TechniqueResultInterface[] {
        const coverIndexes = getUniqueValues(base.units.flatMap(unit => this.getCoverIndexes(context, unit, value, base.coverType)));

        if (coverIndexes.length !== this.size) {
            return [];
        }

        const eliminations = this.getFishEliminations(context, base.units, value, base.coverType).filter(
            elimination => !isDefined(targetCell) || isSameCell(elimination.cell, targetCell)
        );

        return createEliminationResults(
            context,
            this.technique,
            eliminations,
            base.units.flatMap(unit => unit.cells.filter(cell => context.getCandidates(cell).includes(value)))
        );
    }

    private getCoverIndexes(context: CandidateContext, unit: CandidateUnitInterface, value: number, coverType: LineType): number[] {
        return getUniqueValues(
            unit.cells.filter(cell => context.getCandidates(cell).includes(value)).map(cell => (coverType === 'row' ? cell.y : cell.x))
        );
    }

    private getFishEliminations(
        context: CandidateContext,
        baseUnits: CandidateUnitInterface[],
        value: number,
        coverType: LineType
    ): CandidateEliminationInterface[] {
        const baseIndexes = baseUnits.map(unit => unit.index);
        const coverIndexes = getUniqueValues(baseUnits.flatMap(unit => this.getCoverIndexes(context, unit, value, coverType)));
        const eliminations: CandidateEliminationInterface[] = [];

        for (const coverIndex of coverIndexes) {
            const coverCells = coverType === 'row' ? context.getRowCells(coverIndex) : context.getColumnCells(coverIndex);

            for (const cell of coverCells) {
                const baseIndex = coverType === 'row' ? cell.x : cell.y;

                if (!baseIndexes.includes(baseIndex) && context.getCandidates(cell).includes(value)) {
                    eliminations.push({ cell, value });
                }
            }
        }

        return eliminations;
    }
}
