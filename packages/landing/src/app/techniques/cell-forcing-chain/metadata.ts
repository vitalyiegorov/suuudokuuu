import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const cellForcingChainPageMetadata: PageMetadataInterface = {
    path: '/techniques/cell-forcing-chain',
    ...buildTechniquePageNames(SolutionTechniqueEnum.CellForcingChain),
    metaTitle: 'Cell Forcing Chain Sudoku Technique — How It Works',
    metaDescription:
        'A cell forcing chain tries every candidate of one cell and keeps any placement or elimination that all of the branches agree on.',
    publishedAt: '2026-10-06T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
