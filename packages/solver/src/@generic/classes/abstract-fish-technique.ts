import { getCombinations } from '../utils/get-combinations.util';
import { getSearchScope } from '../utils/get-search-scope.util';

import { AbstractSizedTechnique } from './abstract-sized-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { CandidateUnitInterface } from '../interfaces/candidate-unit.interface';
import type { SizedTechniqueDescriptorInterface } from '../interfaces/sized-technique-descriptor.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { FinnedFishBaseType } from '../types/finned-fish-base.type';
import type { LineType } from '../types/line.type';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractFishTechnique<
    TDescriptor extends SizedTechniqueDescriptorInterface = SizedTechniqueDescriptorInterface
> extends AbstractSizedTechnique<TDescriptor> {
    find(context: CandidateContext, target?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const { eliminationValues, directTarget } = getSearchScope(context, target);

        return [
            ...this.findByBaseType(context, 'row', eliminationValues, directTarget?.cell),
            ...this.findByBaseType(context, 'column', eliminationValues, directTarget?.cell)
        ];
    }

    protected getCandidateUnits(
        context: CandidateContext,
        baseUnits: CandidateUnitInterface[],
        value: number,
        _coverType: LineType
    ): CandidateUnitInterface[] {
        return baseUnits.filter(unit => unit.cells.some(cell => context.getCandidates(cell).includes(value)));
    }

    private findByBaseType(
        context: CandidateContext,
        baseType: LineType,
        values: number[] = context.getValues(),
        targetCell?: CellInterface
    ): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const baseUnits = context.getUnits().filter(unit => unit.type === baseType);
        const coverType = baseType === 'row' ? 'column' : 'row';

        for (const value of values) {
            const candidateUnits = this.getCandidateUnits(context, baseUnits, value, coverType).filter(
                unit => !this.isTargetBaseUnit(unit, targetCell)
            );

            for (const units of getCombinations(candidateUnits, this.size)) {
                results.push(...this.findInUnits(context, value, { units, baseType, coverType }, targetCell));
            }
        }

        return results;
    }

    private isTargetBaseUnit(unit: CandidateUnitInterface, targetCell?: CellInterface): boolean {
        return targetCell?.[unit.type === 'row' ? 'y' : 'x'] === unit.index;
    }

    protected abstract findInUnits(
        context: CandidateContext,
        value: number,
        base: FinnedFishBaseType,
        targetCell?: CellInterface
    ): TechniqueResultInterface[];
}
