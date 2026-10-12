import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../../src/@generic/classes/candidate-context/candidate-context';
import { HypothesisPropagator } from '../../../../src/@generic/classes/hypothesis-propagator/hypothesis-propagator';
import { ForcingOutcomeKindEnum } from '../../../../src/@generic/enums/forcing-outcome-kind.enum';
import { getMaskValues } from '../../../../src/@generic/utils/get-mask-values.util';
import { hasMaskValue } from '../../../../src/@generic/utils/has-mask-value.util';
import { createCandidateContextFromMap } from '../../test-utils/create-candidate-context-from-map.spec.util';

const forcingChainBoard = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const forcingChainSolution = '263748951758961423194325876931257684682134795547689312429816537375492168816573249';
const forcingPlacementBoard = '023006541000001023014325078002003160000010230137692485391268754056039812208150396';
const forcingPlacementSolution = '923786541875941623614325978482573169569814237137692485391268754756439812248157396';

const contradictionCellIndex = 14;
const contradictionValue = 8;

const createPropagator = (board: string): HypothesisPropagator =>
    HypothesisPropagator.fromContext(CandidateContext.fromSudoku(Sudoku.fromString(board, defaultSudokuConfig)));

describe('HypothesisPropagator', () => {
    it.each([defaultSudokuConfig, { ...defaultSudokuConfig, fieldSize: 4, fieldGroupWidth: 2, fieldGroupHeight: 2 }])(
        'preserves row-major unit and peer indexes for a $fieldSize-cell layout',
        config => {
            const context = new CandidateContext(
                config,
                Array.from({ length: config.fieldSize }, (_, y) =>
                    Array.from({ length: config.fieldSize }, (__, x) => ({
                        x,
                        y,
                        value: config.blankCellValue,
                        group: Math.floor(x / config.fieldGroupWidth) * config.fieldGroupWidth + Math.floor(y / config.fieldGroupHeight) + 1
                    }))
                )
            );
            const board = HypothesisPropagator.fromContext(context).getBoard();

            expect(board.peerIndexes.map(peerIndexes => peerIndexes.map(peerIndex => board.cells[peerIndex]))).toEqual(
                context.getCells().map(cell => context.getPeers(cell))
            );
            expect(board.unitCellIndexes.map(cellIndexes => cellIndexes.map(cellIndex => board.cells[cellIndex]))).toEqual(
                context.getUnits().map(unit => unit.cells)
            );
        }
    );

    it('keeps repeated candidates in a synthetic context as one mask bit', () => {
        const board = HypothesisPropagator.fromContext(createCandidateContextFromMap([0, 0, [1, 1, 2]])).getBoard();

        expect(getMaskValues(board.candidateMasks[0], board.valueCount)).toEqual([1, 2]);
    });

    it.each([
        [1, 3, ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT],
        [2, 2, ForcingOutcomeKindEnum.NO_POSITION],
        [2, 6, ForcingOutcomeKindEnum.EMPTY_CELL]
    ])('reports where the %i/%i hypothesis breaks', (cellIndex, value, kind) => {
        const propagation = createPropagator(forcingChainBoard).propagate(cellIndex, value);

        expect(propagation.hasContradiction).toBe(true);
        expect(propagation.contradiction?.kind).toBe(kind);
    });

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

    it('preserves cached results when another hypothesis runs', () => {
        const propagator = createPropagator(forcingChainBoard);
        const firstValue = Number(forcingChainSolution[0]);
        const firstPropagation = propagator.propagate(0, firstValue);
        const placedValues = firstPropagation.placedValues.slice();
        const placedCellIndexes = [...firstPropagation.placedCellIndexes];
        const eliminatedMasks = firstPropagation.eliminatedMasks.slice();

        propagator.propagate(contradictionCellIndex, contradictionValue);

        expect(firstPropagation.placedValues).toEqual(placedValues);
        expect(firstPropagation.placedCellIndexes).toEqual(placedCellIndexes);
        expect(firstPropagation.eliminatedMasks).toEqual(eliminatedMasks);
        expect(propagator.propagate(0, firstValue)).toBe(firstPropagation);
    });

    it('caches every propagation by cell and value', () => {
        expect.assertions(1);

        const propagator = createPropagator(forcingChainBoard);
        const firstPropagation = propagator.propagate(contradictionCellIndex, contradictionValue);
        const secondPropagation = propagator.propagate(contradictionCellIndex, contradictionValue);

        expect(secondPropagation).toBe(firstPropagation);
    });
});
