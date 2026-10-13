import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../../src/@generic/classes/candidate-context/candidate-context';
import { HypothesisPathTracer } from '../../../../src/@generic/classes/hypothesis-path-tracer/hypothesis-path-tracer';
import { HypothesisPropagator } from '../../../../src/@generic/classes/hypothesis-propagator/hypothesis-propagator';
import { ForcingOutcomeKindEnum } from '../../../../src/@generic/enums/forcing-outcome-kind.enum';
import { getValueBit } from '../../../../src/@generic/utils/get-value-bit.util';
import { hasMaskValue } from '../../../../src/@generic/utils/has-mask-value.util';
import { removeMaskValue } from '../../../../src/@generic/utils/remove-mask-value.util';
import { CellForcingChainTechnique } from '../../../../src/cell-forcing-chain-technique/classes/cell-forcing-chain.technique';
import { NishioForcingChainTechnique } from '../../../../src/nishio-forcing-chain-technique/classes/nishio-forcing-chain.technique';
import { RegionForcingChainTechnique } from '../../../../src/region-forcing-chain-technique/classes/region-forcing-chain.technique';

import type { CandidateEliminationInterface } from '../../../../src/@generic/interfaces/candidate-elimination.interface';
import type { ForcingBranchInterface } from '../../../../src/@generic/interfaces/forcing-branch.interface';
import type { HypothesisBoardInterface } from '../../../../src/@generic/interfaces/hypothesis-board.interface';
import type { TechniqueStrategyInterface } from '../../../../src/@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const reportedBoard = '001004800302000045540003090800040300000905410400006002030008600050370000100460000';
const forcingChainBoard = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const forcingPlacementBoard = '023006541000001023014325078002003160000010230137692485391268754056039812208150396';
const regionPlacementBoard = '000000006000006001060502034000604305305000640406035100638257419570460823240000567';
const reportedBranchFullPlacementCount = 38;
const reportedBranchMaximumImplications = 24;

class BranchReplay {
    private readonly masks: Uint16Array;
    private readonly values: Int8Array;

    constructor(private readonly board: HypothesisBoardInterface) {
        this.masks = Uint16Array.from(board.candidateMasks);
        this.values = new Int8Array(board.cells.length);
    }

    isProof(path: CandidateEliminationInterface[], outcome: ForcingBranchInterface['outcome']): boolean {
        return path.every((candidate, pathIndex) => this.place(candidate, pathIndex === 0)) && this.holds(outcome);
    }

    private place(candidate: CandidateEliminationInterface, isAssumption: boolean): boolean {
        const cellIndex = this.getIndex(candidate.cell);

        if (!isAssumption && !this.isForced(cellIndex, candidate.value)) {
            return false;
        }

        this.values[cellIndex] = candidate.value;
        this.masks[cellIndex] = 0;
        this.board.peerIndexes[cellIndex].forEach(peerIndex => {
            this.masks[peerIndex] = removeMaskValue(this.masks[peerIndex], candidate.value);
        });

        return true;
    }

    private isForced(cellIndex: number, value: number): boolean {
        return (
            this.masks[cellIndex] === getValueBit(value) ||
            (hasMaskValue(this.masks[cellIndex], value) &&
                this.board.cellUnitIndexes[cellIndex].some(unitIndex =>
                    this.hasNoPosition(this.board.unitCellIndexes[unitIndex], value, cellIndex)
                ))
        );
    }

    private hasNoPosition(unitCellIndexes: number[], value: number, exceptCellIndex = -1): boolean {
        return unitCellIndexes.every(
            cellIndex =>
                cellIndex === exceptCellIndex ||
                (this.values[cellIndex] !== value &&
                    this.board.cellValues[cellIndex] !== value &&
                    !hasMaskValue(this.masks[cellIndex], value))
        );
    }

    private isEliminated(candidate: CandidateEliminationInterface): boolean {
        const cellIndex = this.getIndex(candidate.cell);

        return this.values[cellIndex] !== candidate.value && !hasMaskValue(this.masks[cellIndex], candidate.value);
    }

