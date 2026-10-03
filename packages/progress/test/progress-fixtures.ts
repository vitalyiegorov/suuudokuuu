import { DifficultyEnum } from '@suuudokuuu/generator';

import { ThemeEnum } from '../src/custom-theme/enum/theme.enum';

import type { ThemeColorsType } from '../src/custom-theme/type/theme-colors.type';
import type { SettingsType } from '../src/settings/type/settings.type';

const white = '#ffffff';

export const themeColors: ThemeColorsType = {
    background: white,
    ink: white,
    inkText: white,
    overlayLight: white,
    overlayDark: white,
    danger: white,
    dangerText: white,
    accent: white,
    text: { primary: white, hint: white },
    board: { selected: white, selectedText: white, sameValue: white, sameValueText: white, error: white, filled: white, emptyText: white },
    candidate: { text: white, textSelected: white, fill: white, fillSelected: white, borderSelected: white },
    numpad: { track: white, trackFilled: white, trackFilledText: white, text: white },
    surface: { raised: white, raisedText: white, subtle: white, subtleText: white, subtleHint: white, border: white }
};

export const initialSettings: SettingsType = {
    allowHintsOnHardDifficulties: false,
    calmMode: false,
    cellMargin: 5,
    fontSize: 'm',
    hasTimer: true,
    hasVibration: true,
    isDarkColorSchema: false,
    isLeftHanded: false,
    keepActiveCell: true,
    keepExhaustedDigits: true,
    language: 'en',
    lastGameChallengeMode: false,
    lastGameDifficulty: DifficultyEnum.Easy,
    lastGameMaxMistakes: 3,
    lastStatsDifficulty: DifficultyEnum.Easy,
    motionPreference: 'system',
    showActiveCandidates: true,
    showAreas: true,
    showComboAnimation: true,
    showFilledNumbers: true,
    showIdenticalNumbers: true,
    theme: ThemeEnum.BlackAndWhite
};
