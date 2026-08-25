import { describe, expect, it, jest } from '@jest/globals';

import { ThemeEnum } from '../../theme/enum/theme.enum';
import { ComfortModeSettings } from '../constant/comfort-mode.constant';
import { RelaxedMaxMistakesConstant } from '../constant/max-mistakes.constant';

import { settingsSetAction, settingsSetComfortModeAction } from './settings.actions';
import { settingsSlice } from './settings.slice';
import { initialSettingsState } from './settings.state';

import type { SettingsState } from './settings.state';

jest.mock('react-native', () => ({
    Appearance: {
        getColorScheme: () => 'light'
    }
}));

jest.mock('../../@generic/utils/i18n.util', () => ({
    i18nGetOSLocale: () => 'en'
}));

const strainedState: SettingsState = {
    ...initialSettingsState,
    calmMode: false,
    cellMargin: 0,
    fontSize: 's',
    hasTimer: true,
    keepActiveCell: false,
    motionPreference: 'full',
    showActiveCandidates: false,
    showAreas: false,
    showFilledNumbers: false,
    showIdenticalNumbers: false,
    theme: ThemeEnum.Colorful
};

const enableComfortMode = (state: SettingsState): SettingsState => settingsSlice.reducer(state, settingsSetComfortModeAction(true));

const disableComfortMode = (state: SettingsState): SettingsState => settingsSlice.reducer(state, settingsSetComfortModeAction(false));

describe('comfort mode preset', () => {
    it('is off by default and never nudges an untouched install', () => {
        expect(initialSettingsState.comfortMode).toBe('off');
        expect(initialSettingsState.comfortModeRestore).toBeNull();
        expect(initialSettingsState.comfortModeOfferDismissed).toBe(false);
    });

    it('applies the whole bundle when it is turned on', () => {
        const nextState = enableComfortMode(strainedState);

        expect(nextState).toMatchObject(ComfortModeSettings);
        expect(nextState.comfortMode).toBe('on');
    });

    it('keeps the light and dark choice and the untouched preferences', () => {
        const darkState = { ...strainedState, isDarkColorSchema: true, keepExhaustedDigits: false, showComboAnimation: true };
        const nextState = enableComfortMode(darkState);

        expect(nextState.isDarkColorSchema).toBe(true);
        expect(nextState.keepExhaustedDigits).toBe(false);
        expect(nextState.showComboAnimation).toBe(true);
    });

    it('dismisses the home screen offer once the preset is used', () => {
        expect(enableComfortMode(strainedState).comfortModeOfferDismissed).toBe(true);
    });

    it('nudges the mistake preset to Relaxed only while it sits on the default', () => {
        expect(enableComfortMode(strainedState).lastGameMaxMistakes).toBe(RelaxedMaxMistakesConstant);
        expect(enableComfortMode({ ...strainedState, lastGameMaxMistakes: 0 }).lastGameMaxMistakes).toBe(0);
    });

    it('restores every captured value when it is turned off', () => {
        const restoredState = disableComfortMode(enableComfortMode(strainedState));

        expect(restoredState).toMatchObject({
            calmMode: false,
            cellMargin: 0,
            fontSize: 's',
            hasTimer: true,
            keepActiveCell: false,
            lastGameMaxMistakes: initialSettingsState.lastGameMaxMistakes,
            motionPreference: 'full',
            showActiveCandidates: false,
            showAreas: false,
            showFilledNumbers: false,
            showIdenticalNumbers: false,
            theme: ThemeEnum.Colorful
        });
        expect(restoredState.comfortMode).toBe('off');
        expect(restoredState.comfortModeRestore).toBeNull();
    });

    it('marks the preset customized instead of fighting a later edit', () => {
        const customizedState = settingsSlice.reducer(enableComfortMode(strainedState), settingsSetAction({ hasTimer: true }));

        expect(customizedState.comfortMode).toBe('customized');
        expect(customizedState.hasTimer).toBe(true);
    });

    it('returns to the on state when the edited setting matches the preset again', () => {
        const customizedState = settingsSlice.reducer(enableComfortMode(strainedState), settingsSetAction({ fontSize: 'm' }));
        const realignedState = settingsSlice.reducer(customizedState, settingsSetAction({ fontSize: 'xl' }));

        expect(customizedState.comfortMode).toBe('customized');
        expect(realignedState.comfortMode).toBe('on');
    });

    it('never flips an off preset to customized when settings change on their own', () => {
        const nextState = settingsSlice.reducer(strainedState, settingsSetAction({ fontSize: 'xl' }));

        expect(nextState.comfortMode).toBe('off');
    });

    it('keeps the edits the player made and restores only what the preset still owns', () => {
        const customizedState = settingsSlice.reducer(
            enableComfortMode(strainedState),
            settingsSetAction({ fontSize: 'm', lastGameMaxMistakes: 0 })
        );
        const restoredState = disableComfortMode(customizedState);

        expect(restoredState.fontSize).toBe('m');
        expect(restoredState.lastGameMaxMistakes).toBe(0);
        expect(restoredState.theme).toBe(ThemeEnum.Colorful);
        expect(restoredState.comfortMode).toBe('off');
    });

    it('leaves every preference alone when the player retuned all of them while the preset was on', () => {
        const retunedPreferences = {
            calmMode: strainedState.calmMode,
            cellMargin: strainedState.cellMargin,
            fontSize: strainedState.fontSize,
            hasTimer: strainedState.hasTimer,
            keepActiveCell: strainedState.keepActiveCell,
            lastGameMaxMistakes: 0,
            motionPreference: strainedState.motionPreference,
            showActiveCandidates: strainedState.showActiveCandidates,
            showAreas: strainedState.showAreas,
            showFilledNumbers: strainedState.showFilledNumbers,
            showIdenticalNumbers: strainedState.showIdenticalNumbers,
            theme: strainedState.theme
        };
        const retunedState = settingsSlice.reducer(enableComfortMode(strainedState), settingsSetAction(retunedPreferences));
        const restoredState = disableComfortMode(retunedState);

        expect(retunedState.comfortMode).toBe('customized');
        expect(restoredState).toMatchObject(retunedPreferences);
        expect(restoredState.comfortMode).toBe('off');
    });

    it('keeps the original snapshot when the preset is reapplied after a customization', () => {
        const customizedState = settingsSlice.reducer(enableComfortMode(strainedState), settingsSetAction({ fontSize: 'm' }));
        const reappliedState = enableComfortMode(customizedState);

        expect(reappliedState.comfortMode).toBe('on');
        expect(reappliedState.fontSize).toBe('xl');
        expect(disableComfortMode(reappliedState).fontSize).toBe('s');
    });

    it('stays inert when it is turned off without ever being turned on', () => {
        const nextState = disableComfortMode(strainedState);

        expect(nextState).toStrictEqual(strainedState);
    });
});
