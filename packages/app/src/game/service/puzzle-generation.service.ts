import { assessImportedPuzzle, forgeSerializablePuzzle } from '@suuudokuuu/puzzle-forge';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as Layer from 'effect/Layer';
import * as Semaphore from 'effect/Semaphore';
import { createWorkletRuntime, runOnRuntimeAsync } from 'react-native-worklets';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { WorkletRuntime } from 'react-native-worklets';

const workerTimeoutMilliseconds = 15_000;

const forgeOnWorker = (difficulty: DifficultyEnum, seed?: number) => {
    'worklet';

    return forgeSerializablePuzzle(difficulty, seed);
};

const assessOnWorker = (puzzleString: string) => {
    'worklet';

    return assessImportedPuzzle(puzzleString);
};

export class PuzzleGenerationService extends Context.Service<PuzzleGenerationService>()('@suuudokuuu/app/PuzzleGenerationService', {
    make: Effect.gen(function* () {
        const semaphore = yield* Semaphore.make(1);
        const workerRuntime = yield* Effect.cached(
            Effect.try(() => createWorkletRuntime({ name: 'puzzle-generation', enableNetworking: false }))
        );

        const runOnWorker = <A>(spanName: string, job: (runtime: WorkletRuntime) => Promise<A>, runOnJsThread: () => A) =>
            Effect.gen(function* () {
                const runtime = yield* workerRuntime;
                const fiber = yield* Effect.acquireRelease(
                    Effect.forkDetach(semaphore.withPermits(1)(Effect.uninterruptible(Effect.tryPromise(() => job(runtime))))),
                    detachedFiber => Effect.sync(() => void detachedFiber.interruptUnsafe())
                );

                return yield* Fiber.join(fiber);
            }).pipe(
                Effect.scoped,
                Effect.withSpan(spanName),
                Effect.timeout(workerTimeoutMilliseconds),
                Effect.catch(error =>
                    Effect.logWarning('puzzle-worker-fallback', spanName, error).pipe(Effect.andThen(Effect.try(runOnJsThread)))
                )
            );

        return {
            warm: Effect.asVoid(workerRuntime),
            generate: (difficulty: DifficultyEnum, seed?: number) =>
                runOnWorker(
                    'puzzle-generation.generate',
                    runtime => runOnRuntimeAsync(runtime, forgeOnWorker, difficulty, seed),
                    () => forgeSerializablePuzzle(difficulty, seed)
                ),
            assess: (puzzleString: string) =>
                runOnWorker(
                    'puzzle-generation.assess',
                    runtime => runOnRuntimeAsync(runtime, assessOnWorker, puzzleString),
                    () => assessImportedPuzzle(puzzleString)
                )
        };
    })
}) {
    static readonly layer = Layer.effect(PuzzleGenerationService, PuzzleGenerationService.make);
}
