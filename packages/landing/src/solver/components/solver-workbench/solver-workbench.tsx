'use client';

import { track } from '@vercel/analytics';
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
        track('solver_used', { outcome: nextOutcome.kind });
        setOutcome(nextOutcome);
        setSelectedStepIndex(null);
        setIsSolving(false);
    };

    const handleLoadFailure = (error: unknown) => {
        setErrorMessage(`The solver could not load: ${getErrorMessage(error)}. Check your connection and try again.`);
        setIsSolving(false);
    };

    const handleSolveFailure = (error: unknown) => {
        setErrorMessage(`The solver failed on this puzzle: ${getErrorMessage(error)}. That is a bug in Suuudokuuu, not in your puzzle.`);
        setIsSolving(false);
    };

    const handleSolve = (entry: string) => {
        setIsSolving(true);
        setErrorMessage(null);
        import('../../utils/solve-puzzle.util')
            .then(module => void handleOutcome(module.solvePuzzle(entry)), handleLoadFailure)
            .catch(handleSolveFailure);
    };

    const handleEntryChange = () => {
        setOutcome(null);
        setSelectedStepIndex(null);
        setErrorMessage(null);
    };

    const errorView = isDefined(errorMessage) ? (
        <p className="solver-notice" data-tone="error" role="status">
            {errorMessage}
        </p>
    ) : null;
    const outcomeView = isDefined(outcome) ? (
        <SolverOutcome onSelectStep={setSelectedStepIndex} outcome={outcome} selectedStepIndex={selectedStepIndex} />
    ) : null;

    return (
        <div className="solver-workbench">
            <SolverEntryPanel isSolving={isSolving} onEntryChange={handleEntryChange} onSolve={handleSolve} />
            {errorView}
            {outcomeView}
        </div>
    );
};
