import * as Schema from 'effect/Schema';

import { DifficultySchema } from '../../@generic/schema/difficulty.schema';

export const DifficultyStatsSchema = Schema.Struct({
    difficulty: DifficultySchema,
    gamesCompleted: Schema.Number,
    gamesWon: Schema.Number,
    gamesWonWithoutMistakes: Schema.Number,
    gamesLost: Schema.Number,
    bestScore: Schema.Number,
    bestRating: Schema.Number,
    isBestRatingCeiling: Schema.BooleanFromBit,
    bestTime: Schema.Number,
    averageTime: Schema.Number,
    hardcoreWon: Schema.Number,
    challengesWon: Schema.Number,
    challengesLost: Schema.Number
});
