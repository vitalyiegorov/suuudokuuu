import { isDefined } from '@rnw-community/shared';

import { HypothesisPropagator } from '../classes/hypothesis-propagator/hypothesis-propagator';

import { compareChainLengths } from './compare-chain-lengths.util';
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
        propagator: HypothesisPropagator.fromContext(context),
        scope: getSearchScope(context, searchTarget),
        results: []
    };

    collectForScan(scan);

    if (isDefined(scan.scope.directTarget)) {
        return scan.results;
    }

    return getCanonicalTechniqueResults(scan.results).sort(compareChainLengths);
};
