export interface SettingsState {
    hasVibration: boolean;
    hasTimer: boolean;
    showAreas: boolean;
    showIdenticalNumbers: boolean;
    showComboAnimation: boolean;
    fontSize: (typeof FontSizes)[number];
    language: (typeof Languages)[number];
}

export const FontSizes = ['xs', 's', 'm', 'xl'] as const;
export const Languages = ['en', 'de', 'uk', 'es', 'fr'] as const;

export const initialSettingsState: SettingsState = {
    hasVibration: true,
    hasTimer: true,
    showAreas: true,
    showIdenticalNumbers: true,
    showComboAnimation: true,
    fontSize: 'm',
    language: 'en'
};
