import { isDefined } from '@rnw-community/shared';

import { HypothesisPathTracer } from '../classes/hypothesis-path-tracer/hypothesis-path-tracer';
import { FORCING_CHAIN_MIN_BRANCHES, FORCING_CHAIN_MIN_CELLS } from '../constants/forcing-chain-scan.constant';
import { ForcingOutcomeKindEnum } from '../enums/forcing-outcome-kind.enum';

import { createEliminationResults } from './create-elimination-results.util';
import { createForcingBranch } from './create-forcing-branch.util';
import { createPlacementResult } from './create-placement-result.util';
import { getHypothesisReasonCells } from './get-hypothesis-reason-cells.util';
import { getMaskValues } from './get-mask-values.util';
import { isSameCell } from './is-same-cell.util';

import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { HypothesisBoardInterface } from '../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../interfaces/hypothesis-propagation.interface';
import type { IndexedCandidateInterface } from '../interfaces/indexed-candidate.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchScopeInterface } from '../interfaces/technique-search-scope.interface';
import type { ForcingOutcomeType } from '../types/forcing-outcome.type';
import type { CellInterface } from '@suuudokuuu/generator';

const isScopedPlacement = (cell: CellInterface, value: number, scope: TechniqueSearchScopeInterface): boolean =>
    !isDefined(scope.directTarget) || (isSameCell(cell, scope.directTarget.cell) && value === scope.directTarget.value);

const isScopedElimination = (cell: CellInterface, value: number, scope: TechniqueSearchScopeInterface): boolean =>
    scope.eliminationValues.includes(value) && (!isDefined(scope.directTarget) || isSameCell(cell, scope.directTarget.cell));

const getCommonPlacements = (
    board: HypothesisBoardInterface,
    propagations: HypothesisPropagationInterface[],
    scope: TechniqueSearchScopeInterface
): IndexedCandidateInterface[] => {
    const [firstPropagation, ...otherPropagations] = propagations;
    const placements: IndexedCandidateInterface[] = [];

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
        // oxlint-disable-next-line no-bitwise -- keeps only the candidate bits every branch of the case split eliminated
        (commonMask, propagation) => commonMask & propagation.eliminatedMasks[cellIndex],
        propagations[0].eliminatedMasks[cellIndex]
    );

const getCommonEliminations = (
    board: HypothesisBoardInterface,
    propagations: HypothesisPropagationInterface[],
    scope: TechniqueSearchScopeInterface
): IndexedCandidateInterface[] => {
    const eliminations: IndexedCandidateInterface[] = [];

    for (let cellIndex = 0; cellIndex < board.cells.length; cellIndex += 1) {
        for (const value of getMaskValues(getCommonEliminationMask(propagations, cellIndex), board.valueCount)) {
            if (isScopedElimination(board.cells[cellIndex], value, scope)) {
                eliminations.push({ cellIndex, value });
            }
        }
    }

    return eliminations;
};

const createForcingPlacementResult = (
    technique: SolutionTechniqueEnum,
    board: HypothesisBoardInterface,
    placement: IndexedCandidateInterface,
    reasonCells: CellInterface[]
): TechniqueResultInterface => ({
    ...createPlacementResult(technique, board.cells[placement.cellIndex], placement.value, reasonCells),
    chainLength: reasonCells.length
});

const getBranchOutcome = (result: TechniqueResultInterface): ForcingOutcomeType =>
    result.kind === 'placement'
        ? { kind: ForcingOutcomeKindEnum.COMMON_PLACEMENT, cell: result.cell, value: result.value }
        : { kind: ForcingOutcomeKindEnum.COMMON_ELIMINATIONS, eliminations: result.eliminations };

const addBranches = (
    board: HypothesisBoardInterface,
    propagations: HypothesisPropagationInterface[],
    result: TechniqueResultInterface,
    getPath: (tracer: HypothesisPathTracer) => number[]
): TechniqueResultInterface => ({
    ...result,
    branches: propagations.map(propagation =>
        createForcingBranch(board, propagation, getBranchOutcome(result), () => getPath(new HypothesisPathTracer(board, propagation)))
    )
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
        addBranches(board, propagations, createForcingPlacementResult(technique, board, placement, reasonCells), tracer =>
            tracer.getPlacementPath(placement.cellIndex)
        )
    );
    const eliminations = getCommonEliminations(board, propagations, scope);
    const eliminationResults = createEliminationResults(
        technique,
        eliminations.map(elimination => ({ cell: board.cells[elimination.cellIndex], value: elimination.value })),
        reasonCells,
        reasonCells.length
    ).map(result => addBranches(board, propagations, result, tracer => tracer.getEliminationPath(eliminations)));

    return [...placementResults, ...eliminationResults];
};
