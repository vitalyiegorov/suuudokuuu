import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Schema from 'effect/Schema';

export const TechniqueMasterySchema = Schema.Struct({
    technique: Schema.Enum(SolutionTechniqueEnum),
    seenCount: Schema.Number,
    unassistedCount: Schema.Number
});
