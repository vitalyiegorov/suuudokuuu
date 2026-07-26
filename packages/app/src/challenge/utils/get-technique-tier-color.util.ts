import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import type { ThemeInterface } from '@suuudokuuu/ui';

type TierColorSurface = 'default' | 'inverted';
type TierColorResolver = (theme: ThemeInterface) => string;

const tierColorResolvers: Record<TierColorSurface, Record<ChallengeTechniqueTierEnum, TierColorResolver>> = {
    default: {
        [ChallengeTechniqueTierEnum.Guess]: theme => theme.colors.red,
        [ChallengeTechniqueTierEnum.Advanced]: theme => theme.colors.blue,
        [ChallengeTechniqueTierEnum.Clever]: theme => theme.colors.label.main,
        [ChallengeTechniqueTierEnum.Basic]: theme => theme.colors.label.hint
    },
    inverted: {
        [ChallengeTechniqueTierEnum.Guess]: theme => theme.colors.red,
        [ChallengeTechniqueTierEnum.Advanced]: theme => theme.colors.blue,
        [ChallengeTechniqueTierEnum.Clever]: theme => theme.colors.label.inverted,
        [ChallengeTechniqueTierEnum.Basic]: theme => theme.colors.white05
    }
};

export const getTechniqueTierColor = (
    tier: ChallengeTechniqueTierEnum,
    theme: ThemeInterface,
    surface: TierColorSurface = 'default'
): string => tierColorResolvers[surface][tier](theme);
