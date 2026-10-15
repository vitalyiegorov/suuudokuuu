import { PRINTABLE_BOOKLET_SIZE } from '../../../../printable/constants/printable-sample.constant';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const printableHardSudokuPageMetadata: PageMetadataInterface = {
    path: '/printable/hard',
    title: 'Printable Hard Sudoku',
    headline: 'Printable Hard Sudoku (PDF)',
    metaTitle: 'Printable Hard Sudoku PDF — Free Puzzles & Solutions',
    metaDescription: `Download a free printable Hard sudoku PDF booklet: ${PRINTABLE_BOOKLET_SIZE} puzzles that each need a fish or a wing pattern beyond every subset, with solutions.`,
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-15T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
