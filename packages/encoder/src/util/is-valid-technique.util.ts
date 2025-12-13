import { SolutionTechniqueEnum } from '@suuudokuuu/generator';

export const isValidTechnique = (technique: number): technique is SolutionTechniqueEnum =>
    Object.values(SolutionTechniqueEnum).includes(technique);
