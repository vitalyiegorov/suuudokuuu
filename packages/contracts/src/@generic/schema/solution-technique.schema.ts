import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Schema from 'effect/Schema';

export const SolutionTechniqueSchema = Schema.Enum(SolutionTechniqueEnum);
