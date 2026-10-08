import type { ForcingBranchInterface } from '../interfaces/forcing-branch.interface';
import type { HypothesisBoardInterface } from '../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../interfaces/hypothesis-propagation.interface';
import type { ForcingOutcomeType } from '../types/forcing-outcome.type';

export const createForcingBranch = (
    board: HypothesisBoardInterface,
    propagation: HypothesisPropagationInterface,
    outcome: ForcingOutcomeType
): ForcingBranchInterface => {
    const [assumption, ...implications] = propagation.placedCellIndexes.map(cellIndex => ({
        cell: board.cells[cellIndex],
        value: propagation.placedValues[cellIndex]
    }));

    return { assumption, implications, outcome };
};
