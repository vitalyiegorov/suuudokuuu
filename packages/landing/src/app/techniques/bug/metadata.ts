import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const bugPageMetadata: PageMetadataInterface = {
    path: '/techniques/bug',
    ...buildTechniquePageNames(SolutionTechniqueEnum.BivalueUniversalGrave),
    metaTitle: 'BUG+1 Sudoku Technique (Bivalue Universal Grave) Explained',
    metaDescription:
        'A Bivalue Universal Grave (BUG+1) leaves one cell with three candidates; the digit seen three times in that cell’s row, column and box goes there.',
    publishedAt: '2026-10-06T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
