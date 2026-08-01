import { isDefined } from '@rnw-community/shared';

import { getCanonicalTechniqueResults } from './get-canonical-technique-results.util';

import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchScopeInterface } from '../interfaces/technique-search-scope.interface';

export const collectChainResults = (
    scope: TechniqueSearchScopeInterface,
    collectForValue: (eliminationValue: number, results: TechniqueResultInterface[]) => void
): TechniqueResultInterface[] => {
    const results: TechniqueResultInterface[] = [];

    for (const eliminationValue of scope.eliminationValues) {
        collectForValue(eliminationValue, results);

        if (isDefined(scope.directTarget) && results.length > 0) {
            return results;
        }
    }

    return isDefined(scope.directTarget) ? results : getCanonicalTechniqueResults(results);
};
