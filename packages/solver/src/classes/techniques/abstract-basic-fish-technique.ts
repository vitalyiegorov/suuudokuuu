import { AbstractFishTechnique } from './abstract-fish-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { FinnedFishBaseType } from '../../types/finned-fish-base.type';
import type { LineType } from '../../types/line.type';

export abstract class AbstractBasicFishTechnique extends AbstractFishTechnique {
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

    protected findInUnits(context: CandidateContext, value: number, base: FinnedFishBaseType): TechniqueResultInterface[] {
        const coverIndexes = this.getUniqueValues(base.units.flatMap(unit => this.getCoverIndexes(context, unit, value, base.coverType)));

        if (coverIndexes.length !== this.size) {
            return [];
        }

        const eliminations = this.getFishEliminations(context, base.units, value, base.coverType);

        return this.createEliminationResults(
            context,
            this.technique,
            eliminations,
            base.units.flatMap(unit => unit.cells)
        );
    }

    private getCoverIndexes(context: CandidateContext, unit: CandidateUnitInterface, value: number, coverType: LineType): number[] {
        return this.getUniqueValues(
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
        const coverIndexes = this.getUniqueValues(baseUnits.flatMap(unit => this.getCoverIndexes(context, unit, value, coverType)));
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
