import { BASE64URL_ALPHABET, BASE64URL_CHAR_BITS, BYTE_BITS } from '../constants/base64url.constant';

const BASE64URL_CHAR_BASE = 2 ** BASE64URL_CHAR_BITS;

export const base64urlToBytes = (input: string): Uint8Array => {
    const bytes: number[] = [];
    let accumulator = 0;
    let bitCount = 0;

    for (const char of input) {
        const value = BASE64URL_ALPHABET.indexOf(char);
        if (value === -1) {
            throw new Error('Invalid base64url character');
        }

        accumulator = accumulator * BASE64URL_CHAR_BASE + value;
        bitCount += BASE64URL_CHAR_BITS;

        if (bitCount >= BYTE_BITS) {
            const divisor = 2 ** (bitCount - BYTE_BITS);
            bytes.push(Math.floor(accumulator / divisor));
            accumulator %= divisor;
            bitCount -= BYTE_BITS;
        }
    }

    return new Uint8Array(bytes);
};
