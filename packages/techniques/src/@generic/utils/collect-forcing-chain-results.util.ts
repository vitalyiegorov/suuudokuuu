import { isDefined } from '@rnw-community/shared';

import { compareChainLengths } from './compare-chain-lengths.util';
import { getContextHypothesisPropagator } from './context-scan-state.util';
import { getCanonicalTechniqueResults } from './get-canonical-technique-results.util';
import { getSearchScope } from './get-search-scope.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { ForcingChainScanInterface } from '../interfaces/forcing-chain-scan.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';

export const collectForcingChainResults = (
    context: CandidateContext,
    searchTarget: TechniqueSearchTargetInterface | undefined,
    collectForScan: (scan: ForcingChainScanInterface) => void
): TechniqueResultInterface[] => {
    const scan: ForcingChainScanInterface = {
        context,
        propagator: getContextHypothesisPropagator(context),
        scope: getSearchScope(context, searchTarget),
        results: [],
        propagationKeys: new Set<number>()
    };

    collectForScan(scan);

    if (isDefined(scan.scope.directTarget)) {
        return scan.results;
    }

    return getCanonicalTechniqueResults(scan.results).sort(compareChainLengths);
};
