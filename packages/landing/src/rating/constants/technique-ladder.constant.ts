import { createTechniqueStrategies } from '@suuudokuuu/techniques';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const TECHNIQUE_LADDER: SolutionTechniqueEnum[] = createTechniqueStrategies().map(strategy => strategy.technique);
