import type { TechniqueResultInterface } from './technique-result.interface';
import type { LogicalSolveOutcomeType } from '../types/logical-solve-outcome.type';

export interface LogicalSolveResultInterface {
    outcome: LogicalSolveOutcomeType;
    steps: TechniqueResultInterface[];
    wasSearchCapped: boolean;
}
