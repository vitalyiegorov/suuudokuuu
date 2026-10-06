import type { DifficultyEnum } from '@suuudokuuu/generator';

export type RatedDifficultyType = Exclude<DifficultyEnum, DifficultyEnum.Infinity>;
