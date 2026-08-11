const INT32_BIT_WIDTH = 32;

export const getSingleMaskValue = (mask: number): number => {
    // eslint-disable-next-line no-bitwise -- a lone candidate leaves exactly one set bit, which clearing the lowest bit detects
    const hasSingleCandidate = mask !== 0 && (mask & (mask - 1)) === 0;

    return hasSingleCandidate ? INT32_BIT_WIDTH - Math.clz32(mask) : 0;
};
