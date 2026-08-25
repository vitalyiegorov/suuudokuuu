import { ThemeEnum } from '../../theme/enum/theme.enum';

import type { SettingsState } from '../store/settings.state';

export const ComfortModeStatuses = ['off', 'on', 'customized'] as const;

export const ComfortModeSettingKeys = [
    'calmMode',
    'cellMargin',
    'fontSize',
    'hasTimer',
    'keepActiveCell',
    'motionPreference',
    'showActiveCandidates',
    'showAreas',
    'showFilledNumbers',
    'showIdenticalNumbers',
    'theme'
] as const;

export const ComfortModeSettings: Readonly<Pick<SettingsState, (typeof ComfortModeSettingKeys)[number]>> = {
    calmMode: true,
    cellMargin: 5,
    fontSize: 'xl',
    hasTimer: false,
    keepActiveCell: true,
    motionPreference: 'reduced',
    showActiveCandidates: true,
    showAreas: true,
    showFilledNumbers: true,
    showIdenticalNumbers: true,
    theme: ThemeEnum.HighContrast
};
