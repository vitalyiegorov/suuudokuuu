import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const nakedSinglePageMetadata: PageMetadataInterface = {
    path: '/techniques/naked-single',
    ...buildTechniquePageNames(SolutionTechniqueEnum.NakedSingle),
    metaTitle: 'Naked Single Sudoku: The Cell With One Candidate Left',
    metaDescription:
        'A naked single, also called a sole candidate, is an empty cell whose row, column and box rule out eight digits. Worked example, spotting steps and FAQ.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-15T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
