import { describe, expect, it } from '@jest/globals';

import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { createEmptyField } from '../../../util/create-empty-field.util';

import { CandidateContext } from './candidate-context';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { CandidateMapType } from '../../../types/candidate-map.type';

const getCellKey = (cell: CellInterface): string => `${cell.y}:${cell.x}`;

describe('CandidateContext', () => {
    it('should return candidates from candidate map', () => {
        expect.assertions(2);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [getCellKey(field[0][0])]: [1, 2],
            [getCellKey(field[0][1])]: [3]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(context.getCandidates(field[0][0])).toEqual([1, 2]);
        expect(context.getCandidates(field[1][1])).toEqual([]);
    });

    it('should return row column and group cells', () => {
        expect.assertions(3);

        const field = createEmptyField(defaultSudokuConfig);
        const context = new CandidateContext(defaultSudokuConfig, field);

        expect(context.getRowCells(1).map(getCellKey)).toEqual(['1:0', '1:1', '1:2', '1:3', '1:4', '1:5', '1:6', '1:7', '1:8']);
        expect(context.getColumnCells(2).map(getCellKey)).toEqual(['0:2', '1:2', '2:2', '3:2', '4:2', '5:2', '6:2', '7:2', '8:2']);
        expect(context.getGroupCells(field[4][4]).map(getCellKey)).toEqual(['3:3', '3:4', '3:5', '4:3', '4:4', '4:5', '5:3', '5:4', '5:5']);
    });

    it('should return unique peers without the source cell', () => {
        expect.assertions(3);

        const field = createEmptyField(defaultSudokuConfig);
        const context = new CandidateContext(defaultSudokuConfig, field);
        const peers = context.getPeers(field[0][0]);
        const peerKeys = peers.map(getCellKey);

        expect(peers).toHaveLength(20);
        expect(peerKeys).toContain('0:1');
        expect(peerKeys).not.toContain('0:0');
    });

    it('should return common peers for multiple cells', () => {
        expect.assertions(3);

        const field = createEmptyField(defaultSudokuConfig);
        const context = new CandidateContext(defaultSudokuConfig, field);
        const commonPeers = context.getCommonPeers([field[0][0], field[1][1]]);
        const commonPeerKeys = commonPeers.map(getCellKey);

        expect(commonPeerKeys).toContain('0:1');
        expect(commonPeerKeys).toContain('1:0');
        expect(commonPeerKeys).not.toContain('0:0');
    });

    it('should apply eliminations without mutating original context', () => {
        expect.assertions(2);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [getCellKey(field[0][0])]: [1, 2],
            [getCellKey(field[0][1])]: [2, 3]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);
        const nextContext = context.applyEliminations([{ cell: field[0][0], value: 2 }]);

        expect(context.getCandidates(field[0][0])).toEqual([1, 2]);
        expect(nextContext.getCandidates(field[0][0])).toEqual([1]);
    });

    it('should find placement unlocked by eliminations', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [getCellKey(field[0][0])]: [1, 2],
            [getCellKey(field[0][1])]: [2, 3]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);
        const placement = context.getPlacementFromEliminations([{ cell: field[0][0], value: 2 }]);

        expect(placement).toEqual({ cell: field[0][0], value: 1 });
    });
});
