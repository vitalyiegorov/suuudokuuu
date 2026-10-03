import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { isNumber } from 'effect/Predicate';
import * as Schema from 'effect/Schema';

const solutionTechniques = Object.values(SolutionTechniqueEnum).filter((value): value is SolutionTechniqueEnum => isNumber(value));
const DayNumbersSchema = Schema.fromJsonString(Schema.Array(Schema.Number));

export const PlayerStatsSchema = Schema.Struct({
    techniqueUsageCounts: Schema.fromJsonString(Schema.Record(Schema.Literals(solutionTechniques), Schema.optionalKey(Schema.Number))),
    dailyBestStreak: Schema.Number,
    playedDayNumbers: DayNumbersSchema,
    dailyCompletedDayNumbers: DayNumbersSchema
});
