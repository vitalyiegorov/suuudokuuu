const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export const encodeBase64Bytes = bytes => {
    let result = '';

    for (let offset = 0; offset < bytes.length; offset += 3) {
        const byte0 = bytes[offset];
        const byte1 = bytes[offset + 1];
        const byte2 = bytes[offset + 2];

        result += BASE64_ALPHABET[byte0 >> 2];
        result += BASE64_ALPHABET[((byte0 & 0x3) << 4) | (byte1 >> 4)];
        result += BASE64_ALPHABET[((byte1 & 0xf) << 2) | (byte2 >> 6)];
        result += BASE64_ALPHABET[byte2 & 0x3f];
    }

    return result;
};
