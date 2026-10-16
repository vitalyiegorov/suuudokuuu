import * as Effect from 'effect/Effect';

import { appRuntime } from '../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../@generic/utils/log-error-cause.util';

import type { AppServices } from '../../@generic/runtime/app.runtime';
import type { FieldEngine } from '@suuudokuuu/field-core';

const finishingEngines = new WeakSet<FieldEngine>();

export const finishGameOnce = (engine: FieldEngine, persistence: Effect.Effect<void, never, AppServices>, openResultScreen: () => void) => {
    if (finishingEngines.has(engine)) {
        return;
    }
    finishingEngines.add(engine);
    appRuntime.runFork(persistence.pipe(Effect.tapCause(logErrorCause)));
    openResultScreen();
};
