import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { gameGetCellHitSlop } from './game-get-cell-hit-slop.util';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const sudoku = Sudoku.fromString(givens, defaultSudokuConfig);
const SpaciousCellMargin = 5;
const TightCellMargin = 0;
const NoSlop = { bottom: 0, left: 0, right: 0, top: 0 };
const HalfSpaciousCellMargin = 2;

const getSlop = (positionX: number, positionY: number, cellMargin: number) =>
    gameGetCellHitSlop(sudoku, sudoku.Field[positionY][positionX], cellMargin);

describe('gameGetCellHitSlop', () => {
    it('should give no slop to a cell that touches its neighbours on every side', () => {
        expect.assertions(1);

        expect(getSlop(1, 1, SpaciousCellMargin)).toStrictEqual(NoSlop);
    });

    it('should reach into the group gap that follows the last cell of a group', () => {
        expect.assertions(1);

        expect(getSlop(2, 2, SpaciousCellMargin)).toStrictEqual({
            bottom: HalfSpaciousCellMargin,
            left: 0,
            right: HalfSpaciousCellMargin,
            top: 0
        });
    });

    it('should reach into the group gap that precedes the first cell of a group', () => {
        expect.assertions(1);

        expect(getSlop(3, 3, SpaciousCellMargin)).toStrictEqual({
            bottom: 0,
            left: HalfSpaciousCellMargin,
            right: 0,
            top: HalfSpaciousCellMargin
        });
    });

    it('should never claim more than half of the gap so two neighbours cannot overlap', () => {
        expect.assertions(1);

        const gapBefore = getSlop(3, 0, SpaciousCellMargin).left ?? 0;
        const gapAfter = getSlop(2, 0, SpaciousCellMargin).right ?? 0;

        expect(gapBefore + gapAfter).toBeLessThanOrEqual(SpaciousCellMargin);
    });

    it('should give no slop at all when the board has no group gaps', () => {
        expect.assertions(1);

        expect(getSlop(2, 2, TightCellMargin)).toStrictEqual(NoSlop);
    });

    it('should not reach outside the board on the closing edge', () => {
        expect.assertions(1);

        const lastCellIndex = defaultSudokuConfig.fieldSize - 1;

        expect(getSlop(lastCellIndex, lastCellIndex, SpaciousCellMargin)).toStrictEqual(NoSlop);
    });
});
