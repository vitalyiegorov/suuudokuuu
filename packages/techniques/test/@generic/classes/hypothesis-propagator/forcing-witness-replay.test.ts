import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../../../src/@generic/classes/candidate-context/candidate-context';
import { HypothesisPropagator } from '../../../../src/@generic/classes/hypothesis-propagator/hypothesis-propagator';
import { ForcingImplicationKindEnum } from '../../../../src/@generic/enums/forcing-implication-kind.enum';
import { ForcingOutcomeKindEnum } from '../../../../src/@generic/enums/forcing-outcome-kind.enum';
import { SolutionTechniqueEnum } from '../../../../src/@generic/enums/solution-technique.enum';
import { createForcingChainResults } from '../../../../src/@generic/utils/create-forcing-chain-results.util';
import { CellForcingChainTechnique } from '../../../../src/cell-forcing-chain-technique/classes/cell-forcing-chain.technique';
import { RegionForcingChainTechnique } from '../../../../src/region-forcing-chain-technique/classes/region-forcing-chain.technique';

import type { CandidateEliminationInterface } from '../../../../src/@generic/interfaces/candidate-elimination.interface';
import type { ForcingBranchInterface } from '../../../../src/@generic/interfaces/forcing-branch.interface';
import type { HypothesisBoardInterface } from '../../../../src/@generic/interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../../../../src/@generic/interfaces/hypothesis-propagation.interface';
import type { ForcingImplicationType } from '../../../../src/@generic/types/forcing-implication.type';
import type { ForcingOutcomeType } from '../../../../src/@generic/types/forcing-outcome.type';
import type { CellInterface } from '@suuudokuuu/generator';

const boardString = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const placementBoardString = '023006541000001023014325078002003160000010230137692485391268754056039812208150396';
const multiPlacementAssumptionCellIndex = 11;

class BranchReplay {
    private readonly candidates: Set<number>[];
    private readonly placements = new Map<CellInterface, number>();
    private readonly queuedSingles = new Map<number, Readonly<CandidateEliminationInterface>>();

    constructor(
        private readonly context: CandidateContext,
        private readonly board: HypothesisBoardInterface
    ) {
        this.candidates = board.cells.map(cell => new Set(context.getCandidates(cell)));
    }

    replay(branch: ForcingBranchInterface): boolean {
        const first = branch.implications.at(0);

        return (
            first?.kind === ForcingImplicationKindEnum.ASSIGNMENT &&
            first.cell === branch.assumption.cell &&
            first.value === branch.assumption.value &&
            branch.implications.every((implication, implicationIndex) => this.accept(implication, implicationIndex)) &&
            this.matchesOutcome(branch.outcome, branch.implications.length)
        );
    }

    private accept(implication: ForcingImplicationType, implicationIndex: number): boolean {
        const cellCandidates = this.getCandidates(implication.cell);

        if (!cellCandidates.has(implication.value)) {
            return false;
        }

        if (implication.kind === ForcingImplicationKindEnum.ASSIGNMENT) {
            const isAssumption = implicationIndex === 0;
            const isQueued = isDefined(implication.reasonIndex) && this.isQueued(implication.reasonIndex, implication);

            this.placements.set(implication.cell, implication.value);
            cellCandidates.clear();

            return isAssumption || isQueued;
        }

        if (implication.kind === ForcingImplicationKindEnum.PEER_REMOVAL) {
            const sourceIndex = this.board.cells.indexOf(implication.source.cell);
            const isPeer = this.board.peerIndexes[sourceIndex]?.includes(this.board.cells.indexOf(implication.cell)) ?? false;

            cellCandidates.delete(implication.value);

            return (
                isPeer &&
                implication.source.value === implication.value &&
                this.placements.get(implication.source.cell) === implication.value
            );
        }

        this.queuedSingles.set(implicationIndex, implication);

        const isSingle =
            implication.kind === ForcingImplicationKindEnum.NAKED_SINGLE
                ? cellCandidates.size === 1
                : this.isUnit(implication.supportCells) &&
                  implication.supportCells.includes(implication.cell) &&
                  implication.supportCells.filter(cell => this.getCandidates(cell).has(implication.value)).length === 1;

        return isSingle && implication.prefixLength === implicationIndex;
    }

    private matchesOutcome(outcome: ForcingOutcomeType, implicationCount: number): boolean {
        switch (outcome.kind) {
            case ForcingOutcomeKindEnum.COMMON_PLACEMENT:
                return this.placements.get(outcome.cell) === outcome.value;
            case ForcingOutcomeKindEnum.COMMON_ELIMINATIONS:
                return outcome.eliminations.every(
                    elimination =>
                        this.context.getCandidates(elimination.cell).includes(elimination.value) &&
                        this.placements.get(elimination.cell) !== elimination.value &&
                        !this.getCandidates(elimination.cell).has(elimination.value)
                );
            case ForcingOutcomeKindEnum.EMPTY_CELL:
                return outcome.implicationPrefixLength === implicationCount && this.getCandidates(outcome.cell).size === 0;
            case ForcingOutcomeKindEnum.NO_POSITION:
                return (
                    outcome.implicationPrefixLength === implicationCount &&
                    this.isUnit(outcome.unitCells) &&
                    outcome.unitCells.every(
                        cell =>
                            cell.value !== outcome.value &&
                            this.placements.get(cell) !== outcome.value &&
                            !this.getCandidates(cell).has(outcome.value)
                    )
                );
            default:
                return (
                    outcome.implicationPrefixLength === implicationCount &&
                    this.isQueued(outcome.reasonIndex, outcome) &&
                    !this.getCandidates(outcome.cell).has(outcome.value)
                );
        }
    }

