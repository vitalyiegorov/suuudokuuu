import { getSearchEliminationValues } from './get-search-elimination-values.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { TechniqueSearchScopeInterface } from '../interfaces/technique-search-scope.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';

export const getSearchScope = (context: CandidateContext, target?: TechniqueSearchTargetInterface): TechniqueSearchScopeInterface => ({
    eliminationValues: getSearchEliminationValues(context, target),
    ...(target?.intent === 'direct' && { directTarget: target })
});
