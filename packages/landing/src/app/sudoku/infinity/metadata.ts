import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const infinitySudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/infinity',
    title: buildDifficultyPageTitle(DifficultyEnum.Infinity),
    headline: 'Infinity Sudoku: The World’s Hardest Puzzles',
    metaTitle: 'Infinity Sudoku — Play the World’s Hardest Sudoku Free',
    metaDescription:
        'Play the hardest sudoku puzzles ever published, from Everest and Platinum Blonde to AI Escargot, free and ad-free in the Infinity tier.',
    publishedAt: '2026-10-06T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8
};
