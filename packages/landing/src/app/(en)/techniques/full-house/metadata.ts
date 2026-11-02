import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const fullHousePageMetadata: PageMetadataInterface = {
    path: '/techniques/full-house',
    ...buildTechniquePageNames(SolutionTechniqueEnum.FullHouse),
    metaTitle: 'Full House Sudoku: Solve the Last Empty Cell in a Unit',
    metaDescription:
        'A full house in Sudoku is the last empty cell in a row, column or box, and its value is the one digit still missing. Worked example, spotting steps and FAQ.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-15T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
