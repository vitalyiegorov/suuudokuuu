import { isDefined } from '@rnw-community/shared';

import { AbstractForcingChainTechnique } from '../../@generic/classes/abstract-forcing-chain-technique';
import { FORCING_CHAIN_MAX_HYPOTHESES_PER_SCAN, FORCING_CHAIN_MIN_BRANCHES } from '../../@generic/constants/forcing-chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createForcingChainResults } from '../../@generic/utils/create-forcing-chain-results.util';
import { getMaskValues } from '../../@generic/utils/get-mask-values.util';

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

        if (scan.propagator.getPropagationCount() + values.length > FORCING_CHAIN_MAX_HYPOTHESES_PER_SCAN) {
            return false;
        }

        const propagations = values.map(value => scan.propagator.propagate(cellIndex, value));

        scan.results.push(...createForcingChainResults(this.technique, board, propagations, scan.scope));

        return !isDefined(scan.scope.directTarget) || scan.results.length === 0;
    }
}
