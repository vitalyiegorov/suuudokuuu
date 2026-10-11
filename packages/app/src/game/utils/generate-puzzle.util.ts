import { DifficultyEnum } from '@suuudokuuu/generator';
import { forgeSerializablePuzzle, isValidPuzzleResult } from '@suuudokuuu/puzzle-forge';
import * as Clock from 'effect/Clock';
import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';
import { Platform } from 'react-native';

import { getErrorMessage } from '@rnw-community/shared';

import { PuzzleGenerationService } from '../service/puzzle-generation.service';

const workerTimeoutMilliseconds = 15_000;

const puzzleResultSchema = Schema.Struct({
    difficulty: Schema.Enum(DifficultyEnum),
    sudokuString: Schema.String.pipe(Schema.check(Schema.isPattern(/^[1-9.]{81}$/u))),
    solutionString: Schema.String.pipe(Schema.check(Schema.isPattern(/^[1-9]{81}$/u))),
    rating: Schema.Finite.pipe(Schema.check(Schema.isGreaterThan(0))),
    isRatingCeiling: Schema.Boolean,
    isInBand: Schema.Boolean
});

const decodePuzzleResult = (result: unknown, difficulty: DifficultyEnum) =>
    Schema.decodeUnknownEffect(
        Schema.Struct({
            puzzle: puzzleResultSchema.pipe(Schema.check(Schema.makeFilter(puzzle => puzzle.difficulty === difficulty))),
            isValid: Schema.Literal(true)
        })
    )(result).pipe(Effect.map(response => response.puzzle));

export const generatePuzzle = Effect.fn('generatePuzzle')(function* (difficulty: DifficultyEnum, seed: number) {
    const service = yield* PuzzleGenerationService;
    const startedAt = yield* Clock.currentTimeMillis;
    const outcome = yield* service.generate(difficulty, seed).pipe(
        Effect.flatMap(result => decodePuzzleResult(result, difficulty)),
        Effect.timeout(workerTimeoutMilliseconds),
        Effect.map(puzzle => ({ puzzle, fallbackReason: '' })),
        Effect.catch(error =>
            Effect.gen(function* () {
                const puzzle = yield* Effect.try(() => {
                    const fallbackPuzzle = forgeSerializablePuzzle(difficulty, seed);

                    return { puzzle: fallbackPuzzle, isValid: isValidPuzzleResult(fallbackPuzzle, difficulty) };
                }).pipe(Effect.flatMap(result => decodePuzzleResult(result, difficulty)));

                return { puzzle, fallbackReason: getErrorMessage(error) };
            })
        )
    );
    const finishedAt = yield* Clock.currentTimeMillis;

    yield* Effect.logInfo('puzzle-generation', {
        difficulty,
        platform: Platform.OS,
        elapsedMilliseconds: finishedAt - startedAt,
        fallbackReason: outcome.fallbackReason,
        isInBand: outcome.puzzle.isInBand
    });

    return outcome.puzzle;
});
