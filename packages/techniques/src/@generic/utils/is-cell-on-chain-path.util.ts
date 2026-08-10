import { CHAIN_SEARCH_ROOT_PARENT_INDEX } from '../constants/chain-scan.constant';

import { isSameCell } from './is-same-cell.util';

import type { ChainSearchNodeInterface } from '../interfaces/chain-search-node.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const isCellOnChainPath = (nodes: ChainSearchNodeInterface[], nodeIndex: number, cell: CellInterface): boolean => {
    let currentIndex = nodeIndex;

    while (currentIndex !== CHAIN_SEARCH_ROOT_PARENT_INDEX) {
        const node = nodes[currentIndex];

        if (isSameCell(node.cell, cell)) {
            return true;
        }

        currentIndex = node.parentIndex;
    }

    return false;
};
