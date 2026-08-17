import type { ChainSearchNodeInterface } from '../../@generic/interfaces/chain-search-node.interface';

export interface XChainNodeInterface extends ChainSearchNodeInterface {
    readonly requiresStrongLink: boolean;
}
