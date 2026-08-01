export const countMaskBits = (mask: number): number => {
    let remaining = mask;
    let bits = 0;

    while (remaining !== 0) {
        // eslint-disable-next-line no-bitwise -- Brian Kernighan's bit-count algorithm clears the lowest set bit each iteration
        remaining &= remaining - 1;
        bits += 1;
    }

    return bits;
};
