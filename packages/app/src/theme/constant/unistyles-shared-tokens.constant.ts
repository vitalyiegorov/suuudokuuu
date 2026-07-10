import { ContentWidthConstant, RadiusConstant, SpacingConstant, TypographyConstant } from '@suuudokuuu/ui';

import type { UnistylesThemeInterface } from '@suuudokuuu/ui';

export const UnistylesSharedTokensConstant: Omit<UnistylesThemeInterface, 'colors'> = {
    spacing: SpacingConstant,
    typography: TypographyConstant,
    radius: RadiusConstant,
    contentWidth: ContentWidthConstant
};
