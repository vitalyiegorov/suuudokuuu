import type { SolverStepInterface } from './solver-step.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface SolverSolutionInterface {
    kind: 'solved';
    solutionBoard: string;
    difficulty: DifficultyEnum;
    steps: SolverStepInterface[];
    unprovenCellCount: number;
}
