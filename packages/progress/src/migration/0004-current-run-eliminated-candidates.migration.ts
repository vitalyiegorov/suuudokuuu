import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

export const currentRunEliminatedCandidatesMigration = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`ALTER TABLE current_run ADD COLUMN eliminated_candidates TEXT NOT NULL DEFAULT '{}'`
);
