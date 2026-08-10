import { getValueBit } from './get-value-bit.util';

export const getEliminatedMask = (baseMask: number, remainingMask: number, placedValue: number): number => {
    const placedBit = placedValue > 0 ? getValueBit(placedValue) : 0;

    // eslint-disable-next-line no-bitwise -- keeps the snapshot candidates that are neither still open nor the placed value
    return baseMask & ~remainingMask & ~placedBit;
};
