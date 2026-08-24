import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameToggleAutoCandidatesAction, gameToggleCellCandidateAction, gameToggleInputModeAction } from '../../store/game.actions';
import { gameMaxMistakesSelector } from '../../store/game.selectors';

import type { KeyboardHandlersInterface } from './interface/keyboard-handlers.interface';
import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const DIGIT_CODE_PATTERN = /^(?:Digit|Numpad)([1-9])$/u;

interface UseKeyboardControlsParams {
    readonly handlers: KeyboardHandlersInterface;
    readonly onSelectCell: OnEventFn<CellInterface | undefined>;
    readonly onSelectValue: OnEventFn<number>;
    readonly selectedCell: CellInterface | undefined;
    readonly sudoku: Sudoku;
}

const isEditableTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

const applyUndoRedoKey = (key: string, handlers: KeyboardHandlersInterface): boolean => {
    const isUndoKey = key === 'z' || key === 'Z';

    if (!isUndoKey && key !== 'y' && key !== 'Y') {
        return false;
    }

    if (isUndoKey) {
        handlers.onUndo();
    } else {
        handlers.onRedo();
    }

    return true;
};

export const useKeyboardControls = ({ handlers, onSelectCell, onSelectValue, selectedCell, sudoku }: UseKeyboardControlsParams) => {
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const canToggleAssists = maxMistakes > 0;

    useEffect(() => {
        if (!isFocused) {
            return emptyFn;
        }

        // eslint-disable-next-line max-statements -- Web keyboard handler branches over every pro-player key binding
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isEditableTarget(e.target)) {
                return;
            }

            const { key, code, shiftKey } = e;

            if (ARROW_KEYS.includes(key)) {
                e.preventDefault();
                const currentCell = selectedCell ?? sudoku.Field[0][0];
                const lastRowIndex = sudoku.Field.length - 1;
                const lastColIndex = sudoku.Field[currentCell.y].length - 1;

                let nextCell: CellInterface | undefined;
                if (key === 'ArrowUp') {
                    nextCell = sudoku.getCellUp(currentCell) ?? sudoku.Field[lastRowIndex][currentCell.x];
                } else if (key === 'ArrowDown') {
                    nextCell = sudoku.getCellDown(currentCell) ?? sudoku.Field[0][currentCell.x];
                } else if (key === 'ArrowLeft') {
                    nextCell = sudoku.getCellLeft(currentCell) ?? sudoku.Field[currentCell.y][lastColIndex];
                } else if (key === 'ArrowRight') {
                    nextCell = sudoku.getCellRight(currentCell) ?? sudoku.Field[currentCell.y][0];
                }

                onSelectCell(nextCell);

                return;
            }

            if (key === ' ' || code === 'KeyN') {
                e.preventDefault();

                if (isDefined(selectedCell)) {
                    dispatch(gameToggleInputModeAction());
                }

                return;
            }

            if (code === 'KeyA') {
                e.preventDefault();

                if (canToggleAssists) {
                    dispatch(gameToggleAutoCandidatesAction());
                }

                return;
            }

            if (applyUndoRedoKey(key, handlers)) {
                e.preventDefault();

                return;
            }

            if (key === 'Escape') {
                e.preventDefault();
                handlers.onExit();

                return;
            }

            const digitMatch = DIGIT_CODE_PATTERN.exec(code);

            if (isDefined(selectedCell) && isDefined(digitMatch)) {
                e.preventDefault();
                const value = Number(digitMatch[1]);

                if (shiftKey) {
                    if (sudoku.isBlankCell(selectedCell)) {
                        dispatch(gameToggleCellCandidateAction({ ...selectedCell, value }));
                    }
                } else {
                    onSelectValue(value);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => void window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, selectedCell, onSelectCell, onSelectValue, sudoku, handlers, dispatch, canToggleAssists]);
};
