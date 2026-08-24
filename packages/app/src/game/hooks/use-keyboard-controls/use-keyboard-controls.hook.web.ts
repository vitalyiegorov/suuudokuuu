import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameToggleAutoCandidatesAction, gameToggleCellCandidateAction, gameToggleInputModeAction } from '../../store/game.actions';
import { gameMaxMistakesSelector } from '../../store/game.selectors';
import { gameGetArrowTargetCell } from '../../utils/game-get-arrow-target-cell.util';
import { gameGetCellCandidatePayload } from '../../utils/game-get-cell-candidate-payload.util';
import { gameGetInputStatePayload } from '../../utils/game-get-input-state-payload.util';

import { useHistoryShortcut } from './use-history-shortcut.hook';

import type { OnEventFn } from '@rnw-community/shared';
import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const DIGIT_CODE_PATTERN = /^(?:Digit|Numpad)([1-9])$/u;

const isEditableTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

const isBoardCellTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement && isDefined(target.closest('[role="grid"]'));

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
                onSelectCell(gameGetArrowTargetCell(sudoku, selectedCell ?? sudoku.Field[0][0], key));

                return;
            }

            if (key === ' ' || code === 'KeyN') {
                e.preventDefault();

                if (isDefined(selectedCell)) {
                    engine.toggleInputMode();
                    dispatch(gameToggleInputModeAction(gameGetInputStatePayload(engine)));
                }

                return;
            }

            if (code === 'KeyA') {
                e.preventDefault();

                if (canToggleAutoCandidates) {
                    engine.toggleShowAutoCandidates();
                    dispatch(gameToggleAutoCandidatesAction(gameGetInputStatePayload(engine)));
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
                        dispatch(gameToggleCellCandidateAction(gameGetCellCandidatePayload(engine, { ...selectedCell, value })));
                    }
                } else {
                    onSelectValue(value);
                }
            }
        };

        const handleBoardCellSpace = (e: KeyboardEvent) => {
            if (e.key === ' ' && !isEditableTarget(e.target) && isBoardCellTarget(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                handleKeyDown(e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleBoardCellSpace, true);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keydown', handleBoardCellSpace, true);
        };
    }, [isFocused, selectedCell, onSelectCell, onSelectValue, engine, onExit, dispatch, canToggleAutoCandidates]);
};
