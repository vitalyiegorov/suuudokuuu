import { Appearance } from 'react-native';

import { i18nGetOSLocale } from '../../@generic/utils/i18n.util';
import { ThemeEnum } from '../../theme/enum/theme.enum';

import type { Themes } from '../../theme/constant/themes.constant';
import type { FontSizes } from '../constant/font-sizes.constant';
import type { Languages } from '../constant/languages.constant';

export interface SettingsState {
    hasVibration: boolean;
    hasTimer: boolean;
    showAreas: boolean;
    showIdenticalNumbers: boolean;
    showComboAnimation: boolean;
    showFilledNumbers: boolean;
    showActiveCandidates: boolean;
    fontSize: (typeof FontSizes)[number];
    language: (typeof Languages)[number];
    theme: (typeof Themes)[number];
    isDarkColorSchema: boolean;
}

export const initialSettingsState: SettingsState = {
    hasVibration: true,
    hasTimer: true,
    showAreas: true,
    showIdenticalNumbers: true,
    showComboAnimation: true,
    showFilledNumbers: true,
    showActiveCandidates: true,
    fontSize: 'm',
    language: i18nGetOSLocale(),
    theme: ThemeEnum.BlackAndWhite,
    isDarkColorSchema: Appearance.getColorScheme() === 'dark'
};
