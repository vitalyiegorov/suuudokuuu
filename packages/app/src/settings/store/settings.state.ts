import { Appearance } from 'react-native';

import { i18nGetOSLocale } from '../../@generic/utils/i18n.util';

import type { FontSizes } from '../constant/font-sizes.constant';
import type { Languages } from '../constant/languages.constant';
import type { Themes } from '../constant/themes.constant';

export interface SettingsState {
    hasVibration: boolean;
    hasTimer: boolean;
    showAreas: boolean;
    showIdenticalNumbers: boolean;
    showComboAnimation: boolean;
    fontSize: (typeof FontSizes)[number];
    language: (typeof Languages)[number];
    theme: (typeof Themes)[number];
}

export const initialSettingsState: SettingsState = {
    hasVibration: true,
    hasTimer: true,
    showAreas: true,
    showIdenticalNumbers: true,
    showComboAnimation: true,
    fontSize: 'm',
    language: i18nGetOSLocale(),
    theme: Appearance.getColorScheme() ?? 'light'
};
