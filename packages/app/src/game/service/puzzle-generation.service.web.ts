import { assessImportedPuzzle, forgeSerializablePuzzle } from '@suuudokuuu/puzzle-forge';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export class PuzzleGenerationService extends Context.Service<PuzzleGenerationService>()('@suuudokuuu/app/PuzzleGenerationService', {
    make: Effect.succeed({
        warm: Effect.void,
        generate: (difficulty: DifficultyEnum, seed?: number) => Effect.try(() => forgeSerializablePuzzle(difficulty, seed)),
        assess: (puzzleString: string) => Effect.try(() => assessImportedPuzzle(puzzleString))
    })
}) {
    static readonly layer = Layer.effect(PuzzleGenerationService, PuzzleGenerationService.make);
}
