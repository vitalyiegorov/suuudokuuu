import { isNumber } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

const solutionTechniques = Object.values(SolutionTechniqueEnum).filter(isNumber);

export const isSolutionTechnique = (value: number | null | undefined): value is SolutionTechniqueEnum =>
    isNumber(value) && solutionTechniques.some(technique => technique === value);
