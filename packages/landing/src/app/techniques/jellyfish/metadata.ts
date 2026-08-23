import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const jellyfishPageMetadata: PageMetadataInterface = {
    path: '/techniques/jellyfish',
    ...buildTechniquePageNames(SolutionTechniqueEnum.Jellyfish),
    metaTitle: 'Jellyfish Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A Jellyfish extends the X-Wing and Swordfish pattern to four lines: a digit confined to the same four columns across four rows can be erased everywhere else in those columns.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
