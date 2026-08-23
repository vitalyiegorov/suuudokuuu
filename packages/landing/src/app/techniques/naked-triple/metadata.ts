import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const nakedTriplePageMetadata: PageMetadataInterface = {
    path: '/techniques/naked-triple',
    ...buildTechniquePageNames(SolutionTechniqueEnum.NakedTriple),
    metaTitle: 'Naked Triple Sudoku Technique — Three Cells, Three Candidates',
    metaDescription:
        'A naked triple is three cells in one unit whose candidates together use only three digits, so those digits belong to the triple and leave every other cell in the unit.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
