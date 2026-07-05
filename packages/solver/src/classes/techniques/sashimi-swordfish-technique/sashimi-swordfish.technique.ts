import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractFinnedFishTechnique } from '../abstract-finned-fish-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { FinnedFishScanType } from '../../../types/finned-fish-scan.type';

export class SashimiSwordfishTechnique extends AbstractFinnedFishTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.SashimiSwordfish;
    protected readonly size = 3;

    protected isMatchingScan(scan: FinnedFishScanType): boolean {
        return this.isSashimiFish(scan);
    }
}
