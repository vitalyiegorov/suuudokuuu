import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

export const hintsOnHardDifficultiesDefaultMigration = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`UPDATE settings SET allow_hints_on_hard_difficulties = 1`
);
