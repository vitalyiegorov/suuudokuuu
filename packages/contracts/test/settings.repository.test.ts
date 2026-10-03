import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import { ReactivityKeyEnum } from '../src/@generic/enum/reactivity-key.enum';
import { SettingsRepository } from '../src/settings/repository/settings.repository';

import { ContractsTestLayer } from './contracts-test.layer';
import { trackInvalidations } from './track-invalidations.util';

import type { SettingsSchema } from '../src/settings/schema/settings.schema';

const settings: typeof SettingsSchema.Type = {
    hasVibration: true,
    hasTimer: false,
    showAreas: true,
    showIdenticalNumbers: false,
    showComboAnimation: true,
    showFilledNumbers: true,
    showActiveCandidates: false,
    keepActiveCell: true,
    keepExhaustedDigits: true,
    allowHintsOnHardDifficulties: false,
    isLeftHanded: true,
    calmMode: false,
    motionPreference: 'reduced',
    fontSize: 'xl',
    language: 'uk',
    theme: 'custom-abc',
    isDarkColorSchema: true,
    cellMargin: 2,
    lastGameDifficulty: DifficultyEnum.Hard,
    lastGameMaxMistakes: 3,
    lastGameChallengeMode: false,
    lastStatsDifficulty: DifficultyEnum.Nightmare
};

describe('SettingsRepository', () => {
    it.effect('round-trips settings and invalidates only the settings key', () =>
        Effect.gen(function* () {
            const settingsRepository = yield* SettingsRepository;
            const invalidatedKeys = yield* trackInvalidations;

            assert.isTrue(Option.isNone(yield* settingsRepository.get));

            yield* settingsRepository.save(settings);
            yield* settingsRepository.save({ ...settings, language: 'de' });

            assert.deepStrictEqual(yield* settingsRepository.get, Option.some({ ...settings, language: 'de' }));
            assert.deepStrictEqual(invalidatedKeys, [ReactivityKeyEnum.Settings, ReactivityKeyEnum.Settings]);
        }).pipe(Effect.scoped, Effect.provide(ContractsTestLayer))
    );
});
