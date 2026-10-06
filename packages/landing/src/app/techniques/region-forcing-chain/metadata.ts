import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const regionForcingChainPageMetadata: PageMetadataInterface = {
    path: '/techniques/region-forcing-chain',
    ...buildTechniquePageNames(SolutionTechniqueEnum.RegionForcingChain),
    metaTitle: 'Region Forcing Chain Sudoku Technique — How It Works',
    metaDescription:
        'A region forcing chain tries every cell where a digit can go in one row, column or box, and keeps whatever all of those branches agree on.',
    publishedAt: '2026-10-06T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
