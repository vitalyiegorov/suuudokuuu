import { use } from 'react';

import { TechniqueGlyph } from '../../../challenge/components/technique-glyph/technique-glyph';
import { getTechniqueTierColor } from '../../../challenge/utils/get-technique-tier-color.util';
import { getTechniqueTier } from '../../../challenge/utils/get-technique-tier.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
    readonly size: number;
    readonly gap: number;
}

export const HistoryTechniqueTierGlyph = ({ technique, size, gap }: Props) => {
    const { theme } = use(ThemeContext);

    const tier = getTechniqueTier(technique);

    return (
        <TechniqueGlyph
            accentColor={theme.colors.danger}
            dimColor={theme.colors.overlayDark}
            gap={gap}
            litColor={getTechniqueTierColor(tier, theme, 'inverted')}
            size={size}
            technique={technique}
        />
    );
};
