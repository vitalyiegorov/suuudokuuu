import { DifficultyEnum } from '@suuudokuuu/generator';

export const getDifficultyOrdinal = (difficulty: DifficultyEnum): number => Object.values(DifficultyEnum).indexOf(difficulty) + 1;
