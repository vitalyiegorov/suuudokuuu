import type { SettingsType } from '@suuudokuuu/progress';

export const settingsIsMotionReduced = (motionPreference: SettingsType['motionPreference'], isSystemMotionReduced: boolean): boolean => {
    if (motionPreference === 'full') {
        return false;
    }

    if (motionPreference === 'reduced') {
        return true;
    }

    return isSystemMotionReduced;
};
