import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const finnedXWingPageMetadata: PageMetadataInterface = {
    path: '/techniques/finned-x-wing',
    ...buildTechniquePageNames(SolutionTechniqueEnum.FinnedXWing),
    metaTitle: 'Finned X-Wing Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A Finned X-Wing is an X-Wing with an extra candidate, or fin, that still supports a smaller, safe set of eliminations near the fin.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
