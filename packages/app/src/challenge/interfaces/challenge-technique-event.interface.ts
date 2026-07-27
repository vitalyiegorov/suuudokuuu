import type { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';
import type { SolutionTechniqueEnum } from '@suuudokuuu/solver';

export interface ChallengeTechniqueEventInterface {
    cumulativeTime: number;
    technique: SolutionTechniqueEnum;
    tier: ChallengeTechniqueTierEnum;
}
