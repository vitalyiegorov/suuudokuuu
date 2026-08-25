import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const hiddenSinglePageMetadata: PageMetadataInterface = {
    path: '/techniques/hidden-single',
    ...buildTechniquePageNames(SolutionTechniqueEnum.HiddenSingle),
    metaTitle: 'Hidden Single Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A hidden single is a digit that fits in only one cell of a row, column or box, even when that cell still has several candidates. Worked example, spotting steps and FAQs.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
