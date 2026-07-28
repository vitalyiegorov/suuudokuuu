import { isDefined } from '@rnw-community/shared';

import { XY_CHAIN_MAX_VISITS_PER_ROOT, XY_CHAIN_MIN_CELLS } from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { collectChainResults } from '../../@generic/utils/collect-chain-results.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getBivalueCells } from '../../@generic/utils/get-bivalue-cells.util';
import { getCanonicalTechniqueResults } from '../../@generic/utils/get-canonical-technique-results.util';
import { getChainEndpointEliminations } from '../../@generic/utils/get-chain-endpoint-eliminations.util';
import { getSearchScope } from '../../@generic/utils/get-search-scope.util';
import { getTargetEliminations } from '../../@generic/utils/get-target-eliminations.util';
import { isBivalueCell } from '../../@generic/utils/is-bivalue-cell.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { XYChainScanInterface } from '../interfaces/xy-chain-scan.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const compareCells = (firstCell: CellInterface, secondCell: CellInterface): number =>
    firstCell.y - secondCell.y || firstCell.x - secondCell.x;

export class XYChainTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XYChain;

    find(context: CandidateContext, searchTarget?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const scope = getSearchScope(context, searchTarget);

        return collectChainResults(scope, (eliminationValue, results) => {
            const target = scope.directTarget;

            for (const root of this.getRoots(context, eliminationValue, target)) {
                const scan = { context, eliminationValue, results, target, linkVisits: 0, resultsAtStart: results.length };

                if (this.collectRootResults(scan, root)) {
                    return;
                }
            }
        });
    }

    private collectRootResults(scan: XYChainScanInterface, root: CellInterface): boolean {
        const linkValue = scan.context.getCandidates(root).find(candidate => candidate !== scan.eliminationValue);

        if (!isDefined(linkValue)) {
            return false;
        }

        this.collectXYChainResults(scan, [root], linkValue);

        if (scan.target && scan.results.length > scan.resultsAtStart) {
            return true;
        }

        scan.results.splice(0, scan.results.length, ...getCanonicalTechniqueResults(scan.results));

        return false;
    }

    private getRoots(context: CandidateContext, eliminationValue: number, target?: TechniqueSearchTargetInterface): CellInterface[] {
        return getBivalueCells(context)
            .filter(cell => context.getCandidates(cell).includes(eliminationValue))
            .filter(
                cell =>
                    !target || (!isSameCell(cell, target.cell) && getTargetEliminations(context, cell, target, eliminationValue).length > 0)
            )
            .sort(compareCells);
    }

    private collectXYChainResults(scan: XYChainScanInterface, path: CellInterface[], linkValue: number): void {
        const currentCell = path[path.length - 1];

        if (
            !isDefined(currentCell) ||
            (scan.target && scan.results.length > scan.resultsAtStart) ||
            scan.linkVisits >= XY_CHAIN_MAX_VISITS_PER_ROOT
        ) {
            return;
        }

        for (const nextCell of this.getNextXYChainCells(scan.context, path, currentCell, linkValue)) {
            if ((scan.target && scan.results.length > scan.resultsAtStart) || scan.linkVisits >= XY_CHAIN_MAX_VISITS_PER_ROOT) {
                return;
            }

            scan.linkVisits += 1;
            this.visitNextCell(scan, path, linkValue, nextCell);
        }
    }

    private visitNextCell(scan: XYChainScanInterface, path: CellInterface[], linkValue: number, nextCell: CellInterface): void {
        const nextLinkValue = scan.context.getCandidates(nextCell).find(candidate => candidate !== linkValue);

        if (isDefined(nextLinkValue)) {
            const nextPath = [...path, nextCell];

            if (nextLinkValue === scan.eliminationValue && nextPath.length >= XY_CHAIN_MIN_CELLS) {
                this.addEndpointResults(scan, nextPath);
            }

            this.collectXYChainResults(scan, nextPath, nextLinkValue);
        }
    }

    private addEndpointResults(scan: XYChainScanInterface, path: CellInterface[]): void {
        const eliminations = getChainEndpointEliminations(scan.context, path, scan.eliminationValue, scan.target);

        scan.results.push(...createEliminationResults(this.technique, eliminations, path));
    }

    private getNextXYChainCells(
        context: CandidateContext,
        path: CellInterface[],
        currentCell: CellInterface,
        linkValue: number
    ): CellInterface[] {
        return context
            .getPeers(currentCell)
            .filter(cell => isBivalueCell(context, cell))
            .filter(cell => context.getCandidates(cell).includes(linkValue))
            .filter(cell => !path.some(pathCell => isSameCell(pathCell, cell)))
            .sort(compareCells);
    }
}
