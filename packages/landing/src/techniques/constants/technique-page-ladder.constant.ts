import { techniquesPageMetadata } from '../../app/techniques/metadata';
import { TECHNIQUE_LADDER } from '../../rating/constants/technique-ladder.constant';

import { TECHNIQUE_PAGE_PATHS } from './technique-page-path.constant';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const TECHNIQUE_PAGE_LADDER: SolutionTechniqueEnum[] = TECHNIQUE_LADDER.filter(
    technique => TECHNIQUE_PAGE_PATHS[technique] !== techniquesPageMetadata.path
);
