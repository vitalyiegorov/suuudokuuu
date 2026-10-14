import { PRINTABLE_BOOKLET_SIZE } from '../../../../printable/constants/printable-sample.constant';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const printableInfinitySudokuPageMetadata: PageMetadataInterface = {
    path: '/printable/infinity',
    title: 'Printable Infinity Sudoku',
    headline: 'Printable Infinity Sudoku PDF (Record Puzzles)',
    metaTitle: 'Printable Hardest Sudoku PDF — Infinity Record Puzzles',
    metaDescription: `Download a free printable PDF of ${PRINTABLE_BOOKLET_SIZE} record sudoku puzzles, Everest and AI Escargot among them, from our Infinity tier, with solutions.`,
    publishedAt: '2026-10-06T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
