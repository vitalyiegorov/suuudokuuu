import * as Migrator from 'effect/sql/Migrator';

import { initialMigration } from './0001-initial.migration';
import { completedGameDailyDayNumberMigration } from './0002-completed-game-daily-day-number.migration';
import { storeReviewMigration } from './0003-store-review.migration';
import { currentRunEliminatedCandidatesMigration } from './0004-current-run-eliminated-candidates.migration';

export const runDatabaseMigrations = Migrator.make({})({
    loader: Migrator.fromRecord({
        '0001_initial': initialMigration,
        '0002_completed_game_daily_day_number': completedGameDailyDayNumberMigration,
        '0003_store_review': storeReviewMigration,
        '0004_current_run_eliminated_candidates': currentRunEliminatedCandidatesMigration
    })
});
