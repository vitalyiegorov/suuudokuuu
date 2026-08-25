import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const nakedPairPageMetadata: PageMetadataInterface = {
    path: '/techniques/naked-pair',
    ...buildTechniquePageNames(SolutionTechniqueEnum.NakedPair),
    metaTitle: 'Naked Pair Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A naked pair is two cells in one unit that hold the same two candidates and nothing else, which locks those digits into the pair and clears them from every other cell.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
