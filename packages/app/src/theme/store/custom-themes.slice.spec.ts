import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { CustomThemeSchemaVersion } from '../schema/custom-theme.schema';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';

import { customThemesRemoveAction, customThemesUpsertAction } from './custom-themes.actions';
import { customThemesSlice } from './custom-themes.slice';
import { initialCustomThemesState } from './custom-themes.state';

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

describe('customThemesSlice', () => {
    it('adds a new theme on upsert', () => {
        const state = customThemesSlice.reducer(initialCustomThemesState, customThemesUpsertAction(sampleTheme));

        expect(state.themes).toEqual([sampleTheme]);
    });

    it('replaces an existing theme with the same id on upsert', () => {
        const seeded = customThemesSlice.reducer(initialCustomThemesState, customThemesUpsertAction(sampleTheme));
        const renamed = { ...sampleTheme, name: 'Renamed', updatedAt: 2 };
        const state = customThemesSlice.reducer(seeded, customThemesUpsertAction(renamed));

        expect(state.themes).toEqual([renamed]);
    });

    it('removes a theme by id', () => {
        const seeded = customThemesSlice.reducer(initialCustomThemesState, customThemesUpsertAction(sampleTheme));
        const state = customThemesSlice.reducer(seeded, customThemesRemoveAction({ id: sampleTheme.id }));

        expect(state.themes).toEqual([]);
    });

    it('leaves the state unchanged when removing a non-existent id', () => {
        const seeded = customThemesSlice.reducer(initialCustomThemesState, customThemesUpsertAction(sampleTheme));
        const state = customThemesSlice.reducer(seeded, customThemesRemoveAction({ id: 'custom-missing' }));

        expect(state.themes).toEqual(seeded.themes);
    });
});
