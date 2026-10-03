import { assert, describe, it } from '@effect/vitest';
import * as Effect from 'effect/Effect';

import { ReactivityKeyEnum } from '../../src/@generic/enum/reactivity-key.enum';
import { SettingsRepository } from '../../src/settings/repository/settings.repository';
import { initialSettings } from '../progress-fixtures';
import { ProgressTestLayer } from '../progress-test.layer';
import { trackInvalidations } from '../track-invalidations.util';

const settings = { ...initialSettings, theme: 'custom-abc' as const, language: 'uk' as const };

describe('SettingsRepository', () => {
    it.effect('initializes defaults once and merges updates under the settings key', () =>
        Effect.gen(function* () {
            const settingsRepository = yield* SettingsRepository;
            const invalidatedKeys = yield* trackInvalidations;

            yield* settingsRepository.initialize(settings);
            yield* settingsRepository.initialize({ ...settings, language: 'fr' });
            yield* settingsRepository.update({ language: 'de' });

            assert.deepStrictEqual(yield* settingsRepository.get, { ...settings, language: 'de' });
            assert.deepStrictEqual(invalidatedKeys, [ReactivityKeyEnum.Settings]);
        }).pipe(Effect.scoped, Effect.provide(ProgressTestLayer))
    );
});