    private holds(outcome: ForcingBranchInterface['outcome']): boolean {
        switch (outcome.kind) {
            case ForcingOutcomeKindEnum.EMPTY_CELL:
                return this.masks[this.getIndex(outcome.cell)] === 0 && this.values[this.getIndex(outcome.cell)] === 0;
            case ForcingOutcomeKindEnum.NO_POSITION:
                return this.hasNoPosition(
                    outcome.unitCells.map(cell => this.getIndex(cell)),
                    outcome.value
                );
            case ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT:
                return (
                    this.isEliminated(outcome) &&
                    this.board.cellUnitIndexes[this.getIndex(outcome.cell)].some(unitIndex =>
                        this.hasNoPosition(this.board.unitCellIndexes[unitIndex], outcome.value)
                    )
                );
            case ForcingOutcomeKindEnum.COMMON_PLACEMENT:
                return this.values[this.getIndex(outcome.cell)] === outcome.value;
            default:
                return outcome.eliminations.every(elimination => this.isEliminated(elimination));
        }
    }

    private getIndex(cell: CellInterface): number {
        return this.board.cells.findIndex(boardCell => boardCell.x === cell.x && boardCell.y === cell.y);
    }
}

const createContext = (board: string): CandidateContext =>
    CandidateContext.fromSudoku(Sudoku.fromString(board.replaceAll('0', '.'), defaultSudokuConfig));

const isProof = (board: HypothesisBoardInterface, branch: ForcingBranchInterface, implications = branch.implications): boolean =>
    new BranchReplay(board).isProof([branch.assumption, ...implications], branch.outcome);

const hasOnlyNeededImplications = (board: HypothesisBoardInterface, branch: ForcingBranchInterface): boolean =>
    branch.implications.every(
        (_, removedIndex) =>
            !isProof(
                board,
                branch,
                branch.implications.filter((__, implicationIndex) => implicationIndex !== removedIndex)
            )
    );

const getBranches = (strategy: TechniqueStrategyInterface, context: CandidateContext): ForcingBranchInterface[] =>
    strategy.find(context).flatMap(result => result.branches ?? []);

describe('HypothesisPathTracer', () => {
    it('trims the reported R5C5=8 Nishio branch to the placements its contradiction needs', () => {
        expect.assertions(4);

        const context = createContext(reportedBoard);
        const board = HypothesisPropagator.fromContext(context).getBoard();
        const branch = getBranches(new NishioForcingChainTechnique(), context).find(
            candidate => candidate.assumption.cell.y === 4 && candidate.assumption.cell.x === 4 && candidate.assumption.value === 8
        );

        expect(branch?.implications.length).toBeLessThanOrEqual(reportedBranchMaximumImplications);
        expect(branch?.implications.length).toBeLessThan(reportedBranchFullPlacementCount - 1);
        expect(branch && isProof(board, branch)).toBe(true);
        expect(branch && hasOnlyNeededImplications(board, branch)).toBe(true);
    });

    it.each([
        ['Nishio', reportedBoard, new NishioForcingChainTechnique()],
        ['Nishio', forcingChainBoard, new NishioForcingChainTechnique()],
        ['cell', forcingPlacementBoard, new CellForcingChainTechnique()],
        ['cell', forcingChainBoard, new CellForcingChainTechnique()],
        ['region', regionPlacementBoard, new RegionForcingChainTechnique()]
    ])('keeps every %s branch a proof in which removing any implication breaks the outcome', (_, boardString, strategy) => {
        const context = createContext(boardString);
        const board = HypothesisPropagator.fromContext(context).getBoard();
        const branches = getBranches(strategy, context);

        expect(branches.length).toBeGreaterThan(0);
        expect(branches.filter(branch => !isProof(board, branch))).toEqual([]);
        expect(branches.filter(branch => !hasOnlyNeededImplications(board, branch))).toEqual([]);
    });

    it('returns the same trimmed implications on every read', () => {
        expect.assertions(1);

        const [branch] = getBranches(new NishioForcingChainTechnique(), createContext(reportedBoard));

        expect(branch.implications).toBe(branch.implications);
    });

    it('traces nothing beyond the assumption when no placement caused the eliminations', () => {
        expect.assertions(1);

        const propagator = HypothesisPropagator.fromContext(createContext(forcingChainBoard));
        const propagation = propagator.propagate(1, 3);

        expect(new HypothesisPathTracer(propagator.getBoard(), propagation).getEliminationPath([])).toEqual([1]);
    });
});
