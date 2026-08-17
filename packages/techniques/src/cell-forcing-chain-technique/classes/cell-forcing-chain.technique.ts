import { isDefined } from '@rnw-community/shared';

import { AbstractForcingChainTechnique } from '../../@generic/classes/abstract-forcing-chain-technique';
import { FORCING_CHAIN_MIN_BRANCHES } from '../../@generic/constants/forcing-chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { markContextSearchCapped } from '../../@generic/utils/context-scan-state.util';
import { createForcingChainResults } from '../../@generic/utils/create-forcing-chain-results.util';
import { getMaskValues } from '../../@generic/utils/get-mask-values.util';
import { hasForcingChainScanBudget } from '../../@generic/utils/has-forcing-chain-scan-budget.util';
import { propagateForScan } from '../../@generic/utils/propagate-for-scan.util';

import type { ForcingChainScanInterface } from '../../@generic/interfaces/forcing-chain-scan.interface';

export class CellForcingChainTechnique extends AbstractForcingChainTechnique {
    readonly technique = SolutionTechniqueEnum.CellForcingChain;

    protected collectResults(scan: ForcingChainScanInterface): void {
        const board = scan.propagator.getBoard();

        for (let cellIndex = 0; cellIndex < board.cells.length; cellIndex += 1) {
            if (!this.collectCellResults(scan, cellIndex)) {
                return;
            }
        }
    }

    private collectCellResults(scan: ForcingChainScanInterface, cellIndex: number): boolean {
        const board = scan.propagator.getBoard();
        const values = getMaskValues(board.candidateMasks[cellIndex], board.valueCount);

        if (values.length < FORCING_CHAIN_MIN_BRANCHES) {
            return true;
        }

        if (!hasForcingChainScanBudget(scan, values.length)) {
            markContextSearchCapped(scan.context);

            return false;
        }

        const propagations = values.map(value => propagateForScan(scan, cellIndex, value));

        scan.results.push(...createForcingChainResults(this.technique, board, propagations, scan.scope));

        return !isDefined(scan.scope.directTarget) || scan.results.length === 0;
    }
}
