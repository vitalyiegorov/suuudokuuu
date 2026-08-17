import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { hasMaskValue } from '../../utils/has-mask-value.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import { HypothesisPropagator } from './hypothesis-propagator';

const forcingChainBoard = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const forcingChainSolution = '263748951758961423194325876931257684682134795547689312429816537375492168816573249';
const forcingPlacementBoard = '023006541000001023014325078002003160000010230137692485391268754056039812208150396';
const forcingPlacementSolution = '923786541875941623614325978482573169569814237137692485391268754756439812248157396';

const contradictionCellIndex = 14;
const contradictionValue = 8;

const createPropagator = (board: string): HypothesisPropagator =>
    HypothesisPropagator.fromContext(CandidateContext.fromSudoku(Sudoku.fromString(board, defaultSudokuConfig)));

describe('HypothesisPropagator', () => {
    it('builds an indexed board with every unit and peer set', () => {
        expect.assertions(4);

        const board = createPropagator(forcingChainBoard).getBoard();

        expect(board.cells).toHaveLength(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);
        expect(board.unitCellIndexes).toHaveLength(defaultSudokuConfig.fieldSize * 3);
        expect(board.valueCount).toBe(defaultSudokuConfig.fieldSize);
        expect(board.peerIndexes.every(peerIndexes => peerIndexes.length === 20)).toBe(true);
    });

    it('places the hypothesis and prunes it from every peer', () => {
        expect.assertions(3);

        const propagator = createPropagator(forcingChainBoard);
        const board = propagator.getBoard();
        const cellIndex = board.cells.findIndex(cell => cell.y === 0 && cell.x === 0);
        const value = Number(forcingChainSolution[cellIndex]);
        const propagation = propagator.propagate(cellIndex, value);
        const affectedPeerIndexes = board.peerIndexes[cellIndex].filter(peerIndex => hasMaskValue(board.candidateMasks[peerIndex], value));

        expect(propagation.hasContradiction).toBe(false);
        expect(propagation.placedValues[cellIndex]).toBe(value);
        expect(affectedPeerIndexes.every(peerIndex => hasMaskValue(propagation.eliminatedMasks[peerIndex], value))).toBe(true);
    });

    it('reports a contradiction when a hypothesis empties a cell or a unit', () => {
        expect.assertions(2);

        const propagation = createPropagator(forcingChainBoard).propagate(contradictionCellIndex, contradictionValue);

        expect(propagation.hasContradiction).toBe(true);
        expect(propagation.placedCellIndexes.length).toBeGreaterThan(0);
    });

    it('derives further placements from naked and hidden singles', () => {
        expect.assertions(2);

        const propagator = createPropagator(forcingPlacementBoard);
        const board = propagator.getBoard();
        const cellIndex = board.cells.findIndex(cell => cell.y === 1 && cell.x === 0);
        const propagation = propagator.propagate(cellIndex, Number(forcingPlacementSolution[cellIndex]));

        expect(propagation.placedCellIndexes.length).toBeGreaterThan(1);
        expect(propagation.placedCellIndexes).toContain(cellIndex);
    });

    it('never derives a placement that contradicts the known solution', () => {
        expect.assertions(1);

        const propagator = createPropagator(forcingChainBoard);
        const board = propagator.getBoard();
        const wrongPlacements: number[] = [];

        board.cells.forEach((_, cellIndex) => {
            const solutionValue = Number(forcingChainSolution[cellIndex]);
            const propagation = propagator.propagate(cellIndex, solutionValue);

            if (board.candidateMasks[cellIndex] !== 0 && !propagation.hasContradiction) {
                propagation.placedCellIndexes.forEach(placedIndex => {
                    if (propagation.placedValues[placedIndex] !== Number(forcingChainSolution[placedIndex])) {
                        wrongPlacements.push(placedIndex);
                    }
                });
            }
        });

        expect(wrongPlacements).toEqual([]);
    });

    it('caches every propagation by cell and value', () => {
        expect.assertions(3);

        const propagator = createPropagator(forcingChainBoard);
        const firstPropagation = propagator.propagate(contradictionCellIndex, contradictionValue);
        const secondPropagation = propagator.propagate(contradictionCellIndex, contradictionValue);

        expect(propagator.getPropagationCount()).toBe(1);
        expect(secondPropagation).toBe(firstPropagation);
        expect(propagator.getPropagationCount()).toBe(1);
    });
});
