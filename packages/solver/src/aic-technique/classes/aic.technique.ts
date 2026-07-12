import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCanonicalTechniqueResults } from '../../@generic/utils/get-canonical-technique-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { getUniqueCells } from '../../@generic/utils/get-unique-cells.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';
import { AIC_MAX_LINK_VISITS, AIC_MIN_NODES } from '../constants/aic.constant';

import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../@generic/interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { AICScanInterface } from '../interfaces/aic-scan.interface';
import type { CandidateLinkGraphInterface } from '../interfaces/candidate-link-graph.interface';
import type { CandidateNodeInterface } from '../interfaces/candidate-node.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class AICTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.AIC;

    find(context: CandidateContext, target?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const graph = this.createGraph(context);
        const results: TechniqueResultInterface[] = [];
        const startNodes = this.getStartNodes(graph, target);

        if (target) {
            return this.findTargetResults(graph, results, startNodes, target);
        }

        return this.findBroadResults(graph, results, startNodes);
    }

    private findTargetResults(
        graph: CandidateLinkGraphInterface,
        results: TechniqueResultInterface[],
        startNodes: CandidateNodeInterface[],
        target: TechniqueSearchTargetInterface
    ): TechniqueResultInterface[] {
        for (const startNode of startNodes) {
            const scan: AICScanInterface = { graph, results, target, linkVisits: 0, hasTargetResult: false };

            this.collectResults(scan, [startNode], true);

            if (scan.hasTargetResult) {
                return results;
            }
        }

        return results;
    }

    private findBroadResults(
        graph: CandidateLinkGraphInterface,
        results: TechniqueResultInterface[],
        startNodes: CandidateNodeInterface[]
    ): TechniqueResultInterface[] {
        const scan: AICScanInterface = { graph, results, linkVisits: 0, hasTargetResult: false };

        for (const startNode of startNodes) {
            this.collectResults(scan, [startNode], true);

            if (scan.linkVisits >= AIC_MAX_LINK_VISITS) {
                break;
            }
        }

        return getCanonicalTechniqueResults(results);
    }

    private getStartNodes(graph: CandidateLinkGraphInterface, target?: TechniqueSearchTargetInterface): CandidateNodeInterface[] {
        if (!target) {
            return [...graph.nodesByKey.values()].sort((firstNode, secondNode) => firstNode.key.localeCompare(secondNode.key));
        }

        const startNodesByKey = new Map<string, CandidateNodeInterface>();

        for (const targetNode of graph.nodesByKey.values()) {
            if (isSameCell(targetNode.cell, target.cell) && targetNode.value !== target.value) {
                const neighborKeys = graph.weakNeighborsByKey.get(targetNode.key) ?? new Set<string>();

                for (const neighborKey of neighborKeys) {
                    const neighborNode = graph.nodesByKey.get(neighborKey);

                    if (isDefined(neighborNode)) {
                        startNodesByKey.set(neighborNode.key, neighborNode);
                    }
                }
            }
        }

        return [...startNodesByKey.values()].sort((firstNode, secondNode) => firstNode.key.localeCompare(secondNode.key));
    }

    private createGraph(context: CandidateContext): CandidateLinkGraphInterface {
        const graph: CandidateLinkGraphInterface = {
            nodesByKey: new Map<string, CandidateNodeInterface>(),
            strongNeighborsByKey: new Map<string, Set<string>>(),
            weakNeighborsByKey: new Map<string, Set<string>>()
        };

        this.addCellLinks(context, graph);
        this.addUnitLinks(context, graph);

        return graph;
    }

    private addCellLinks(context: CandidateContext, graph: CandidateLinkGraphInterface): void {
        for (const cell of context.getBlankCells()) {
            const cellNodes = context.getCandidates(cell).map(value => this.getOrCreateNode(graph, cell, value));

            for (const [firstNode, secondNode] of getCombinations(cellNodes, 2)) {
                if (isDefined(firstNode) && isDefined(secondNode)) {
                    this.addLink(graph.weakNeighborsByKey, firstNode, secondNode);
                }
            }

            const [firstNode, secondNode] = cellNodes;

            if (cellNodes.length === 2 && isDefined(firstNode) && isDefined(secondNode)) {
                this.addLink(graph.strongNeighborsByKey, firstNode, secondNode);
            }
        }
    }

    private addUnitLinks(context: CandidateContext, graph: CandidateLinkGraphInterface): void {
        for (const value of context.getValues()) {
            for (const unit of context.getUnits()) {
                this.addUnitValueLinks(context, graph, unit, value);
            }
        }
    }

    private addUnitValueLinks(
        context: CandidateContext,
        graph: CandidateLinkGraphInterface,
        unit: CandidateUnitInterface,
        value: number
    ): void {
        const unitNodes = unit.cells
            .filter(cell => context.getCandidates(cell).includes(value))
            .map(cell => this.getOrCreateNode(graph, cell, value));

        for (const [firstNode, secondNode] of getCombinations(unitNodes, 2)) {
            if (isDefined(firstNode) && isDefined(secondNode)) {
                this.addLink(graph.weakNeighborsByKey, firstNode, secondNode);
            }
        }

        const [firstNode, secondNode] = unitNodes;

        if (unitNodes.length === 2 && isDefined(firstNode) && isDefined(secondNode)) {
            this.addLink(graph.strongNeighborsByKey, firstNode, secondNode);
        }
    }

    private getOrCreateNode(graph: CandidateLinkGraphInterface, cell: CellInterface, value: number): CandidateNodeInterface {
        const key = this.getNodeKey(cell, value);
        const existingNode = graph.nodesByKey.get(key);

        if (isDefined(existingNode)) {
            return existingNode;
        }

        const node = { cell, key, value };

        graph.nodesByKey.set(key, node);

        return node;
    }

    private addLink(neighborsByKey: Map<string, Set<string>>, firstNode: CandidateNodeInterface, secondNode: CandidateNodeInterface): void {
        const firstNeighbors = neighborsByKey.get(firstNode.key) ?? new Set<string>();
        const secondNeighbors = neighborsByKey.get(secondNode.key) ?? new Set<string>();

        firstNeighbors.add(secondNode.key);
        secondNeighbors.add(firstNode.key);
        neighborsByKey.set(firstNode.key, firstNeighbors);
        neighborsByKey.set(secondNode.key, secondNeighbors);
    }

    private collectResults(scan: AICScanInterface, path: CandidateNodeInterface[], requiresStrongLink: boolean): void {
        const currentNode = path[path.length - 1];

        if (!isDefined(currentNode) || scan.hasTargetResult || scan.linkVisits >= AIC_MAX_LINK_VISITS) {
            return;
        }

        const neighborKeys = requiresStrongLink
            ? scan.graph.strongNeighborsByKey.get(currentNode.key)
            : scan.graph.weakNeighborsByKey.get(currentNode.key);

        for (const neighborKey of [...(neighborKeys ?? [])].sort()) {
            if (scan.linkVisits >= AIC_MAX_LINK_VISITS) {
                return;
            }

            scan.linkVisits += 1;
            this.visitNeighbor(scan, path, requiresStrongLink, neighborKey);

            if (scan.target && scan.results.length > 0) {
                return;
            }
        }
    }

    private visitNeighbor(scan: AICScanInterface, path: CandidateNodeInterface[], requiresStrongLink: boolean, neighborKey: string): void {
        if (path.some(node => node.key === neighborKey)) {
            return;
        }

        const neighborNode = scan.graph.nodesByKey.get(neighborKey);

        if (!isDefined(neighborNode)) {
            return;
        }

        const nextPath = [...path, neighborNode];

        if (requiresStrongLink && nextPath.length >= AIC_MIN_NODES) {
            this.addEndpointResults(scan, nextPath);
        }

        this.collectResults(scan, nextPath, !requiresStrongLink);
    }

    private addEndpointResults(scan: AICScanInterface, path: CandidateNodeInterface[]): void {
        const [firstNode] = path;
        const lastNode = path[path.length - 1];

        if (!isDefined(firstNode) || !isDefined(lastNode)) {
            return;
        }

        const eliminations = this.getEndpointEliminations(scan.graph, path, firstNode, lastNode);
        const { target } = scan;
        const targetsMove = !target || this.doesJustifyTargetValue(scan.graph, eliminations, target);

        if (eliminations.length > 0 && targetsMove) {
            scan.results.push(...createEliminationResults(this.technique, eliminations, getUniqueCells(path.map(node => node.cell))));

            if (scan.target) {
                scan.hasTargetResult = true;
            }
        }
    }

    private doesJustifyTargetValue(
        graph: CandidateLinkGraphInterface,
        eliminations: CandidateEliminationInterface[],
        target: TechniqueSearchTargetInterface
    ): boolean {
        const remainingCandidates = [...graph.nodesByKey.values()]
            .filter(node => isSameCell(node.cell, target.cell))
            .filter(
                node => !eliminations.some(elimination => isSameCell(elimination.cell, target.cell) && elimination.value === node.value)
            );

        return remainingCandidates.length === 1 && remainingCandidates[0].value === target.value;
    }

    private getEndpointEliminations(
        graph: CandidateLinkGraphInterface,
        path: CandidateNodeInterface[],
        firstNode: CandidateNodeInterface,
        lastNode: CandidateNodeInterface
    ) {
        const firstWeakNeighbors = graph.weakNeighborsByKey.get(firstNode.key) ?? new Set<string>();
        const lastWeakNeighbors = graph.weakNeighborsByKey.get(lastNode.key) ?? new Set<string>();
        const pathKeys = new Set(path.map(node => node.key));

        return [...firstWeakNeighbors]
            .filter(key => lastWeakNeighbors.has(key) && !pathKeys.has(key))
            .map(key => graph.nodesByKey.get(key))
            .filter(isDefined)
            .map(node => ({ cell: node.cell, value: node.value }));
    }

    private getNodeKey(cell: CellInterface, value: number): string {
        return `${CandidateContext.getCellKey(cell)}:${value}`;
    }
}
