import { HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';

import { getHellCorpusRecord } from './get-hell-corpus-record.util';
import { pickRatedCorpusPuzzle } from './pick-rated-corpus-puzzle.util';

import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';
import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const pickHellPuzzleRecord = (random: SeededRandomType): RatedCorpusPuzzleInterface =>
    pickRatedCorpusPuzzle(HELL_CORPUS_SIZE, getHellCorpusRecord, random);
