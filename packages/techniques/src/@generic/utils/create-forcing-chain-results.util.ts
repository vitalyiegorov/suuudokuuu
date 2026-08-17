import { isDefined } from '@rnw-community/shared';

import { FORCING_CHAIN_MIN_BRANCHES, FORCING_CHAIN_MIN_CELLS } from '../constants/forcing-chain-scan.constant';

import { createEliminationResults } from './create-elimination-results.util';
import { createPlacementResult } from './create-placement-result.util';
import { getHypothesisReasonCells } from './get-hypothesis-reason-cells.util';
import { getMaskValues } from './get-mask-values.util';
import { isSameCell } from './is-same-cell.util';

import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { ForcingChainPlacementInterface } from '../interfaces/forcing-chain-placement.interface';
import type { HypothesisBoardInterface } from '../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../interfaces/hypothesis-propagation.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchScopeInterface } from '../interfaces/technique-search-scope.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const isScopedPlacement = (cell: CellInterface, value: number, scope: TechniqueSearchScopeInterface): boolean =>
    !isDefined(scope.directTarget) || (isSameCell(cell, scope.directTarget.cell) && value === scope.directTarget.value);

const isScopedElimination = (cell: CellInterface, value: number, scope: TechniqueSearchScopeInterface): boolean =>
    scope.eliminationValues.includes(value) && (!isDefined(scope.directTarget) || isSameCell(cell, scope.directTarget.cell));

const getCommonPlacements = (
    board: HypothesisBoardInterface,
    propagations: HypothesisPropagationInterface[],
    scope: TechniqueSearchScopeInterface
): ForcingChainPlacementInterface[] => {
    const [firstPropagation, ...otherPropagations] = propagations;
    const placements: ForcingChainPlacementInterface[] = [];

    for (const cellIndex of firstPropagation.placedCellIndexes) {
        const value = firstPropagation.placedValues[cellIndex];
        const isCommonPlacement = otherPropagations.every(propagation => propagation.placedValues[cellIndex] === value);

        if (isCommonPlacement && isScopedPlacement(board.cells[cellIndex], value, scope)) {
            placements.push({ cellIndex, value });
        }
    }

    return placements.sort((firstPlacement, secondPlacement) => firstPlacement.cellIndex - secondPlacement.cellIndex);
};

const getCommonEliminationMask = (propagations: HypothesisPropagationInterface[], cellIndex: number): number =>
    propagations.reduce(
        // eslint-disable-next-line no-bitwise -- keeps only the candidate bits every branch of the case split eliminated
        (commonMask, propagation) => commonMask & propagation.eliminatedMasks[cellIndex],
        propagations[0].eliminatedMasks[cellIndex]
    );

const getCommonEliminations = (
    board: HypothesisBoardInterface,
    propagations: HypothesisPropagationInterface[],
    scope: TechniqueSearchScopeInterface
): CandidateEliminationInterface[] => {
    const eliminations: CandidateEliminationInterface[] = [];

    for (let cellIndex = 0; cellIndex < board.cells.length; cellIndex += 1) {
        const cell = board.cells[cellIndex];

        for (const value of getMaskValues(getCommonEliminationMask(propagations, cellIndex), board.valueCount)) {
            if (isScopedElimination(cell, value, scope)) {
                eliminations.push({ cell, value });
            }
        }
    }

    return eliminations;
};

const createForcingPlacementResult = (
    technique: SolutionTechniqueEnum,
    board: HypothesisBoardInterface,
    placement: ForcingChainPlacementInterface,
    reasonCells: CellInterface[]
): TechniqueResultInterface => ({
    ...createPlacementResult(technique, board.cells[placement.cellIndex], placement.value, reasonCells),
    chainLength: reasonCells.length
});

export const createForcingChainResults = (
    technique: SolutionTechniqueEnum,
    board: HypothesisBoardInterface,
    propagations: HypothesisPropagationInterface[],
    scope: TechniqueSearchScopeInterface
): TechniqueResultInterface[] => {
    const hasUsableBranches =
        propagations.length >= FORCING_CHAIN_MIN_BRANCHES && !propagations.some(propagation => propagation.hasContradiction);

    if (!hasUsableBranches) {
        return [];
    }

    const reasonCells = getHypothesisReasonCells(board, propagations);

    if (reasonCells.length < FORCING_CHAIN_MIN_CELLS) {
        return [];
    }

    const placementResults = getCommonPlacements(board, propagations, scope).map(placement =>
        createForcingPlacementResult(technique, board, placement, reasonCells)
    );

    return [
        ...placementResults,
        ...createEliminationResults(technique, getCommonEliminations(board, propagations, scope), reasonCells, reasonCells.length)
    ];
};
