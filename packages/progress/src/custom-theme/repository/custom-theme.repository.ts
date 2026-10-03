import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { CustomThemeSchema } from '../schema/custom-theme.schema';
import { CustomThemeIdSchema } from '../schema/theme-id.schema';

export class CustomThemeRepository extends Context.Service<CustomThemeRepository>()('@suuudokuuu/progress/CustomThemeRepository', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const reactivity = yield* Reactivity.Reactivity;
        const findAllThemes = SqlSchema.findAll({
            Request: Schema.Void,
            Result: CustomThemeSchema,
            execute: () => sql`SELECT * FROM custom_themes ORDER BY rowid`
        });
        const upsertTheme = SqlSchema.void({
            Request: CustomThemeSchema,
            execute: theme => sql`INSERT INTO custom_themes ${sql.insert(theme)} ON CONFLICT(id) DO UPDATE SET ${sql.update(theme, ['id'])}`
        });
        const deleteTheme = SqlSchema.void({
            Request: CustomThemeIdSchema,
            execute: id => sql`DELETE FROM custom_themes WHERE id = ${id}`
        });

        return {
            findAll: findAllThemes().pipe(Effect.orDie),
            upsert: (theme: typeof CustomThemeSchema.Type) =>
                reactivity.mutation([ReactivityKeyEnum.CustomThemes], upsertTheme(theme)).pipe(Effect.orDie),
            remove: (id: typeof CustomThemeIdSchema.Type) =>
                reactivity.mutation([ReactivityKeyEnum.CustomThemes], deleteTheme(id)).pipe(Effect.orDie),
            removeAll: reactivity.mutation([ReactivityKeyEnum.CustomThemes], sql`DELETE FROM custom_themes`).pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(CustomThemeRepository, CustomThemeRepository.make);
}
