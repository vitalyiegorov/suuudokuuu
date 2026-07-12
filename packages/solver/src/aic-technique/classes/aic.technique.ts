import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';

import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../@generic/interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const AIC_MAX_LINK_VISITS = 100_000;
const AIC_MIN_NODES = 4;

interface CandidateNodeInterface {
    cell: CellInterface;
    key: string;
    value: number;
}

interface CandidateLinkGraphInterface {
    nodesByKey: Map<string, CandidateNodeInterface>;
    strongNeighborsByKey: Map<string, Set<string>>;
    weakNeighborsByKey: Map<string, Set<string>>;
}

interface AICScanInterface {
    context: CandidateContext;
    graph: CandidateLinkGraphInterface;
    resultKeys: Set<string>;
    results: TechniqueResultInterface[];
}

export class AICTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.AIC;

    private linkVisits = 0;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const graph = this.createGraph(context);
        const results: TechniqueResultInterface[] = [];
        const resultKeys = new Set<string>();
        const scan = { context, graph, results, resultKeys };

        this.linkVisits = 0;

        for (const startNode of graph.nodesByKey.values()) {
            this.collectResults(scan, [startNode], true);

            if (this.linkVisits >= AIC_MAX_LINK_VISITS) {
                break;
            }
        }

        return results;
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

        if (!isDefined(currentNode) || this.linkVisits >= AIC_MAX_LINK_VISITS) {
            return;
        }

        const neighborKeys = requiresStrongLink
            ? scan.graph.strongNeighborsByKey.get(currentNode.key)
            : scan.graph.weakNeighborsByKey.get(currentNode.key);

        for (const neighborKey of neighborKeys ?? []) {
            if (this.linkVisits >= AIC_MAX_LINK_VISITS) {
                return;
            }

            this.linkVisits += 1;
            this.visitNeighbor(scan, path, requiresStrongLink, neighborKey);
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

        const firstWeakNeighbors = scan.graph.weakNeighborsByKey.get(firstNode.key) ?? new Set<string>();
        const lastWeakNeighbors = scan.graph.weakNeighborsByKey.get(lastNode.key) ?? new Set<string>();
        const pathKeys = new Set(path.map(node => node.key));
        const eliminationNodes = [...firstWeakNeighbors]
            .filter(key => lastWeakNeighbors.has(key) && !pathKeys.has(key))
            .map(key => scan.graph.nodesByKey.get(key))
            .filter(isDefined);
        const eliminations = eliminationNodes.map(node => ({ cell: node.cell, value: node.value }));
        const resultKey = this.getResultKey(path, eliminations);

        if (eliminations.length > 0 && !scan.resultKeys.has(resultKey)) {
            scan.resultKeys.add(resultKey);
            scan.results.push(
                ...createEliminationResults(
                    scan.context,
                    this.technique,
                    eliminations,
                    path.map(node => node.cell)
                )
            );
        }
    }

    private getResultKey(path: CandidateNodeInterface[], eliminations: CandidateEliminationInterface[]): string {
        const pathKey = path.map(node => node.key).join('>');
        const eliminationKey = eliminations.map(elimination => this.getNodeKey(elimination.cell, elimination.value)).join(',');

        return `${pathKey}:${eliminationKey}`;
    }

    private getNodeKey(cell: CellInterface, value: number): string {
        return `${CandidateContext.getCellKey(cell)}:${value}`;
    }
}
