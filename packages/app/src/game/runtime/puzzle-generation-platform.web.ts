import { forgeSerializablePuzzle, isValidPuzzleResult } from '@suuudokuuu/puzzle-forge';
import * as Effect from 'effect/Effect';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const makePuzzleGenerationPlatform = Effect.succeed({
    warm: Effect.void,
    generate: (difficulty: DifficultyEnum, seed: number) =>
        Effect.try(() => {
            const puzzle = forgeSerializablePuzzle(difficulty, seed);

            return { puzzle, isValid: isValidPuzzleResult(puzzle, difficulty) };
        })
});
