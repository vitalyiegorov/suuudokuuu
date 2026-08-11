import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from './candidate-context';

import type { CandidateMapType } from '../../types/candidate-map.type';
import type { CellInterface } from '@suuudokuuu/generator';

const getCellKey = (cell: CellInterface): string => `${cell.y}:${cell.x}`;

describe('CandidateContext', () => {
    it('should return candidates from candidate map', () => {
        expect.assertions(2);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const candidateMap: CandidateMapType = {
            [getCellKey(field[0][0])]: [1, 2],
            [getCellKey(field[0][1])]: [3]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(context.getCandidates(field[0][0])).toEqual([1, 2]);
        expect(context.getCandidates(field[1][1])).toEqual([]);
    });

    it('should preserve a snapshot when the supplied candidate map changes', () => {
        expect.assertions(1);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const candidates = [1, 2];
        const candidateMap: CandidateMapType = {
            [getCellKey(field[0][0])]: candidates
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        candidates.pop();

        expect(context.getCandidates(field[0][0])).toEqual([1, 2]);
    });

    it('should not allow returned candidates to mutate the snapshot', () => {
        expect.assertions(2);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const context = new CandidateContext(defaultSudokuConfig, field, { [getCellKey(field[0][0])]: [1, 2] });

        expect(() => Object.defineProperty(context.getCandidates(field[0][0]), '0', { value: 9 })).toThrow();
        expect(context.getCandidates(field[0][0])).toEqual([1, 2]);
    });

    it('should return a snapshot without the eliminated candidates', () => {
        expect.assertions(3);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const context = new CandidateContext(defaultSudokuConfig, field, {
            [getCellKey(field[0][0])]: [1, 2, 3],
            [getCellKey(field[0][1])]: [1, 2]
        });
        const reducedContext = context.withEliminations([
            { cell: field[0][0], value: 2 },
            { cell: field[0][0], value: 3 }
        ]);

        expect(reducedContext.getCandidates(field[0][0])).toEqual([1]);
        expect(reducedContext.getCandidates(field[0][1])).toEqual([1, 2]);
        expect(context.getCandidates(field[0][0])).toEqual([1, 2, 3]);
    });

    it('should place a value and prune the peer candidates', () => {
        expect.assertions(5);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const context = new CandidateContext(defaultSudokuConfig, field, {
            [getCellKey(field[0][0])]: [1, 2, 3],
            [getCellKey(field[0][1])]: [1, 2],
            [getCellKey(field[4][4])]: [1, 5]
        });
        const placedContext = context.withPlacement(field[0][0], 1);

        expect(placedContext.getCandidates(field[0][0])).toEqual([]);
        expect(placedContext.getCandidates(field[0][1])).toEqual([2]);
        expect(placedContext.getCandidates(field[4][4])).toEqual([1, 5]);
        expect(placedContext.getRowCells(0)[0].value).toBe(1);
        expect(context.getRowCells(0)[0].value).toBe(defaultSudokuConfig.blankCellValue);
    });

    it('should report contradictions and solved boards', () => {
        expect.assertions(4);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const context = CandidateContext.fromSudoku(sudoku);
        const [blankCell] = context.getBlankCells();
        const emptiedContext = context.withEliminations(context.getCandidates(blankCell).map(value => ({ cell: blankCell, value })));

        expect(context.hasContradiction()).toBe(false);
        expect(context.isSolved()).toBe(false);
        expect(emptiedContext.hasContradiction()).toBe(true);
        expect(new CandidateContext(defaultSudokuConfig, sudoku.FullField).isSolved()).toBe(true);
    });

    it('should return row column and group cells', () => {
        expect.assertions(3);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const context = new CandidateContext(defaultSudokuConfig, field);

        expect(context.getRowCells(1).map(getCellKey)).toEqual(['1:0', '1:1', '1:2', '1:3', '1:4', '1:5', '1:6', '1:7', '1:8']);
        expect(context.getColumnCells(2).map(getCellKey)).toEqual(['0:2', '1:2', '2:2', '3:2', '4:2', '5:2', '6:2', '7:2', '8:2']);
        expect(context.getGroupCells(field[4][4]).map(getCellKey)).toEqual(['3:3', '3:4', '3:5', '4:3', '4:4', '4:5', '5:3', '5:4', '5:5']);
    });

    it('should return unique peers without the source cell', () => {
        expect.assertions(3);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const context = new CandidateContext(defaultSudokuConfig, field);
        const peers = context.getPeers(field[0][0]);
        const peerKeys = peers.map(getCellKey);

        expect(peers).toHaveLength(20);
        expect(peerKeys).toContain('0:1');
        expect(peerKeys).not.toContain('0:0');
    });

    it('should return common peers for multiple cells', () => {
        expect.assertions(3);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const context = new CandidateContext(defaultSudokuConfig, field);
        const commonPeers = context.getCommonPeers([field[0][0], field[1][1]]);
        const commonPeerKeys = commonPeers.map(getCellKey);

        expect(commonPeerKeys).toContain('0:1');
        expect(commonPeerKeys).toContain('1:0');
        expect(commonPeerKeys).not.toContain('0:0');
    });

    it('should return empty collections for cells outside the cached board', () => {
        expect.assertions(3);

        const field = Sudoku.fromString(
            '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize),
            defaultSudokuConfig
        ).Field;
        const context = new CandidateContext(defaultSudokuConfig, field);
        const unknownCell = { ...field[0][0], x: 99, y: 99, group: 99 };

        expect(context.getGroupCells(unknownCell)).toEqual([]);
        expect(context.getPeers(unknownCell)).toEqual([]);
        expect(context.getCommonPeers([])).toEqual([]);
    });
});
