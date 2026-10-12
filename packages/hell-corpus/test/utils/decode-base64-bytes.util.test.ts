import { describe, expect, it } from 'vitest';

import { decodeBase64Bytes } from '../../src/utils/decode-base64-bytes.util';

const RECORD_BYTE_LENGTH = 21;
const WIDE_SAMPLE_BYTE_LENGTH = 252;

describe('decodeBase64Bytes', () => {
    it('rejects invalid characters in every group position', () => {
        for (const encoded of ['!AAA', 'A!AA', 'AA!A', 'AAA!', 'AAAAAA!A']) {
            expect(() => decodeBase64Bytes(encoded)).toThrow('Invalid corpus base64');
        }
    });

    it('rejects incomplete base64 groups', () => {
        expect(() => decodeBase64Bytes('AAA')).toThrow('Invalid corpus base64');
    });
    it('decodes an empty string to an empty byte array', () => {
        expect(decodeBase64Bytes('')).toEqual(new Uint8Array(0));
    });

    it('agrees with a reference base64 decoder for a full corpus record length', () => {
        const bytes = Uint8Array.from({ length: RECORD_BYTE_LENGTH }, (_, index) => index);

        expect(decodeBase64Bytes('AAECAwQFBgcICQoLDA0ODxAREhMU')).toEqual(bytes);
    });

    it('agrees with a reference base64 decoder across a wide range of byte values', () => {
        const bytes = Uint8Array.from({ length: WIDE_SAMPLE_BYTE_LENGTH }, (_, index) => index);

        expect(
            decodeBase64Bytes(
                'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7'
            )
        ).toEqual(bytes);
    });
});
