import * as Migrator from 'effect/sql/Migrator';

import { initialMigration } from './0001-initial.migration';
import { completedGameDailyDayNumberMigration } from './0002-completed-game-daily-day-number.migration';

export const runDatabaseMigrations = Migrator.make({})({
    loader: Migrator.fromRecord({
        '0001_initial': initialMigration,
        '0002_completed_game_daily_day_number': completedGameDailyDayNumberMigration
    })
});
