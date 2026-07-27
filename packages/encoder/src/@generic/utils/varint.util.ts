import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

const LARGE_FLAG = 1;
const SMALL_FLAG = 0;
const FLAG_BITS = 1;

export const writeVarint = (out: BitOutputStream, value: number, smallBits: number, largeBits: number): void => {
    const smallCapacity = 2 ** smallBits;
    const largeCapacity = 2 ** largeBits;
    const safeValue = Math.min(Math.max(Math.trunc(value), 0), largeCapacity - 1);

    if (safeValue < smallCapacity) {
        out.write(SMALL_FLAG, FLAG_BITS);
        out.write(safeValue, smallBits);

        return;
    }

    out.write(LARGE_FLAG, FLAG_BITS);
    out.write(safeValue, largeBits);
};

export const readVarint = (input: BitInputStream, smallBits: number, largeBits: number): number =>
    input.read(FLAG_BITS) === LARGE_FLAG ? input.read(largeBits) : input.read(smallBits);
