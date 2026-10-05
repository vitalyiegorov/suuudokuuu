import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const nakedSinglePageMetadata: PageMetadataInterface = {
    path: '/techniques/naked-single',
    ...buildTechniquePageNames(SolutionTechniqueEnum.NakedSingle),
    metaTitle: 'Naked Single Sudoku Technique — One Candidate Left',
    metaDescription:
        'A naked single is an empty Sudoku cell where its row, column and box rule out eight of nine digits, leaving one candidate. Worked example and steps.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
