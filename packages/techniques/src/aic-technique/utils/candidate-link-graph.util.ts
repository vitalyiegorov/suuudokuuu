import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { getCombinations } from '../../@generic/utils/get-combinations.util';

import type { CandidateUnitInterface } from '../../@generic/interfaces/candidate-unit.interface';
import type { CandidateLinkGraphInterface } from '../interfaces/candidate-link-graph.interface';
import type { CandidateNodeInterface } from '../interfaces/candidate-node.interface';
import type { CandidateLinkGraphBuilderType } from '../types/candidate-link-graph-builder.type';
import type { CellInterface } from '@suuudokuuu/generator';

const graphsByContext = new WeakMap<CandidateContext, CandidateLinkGraphInterface>();

const getNodeKey = (cell: CellInterface, value: number): string => `${CandidateContext.getCellKey(cell)}:${value}`;

const getOrCreateNode = (builder: CandidateLinkGraphBuilderType, cell: CellInterface, value: number): CandidateNodeInterface => {
    const key = getNodeKey(cell, value);
    const existingNode = builder.nodesByKey.get(key);

    if (isDefined(existingNode)) {
        return existingNode;
    }

    const node = { cell, index: builder.nodesByKey.size, key, value };

    builder.nodesByKey.set(key, node);

    return node;
};

const addLink = (neighborsByKey: Map<string, Set<string>>, firstNode: CandidateNodeInterface, secondNode: CandidateNodeInterface): void => {
    const firstNeighbors = neighborsByKey.get(firstNode.key) ?? new Set<string>();
    const secondNeighbors = neighborsByKey.get(secondNode.key) ?? new Set<string>();

    firstNeighbors.add(secondNode.key);
    secondNeighbors.add(firstNode.key);
    neighborsByKey.set(firstNode.key, firstNeighbors);
    neighborsByKey.set(secondNode.key, secondNeighbors);
};

const addGroupLinks = (builder: CandidateLinkGraphBuilderType, groupNodes: CandidateNodeInterface[]): void => {
    for (const [firstCombinationNode, secondCombinationNode] of getCombinations(groupNodes, 2)) {
        if (isDefined(firstCombinationNode) && isDefined(secondCombinationNode)) {
            addLink(builder.weakNeighborsByKey, firstCombinationNode, secondCombinationNode);
        }
    }

    const [firstNode, secondNode] = groupNodes;

    if (groupNodes.length === 2 && isDefined(firstNode) && isDefined(secondNode)) {
        addLink(builder.strongNeighborsByKey, firstNode, secondNode);
    }
};

const addCellLinks = (context: CandidateContext, builder: CandidateLinkGraphBuilderType): void => {
    for (const cell of context.getBlankCells()) {
        addGroupLinks(
            builder,
            context.getCandidates(cell).map(value => getOrCreateNode(builder, cell, value))
        );
    }
};

const addUnitValueLinks = (
    context: CandidateContext,
    builder: CandidateLinkGraphBuilderType,
    unit: CandidateUnitInterface,
    value: number
): void => {
    addGroupLinks(
        builder,
        unit.cells.filter(cell => context.getCandidates(cell).includes(value)).map(cell => getOrCreateNode(builder, cell, value))
    );
};

const addUnitLinks = (context: CandidateContext, builder: CandidateLinkGraphBuilderType): void => {
    const values = context.getValues();
    const units = context.getUnits();

    for (const value of values) {
        for (const unit of units) {
            addUnitValueLinks(context, builder, unit, value);
        }
    }
};

const getKeysInSortedOrder = (neighborKeys: Set<string>): string[] => [...neighborKeys].sort();

const getKeysInInsertionOrder = (neighborKeys: Set<string>): string[] => [...neighborKeys];

const getNeighborNodesByIndex = (
    builder: CandidateLinkGraphBuilderType,
    neighborsByKey: Map<string, Set<string>>,
    getOrderedKeys: (neighborKeys: Set<string>) => string[]
): CandidateNodeInterface[][] => {
    const neighborNodesByIndex: CandidateNodeInterface[][] = [];

    for (const node of builder.nodesByKey.values()) {
        neighborNodesByIndex[node.index] = [];
    }

    for (const [nodeKey, neighborKeys] of neighborsByKey) {
        const node = builder.nodesByKey.get(nodeKey);
        const orderedNeighbors = getOrderedKeys(neighborKeys).map(neighborKey => builder.nodesByKey.get(neighborKey));

        if (isDefined(node)) {
            neighborNodesByIndex[node.index] = orderedNeighbors.filter(isDefined);
        }
    }

    return neighborNodesByIndex;
};

const createGraph = (context: CandidateContext): CandidateLinkGraphInterface => {
    const builder: CandidateLinkGraphBuilderType = {
        nodesByKey: new Map<string, CandidateNodeInterface>(),
        strongNeighborsByKey: new Map<string, Set<string>>(),
        weakNeighborsByKey: new Map<string, Set<string>>()
    };

    addCellLinks(context, builder);
    addUnitLinks(context, builder);

    return {
        nodesByKey: builder.nodesByKey,
        weakNeighborNodesByIndex: getNeighborNodesByIndex(builder, builder.weakNeighborsByKey, getKeysInInsertionOrder),
        sortedStrongNeighborsByIndex: getNeighborNodesByIndex(builder, builder.strongNeighborsByKey, getKeysInSortedOrder),
        sortedWeakNeighborsByIndex: getNeighborNodesByIndex(builder, builder.weakNeighborsByKey, getKeysInSortedOrder),
        nodeCount: builder.nodesByKey.size
    };
};

export const getContextCandidateLinkGraph = (context: CandidateContext): CandidateLinkGraphInterface => {
    const cachedGraph = graphsByContext.get(context);

    if (isDefined(cachedGraph)) {
        return cachedGraph;
    }

    const graph = createGraph(context);

    graphsByContext.set(context, graph);

    return graph;
};
