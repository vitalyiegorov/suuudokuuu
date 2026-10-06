import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const nishioForcingChainPageMetadata: PageMetadataInterface = {
    path: '/techniques/nishio-forcing-chain',
    ...buildTechniquePageNames(SolutionTechniqueEnum.NishioForcingChain),
    metaTitle: 'Nishio Forcing Chain Sudoku Technique — How It Works',
    metaDescription:
        'A Nishio forcing chain assumes one candidate, follows the singles it forces, and erases that candidate when the chain runs into a contradiction.',
    publishedAt: '2026-10-06T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
