import { useEffect } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameToggleInputModeAction } from '../../store/game.actions';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

/* eslint-disable lingui/no-unlocalized-strings */
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const WASD_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
const TOGGLE_KEYS = ['Tab', 'Space'];
/* eslint-enable lingui/no-unlocalized-strings */

export const useKeyboardControls = (
    sudoku: Sudoku,
    selectedCell: CellInterface | undefined,
    onSelectCell: OnEventFn<CellInterface | undefined>,
    onSelectValue: OnEventFn<number>,
    onExit: OnEventFn<void>
    // eslint-disable-next-line @typescript-eslint/max-params
) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // eslint-disable-next-line max-statements
        const handleKeyDown = (e: KeyboardEvent) => {
            const { key, code } = e;

            // Navigation with arrow keys and WASD
            if (ARROW_KEYS.includes(key) || WASD_KEYS.includes(code)) {
                e.preventDefault();
                const currentCell = selectedCell ?? sudoku.Field[0][0];
                const lastRowIndex = sudoku.Field.length - 1;
                const lastColIndex = sudoku.Field[currentCell.y].length - 1;

                let nextCell: CellInterface | undefined;
                if (key === 'ArrowUp' || code === 'KeyW') {
                    nextCell = sudoku.getCellUp(currentCell);
                    // Jump to bottom if at top
                    nextCell ??= sudoku.Field[lastRowIndex][currentCell.x];
                } else if (key === 'ArrowDown' || code === 'KeyS') {
                    nextCell = sudoku.getCellDown(currentCell);
                    // Jump to top if at bottom
                    nextCell ??= sudoku.Field[0][currentCell.x];
                } else if (key === 'ArrowLeft' || code === 'KeyA') {
                    nextCell = sudoku.getCellLeft(currentCell);
                    // Jump to right if at left edge
                    nextCell ??= sudoku.Field[currentCell.y][lastColIndex];
                } else if (key === 'ArrowRight' || code === 'KeyD') {
                    nextCell = sudoku.getCellRight(currentCell);
                    // Jump to left if at right edge
                    nextCell ??= sudoku.Field[currentCell.y][0];
                }

                onSelectCell(nextCell);

                return;
            }

            // Toggle input mode with Space or Tab
            if (TOGGLE_KEYS.includes(code)) {
                e.preventDefault();
                dispatch(gameToggleInputModeAction());
            }

            if (key === 'Escape') {
                e.preventDefault();
                onExit();
            }

            if (isDefined(selectedCell) && /^[1-9]$/iu.test(key)) {
                e.preventDefault();
                onSelectValue(Number(key));
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => void window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, onSelectCell, onSelectValue, sudoku, onExit, dispatch]);
};
