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
        case DifficultyEnum.Hell:
            return t`Hell`;
        case DifficultyEnum.Infinity:
            return t`Infinity`;
        default:
            return t`Unknown`;
    }
};
