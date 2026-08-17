import { getPropagationKey } from './get-propagation-key.util';

import type { ForcingChainScanInterface } from '../interfaces/forcing-chain-scan.interface';
import type { HypothesisPropagationInterface } from '../interfaces/hypothesis-propagation.interface';

export const propagateForScan = (scan: ForcingChainScanInterface, cellIndex: number, value: number): HypothesisPropagationInterface => {
    scan.propagationKeys.add(getPropagationKey(scan.propagator.getBoard(), cellIndex, value));

    return scan.propagator.propagate(cellIndex, value);
};
