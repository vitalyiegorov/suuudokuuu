import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

export const currentRunPhaseMigration = Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    yield* sql`ALTER TABLE current_run ADD COLUMN phase TEXT NOT NULL DEFAULT 'PLAYING'`;
    yield* sql`UPDATE current_run SET phase = CASE
        WHEN is_paused = 0 THEN 'PLAYING'
        WHEN should_show_pause_screen = 1 THEN 'PAUSED'
        WHEN should_resume_on_focus = 1 THEN 'AWAY'
        ELSE 'FINISHED'
    END`;
    yield* sql`ALTER TABLE current_run DROP COLUMN is_paused`;
    yield* sql`ALTER TABLE current_run DROP COLUMN should_show_pause_screen`;
    yield* sql`ALTER TABLE current_run DROP COLUMN should_resume_on_focus`;
});
