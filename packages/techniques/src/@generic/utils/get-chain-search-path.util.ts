import { CHAIN_SEARCH_ROOT_PARENT_INDEX } from '../constants/chain-scan.constant';

import type { ChainSearchNodeInterface } from '../interfaces/chain-search-node.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getChainSearchPath = (nodes: ChainSearchNodeInterface[], nodeIndex: number): CellInterface[] => {
    const path: CellInterface[] = [];
    let currentIndex = nodeIndex;

    while (currentIndex !== CHAIN_SEARCH_ROOT_PARENT_INDEX) {
        const node = nodes[currentIndex];

        path.unshift(node.cell);
        currentIndex = node.parentIndex;
    }

    return path;
};
