import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const swordfishPageMetadata: PageMetadataInterface = {
    path: '/techniques/swordfish',
    ...buildTechniquePageNames(SolutionTechniqueEnum.Swordfish),
    metaTitle: 'Swordfish Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A Swordfish is the three-line fish pattern: a digit confined to the same three columns across three rows can be erased everywhere else in those columns.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
