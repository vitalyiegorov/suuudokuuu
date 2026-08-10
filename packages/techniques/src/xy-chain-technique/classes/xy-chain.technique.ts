import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import {
    CHAIN_SEARCH_ROOT_PARENT_INDEX,
    XY_CHAIN_MAX_VISITS_PER_ROOT,
    XY_CHAIN_MIN_CELLS
} from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { collectChainResults } from '../../@generic/utils/collect-chain-results.util';
import { compareCells } from '../../@generic/utils/compare-cells.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getBivalueCells } from '../../@generic/utils/get-bivalue-cells.util';
import { getCanonicalTechniqueResults } from '../../@generic/utils/get-canonical-technique-results.util';
import { getChainEndpointEliminations } from '../../@generic/utils/get-chain-endpoint-eliminations.util';
import { getChainSearchPath } from '../../@generic/utils/get-chain-search-path.util';
import { getSearchScope } from '../../@generic/utils/get-search-scope.util';
import { getTargetEliminations } from '../../@generic/utils/get-target-eliminations.util';
import { isBivalueCell } from '../../@generic/utils/is-bivalue-cell.util';
import { isCellOnChainPath } from '../../@generic/utils/is-cell-on-chain-path.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { XYChainNodeInterface } from '../interfaces/xy-chain-node.interface';
import type { XYChainScanInterface } from '../interfaces/xy-chain-scan.interface';
import type { XYChainSearchInterface } from '../interfaces/xy-chain-search.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const getNodeKey = (cell: CellInterface, linkValue: number): string => `${CandidateContext.getCellKey(cell)}:${linkValue}`;

const hasTargetResults = (scan: XYChainScanInterface): boolean => isDefined(scan.target) && scan.results.length > scan.resultsAtStart;

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

        if (isDefined(linkValue)) {
            this.searchShortestChains(scan, root, linkValue);
        }

        if (hasTargetResults(scan)) {
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

    private searchShortestChains(scan: XYChainScanInterface, root: CellInterface, linkValue: number): void {
        const search: XYChainSearchInterface = {
            nodes: [{ cell: root, parentIndex: CHAIN_SEARCH_ROOT_PARENT_INDEX, pathLength: 1, linkValue }],
            visitedKeys: new Set([getNodeKey(root, linkValue)])
        };
        let nodeIndex = 0;

        while (nodeIndex < search.nodes.length && scan.linkVisits < XY_CHAIN_MAX_VISITS_PER_ROOT) {
            this.expandNode(scan, search, nodeIndex);

            if (hasTargetResults(scan)) {
                return;
            }

            nodeIndex += 1;
        }
    }

    private expandNode(scan: XYChainScanInterface, search: XYChainSearchInterface, nodeIndex: number): void {
        const node = search.nodes[nodeIndex];

        for (const nextCell of this.getNextXYChainCells(scan.context, node)) {
            if (!hasTargetResults(scan) && scan.linkVisits < XY_CHAIN_MAX_VISITS_PER_ROOT) {
                scan.linkVisits += 1;
                this.visitNextCell(scan, search, nodeIndex, nextCell);
            }
        }
    }

    private visitNextCell(scan: XYChainScanInterface, search: XYChainSearchInterface, nodeIndex: number, nextCell: CellInterface): void {
        const node = search.nodes[nodeIndex];
        const nextLinkValue = scan.context.getCandidates(nextCell).find(candidate => candidate !== node.linkValue);
        const isVisitableCell =
            isDefined(nextLinkValue) &&
            !search.visitedKeys.has(getNodeKey(nextCell, nextLinkValue)) &&
            !isCellOnChainPath(search.nodes, nodeIndex, nextCell);

        if (isVisitableCell) {
            search.visitedKeys.add(getNodeKey(nextCell, nextLinkValue));
            search.nodes.push({ cell: nextCell, parentIndex: nodeIndex, pathLength: node.pathLength + 1, linkValue: nextLinkValue });
            this.addEndpointResults(scan, search, search.nodes.length - 1);
        }
    }

    private addEndpointResults(scan: XYChainScanInterface, search: XYChainSearchInterface, nodeIndex: number): void {
        const node = search.nodes[nodeIndex];

        if (node.linkValue !== scan.eliminationValue || node.pathLength < XY_CHAIN_MIN_CELLS) {
            return;
        }

        const path = getChainSearchPath(search.nodes, nodeIndex);
        const eliminations = getChainEndpointEliminations(scan.context, path, scan.eliminationValue, scan.target);

        scan.results.push(...createEliminationResults(this.technique, eliminations, path, path.length));
    }

    private getNextXYChainCells(context: CandidateContext, node: XYChainNodeInterface): CellInterface[] {
        return context
            .getPeers(node.cell)
            .filter(cell => isBivalueCell(context, cell))
            .filter(cell => context.getCandidates(cell).includes(node.linkValue))
            .sort(compareCells);
    }
}
