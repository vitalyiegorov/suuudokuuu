import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';

import { makePuzzleGenerationPlatform } from '../runtime/puzzle-generation-platform';

export class PuzzleGenerationService extends Context.Service<PuzzleGenerationService>()('@suuudokuuu/app/PuzzleGenerationService', {
    make: makePuzzleGenerationPlatform
}) {
    static readonly layer = Layer.effect(PuzzleGenerationService, PuzzleGenerationService.make);
}
