import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const easySudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/easy',
    title: buildDifficultyPageTitle(DifficultyEnum.Easy),
    headline: 'Easy Sudoku Puzzles',
    metaTitle: 'Easy Sudoku Puzzles — Play Free Online',
    metaDescription:
        'Free easy Sudoku puzzles with 31 clues, every one guaranteed to need a hidden single and nothing harder. Play easy-level Sudoku online for free, no ads.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-23T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8
};
