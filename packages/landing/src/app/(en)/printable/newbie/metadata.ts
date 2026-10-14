import { PRINTABLE_BOOKLET_SIZE } from '../../../../printable/constants/printable-sample.constant';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const printableNewbieSudokuPageMetadata: PageMetadataInterface = {
    path: '/printable/newbie',
    title: 'Printable Newbie Sudoku',
    headline: 'Printable Newbie Sudoku (PDF)',
    metaTitle: 'Printable Newbie Sudoku PDF — Free Puzzles & Solutions',
    metaDescription: `Download a free printable Newbie sudoku PDF booklet: ${PRINTABLE_BOOKLET_SIZE} large-clue puzzles solved with full houses and naked singles, with solutions.`,
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-23T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
