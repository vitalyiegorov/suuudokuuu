import { DifficultyEnum } from '@suuudokuuu/generator';

const difficulties: readonly string[] = Object.values(DifficultyEnum);

export const isDifficulty = (value: string): value is DifficultyEnum => difficulties.includes(value);
