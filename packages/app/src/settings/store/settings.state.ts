import { DifficultyEnum } from '@suuudokuuu/generator';
import { Appearance } from 'react-native';

import { getBrand } from '../../@generic/utils/get-brand.util';
import { i18nGetOSLocale } from '../../@generic/utils/i18n.util';
import { CellMargin } from '../constant/cell-margin.constant';

import type { ThemeIdType } from '../../theme/types/theme-id.type';
import type { FontSizes } from '../constant/font-sizes.constant';
import type { Languages } from '../constant/languages.constant';
import type { MotionPreferences } from '../constant/motion-preferences.constant';

export interface SettingsState {
    hasVibration: boolean;
    hasTimer: boolean;
    showAreas: boolean;
    showIdenticalNumbers: boolean;
    showComboAnimation: boolean;
    showFilledNumbers: boolean;
    showActiveCandidates: boolean;
    keepActiveCell: boolean;
    keepExhaustedDigits: boolean;
    isLeftHanded: boolean;
    calmMode: boolean;
    motionPreference: (typeof MotionPreferences)[number];
    fontSize: (typeof FontSizes)[number];
    language: (typeof Languages)[number];
    theme: ThemeIdType;
    isDarkColorSchema: boolean;
    cellMargin: (typeof CellMargin)[number];
    lastGameDifficulty: DifficultyEnum;
    lastGameMaxMistakes: number;
    lastGameChallengeMode: boolean;
    lastStatsDifficulty: DifficultyEnum;
}

export const initialSettingsState: SettingsState = {
    hasVibration: true,
    hasTimer: true,
    showAreas: true,
    showIdenticalNumbers: true,
    showComboAnimation: true,
    showFilledNumbers: true,
    showActiveCandidates: true,
    keepActiveCell: true,
    keepExhaustedDigits: true,
    isLeftHanded: false,
    calmMode: false,
    motionPreference: 'system',
    fontSize: 'm',
    language: i18nGetOSLocale(),
    theme: getBrand().defaultTheme,
    isDarkColorSchema: Appearance.getColorScheme() === 'dark',
    cellMargin: 5,
    lastGameDifficulty: DifficultyEnum.Easy,
    lastGameMaxMistakes: 3,
    lastGameChallengeMode: false,
    lastStatsDifficulty: DifficultyEnum.Easy
};
