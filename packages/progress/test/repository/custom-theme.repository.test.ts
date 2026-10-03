import { assert, describe, it } from '@effect/vitest';
import * as Effect from 'effect/Effect';

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
});
