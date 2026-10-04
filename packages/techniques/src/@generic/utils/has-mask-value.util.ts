import { getValueBit } from './get-value-bit.util';

// oxlint-disable-next-line no-bitwise -- tests whether one candidate bit is still set in a cell's bitmask
export const hasMaskValue = (mask: number, value: number): boolean => (mask & getValueBit(value)) !== 0;
