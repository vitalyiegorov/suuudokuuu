import type { XChainNodeInterface } from './x-chain-node.interface';

export interface XChainSearchInterface {
    readonly nodes: XChainNodeInterface[];
    readonly visitedKeys: Set<string>;
}
