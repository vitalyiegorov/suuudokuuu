import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';

export const getSearchEliminationValues = (context: CandidateContext, target?: TechniqueSearchTargetInterface): number[] => {
    if (!target) {
        return context.getValues();
    }

    return context
        .getCandidates(target.cell)
        .filter(value => value !== target.value)
        .sort((firstValue, secondValue) => firstValue - secondValue);
};
