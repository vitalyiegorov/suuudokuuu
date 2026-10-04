import type { LogicalSolveOutcomeType } from '../types/logical-solve-outcome.type';
import type { TechniqueResultInterface } from './technique-result.interface';

export interface LogicalSolveResultInterface {
    outcome: LogicalSolveOutcomeType;
    steps: TechniqueResultInterface[];
    wasSearchCapped: boolean;
}
