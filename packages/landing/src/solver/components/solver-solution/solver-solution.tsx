import { isPositiveNumber } from '@rnw-community/shared';

import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { SolverStepList } from '../solver-step-list/solver-step-list';

import type { SolverSolutionInterface } from '../../interfaces/solver-solution.interface';

interface Props {
    solution: SolverSolutionInterface;
    selectedStepIndex: number | null;
    onSelectStep: (index: number) => void;
}

export const SolverSolution = ({ onSelectStep, selectedStepIndex, solution }: Props) => {
    const hasUnprovenCells = isPositiveNumber(solution.unprovenCellCount);
    const stoppedNotice = hasUnprovenCells ? (
        <p className="solver-notice" data-tone="warning">
            The narration stops here, with {solution.unprovenCellCount} cells still empty. Suuudokuuu’s technique engine reads candidates
            off the board on every step instead of carrying pencil marks forward, so once a puzzle needs a chain of eliminations to expose
            the next digit it has nothing honest left to say — and it will not guess on your behalf. The completed grid below still comes
            from the verified solver.
        </p>
    ) : null;

    return (
        <div className="solver-result">
            <p className="solver-notice" data-tone="success" role="status">
                Verified unique — the bitmask solver and the Dancing Links cross-check both found exactly one solution.
            </p>
            <h3>Step-by-step solution</h3>
            <p>
                {solution.steps.length} narrated steps. Each one names the technique that proves it and links to its guide; open a step to
                replay it on a live board.
            </p>
            {stoppedNotice}
            <SolverStepList
                difficulty={solution.difficulty}
                onSelectStep={onSelectStep}
                selectedStepIndex={selectedStepIndex}
                steps={solution.steps}
            />
            <h3>The completed grid</h3>
            <PuzzleBoard givens={solution.solutionBoard}>The verified solution to the puzzle you entered.</PuzzleBoard>
        </div>
    );
};
