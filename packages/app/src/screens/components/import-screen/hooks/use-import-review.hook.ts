import { useAtom } from '@effect/atom-react/Hooks';
import { parsePuzzleText } from '@suuudokuuu/encoder';
import * as Atom from 'effect/reactivity/Atom';
import { useReducer, useState } from 'react';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { GameEmptySudokuStringConstant } from '../../../../game/constant/empty-sudoku-string.constant';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';
import type { repairRecognizedPuzzle } from '@suuudokuuu/puzzle-forge';
import type { SetStateAction } from 'react';

const initialState: ImportReviewStateInterface = {
    isPasteMissed: false,
    selectedCellIndex: null,
    entryString: GameEmptySudokuStringConstant,
    uncertainCellIndexes: [],
    scannedCellIndexes: [],
    isRecognizing: false,
    isGridMissed: false,
    isTyping: false
};

export const useImportReview = (initialText: string) => {
    const [puzzleAtom] = useState(() => Atom.make(parsePuzzleText(initialText) ?? GameEmptySudokuStringConstant));
    const [puzzleString, setPuzzleString] = useAtom(puzzleAtom);
    const [state, update] = useReducer(
        (current: ImportReviewStateInterface, patch: Partial<ImportReviewStateInterface>) => ({ ...current, ...patch }),
        initialState
    );
    const reset = () => {
        setPuzzleString(GameEmptySudokuStringConstant);
        update(initialState);
    };
    const loadText = (text: string) => {
        const parsed = parsePuzzleText(text);
        if (isDefined(parsed)) {
            setPuzzleString(parsed);
            update(initialState);
        } else {
            update({ isPasteMissed: true, isRecognizing: false });
        }
    };
    const loadGrid = ({ clueString, entryString, uncertainCellIndexes }: NonNullable<ReturnType<typeof repairRecognizedPuzzle>>) => {
        setPuzzleString(clueString);
        update({
            ...initialState,
            entryString,
            isTyping: true,
            selectedCellIndex: uncertainCellIndexes.at(0) ?? null,
            uncertainCellIndexes,
            scannedCellIndexes: Array.from(clueString).flatMap((digit, index) => (/[1-9]/u.test(digit + entryString[index]) ? [index] : []))
        });
    };
    const input = (value: number) => {
        const index = state.selectedCellIndex;
        if (!isDefined(index)) {
            return;
        }
        const uncertainCellIndexes = state.uncertainCellIndexes.filter(cellIndex => cellIndex !== index);
        const restCellIndex =
            isNotEmptyArray(state.scannedCellIndexes) || value === 0
                ? index
                : Math.min(index + 1, GameEmptySudokuStringConstant.length - 1);
        setPuzzleString(`${puzzleString.slice(0, index)}${value === 0 ? '.' : String(value)}${puzzleString.slice(index + 1)}`);
        update({
            isPasteMissed: false,
            entryString: `${state.entryString.slice(0, index)}.${state.entryString.slice(index + 1)}`,
            uncertainCellIndexes,
            selectedCellIndex: uncertainCellIndexes.find(cellIndex => cellIndex > index) ?? uncertainCellIndexes.at(0) ?? restCellIndex
        });
    };
    const toggleEntry = () => {
        const index = state.selectedCellIndex;
        if (!isDefined(index)) {
            return;
        }
        const isEntry = state.entryString[index] !== '.';
        setPuzzleString(puzzleString.slice(0, index) + (isEntry ? state.entryString[index] : '.') + puzzleString.slice(index + 1));
        update({
            entryString: state.entryString.slice(0, index) + (isEntry ? '.' : puzzleString[index]) + state.entryString.slice(index + 1)
        });
    };
    const moveSelection = (selection: SetStateAction<number | null>) =>
        void update({
            selectedCellIndex: typeof selection === 'function' ? selection(state.selectedCellIndex) : selection,
            isTyping: true
        });

    const selectCell = (cellIndex: number) => void update({ selectedCellIndex: cellIndex === state.selectedCellIndex ? null : cellIndex });

    return {
        state,
        selectCell,
        puzzleAtom,
        puzzleString,
        reset,
        loadText,
        loadGrid,
        input,
        toggleEntry,
        moveSelection,
        update
    };
};
