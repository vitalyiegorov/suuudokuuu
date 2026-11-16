import { assessImportedPuzzle, forgeSerializablePuzzle, repairRecognizedPuzzle } from '@suuudokuuu/puzzle-forge';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as Layer from 'effect/Layer';
import * as Semaphore from 'effect/Semaphore';
import { createWorkletRuntime, runOnRuntimeAsync } from 'react-native-worklets';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { RecognizedPuzzleInterface } from '@suuudokuuu/puzzle-forge';
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

const repairOnWorker = (recognized: RecognizedPuzzleInterface, uncertainConfidence: number) => {
    'worklet';

    return repairRecognizedPuzzle(recognized, uncertainConfidence);
};

export class PuzzleGenerationService extends Context.Service<PuzzleGenerationService>()('@suuudokuuu/app/PuzzleGenerationService', {
    make: Effect.gen(function* () {
        const semaphore = yield* Semaphore.make(1);
        const workerRuntime = yield* Effect.cached(
            Effect.try(() => createWorkletRuntime({ name: 'puzzle-generation', enableNetworking: false }))
        );

        const runOnWorker = <A>(spanName: string, job: (runtime: WorkletRuntime) => Promise<A>) =>
            Effect.gen(function* () {
                const runtime = yield* workerRuntime;
                const fiber = yield* Effect.acquireRelease(
                    Effect.forkDetach(semaphore.withPermits(1)(Effect.uninterruptible(Effect.tryPromise(() => job(runtime))))),
                    detachedFiber => Effect.sync(() => void detachedFiber.interruptUnsafe())
                );

                return yield* Fiber.join(fiber);
            }).pipe(Effect.scoped, Effect.withSpan(spanName), Effect.timeout(workerTimeoutMilliseconds));

        const runOnJsThread =
            <A>(job: () => A) =>
            (error: unknown) =>
                Effect.logWarning('puzzle-worker-fallback', error).pipe(Effect.andThen(Effect.try(job)));

        const runOnWorkerWhenAvailable = <A>(spanName: string, job: (runtime: WorkletRuntime) => Promise<A>, jsThreadJob: () => A) =>
            workerRuntime.pipe(Effect.matchEffect({ onFailure: runOnJsThread(jsThreadJob), onSuccess: () => runOnWorker(spanName, job) }));

        return {
            warm: Effect.asVoid(workerRuntime),
            generate: (difficulty: DifficultyEnum, seed?: number) =>
                runOnWorker('puzzle-generation.generate', runtime => runOnRuntimeAsync(runtime, forgeOnWorker, difficulty, seed)).pipe(
                    Effect.catch(runOnJsThread(() => forgeSerializablePuzzle(difficulty, seed)))
                ),
            assess: (puzzleString: string) =>
                runOnWorkerWhenAvailable(
                    'puzzle-generation.assess',
                    runtime => runOnRuntimeAsync(runtime, assessOnWorker, puzzleString),
                    () => assessImportedPuzzle(puzzleString)
                ),
            repair: (recognized: RecognizedPuzzleInterface, uncertainConfidence: number) =>
                runOnWorkerWhenAvailable(
                    'puzzle-generation.repair',
                    runtime => runOnRuntimeAsync(runtime, repairOnWorker, recognized, uncertainConfidence),
                    () => repairRecognizedPuzzle(recognized, uncertainConfidence)
                )
        };
    })
}) {
    static readonly layer = Layer.effect(PuzzleGenerationService, PuzzleGenerationService.make);
}
