import { getValueBit } from './get-value-bit.util';

// eslint-disable-next-line no-bitwise -- clears one candidate bit from a cell's bitmask
export const removeMaskValue = (mask: number, value: number): number => mask & ~getValueBit(value);
