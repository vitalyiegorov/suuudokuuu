export type SeededRandomType = () => number;

/* eslint-disable no-bitwise, @typescript-eslint/no-magic-numbers -- mulberry32 PRNG requires 32-bit bit-mixing operations and its defining constants */
export const createSeededRandom = (seed: number): SeededRandomType => {
    let state = seed >>> 0;

    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let mixed = state;
        mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
        mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);

        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
};
/* eslint-enable no-bitwise, @typescript-eslint/no-magic-numbers */
