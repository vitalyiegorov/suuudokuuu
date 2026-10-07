import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

export const storeReviewMigration = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`
        CREATE TABLE store_review (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            requested_at INTEGER NOT NULL,
            app_version TEXT NOT NULL
        )
    `
);
