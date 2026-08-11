import { t } from '@lingui/core/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';

const difficultyDescriptions: Record<DifficultyEnum, () => string> = {
    [DifficultyEnum.Newbie]: () => t`Gentle start`,
    [DifficultyEnum.Easy]: () => t`Light warm-up`,
    [DifficultyEnum.Medium]: () => t`Balanced solve`,
    [DifficultyEnum.Hard]: () => t`Deep focus`,
    [DifficultyEnum.Nightmare]: () => t`Expert grid`,
    [DifficultyEnum.Hell]: () => t`Minimum clues`,
    [DifficultyEnum.Infinity]: () => t`World-record puzzles`
};

export const homeScreenGetDifficultyDescription = (difficulty: DifficultyEnum): string => difficultyDescriptions[difficulty]();
