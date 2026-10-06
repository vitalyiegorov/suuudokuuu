import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const uniqueRectanglePageMetadata: PageMetadataInterface = {
    path: '/techniques/unique-rectangle',
    ...buildTechniquePageNames(SolutionTechniqueEnum.UniqueRectangle),
    metaTitle: 'Unique Rectangle Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A Unique Rectangle uses the one-solution rule: when three corners of a rectangle hold the same two digits, the fourth corner cannot take either.',
    publishedAt: '2026-10-06T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
