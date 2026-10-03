import { SettingsRepository } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';

import { appRuntime } from '../../@generic/runtime/app.runtime';

import type { SettingsType } from '@suuudokuuu/progress';

export const updateSettings = (patch: Partial<SettingsType>) =>
    appRuntime.runPromise(Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update(patch)));
