import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const hellSudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/hell',
    title: buildDifficultyPageTitle(DifficultyEnum.Hell),
    headline: 'Evil Sudoku Puzzles (Hell Level)',
    metaTitle: 'Evil Sudoku (Hell Level) — The Hardest Free Puzzles Online',
    metaDescription:
        'Free evil, extreme Sudoku where every board needs a forcing chain, beyond chains, coloring and AIC. Play the hardest Hell-level Sudoku online for free.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8
};
