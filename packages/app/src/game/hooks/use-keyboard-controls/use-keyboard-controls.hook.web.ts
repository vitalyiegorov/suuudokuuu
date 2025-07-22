import { useEffect } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameToggleCandidatesAction } from '../../store/game.actions';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export const useKeyboardControls = (
    sudoku: Sudoku,
    selectedCell: CellInterface | undefined,
    onSelectCell: OnEventFn<CellInterface | undefined>,
    onSelectValue: OnEventFn<number>
) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // eslint-disable-next-line max-statements
        const handleKeyDown = (e: KeyboardEvent) => {
            const { key, code } = e;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                e.preventDefault();
                const currentCell = selectedCell ?? sudoku.Field[0][0];

                let nextCell: CellInterface | undefined;
                switch (key) {
                    case 'ArrowUp':
                        nextCell = sudoku.getCellUp(currentCell);
                        break;
                    case 'ArrowDown':
                        nextCell = sudoku.getCellDown(currentCell);
                        break;
                    case 'ArrowLeft':
                        nextCell = sudoku.getCellLeft(currentCell);
                        break;
                    case 'ArrowRight':
                        nextCell = sudoku.getCellRight(currentCell);
                        break;
                    default:
                        break;
                }

                onSelectCell(nextCell);

                return;
            }

            if (['Space'].includes(code)) {
                dispatch(gameToggleCandidatesAction());
            }

            if (isDefined(selectedCell) && /^[1-9]$/iu.test(key)) {
                e.preventDefault();
                onSelectValue(Number(key));
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => void window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, onSelectCell, onSelectValue, sudoku]);
};
