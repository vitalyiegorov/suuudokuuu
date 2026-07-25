import { BASE64URL_ALPHABET, BASE64URL_CHAR_BITS, BYTE_BASE, BYTE_BITS } from '../constants/base64url.constant';

export const bytesToBase64url = (bytes: Uint8Array): string => {
    let result = '';
    let accumulator = 0;
    let bitCount = 0;

    for (const byte of bytes) {
        accumulator = accumulator * BYTE_BASE + byte;
        bitCount += BYTE_BITS;

        while (bitCount >= BASE64URL_CHAR_BITS) {
            const divisor = 2 ** (bitCount - BASE64URL_CHAR_BITS);
            result += BASE64URL_ALPHABET.charAt(Math.floor(accumulator / divisor));
            accumulator %= divisor;
            bitCount -= BASE64URL_CHAR_BITS;
        }
    }

    if (bitCount > 0) {
        result += BASE64URL_ALPHABET.charAt(accumulator * 2 ** (BASE64URL_CHAR_BITS - bitCount));
    }

    return result;
};
