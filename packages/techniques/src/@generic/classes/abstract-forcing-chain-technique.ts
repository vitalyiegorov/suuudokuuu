import { isDefined } from '@rnw-community/shared';

import { FORCING_CHAIN_MIN_BRANCHES } from '../constants/forcing-chain-scan.constant';
import { compareChainLengths } from '../utils/compare-chain-lengths.util';
import { getContextHypothesisPropagator, markContextSearchCapped } from '../utils/context-scan-state.util';
import { createForcingChainResults } from '../utils/create-forcing-chain-results.util';
import { getCanonicalTechniqueResults } from '../utils/get-canonical-technique-results.util';
import { getSearchScope } from '../utils/get-search-scope.util';
import { hasForcingChainScanBudget } from '../utils/has-forcing-chain-scan-budget.util';

import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { ForcingChainScanInterface } from '../interfaces/forcing-chain-scan.interface';
import type { HypothesisPropagationInterface } from '../interfaces/hypothesis-propagation.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../interfaces/technique-strategy.interface';
import type { CandidateContext } from './candidate-context/candidate-context';

export abstract class AbstractForcingChainTechnique implements TechniqueStrategyInterface {
    abstract readonly technique: SolutionTechniqueEnum;

    find(context: CandidateContext, searchTarget?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const scan: ForcingChainScanInterface = {
            context,
            propagator: getContextHypothesisPropagator(context),
            scope: getSearchScope(context, searchTarget),
            results: [],
            propagationKeys: new Set<number>()
        };

        this.collectResults(scan);

        return isDefined(scan.scope.directTarget) ? scan.results : getCanonicalTechniqueResults(scan.results).sort(compareChainLengths);
    }

    protected collectBranchResults(
        scan: ForcingChainScanInterface,
        branchCount: number,
        propagateBranch: (branchIndex: number) => HypothesisPropagationInterface
    ): boolean {
        if (branchCount < FORCING_CHAIN_MIN_BRANCHES) {
            return true;
        }

        if (!hasForcingChainScanBudget(scan, branchCount)) {
            markContextSearchCapped(scan.context);

            return false;
        }

        const propagations = Array.from({ length: branchCount }, (_, branchIndex) => propagateBranch(branchIndex));

        scan.results.push(...createForcingChainResults(this.technique, scan.propagator.getBoard(), propagations, scan.scope));

        return !isDefined(scan.scope.directTarget) || scan.results.length === 0;
    }

    protected abstract collectResults(scan: ForcingChainScanInterface): void;
}
