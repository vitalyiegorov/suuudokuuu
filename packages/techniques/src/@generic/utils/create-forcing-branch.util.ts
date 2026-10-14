import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { ForcingBranchInterface } from '../interfaces/forcing-branch.interface';
import type { HypothesisBoardInterface } from '../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../interfaces/hypothesis-propagation.interface';
import type { ForcingOutcomeType } from '../types/forcing-outcome.type';

export const createForcingBranch = (
    board: HypothesisBoardInterface,
    propagation: HypothesisPropagationInterface,
    outcome: ForcingOutcomeType,
    getPathCellIndexes: () => number[]
): ForcingBranchInterface => {
    const getCandidate = (cellIndex: number): CandidateEliminationInterface => ({
        cell: board.cells[cellIndex],
        value: propagation.placedValues[cellIndex]
    });
    let implications: CandidateEliminationInterface[] | undefined;

    return {
        assumption: getCandidate(propagation.placedCellIndexes[0]),
        get implications(): CandidateEliminationInterface[] {
            implications ??= getPathCellIndexes().slice(1).map(getCandidate);

            return implications;
        },
        outcome
    };
};
