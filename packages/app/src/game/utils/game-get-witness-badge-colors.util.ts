import { compositeColors, getContrastRatio, parseColor } from '@suuudokuuu/ui/theme';

import type { ParsedColorInterface, ThemeInterface } from '@suuudokuuu/ui/theme';

const opaqueWhite: ParsedColorInterface = { red: 255, green: 255, blue: 255, alpha: 1 };

const formatColor = ({ red, green, blue }: ParsedColorInterface): string =>
    `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;

export const gameGetWitnessBadgeColors = ({ colors }: Pick<ThemeInterface, 'colors'>) => {
    const surface = compositeColors(parseColor(colors.surface.raised) ?? opaqueWhite, opaqueWhite);
    const fill = compositeColors(parseColor(colors.accent) ?? surface, surface);
    const primaryText = compositeColors(parseColor(colors.text.primary) ?? surface, fill);
    const isPrimaryTextLegible = getContrastRatio(primaryText, fill) >= getContrastRatio(surface, fill);

    return {
        fill: formatColor(fill),
        text: isPrimaryTextLegible ? colors.text.primary : formatColor(surface)
    };
};
