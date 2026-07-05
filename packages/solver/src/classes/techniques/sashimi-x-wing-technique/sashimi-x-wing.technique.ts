import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractFinnedFishTechnique } from '../abstract-finned-fish-technique';

import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { FinnedFishScanType } from '../../../types/finned-fish-scan.type';

export class SashimiXWingTechnique extends AbstractFinnedFishTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.SashimiXWing;
    protected readonly size = 2;

    protected isMatchingScan(scan: FinnedFishScanType): boolean {
        return this.isSashimiFish(scan);
    }
}
