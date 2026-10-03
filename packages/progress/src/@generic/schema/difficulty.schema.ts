import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Schema from 'effect/Schema';

export const DifficultySchema = Schema.Enum(DifficultyEnum);
