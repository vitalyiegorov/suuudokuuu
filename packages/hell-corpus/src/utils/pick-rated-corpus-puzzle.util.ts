import { transformPuzzle } from './transform-puzzle.util';

import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';
import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const pickRatedCorpusPuzzle = (
    corpusSize: number,
    getRecord: (index: number) => RatedCorpusPuzzleInterface,
    random: SeededRandomType
): RatedCorpusPuzzleInterface => {
    const index = Math.floor(random() * corpusSize);
    const { puzzle, rating, isCeiling } = getRecord(index);

    return { puzzle: transformPuzzle(puzzle, random), rating, isCeiling };
};
