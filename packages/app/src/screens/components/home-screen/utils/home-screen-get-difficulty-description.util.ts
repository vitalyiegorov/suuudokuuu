import { t } from '@lingui/core/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';

export const homeScreenGetDifficultyDescription = (difficulty: DifficultyEnum): string => {
    switch (difficulty) {
        case DifficultyEnum.Newbie:
            return t`Gentle start`;
        case DifficultyEnum.Easy:
            return t`Light warm-up`;
        case DifficultyEnum.Medium:
            return t`Balanced solve`;
        case DifficultyEnum.Hard:
            return t`Deep focus`;
        case DifficultyEnum.Nightmare:
            return t`Expert grid`;
        default:
            return '';
    }
};
