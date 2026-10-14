import * as Migrator from 'effect/sql/Migrator';

import { initialMigration } from './0001-initial.migration';
import { completedGameDailyDayNumberMigration } from './0002-completed-game-daily-day-number.migration';
import { storeReviewMigration } from './0003-store-review.migration';
import { currentRunEliminatedCandidatesMigration } from './0004-current-run-eliminated-candidates.migration';
import { techniqueCampaignMigration } from './0005-technique-campaign.migration';
import { hintsOnHardDifficultiesDefaultMigration } from './0006-hints-on-hard-difficulties-default.migration';
import { dropTechniqueCampaignMigration } from './0007-drop-technique-campaign.migration';

export const runDatabaseMigrations = Migrator.make({})({
    loader: Migrator.fromRecord({
        '0001_initial': initialMigration,
        '0002_completed_game_daily_day_number': completedGameDailyDayNumberMigration,
        '0003_store_review': storeReviewMigration,
        '0004_current_run_eliminated_candidates': currentRunEliminatedCandidatesMigration,
        '0005_technique_campaign': techniqueCampaignMigration,
        '0006_hints_on_hard_difficulties_default': hintsOnHardDifficultiesDefaultMigration,
        '0007_drop_technique_campaign': dropTechniqueCampaignMigration
    })
});
