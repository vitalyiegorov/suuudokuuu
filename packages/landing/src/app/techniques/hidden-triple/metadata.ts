import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const hiddenTriplePageMetadata: PageMetadataInterface = {
    path: '/techniques/hidden-triple',
    ...buildTechniquePageNames(SolutionTechniqueEnum.HiddenTriple),
    metaTitle: 'Hidden Triple Sudoku Technique — Finding Three Buried Digits',
    metaDescription:
        'A hidden triple is three digits confined to the same three cells of a unit. Those cells are reserved for the triple, so their remaining candidates can all be erased.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
