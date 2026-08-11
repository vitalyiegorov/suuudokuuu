'use client';

import { useState } from 'react';

import { getErrorMessage, isDefined } from '@rnw-community/shared';

import { SolverEntryPanel } from '../solver-entry-panel/solver-entry-panel';
import { SolverOutcome } from '../solver-outcome/solver-outcome';

import type { SolverOutcomeType } from '../../types/solver-outcome.type';

export const SolverWorkbench = () => {
    const [outcome, setOutcome] = useState<SolverOutcomeType | null>(null);
    const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
    const [isSolving, setIsSolving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleOutcome = (nextOutcome: SolverOutcomeType) => {
        setOutcome(nextOutcome);
        setSelectedStepIndex(null);
        setIsSolving(false);
    };

    const handleFailure = (error: unknown) => {
        setErrorMessage(getErrorMessage(error));
        setIsSolving(false);
    };

    const handleSolve = (entry: string) => {
        setIsSolving(true);
        setErrorMessage(null);
        import('../../utils/solve-puzzle.util').then(module => void handleOutcome(module.solvePuzzle(entry))).catch(handleFailure);
    };

    const handleEntryChange = () => {
        setOutcome(null);
        setSelectedStepIndex(null);
        setErrorMessage(null);
    };

    const handleSelectStep = (index: number) => {
        setSelectedStepIndex(current => (current === index ? null : index));
    };

    const errorView = isDefined(errorMessage) ? (
        <p className="solver-notice" data-tone="error" role="status">
            The solver could not start: {errorMessage}
        </p>
    ) : null;
    const outcomeView = isDefined(outcome) ? (
        <SolverOutcome onSelectStep={handleSelectStep} outcome={outcome} selectedStepIndex={selectedStepIndex} />
    ) : null;

    return (
        <div className="solver-workbench">
            <SolverEntryPanel isSolving={isSolving} onEntryChange={handleEntryChange} onSolve={handleSolve} />
            {errorView}
            {outcomeView}
        </div>
    );
};
