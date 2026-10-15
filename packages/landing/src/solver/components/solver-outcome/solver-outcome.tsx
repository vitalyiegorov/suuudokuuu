import { SolverInvalidGridNotice } from '../solver-invalid-grid-notice/solver-invalid-grid-notice';
import { SolverSolution } from '../solver-solution/solver-solution';
import { SolverUniquenessNotice } from '../solver-uniqueness-notice/solver-uniqueness-notice';

import type { SolverOutcomeType } from '../../types/solver-outcome.type';

interface Props {
    outcome: SolverOutcomeType;
    selectedStepIndex: number | null;
    onSelectStep: (index: number | null) => void;
}

export const SolverOutcome = ({ onSelectStep, outcome, selectedStepIndex }: Props) => {
    if (outcome.kind === 'solved') {
        return <SolverSolution onSelectStep={onSelectStep} selectedStepIndex={selectedStepIndex} solution={outcome} />;
    }

    if (outcome.kind === 'invalid-grid') {
        return <SolverInvalidGridNotice conflict={outcome.conflict} />;
    }

    return <SolverUniquenessNotice failure={outcome} />;
};
