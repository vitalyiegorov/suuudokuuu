import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const xyWingPageMetadata: PageMetadataInterface = {
    path: '/techniques/xy-wing',
    ...buildTechniquePageNames(SolutionTechniqueEnum.XYWing),
    metaTitle: 'XY-Wing Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'An XY-Wing links three bivalue cells so that whichever value the pivot holds, a shared candidate can be erased from cells that see both pincers.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
