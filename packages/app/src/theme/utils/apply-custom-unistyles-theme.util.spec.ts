import { describe, expect, it } from '@jest/globals';

import { UnistylesThemesConstant } from '../constant/unistyles-themes.constant';
import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';

import { applyCustomUnistylesTheme } from './apply-custom-unistyles-theme.util';
import { createCustomTheme } from './create-custom-theme.util';

import type { UnistylesThemeNameType } from '../constant/unistyles-themes.constant';

const createdAt = 1;

describe('applyCustomUnistylesTheme', () => {
    it('updates both custom slots with the theme variant colors', () => {
        const customTheme = createCustomTheme('Mine', ThemeEnum.Colorful, [], createdAt);
        let customLightUpdate: unknown;
        let customDarkUpdate: unknown;
        const runtime = {
            updateTheme: (themeName: UnistylesThemeNameType, updater: (current: typeof UnistylesThemesConstant.customLight) => unknown) => {
                if (themeName === 'customDark') {
                    customDarkUpdate = updater(UnistylesThemesConstant.customDark);
                } else {
                    customLightUpdate = updater(UnistylesThemesConstant.customLight);
                }
            }
        };

        applyCustomUnistylesTheme(runtime, customTheme);

        expect(customLightUpdate).toMatchObject({ colors: customTheme.colors[ColorSchemaEnum.Light] });
        expect(customDarkUpdate).toMatchObject({ colors: customTheme.colors[ColorSchemaEnum.Dark] });
    });
});
