import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';

import { appRuntime } from '../../@generic/runtime/app.runtime';

import { gameGetInputStatePayload } from './game-get-input-state-payload.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

export const gameToggleInputMode = (engine: FieldEngine): void => {
    engine.toggleInputMode();
    void appRuntime.runPromise(
        Effect.flatMap(CurrentRunService, currentRunService => currentRunService.toggleInputMode(gameGetInputStatePayload(engine)))
    );
};
