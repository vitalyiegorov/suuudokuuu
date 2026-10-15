import type { SolverInvalidGridInterface } from '../interfaces/solver-invalid-grid.interface';
import type { SolverSolutionInterface } from '../interfaces/solver-solution.interface';
import type { SolverUniquenessFailureInterface } from '../interfaces/solver-uniqueness-failure.interface';

export type SolverOutcomeType = SolverSolutionInterface | SolverInvalidGridInterface | SolverUniquenessFailureInterface;
