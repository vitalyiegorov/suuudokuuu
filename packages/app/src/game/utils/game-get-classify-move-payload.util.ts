import { classifyTimelineMove } from '../../challenge/utils/classify-timeline-move.util';

import { gameGetPreMoveSudoku } from './game-get-pre-move-sudoku.util';

import type { CellInterface } from '@suuudokuuu/generator';

export const gameGetClassifyMovePayload = (postMoveSudokuString: string, cell: CellInterface) => ({
    cell,
    technique: classifyTimelineMove(gameGetPreMoveSudoku(postMoveSudokuString, cell), cell)
});
