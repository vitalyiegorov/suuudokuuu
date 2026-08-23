import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const pointingTriplePageMetadata: PageMetadataInterface = {
    path: '/techniques/pointing-triple',
    ...buildTechniquePageNames(SolutionTechniqueEnum.PointingTriple),
    metaTitle: 'Pointing Triple Sudoku Technique — Three Cells, One Line',
    metaDescription:
        'A pointing triple happens when a digit fits in exactly three cells of a box and all three share one row or column, letting you strike the digit from the rest of that line.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
