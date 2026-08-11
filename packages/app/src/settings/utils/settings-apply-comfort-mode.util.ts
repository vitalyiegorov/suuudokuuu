import { ComfortModeSettings } from '../constant/comfort-mode.constant';
import { RelaxedMaxMistakesConstant } from '../constant/max-mistakes.constant';
import { initialSettingsState } from '../store/settings.state';

import type { SettingsState } from '../store/settings.state';
import type { ComfortModeRestoreType } from '../types/comfort-mode-restore.type';

const captureComfortModeRestore = (state: SettingsState): ComfortModeRestoreType => ({
    calmMode: state.calmMode,
    cellMargin: state.cellMargin,
    fontSize: state.fontSize,
    hasTimer: state.hasTimer,
    keepActiveCell: state.keepActiveCell,
    lastGameMaxMistakes: state.lastGameMaxMistakes,
    motionPreference: state.motionPreference,
    showActiveCandidates: state.showActiveCandidates,
    showAreas: state.showAreas,
    showFilledNumbers: state.showFilledNumbers,
    showIdenticalNumbers: state.showIdenticalNumbers,
    theme: state.theme
});

export const settingsApplyComfortMode = (state: SettingsState): Partial<SettingsState> => {
    const hasUntouchedMistakePreset = state.lastGameMaxMistakes === initialSettingsState.lastGameMaxMistakes;

    return {
        ...ComfortModeSettings,
        ...(hasUntouchedMistakePreset && { lastGameMaxMistakes: RelaxedMaxMistakesConstant }),
        comfortMode: 'on',
        comfortModeOfferDismissed: true,
        comfortModeRestore: state.comfortModeRestore ?? captureComfortModeRestore(state)
    };
};
