import { use } from 'react';

import { TechniqueGlyph } from '../../../challenge/components/technique-glyph/technique-glyph';
import { ThemeContext } from '../../../theme/context/theme.context';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
    readonly size: number;
    readonly gap: number;
}

export const HistoryTechniqueGlyph = ({ technique, size, gap }: Props) => {
    const { theme } = use(ThemeContext);

    return (
        <TechniqueGlyph
            accentColor={theme.colors.danger}
            dimColor={theme.colors.surface.border}
            gap={gap}
            litColor={theme.colors.text.primary}
            size={size}
            technique={technique}
        />
    );
};
