import { assert, describe, it } from '@effect/vitest';
import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

import { ThemeEnum } from '../../src/custom-theme/enum/theme.enum';
import { CustomThemeRepository } from '../../src/custom-theme/repository/custom-theme.repository';
import { themeColors } from '../progress-fixtures';
import { ProgressTestLayer } from '../progress-test.layer';

import type { CustomThemeSchema } from '../../src/custom-theme/schema/custom-theme.schema';

const firstTheme: typeof CustomThemeSchema.Type = {
    id: 'custom-first',
    name: 'First',
    schemaVersion: 2,
    sourceTheme: ThemeEnum.Colorful,
    colors: { light: themeColors, dark: { ...themeColors, background: '#000000' } },
    createdAt: 1000,
    updatedAt: 1000
};
const secondTheme: typeof CustomThemeSchema.Type = { ...firstTheme, id: 'custom-second', name: 'Second' };
const thirdTheme: typeof CustomThemeSchema.Type = { ...firstTheme, id: 'custom-third', name: 'Third' };

describe('CustomThemeRepository', () => {
    it.effect('keeps insertion order across updates and removes by id', () =>
        Effect.gen(function* () {
            const customThemeRepository = yield* CustomThemeRepository;
            const renamedFirstTheme = { ...firstTheme, name: 'Renamed' };

            yield* Effect.forEach([firstTheme, secondTheme, thirdTheme, renamedFirstTheme], customThemeRepository.upsert);
            yield* customThemeRepository.remove(secondTheme.id);

            assert.deepStrictEqual(yield* customThemeRepository.findAll, [renamedFirstTheme, thirdTheme]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('fills the grouped surface for a theme stored before the token existed', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;
            const customThemeRepository = yield* CustomThemeRepository;
            const { group: _lightGroup, ...lightSurface } = themeColors.surface;
            const legacyColors = { ...themeColors, surface: lightSurface };

            yield* sql`INSERT INTO custom_themes ${sql.insert({
                ...firstTheme,
                colors: JSON.stringify({ light: legacyColors, dark: legacyColors })
            })}`;

            const storedGroups = (yield* customThemeRepository.findAll).flatMap(theme => [
                theme.colors.light.surface.group,
                theme.colors.dark.surface.group
            ]);

            assert.deepStrictEqual(storedGroups, ['rgba(128, 128, 128, 0.12)', 'rgba(128, 128, 128, 0.12)']);
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
