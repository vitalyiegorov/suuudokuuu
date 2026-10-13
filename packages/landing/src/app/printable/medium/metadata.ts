import { PRINTABLE_BOOKLET_SIZE } from '../../../printable/constants/printable-sample.constant';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const printableMediumSudokuPageMetadata: PageMetadataInterface = {
    path: '/printable/medium',
    title: 'Printable Medium Sudoku',
    headline: 'Printable Medium Sudoku (PDF)',
    metaTitle: 'Printable Medium Sudoku PDF — Free Puzzles & Solutions',
    metaDescription: `Download a free printable Medium sudoku PDF booklet: ${PRINTABLE_BOOKLET_SIZE} puzzles that each stall on singles and need an intersection or a subset, with solutions.`,
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-23T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
