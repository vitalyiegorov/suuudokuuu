// eslint-disable-next-line no-bitwise -- converts a 1-9 candidate value into its single-bit mask representation
export const getValueBit = (value: number): number => 1 << (value - 1);
