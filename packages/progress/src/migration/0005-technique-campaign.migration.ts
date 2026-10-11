import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

export const techniqueCampaignMigration = Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    yield* sql`
        CREATE TABLE technique_mastery (
            technique INTEGER PRIMARY KEY,
            seen_count INTEGER NOT NULL DEFAULT 0 CHECK (seen_count >= 0),
            unassisted_count INTEGER NOT NULL DEFAULT 0 CHECK (unassisted_count >= 0)
        )
    `;
    yield* sql`
        CREATE TABLE campaign_progress (
            technique INTEGER PRIMARY KEY,
            completed_practice_ids TEXT NOT NULL DEFAULT '[]',
            unassisted_practice_ids TEXT NOT NULL DEFAULT '[]'
        )
    `;
});
