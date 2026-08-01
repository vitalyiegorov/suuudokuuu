import { describe, expect, it } from '@jest/globals';

import { decodeBase64Bytes } from './decode-base64-bytes.util';

const RECORD_BYTE_LENGTH = 21;
const WIDE_SAMPLE_BYTE_LENGTH = 252;

const encodeWithNodeBuffer = (bytes: Uint8Array): string => Buffer.from(bytes).toString('base64');

describe('decodeBase64Bytes', () => {
    it('decodes an empty string to an empty byte array', () => {
        expect(decodeBase64Bytes('')).toEqual(new Uint8Array(0));
    });

    it('agrees with a reference base64 decoder for a full corpus record length', () => {
        const bytes = Uint8Array.from({ length: RECORD_BYTE_LENGTH }, (_, index) => index);

        expect(decodeBase64Bytes(encodeWithNodeBuffer(bytes))).toEqual(bytes);
    });

    it('agrees with a reference base64 decoder across a wide range of byte values', () => {
        const bytes = Uint8Array.from({ length: WIDE_SAMPLE_BYTE_LENGTH }, (_, index) => index);

        expect(decodeBase64Bytes(encodeWithNodeBuffer(bytes))).toEqual(bytes);
    });
});
