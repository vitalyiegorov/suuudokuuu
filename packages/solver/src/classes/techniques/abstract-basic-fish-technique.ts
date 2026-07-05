import { AbstractTechnique } from './abstract-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { LineType } from '../../types/line.type';

export abstract class AbstractBasicFishTechnique extends AbstractTechnique {
    abstract readonly technique: SolutionTechniqueEnum;
    protected abstract readonly size: number;

    find(context: CandidateContext): TechniqueResultInterface[] {
        return [...this.findByBaseType(context, 'row'), ...this.findByBaseType(context, 'column')];
    }

    private findByBaseType(context: CandidateContext, baseType: LineType): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const baseUnits = context.getUnits().filter(unit => unit.type === baseType);
        const coverType = baseType === 'row' ? 'column' : 'row';

        for (const value of context.getValues()) {
            const candidateUnits = baseUnits.filter(unit => {
                const coverIndexes = this.getCoverIndexes(context, unit, value, coverType);

                return coverIndexes.length >= 2 && coverIndexes.length <= this.size;
            });

            for (const units of this.getCombinations(candidateUnits, this.size)) {
                const coverIndexes = this.getUniqueValues(units.flatMap(unit => this.getCoverIndexes(context, unit, value, coverType)));

                if (coverIndexes.length === this.size) {
                    const eliminations = this.getFishEliminations(context, units, value, coverType);

                    results.push(
                        ...this.createEliminationResults(
                            context,
                            this.technique,
                            eliminations,
                            units.flatMap(unit => unit.cells)
                        )
                    );
                }
            }
        }

        return results;
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
