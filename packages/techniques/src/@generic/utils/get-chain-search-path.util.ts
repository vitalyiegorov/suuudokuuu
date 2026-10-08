import { CHAIN_SEARCH_ROOT_PARENT_INDEX } from '../constants/chain-scan.constant';

import type { ChainSearchNodeInterface } from '../interfaces/chain-search-node.interface';

export const getChainSearchPath = <NodeType extends ChainSearchNodeInterface>(nodes: NodeType[], nodeIndex: number): NodeType[] => {
    const path: NodeType[] = [];
    let currentIndex = nodeIndex;

    while (currentIndex !== CHAIN_SEARCH_ROOT_PARENT_INDEX) {
        const node = nodes[currentIndex];

        path.unshift(node);
        currentIndex = node.parentIndex;
    }

    return path;
};
