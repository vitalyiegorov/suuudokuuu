import { AbstractFinnedFishTechnique } from '../../@generic/classes/abstract-finned-fish-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { FinnedFishScanType } from '../../@generic/types/finned-fish-scan.type';

export class FinnedSwordfishTechnique extends AbstractFinnedFishTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.FinnedSwordfish;
    protected readonly size = 3;

    protected isMatchingScan(scan: FinnedFishScanType): boolean {
        return !this.isSashimiFish(scan);
    }
}
