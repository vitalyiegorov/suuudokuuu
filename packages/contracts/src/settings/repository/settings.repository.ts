import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { SettingsSchema } from '../schema/settings.schema';

export class SettingsRepository extends Context.Service<SettingsRepository>()('@suuudokuuu/contracts/SettingsRepository', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const reactivity = yield* Reactivity.Reactivity;
        const findSettings = SqlSchema.findOneOption({
            Request: Schema.Void,
            Result: SettingsSchema,
            execute: () => sql`SELECT * FROM settings`
        });
        const replaceSettings = SqlSchema.void({
            Request: SettingsSchema,
            execute: settings => sql`INSERT OR REPLACE INTO settings ${sql.insert({ id: 1, ...settings })}`
        });

        return {
            get: findSettings().pipe(Effect.orDie),
            save: (settings: typeof SettingsSchema.Type) =>
                reactivity.mutation([ReactivityKeyEnum.Settings], replaceSettings(settings)).pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(SettingsRepository, SettingsRepository.make);
}
