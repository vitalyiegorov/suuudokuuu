/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { initialGameState } from '../../game/store/game.state';
import { ThemeEnum } from '../../theme/enum/theme.enum';

import {
    settingsCellMarginSelector,
    settingsFontSizeMultiplierSelector,
    settingsFontSizeSelector,
    settingsKeySelector,
    settingsLanguageSelector,
    settingsLastGameChallengeModeSelector,
    settingsLastGameDifficultySelector,
    settingsLastGameMaxMistakesSelector,
    settingsThemeSelector
} from './settings.selectors';
import { initialSettingsState } from './settings.state';

import type { SettingsState } from './settings.state';
import type { RootState } from '../../@generic/app-root.store';

jest.mock('react-native', () => ({
    Appearance: {
        getColorScheme: () => 'light'
    }
}));

jest.mock('../../@generic/utils/i18n.util', () => ({
    i18nGetOSLocale: () => 'en'
}));

const state: SettingsState = {
    ...initialSettingsState,
    cellMargin: 2,
    fontSize: 'xl',
    hasVibration: false,
    isLeftHanded: true,
    language: 'uk',
    lastGameChallengeMode: true,
    lastGameDifficulty: DifficultyEnum.Nightmare,
    lastGameMaxMistakes: 0,
    theme: ThemeEnum.Newspaper
};

describe('settings selectors', () => {
    it('should read the settings slice out of the root state', () => {
        expect.assertions(1);

        const rootState: RootState = { game: initialGameState, settings: state };

        expect(settingsThemeSelector(rootState)).toBe(ThemeEnum.Newspaper);
    });

    it('should read a boolean preference by key', () => {
        expect.assertions(2);

        expect(settingsKeySelector('hasVibration').resultFunc(state)).toBe(false);
        expect(settingsKeySelector('isLeftHanded').resultFunc(state)).toBe(true);
    });

    it('should read the stored font size and its multiplier', () => {
        expect.assertions(2);

        expect(settingsFontSizeSelector.resultFunc(state)).toBe('xl');
        expect(settingsFontSizeMultiplierSelector.resultFunc(state)).toBe(1.75);
    });

    it('should map every font size to a multiplier', () => {
        expect.assertions(4);

        expect(settingsFontSizeMultiplierSelector.resultFunc({ ...state, fontSize: 'xs' })).toBe(0.6);
        expect(settingsFontSizeMultiplierSelector.resultFunc({ ...state, fontSize: 's' })).toBe(0.8);
        expect(settingsFontSizeMultiplierSelector.resultFunc({ ...state, fontSize: 'm' })).toBe(1.25);
        expect(settingsFontSizeMultiplierSelector.resultFunc({ ...state, fontSize: 'xl' })).toBe(1.75);
    });

    it('should read the remaining preferences', () => {
        expect.assertions(6);

        expect(settingsCellMarginSelector.resultFunc(state)).toBe(2);
        expect(settingsLanguageSelector.resultFunc(state)).toBe('uk');
        expect(settingsThemeSelector.resultFunc(state)).toBe(ThemeEnum.Newspaper);
        expect(settingsLastGameDifficultySelector.resultFunc(state)).toBe(DifficultyEnum.Nightmare);
        expect(settingsLastGameMaxMistakesSelector.resultFunc(state)).toBe(0);
        expect(settingsLastGameChallengeModeSelector.resultFunc(state)).toBe(true);
    });
});
