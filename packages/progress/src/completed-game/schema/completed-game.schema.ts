import * as Schema from 'effect/Schema';

import { DifficultySchema } from '../../@generic/schema/difficulty.schema';

export const CompletedGameSchema = Schema.Struct({
    difficulty: DifficultySchema,
    encodedState: Schema.String,
    rating: Schema.Number,
    isRatingCeiling: Schema.BooleanFromBit,
    elapsedTime: Schema.Number,
    score: Schema.Number,
    mistakes: Schema.Number,
    maxMistakes: Schema.Number,
    completedAt: Schema.Number,
    dailyDayNumber: Schema.NullOr(Schema.Number)
});
