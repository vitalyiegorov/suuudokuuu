import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { SettingsSchema } from '../schema/settings.schema';

type Settings = typeof SettingsSchema.Type;

export class SettingsRepository extends Context.Service<SettingsRepository>()('@suuudokuuu/progress/SettingsRepository', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const reactivity = yield* Reactivity.Reactivity;
        const findSettings = SqlSchema.findOne({
            Request: Schema.Void,
            Result: SettingsSchema,
            execute: () => sql`SELECT * FROM settings`
        });
        const insertSettings = SqlSchema.void({
            Request: SettingsSchema,
            execute: settings => sql`INSERT OR IGNORE INTO settings ${sql.insert({ id: 1, ...settings })}`
        });
        const replaceSettings = SqlSchema.void({
            Request: SettingsSchema,
            execute: settings => sql`INSERT OR REPLACE INTO settings ${sql.insert({ id: 1, ...settings })}`
        });
        const get = findSettings().pipe(Effect.orDie);
        const save = (settings: Settings) =>
            reactivity.mutation([ReactivityKeyEnum.Settings], replaceSettings(settings)).pipe(Effect.orDie);

        return {
            get,
            save,
            initialize: (settings: Settings) => insertSettings(settings).pipe(Effect.orDie),
            update: (patch: Partial<Settings>) => Effect.flatMap(get, settings => save({ ...settings, ...patch }))
        };
    })
}) {
    static readonly layer = Layer.effect(SettingsRepository, SettingsRepository.make);
}
