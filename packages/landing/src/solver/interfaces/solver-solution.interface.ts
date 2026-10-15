import type { SolvePathInterface } from './solve-path.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface SolverSolutionInterface extends SolvePathInterface {
    readonly kind: 'solved';
    readonly solutionBoard: string;
    readonly difficulty: DifficultyEnum;
    readonly rating: number;
    readonly isRatingCeiling: boolean;
    readonly hardestTechniqueName: string;
    readonly hardestTechniquePath: string;
}
