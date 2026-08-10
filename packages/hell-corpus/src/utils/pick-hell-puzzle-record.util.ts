import { HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';

import { getHellCorpusRecord } from './get-hell-corpus-record.util';
import { transformPuzzle } from './transform-puzzle.util';

import type { HellPuzzleInterface } from '../interfaces/hell-puzzle.interface';
import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const pickHellPuzzleRecord = (random: SeededRandomType): HellPuzzleInterface => {
    const index = Math.floor(random() * HELL_CORPUS_SIZE);
    const { puzzle, rating } = getHellCorpusRecord(index);

    return { puzzle: transformPuzzle(puzzle, random), rating };
};
