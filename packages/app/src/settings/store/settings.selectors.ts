import { createSelector } from '@reduxjs/toolkit';

import type { SettingsState } from './settings.state';
import type { RootState } from '../../@generic/app-root.store';

const settingsSelector = (state: RootState) => state.settings;

export const settingsKeySelector = (
    key: keyof Pick<
        SettingsState,
        | 'hasVibration'
        | 'hasTimer'
        | 'showComboAnimation'
        | 'showAreas'
        | 'showIdenticalNumbers'
        | 'isDarkColorSchema'
        | 'showFilledNumbers'
        | 'showActiveCandidates'
        | 'keepActiveCell'
        | 'keepExhaustedDigits'
        | 'isLeftHanded'
        | 'calmMode'
    >
) => createSelector(settingsSelector, state => state[key]);
export const settingsComfortModeSelector = createSelector(settingsSelector, state => state.comfortMode);
export const settingsComfortModeOfferVisibleSelector = createSelector(
    settingsSelector,
    state => state.comfortMode === 'off' && !state.comfortModeOfferDismissed
);
export const settingsMotionPreferenceSelector = createSelector(settingsSelector, state => state.motionPreference);
export const settingsFontSizeSelector = createSelector(settingsSelector, state => state.fontSize);
export const settingsFontSizeMultiplierSelector = createSelector(
    settingsSelector,
    // eslint-disable-next-line id-length
    state => ({ xs: 0.6, s: 0.8, m: 1.25, xl: 1.75 })[state.fontSize]
);
export const settingsCellMarginSelector = createSelector(settingsSelector, state => state.cellMargin);
export const settingsLastGameDifficultySelector = createSelector(settingsSelector, state => state.lastGameDifficulty);
export const settingsLastGameChallengeModeSelector = createSelector(settingsSelector, state => state.lastGameChallengeMode);
export const settingsLastGameMaxMistakesSelector = createSelector(settingsSelector, state => state.lastGameMaxMistakes);
export const settingsLanguageSelector = createSelector(settingsSelector, state => state.language);
export const settingsThemeSelector = createSelector(settingsSelector, state => state.theme);
