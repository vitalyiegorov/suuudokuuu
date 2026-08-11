import type { ChainSearchNodeInterface } from '../../@generic/interfaces/chain-search-node.interface';

export interface XYChainNodeInterface extends ChainSearchNodeInterface {
    readonly linkValue: number;
}
