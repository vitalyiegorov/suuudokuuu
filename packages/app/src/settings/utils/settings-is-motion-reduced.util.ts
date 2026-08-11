import type { SettingsState } from '../store/settings.state';

export const settingsIsMotionReduced = (motionPreference: SettingsState['motionPreference'], isSystemMotionReduced: boolean): boolean => {
    if (motionPreference === 'full') {
        return false;
    }

    if (motionPreference === 'reduced') {
        return true;
    }

    return isSystemMotionReduced;
};
