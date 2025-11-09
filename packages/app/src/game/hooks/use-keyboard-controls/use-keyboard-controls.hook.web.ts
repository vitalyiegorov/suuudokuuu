import { useEffect } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameToggleInputModeAction } from '../../store/game.actions';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const WASD_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

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
        // eslint-disable-next-line max-statements, complexity
        const handleKeyDown = (e: KeyboardEvent) => {
            const { key, code } = e;

            if (ARROW_KEYS.includes(key) || WASD_KEYS.includes(code)) {
                e.preventDefault();
                const currentCell = selectedCell ?? sudoku.Field[0][0];
                const lastRowIndex = sudoku.Field.length - 1;
                const lastColIndex = sudoku.Field[currentCell.y].length - 1;

                let nextCell: CellInterface | undefined;
                if (key === 'ArrowUp' || code === 'KeyW') {
                    nextCell = sudoku.getCellUp(currentCell) ?? sudoku.Field[lastRowIndex][currentCell.x];
                } else if (key === 'ArrowDown' || code === 'KeyS') {
                    nextCell = sudoku.getCellDown(currentCell) ?? sudoku.Field[0][currentCell.x];
                } else if (key === 'ArrowLeft' || code === 'KeyA') {
                    nextCell = sudoku.getCellLeft(currentCell) ?? sudoku.Field[currentCell.y][lastColIndex];
                } else if (key === 'ArrowRight' || code === 'KeyD') {
                    nextCell = sudoku.getCellRight(currentCell) ?? sudoku.Field[currentCell.y][0];
                }

                onSelectCell(nextCell);

                return;
            }

            if (code === 'Space' && isDefined(selectedCell)) {
                e.preventDefault();
                dispatch(gameToggleInputModeAction());

                return;
            }

            if (key === 'Escape') {
                e.preventDefault();
                onExit();

                return;
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
