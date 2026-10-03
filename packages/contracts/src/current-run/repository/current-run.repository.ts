import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { CurrentRunSchema } from '../schema/current-run.schema';

export class CurrentRunRepository extends Context.Service<CurrentRunRepository>()('@suuudokuuu/contracts/CurrentRunRepository', {
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
            save: (currentRun: typeof CurrentRunSchema.Type) =>
                reactivity
                    .mutation([ReactivityKeyEnum.CurrentRun, ReactivityKeyEnum.RunClock], replaceCurrentRun(currentRun))
                    .pipe(Effect.orDie),
            saveElapsedTime: (elapsedTime: number) =>
                reactivity
                    .mutation([ReactivityKeyEnum.RunClock], sql`UPDATE current_run SET elapsed_time = ${elapsedTime}`)
                    .pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(CurrentRunRepository, CurrentRunRepository.make);
}
