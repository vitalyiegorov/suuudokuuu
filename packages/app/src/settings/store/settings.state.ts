export interface SettingsState {
    hasVibration: boolean;
    hasTimer: boolean;
    showAreas: boolean;
    showIdenticalNumbers: boolean;
    showComboAnimation: boolean;
    fontSize: (typeof FontSizes)[number];
}

export const FontSizes = [0.7, 0.8, 1, 1.2] as const;
export const getFontSizeIndex = (size: SettingsState['fontSize']) => FontSizes.indexOf(size);

export const initialSettingsState: SettingsState = {
    hasVibration: true,
    hasTimer: true,
    showAreas: true,
    showIdenticalNumbers: true,
    showComboAnimation: true,
    fontSize: 1
};
