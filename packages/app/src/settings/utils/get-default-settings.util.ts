import { DifficultyEnum } from '@suuudokuuu/generator';
import { Languages } from '@suuudokuuu/progress';
import { getLocales } from 'expo-localization';
import { Appearance } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { getBrand } from '../../@generic/utils/get-brand.util';

import type { SettingsType } from '@suuudokuuu/progress';

const getOsLanguage = (): SettingsType['language'] => {
    const locales = getLocales();

    for (const locale of locales) {
        const languageCode = Languages.find(language => language === locale.languageCode?.toLowerCase());

        if (isDefined(languageCode)) {
            return languageCode;
        }
    }

    return 'en';
};

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
    language: getOsLanguage(),
    theme: getBrand().defaultTheme,
    isDarkColorSchema: Appearance.getColorScheme() === 'dark',
    cellMargin: 5,
    lastGameDifficulty: DifficultyEnum.Easy,
    lastGameMaxMistakes: 3,
    lastGameChallengeMode: false,
    lastStatsDifficulty: DifficultyEnum.Easy
});
