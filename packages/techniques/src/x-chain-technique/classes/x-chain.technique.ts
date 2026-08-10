import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import {
    CHAIN_SEARCH_ROOT_PARENT_INDEX,
    X_CHAIN_MAX_VISITS_PER_ROOT,
    X_CHAIN_MIN_CELLS
} from '../../@generic/constants/chain-scan.constant';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { collectChainResults } from '../../@generic/utils/collect-chain-results.util';
import { compareCells } from '../../@generic/utils/compare-cells.util';
import { markContextSearchCapped } from '../../@generic/utils/context-scan-state.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCanonicalTechniqueResults } from '../../@generic/utils/get-canonical-technique-results.util';
import { getChainEndpointEliminations } from '../../@generic/utils/get-chain-endpoint-eliminations.util';
import { getChainSearchPath } from '../../@generic/utils/get-chain-search-path.util';
import { getSearchScope } from '../../@generic/utils/get-search-scope.util';
import { getTargetEliminations } from '../../@generic/utils/get-target-eliminations.util';
import { getUniqueCells } from '../../@generic/utils/get-unique-cells.util';
import { isCellOnChainPath } from '../../@generic/utils/is-cell-on-chain-path.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { XChainNodeInterface } from '../interfaces/x-chain-node.interface';
import type { XChainScanStateInterface } from '../interfaces/x-chain-scan-state.interface';
import type { XChainSearchInterface } from '../interfaces/x-chain-search.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const getNodeKey = (cell: CellInterface, requiresStrongLink: boolean): string =>
    `${CandidateContext.getCellKey(cell)}:${String(requiresStrongLink)}`;

const hasTargetResults = (scan: XChainScanStateInterface): boolean => isDefined(scan.target) && scan.results.length > scan.resultsAtStart;

export class XChainTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.XChain;

    find(context: CandidateContext, searchTarget?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const scope = getSearchScope(context, searchTarget);

        return collectChainResults(scope, (eliminationValue, results) => {
            const target = scope.directTarget;
            const scan = {
                context,
                strongNeighborsByCellKey: this.getStrongNeighborsByCellKey(context, eliminationValue),
                value: eliminationValue,
                results,
                target,
                linkVisits: 0,
                resultsAtStart: results.length
            };

            this.collectResults(this.getRoots(context, eliminationValue, target), scan);
        });
    }

    private getRoots(context: CandidateContext, value: number, target?: TechniqueSearchTargetInterface): CellInterface[] {
        return context
            .getBlankCells()
            .filter(cell => context.getCandidates(cell).includes(value))
            .filter(cell => !target || (!isSameCell(cell, target.cell) && getTargetEliminations(context, cell, target, value).length > 0))
            .sort(compareCells);
    }

    private collectResults(roots: CellInterface[], scan: XChainScanStateInterface): void {
        for (const root of roots) {
            scan.linkVisits = 0;
            scan.resultsAtStart = scan.results.length;

            this.searchShortestChains(scan, root);

            if (hasTargetResults(scan)) {
                return;
            }

            const canonicalResults = getCanonicalTechniqueResults(scan.results);

            scan.results.splice(0, scan.results.length, ...canonicalResults);
        }
    }

    private searchShortestChains(scan: XChainScanStateInterface, root: CellInterface): void {
        const search: XChainSearchInterface = {
            nodes: [{ cell: root, parentIndex: CHAIN_SEARCH_ROOT_PARENT_INDEX, pathLength: 1, requiresStrongLink: true }],
            visitedKeys: new Set([getNodeKey(root, true)])
        };
        let nodeIndex = 0;

        while (nodeIndex < search.nodes.length && scan.linkVisits < X_CHAIN_MAX_VISITS_PER_ROOT) {
            this.expandNode(scan, search, nodeIndex);

            if (hasTargetResults(scan)) {
                return;
            }

            nodeIndex += 1;
        }

        if (scan.linkVisits >= X_CHAIN_MAX_VISITS_PER_ROOT) {
            markContextSearchCapped(scan.context);
        }
    }

    private expandNode(scan: XChainScanStateInterface, search: XChainSearchInterface, nodeIndex: number): void {
        const node = search.nodes[nodeIndex];

        for (const neighbor of this.getNeighbors(scan, node)) {
            if (!hasTargetResults(scan) && scan.linkVisits < X_CHAIN_MAX_VISITS_PER_ROOT) {
                this.visitNeighbor(scan, search, nodeIndex, neighbor);
            }
        }
    }

    private visitNeighbor(scan: XChainScanStateInterface, search: XChainSearchInterface, nodeIndex: number, neighbor: CellInterface): void {
        const node = search.nodes[nodeIndex];
        const nextRequiresStrongLink = !node.requiresStrongLink;
        const neighborKey = getNodeKey(neighbor, nextRequiresStrongLink);

        if (!search.visitedKeys.has(neighborKey) && !isCellOnChainPath(search.nodes, nodeIndex, neighbor)) {
            scan.linkVisits += 1;
            search.visitedKeys.add(neighborKey);
            search.nodes.push({
                cell: neighbor,
                parentIndex: nodeIndex,
                pathLength: node.pathLength + 1,
                requiresStrongLink: nextRequiresStrongLink
            });
            this.addEndpointResults(scan, search, search.nodes.length - 1);
        }
    }

    private addEndpointResults(scan: XChainScanStateInterface, search: XChainSearchInterface, nodeIndex: number): void {
        const node = search.nodes[nodeIndex];

        if (node.requiresStrongLink || node.pathLength < X_CHAIN_MIN_CELLS) {
            return;
        }

        const path = getChainSearchPath(search.nodes, nodeIndex);
        const eliminations = getChainEndpointEliminations(scan.context, path, scan.value, scan.target);

        scan.results.push(...createEliminationResults(this.technique, eliminations, path, path.length));
    }

    private getNeighbors(scan: XChainScanStateInterface, node: XChainNodeInterface): CellInterface[] {
        if (node.requiresStrongLink) {
            return scan.strongNeighborsByCellKey[CandidateContext.getCellKey(node.cell)] ?? [];
        }

        return scan.context
            .getPeers(node.cell)
            .filter(cell => scan.context.getCandidates(cell).includes(scan.value))
            .sort(compareCells);
    }

    private getStrongNeighborsByCellKey(context: CandidateContext, value: number): Record<string, CellInterface[]> {
        const neighborsByCellKey: Record<string, CellInterface[]> = {};

        for (const unit of context.getUnits()) {
            const cells = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
            const [firstCell, secondCell] = cells;

            if (cells.length === 2 && isDefined(firstCell) && isDefined(secondCell)) {
                this.addStrongNeighbor(neighborsByCellKey, firstCell, secondCell);
                this.addStrongNeighbor(neighborsByCellKey, secondCell, firstCell);
            }
        }

        return neighborsByCellKey;
    }

    private addStrongNeighbor(neighborsByCellKey: Record<string, CellInterface[]>, cell: CellInterface, neighbor: CellInterface): void {
        const cellKey = CandidateContext.getCellKey(cell);

        neighborsByCellKey[cellKey] = getUniqueCells([...(neighborsByCellKey[cellKey] ?? []), neighbor]).sort(compareCells);
    }
}
