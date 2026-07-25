import { DifficultyEnum } from '@suuudokuuu/generator';
import { Appearance } from 'react-native';

import { i18nGetOSLocale } from '../../@generic/utils/i18n.util';
import { ThemeEnum } from '../../theme/enum/theme.enum';
import { CellMargin } from '../constant/cell-margin.constant';

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
    keepActiveCell: boolean;
    keepExhaustedDigits: boolean;
    fontSize: (typeof FontSizes)[number];
    language: (typeof Languages)[number];
    theme: (typeof Themes)[number];
    isDarkColorSchema: boolean;
    cellMargin: (typeof CellMargin)[number];
    lastGameDifficulty: DifficultyEnum;
    lastGameMaxMistakes: number;
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
    fontSize: 'm',
    language: i18nGetOSLocale(),
    theme: ThemeEnum.BlackAndWhite,
    isDarkColorSchema: Appearance.getColorScheme() === 'dark',
    cellMargin: 5,
    lastGameDifficulty: DifficultyEnum.Easy,
    lastGameMaxMistakes: 3,
    lastStatsDifficulty: DifficultyEnum.Easy
};
