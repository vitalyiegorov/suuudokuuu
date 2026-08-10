import { FORCING_CHAIN_MAX_HYPOTHESES_PER_SCAN } from '../constants/forcing-chain-scan.constant';

import type { ForcingChainScanInterface } from '../interfaces/forcing-chain-scan.interface';

export const hasForcingChainScanBudget = (scan: ForcingChainScanInterface, hypothesisCount: number): boolean =>
    scan.propagationKeys.size + hypothesisCount <= FORCING_CHAIN_MAX_HYPOTHESES_PER_SCAN;
