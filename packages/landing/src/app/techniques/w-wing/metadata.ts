import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const wWingPageMetadata: PageMetadataInterface = {
    path: '/techniques/w-wing',
    ...buildTechniquePageNames(SolutionTechniqueEnum.WWing),
    metaTitle: 'W-Wing Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A W-Wing pairs two identical bivalue cells through a strong link on one candidate, letting the other candidate be erased from cells both cells see.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
