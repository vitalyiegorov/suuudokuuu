import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { makeTestSqlClientLayer } from '@suuudokuuu/test-kit/client';
import * as Effect from 'effect/Effect';
import * as Migrator from 'effect/sql/Migrator';
import * as SqlClient from 'effect/sql/SqlClient';

import { initialMigration } from '../../src/migration/0001-initial.migration';
import { runDatabaseMigrations } from '../../src/migration/run-database-migrations.util';
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
                [3, 'store_review']
            ]);
            assert.deepStrictEqual(yield* sql`SELECT daily_day_number, score FROM completed_games`, [{ dailyDayNumber: null, score: 900 }]);
        }).pipe(Effect.provide(makeTestSqlClientLayer()))
    );
});
