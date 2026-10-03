import { assert, describe, it } from '@effect/vitest';
import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

import { runDatabaseMigrations } from '../../src/migration/run-database-migrations.util';
import { ProgressTestLayer } from '../progress-test.layer';

describe('database migrations', () => {
    it.effect('creates every table once', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;
            const tables = yield* sql<{ readonly name: string }>`
                SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'effect_%' ORDER BY name
            `;

            assert.deepStrictEqual(
                tables.map(table => table.name),
                ['completed_games', 'current_run', 'custom_themes', 'difficulty_stats', 'player_stats', 'settings']
            );
            assert.deepStrictEqual(yield* runDatabaseMigrations, []);
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
