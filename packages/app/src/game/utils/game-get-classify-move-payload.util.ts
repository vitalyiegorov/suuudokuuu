import { classifyTimelineMove } from '../../challenge/utils/classify-timeline-move.util';

import { gameGetPreMoveSudoku } from './game-get-pre-move-sudoku.util';

import type { CellInterface } from '@suuudokuuu/generator';
import type { GameClassifyMovePayloadInterface } from '@suuudokuuu/progress';

export const gameGetClassifyMovePayload = (postMoveSudokuString: string, cell: CellInterface): GameClassifyMovePayloadInterface => ({
    cell,
    technique: classifyTimelineMove(gameGetPreMoveSudoku(postMoveSudokuString, cell), cell)
});
