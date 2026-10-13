import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { seTechniqueRatings } from './se-technique-rating.constant';

export const seTechniqueOrder: readonly SolutionTechniqueEnum[] = Object.values(SolutionTechniqueEnum)
    .filter((technique): technique is SolutionTechniqueEnum => typeof technique === 'number' && technique !== SolutionTechniqueEnum.Guess)
    .sort((left, right) => seTechniqueRatings[left] - seTechniqueRatings[right] || left - right);
