import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export const useKeyboardControls = (
    _sudoku: Sudoku,
    _selectedCell: CellInterface | undefined,
    _onSelectCell: OnEventFn<CellInterface | undefined>,
    _onSelectValue: OnEventFn<number>,
    _onExit: OnEventFn<void>
    // eslint-disable-next-line @typescript-eslint/max-params
) => null;
