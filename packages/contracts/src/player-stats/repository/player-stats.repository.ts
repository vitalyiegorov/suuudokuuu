import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { PlayerStatsSchema } from '../schema/player-stats.schema';

export class PlayerStatsRepository extends Context.Service<PlayerStatsRepository>()('@suuudokuuu/contracts/PlayerStatsRepository', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const reactivity = yield* Reactivity.Reactivity;
        const findPlayerStats = SqlSchema.findOne({
            Request: Schema.Void,
            Result: PlayerStatsSchema,
            execute: () => sql`SELECT * FROM player_stats`
        });
        const replacePlayerStats = SqlSchema.void({
            Request: PlayerStatsSchema,
            execute: playerStats => sql`INSERT OR REPLACE INTO player_stats ${sql.insert({ id: 1, ...playerStats })}`
        });

        return {
            get: findPlayerStats().pipe(Effect.orDie),
            save: (playerStats: typeof PlayerStatsSchema.Type) =>
                reactivity.mutation([ReactivityKeyEnum.PlayerStats], replacePlayerStats(playerStats)).pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(PlayerStatsRepository, PlayerStatsRepository.make);
}
