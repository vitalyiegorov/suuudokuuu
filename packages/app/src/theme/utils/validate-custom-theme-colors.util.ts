import { isDefined } from '@rnw-community/shared';

import { ThemeContrastPairs } from '../constant/theme-contrast-pairs.constant';

import { compositeColors } from './composite-colors.util';
import { getContrastRatio } from './get-contrast-ratio.util';
import { parseColor } from './parse-color.util';

import type { ThemeContrastIssueInterface } from '../interface/theme-contrast-issue.interface';
import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const OpaqueWhite = { red: 255, green: 255, blue: 255, alpha: 1 };

export const validateCustomThemeColors = (colors: ThemeInterface['colors']): readonly ThemeContrastIssueInterface[] => {
    const parsedPageBackground = parseColor(colors.background) ?? OpaqueWhite;

    return ThemeContrastPairs.map(pair => {
        const parsedForeground = parseColor(pair.getForeground(colors));
        const parsedBackground = parseColor(pair.getBackground(colors));

        if (!isDefined(parsedForeground) || !isDefined(parsedBackground)) {
            return null;
        }

        const effectiveBackground = compositeColors(parsedBackground, parsedPageBackground);
        const effectiveForeground = compositeColors(parsedForeground, effectiveBackground);
        const contrastRatio = getContrastRatio(effectiveForeground, effectiveBackground);

        if (contrastRatio >= pair.minimumRatio) {
            return null;
        }

        return {
            foregroundKey: pair.foregroundKey,
            backgroundKey: pair.backgroundKey,
            contrastRatio,
            minimumRatio: pair.minimumRatio
        };
    }).filter(isDefined);
};
