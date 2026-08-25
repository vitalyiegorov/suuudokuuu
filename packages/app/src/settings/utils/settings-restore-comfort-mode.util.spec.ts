import { describe, expect, it } from '@jest/globals';

import { ComfortModeSettingKeys, ComfortModeSettings } from '../constant/comfort-mode.constant';
import { RelaxedMaxMistakesConstant } from '../constant/max-mistakes.constant';
import { initialSettingsState } from '../store/settings.state';

import { settingsRestoreComfortMode } from './settings-restore-comfort-mode.util';

const comfortModeRestore = {
    ...ComfortModeSettings,
    lastGameMaxMistakes: initialSettingsState.lastGameMaxMistakes
};

const appliedState = {
    ...initialSettingsState,
    ...ComfortModeSettings,
    comfortMode: 'on' as const,
    comfortModeRestore,
    lastGameMaxMistakes: RelaxedMaxMistakesConstant
};

describe('settingsRestoreComfortMode', () => {
    it('should restore every bundled comfort setting key', () => {
        expect.assertions(1);

        const restoredKeys = Object.keys(settingsRestoreComfortMode(appliedState));

        expect(ComfortModeSettingKeys.filter(key => !restoredKeys.includes(key))).toStrictEqual([]);
    });

    it('should restore the mistake limit nudge alongside the bundled keys', () => {
        expect.assertions(1);

        expect(Object.keys(settingsRestoreComfortMode(appliedState))).toContain('lastGameMaxMistakes');
    });

    it('should turn the preset off and drop the snapshot when nothing was captured', () => {
        expect.assertions(1);

        expect(settingsRestoreComfortMode({ ...initialSettingsState, comfortModeRestore: null })).toStrictEqual({
            comfortMode: 'off',
            comfortModeRestore: null
        });
    });
});
