import * as Effect from 'effect/Effect';

import type { FieldEngine } from '@suuudokuuu/field-core';

const finishingEngines = new WeakSet<FieldEngine>();

export const finishGameOnce = <Error, Services>(engine: FieldEngine, persistence: Effect.Effect<void, Error, Services>) =>
    Effect.uninterruptible(
        Effect.gen(function* () {
            if (finishingEngines.has(engine)) {
                return false;
            }
            finishingEngines.add(engine);
            yield* persistence;

            return true;
        })
    );
