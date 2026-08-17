import type { XYChainNodeInterface } from './xy-chain-node.interface';

export interface XYChainSearchInterface {
    readonly nodes: XYChainNodeInterface[];
    readonly visitedKeys: Set<string>;
}
