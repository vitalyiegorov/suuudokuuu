import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const pointingPairPageMetadata: PageMetadataInterface = {
    path: '/techniques/pointing-pair',
    ...buildTechniquePageNames(SolutionTechniqueEnum.PointingPair),
    metaTitle: 'Pointing Pair Sudoku Technique — Box to Line Elimination',
    metaDescription:
        'A pointing pair happens when a digit fits in only two cells of a box and both sit on the same row or column, so the digit can be removed from the rest of that line.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
