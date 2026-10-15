import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import type { StepScriptCandidateInterface } from '../../step-script/interfaces/step-script-candidate.interface';
import type { FieldCandidateStateInterface } from '../interfaces/field-candidate-state.interface';
import type { FieldCandidatesType } from '../types/field-candidates.type';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export const cloneCandidateState = (state: FieldCandidateStateInterface): FieldCandidateStateInterface => ({
    candidates: { ...state.candidates },
    eliminatedCandidates: { ...state.eliminatedCandidates }
});

export const getToggledCandidates = (candidates: FieldCandidatesType, cell: CellInterface, value: number): FieldCandidatesType => {
    const cellKey = getCellKey(cell);
    const cellCandidates = candidates[cellKey] ?? [];
    const nextCellCandidates = cellCandidates.includes(value)
        ? cellCandidates.filter(candidate => candidate !== value)
        : [...cellCandidates, value];

    return { ...candidates, [cellKey]: nextCellCandidates };
};

const getCandidatesWithoutValue = (candidates: FieldCandidatesType, cell: CellInterface, value: number): FieldCandidatesType | null => {
    const cellKey = getCellKey(cell);
    const cellCandidates = candidates[cellKey] ?? [];

    if (!cellCandidates.includes(value)) {
        return null;
    }

    return { ...candidates, [cellKey]: cellCandidates.filter(candidate => candidate !== value) };
};

const getCandidatesWithElimination = (
    eliminatedCandidates: FieldCandidatesType,
    cell: CellInterface,
    value: number
): FieldCandidatesType | null => {
    const cellKey = getCellKey(cell);
    const cellEliminations = eliminatedCandidates[cellKey] ?? [];

    if (cellEliminations.includes(value)) {
        return null;
    }

    return { ...eliminatedCandidates, [cellKey]: [...cellEliminations, value] };
};

export const getCandidateStateWithoutValue = (
    state: FieldCandidateStateInterface,
    cell: CellInterface,
    value: number,
    showAutoCandidates: boolean
): FieldCandidateStateInterface | null => {
    if (showAutoCandidates) {
        const eliminatedCandidates = getCandidatesWithElimination(state.eliminatedCandidates, cell, value);

        return eliminatedCandidates === null ? null : { ...state, eliminatedCandidates };
    }

    const candidates = getCandidatesWithoutValue(state.candidates, cell, value);

    return candidates === null ? null : { ...state, candidates };
};

export const getCandidateStateWithEliminations = (
    state: FieldCandidateStateInterface,
    eliminations: readonly StepScriptCandidateInterface[],
    showAutoCandidates: boolean
): FieldCandidateStateInterface =>
    eliminations.reduce((currentState, { cell, value }) => {
        const candidateState = getCandidateStateWithoutValue(currentState, cell, value, showAutoCandidates) ?? currentState;
        const eliminatedCandidates = getCandidatesWithElimination(candidateState.eliminatedCandidates, cell, value);

        return eliminatedCandidates === null ? candidateState : { ...candidateState, eliminatedCandidates };
    }, state);

export const getAutoCellCandidates = (sudoku: Sudoku, eliminatedCandidates: FieldCandidatesType, cell: CellInterface): number[] => {
    const cellEliminations = eliminatedCandidates[getCellKey(cell)] ?? [];

    return sudoku.getCellCandidates(cell).filter(candidate => !cellEliminations.includes(candidate));
};
