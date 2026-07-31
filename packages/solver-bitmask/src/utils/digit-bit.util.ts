const INT32_BIT_WIDTH = 32;

// eslint-disable-next-line no-bitwise -- converts a 1-9 digit into its single-bit mask representation
export const bitForDigit = (digit: number): number => 1 << (digit - 1);

export const digitForBit = (bit: number): number => INT32_BIT_WIDTH - Math.clz32(bit);
