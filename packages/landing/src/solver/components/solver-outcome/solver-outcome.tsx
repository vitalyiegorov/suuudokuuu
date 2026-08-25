import { SolverSolution } from '../solver-solution/solver-solution';
import { SolverUniquenessNotice } from '../solver-uniqueness-notice/solver-uniqueness-notice';

import type { SolverOutcomeType } from '../../types/solver-outcome.type';

interface Props {
    outcome: SolverOutcomeType;
    selectedStepIndex: number | null;
    onSelectStep: (index: number) => void;
}

export const SolverOutcome = ({ onSelectStep, outcome, selectedStepIndex }: Props) => {
    if (outcome.kind === 'solved') {
        return <SolverSolution onSelectStep={onSelectStep} selectedStepIndex={selectedStepIndex} solution={outcome} />;
    }

    return <SolverUniquenessNotice failure={outcome} />;
};
