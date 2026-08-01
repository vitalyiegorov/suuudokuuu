import { describe, expect, it } from '@jest/globals';

import { initialGameState } from '../../game/store/game.state';
import { initialSettingsState } from '../../settings/store/settings.state';
import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { CustomThemeSchemaVersion } from '../schema/custom-theme.schema';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';

import { customThemesSelector } from './custom-themes.selectors';

import type { RootState } from '../../@generic/app-root.store';
import type { CustomThemeInterface } from '../interface/custom-theme.interface';

const sampleTheme: CustomThemeInterface = {
    id: 'custom-sample',
    name: 'Sample',
    schemaVersion: CustomThemeSchemaVersion,
    sourceTheme: ThemeEnum.BlackAndWhite,
    colors: { [ColorSchemaEnum.Light]: BWLightTheme.colors, [ColorSchemaEnum.Dark]: BWDarkTheme.colors },
    createdAt: 1,
    updatedAt: 1
};

describe('customThemesSelector', () => {
    it('should read the stored custom themes out of the root state', () => {
        expect.assertions(1);

        const rootState: RootState = {
            game: initialGameState,
            settings: initialSettingsState,
            customThemes: { themes: [sampleTheme] }
        };

        expect(customThemesSelector(rootState)).toEqual([sampleTheme]);
    });
});
