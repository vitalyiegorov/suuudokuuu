import { RATING_SAMPLE_TOTAL } from '../../../../rating/constants/rating-sample.constant';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const sudokuDifficultyRatingPageMetadata: PageMetadataInterface = {
    path: '/guides/sudoku-difficulty-rating',
    title: 'Sudoku difficulty rating explained',
    headline: 'SE Rating (Sudoku Explainer): Sudoku Difficulty Explained',
    metaTitle: 'SE Rating Sudoku: Sudoku Explainer Scale Explained',
    metaDescription: `An SE rating (Sudoku Explainer rating) runs from 1.0 to about 12.0 and is set by the hardest technique a puzzle needs. The ladder, plus data from ${RATING_SAMPLE_TOTAL} puzzles.`,
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-14T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.9
};
