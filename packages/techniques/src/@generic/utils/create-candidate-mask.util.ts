import { getValueBit } from './get-value-bit.util';

export const createCandidateMask = (candidates: readonly number[]): number =>
    // eslint-disable-next-line no-bitwise -- folds a candidate list into the cell's bitmask
    candidates.reduce((mask, candidate) => mask | getValueBit(candidate), 0);
