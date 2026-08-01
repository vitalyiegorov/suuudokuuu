import { HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';

import { getHellCorpusPuzzle } from './get-hell-corpus-puzzle.util';
import { transformPuzzle } from './transform-puzzle.util';

import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const pickHellPuzzle = (random: SeededRandomType): string => {
    const index = Math.floor(random() * HELL_CORPUS_SIZE);

    return transformPuzzle(getHellCorpusPuzzle(index), random);
};
