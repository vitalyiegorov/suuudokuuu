import { i18n } from '@lingui/core';

import { getDifficultyMessage } from './get-difficulty-message.util';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const getDifficultyText = (difficulty: DifficultyEnum): string => i18n._(getDifficultyMessage(difficulty));
