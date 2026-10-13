import { AbstractForcingChainTechnique } from '../../@generic/classes/abstract-forcing-chain-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { getMaskValues } from '../../@generic/utils/get-mask-values.util';
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

        return this.collectBranchResults(scan, values.length, branchIndex => propagateForScan(scan, cellIndex, values[branchIndex]));
    }
}
