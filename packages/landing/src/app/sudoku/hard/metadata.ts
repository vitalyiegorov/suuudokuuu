import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const hardSudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/hard',
    title: buildDifficultyPageTitle(DifficultyEnum.Hard),
    headline: 'Hard Sudoku Puzzles',
    metaTitle: 'Hard Sudoku Puzzles — Play Free Online',
    metaDescription:
        'Free hard Sudoku puzzles with 26 clues, every one guaranteed to need a fish or a wing pattern beyond every subset. Play hard-level Sudoku online for free.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-23T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8
};
