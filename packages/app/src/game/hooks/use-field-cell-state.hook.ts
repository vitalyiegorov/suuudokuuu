import { buildStepScriptState, getCellKey } from '@suuudokuuu/field-core';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { GameContext } from '../context/game.context';
import { gameMergeCandidateValues } from '../utils/game-merge-candidate-values.util';

import type { CellInterface } from '@suuudokuuu/generator';

export const useFieldCellState = (cell: CellInterface) => {
    const { engine, snapshot } = use(GameContext);

    const sudoku = engine.Sudoku;
    const { selectedCell } = snapshot;
    const stepState = buildStepScriptState(snapshot.stepScript, snapshot.stepIndex, snapshot.hintLevel);
    const isHintActive = isDefined(snapshot.stepScript);
    const cellKey = getCellKey(cell);
    const isEmpty = sudoku.isBlankCell(cell);
    const hintValue = stepState.placedValues.get(cellKey);
    const eliminatedCandidates = stepState.eliminatedCandidates.get(cellKey) ?? [];
    const hintedCandidates = gameMergeCandidateValues(stepState.revealedCandidates.get(cellKey) ?? [], eliminatedCandidates);
    const candidates = gameMergeCandidateValues(engine.getCellCandidates(cell), hintedCandidates);

    return {
        activeValue: selectedCell?.value,
        candidates,
        eliminatedCandidates,
        hintValue,
        isActive: sudoku.isSameCell(cell, selectedCell),
        isActiveValue: sudoku.isSameCellValue(cell, selectedCell) && !isHintActive,
        isEmpty,
        isHighlighted: sudoku.isCellHighlighted(cell, selectedCell) && !isHintActive,
        isPatternCell: stepState.patternCellKeys.has(cellKey),
        isTargetCell: stepState.targetCellKey === cellKey,
        isWrong: sudoku.isCellWrong(cell, selectedCell),
        shouldShowCandidates: isEmpty && candidates.length > 0 && !isDefined(hintValue)
    };
};
