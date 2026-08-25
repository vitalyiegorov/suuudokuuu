import type { SolverSolutionInterface } from '../interfaces/solver-solution.interface';
import type { SolverUniquenessFailureInterface } from '../interfaces/solver-uniqueness-failure.interface';

export type SolverOutcomeType = SolverSolutionInterface | SolverUniquenessFailureInterface;
