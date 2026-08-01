import { BASE64_ALPHABET } from '../constants/base64-alphabet.constant';

const BASE64_GROUP_CHAR_COUNT = 4;
const BASE64_GROUP_BYTE_COUNT = 3;
const LOW_NIBBLE_MASK = 0xf;

export const decodeBase64Bytes = (base64: string): Uint8Array => {
    const groupCount = base64.length / BASE64_GROUP_CHAR_COUNT;
    const bytes = new Uint8Array(groupCount * BASE64_GROUP_BYTE_COUNT);

    for (let group = 0; group < groupCount; group += 1) {
        const charOffset = group * BASE64_GROUP_CHAR_COUNT;
        const first = BASE64_ALPHABET.indexOf(base64.charAt(charOffset));
        const second = BASE64_ALPHABET.indexOf(base64.charAt(charOffset + 1));
        const third = BASE64_ALPHABET.indexOf(base64.charAt(charOffset + 2));
        const fourth = BASE64_ALPHABET.indexOf(base64.charAt(charOffset + 3));

        const byteOffset = group * BASE64_GROUP_BYTE_COUNT;

        /* eslint-disable no-bitwise -- base64 decode reassembles three bytes from four packed 6-bit values */
        bytes[byteOffset] = (first << 2) | (second >> 4);
        bytes[byteOffset + 1] = ((second & LOW_NIBBLE_MASK) << 4) | (third >> 2);
        bytes[byteOffset + 2] = ((third & 0x3) << 6) | fourth;
        /* eslint-enable no-bitwise */
    }

    return bytes;
};
