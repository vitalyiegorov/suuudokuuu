import { describe, expect, it, jest } from '@jest/globals';

import { MaximumChecksumsByteLength } from './beta-release.constant';
import { readBoundedResponseText } from './read-bounded-response-text.util';

const ChecksumLength = 64;
const IpaChecksum = 'a'.repeat(ChecksumLength);
const ApkChecksum = 'b'.repeat(ChecksumLength);
const ValidChecksums = `${IpaChecksum}  suuudokuuu-development.ipa\n${ApkChecksum}  suuudokuuu-development.apk\n`;
const InvalidUtf8LeadingByte = 195;

describe('readBoundedResponseText', () => {
    it('reads a valid chunked UTF-8 body without Content-Length', async () => {
        const lineBreakIndex = ValidChecksums.indexOf('\n') + 1;
        const textEncoder = new TextEncoder();
        const chunks = [
            textEncoder.encode(ValidChecksums.slice(0, lineBreakIndex)),
            textEncoder.encode(ValidChecksums.slice(lineBreakIndex))
        ];
        let chunkIndex = 0;
        const headers = new Headers();
        const response = {
            body: {
                getReader: () => ({
                    cancel: async () => undefined,
                    read: async () => {
                        const value = chunks.at(chunkIndex) ?? null;
                        chunkIndex += 1;

                        return value === null ? { done: true } : { done: false, value };
                    },
                    releaseLock: jest.fn<() => void>()
                })
            },
            headers
        };

        await expect(readBoundedResponseText(response, MaximumChecksumsByteLength, new AbortController().signal)).resolves.toBe(
            ValidChecksums
        );
        expect(headers.has('Content-Length')).toBe(false);
    });

    it('cancels immediately after a chunk exceeds the byte limit', async () => {
        const cancel = jest.fn<() => Promise<void>>().mockResolvedValue();
        const textEncoder = new TextEncoder();
        const chunks = [textEncoder.encode('a'.repeat(MaximumChecksumsByteLength)), textEncoder.encode('b'), textEncoder.encode('unread')];
        let pulledChunkCount = 0;
        const response = {
            body: {
                getReader: () => ({
                    cancel,
                    read: async () => {
                        const value = chunks.at(pulledChunkCount) ?? null;
                        pulledChunkCount += 1;

                        return value === null ? { done: true } : { done: false, value };
                    },
                    releaseLock: jest.fn<() => void>()
                })
            },
            headers: new Headers()
        };

        await expect(readBoundedResponseText(response, MaximumChecksumsByteLength, new AbortController().signal)).resolves.toBeNull();
        expect(cancel).toHaveBeenCalledTimes(1);
        expect(pulledChunkCount).toBe(2);
    });

    it('rejects invalid UTF-8 and cancels the stream', async () => {
        const cancel = jest.fn<() => Promise<void>>().mockResolvedValue();
        const response = {
            body: {
                getReader: () => ({
                    cancel,
                    read: async () => ({ done: false, value: new Uint8Array([InvalidUtf8LeadingByte, 40]) }),
                    releaseLock: jest.fn<() => void>()
                })
            },
            headers: new Headers()
        };

        await expect(readBoundedResponseText(response, MaximumChecksumsByteLength, new AbortController().signal)).resolves.toBeNull();
        expect(cancel).toHaveBeenCalledTimes(1);
    });

    it('rejects an absent or failed response body', async () => {
        const absentBodyResponse = { body: null, headers: new Headers() };
        const failedResponse = {
            body: {
                getReader: () => ({
                    cancel: async () => undefined,
                    read: () => Promise.reject(new Error('read failure')),
                    releaseLock: jest.fn<() => void>()
                })
            },
            headers: new Headers()
        };

        await expect(
            readBoundedResponseText(absentBodyResponse, MaximumChecksumsByteLength, new AbortController().signal)
        ).resolves.toBeNull();
        await expect(readBoundedResponseText(failedResponse, MaximumChecksumsByteLength, new AbortController().signal)).resolves.toBeNull();
    });
});
