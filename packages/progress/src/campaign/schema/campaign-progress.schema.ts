import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Schema from 'effect/Schema';

export const CampaignProgressSchema = Schema.Struct({
    teachingSeen: Schema.BooleanFromBit,
    technique: Schema.Enum(SolutionTechniqueEnum),
    completedPracticeIds: Schema.fromJsonString(Schema.Array(Schema.String)),
    unassistedPracticeIds: Schema.fromJsonString(Schema.Array(Schema.String))
});
