import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

const addDailyDayNumberColumn = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`ALTER TABLE completed_games ADD COLUMN daily_day_number INTEGER`
);

const createDailyDayNumberIndex = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`CREATE INDEX completed_games_daily_day_number_index ON completed_games (daily_day_number)`
);

export const completedGameDailyDayNumberMigration = Effect.all([addDailyDayNumberColumn, createDailyDayNumberIndex], { discard: true });
