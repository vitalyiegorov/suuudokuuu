import { t } from '@lingui/core/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';

export const getDifficultyText = (difficulty: DifficultyEnum): string => {
    switch (difficulty) {
        case DifficultyEnum.Easy:
            return t`Easy`;
        case DifficultyEnum.Medium:
            return t`Medium`;
        case DifficultyEnum.Hard:
            return t`Hard`;
        case DifficultyEnum.Newbie:
            return t`Newbie`;
        case DifficultyEnum.Nightmare:
            return t`Nightmare`;
        default:
            return t`Unknown`;
    }
};
