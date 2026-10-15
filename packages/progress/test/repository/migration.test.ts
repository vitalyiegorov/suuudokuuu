import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { makeTestSqlClientLayer } from '@suuudokuuu/test-kit/client';
import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';
import * as Migrator from 'effect/sql/Migrator';
import * as SqlClient from 'effect/sql/SqlClient';

import { initialCurrentRun } from '../../src/current-run/constant/initial-current-run.constant';
import { CurrentRunSchema } from '../../src/current-run/schema/current-run.schema';
import { initialMigration } from '../../src/migration/0001-initial.migration';
import { completedGameDailyDayNumberMigration } from '../../src/migration/0002-completed-game-daily-day-number.migration';
import { storeReviewMigration } from '../../src/migration/0003-store-review.migration';
import { currentRunEliminatedCandidatesMigration } from '../../src/migration/0004-current-run-eliminated-candidates.migration';
import { techniqueCampaignMigration } from '../../src/migration/0005-technique-campaign.migration';
import { hintsOnHardDifficultiesDefaultMigration } from '../../src/migration/0006-hints-on-hard-difficulties-default.migration';
import { runDatabaseMigrations } from '../../src/migration/run-database-migrations.util';
import { SettingsSchema } from '../../src/settings/schema/settings.schema';
import { initialSettings } from '../progress-fixtures';
import { ProgressTestLayer } from '../progress-test.layer';

const gameFinishedBeforeUpgrade = {
    difficulty: DifficultyEnum.Easy,
    encodedState: 'encoded',
    rating: 1.5,
    isRatingCeiling: 0,
    elapsedTime: 300,
    score: 900,
    mistakes: 0,
    maxMistakes: 3,
    completedAt: 1000
};

describe('database migrations', () => {
    it.effect('creates every table once', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;
            const tables = yield* sql<{ readonly name: string }>`
                SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'effect_%' ORDER BY name
            `;

            assert.deepStrictEqual(
                tables.map(table => table.name),
                ['completed_games', 'current_run', 'custom_themes', 'difficulty_stats', 'player_stats', 'settings', 'store_review']
            );
            assert.deepStrictEqual(yield* runDatabaseMigrations, []);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('adds an empty daily day number to games finished before the upgrade', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;

            yield* Migrator.make({})({ loader: Migrator.fromRecord({ '0001_initial': initialMigration }) });
            yield* sql`INSERT INTO completed_games ${sql.insert(gameFinishedBeforeUpgrade)}`;

            assert.deepStrictEqual(yield* runDatabaseMigrations, [
                [2, 'completed_game_daily_day_number'],
                [3, 'store_review'],
                [4, 'current_run_eliminated_candidates'],
                [5, 'technique_campaign'],
                [6, 'hints_on_hard_difficulties_default'],
                [7, 'drop_technique_campaign'],
                [8, 'current_run_wall_clock']
            ]);
            assert.deepStrictEqual(yield* sql`SELECT daily_day_number, score FROM completed_games`, [{ dailyDayNumber: null, score: 900 }]);
        }).pipe(Effect.provide(makeTestSqlClientLayer()))
    );
    it.effect('preserves an existing run with no committed eliminations when upgrading', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;

            yield* Migrator.make({})({
                loader: Migrator.fromRecord({
                    '0001_initial': initialMigration,
                    '0002_completed_game_daily_day_number': completedGameDailyDayNumberMigration,
                    '0003_store_review': storeReviewMigration
                })
            });

            const { eliminatedCandidates, elapsedRemainderMs, clockCheckpointMs, ...runBeforeUpgrade } =
                yield* Schema.encodeEffect(CurrentRunSchema)(initialCurrentRun);

            yield* sql`INSERT INTO current_run ${sql.insert({ id: 1, ...runBeforeUpgrade })}`;

            assert.deepStrictEqual(yield* runDatabaseMigrations, [
                [4, 'current_run_eliminated_candidates'],
                [5, 'technique_campaign'],
                [6, 'hints_on_hard_difficulties_default'],
                [7, 'drop_technique_campaign'],
                [8, 'current_run_wall_clock']
            ]);
            assert.deepStrictEqual(
                yield* sql`SELECT eliminated_candidates, elapsed_remainder_ms, clock_checkpoint_ms, score FROM current_run`,
                [{ eliminatedCandidates, elapsedRemainderMs, clockCheckpointMs, score: initialCurrentRun.score }]
            );
        }).pipe(Effect.provide(makeTestSqlClientLayer()))
    );

    it.effect('turns hints on the hardest puzzles on for settings saved with the old default', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;

            yield* Migrator.make({})({
                loader: Migrator.fromRecord({
                    '0001_initial': initialMigration,
                    '0002_completed_game_daily_day_number': completedGameDailyDayNumberMigration,
                    '0003_store_review': storeReviewMigration,
                    '0004_current_run_eliminated_candidates': currentRunEliminatedCandidatesMigration,
                    '0005_technique_campaign': techniqueCampaignMigration
                })
            });
            yield* sql`INSERT INTO settings ${sql.insert({ id: 1, ...(yield* Schema.encodeEffect(SettingsSchema)(initialSettings)) })}`;

            assert.deepStrictEqual(yield* runDatabaseMigrations, [
                [6, 'hints_on_hard_difficulties_default'],
                [7, 'drop_technique_campaign'],
                [8, 'current_run_wall_clock']
            ]);
            assert.deepStrictEqual(yield* sql`SELECT allow_hints_on_hard_difficulties, has_timer FROM settings`, [
                { allowHintsOnHardDifficulties: 1, hasTimer: 1 }
            ]);
        }).pipe(Effect.provide(makeTestSqlClientLayer()))
    );

    it.effect('drops the technique campaign tables and their progress when upgrading', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;

            yield* Migrator.make({})({
                loader: Migrator.fromRecord({
                    '0001_initial': initialMigration,
                    '0002_completed_game_daily_day_number': completedGameDailyDayNumberMigration,
                    '0003_store_review': storeReviewMigration,
                    '0004_current_run_eliminated_candidates': currentRunEliminatedCandidatesMigration,
                    '0005_technique_campaign': techniqueCampaignMigration,
                    '0006_hints_on_hard_difficulties_default': hintsOnHardDifficultiesDefaultMigration
                })
            });
            yield* sql`INSERT INTO technique_mastery ${sql.insert({ technique: 1, seenCount: 2, unassistedCount: 1 })}`;
            yield* sql`INSERT INTO campaign_progress ${sql.insert({ technique: 1, teachingSeen: 1 })}`;

            assert.deepStrictEqual(yield* runDatabaseMigrations, [
                [7, 'drop_technique_campaign'],
                [8, 'current_run_wall_clock']
            ]);
            assert.deepStrictEqual(yield* sql`SELECT name FROM sqlite_master WHERE name IN ('campaign_progress', 'technique_mastery')`, []);
        }).pipe(Effect.provide(makeTestSqlClientLayer()))
    );
});
