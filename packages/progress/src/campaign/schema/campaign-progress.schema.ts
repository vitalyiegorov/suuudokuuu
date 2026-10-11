import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Schema from 'effect/Schema';

export const CampaignProgressSchema = Schema.Struct({
    technique: Schema.Enum(SolutionTechniqueEnum),
    completedPracticeIds: Schema.fromJsonString(Schema.Array(Schema.String)),
    unassistedPracticeIds: Schema.fromJsonString(Schema.Array(Schema.String))
});
