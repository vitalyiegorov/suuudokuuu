import { ContentWidthConstant, RadiusConstant, SpacingConstant, TypographyConstant } from '@suuudokuuu/ui/theme';

import type { UnistylesThemeInterface } from '@suuudokuuu/ui/theme';

export const UnistylesSharedTokensConstant: Omit<UnistylesThemeInterface, 'colors'> = {
    spacing: SpacingConstant,
    typography: TypographyConstant,
    radius: RadiusConstant,
    contentWidth: ContentWidthConstant
};
