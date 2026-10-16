import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

export const currentRunWallClockMigration = Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    yield* sql`ALTER TABLE current_run ADD COLUMN elapsed_remainder_ms INTEGER NOT NULL DEFAULT 0`;
    yield* sql`ALTER TABLE current_run ADD COLUMN clock_checkpoint_ms INTEGER NOT NULL DEFAULT 0`;
});
