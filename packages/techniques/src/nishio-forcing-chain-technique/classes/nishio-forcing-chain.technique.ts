import { isDefined } from '@rnw-community/shared';

import { AbstractForcingChainTechnique } from '../../@generic/classes/abstract-forcing-chain-technique';
import { FORCING_CHAIN_MIN_CELLS } from '../../@generic/constants/forcing-chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { markContextSearchCapped } from '../../@generic/utils/context-scan-state.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getHypothesisReasonCells } from '../../@generic/utils/get-hypothesis-reason-cells.util';
import { getMaskValues } from '../../@generic/utils/get-mask-values.util';
import { hasForcingChainScanBudget } from '../../@generic/utils/has-forcing-chain-scan-budget.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';
import { propagateForScan } from '../../@generic/utils/propagate-for-scan.util';

import type { ForcingChainScanInterface } from '../../@generic/interfaces/forcing-chain-scan.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class NishioForcingChainTechnique extends AbstractForcingChainTechnique {
    readonly technique = SolutionTechniqueEnum.NishioForcingChain;

    protected collectResults(scan: ForcingChainScanInterface): void {
        const board = scan.propagator.getBoard();

        for (let cellIndex = 0; cellIndex < board.cells.length; cellIndex += 1) {
            const isScannableCell = this.isScannableCell(scan, board.cells[cellIndex]);

            if (isScannableCell && !this.collectCellResults(scan, cellIndex)) {
                return;
            }
        }
    }

    private isScannableCell(scan: ForcingChainScanInterface, cell: CellInterface): boolean {
        return !isDefined(scan.scope.directTarget) || isSameCell(cell, scan.scope.directTarget.cell);
    }

    private collectCellResults(scan: ForcingChainScanInterface, cellIndex: number): boolean {
        const board = scan.propagator.getBoard();
        const values = getMaskValues(board.candidateMasks[cellIndex], board.valueCount).filter(value =>
            scan.scope.eliminationValues.includes(value)
        );

        for (const value of values) {
            if (!hasForcingChainScanBudget(scan, 1)) {
                markContextSearchCapped(scan.context);

                return false;
            }

            if (!this.collectContradictionResult(scan, cellIndex, value)) {
                return false;
            }
        }

        return true;
    }

    private collectContradictionResult(scan: ForcingChainScanInterface, cellIndex: number, value: number): boolean {
        const board = scan.propagator.getBoard();
        const propagation = propagateForScan(scan, cellIndex, value);
        const reasonCells = getHypothesisReasonCells(board, [propagation]);

        if (!propagation.hasContradiction || reasonCells.length < FORCING_CHAIN_MIN_CELLS) {
            return true;
        }

        scan.results.push(
            ...createEliminationResults(this.technique, [{ cell: board.cells[cellIndex], value }], reasonCells, reasonCells.length)
        );

        return !isDefined(scan.scope.directTarget);
    }
}
