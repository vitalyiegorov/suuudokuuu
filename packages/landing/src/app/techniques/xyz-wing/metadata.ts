import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const xyzWingPageMetadata: PageMetadataInterface = {
    path: '/techniques/xyz-wing',
    ...buildTechniquePageNames(SolutionTechniqueEnum.XYZWing),
    metaTitle: 'XYZ-Wing Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'An XYZ-Wing tightens the XY-Wing by giving the pivot cell all three candidates, so the elimination only reaches cells all three cells see.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
