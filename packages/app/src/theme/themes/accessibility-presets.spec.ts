import { describe, expect, it } from '@jest/globals';

import { isDefined } from '@rnw-community/shared';

import { parseColor } from '../utils/parse-color.util';

import { ColorVisionDeficiencyEnum } from './color-vision-deficiency.mock';
import { ColorblindSafeDarkTheme, ColorblindSafeLightTheme } from './colorblind-safe.theme';
import { getColorDifference, getLightnessDifference } from './get-color-difference.mock';
import { HighContrastDarkTheme, HighContrastLightTheme } from './high-contrast.theme';
import { simulateColorVisionDeficiency } from './simulate-color-vision-deficiency.mock';

import type { ParsedColorInterface } from '../utils/parse-color.util';
import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const MinimumStateColorDifference = 15;
const MinimumStateLightnessDifference = 8;
const MinimumFilledCellDifference = 5;

const accessibilityThemes: readonly (readonly [string, ThemeInterface])[] = [
    ['HighContrast light', HighContrastLightTheme],
    ['HighContrast dark', HighContrastDarkTheme],
    ['ColorblindSafe light', ColorblindSafeLightTheme],
    ['ColorblindSafe dark', ColorblindSafeDarkTheme]
];

const parseThemeColor = (color: string): ParsedColorInterface => {
    const parsed = parseColor(color);

    if (!isDefined(parsed)) {
        throw new Error(`Theme color cannot be parsed: ${color}`);
    }

    return parsed;
};

const getStateColors = (theme: ThemeInterface): readonly (readonly [string, ParsedColorInterface])[] => [
    ['selected', parseThemeColor(theme.colors.board.selected)],
    ['sameValue', parseThemeColor(theme.colors.board.sameValue)],
    ['error', parseThemeColor(theme.colors.board.error)],
    ['given', parseThemeColor(theme.colors.surface.raised)]
];

const statePairs = accessibilityThemes.flatMap(([themeName, theme]) => {
    const stateColors = getStateColors(theme);

    return stateColors.flatMap(([firstName, firstColor], firstIndex) =>
        stateColors
            .slice(firstIndex + 1)
            .map(([secondName, secondColor]): [string, ParsedColorInterface, ParsedColorInterface] => [
                `${themeName}: ${firstName} vs ${secondName}`,
                firstColor,
                secondColor
            ])
    );
});

const simulatedStatePairs = statePairs.flatMap(([label, firstColor, secondColor]) =>
    Object.values(ColorVisionDeficiencyEnum).map((deficiency): [string, ParsedColorInterface, ParsedColorInterface] => [
        `${label} (${deficiency})`,
        simulateColorVisionDeficiency(firstColor, deficiency),
        simulateColorVisionDeficiency(secondColor, deficiency)
    ])
);

const highlightPairs = accessibilityThemes.flatMap(([themeName, theme]) => {
    const stateColors = getStateColors(theme).filter(([stateName]) => stateName !== 'given');

    return stateColors.flatMap(([firstName, firstColor], firstIndex) =>
        stateColors
            .slice(firstIndex + 1)
            .map(([secondName, secondColor]): [string, ParsedColorInterface, ParsedColorInterface] => [
                `${themeName}: ${firstName} vs ${secondName}`,
                firstColor,
                secondColor
            ])
    );
});

describe('accessibility theme presets', () => {
    it.each(statePairs)('%s stays apart for normal color vision', (_label, firstColor, secondColor) => {
        expect(getColorDifference(firstColor, secondColor)).toBeGreaterThanOrEqual(MinimumStateColorDifference);
    });

    it.each(simulatedStatePairs)('%s stays apart under simulated color vision deficiency', (_label, firstColor, secondColor) => {
        expect(getColorDifference(firstColor, secondColor)).toBeGreaterThanOrEqual(MinimumStateColorDifference);
    });

    it.each(highlightPairs)('%s stays apart by lightness alone', (_label, firstColor, secondColor) => {
        expect(getLightnessDifference(firstColor, secondColor)).toBeGreaterThanOrEqual(MinimumStateLightnessDifference);
    });

    it.each(accessibilityThemes)('%s tints filled cells apart from given cells', (_themeName, theme) => {
        const filled = parseThemeColor(theme.colors.board.filled);
        const given = parseThemeColor(theme.colors.surface.raised);

        expect(getColorDifference(filled, given)).toBeGreaterThanOrEqual(MinimumFilledCellDifference);
    });

    it.each(accessibilityThemes)('%s marks a wrong cell with a non-color outline', (_themeName, theme) => {
        expect(theme.hasErrorOutline).toBe(true);
    });
});
