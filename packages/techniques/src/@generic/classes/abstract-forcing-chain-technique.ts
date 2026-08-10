import { collectForcingChainResults } from '../utils/collect-forcing-chain-results.util';

import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { ForcingChainScanInterface } from '../interfaces/forcing-chain-scan.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../interfaces/technique-strategy.interface';
import type { CandidateContext } from './candidate-context/candidate-context';

export abstract class AbstractForcingChainTechnique implements TechniqueStrategyInterface {
    abstract readonly technique: SolutionTechniqueEnum;

    find(context: CandidateContext, searchTarget?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        return collectForcingChainResults(context, searchTarget, scan => void this.collectResults(scan));
    }

    protected abstract collectResults(scan: ForcingChainScanInterface): void;
}
