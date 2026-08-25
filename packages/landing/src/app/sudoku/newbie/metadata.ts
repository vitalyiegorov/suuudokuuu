import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const newbieSudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/newbie',
    title: buildDifficultyPageTitle(DifficultyEnum.Newbie),
    headline: 'Beginner Sudoku Puzzles (Newbie Level)',
    metaTitle: 'Beginner Sudoku Puzzles (Newbie Level) — Play Free Online',
    metaDescription:
        'Free beginner Sudoku puzzles with 37 clues, guaranteed solvable with full houses and naked singles alone. Play Newbie-level Sudoku online, no ads, no sign-up.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-23T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8
};
