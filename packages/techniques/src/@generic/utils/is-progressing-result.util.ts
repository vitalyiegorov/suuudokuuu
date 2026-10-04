import { isNotEmptyArray } from '@rnw-community/shared';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

export const isProgressingResult = (context: CandidateContext, result: TechniqueResultInterface): boolean => {
    if (result.kind === 'placement') {
        return isNotEmptyArray(context.getCandidates(result.cell));
    }

    return result.eliminations.some(elimination => context.getCandidates(elimination.cell).includes(elimination.value));
};
