import * as Schema from 'effect/Schema';

export const DailyResultSchema = Schema.Struct({
    dailyDayNumber: Schema.Number,
    encodedState: Schema.String,
    elapsedTime: Schema.Number,
    score: Schema.Number,
    mistakes: Schema.Number
});
