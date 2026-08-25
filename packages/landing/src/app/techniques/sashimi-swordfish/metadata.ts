import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { buildTechniquePageNames } from '../../../techniques/utils/build-technique-page-names.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

export const sashimiSwordfishPageMetadata: PageMetadataInterface = {
    path: '/techniques/sashimi-swordfish',
    ...buildTechniquePageNames(SolutionTechniqueEnum.SashimiSwordfish),
    metaTitle: 'Sashimi Swordfish Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'A Sashimi Swordfish is the three-line sashimi pattern: one base line keeps only a fin, yet the fish still proves the same eliminations.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
