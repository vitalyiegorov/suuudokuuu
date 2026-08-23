import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameToggleAutoCandidatesAction, gameToggleCellCandidateAction, gameToggleInputModeAction } from '../../store/game.actions';
import { gameMaxMistakesSelector } from '../../store/game.selectors';

import { useHistoryShortcut } from './use-history-shortcut.hook';

import type { OnEventFn } from '@rnw-community/shared';
import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const DIGIT_CODE_PATTERN = /^(?:Digit|Numpad)([1-9])$/u;

const isEditableTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

export const useKeyboardControls = (
    engine: FieldEngine,
    selectedCell: CellInterface | undefined,
    onSelectCell: OnEventFn<CellInterface | undefined>,
    onSelectValue: OnEventFn<number>,
    onExit: OnEventFn<void>
    // eslint-disable-next-line @typescript-eslint/max-params
) => {
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const canToggleAutoCandidates = maxMistakes > 0;

    useHistoryShortcut(engine);

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
            const sudoku = engine.Sudoku;

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
                    engine.toggleInputMode();
                    dispatch(gameToggleInputModeAction());
                }

                return;
            }

            if (code === 'KeyA') {
                e.preventDefault();

                if (canToggleAutoCandidates) {
                    engine.toggleShowAutoCandidates();
                    dispatch(gameToggleAutoCandidatesAction());
                }

                return;
            }

            if (key === 'Escape') {
                e.preventDefault();
                onExit();

                return;
            }

            const digitMatch = DIGIT_CODE_PATTERN.exec(code);

            if (isDefined(selectedCell) && isDefined(digitMatch)) {
                e.preventDefault();
                const value = Number(digitMatch[1]);

                if (shiftKey) {
                    if (sudoku.isBlankCell(selectedCell)) {
                        engine.toggleCandidate(selectedCell, value);
                        dispatch(gameToggleCellCandidateAction({ ...selectedCell, value }));
                    }
                } else {
                    onSelectValue(value);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => void window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, selectedCell, onSelectCell, onSelectValue, engine, onExit, dispatch, canToggleAutoCandidates]);
};
