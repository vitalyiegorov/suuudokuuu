import { INFINITY_CORPUS_SIZE } from '../constants/infinity-corpus-data.constant';

import { getInfinityCorpusPuzzle } from './get-infinity-corpus-puzzle.util';
import { transformPuzzle } from './transform-puzzle.util';

import type { InfinityPuzzleInterface } from '../interfaces/infinity-puzzle.interface';
import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const pickInfinityPuzzle = (random: SeededRandomType): InfinityPuzzleInterface => {
    const index = Math.floor(random() * INFINITY_CORPUS_SIZE);
    const { puzzle, rating } = getInfinityCorpusPuzzle(index);

    return { puzzle: transformPuzzle(puzzle, random), rating };
};
