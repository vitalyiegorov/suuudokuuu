import { DAILY_BUILD_DATE } from '../../../daily/constants/daily-archive.constant';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const dailySudokuPageMetadata: PageMetadataInterface = {
    path: '/daily-sudoku',
    title: 'Daily sudoku',
    headline: 'Daily Sudoku — Today’s Free Puzzle',
    metaTitle: 'Daily Sudoku — Free New Puzzle Every Day, With Solution',
    metaDescription:
        'A new free sudoku every day, the same grid as the Suuudokuuu app’s daily challenge, with its SE rating, the techniques it needs and a step-by-step solution.',
    publishedAt: '2026-10-15T00:00:00.000Z',
    updatedAt: `${DAILY_BUILD_DATE}T00:00:00.000Z`,
    changeFrequency: 'daily',
    priority: 0.8
};
