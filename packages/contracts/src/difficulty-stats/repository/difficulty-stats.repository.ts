import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { DifficultyStatsSchema } from '../schema/difficulty-stats.schema';

export class DifficultyStatsRepository extends Context.Service<DifficultyStatsRepository>()(
    '@suuudokuuu/contracts/DifficultyStatsRepository',
    {
        make: Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;
            const reactivity = yield* Reactivity.Reactivity;
            const findAllStats = SqlSchema.findAll({
                Request: Schema.Void,
                Result: DifficultyStatsSchema,
                execute: () => sql`SELECT * FROM difficulty_stats`
            });
            const replaceStats = SqlSchema.void({
                Request: DifficultyStatsSchema,
                execute: stats => sql`INSERT OR REPLACE INTO difficulty_stats ${sql.insert(stats)}`
            });

            return {
                findAll: findAllStats().pipe(Effect.orDie),
                save: (stats: typeof DifficultyStatsSchema.Type) =>
                    reactivity.mutation([ReactivityKeyEnum.DifficultyStats], replaceStats(stats)).pipe(Effect.orDie)
            };
        })
    }
) {
    static readonly layer = Layer.effect(DifficultyStatsRepository, DifficultyStatsRepository.make);
}
