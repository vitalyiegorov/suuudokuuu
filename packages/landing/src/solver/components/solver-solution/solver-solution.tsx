import Link from 'next/link';

import { isPositiveNumber } from '@rnw-community/shared';

import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { SolverStepList } from '../solver-step-list/solver-step-list';

import type { SolverSolutionInterface } from '../../interfaces/solver-solution.interface';

const FIRST_STEP_INDEX = 0;

interface Props {
    solution: SolverSolutionInterface;
    selectedStepIndex: number | null;
    onSelectStep: (index: number | null) => void;
}

export const SolverSolution = ({ onSelectStep, selectedStepIndex, solution }: Props) => {
    const ratingLabel = solution.isRatingCeiling ? `${solution.rating}+` : String(solution.rating);
    const hardestTechniqueView = solution.isRatingCeiling ? (
        <>harder than every technique the engine implements</>
    ) : (
        <Link href={solution.hardestTechniquePath}>{solution.hardestTechniqueName}</Link>
    );
    const revealedNotice = isPositiveNumber(solution.revealedCellCount) ? (
        <p className="solver-notice" data-tone="warning">
            {solution.revealedCellCount} of the steps below fill a cell from the verified solution instead of proving it. At those points no
            technique Suuudokuuu implements makes progress, and rather than pretend otherwise the walkthrough says so, fills the cell with
            the fewest candidates, and carries on with logic from there.
        </p>
    ) : null;

    const handleStart = () => {
        onSelectStep(FIRST_STEP_INDEX);
    };

    return (
        <div className="solver-result">
            <p className="solver-notice" data-tone="success" role="status">
                Verified unique — the bitmask solver and the Dancing Links cross-check both found exactly one solution.
            </p>
            <dl className="solver-output">
                <dt className="solver-output__term">SE rating</dt>
                <dd className="solver-output__description">{ratingLabel}</dd>
                <dt className="solver-output__term">Hardest technique</dt>
                <dd className="solver-output__description">{hardestTechniqueView}</dd>
                <dt className="solver-output__term">Steps</dt>
                <dd className="solver-output__description">{solution.steps.length}</dd>
            </dl>
            <h3>Step-by-step solution</h3>
            <p>
                Each step names the technique that proves it and links to its guide. Open a step to replay it on a live board, then press Go
                to the next step to walk the whole solve to the finished grid.
            </p>
            {revealedNotice}
            <button className="solver-entry__action" onClick={handleStart} type="button">
                Step through from the start
            </button>
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
