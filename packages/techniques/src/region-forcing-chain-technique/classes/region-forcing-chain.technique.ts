import { AbstractForcingChainTechnique } from '../../@generic/classes/abstract-forcing-chain-technique';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { hasMaskValue } from '../../@generic/utils/has-mask-value.util';
import { propagateForScan } from '../../@generic/utils/propagate-for-scan.util';

import type { ForcingChainScanInterface } from '../../@generic/interfaces/forcing-chain-scan.interface';

export class RegionForcingChainTechnique extends AbstractForcingChainTechnique {
    readonly technique = SolutionTechniqueEnum.RegionForcingChain;

    protected collectResults(scan: ForcingChainScanInterface): void {
        const board = scan.propagator.getBoard();

        for (const unitCellIndexes of board.unitCellIndexes) {
            for (let value = 1; value <= board.valueCount; value += 1) {
                if (!this.collectUnitValueResults(scan, unitCellIndexes, value)) {
                    return;
                }
            }
        }
    }

    private collectUnitValueResults(scan: ForcingChainScanInterface, unitCellIndexes: readonly number[], value: number): boolean {
        const positionIndexes = this.getPositionIndexes(scan, unitCellIndexes, value);

        return this.collectBranchResults(scan, positionIndexes.length, branchIndex =>
            propagateForScan(scan, positionIndexes[branchIndex], value)
        );
    }

    private getPositionIndexes(scan: ForcingChainScanInterface, unitCellIndexes: readonly number[], value: number): number[] {
        const board = scan.propagator.getBoard();

        if (unitCellIndexes.some(cellIndex => board.cellValues[cellIndex] === value)) {
            return [];
        }

        return unitCellIndexes.filter(cellIndex => hasMaskValue(board.candidateMasks[cellIndex], value));
    }
}
