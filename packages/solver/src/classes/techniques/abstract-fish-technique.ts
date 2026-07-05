import { AbstractTechnique } from './abstract-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CandidateUnitInterface } from '../../interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { FinnedFishBaseType } from '../../types/finned-fish-base.type';
import type { LineType } from '../../types/line.type';

export abstract class AbstractFishTechnique extends AbstractTechnique {
    abstract readonly technique: SolutionTechniqueEnum;
    protected abstract readonly size: number;

    find(context: CandidateContext): TechniqueResultInterface[] {
        return [...this.findByBaseType(context, 'row'), ...this.findByBaseType(context, 'column')];
    }

    protected getCandidateUnits(
        context: CandidateContext,
        baseUnits: CandidateUnitInterface[],
        value: number,
        _coverType: LineType
    ): CandidateUnitInterface[] {
        return baseUnits.filter(unit => unit.cells.some(cell => context.getCandidates(cell).includes(value)));
    }

    private findByBaseType(context: CandidateContext, baseType: LineType): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const baseUnits = context.getUnits().filter(unit => unit.type === baseType);
        const coverType = baseType === 'row' ? 'column' : 'row';

        for (const value of context.getValues()) {
            const candidateUnits = this.getCandidateUnits(context, baseUnits, value, coverType);

            for (const units of this.getCombinations(candidateUnits, this.size)) {
                results.push(...this.findInUnits(context, value, { units, baseType, coverType }));
            }
        }

        return results;
    }

    protected abstract findInUnits(context: CandidateContext, value: number, base: FinnedFishBaseType): TechniqueResultInterface[];
}
