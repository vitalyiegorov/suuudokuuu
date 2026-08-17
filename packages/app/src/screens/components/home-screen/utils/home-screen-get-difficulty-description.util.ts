import { msg } from '@lingui/core/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';

import type { MessageDescriptor } from '@lingui/core';

const difficultyDescriptions: Record<DifficultyEnum, MessageDescriptor> = {
    [DifficultyEnum.Newbie]: msg`Gentle start`,
    [DifficultyEnum.Easy]: msg`Light warm-up`,
    [DifficultyEnum.Medium]: msg`Balanced solve`,
    [DifficultyEnum.Hard]: msg`Deep focus`,
    [DifficultyEnum.Nightmare]: msg`Expert grid`,
    [DifficultyEnum.Hell]: msg`Minimum clues`,
    [DifficultyEnum.Infinity]: msg`World-record puzzles`
};

export const homeScreenGetDifficultyDescription = (difficulty: DifficultyEnum): MessageDescriptor => difficultyDescriptions[difficulty];
