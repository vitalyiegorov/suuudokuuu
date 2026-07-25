import type { TechniqueResultInterface } from './technique-result.interface';
import type { TechniqueSearchTargetInterface } from './technique-search-target.interface';
import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface TechniqueStrategyInterface {
    readonly technique: SolutionTechniqueEnum;

    find(context: CandidateContext, target?: TechniqueSearchTargetInterface): TechniqueResultInterface[];
}
