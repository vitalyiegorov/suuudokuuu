import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { CurrentRunSchema } from '../schema/current-run.schema';

import type { CurrentRunType } from '../type/current-run.type';

const currentRunKeys = [ReactivityKeyEnum.CurrentRun, ReactivityKeyEnum.RunClock];

export class CurrentRunRepository extends Context.Service<CurrentRunRepository>()('@suuudokuuu/progress/CurrentRunRepository', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const reactivity = yield* Reactivity.Reactivity;
        const findCurrentRun = SqlSchema.findOneOption({
            Request: Schema.Void,
            Result: CurrentRunSchema,
            execute: () => sql`SELECT * FROM current_run`
        });
        const replaceCurrentRun = SqlSchema.void({
            Request: CurrentRunSchema,
            execute: currentRun => sql`INSERT OR REPLACE INTO current_run ${sql.insert({ id: 1, ...currentRun })}`
        });

        return {
            get: findCurrentRun().pipe(Effect.orDie),
            save: (currentRun: CurrentRunType) => reactivity.mutation(currentRunKeys, replaceCurrentRun(currentRun)).pipe(Effect.orDie),
            remove: reactivity.mutation(currentRunKeys, sql`DELETE FROM current_run`).pipe(Effect.orDie),
            tick: (nowMs: number) =>
                reactivity
                    .mutation(
                        [ReactivityKeyEnum.RunClock],
                        sql`WITH clock AS (SELECT elapsed_remainder_ms + MAX(CAST(${nowMs} AS INTEGER) - clock_checkpoint_ms, 0) AS total_ms FROM current_run)
                            UPDATE current_run
                            SET elapsed_time = elapsed_time + (SELECT total_ms FROM clock) / 1000,
                                elapsed_remainder_ms = (SELECT total_ms FROM clock) % 1000,
                                clock_checkpoint_ms = CAST(${nowMs} AS INTEGER)
                            WHERE is_paused = 0 AND clock_checkpoint_ms > 0`
                    )
                    .pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(CurrentRunRepository, CurrentRunRepository.make);
}
