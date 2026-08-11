import type { DifficultyEnum } from '@suuudokuuu/generator';

export type LandingDifficultyType = Exclude<DifficultyEnum, DifficultyEnum.Infinity>;
