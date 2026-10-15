import { TECHNIQUE_PAGE_LADDER } from '../../techniques/constants/technique-page-ladder.constant';

import type { SolverStepInterface } from '../interfaces/solver-step.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const getSolvePathTechniques = (steps: readonly SolverStepInterface[]): SolutionTechniqueEnum[] => {
    const usedTechniques = new Set(steps.map(step => step.technique));

    return TECHNIQUE_PAGE_LADDER.filter(technique => usedTechniques.has(technique));
};
