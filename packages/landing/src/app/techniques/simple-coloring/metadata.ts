import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const simpleColoringPageMetadata: PageMetadataInterface = {
    path: '/techniques/simple-coloring',
    ...buildTechniquePageNames(SolutionTechniqueEnum.SimpleColoring),
    metaTitle: 'Simple Coloring Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'Simple coloring assigns two alternating colors to a chain of strong links on one digit, then erases any candidate that sees cells of both colors.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
