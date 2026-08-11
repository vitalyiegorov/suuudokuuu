import { INFINITY_CORPUS_SIZE } from '../constants/infinity-corpus-data.constant';

import { getInfinityCorpusPuzzle } from './get-infinity-corpus-puzzle.util';
import { pickRatedCorpusPuzzle } from './pick-rated-corpus-puzzle.util';

import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';
import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const pickInfinityPuzzle = (random: SeededRandomType): RatedCorpusPuzzleInterface =>
    pickRatedCorpusPuzzle(INFINITY_CORPUS_SIZE, getInfinityCorpusPuzzle, random);
