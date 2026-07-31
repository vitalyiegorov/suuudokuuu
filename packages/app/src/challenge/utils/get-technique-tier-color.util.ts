import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import type { ThemeInterface } from '@suuudokuuu/ui';

type TierColorSurface = 'default' | 'inverted';
type TierColorResolver = (theme: ThemeInterface) => string;

const tierColorResolvers: Record<TierColorSurface, Record<ChallengeTechniqueTierEnum, TierColorResolver>> = {
    default: {
        [ChallengeTechniqueTierEnum.Guess]: theme => theme.colors.danger,
        [ChallengeTechniqueTierEnum.Advanced]: theme => theme.colors.accent,
        [ChallengeTechniqueTierEnum.Clever]: theme => theme.colors.text.primary,
        [ChallengeTechniqueTierEnum.Basic]: theme => theme.colors.text.hint
    },
    inverted: {
        [ChallengeTechniqueTierEnum.Guess]: theme => theme.colors.danger,
        [ChallengeTechniqueTierEnum.Advanced]: theme => theme.colors.accent,
        [ChallengeTechniqueTierEnum.Clever]: theme => theme.colors.inkText,
        [ChallengeTechniqueTierEnum.Basic]: theme => theme.colors.overlayDark
    }
};

export const getTechniqueTierColor = (
    tier: ChallengeTechniqueTierEnum,
    theme: ThemeInterface,
    surface: TierColorSurface = 'default'
): string => tierColorResolvers[surface][tier](theme);
