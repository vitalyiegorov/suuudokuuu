import { forgeSerializablePuzzle } from '@suuudokuuu/puzzle-forge';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as Layer from 'effect/Layer';
import * as Semaphore from 'effect/Semaphore';
import { createWorkletRuntime, runOnRuntimeAsync } from 'react-native-worklets';

import type { DifficultyEnum } from '@suuudokuuu/generator';

const workerTimeoutMilliseconds = 15_000;

const forgeOnWorker = (difficulty: DifficultyEnum, seed?: number) => {
    'worklet';

    return forgeSerializablePuzzle(difficulty, seed);
};

export class PuzzleGenerationService extends Context.Service<PuzzleGenerationService>()('@suuudokuuu/app/PuzzleGenerationService', {
    make: Effect.gen(function* () {
        const semaphore = yield* Semaphore.make(1);
        const workerRuntime = yield* Effect.cached(
            Effect.try(() => createWorkletRuntime({ name: 'puzzle-generation', enableNetworking: false }))
        );

        const generateOnWorker = Effect.fn('puzzle-generation.generate')(function* (difficulty: DifficultyEnum, seed: number | undefined) {
            const runtime = yield* workerRuntime;
            const job = yield* Effect.acquireRelease(
                Effect.forkDetach(
                    semaphore.withPermits(1)(
                        Effect.uninterruptible(Effect.tryPromise(() => runOnRuntimeAsync(runtime, forgeOnWorker, difficulty, seed)))
                    )
                ),
                fiber => Effect.sync(() => void fiber.interruptUnsafe())
            );

            return yield* Fiber.join(job);
        }, Effect.scoped);

        return {
            warm: Effect.asVoid(workerRuntime),
            generate: (difficulty: DifficultyEnum, seed?: number) =>
                generateOnWorker(difficulty, seed).pipe(
                    Effect.timeout(workerTimeoutMilliseconds),
                    Effect.catch(error =>
                        Effect.logWarning('puzzle-generation-fallback', error).pipe(
                            Effect.andThen(Effect.try(() => forgeSerializablePuzzle(difficulty, seed)))
                        )
                    )
                )
        };
    })
}) {
    static readonly layer = Layer.effect(PuzzleGenerationService, PuzzleGenerationService.make);
}
