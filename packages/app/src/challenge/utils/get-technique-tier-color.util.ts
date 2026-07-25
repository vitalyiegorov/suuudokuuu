import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import type { ThemeInterface } from '@suuudokuuu/ui';

type TierColorSurface = 'default' | 'inverted';

export const getTechniqueTierColor = (
    tier: ChallengeTechniqueTierEnum,
    theme: ThemeInterface,
    surface: TierColorSurface = 'default'
): string => {
    const isInverted = surface === 'inverted';

    if (tier === ChallengeTechniqueTierEnum.Guess) {
        return theme.colors.red;
    }

    if (tier === ChallengeTechniqueTierEnum.Advanced) {
        return theme.colors.blue;
    }

    if (tier === ChallengeTechniqueTierEnum.Clever) {
        return isInverted ? theme.colors.label.inverted : theme.colors.label.main;
    }

    return isInverted ? theme.colors.white05 : theme.colors.label.hint;
};
