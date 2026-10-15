import { getInfinityCorpusPuzzle, infinityCorpusSize } from '@suuudokuuu/hell-corpus';

import { countClues } from '../../puzzle/utils/count-clues.util';

import type { InfinityPuzzleInterface } from '@suuudokuuu/hell-corpus';

export const INFINITY_CORPUS_PUZZLES: InfinityPuzzleInterface[] = Array.from({ length: infinityCorpusSize }, (_, index) =>
    getInfinityCorpusPuzzle(index)
);

const INFINITY_RATINGS = INFINITY_CORPUS_PUZZLES.map(entry => entry.rating);

const INFINITY_GIVEN_COUNTS = INFINITY_CORPUS_PUZZLES.map(entry => countClues(entry.puzzle));

export const INFINITY_LOWEST_RATING = Math.min(...INFINITY_RATINGS);

export const INFINITY_HIGHEST_RATING = Math.max(...INFINITY_RATINGS);

export const INFINITY_MINIMUM_GIVEN_COUNT = Math.min(...INFINITY_GIVEN_COUNTS);

export const INFINITY_MAXIMUM_GIVEN_COUNT = Math.max(...INFINITY_GIVEN_COUNTS);
