import { assert, describe, it } from '@effect/vitest';
import * as Effect from 'effect/Effect';

import { CustomThemeRepository } from '../src/custom-theme/repository/custom-theme.repository';

import { ContractsTestLayer } from './contracts-test.layer';

import type { CustomThemeSchema } from '../src/custom-theme/schema/custom-theme.schema';

const white = '#ffffff';
const colors = {
    background: white,
    ink: white,
    inkText: white,
    overlayLight: white,
    overlayDark: white,
    danger: white,
    dangerText: white,
    accent: white,
    text: { primary: white, hint: white },
    board: { selected: white, selectedText: white, sameValue: white, sameValueText: white, error: white, filled: white, emptyText: white },
    candidate: { text: white, textSelected: white, fill: white, fillSelected: white, borderSelected: white },
    numpad: { track: white, trackFilled: white, trackFilledText: white, text: white },
    surface: { raised: white, raisedText: white, subtle: white, subtleText: white, subtleHint: white, border: white }
};
const firstTheme: typeof CustomThemeSchema.Type = {
    id: 'custom-first',
    name: 'First',
    schemaVersion: 2,
    sourceTheme: 'colorful',
    colors: { light: colors, dark: { ...colors, background: '#000000' } },
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
        }).pipe(Effect.provide(ContractsTestLayer))
    );
});