    private getCandidates(cell: CellInterface): Set<number> {
        return this.candidates[this.board.cells.indexOf(cell)] ?? new Set();
    }

    private isQueued(reasonIndex: number, candidate: Readonly<CandidateEliminationInterface>): boolean {
        const single = this.queuedSingles.get(reasonIndex);

        return single?.cell === candidate.cell && single.value === candidate.value;
    }

    private isUnit(cells: readonly CellInterface[]): boolean {
        return this.board.unitCellIndexes.some(
            unit => unit.length === cells.length && unit.every((cellIndex, position) => this.board.cells[cellIndex] === cells[position])
        );
    }
}

const createContext = (board: string): CandidateContext => CandidateContext.fromSudoku(Sudoku.fromString(board, defaultSudokuConfig));

const toBranch = (explanation: HypothesisPropagationInterface, board: HypothesisBoardInterface): ForcingBranchInterface => ({
    assumption: { cell: board.cells[explanation.assumptionCellIndex], value: explanation.assumptionValue },
    implications: explanation.implications ?? [],
    outcome: explanation.contradiction ?? { kind: ForcingOutcomeKindEnum.COMMON_ELIMINATIONS, eliminations: [] }
});

describe('forcing witness replay', () => {
    it.each([
        [1, 3, ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT],
        [2, 2, ForcingOutcomeKindEnum.NO_POSITION],
        [2, 6, ForcingOutcomeKindEnum.EMPTY_CELL]
    ])('replays the %i/%i contradiction trace from the starting candidates', (cellIndex, value, kind) => {
        const context = createContext(boardString);
        const propagator = HypothesisPropagator.fromContext(context);
        const board = propagator.getBoard();
        const branch = toBranch(propagator.explain(cellIndex, value), board);

        expect(branch.outcome.kind).toBe(kind);
        expect(new BranchReplay(context, board).replay(branch)).toBe(true);
    });

    it('rejects a peer removal whose source is not the placed candidate', () => {
        const context = createContext(boardString);
        const propagator = HypothesisPropagator.fromContext(context);
        const board = propagator.getBoard();
        const branch = toBranch(propagator.explain(2, 6), board);
        const removalIndex = branch.implications.findIndex(implication => implication.kind === ForcingImplicationKindEnum.PEER_REMOVAL);
        const implications = branch.implications.map((implication, implicationIndex) =>
            implicationIndex === removalIndex && implication.kind === ForcingImplicationKindEnum.PEER_REMOVAL
                ? { ...implication, source: { cell: implication.cell, value: implication.value } }
                : implication
        );

        expect(removalIndex).toBeGreaterThan(0);
        expect(new BranchReplay(context, board).replay({ ...branch, implications })).toBe(false);
    });

    it('replays every emitted cell and region forcing branch up to its shared outcome', () => {
        const branchKinds: ForcingOutcomeKindEnum[] = [];

        for (const boardText of [boardString, placementBoardString]) {
            const context = createContext(boardText);
            const board = HypothesisPropagator.fromContext(context).getBoard();
            const results = [new CellForcingChainTechnique().find(context), new RegionForcingChainTechnique().find(context)].flat();

            for (const branch of results.flatMap(result => result.branches ?? [])) {
                expect(new BranchReplay(context, board).replay(branch)).toBe(true);
                branchKinds.push(branch.outcome.kind);
            }
        }

        expect(branchKinds).toContain(ForcingOutcomeKindEnum.COMMON_PLACEMENT);
        expect(branchKinds).toContain(ForcingOutcomeKindEnum.COMMON_ELIMINATIONS);
    });

    it('rejects a branch whose outcome names a cell the trace never placed', () => {
        const context = createContext(placementBoardString);
        const board = HypothesisPropagator.fromContext(context).getBoard();
        const [result] = new CellForcingChainTechnique().find(context).filter(candidate => candidate.kind === 'placement');
        const [branch] = result.branches ?? [];
        const unplacedCell = board.cells.find(cell => cell.value === 0 && cell !== result.cell) ?? result.cell;

        expect(new BranchReplay(context, board).replay(branch)).toBe(true);
        expect(
            new BranchReplay(context, board).replay({
                ...branch,
                outcome: { kind: ForcingOutcomeKindEnum.COMMON_PLACEMENT, cell: unplacedCell, value: result.value }
            })
        ).toBe(false);
    });

    it('shares one implication trace across results while keeping each result outcome', () => {
        const context = createContext(placementBoardString);
        const propagator = HypothesisPropagator.fromContext(context);
        const placements = createForcingChainResults(
            SolutionTechniqueEnum.CellForcingChain,
            propagator,
            [5, 9].map(value => propagator.propagate(multiPlacementAssumptionCellIndex, value)),
            { eliminationValues: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
        ).filter(result => result.kind === 'placement');

        expect(placements.length).toBeGreaterThan(1);
        expect(placements[0].branches?.[0].implications).toBe(placements[1].branches?.[0].implications);
        expect(placements.map(result => result.branches?.[0].outcome)).toEqual(
            placements.map(result => ({ kind: ForcingOutcomeKindEnum.COMMON_PLACEMENT, cell: result.cell, value: result.value }))
        );
    });
});
