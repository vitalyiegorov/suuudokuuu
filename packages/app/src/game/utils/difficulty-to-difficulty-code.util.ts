import { DifficultyEnum } from '@suuudokuuu/generator';

export const difficultyToDifficultyCode = (difficulty: DifficultyEnum): number => Object.values(DifficultyEnum).indexOf(difficulty);
