import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const isSolutionTechnique = (value: SolutionTechniqueEnum | string): value is SolutionTechniqueEnum => typeof value === 'number';
