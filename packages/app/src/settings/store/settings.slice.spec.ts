import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { settingsSetAction } from './settings.actions';
import { settingsSlice } from './settings.slice';
import { initialSettingsState } from './settings.state';

const DefaultMaxMistakes = 3;

jest.mock('react-native', () => ({
    Appearance: {
        getColorScheme: () => 'light'
    }
}));

jest.mock('../../@generic/utils/i18n.util', () => ({
    i18nGetOSLocale: () => 'en'
}));

describe('settingsSlice', () => {
    it('stores the last game setup selection in settings', () => {
        const nextState = settingsSlice.reducer(
            initialSettingsState,
            settingsSetAction({
                lastGameDifficulty: DifficultyEnum.Hard,
                lastGameMaxMistakes: 0,
                lastStatsDifficulty: DifficultyEnum.Nightmare
            })
        );

        expect(nextState.lastGameDifficulty).toBe(DifficultyEnum.Hard);
        expect(nextState.lastGameMaxMistakes).toBe(0);
        expect(nextState.lastStatsDifficulty).toBe(DifficultyEnum.Nightmare);
    });

    it('defaults to the standard new game setup', () => {
        expect(initialSettingsState.lastGameDifficulty).toBe(DifficultyEnum.Easy);
        expect(initialSettingsState.lastGameMaxMistakes).toBe(DefaultMaxMistakes);
        expect(initialSettingsState.lastStatsDifficulty).toBe(DifficultyEnum.Easy);
    });

    it('defaults to keeping completed digits dimmed in the numpad', () => {
        expect(initialSettingsState.keepExhaustedDigits).toBe(true);
    });

    it('updates keepExhaustedDigits when the setting is toggled off', () => {
        const nextState = settingsSlice.reducer(initialSettingsState, settingsSetAction({ keepExhaustedDigits: false }));

        expect(nextState.keepExhaustedDigits).toBe(false);
    });

    it('defaults to the right-handed landscape layout', () => {
        expect(initialSettingsState.isLeftHanded).toBe(false);
    });

    it('updates isLeftHanded when the setting is toggled on', () => {
        const nextState = settingsSlice.reducer(initialSettingsState, settingsSetAction({ isLeftHanded: true }));

        expect(nextState.isLeftHanded).toBe(true);
    });
});
