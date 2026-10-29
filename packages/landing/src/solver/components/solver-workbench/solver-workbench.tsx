'use client';

import { track } from '@vercel/analytics';
import { useReducer } from 'react';

import { getErrorMessage, isDefined } from '@rnw-community/shared';

import { SolverEntryPanel } from '../solver-entry-panel/solver-entry-panel';
import { SolverOutcome } from '../solver-outcome/solver-outcome';

import type { SolverOutcomeType } from '../../types/solver-outcome.type';

interface SolverWorkbenchState {
    readonly outcome: SolverOutcomeType | null;
    readonly selectedStepIndex: number | null;
    readonly isSolving: boolean;
    readonly errorMessage: string | null;
}

enum SolverWorkbenchActionEnum {
    SOLVE_STARTED = 'SOLVE_STARTED',
    SOLVE_COMPLETED = 'SOLVE_COMPLETED',
    SOLVE_FAILED = 'SOLVE_FAILED',
    ENTRY_CHANGED = 'ENTRY_CHANGED',
    STEP_SELECTED = 'STEP_SELECTED'
}

type SolverWorkbenchAction =
    | { readonly type: SolverWorkbenchActionEnum.ENTRY_CHANGED }
    | { readonly type: SolverWorkbenchActionEnum.SOLVE_COMPLETED; readonly outcome: SolverOutcomeType }
    | { readonly type: SolverWorkbenchActionEnum.SOLVE_FAILED; readonly errorMessage: string }
    | { readonly type: SolverWorkbenchActionEnum.SOLVE_STARTED }
    | { readonly type: SolverWorkbenchActionEnum.STEP_SELECTED; readonly stepIndex: number | null };

const INITIAL_STATE: SolverWorkbenchState = { outcome: null, selectedStepIndex: null, isSolving: false, errorMessage: null };

const reduceSolverWorkbench = (state: SolverWorkbenchState, action: SolverWorkbenchAction): SolverWorkbenchState => {
    switch (action.type) {
        case SolverWorkbenchActionEnum.SOLVE_STARTED:
            return { ...state, isSolving: true, errorMessage: null };
        case SolverWorkbenchActionEnum.SOLVE_COMPLETED:
            return { ...state, outcome: action.outcome, selectedStepIndex: null, isSolving: false };
        case SolverWorkbenchActionEnum.SOLVE_FAILED:
            return { ...state, errorMessage: action.errorMessage, isSolving: false };
        case SolverWorkbenchActionEnum.ENTRY_CHANGED:
            return { ...state, outcome: null, selectedStepIndex: null, errorMessage: null };
        case SolverWorkbenchActionEnum.STEP_SELECTED:
            return { ...state, selectedStepIndex: action.stepIndex };
        default:
            return state;
    }
};

export const SolverWorkbench = () => {
    const [{ outcome, selectedStepIndex, isSolving, errorMessage }, dispatch] = useReducer(reduceSolverWorkbench, INITIAL_STATE);

    const handleOutcome = (nextOutcome: SolverOutcomeType) => {
        track('solver_used', { outcome: nextOutcome.kind });
        dispatch({ type: SolverWorkbenchActionEnum.SOLVE_COMPLETED, outcome: nextOutcome });
    };

    const handleLoadFailure = (error: unknown) => {
        dispatch({
            type: SolverWorkbenchActionEnum.SOLVE_FAILED,
            errorMessage: `The solver could not load: ${getErrorMessage(error)}. Check your connection and try again.`
        });
    };

    const handleSolveFailure = (error: unknown) => {
        dispatch({
            type: SolverWorkbenchActionEnum.SOLVE_FAILED,
            errorMessage: `The solver failed on this puzzle: ${getErrorMessage(error)}. That is a bug in Suuudokuuu, not in your puzzle.`
        });
    };

    const handleSolve = (entry: string) => {
        dispatch({ type: SolverWorkbenchActionEnum.SOLVE_STARTED });
        import('../../utils/solve-puzzle.util')
            .then(module => void handleOutcome(module.solvePuzzle(entry)), handleLoadFailure)
            .catch(handleSolveFailure);
    };

    const handleEntryChange = () => {
        dispatch({ type: SolverWorkbenchActionEnum.ENTRY_CHANGED });
    };

    const handleSelectStep = (stepIndex: number | null) => {
        dispatch({ type: SolverWorkbenchActionEnum.STEP_SELECTED, stepIndex });
    };

    const errorView = isDefined(errorMessage) ? (
        <p className="solver-notice" data-tone="error" role="status">
            {errorMessage}
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
