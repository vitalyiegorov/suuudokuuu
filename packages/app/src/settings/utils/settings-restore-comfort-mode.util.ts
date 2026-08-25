import { isDefined } from '@rnw-community/shared';

import { ComfortModeSettings } from '../constant/comfort-mode.constant';
import { RelaxedMaxMistakesConstant } from '../constant/max-mistakes.constant';

import type { SettingsState } from '../store/settings.state';

export const settingsRestoreComfortMode = (state: SettingsState): Partial<SettingsState> => {
    const restore = state.comfortModeRestore;

    if (!isDefined(restore)) {
        return { comfortMode: 'off', comfortModeRestore: null };
    }

    return {
        comfortMode: 'off',
        comfortModeRestore: null,
        ...(state.calmMode === ComfortModeSettings.calmMode && { calmMode: restore.calmMode }),
        ...(state.cellMargin === ComfortModeSettings.cellMargin && { cellMargin: restore.cellMargin }),
        ...(state.fontSize === ComfortModeSettings.fontSize && { fontSize: restore.fontSize }),
        ...(state.hasTimer === ComfortModeSettings.hasTimer && { hasTimer: restore.hasTimer }),
        ...(state.keepActiveCell === ComfortModeSettings.keepActiveCell && { keepActiveCell: restore.keepActiveCell }),
        ...(state.lastGameMaxMistakes === RelaxedMaxMistakesConstant && { lastGameMaxMistakes: restore.lastGameMaxMistakes }),
        ...(state.motionPreference === ComfortModeSettings.motionPreference && { motionPreference: restore.motionPreference }),
        ...(state.showActiveCandidates === ComfortModeSettings.showActiveCandidates && {
            showActiveCandidates: restore.showActiveCandidates
        }),
        ...(state.showAreas === ComfortModeSettings.showAreas && { showAreas: restore.showAreas }),
        ...(state.showFilledNumbers === ComfortModeSettings.showFilledNumbers && { showFilledNumbers: restore.showFilledNumbers }),
        ...(state.showIdenticalNumbers === ComfortModeSettings.showIdenticalNumbers && {
            showIdenticalNumbers: restore.showIdenticalNumbers
        }),
        ...(state.theme === ComfortModeSettings.theme && { theme: restore.theme })
    };
};
