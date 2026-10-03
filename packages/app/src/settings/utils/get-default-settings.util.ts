import { DifficultyEnum } from '@suuudokuuu/generator';
import { Appearance } from 'react-native';

import { getBrand } from '../../@generic/utils/get-brand.util';
import { i18nGetOSLocale } from '../../@generic/utils/i18n.util';

import type { SettingsType } from '@suuudokuuu/progress';

export const getDefaultSettings = (): SettingsType => ({
    hasVibration: true,
    hasTimer: true,
    showAreas: true,
    showIdenticalNumbers: true,
    showComboAnimation: true,
    showFilledNumbers: true,
    showActiveCandidates: true,
    keepActiveCell: true,
    keepExhaustedDigits: true,
    allowHintsOnHardDifficulties: false,
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
});
