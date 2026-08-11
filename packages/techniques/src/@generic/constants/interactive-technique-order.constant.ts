import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import { createTechniqueStrategies } from '../utils/create-technique-strategies.util';

const interactiveLadderEnd = SolutionTechniqueEnum.AIC;

const registryTechniqueOrder = createTechniqueStrategies().map(strategy => strategy.technique);

export const interactiveTechniqueOrder: readonly SolutionTechniqueEnum[] = registryTechniqueOrder.slice(
    0,
    registryTechniqueOrder.indexOf(interactiveLadderEnd)
);
