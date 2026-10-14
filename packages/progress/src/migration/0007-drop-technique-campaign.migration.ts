import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

export const dropTechniqueCampaignMigration = Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    yield* sql`DROP TABLE IF EXISTS campaign_progress`;
    yield* sql`DROP TABLE IF EXISTS technique_mastery`;
});
