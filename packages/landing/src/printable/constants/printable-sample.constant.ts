import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { INFINITY_CORPUS_PUZZLES } from '../../difficulty/constants/infinity-corpus.constant';
import { RATING_SAMPLE_PUZZLES } from '../../rating/constants/rating-sample.constant';

import type { RatedSamplePuzzleInterface } from '../../rating/interfaces/rated-sample-puzzle.interface';

export const PRINTABLE_BOOKLET_SIZE = 16;

export const PRINTABLE_LARGE_PRINT_SIZE = 12;

const toBookletPuzzles = (sample: RatedSamplePuzzleInterface[]): string[] =>
    sample.slice(0, PRINTABLE_BOOKLET_SIZE).map(entry => entry.puzzle);

export const PRINTABLE_BOOKLET_PUZZLES: Record<DifficultyEnum, string[]> = {
    [DifficultyEnum.Newbie]: toBookletPuzzles(RATING_SAMPLE_PUZZLES[DifficultyEnum.Newbie]),
    [DifficultyEnum.Easy]: toBookletPuzzles(RATING_SAMPLE_PUZZLES[DifficultyEnum.Easy]),
    [DifficultyEnum.Medium]: toBookletPuzzles(RATING_SAMPLE_PUZZLES[DifficultyEnum.Medium]),
    [DifficultyEnum.Hard]: toBookletPuzzles(RATING_SAMPLE_PUZZLES[DifficultyEnum.Hard]),
    [DifficultyEnum.Nightmare]: toBookletPuzzles(RATING_SAMPLE_PUZZLES[DifficultyEnum.Nightmare]),
    [DifficultyEnum.Hell]: toBookletPuzzles(RATING_SAMPLE_PUZZLES[DifficultyEnum.Hell]),
    [DifficultyEnum.Infinity]: INFINITY_CORPUS_PUZZLES.slice(0, PRINTABLE_BOOKLET_SIZE).map(entry =>
        Sudoku.fromString(entry.puzzle, defaultSudokuConfig).toString()
    )
};

export const PRINTABLE_LARGE_PRINT_PUZZLES: string[] = RATING_SAMPLE_PUZZLES[DifficultyEnum.Easy]
    .slice(PRINTABLE_BOOKLET_SIZE, PRINTABLE_BOOKLET_SIZE + PRINTABLE_LARGE_PRINT_SIZE)
    .map(entry => entry.puzzle);
