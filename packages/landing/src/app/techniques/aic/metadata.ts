import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const aicPageMetadata: PageMetadataInterface = {
    path: '/techniques/aic',
    ...buildTechniquePageNames(SolutionTechniqueEnum.AIC),
    metaTitle: 'Sudoku AIC (Alternating Inference Chain) — How to Spot and Use It',
    metaDescription:
        'An AIC alternates strong and weak links across candidates and cells, generalising X-Chains, XY-Chains and coloring into a single elimination technique.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
