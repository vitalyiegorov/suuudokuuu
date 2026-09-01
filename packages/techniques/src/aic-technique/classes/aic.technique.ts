import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { markContextSearchCapped } from '../../@generic/utils/context-scan-state.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCanonicalTechniqueResults } from '../../@generic/utils/get-canonical-technique-results.util';
import { getSearchScope } from '../../@generic/utils/get-search-scope.util';
import { getUniqueCells } from '../../@generic/utils/get-unique-cells.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';
import { AIC_MAX_LINK_VISITS, AIC_MIN_NODES, EMPTY_TARGET_CELL_NODES } from '../constants/aic.constant';
import { getContextCandidateLinkGraph } from '../utils/candidate-link-graph.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { AICScanInterface } from '../interfaces/aic-scan.interface';
import type { CandidateLinkGraphInterface } from '../interfaces/candidate-link-graph.interface';
import type { CandidateNodeInterface } from '../interfaces/candidate-node.interface';
import type { AICScanBaseType } from '../types/aic-scan-base.type';

export class AICTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.AIC;

    find(context: CandidateContext, searchTarget?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const graph = getContextCandidateLinkGraph(context);
        const { directTarget: target } = getSearchScope(context, searchTarget);
        const startNodes = this.getStartNodes(graph, target);

        if (target) {
            return this.findTargetResults(context, graph, startNodes, target);
        }

        return this.findBroadResults(context, graph, startNodes);
    }

    protected collectResults(scan: AICScanInterface, requiresStrongLink: boolean): void {
        const { path, results } = scan;
        const currentNode = path[path.length - 1];

        if (!isDefined(currentNode) || scan.hasTargetResult || scan.linkVisits >= AIC_MAX_LINK_VISITS) {
            return;
        }

        const neighborNodes = requiresStrongLink
            ? scan.sortedStrongNeighborsByIndex[currentNode.index]
            : scan.sortedWeakNeighborsByIndex[currentNode.index];
        const neighborCount = neighborNodes.length;
        const isTargetScan = isDefined(scan.target);

        for (let neighborPosition = 0; neighborPosition < neighborCount; neighborPosition += 1) {
            if (scan.linkVisits >= AIC_MAX_LINK_VISITS) {
                return;
            }

            scan.linkVisits += 1;
            this.visitNeighbor(scan, requiresStrongLink, neighborNodes[neighborPosition]);

            if (isTargetScan && results.length > 0) {
                return;
            }
        }
    }

    private findTargetResults(
        context: CandidateContext,
        graph: CandidateLinkGraphInterface,
        startNodes: CandidateNodeInterface[],
        target: TechniqueSearchTargetInterface
    ): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const scanBase = this.createScanBase(context, graph, results, target);

        for (const startNode of startNodes) {
            const scan = this.createScan(scanBase, startNode);

            this.collectStartNodeResults(scan);

            if (scan.hasTargetResult) {
                return results;
            }
        }

        return results;
    }

    private findBroadResults(
        context: CandidateContext,
        graph: CandidateLinkGraphInterface,
        startNodes: CandidateNodeInterface[]
    ): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const scanBase = this.createScanBase(context, graph, results);

        for (const startNode of startNodes) {
            const scan = this.createScan(scanBase, startNode);

            this.collectStartNodeResults(scan);
        }

        return getCanonicalTechniqueResults(results);
    }

    private createScanBase(
        context: CandidateContext,
        graph: CandidateLinkGraphInterface,
        results: TechniqueResultInterface[],
        target?: TechniqueSearchTargetInterface
    ): AICScanBaseType {
        const targetCellNodes = isDefined(target) ? this.getTargetCellNodes(graph, target) : EMPTY_TARGET_CELL_NODES;

        return {
            context,
            graph,
            results,
            target,
            targetCellNodes,
            onPathByNodeIndex: new Uint8Array(graph.nodeCount),
            endpointMarksByNodeIndex: new Uint8Array(graph.nodeCount),
            sortedStrongNeighborsByIndex: graph.sortedStrongNeighborsByIndex,
            sortedWeakNeighborsByIndex: graph.sortedWeakNeighborsByIndex
        };
    }

    private createScan(scanBase: AICScanBaseType, startNode: CandidateNodeInterface): AICScanInterface {
        return {
            ...scanBase,
            path: [startNode],
            firstWeakNeighborNodes: scanBase.graph.weakNeighborNodesByIndex[startNode.index],
            linkVisits: 0,
            hasTargetResult: false
        };
    }

    private getTargetCellNodes(
        graph: CandidateLinkGraphInterface,
        target: TechniqueSearchTargetInterface
    ): readonly CandidateNodeInterface[] {
        const targetCellNodes: CandidateNodeInterface[] = [];

        for (const node of graph.nodesByKey.values()) {
            if (isSameCell(node.cell, target.cell)) {
                targetCellNodes.push(node);
            }
        }

        return targetCellNodes;
    }

    private collectStartNodeResults(scan: AICScanInterface): void {
        const [startNode] = scan.path;

        if (!isDefined(startNode)) {
            return;
        }

        scan.onPathByNodeIndex[startNode.index] = 1;
        this.collectResults(scan, true);
        scan.onPathByNodeIndex[startNode.index] = 0;

        if (scan.linkVisits >= AIC_MAX_LINK_VISITS) {
            markContextSearchCapped(scan.context);
        }
    }

    private getStartNodes(graph: CandidateLinkGraphInterface, target?: TechniqueSearchTargetInterface): CandidateNodeInterface[] {
        if (!target) {
            return [...graph.nodesByKey.values()].sort((firstNode, secondNode) => firstNode.key.localeCompare(secondNode.key));
        }

        const startNodesByKey = new Map<string, CandidateNodeInterface>();

        for (const targetNode of graph.nodesByKey.values()) {
            if (isSameCell(targetNode.cell, target.cell) && targetNode.value !== target.value) {
                for (const neighborNode of graph.weakNeighborNodesByIndex[targetNode.index]) {
                    startNodesByKey.set(neighborNode.key, neighborNode);
                }
            }
        }

        return [...startNodesByKey.values()].sort((firstNode, secondNode) => firstNode.key.localeCompare(secondNode.key));
    }

    private visitNeighbor(scan: AICScanInterface, requiresStrongLink: boolean, neighborNode: CandidateNodeInterface): void {
        const { onPathByNodeIndex, path } = scan;
        const neighborNodeIndex = neighborNode.index;

        if (onPathByNodeIndex[neighborNodeIndex] === 1) {
            return;
        }

        path.push(neighborNode);
        onPathByNodeIndex[neighborNodeIndex] = 1;

        if (requiresStrongLink && path.length >= AIC_MIN_NODES) {
            this.addEndpointResults(scan);
        }

        this.collectResults(scan, !requiresStrongLink);

        path.pop();
        onPathByNodeIndex[neighborNodeIndex] = 0;
    }

    private addEndpointResults(scan: AICScanInterface): void {
        const { path } = scan;
        const lastNode = path[path.length - 1];

        if (!isDefined(lastNode)) {
            return;
        }

        const eliminations = this.getEndpointEliminations(scan, lastNode);

        if (eliminations.length === 0) {
            return;
        }

        const { target } = scan;

        if (isDefined(target) && !this.doesJustifyTargetValue(scan, eliminations, target)) {
            return;
        }

        scan.results.push(...createEliminationResults(this.technique, eliminations, getUniqueCells(path.map(node => node.cell))));

        if (isDefined(target)) {
            scan.hasTargetResult = true;
        }
    }

    private doesJustifyTargetValue(
        scan: AICScanInterface,
        eliminations: CandidateEliminationInterface[],
        target: TechniqueSearchTargetInterface
    ): boolean {
        let remainingCount = 0;
        let remainingValue = 0;

        for (const node of scan.targetCellNodes) {
            const isEliminated = eliminations.some(
                elimination => elimination.value === node.value && isSameCell(elimination.cell, target.cell)
            );

            if (!isEliminated) {
                remainingCount += 1;
                remainingValue = node.value;
            }
        }

        return remainingCount === 1 && remainingValue === target.value;
    }

    private getEndpointEliminations(scan: AICScanInterface, lastNode: CandidateNodeInterface): CandidateEliminationInterface[] {
        const { endpointMarksByNodeIndex, firstWeakNeighborNodes, graph, onPathByNodeIndex } = scan;
        const eliminations: CandidateEliminationInterface[] = [];

        if (firstWeakNeighborNodes.length === 0) {
            return eliminations;
        }

        const lastWeakNeighborNodes = graph.weakNeighborNodesByIndex[lastNode.index];

        for (const neighborNode of lastWeakNeighborNodes) {
            endpointMarksByNodeIndex[neighborNode.index] = 1;
        }

        for (const neighborNode of firstWeakNeighborNodes) {
            if (endpointMarksByNodeIndex[neighborNode.index] === 1 && onPathByNodeIndex[neighborNode.index] === 0) {
                eliminations.push({ cell: neighborNode.cell, value: neighborNode.value });
            }
        }

        for (const neighborNode of lastWeakNeighborNodes) {
            endpointMarksByNodeIndex[neighborNode.index] = 0;
        }

        return eliminations;
    }
}
