import { msg } from '@lingui/core/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { isDifficulty } from '../type-guard/is-difficulty.type-guard';

import type { MessageDescriptor } from '@lingui/core';

const DifficultyMessages: Record<DifficultyEnum, MessageDescriptor> = {
    [DifficultyEnum.Newbie]: msg`Newbie`,
    [DifficultyEnum.Easy]: msg`Easy`,
    [DifficultyEnum.Medium]: msg`Medium`,
    [DifficultyEnum.Hard]: msg`Hard`,
    [DifficultyEnum.Nightmare]: msg`Nightmare`,
    [DifficultyEnum.Hell]: msg`Hell`,
    [DifficultyEnum.Infinity]: msg`Infinity`
};

const UnknownDifficultyMessage = msg`Unknown`;

export const getDifficultyMessage = (difficulty: string): MessageDescriptor =>
    isDifficulty(difficulty) ? DifficultyMessages[difficulty] : UnknownDifficultyMessage;
