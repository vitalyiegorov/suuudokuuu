import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const boxLineReductionPageMetadata: PageMetadataInterface = {
    path: '/techniques/box-line-reduction',
    ...buildTechniquePageNames(SolutionTechniqueEnum.BoxLineReduction),
    metaTitle: 'Box Line Reduction Sudoku Technique — Line to Box Elimination',
    metaDescription:
        'Box line reduction is the mirror of a pointing pair: when a digit fits only inside one box along a row or column, it can be removed from the rest of that box.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
