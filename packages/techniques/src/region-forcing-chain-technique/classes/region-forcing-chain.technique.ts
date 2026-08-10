import { isDefined } from '@rnw-community/shared';

import { AbstractForcingChainTechnique } from '../../@generic/classes/abstract-forcing-chain-technique';
import { FORCING_CHAIN_MIN_BRANCHES } from '../../@generic/constants/forcing-chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { markContextSearchCapped } from '../../@generic/utils/context-scan-state.util';
import { createForcingChainResults } from '../../@generic/utils/create-forcing-chain-results.util';
import { hasForcingChainScanBudget } from '../../@generic/utils/has-forcing-chain-scan-budget.util';
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

    private collectUnitValueResults(scan: ForcingChainScanInterface, unitCellIndexes: number[], value: number): boolean {
        const board = scan.propagator.getBoard();
        const positionIndexes = this.getPositionIndexes(scan, unitCellIndexes, value);

        if (positionIndexes.length < FORCING_CHAIN_MIN_BRANCHES) {
            return true;
        }

        if (!hasForcingChainScanBudget(scan, positionIndexes.length)) {
            markContextSearchCapped(scan.context);

            return false;
        }

        const propagations = positionIndexes.map(positionIndex => propagateForScan(scan, positionIndex, value));

        scan.results.push(...createForcingChainResults(this.technique, board, propagations, scan.scope));

        return !isDefined(scan.scope.directTarget) || scan.results.length === 0;
    }

    private getPositionIndexes(scan: ForcingChainScanInterface, unitCellIndexes: number[], value: number): number[] {
        const board = scan.propagator.getBoard();

        if (unitCellIndexes.some(cellIndex => board.cellValues[cellIndex] === value)) {
            return [];
        }

        return unitCellIndexes.filter(cellIndex => hasMaskValue(board.candidateMasks[cellIndex], value));
    }
}
