import { useAtom } from '@effect/atom-react/Hooks';
import { parsePuzzleText } from '@suuudokuuu/encoder';
import { splitRecognizedPuzzle } from '@suuudokuuu/puzzle-forge';
import * as Atom from 'effect/reactivity/Atom';
import { useReducer, useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import { GameEmptySudokuStringConstant } from '../../../../game/constant/empty-sudoku-string.constant';

import type { GridRecognitionType } from '@suuudokuuu/grid-vision';
import type { SetStateAction } from 'react';

interface ImportReviewState {
    readonly entranceKey: number;
    readonly isPasteMissed: boolean;
    readonly selectedCellIndex: number | null;
    readonly entryString: string;
    readonly uncertainCellIndexes: readonly number[];
    readonly scannedCellIndexes: readonly number[];
    readonly isRecognizing: boolean;
    readonly isGridMissed: boolean;
    readonly isTyping: boolean;
}

const initialState: ImportReviewState = {
    entranceKey: 0,
    isPasteMissed: false,
    selectedCellIndex: null,
    entryString: GameEmptySudokuStringConstant,
    uncertainCellIndexes: [],
    scannedCellIndexes: [],
    isRecognizing: false,
    isGridMissed: false,
    isTyping: false
};
const ImportUncertainConfidence = 0.9;

export const useImportReview = (initialText: string) => {
    const [puzzleAtom] = useState(() => Atom.make(parsePuzzleText(initialText) ?? GameEmptySudokuStringConstant));
    const [puzzleString, setPuzzleString] = useAtom(puzzleAtom);
    const [state, update] = useReducer(
        (current: ImportReviewState, patch: Partial<ImportReviewState>) => ({ ...current, ...patch }),
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
            update({ ...initialState, entranceKey: state.entranceKey + 1 });
        } else {
            update({ isPasteMissed: true });
        }
    };
    const loadGrid = (result: Extract<GridRecognitionType, { readonly puzzleString: string }>) => {
        const split = splitRecognizedPuzzle(result, ImportUncertainConfidence);
        if (!isDefined(split)) {
            update({ isRecognizing: false, isGridMissed: true });

            return;
        }
        setPuzzleString(split.clueString);
        update({
            ...initialState,
            entranceKey: state.entranceKey + 1,
            entryString: split.entryString,
            isTyping: true,
            uncertainCellIndexes: split.uncertainCellIndexes,
            scannedCellIndexes: Array.from(result.puzzleString).flatMap((digit, index) => (/[1-9]/u.test(digit) ? [index] : []))
        });
    };
    const input = (value: number) => {
        const index = state.selectedCellIndex;
        if (!isDefined(index)) {
            return;
        }
        setPuzzleString(`${puzzleString.slice(0, index)}${value === 0 ? '.' : String(value)}${puzzleString.slice(index + 1)}`);
        update({
            isPasteMissed: false,
            entryString: `${state.entryString.slice(0, index)}.${state.entryString.slice(index + 1)}`,
            uncertainCellIndexes: state.uncertainCellIndexes.filter(cellIndex => cellIndex !== index),
            selectedCellIndex: value === 0 ? index : Math.min(index + 1, GameEmptySudokuStringConstant.length - 1)
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

    const isEntry = isDefined(state.selectedCellIndex) && /[1-9]/u.test(state.entryString[state.selectedCellIndex]);
    const canToggle =
        isDefined(state.selectedCellIndex) &&
        state.scannedCellIndexes.includes(state.selectedCellIndex) &&
        /[1-9]/u.test(puzzleString[state.selectedCellIndex] + state.entryString[state.selectedCellIndex]);

    return {
        state,
        puzzleAtom,
        puzzleString,
        reset,
        loadText,
        loadGrid,
        input,
        toggleEntry,
        moveSelection,
        update,
        canToggle,
        isEntry
    };
};
