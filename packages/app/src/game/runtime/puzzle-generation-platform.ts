import { forgeSerializablePuzzle, isValidPuzzleResult } from '@suuudokuuu/puzzle-forge';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as Semaphore from 'effect/Semaphore';
import { createWorkletRuntime, runOnRuntimeAsync } from 'react-native-worklets';

import type { DifficultyEnum } from '@suuudokuuu/generator';

const generateOnRuntime = (difficulty: DifficultyEnum, seed: number) => {
    'worklet';

    const puzzle = forgeSerializablePuzzle(difficulty, seed);

    return { puzzle, isValid: isValidPuzzleResult(puzzle, difficulty) };
};

export const makePuzzleGenerationPlatform = Effect.gen(function* () {
    const semaphore = yield* Semaphore.make(1);
    const runtime = yield* Effect.cached(Effect.try(() => createWorkletRuntime({ name: 'puzzle-generation', enableNetworking: false })));

    return {
        warm: Effect.asVoid(runtime),
        generate: Effect.fn('puzzle-generation.generate')(function* (difficulty: DifficultyEnum, seed: number) {
            const workerRuntime = yield* runtime;
            const job = yield* Effect.acquireRelease(
                Effect.forkDetach(
                    semaphore.withPermits(1)(
                        Effect.uninterruptible(
                            Effect.tryPromise(() => runOnRuntimeAsync(workerRuntime, generateOnRuntime, difficulty, seed))
                        )
                    )
                ),
                fiber => Effect.sync(() => void fiber.interruptUnsafe())
            );

            return yield* Fiber.join(job);
        }, Effect.scoped)
    };
});
