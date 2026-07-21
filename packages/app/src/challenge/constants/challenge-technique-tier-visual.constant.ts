import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

interface TierVisual {
    height: number;
    width: number;
}

export const challengeTechniqueTierVisualConstant: Record<ChallengeTechniqueTierEnum, TierVisual> = {
    [ChallengeTechniqueTierEnum.Basic]: { height: 6, width: 2 },
    [ChallengeTechniqueTierEnum.Clever]: { height: 12, width: 3 },
    [ChallengeTechniqueTierEnum.Advanced]: { height: 18, width: 3 },
    [ChallengeTechniqueTierEnum.Guess]: { height: 9, width: 2 }
};
