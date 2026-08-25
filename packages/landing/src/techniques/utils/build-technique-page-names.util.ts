import { TECHNIQUE_NAMES } from '../constants/technique-name.constant';

import type { PageMetadataInterface } from '../../seo/interfaces/page-metadata.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const buildTechniquePageNames = (technique: SolutionTechniqueEnum): Pick<PageMetadataInterface, 'headline' | 'title'> => ({
    title: TECHNIQUE_NAMES[technique],
    headline: `${TECHNIQUE_NAMES[technique]} Sudoku Technique`
});
