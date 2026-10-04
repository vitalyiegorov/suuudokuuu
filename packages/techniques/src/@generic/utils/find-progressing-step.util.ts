import { isDefined } from '@rnw-community/shared';

import { isProgressingResult } from './is-progressing-result.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../interfaces/technique-strategy.interface';

export const findProgressingStep = (
    context: CandidateContext,
    strategies: TechniqueStrategyInterface[]
): TechniqueResultInterface | null => {
    if (context.hasContradiction() || context.isSolved()) {
        return null;
    }

    for (const strategy of strategies) {
        const result = strategy.find(context).find(candidate => isProgressingResult(context, candidate));

        if (isDefined(result)) {
            return result;
        }
    }

    return null;
};
